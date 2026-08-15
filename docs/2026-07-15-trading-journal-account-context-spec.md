# Trading Journal account context — locked spec

Date: 2026-07-15  
Gate: G3.2 local daily-use hardening  
AI-OS: B1 feature grill  
Decision: replace the hard-coded account label with a real local-first `TradingAccount` entity and one atomic Journal snapshot.

## Problem and user

Kan may trade or import from more than one cTrader account. The current UI repeatedly shows `cTrader Demo 01`, but Quick Add and CSV Import silently hard-code `ctrader-demo-01`; Overview, Trades, and Analytics combine every `accountId`. The visible account control is therefore not truthful.

## Smallest solution that fixes 80%

1. Persist accounts, active account ID, and trades in one versioned snapshot.
2. Expose one active-account selector across Overview, Trades, Analytics, Quick Add, and Settings.
3. Scope capture, import, lists, metrics, completeness, and Analytics to that account.
4. Allow add/edit locally; allow delete only for an empty account while another account remains.
5. Include accounts and active selection in verified backup/restore.

Cut from this slice: balances, deposits, broker API credentials, live sync, account aggregation, currency conversion, production writes, and automatic deletion of trades when an account is deleted.

## Canonical entity

```ts
interface TradingAccount {
  id: string;                  // stable client ID, 1..160 chars
  name: string;                // visible label, 1..120 chars
  broker: string;              // 1..80 chars
  externalAccountId: string | null;
  baseCurrency: string;        // uppercase A-Z, 3..8 chars
  reportingTimezone: string;   // valid IANA timezone
}
```

`id` is never derived from the editable name. Existing `ctrader-demo-01` remains stable during migration so import identity and trade ownership do not change.

## Storage v5

The atomic payload contains:

- `version: 5`;
- `savedAt`, `revision`, checksum metadata;
- `accounts`;
- `activeAccountId`;
- `trades`.

The checksum covers the canonical full snapshot, not trades alone. Account arrays, trades, executions, and tags use deterministic ordering for checksum purposes.

### Migration

- v4/v3/v2 trades are validated first using their original contract.
- Distinct `trade.accountId` values become accounts without changing any trade IDs or ownership.
- `ctrader-demo-01` maps to cTrader Demo 01 / cTrader / THB / Asia/Bangkok.
- unknown historical IDs remain visible using their ID as the name, `Unmapped` broker, THB, and Asia/Bangkok; no broker metadata is invented.
- an empty legacy Journal receives the default account.
- the first deterministic account becomes active; the default account wins when present.
- migration writes v5 then reads it back before enabling mutations.

## Invariants and circuit breakers

1. At least one account exists and `activeAccountId` references it.
2. Account IDs are unique; all required metadata passes length/currency/timezone validation.
3. Every trade references an existing account.
4. Quick Add and CSV Import always use the active account explicitly.
5. Account selection is persisted through the same revision/conflict boundary as trades.
6. Editing metadata never changes account ID or trade IDs.
7. An account with trades cannot be deleted.
8. The final account cannot be deleted.
9. Empty-account deletion is reversible with the existing Undo snapshot.
10. Cross-tab updates hydrate accounts, active account, and trades together.
11. Storage or verification failure changes nothing in rendered state and activates the existing recovery boundary.

## Backup v2

- New backup SHA-256 covers accounts, active account, and trades.
- Backup records `accountCount` and `tradeCount`.
- Restore validates full ownership before Replace.
- Legacy backup v1 remains readable: verified trades are migrated to inferred accounts and reported as migrated.
- A v2 backup cannot restore trades whose account is absent.

## UX contract

- Account control is a real select with at least 44px target and visible label for assistive technology.
- Overview, Trades, and Analytics show only active-account data; date range remains continuous.
- Quick Add places account inside the first essential capture group so the six-group limit remains intact.
- Saving a trade opens that exact record under the selected account.
- Settings shows the selected account metadata plus obvious Add and Edit actions.
- Delete is disabled with a reason when the account owns trades; an eligible delete requires an inline confirmation and exposes Undo.
- Changing active account clears any CSV preview created for the previous account.
- Empty account state explains that data belongs to another account or offers Add/Import; it does not show combined metrics.

## Acceptance evidence

1. v4 with trades migrates to v5 without changing trade IDs, checksum semantics for the trade set, or account ownership.
2. Corrupt account metadata, orphan trades, missing active account, and snapshot checksum mismatch fail atomically.
3. Add/edit/select/delete/Undo preserve invariants and revisions.
4. Identical cTrader Position IDs imported into two accounts remain distinct.
5. Backup v2 round-trips the full snapshot; v1 still restores safely.
6. Overview, Trades, Analytics, Quick Add, and Import change together when account changes.
7. A saved manual trade and imported preview contain the selected account ID.
8. Account with trades and last account cannot be deleted.
9. Two-tab account selection/update does not overwrite a newer revision.
10. Tests, TypeScript, optimized build, dependency audit, and browser QA pass without new overflow or inaccessible controls.

## Gate

This is local-first only. It does not apply the Supabase schema or authorize remote/production financial data. G4 and G5 remain STOP-SHIP.

## Implementation evidence — 2026-07-15

Accepted for G3.2 local daily use:

- storage v5 now commits `accounts`, `activeAccountId`, and `trades` atomically under one revision and full-snapshot checksum;
- v4/v3/v2 migration preserves trade ownership, and the existing browser payload migrated from v4 with all 43 trades still present;
- backup v2 SHA-256 covers the full snapshot, while verified backup v1 remains readable through deterministic account inference;
- Overview, Trades, Analytics, Quick Add, Trade Editor, and CSV Import all use the active account; account currency and reporting timezone drive money, dates, and datetime-local conversion;
- Settings supports add, edit, select, guarded empty-account delete, inline confirmation, and Undo;
- an empty active account now explains why metrics are absent and links directly to Add Trade or Import;
- automated evidence covers full-snapshot round-trip, v4 migration, orphan rejection, backup tampering, legacy backup, account reducer/Undo, timezone round-trip, and DST-gap rejection;
- browser QA passed: create USD/New York account, active-context propagation, empty state, manual trade capture, USD formatting, New York time display, one-trade Analytics isolation, trade deletion, account deletion, account Undo, and final cleanup of QA data;
- 55/55 Journal tests, TypeScript, the optimized 69-route build, and npm audit with 0 vulnerabilities pass.

G4 staging execution and G5 production approval remain open and STOP-SHIP.
