# Cerfinits Trading Journal — Product Grill

- Date: 2026-07-14
- Track: Product / Cerfinits
- AI-OS gate: G1 — Grill
- Status: LOCKED — Kan accepted all recommendations on 2026-07-14
- Verdict: PIVOT via isolated prototype; do not replace or delete Cerfinits Plan yet

## 1. One-sentence product hypothesis (G0)

If Cerfinits turns cTrader history into clean round-trip trades and evidence-first R analytics, Kan can identify whether performance comes from a repeatable setup or from noise more reliably than with the current personal-finance dashboard.

## 2. Evidence from the current repo

### Facts

- The current app has six finance surfaces under `/plan`: overview, cashflow, portfolio, balance, goals, and reports.
- Current persistence is local JSON through `lib/store.ts`; Supabase exists as a draft schema but is not the active source of truth.
- The current `Transaction` model records asset buy/sell events. It does not model a round-trip trade, initial risk, stop loss, R-multiple, or setup.
- The provided `goodfolio-dashboard.svg` is a 1440×960 desktop dashboard with a 240px sidebar, white canvas, compact header metrics, soft neutral cards, a large chart, and a table-first activity area.
- The current project decision log says Supabase and Vercel cutover are still pending. A destructive rewrite now would mix a product pivot with a data-platform migration.

### Inference

- Reusing `transactions` as the journal's main entity would corrupt core analytics because an execution is not the same thing as a completed trade.
- A portfolio-style dashboard is a useful visual reference, but its information architecture is wrong for a journal. A journal should prioritize process quality and data completeness over account value.
- The highest-risk failure is building an attractive analytics dashboard before the capture/import workflow is reliable enough to use after every trading session.

### Opinion / recommendation

- Build the journal as an isolated `/journal` prototype first and preserve `/plan` unchanged until the journal passes a complete local workflow test.
- Use R-multiples as the primary performance language. Show currency P&L secondarily and allow it to be hidden.
- Start with cTrader CSV import plus manual correction. Do not start with live broker sync.

## 3. Problem to solve

The product must answer these questions without manual spreadsheet work:

1. Which setups, sessions, and instruments drive expectancy?
2. Is risk-adjusted performance improving even when short-term P&L is noisy?
3. Which trades are missing valid risk data and must be corrected before they count in R analytics?

It is not primarily a portfolio tracker, household finance planner, backtester, broker terminal, or social trading platform.

## 4. Target user

### MVP

- Kan as the single user.
- Trading data primarily from cTrader.
- Desktop-first trade inspection and analytics; mobile supports capture, quick notes, and reading.

### Deferred

- Multi-user public SaaS.
- Family-finance workflows.
- Broker-agnostic live synchronization.

## 5. Recommended MVP information architecture

| Route | Surface | Core job |
|---|---|---|
| `/journal` | Overview | See process health, performance in R, equity curve, and data completeness |
| `/journal/trades` | Trades | Search, filter, import, and inspect all trades in a dense table |
| `/journal/analytics` | Analytics | Compare expectancy and adherence by setup, instrument, session, and day |
| `/journal/playbook` | Playbook | Define valid setups, entry checklist, invalidation, and risk rules |
| `/journal/settings` | Settings & Import | Manage account, base currency, import mapping, and data export |

The current six `/plan` pages are not mapped one-to-one. Their jobs change because the product changes.

## 6. Core workflow

```text
cTrader CSV / manual entry
  → import staging and validation
  → executions grouped into a trade
  → unresolved setup/risk fields corrected
  → analytics update
```

The cheap-test prototype must make this workflow usable before advanced analytics is added.

## 7. Dashboard design direction

Use the supplied Goodfolio reference for visual grammar, not its investment-product content:

- Persistent left sidebar on desktop; compact bottom navigation or drawer on mobile.
- Warm-gray Cerfinits canvas, hairline borders, black primary controls, and restrained gold/green/red semantic colors.
- Near-square geometry throughout; hierarchy comes from borders, spacing, and typography rather than shadows.
- First viewport contains four primary metrics: Net R, Expectancy, Profit Factor, and Win Rate.
- Main chart is cumulative R, with drawdown visible; it is not portfolio value.
- Secondary area is a minimal recent-trades table plus a data-quality warning when risk is missing.
- Global CTA is “Import trades”; secondary CTA is “Add trade.”
- No decorative finance cards, bank balance, credit card, ESG score, or portfolio allocation in the journal.

## 8. Data model boundary

### `TradingAccount`

- `id`, `name`, `broker`, `accountRef`, `baseCurrency`, `timezone`

### `Trade`

- Identity: `id`, `accountId`, `symbol`, `side`, `status`
- Timing: `openedAt`, `closedAt`, `session`
- Position: `quantity`, `averageEntry`, `averageExit`
- Risk: `initialStop`, `initialRiskAmount`, `riskPercent`
- Result: `grossPnl`, `fees`, `swap`, `netPnl`, `rMultiple`
- Context: `setupId`, `timeframe`, `marketCondition`, `tags`
- Optional context: `notes`, `tags`

### `Execution`

- `id`, `tradeId`, `type`, `side`, `executedAt`, `quantity`, `price`, `fee`, `externalId`

### `PlaybookSetup`

- `id`, `name`, `description`, `entryChecklist`, `invalidationRules`, `defaultRiskPercent`, `active`

### `TradeMedia`

- `id`, `tradeId`, `stage` (`before`, `during`, `after`), `url`, `caption`

Executions must remain separate from trades. This supports partial entries/exits and prevents false win-rate or trade-count calculations.

## 9. Metric definitions for MVP

