# nflprospectsapi

## Overview
This API provides endpoints to access basic American Football college -> NFL prospect information. API keys can be retrieved (for limited, personal project use only) by contacting 'dbelanger@albany.edu'.
This api is hosted through netlify, and hosted through Google Firebase's free tier, so access is limited. 

## Base URL
```
/https://nflprospectsapi.netlify.app/api/v1/
```

## Authentication
All endpoints require an API key to be provided in the request headers. The API key should be included as follows:
```
x-api-key: YOUR_API_KEY
```

## Endpoints

### GET `/api/v1/version`
Returns a simple message indicating the API version.

#### Response
- `200 OK`: Returns "API Version 1.0"

### GET `/api/v1/positions`
Returns a list of player positions.

#### Response
- `200 OK`: Returns a JSON array of player positions.
  ```json
  ["CB", "QB", "WR", "DL", "EDGE", "OT", "RB", "S", "LB", "TE", "IOL"]
  ```

### GET `/api/v1/player`
Retrieves player information based on query parameters.

#### Query Parameters
- `player_name` (optional): The name of the player (use underscores instead of spaces).
- `player_id` (optional): The ID of the player.
- `college_id` (optional): The ID of the college.
- `rank_within_range` (optional): The rank threshold.

#### Responses
- `200 OK`: Returns player information in JSON format.
- `400 Bad Request`: Missing query parameter.
- `403 Forbidden`: Invalid or missing API key.
- `404 Not Found`: Player not found.

#### Examples
- Get player by name:
  ```
  GET /api/v1/player?player_name=Travis_Hunter
  ```
- Get player by ID:
  ```
  GET /api/v1/player?player_id=1
  ```
- Get players by college ID:
  ```
  GET /api/v1/player?college_id=12
  ```
- Get players with rank less than a specified value:
  ```
  GET /api/v1/player?rank_within_range=10-20
  ```

## Error Handling
- `403 Forbidden`: Returned when the API key is missing or invalid.
- `404 Not Found`: Returned when the requested player is not found.
- `400 Bad Request`: Returned when required query parameters are missing.

## Example Request
```bash
curl -H "x-api-key: YOUR_API_KEY" "/https://nflprospectsapi.netlify.app/api/v1/player?player_name=Travis_Hunter"
```

## Example Response
```json
{
  "player_id": 1,
  "name": "Travis Hunter",
  "position": "CB",
  "college_id": 1,
  "average_rank": 1,
  "rank_list": {1, 1, 1, 1, 0}
}
```

## Notes
- Ensure that the API key is kept secure and not exposed in public repositories.
- Replace `YOUR_API_KEY` with your actual API key in the request headers.
