# Fantasy Football Locker Room Project Workflow

This document is the working roadmap for completing Fantasy Football Locker Room. The app starts with the Draft War Room because it is the offseason, but the full product should become a season-long fantasy football command center for draft, waiver, trade, start/sit, matchup, roster, and league strategy.

## Product Direction

Fantasy Football Locker Room should be optimized first as a real personal-league tool, not just a static portfolio demo. The app should feel useful for managing an actual Sleeper league, while still being polished enough to show as a portfolio project.

The long-term product should answer questions like:

- Who should I draft right now?
- Which players are likely gone before my next pick?
- Who should I add before everyone else notices?
- Who should I start this week?
- Which teams are good trade partners?
- What does my team need to win this matchup and the season?

## Current State

The app is currently a React + TypeScript + Vite prototype with:

- A draft-focused dashboard.
- Mock player, team, and draft data.
- Safe, Intermediate, and Aggressive draft modes.
- A draft recommendation model with visible component scores.
- A pick forecast engine that considers teams drafting before the user's next pick.
- Sleeper service functions for leagues, drafts, users, and draft picks.
- Public GitHub repo and working production build.

Important current limitations:

- Player data is mocked.
- League settings are hardcoded for redraft half-PPR.
- Sleeper sync is wired, but player ID mapping and real projections need work.
- The UI is mostly one large page/component.
- There is no backend, auth, database, or saved user state yet.

## Target Architecture

The recommended long-term architecture is:

- Next.js App Router for the web app.
- Vercel for deployment.
- Supabase for auth, Postgres, and persisted app data.
- Sleeper as the first supported fantasy platform.
- Explainable scoring models first, with ML/backtesting added later.

Keep the app usable at every step. Do not rewrite everything at once unless the current prototype behavior is preserved.

## Phase 1: Stabilize The Prototype

Goal: make the current Vite version clean, maintainable, and easy to build on.

Steps:

1. Keep `npm run build` passing.
2. Split the large app into feature components:
   - Draft header/status bar.
   - Mode selector.
   - User roster panel.
   - Teams-before-you panel.
   - Recommendation card.
   - Available draft board.
3. Move mock data and model code behind clear interfaces.
4. Add a simple app-level navigation shell for future modules:
   - Draft
   - Waivers
   - Start/Sit
   - Trades
   - Matchups
   - League Intel
   - Model Lab
5. Keep Draft as the only fully interactive module for now.
6. Add lightweight tests for pure model functions.

Acceptance criteria:

- App still looks and behaves like the current draft prototype.
- Draft recommendations still change by mode.
- Mock draft picks still advance the board.
- Source files are easier to navigate.

## Phase 2: Complete Draft War Room V1

Goal: make the draft module feel like a genuinely useful tool.

Steps:

1. Add draft queue/watchlist behavior.
2. Add player tiers by position.
3. Add player detail panels with:
   - Projection.
   - Floor.
   - Ceiling.
   - Risk.
   - Bye week.
   - Role notes.
   - Model explanation.
4. Improve draft strategy modes:
   - Safe mode should favor stable workload and lower risk.
   - Intermediate mode should balance value, roster fit, and scarcity.
   - Aggressive mode should favor ceiling and positional runs.
5. Improve survival chance:
   - Account for ADP.
   - Account for teams between current pick and next user pick.
   - Account for roster needs.
   - Account for tier scarcity.
6. Add draft pick history.
7. Add manual import/export for draft state as a fallback.

Acceptance criteria:

- User can run a mock draft without manually tracking every player.
- Every recommendation has understandable reasoning.
- Player availability and roster needs update immediately after picks.

## Phase 3: Real Sleeper Draft Sync

Goal: connect the Draft War Room to actual Sleeper draft data.

Steps:

1. Improve Sleeper player handling:
   - Fetch or import Sleeper player metadata.
   - Map Sleeper player IDs to app player records.
   - Show fallback player names when local projection data is missing.
2. Use real draft settings:
   - Teams.
   - Rounds.
   - Roster slots.
   - Draft order.
   - Slot-to-roster mapping.
3. Add live draft polling controls:
   - Connected.
   - Syncing.
   - Last synced time.
   - Sync error.
   - Manual refresh.
4. Preserve mock mode for demos.
5. Add clear empty/error states for invalid Sleeper league IDs.

Acceptance criteria:

- User can enter a Sleeper league ID and load the current draft.
- Drafted players are removed automatically.
- Teams before the next pick are based on real draft order.
- The app never tries to make a pick on behalf of the user.

## Phase 4: Projection And Player Data

Goal: replace mock projections with usable fantasy football data.

Steps:

1. Define a `PlayerProjection` shape:
   - Player ID.
   - Name.
   - Team.
   - Position.
   - Week or season scope.
   - Projection.
   - Floor.
   - Ceiling.
   - Risk.
   - Volatility.
   - Source.
2. Start with CSV import or static JSON projection files.
3. Add data source notes in the UI so the user knows what rankings are based on.
4. Add a projection normalization layer so different sources can be blended later.
5. Add replacement value calculations by league format.

Acceptance criteria:

- The model no longer depends only on hand-written mock players.
- The app can be updated for a new season by replacing projection data.
- Missing projections do not crash the app.

## Phase 5: Migrate To Next.js

Goal: prepare the app for full-platform features.

Steps:

1. Create a Next.js App Router version of the app.
2. Preserve the current Draft War Room as the first route.
3. Move model and service code into reusable modules.
4. Add routes:
   - `/draft`
   - `/waivers`
   - `/start-sit`
   - `/trades`
   - `/matchups`
   - `/league`
   - `/model-lab`