- `Net R = Σ rMultiple`
- `Expectancy = average(rMultiple)` across closed trades with valid initial risk
- `Win rate = winning closed trades / closed trades`
- `Profit factor = gross profit / absolute gross loss`
- `Max drawdown (R) = maximum peak-to-trough decline of cumulative R`
- `Data completeness = trades with valid initial risk / all closed trades`

All metric cards must expose sample size. Empty/invalid risk data must be excluded explicitly, not coerced to zero.

## 10. MVP scope

### Must have

- Seeded/mock prototype that demonstrates the full workflow.
- Manual add/edit trade.
- cTrader CSV import staging with mapping and validation.
- Round-trip trade plus child executions.
- Playbook setup assignment without a separate review workflow.
- Trade table with date, symbol, side, setup, net R, result, and data status.
- Filters for date, account, symbol, setup, side, and result.
- Dashboard and analytics using documented metric definitions.
- Responsive desktop and mobile behavior.
- Export to JSON/CSV before any destructive migration.

### Explicitly not MVP

- Live cTrader API sync.
- AI trade coach or automatic psychological diagnosis.
- Backtesting or strategy optimization.
- Copy trading, order placement, or any action touching a live account.
- Social feed, leaderboard, subscriptions, or public profiles.
- Household cashflow, debt, goals, and portfolio valuation inside the journal IA.
- Counterfactual “mistake cost” claims that cannot be computed without a defined alternate-execution model.

## 11. Migration and safety

### Worst case

Existing family-finance or investment records are overwritten while the new schema is still changing, leaving neither product trustworthy.

### Circuit breakers

- Do not delete or mutate current JSON files during G2 prototype work.
- Do not change production Supabase or deploy journal tables without a reviewed migration and backup/export.
- Keep `/plan` operational until Kan explicitly approves cutover after local hard test.
- Use new journal-specific types, store files, API routes, and route namespace.

## 12. Acceptance criteria by gate

### G1 — Locked spec

- Decisions below are answered and marked locked.
- Metric definitions and non-goals are accepted.

### G2 — Cheap test

- A local mock-data prototype completes: import → validation → analytics.
- Kan can correct an unmapped trade from the trades table without entering a separate review queue.
- Desktop dashboard and mobile quick capture are visually usable.

### G3 — Hard test

- Build passes.
- Core flows work on localhost with no relevant console errors.
- CSV edge cases tested: duplicate executions, missing stop, partial close, timezone mismatch, zero/negative fee, and malformed rows.
- Metric calculations have unit tests with known expected results.
- Existing `/plan` routes and data remain unchanged.

### G4 — Forward/staging

- Kan uses the journal after real demo trading sessions for at least two weeks.
- Target: at least 95% of closed trades have valid initial risk within 24 hours of import.
- Import correction rate is measured; if more than 10% of rows need manual correction, mapping is not ready for live cutover.

### G5 — Live

- Requires a separate pre-deploy checklist and explicit Real-Money Protocol confirmation.

## 13. Decisions to lock

| ID | Decision | Recommendation | Status |
|---|---|---|---|
| D1 | Replace `/plan` now or prototype separately? | Build `/journal`; preserve `/plan` until G3/G4 evidence | LOCKED |
| D2 | Primary ingestion | cTrader CSV import + manual correction; live sync later | LOCKED |
| D3 | Canonical unit | One round-trip trade with child executions | LOCKED |
| D4 | Primary performance display | R-first; currency P&L secondary/hideable | LOCKED |
| D5 | MVP account scope | One user, multiple trading accounts | LOCKED |
| D6 | MVP instruments | Forex, metals, indices, crypto CFDs; symbol remains free text | LOCKED |
| D7 | Screenshot/media | Removed from G2 together with the Review workflow | SUPERSEDED 2026-07-14 |
| D8 | Language | Thai UI with standard English trading terms | LOCKED |
| D9 | Visual direction | Goodfolio structure adapted to Cerfinits; no portfolio/ESG content | LOCKED |
| D10 | Existing finance product | Archive as a separate product after journal cutover, not merge into journal | LOCKED |

### User override — 2026-07-14

- Remove the Trade Review surface and all review-only workflow/metrics from MVP.
- Shift the visual direction from Goodfolio-led white/rounded fintech UI to native Cerfinits minimalism: warm gray tokens, hairline borders, near-square geometry, restrained gold accent, and fewer cards.

## 14. Build order after lock

1. Create revised Cerfinits-native visual concepts for Overview, Trades, and mobile quick capture.
2. Extract design tokens and component architecture.
3. Add journal domain types, seeded mock data, and pure metric functions.
4. Implement app shell and Overview.
5. Implement Trades and inline correction workflow.
6. Implement Analytics and Playbook.
7. Implement CSV import staging and export.
8. Add tests, browser QA, code review, and G2 verdict.

## 15. Current verdict

**PIVOT, but only through an isolated G2 prototype.**

The direction is coherent with Kan's evidence-first trading workflow, but a destructive replacement is not justified before the import/correction/analytics loop proves usable.

## 16. G2 usability polish — locked 2026-07-15

This is an incremental correction pass, not a new feature track.

- Date range controls must filter Overview metrics/chart/recent trades and the Trades table; they must not remain decorative buttons.
- Trades must render real pages. The visible row count, page controls, and rows-per-page control must agree.
- Changing a filter or page size returns to page 1 and clears stale row selection.
- Add Trade must reject invalid numbers, non-positive quantity/risk, and a close time earlier than the open time before writing to local storage.
- The cumulative-R chart must fit the mobile viewport without a horizontal scroll trap.
- No Trade Review workflow or production-data integration is added in this pass.
