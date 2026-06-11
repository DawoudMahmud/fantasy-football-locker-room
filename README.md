# Fantasy GM Draft Dashboard

A draft-first fantasy football dashboard for redraft half-PPR leagues. The first iteration focuses on a live draft war room with strategy-aware recommendations, transparent scoring, and a future-ready Sleeper sync layer.

![Fantasy GM Draft Dashboard](docs/draft-dashboard-screenshot.png)

## What It Does

- Shows a draft board with drafted players removed from the available pool.
- Supports Safe, Intermediate, and Aggressive draft modes.
- Scores recommendations using roster fit, upside, risk, positional scarcity, replacement value, bye impact, and survival odds.
- Forecasts which positions teams before your next pick are likely to attack.
- Includes a Sleeper API service for loading league drafts, draft details, users, and draft picks.
- Polls live Sleeper draft picks once connected.

## Current Status

This is a v0.1 prototype. It is intentionally not finished yet, but it is a working first iteration with a clear product direction.

The app currently uses realistic mock player data for the recommendation model. Sleeper draft syncing is wired at the service/UI level, but production-quality player ID mapping, real projection imports, authentication-adjacent workflows, and deeper model validation still need work.

## Tech Stack

- React
- TypeScript
- Vite
- Sleeper public API integration
- CSS modules-style global stylesheet

## Getting Started

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173/
```

To verify a production build:

```bash
npm run build
```

## Roadmap

- Replace mock player projections with imported projection data.
- Improve Sleeper player ID matching against the full Sleeper player dataset.
- Add configurable league settings instead of assuming redraft half-PPR.
- Add historical draft tendencies for each manager.
- Add better survival probability modeling by draft slot, ADP, tier breaks, and roster construction.
- Add queue/watchlist behavior for players the model says to wait on.
- Expand beyond draft into start/sit, waivers, trades, and matchup previews.

## Notes

Sleeper integration is read-only. The app can sync draft state and recommend picks, but it does not make picks on behalf of a user.
