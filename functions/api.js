const express = require('express');
const serverless = require('serverless-http');
const { firebaseApp } = require('../firebaseconfig');
const { getFirestore, doc, getDoc, collection, query, where, getDocs } = require('firebase/firestore');
const crypto = require('crypto');

const db = getFirestore(firebaseApp);

const app = express();
const router = express.Router();

function hashApiKey(apiKey) {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(403).send('Forbidden: No API Key provided');
  }

  const hashedApiKey = hashApiKey(apiKey);
  const apiKeyRef = doc(db, 'apiKeys', hashedApiKey);
  const apiKeyDoc = await getDoc(apiKeyRef);

  if (apiKeyDoc.exists()) {
    next();
  } else {
    res.status(403).send('Forbidden: Invalid API Key');
  }
};

router.use(apiKeyMiddleware);

router.get('/', (_, res) => {
  res.send('Hello World!');
});

router.get('/v1', (_, res) => {
  res.send('API v1');
});

router.get('/v1/positions', (_, res) => {
  const positions = ['CB', 'QB', 'WR', 'DL', 'EDGE', 'OT', 'RB', 'S', 'LB', 'TE', 'IOL'];
  res.json(positions);
});

router.get('/v1/player', async (req, res) => {
  const { player_name, player_id, college_id, rank_less_than } = req.query;

  if (player_name) {
    const normalizedPlayerName = player_name.replace(/_/g, ' ');
    const playerRef = doc(db, 'playerRankings', normalizedPlayerName);
    const playerDoc = await getDoc(playerRef);
    if (playerDoc.exists()) {
      res.json(playerDoc.data());
    } else {
      res.status(404).send(`Player ${normalizedPlayerName} not found`);
    }
  } else if (player_id) {
    const playersQuery = query(collection(db, 'playerRankings'), where('player_id', '==', parseInt(player_id)));
    const querySnapshot = await getDocs(playersQuery);
    const playerDoc = querySnapshot.docs[0];
    if (playerDoc.exists()) {
      res.json(playerDoc.data());
    } else {
      res.status(404).send(`Player with ID ${player_id} not found`);
    }
  } else if (college_id) {
    const playersQuery = query(collection(db, 'playerRankings'), where('college_id', '==', parseInt(college_id)));
    const querySnapshot = await getDocs(playersQuery);
    const players = querySnapshot.docs.map(doc => doc.data());
    res.json(players);
  } else if (rank_less_than) {
    const playersQuery = query(collection(db, 'playerRankings'), where('average_rank', '<', parseInt(rank_less_than, 10)));
    const querySnapshot = await getDocs(playersQuery);
    const players = querySnapshot.docs.map(doc => doc.data());
    res.json(players);
  } else {
    res.status(400).send('Bad Request: Missing query parameter');
  }
});

app.use('/api', router);

module.exports.handler = serverless(app);