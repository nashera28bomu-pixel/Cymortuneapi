# 🎵 Cymor Tune API

> **Production-ready Node.js backend powering Cymor Tune** — a modern music streaming platform for Africa and beyond.

[![Node.js](https://img.shields.io/badge/Node.js-22+-green?logo=node.js)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: Render](https://img.shields.io/badge/Deploy-Render-purple)](https://render.com)
[![Provider: JioSaavn](https://img.shields.io/badge/Provider-JioSaavn-orange)](https://saavn.dev)

---

## Architecture

```
Cymor Tune App
      │
      ▼
Cymor Tune API  [Node.js / Express]
      │
      ▼
JioSaavn Provider  [saavn.dev/api]
```

The frontend **never** communicates with JioSaavn directly. The API acts as a provider-agnostic abstraction layer — if JioSaavn is ever replaced, only `src/services/provider.js` and `src/utils/normalizer.js` need updating.

---

## Project Structure

```
cymor-tune-api/
├── src/
│   ├── config/
│   │   ├── env.js              # Env validation — only file that reads process.env
│   │   ├── axios.js            # Shared Axios instance with interceptors & error wrapping
│   │   └── cache.js            # NodeCache wrapper with get/set/remember/buildKey helpers
│   │
│   ├── controllers/
│   │   ├── search.controller.js
│   │   ├── songs.controller.js
│   │   ├── albums.controller.js
│   │   ├── artists.controller.js
│   │   ├── playlists.controller.js
│   │   ├── trending.controller.js
│   │   └── health.controller.js
│   │
│   ├── services/
│   │   ├── provider.js         # ONLY file that talks to JioSaavn upstream
│   │   ├── search.service.js
│   │   ├── songs.service.js
│   │   ├── albums.service.js
│   │   ├── artists.service.js
│   │   ├── playlists.service.js
│   │   └── trending.service.js
│   │
│   ├── routes/
│   │   ├── index.js            # Central route registry
│   │   ├── search.routes.js
│   │   ├── songs.routes.js
│   │   ├── albums.routes.js
│   │   ├── artists.routes.js
│   │   ├── playlists.routes.js
│   │   ├── trending.routes.js
│   │   └── health.routes.js
│   │
│   ├── middleware/
│   │   ├── setup.js            # Helmet, CORS, compression, morgan, rate limiter
│   │   └── errorHandler.js     # 404 handler + global error middleware
│   │
│   ├── utils/
│   │   ├── errors.js           # ApiError, ValidationError, NotFoundError, ProviderError, TimeoutError
│   │   ├── logger.js           # Structured logger respecting LOG_LEVEL
│   │   ├── normalizer.js       # Transforms raw JioSaavn data into Cymor Tune format
│   │   └── response.js         # Centralized success/error response helpers
│   │
│   ├── app.js                  # Express app factory
│   └── server.js               # HTTP server + graceful shutdown
│
├── .env.example                # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 22+ |
| npm | 10+ |

No Python. No Redis. No database. No Docker. Pure Node.js — deploys anywhere in under 2 minutes.

---

## Installation

### 1. Clone or extract the project

```bash
cd cymor-tune-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env if needed — all values have sensible defaults
```

### 4. Start the server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | HTTP server port |
| `NODE_ENV` | `development` | `development` or `production` |
| `JIOSAAVN_BASE_URL` | `https://saavn.dev/api` | JioSaavn provider base URL |
| `PROVIDER_TIMEOUT` | `15000` | Provider request timeout (ms) |
| `CACHE_TTL` | `600` | Cache TTL in seconds (10 min) |
| `CACHE_MAX_KEYS` | `1000` | Max in-memory cache keys |
| `RATE_LIMIT_MAX` | `120` | Max requests per window per IP |
| `RATE_LIMIT_WINDOW` | `15` | Rate limit window in minutes |
| `ALLOWED_ORIGINS` | `*` | CORS origins (`*` or comma-separated list) |
| `API_VERSION` | `v1` | API version prefix |
| `API_NAME` | `Cymor Tune API` | Display name |
| `LOG_LEVEL` | `debug` | `debug` / `info` / `warn` / `error` |

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### 🔍 Search

| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| GET | `/search` | `q`, `page`, `limit` | Search everything (songs + albums + artists + playlists) |
| GET | `/search/songs` | `q`, `page`, `limit` | Search songs only |
| GET | `/search/albums` | `q`, `page`, `limit` | Search albums only |
| GET | `/search/artists` | `q`, `page`, `limit` | Search artists only |
| GET | `/search/playlists` | `q`, `page`, `limit` | Search playlists only |

### 🎵 Songs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/songs/:id` | Song details + stream URL + download URL |
| GET | `/songs/:id/lyrics` | Song lyrics |
| GET | `/songs/:id/suggestions` | Related song suggestions |

### 💿 Albums

| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| GET | `/albums/:id` | — | Album details + all songs |
| GET | `/albums` | `link` | Album by JioSaavn link |

### 🎤 Artists

| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| GET | `/artists/:id` | — | Artist details + top songs + top albums |
| GET | `/artists/:id/songs` | `page`, `sortBy`, `sortOrder` | Artist's songs |
| GET | `/artists/:id/albums` | `page` | Artist's albums |

### 📋 Playlists

| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| GET | `/playlists/:id` | `page`, `limit` | Playlist details + songs |
| GET | `/playlists` | `link`, `page`, `limit` | Playlist by JioSaavn link |

### 🔥 Trending

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/trending` | Top charts + English hits + new releases |
| GET | `/trending/charts` | Top Hindi charts |
| GET | `/trending/new-releases` | Latest releases |

### ❤️ Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Fast health check (no external calls) |
| GET | `/status` | Deep status with cache stats |

---

## Response Format

### ✅ Success

```json
{
  "success": true,
  "message": "Song fetched",
  "data": {
    "id": "5WXAlMNt",
    "title": "Blinding Lights",
    "duration": 200,
    "image": "https://...",
    "stream_url": "https://aac.saavncdn.com/...",
    "download_url": "https://aac.saavncdn.com/...",
    "artists": {
      "primary": [{ "id": "...", "name": "The Weeknd" }]
    },
    "album": { "id": "...", "name": "After Hours" },
    "has_lyrics": true
  },
  "meta": {}
}
```

### ❌ Error

```json
{
  "success": false,
  "message": "Song not found: xyz123",
  "error": {
    "type": "NotFoundError",
    "details": null
  }
}
```

---

## Usage Examples

### Search for a song

```bash
curl "https://your-api.onrender.com/api/v1/search/songs?q=blinding+lights"
```

### Get song with stream URL

```bash
curl "https://your-api.onrender.com/api/v1/songs/5WXAlMNt"
# Returns stream_url you can play directly in an <audio> tag
```

### Get lyrics

```bash
curl "https://your-api.onrender.com/api/v1/songs/5WXAlMNt/lyrics"
```

### Get artist

```bash
curl "https://your-api.onrender.com/api/v1/artists/459320"
```

### Get trending

```bash
curl "https://your-api.onrender.com/api/v1/trending"
```

---

## Frontend Integration

Typical Cymor Tune frontend flow:

```
1. GET /trending              → Load home page
2. GET /search/songs?q=...    → User searches
3. GET /songs/{id}            → User taps a song → get stream_url
4. Play stream_url in <audio> tag
5. GET /songs/{id}/lyrics     → Show lyrics while playing
6. GET /songs/{id}/suggestions → Show "Up Next" queue
```

The `stream_url` from `/songs/:id` is a direct `.mp4`/`.m4a` audio file — no iframes, no ads, plays natively in any `<audio>` tag.

---

## Deployment on Render

| Setting | Value |
|---------|-------|
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Environment Variables** | `NODE_ENV=production` |

No Python. No pip. No Redis. No extra services. Just push and deploy.

---

## Caching Strategy

| Content | Cached | TTL |
|---------|--------|-----|
| Search results | ✅ | 10 min |
| Song details | ✅ | 10 min |
| Lyrics | ✅ | 60 min |
| Albums | ✅ | 10 min |
| Artists | ✅ | 10 min |
| Playlists | ✅ | 10 min |
| Trending | ✅ | 15 min |

---

## Error Codes

| HTTP Code | Meaning |
|-----------|---------|
| 200 | Success |
| 400 | Bad Request — missing or invalid query params |
| 404 | Song / Album / Artist / Playlist not found |
| 429 | Too Many Requests — rate limited |
| 500 | Internal Server Error |
| 502 | Provider Unavailable — JioSaavn unreachable |
| 504 | Gateway Timeout — JioSaavn too slow |

---

## Future Roadmap (v2)

- MongoDB Atlas for favorites, personal playlists, listening history
- Device ID-based anonymous user profiles
- AI-powered recommendations via Gemini
- Multiple provider support (Spotify, Apple Music metadata layer)
- Admin dashboard for usage analytics

---

## License

MIT © Cymor Tech Services / Legendary Smiley Cymor · Kenya
