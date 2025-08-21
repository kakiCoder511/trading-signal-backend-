# trading-signal-backend-
# Trading Signal Backend

🚧 **Status: Work in Progress** 🚧
This backend is under active development; endpoints and features may change frequently.

RESTful API that powers a momentum‑trading web app. It fetches market data, computes lightweight technical signals, and returns beginner‑friendly insights for short‑term traders.

## Key Features

* Endpoints for RSI, volume spikes, bullish streaks, and recent‑high breakouts
* Modular MVC structure with TypeScript types and linting
* Robust error handling with consistent error shapes
* Configurable data provider (default: `yahoo-finance2`)
* Test suite with Jest and Supertest

## Tech Stack

**Runtime** Node.js
**Framework** Express
**Language** TypeScript
**Database** PostgreSQL
**Testing** Jest, Supertest
**Data** yahoo-finance2 (no API key required for most endpoints)

## API Overview

Base URL defaults to `http://localhost:3000/api` in development.

| Method | Path              | Query                                  | Purpose                                               |
| ------ | ----------------- | -------------------------------------- | ----------------------------------------------------- |
| GET    | `/health`         | –                                      | Health check                                          |
| GET    | `/quote`          | `symbol`                               | Latest quote snapshot                                 |
| GET    | `/rsi`            | `symbol`, `period=14`, `range=3mo`     | Relative Strength Index                               |
| GET    | `/volume-spike`   | `symbol`, `lookback=20`, `threshold=2` | Detects unusual volume vs SMA                         |
| GET    | `/bullish-streak` | `symbol`, `lookback=10`                | Counts consecutive bullish candles                    |
| GET    | `/recent-high`    | `symbol`, `lookback=20`                | Checks if price is breaking recent high               |
| GET    | `/analysis`       | `symbol`                               | Aggregates signals and returns a simple score + hints |

> Note: paths may differ if you mount under a versioned prefix. Adjust to your `src/routes` configuration.

## Example Responses

### `/analysis?symbol=AMD`

```json
{
  "symbol": "AMD",
  "rsi": 56.2,
  "volumeSpike": true,
  "bullishCandles": 5,
  "newHigh": false,
  "nearMA20": true,
  "score": 4,
  "hints": [
    "Volume spike — sudden increase in trading activity",
    "Five bullish candles in a row — strong short‑term momentum",
    "Near 20‑day MA — watch for bounce vs. rejection"
  ],
  "meta": { "asOf": "2025-08-21T09:00:00Z", "provider": "yahoo-finance2" }
}
```

### Error shape

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Missing required query parameter: symbol",
  "details": { "required": ["symbol"] }
}
```

## Getting Started

### Prerequisites

* Node.js 18+
* pnpm or npm
* PostgreSQL 14+ (optional initially; the core endpoints run without DB)

### Installation

```bash
# clone
git clone https://github.com/kakiCoder511/trading-signal-backend.git
cd trading-signal-backend

# install deps
pnpm install
# or
npm install

# copy env template
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the project root.

```
# Server
PORT=3000
NODE_ENV=development

# Data provider
DATA_PROVIDER=yahoo # options: yahoo (default)

# Database (optional for future persistence / journaling)
DATABASE_URL=postgres://user:password@localhost:5432/trading_signal

# Logging
LOG_LEVEL=info
```

### Run in Development

```bash
pnpm dev
# or
npm run dev
```

### Build and Run

```bash
pnpm build && pnpm start
# or
npm run build && npm start
```

### Test

```bash
pnpm test
# or
npm test
```

## Project Structure

```
src/
  app.ts              # Express app bootstrap
  server.ts           # HTTP server entry
  routes/
    index.ts          # API router
    analysis.routes.ts
  controllers/
    analysis.controller.ts
  services/
    data/
      yahooService.ts # wraps yahoo-finance2
    indicators/
      rsi.ts          # RSI calculation
      volumeSpike.ts
      bullishStreak.ts
      recentHigh.ts
  models/
    types.ts          # shared DTOs
  utils/
    errors.ts         # AppError, error responders
    validators.ts     # query validation
  middleware/
    errorHandler.ts   # centralised error handling

__tests__/
  analysis.test.ts
  rsi.test.ts

.env.example
jest.config.ts
package.json
README.md
```

## Indicators

### RSI

* Default period 14, calculated over adjusted close
* Range defaults to `3mo`; configurable via `range` query

### Volume Spike

* Compares latest volume to SMA(volume, lookback)
* `threshold` defines how many times above SMA counts as a spike

### Bullish Streak

* Counts consecutive candles where close > open

### Recent High

* Checks if the latest close is greater than max high in `lookback`

## Error Handling

* All controllers throw `AppError(code, message, details)` for predictable errors
* Unknown errors are normalised by `errorHandler`
* Validation is handled at the edge using small helpers in `validators.ts`

Common cases

* `400` missing or invalid query params
* `404` unknown symbol or empty data stream
* `502` upstream provider error (e.g. rate limiting or transient outage)

## Development Notes

* The default data provider is `yahoo-finance2`, which does not require an API key for most historical ranges.
* The service layer isolates upstream specifics so you can swap providers without touching controllers.

## Roadmap

* Add caching layer for repeated symbol queries
* Add moving average crossovers and ATR‑based risk hints
* Persist user analysis history to PostgreSQL
* Pagination and batching for multi‑symbol queries
* Dockerfile and docker‑compose for one‑command setup

## Scripts

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc -p .",
    "start": "node dist/server.js",
    "lint": "eslint 'src/**/*.{ts,tsx}'",
    "test": "jest"
  }
}
```

## Licence

MIT © Kaki Lai
