# Trading Journal context continuity — locked spec

Date: 2026-07-15  
Gate: G3.1 local daily-use hardening  
Decision: make date and selected-trade context survive navigation without adding remote state.

## One question

Can Kan move from Overview to a specific trade or Analytics without reselecting the same date range or searching for the record again?

## Current failure

- Overview and Trades own separate in-memory date ranges.
- Analytics ignores the selected date range and analyzes every record.
- `Recent trades > Open` lands on the Trades page without selecting the trade.
- the data-completeness panel reports missing risk but does not open the correction queue.
- navigation links discard URL context.

This violates the locked iOS interaction standards for continuity, direct manipulation, immediate feedback, and truthful controls.

## Contract

### Date range

- Supported values remain `7d`, `30d`, and `all`.
- Invalid URL or persisted values are rejected; `30d` is the safe default.
- The current range lives in `JournalProvider`, persists under a versioned UI preference key, and is available to every Journal surface.
- A valid `?range=` deep link overrides the persisted value during Journal hydration.
- Overview, Trades, and Analytics use the same provider value and the same deterministic `filterTradesByRange()` function.
- Changing range updates provider state, persisted preference, and the current URL with `history.replaceState()` so filters do not create noisy browser-history entries.
- Sidebar and mobile navigation links carry the current range.

### Direct trade link

- `/journal/trades?range=30d&trade=<client-id>` opens the matching trade inspector.
- Trade IDs are encoded as query parameters and are never interpreted as paths or HTML.
- Unknown trade IDs are removed from the URL and do not open a different record.
- Selecting a row updates `trade`; closing, deleting, clearing filters, or changing page removes it.
- Overview recent-trade actions link directly to the same record.

### Missing-risk correction

- The Overview completeness panel exposes one action when incomplete trades exist.
- The action links to Trades with the same range and `quality=missing`.
- Trades accepts only `quality=missing`; every other value falls back to `all`.
- The existing Save & next correction loop remains the canonical resolution workflow; no Review surface is introduced.

### Analytics truthfulness

- Analytics displays the same range control as Overview and Trades.
- Every summary and expectancy group uses only visible ranged trades.
- The header states the visible/total trade count so an empty or small range is not mistaken for all-time evidence.

## Acceptance evidence

1. Range parser rejects unknown values and URL builder encodes trade IDs.
2. A valid URL range wins over a valid persisted range; invalid values cannot poison the preference.
3. Overview, Trades, and Analytics visibly show the same range after navigation.
4. Recent trade Open selects that exact record; close removes `trade` from the URL.
5. Missing-risk action opens the filtered correction queue without adding a Review page.
6. Analytics metrics and groups change when range changes.
7. Reload preserves range, while a copied deep link restores range and selected trade.
8. Existing storage, import, backup, auth, and zero-write sync tests still pass.
9. Desktop and 390×844 layouts have no new horizontal overflow and all added targets are at least 44px.

## Non-goals and gate

- No remote persistence, production data, account selector, or Supabase mutation.
- Account continuity remains blocked on the future `TradingAccount` entity; the static demo label must not pretend to be a working selector.
- G4/G5 remain unchanged and STOP-SHIP.