5. Deploy the migrated app to Vercel.
6. Keep the old Vite prototype only until the Next.js version fully replaces it.

Acceptance criteria:

- Vercel deployment works.
- Draft module still works after migration.
- Routes exist for future modules, even if some are placeholder states.

## Phase 6: Supabase Backend

Goal: persist leagues, settings, recommendations, and user state.

Steps:

1. Add Supabase project.
2. Add authentication.
3. Add database tables:
   - Users.
   - Connected leagues.
   - League settings.
   - Teams.
   - Rosters.
   - Players.
   - Projections.
   - Drafts.
   - Draft picks.
   - Model settings.
   - Recommendation history.
4. Add Row Level Security policies.
5. Store connected Sleeper league IDs per user.
6. Store model preferences:
   - Risk tolerance.
   - Draft mode default.
   - Positional value weights.
   - Bye-week sensitivity.
   - Upside vs floor preference.
7. Cache Sleeper data to avoid repeated API calls.

Acceptance criteria:

- User can sign in.
- User can save a Sleeper league.
- User can return later and see the same connected league/settings.

## Phase 7: Waivers Module

Goal: build the first post-draft season module.

Steps:

1. Load user roster and free agents.
2. Calculate roster weaknesses.
3. Add waiver recommendation types:
   - Best add overall.
   - Best add by position.
   - One-week streamer.
   - Bye-week stash.
   - Drop candidate.
4. Add one-week-ahead bye planning:
   - Detect future starter bye conflicts.
   - Recommend pickups before the bye week arrives.
5. Explain recommendations with:
   - Roster fit.
   - Upcoming matchup.
   - Bye-week value.
   - Replacement value.
   - Upside.

Acceptance criteria:

- User can see who to add and who to drop.
- App identifies future bye problems before they become urgent.
- Recommendations explain why they matter.

## Phase 8: Start/Sit Module

Goal: help with weekly lineup decisions.

Steps:

1. Load roster and weekly matchups.
2. Compare eligible starters and bench players.
3. Add recommendation labels:
   - Start.
   - Sit.
   - Lean start.
   - High-risk upside play.
4. Score players by:
   - Projection.
   - Floor.
   - Ceiling.
   - Matchup.
   - Team context.
   - Injury status when available.
5. Save decisions for later review.

Acceptance criteria:

- User can compare two players.
- User can see a recommended lineup.
- The app explains each start/sit call.

## Phase 9: Trades Module

Goal: evaluate trades and eventually suggest trade partners.

Steps:

1. Build trade analyzer:
   - Select players from user's team.
   - Select players from another team.
   - Compare both sides.
2. Score trades by:
   - Rest-of-season value.
   - Starter upgrade.
   - Positional scarcity.
   - Roster fit.
   - Bench loss.
   - Bye-week impact.
3. Add verdict labels:
   - Accept.
   - Fair.
   - Strategic overpay.
   - Overpay.
   - Reject.
4. Build trade finder:
   - Scan every team.
   - Find roster surplus and weaknesses.
   - Suggest managers who need what the user can afford to trade.
   - Generate realistic trade packages.

Acceptance criteria:

- User can evaluate a manual trade.
- App can identify likely trade partners from league roster construction.
- Trade suggestions benefit both teams enough to feel realistic.

## Phase 10: Matchups And League Intel

Goal: give the app a weekly command-center feel.

Steps:

1. Add weekly matchup preview:
   - Projected score.
   - Win probability.
   - Key swing players.
   - Biggest advantage.
   - Biggest risk.
2. Add league power dashboard:
   - Points for.
   - Points against.
   - Record.
   - Luck rating.
   - Roster strength by position.
3. Add manager tendency tracking:
   - Draft tendencies.
   - Waiver activity.
   - Trade behavior.
   - Positional preferences.

Acceptance criteria:

- User can understand why they are favored or not.
- App identifies the players most likely to swing the week.
- League intel helps with waiver and trade strategy.

## Phase 11: Model Lab

Goal: turn recommendations into a tunable, testable model.

Steps:

1. Store every recommendation and component score.
2. Store actual outcomes when available.
3. Add backtesting:
   - Draft pick value.
   - Waiver hit rate.
   - Start/sit accuracy.
   - Trade value movement.
4. Add model versioning.
5. Keep explanations visible even if ML is introduced.
6. Add hybrid modeling:
   - Explainable weighted scoring for UI.
   - ML predictions for volatility, hit rate, and forecast adjustments.

Acceptance criteria:

- User can see how the model performed.
- Model changes can be compared against past decisions.
- The app remains understandable instead of becoming a black box.

## Suggested Issue Milestones

Use these GitHub milestones:

1. Prototype Cleanup
2. Draft War Room V1
3. Sleeper Draft Sync
4. Real Projection Data
5. Next.js Migration
6. Supabase Platform
7. Waivers
8. Start/Sit
9. Trades
10. Matchups And League Intel
11. Model Lab

## Ongoing Development Rules

- Keep `npm run build` passing before every push.
- Commit small, focused changes.
- Preserve mock mode even after real Sleeper data works.
- Do not hide model reasoning.
- Do not add a feature unless the user can act on its recommendation.
- Favor real fantasy football workflows over decorative dashboard sections.
- Keep the product scoped to fantasy football, not general fantasy sports.

## Immediate Next Steps

1. Split the current large app into smaller components.
2. Add a persistent navigation shell for all planned modules.
3. Add Draft queue/watchlist behavior.
4. Improve real Sleeper player ID mapping.
5. Add CSV or JSON projection import.
6. Start planning the Next.js migration once Draft V1 is stable.
