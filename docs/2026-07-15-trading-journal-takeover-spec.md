# Cerfinits Trading Journal — Takeover Spec

- Date: 2026-07-15
- Owner: Kan / Cerfinits
- Track: Product + Build/Dev
- AI-OS gate: G2.1 local-safe takeover
- Status: LOCKED for local implementation; STOP-SHIP for production financial data
- Supersedes: visual-polish-only work after the 2026-07-14 G2 prototype

## 1. Product hypothesis

If the Journal makes importing, correcting, and recovering trade data feel as direct and predictable as a first-party iOS workflow, Kan can use it after every trading session without a spreadsheet and trust that its R metrics are derived from complete records rather than guessed values.

## 2. Takeover verdict

Continue the product, but stop adding visual polish and advanced analytics until the data and correction loop is reliable.

The next usable product loop is:

```text
Import or quick add
  -> classify Ready / Needs info / Duplicate / Rejected
  -> inspect and correct a trade directly
  -> save with immediate metric feedback
  -> reload or recover without changing the record set
  -> analyze only eligible records
```

Trade Review remains explicitly removed. Missing information is corrected in the Trades surface, not moved into a separate review queue.

## 3. Evidence

### Facts

- The current UI has Overview, Trades, Analytics, Playbook, Add Trade, and Settings surfaces under `/journal`.
- The current source of truth is `localStorage`; journal data is not persisted to Supabase.
- A trade row can be selected, but there is no detail, update, delete, or correction workflow.
- CSV IDs are generated from time plus row number, so importing the same file again creates new IDs.
- The CSV parser does not use Position ID or group partial executions into a canonical round-trip trade.
- Missing currency P&L can currently fall back to price distance multiplied by quantity, which is not valid across CFD contract specifications.
- Storage has no runtime schema validation, migration report, recovery state, or reversible mutations.
- The repo has no automated journal tests or `test` script.
- The existing production/auth stack is not yet a safe boundary for production financial data.

### Inference

- The current prototype can look finished while silently double-counting imported trades.
- A dead-end “Missing risk” filter increases work because it identifies a problem without letting the user resolve it.
- A production database would make the current data-contract mistakes harder to recover from; persistence must follow domain correctness, not precede it.

### Opinion / decision

- Treat data integrity, reversible correction, and recovery as the product—not backend plumbing.
- Use a versioned repository boundary now, with a validated local adapter first and Supabase later.
- Do not infer P&L or R when broker contract data is insufficient. Mark the trade `Needs info` instead.

## 4. What “easy like iOS” means here

This is an interaction standard, not an attempt to visually clone iOS.

1. **One obvious action** — each state exposes one dominant next step.
2. **Direct manipulation** — selecting a trade opens its details and correction controls in context.
3. **Progressive disclosure** — quick capture shows essential fields first; advanced execution details remain optional.
4. **Immediate feedback** — validation, save status, and derived R update without a page hunt.
5. **Reversible actions** — edit, import, and delete provide Undo; destructive actions are not silent.
6. **Continuity** — account and date context stay consistent across Overview, Trades, and Analytics.
7. **Truthful controls** — every visible control works; decorative controls are removed or disabled with a clear reason.
8. **Accessible defaults** — keyboard support, visible focus, at least 44px touch targets, and meaningful labels.

## 5. Scope

### P0 — reliability and correction

- Versioned, runtime-validated journal payload.
- Explicit storage states: loading, ready, recovered, and error.
- Direct trade inspector/editor from the table.
- Update and delete with Undo.
- Shared domain validation for manual add, edit, and import.
- Stable import fingerprint based on account and external broker identity.
- Idempotent import: importing the same source twice adds zero trades.
- No guessed currency P&L.
- Automated tests for metrics, validation, storage, and importer integrity.

### P1 — daily speed

- “Needs info” correction with Save & next.
- Quick Add with no more than six essential field groups before Advanced.
- Current-time and last-used-account defaults; resumable local draft.
- Consistent account/date context across analytical surfaces.
- Recoverable JSON export and restore.

### P2 — staging persistence

- Journal-specific Supabase schema, migrations, RLS, backup, and rollback plan.
- Authenticated repository adapter with user-scoped account ownership.
- Staging migration and reconciliation checks.

### Non-goals

- No Trade Review surface or review metrics.
- No live cTrader sync, order placement, copy trading, or live-account action.
- No AI coach or psychological diagnosis.
- No replacement or deletion of `/plan` during G2/G3.
- No production Supabase mutation or deployment without Kan's explicit confirmation.

## 6. Canonical data boundary

### Required entities

- `TradingAccount`: user-owned broker account and reporting timezone.
- `Trade`: one canonical position lifecycle used for metrics.
- `Execution`: immutable entry, partial, exit, fee, and external broker evidence.
- `PlaybookSetup`: setup definition assigned to a trade.
- `ImportBatch`: source file fingerprint, counts, mapping version, and status.
- `ImportRow`: original row evidence, classification, and blocking issues.

### Trade invariants

1. IDs are stable and unique within an account.
2. `closedAt >= openedAt` for closed trades.
3. Quantity, entry, and exit prices are finite and positive when present.
4. `initialRiskAmount > 0` is required before a trade enters R analytics.
5. `rMultiple = netPnl / initialRiskAmount`; it is never stored as an unrelated manual number.
6. Currency P&L is never derived without broker contract metadata or explicit broker P&L.
7. Execution ownership and trade ownership must match.
8. Reimporting the same external evidence is idempotent.
9. Import writes are atomic: a failed batch does not partially change the canonical dataset.
10. Analytics exposes eligible sample size and excludes incomplete records explicitly.

## 7. Core flows and acceptance criteria

### A. Inspect and correct

- Click, tap, or press Enter on a row to open the same trade record.
- Editing Initial Risk or Setup and saving updates metrics immediately.
- Delete shows an Undo action and restores the identical record when invoked.
- Save & next advances to the next unresolved trade.
- One normal correction can be completed in under 15 seconds.

### B. Import safely

- Preview separates `Ready`, `Needs info`, `Duplicate`, and `Rejected`.
- Reimporting the same file adds zero trades and does not change metrics.
- Missing P&L is `Needs info`, not a calculated estimate.
- Closed-before-open, malformed time, and ambiguous timezone are quarantined.
- Position-level partial executions group into one trade.

### C. Quick Add

- Essential capture is no more than six field groups before Advanced.
- Default time is current time, not a hard-coded example date.
- Draft survives an accidental refresh.
- Manual add and edit share the same validation contract.
- A normal entry can be saved in under 30 seconds.

### D. Recovery

- Corrupt or unavailable storage shows a recovery state; it never silently replaces user data with seed data.
- Export, wipe, and restore reproduce trade count, IDs, and metrics exactly.
- Reload preserves record count and a deterministic dataset checksum.

## 8. Evidence gates

### G2.1 — local-safe core

- Validated local persistence.
- Detail/edit/delete/undo flow.
- Storage error is visible.
- Unit tests run without external services.
- Existing `/plan` remains unchanged.

### G3 — hard test

- Build and journal test suite pass.
- Import edge fixtures cover duplicate external IDs, missing P&L, partial close, timezone, malformed rows, and fee signs.
- End-to-end flow passes: import -> correct -> analytics -> reload -> reimport -> export -> reset -> restore.
- No visible dead controls.
- Desktop and 390x844 mobile QA pass with keyboard/focus checks.

### G4 — forward / staging

- Kan dogfoods the Journal after demo trading for at least two weeks.
- At least 95% of closed trades have valid initial risk within 24 hours.
- Manual import correction rate is at most 10%.
- Staging Supabase reconciliation returns exact counts and metrics.

### G5 — production

Requires a separate B2 pre-deploy review and explicit confirmation from Kan.

Worst case: an auth, migration, or RLS error exposes or overwrites real financial data while the product appears to have saved it.

Circuit breakers:

- backup and tested restore;
- reversible migration and rollback script;
- user-scoped RLS tests;
- staging checksum reconciliation;
- no production action in the same step that introduces a new data contract.

## 9. Build order

1. Lock this takeover spec.
2. Add shared validation and versioned local repository boundary.
3. Add detail/edit/delete/undo correction flow.
4. Make import identity deterministic and remove guessed P&L.
5. Add automated domain tests and browser regression QA.
6. Simplify Quick Add and persist drafts.
7. Add recoverable export/restore.
8. Prepare Supabase migrations, RLS tests, backup, and rollback locally.
9. Run G3; then dogfood G4.
10. Ask Kan for explicit G5 confirmation before touching production.

## 10. Current decision

**CONTINUE locally; STOP-SHIP for real or production financial data.**

The next release is successful only when a trade can be imported or added, corrected in place, undone, reloaded, and recovered with the same metrics. More chart polish does not advance the gate.

## 11. G2.1 implementation record — 2026-07-15

Passed locally:

- validated, versioned persistence with visible recovery/read-only state;
- shared add/edit validation and derived R values;
- direct row inspection, edit, delete, Save & next, and Undo;
- deterministic import identity, duplicate quarantine, and no guessed currency P&L;
- 15/15 automated domain tests;
- compile and type-check through the production build;
- desktop and 390×844 browser QA, including correction count `2 -> 1 -> Undo -> 2`.

Still required before G3:

- group partial executions into one canonical position lifecycle;
- implement JSON restore and checksum reconciliation against export;
- simplify Quick Add and recover an unsaved draft after refresh;
- prepare authenticated Supabase schema, RLS tests, rollback, and staging reconciliation without mutating production.

## 12. G3 local-core implementation record — 2026-07-15

Passed locally:

- official cTrader Historical Trade columns map to the importer, including
  Position ID, Closing Deal ID, Volume in Units, Gross/Net P&L, Commission,
  Swap, and explicit-offset timestamps;
- partial closes group by account plus Position ID into one canonical trade,
  with weighted prices and immutable execution evidence;
- reimport is idempotent: identical evidence is a duplicate, lifecycle
  extensions update the canonical trade, and changed evidence is a conflict;
- storage schema v4 uses revision plus deterministic checksum, rejects corrupt
  datasets atomically, performs write/read-back verification, and syncs newer
  revisions across browser tabs;
- verified JSON backup includes SHA-256, trade count, schema version, and full
  semantic validation before an explicit Replace action;
- Quick Add exposes six essential capture groups, defaults to current time,
  keeps Advanced closed, saves a versioned draft, and only navigates after a
  durable commit;
- 28/28 journal tests pass and the production build compiles, type-checks, and
  renders all routes;
- browser QA passed add/draft reload/save/undo, import/reimport/undo, cross-tab
  revision sync, Settings safety controls, desktop, and 390x844 layouts.

Prepared but not accepted as G4:

- `supabase/staging` now contains an additive Journal schema, explicit Data API
  grants, user-scoped RLS, pgTAP negative tests, sync manifests, and rollback;
- the package is not applied because this machine has neither the Supabase CLI
  nor Docker, and the current app cookie is not a verified Supabase Auth
  session;
- full browser automation of selecting a downloaded backup file and restoring
  it remains a separate recovery hard test, although backup creation and
  inspection are covered by automated domain tests;
- pre-v4 local duplicates are intentionally preserved. Automatic historical
  deduplication would be destructive and requires a reviewed cleanup preview.

Current gate: **G3 local core accepted; Supabase staging execution and G4
dogfood remain open. Production remains STOP-SHIP.**

## 13. G3 recovery and accessibility hardening — 2026-07-15

New verified behavior:

- destructive actions no longer use blocking browser confirmation. Start clean
  and Load demo now show an inline two-step confirmation with Cancel focused
  first, an explicit result count, and immediate Undo;
- browser check: Cancel preserved revision 6 and 43 trades; Confirm clear wrote
  revision 7 with 0 trades; Undo wrote revision 8 and restored 43 trades with
  checksum `0e176be2`; reload preserved revision 8 and the same checksum;
- the trade inspector now traps Tab and Shift+Tab, closes on Escape, and returns
  focus to the exact table row that opened it;
- CSV and backup file inputs are real accessible controls in the browser tree,
  can receive a visible parent focus ring, and measure at least 44.5px on the
  390x844 viewport;
- no visible interactive target on Settings or Quick Add measured below 44px,
  and neither surface has horizontal overflow at 390x844;
- unsupported Add setup and Edit setup controls were removed. Playbook now
  states that its local templates are read-only instead of presenting dead
  actions;
- the download helper now attaches its hidden anchor before click and delays
  cleanup, improving compatibility with browsers that reject detached download
  anchors;
- a recovery integration test now executes export, clear, backup inspection,
  restore, storage serialization, reload, checksum comparison, ID comparison,
  and metric comparison through the same domain boundaries as the app;
- 29/29 Journal tests, TypeScript validation, and the optimized Next.js build
  pass after these changes.

Remaining G3 limitation:

- the in-app Browser security policy blocks opening exported `blob:` URLs and
  does not expose native file chooser automation. The export control, accessible
  file input, backup parser, restore commit, clear/Undo UI, and complete recovery
  domain sequence are verified separately, but selecting the downloaded file in
  the native chooser is still a manual smoke check.

Current gate remains **G3 local core accepted with one manual chooser check;
G4 and G5 are not accepted.**

## 14. G3.1 daily context continuity — 2026-07-15

Implemented and verified locally:

- one validated, versioned date-range preference now drives Overview, Trades,
  and Analytics; valid URL context overrides the saved preference and every
  primary navigation link carries it;
- Analytics now filters every metric/group and displays visible versus total
  records, closing the prior truthful-control gap;
- Overview opens the exact recent trade through an encoded `trade` query and
  links incomplete data directly into the existing Missing-risk correction
  queue;
- Trades restores valid `trade` and `quality=missing` deep links, updates URL
  context during direct manipulation, and removes unknown/closed selections;
- browser QA passed range navigation, Analytics range change, reload
  persistence, exact-record open/close, invalid trade rejection, and
  Missing-risk filtering without application errors or overflow;
- 47/47 tests, TypeScript, the optimized 69-route build, and a zero-vulnerability
  dependency audit pass.

This closes the local date-context and exact-record navigation requirements.
The next local slice is a user-owned `TradingAccount` entity. G4 staging
execution and G5 production approval remain open and STOP-SHIP.

## 15. G3.2 account context and local daily-use hardening — 2026-07-15

Implemented and verified locally:

- introduced a validated `TradingAccount` entity and storage schema v5, with
  accounts, active account, and trades committed atomically under one revision
  and deterministic full-snapshot checksum;
- v4/v3/v2 payloads infer accounts without changing trade ownership; the active
  browser payload migrated from v4 and retained all 43 trades;
- Overview, Trades, Analytics, Quick Add, Trade Editor, and CSV Import now share
  one real active-account context instead of a hard-coded display control;
- lists, metrics, completeness, and grouped Analytics are account-scoped;
  currency and reporting timezone drive money/date display and timezone-safe
  datetime-local capture, including rejection of nonexistent DST wall times;
- Settings now supports add, edit, select, guarded empty-account delete, inline
  confirmation, and immediate Undo; empty accounts show a focused Add/Import
  state instead of misleading zero metrics;
- backup schema v2 protects accounts, active context, and trades with SHA-256;
  verified v1 backups still migrate safely;
- browser QA passed account creation, New York/USD capture, account isolation,
  Analytics isolation, delete and Undo, with all QA records removed afterward;
- 55/55 Journal tests, TypeScript, the optimized 69-route build, and a
  zero-vulnerability dependency audit pass.

This accepts G3.2 local account context. It does not apply or authorize remote
financial data changes. G4 staging execution and G5 production approval remain
open and STOP-SHIP.

## 16. G3.3 bounded local import and storage — 2026-07-15

Implemented and verified locally:

- benchmarked the production CSV parser and v5 snapshot serializer before
  choosing limits; parser throughput was acceptable, while unbounded issue
  rendering and browser storage were the first practical bottlenecks;
- locked and enforced a 4 MiB CSV byte limit, 10,000 logical data-row limit,
  100-row issue-render window, and 4,000,000-character serialized snapshot soft
  limit;
- overflow rejects atomically without partial trades, state mutation, revision
  increment, or storage write;
- an already valid oversized snapshot may only shrink strictly, avoiding a
  cleanup deadlock while blocking equal-size and growing writes;
- import guidance exposes the limits before selection, and sample preview keeps
  truthful full counts while explaining hidden issues;
- browser QA passed sample preview, visible limit copy, reload persistence, and
  a clean error/warning log;
- 60/60 Journal tests, TypeScript, the optimized 69-route build, and the current
  zero-vulnerability dependency audit pass.

The in-app Browser still cannot automate the native file chooser, so selecting a
real oversized file remains a manual smoke check. Both the pre-read `File.size`
boundary and the parser's direct-string boundary are covered by automated tests.

This accepts G3.3 local import hardening only. G4 staging execution and G5
production approval remain open and STOP-SHIP.

## 17. G3.4 first-value import handoff — 2026-07-15

Implemented and verified locally:

- the empty-account state now makes cTrader CSV Import the dominant path and
  keeps manual Add available without presenting two competing primary actions;
- import preview counts are dimensionally truthful: trades, issues, and rows are
  labeled separately, including a canonical missing-risk trade count;
- successful and duplicate-only attempts keep a focused receipt in the import
  panel instead of moving feedback outside the user's scroll context;
- the receipt gives one data-dependent next step: resolve missing risk when it
  remains after merge, otherwise view Trades; Overview stays secondary;
- contextual Undo is bound to the exact committed revision, duplicate-only
  receipts cannot expose stale Undo, and newer revisions invalidate old receipts;
- user-corrected Initial risk remains authoritative across broker reimport and is
  not falsely reported missing;
- browser hard tests passed committed receipt, duplicate-only receipt,
  contextual Undo, empty state, Missing-risk handoff, reload, and cross-route
  global Undo. Every QA mutation was reversed, ending at 43 trades and checksum
  `f51c3f6b`;
- the 390x844 receipt has no horizontal overflow and approximately 46px action
  targets; desktop and mobile Browser logs are clean;
- 61/61 Journal tests, TypeScript, and the optimized 69-route build pass.

This accepts G3.4 local first-value UX. The next gate is G4 authenticated staging
plus two-week demo-account dogfood evidence. G5 production remains STOP-SHIP and
still requires a separate B2 review and Kan's explicit confirmation.

## 18. G4 dogfood evidence instrumentation — 2026-07-15

Implemented and verified locally:

- a separate versioned and checksummed dogfood ledger now records only the
  minimum privacy-safe evidence needed for the locked two-week gate;
- explicit start locks the run to the active account and excludes seed data and
  all trades closed before start, so the existing 43 records cannot manufacture
  a pass;
- verified Journal commits update first-seen, timely-risk, import-correction,
  deletion/restoration, and active-day evidence; storage recovery, revision
  conflict, and persistence failure are separate bounded reliability incidents;
- a corrupt or unwritable evidence ledger is visible in Settings but never
  disables Journal or rolls back a verified primary commit;
- Settings exposes a sparse five-measure scorecard plus deterministic privacy-
  safe export and never labels local evidence as `G4 passed`;
- browser hard test on an isolated origin verified start, reload persistence,
  a valid-risk commit, and live cross-tab movement to Cohort `1/10`, Risk
  `100%`, Reliability `0`;
- 390x844 QA verified the scorecard's two-column layout, full-width final metric
  and export action, with no horizontal overflow;
- 71/71 Journal tests, TypeScript, and the optimized 69-route build pass.

Read-only external audit:

- the only connected Supabase project is not identified as disposable staging
  and already contains non-Journal finance tables;
- Security Advisor reported two public `SECURITY DEFINER` functions executable
  by API roles and one RLS-enabled table without a policy;
- the repo has no local Supabase environment configuration, so authenticated
  staging/identity evidence cannot be run;
- no remote SQL, branch, grant, row, secret, environment, or production state
  was changed.

Current gate: **G4 instrumentation is ready but G4 remains open.** Kan must
explicitly start the intended demo-account run, collect at least 14x24 hours and
the locked minimum samples, and separately identify a disposable authenticated
staging project. G5 production remains STOP-SHIP.

## 19. G3.5 account-bound Quick Add drafts — 2026-07-15

Implemented and verified locally:

- replaced the global context-free v1 Quick Add draft with schema v2 carrying
  account ID, reporting timezone, base currency, and persistent currency-review
  provenance;
- each account now restores its own draft. Account transition cannot render,
  autosave, or submit the previous account's fields under the new context;
- legacy v1 migrates once into the active account with read-back verification;
  account mismatch and corrupt payloads remain recoverable raw evidence;
- timezone edits preserve the original instant, while currency edits never
  guess FX conversion and require an explicit `Values reviewed` action that
  survives reload;
- a successful trade commit removes only its account draft; browser QA proved a
  second account's draft remains intact;
- isolated Browser hard test passed THB/Bangkok ↔ USD/New York switching,
  distinct values, reload, selective commit cleanup, and New York/USD → UTC/EUR
  context adaptation; all slice-specific QA artifacts were removed;
- 390x844 QA measured `375px` client and scroll widths with a `44px` minimum
  visible target; six essential groups, collapsed Advanced, fixed bottom nav,
  and Cerfinits visual language remain unchanged;
- 75/75 Journal tests, TypeScript, and the optimized 69-route build pass.

Current gate: **G3.5 local daily-use continuity accepted.** G4 still requires
Kan to start and complete the two-week demo evidence run plus a separately
identified disposable authenticated staging environment. G5 production remains
STOP-SHIP.

## 20. G4 staging evidence contract — 2026-07-15

Prepared locally without applying remote SQL:

- Sync Projection v1 now excludes browser-only seed fixtures, and the staging
  source constraint accepts only manual and cTrader-imported trades;
- execution rows, import rows, and sync manifests are append-only to the
  authenticated Data API surface, preventing selective evidence edits/deletes;
- complete owned trade and import-batch deletion still owns its full child
  cascade, preserving a clear lifecycle instead of orphan evidence;
- the staging manifest is now whole-Journal and matches the browser contract:
  projection/storage versions, SHA-256 algorithm and digest, global counts,
  Net R, revision, and per-account fingerprints;
- a local SQL contract suite guards the prepared artifact, while the expanded
  48-assertion pgTAP suite is reserved for a disposable Supabase stack.
- 80/80 local Journal tests, TypeScript, and the optimized 69-route production
  build pass. The build's six blocked outbound fetch attempts are the known
  restricted-workstation condition and do not affect Journal compilation.

Current gate: **schema contract prepared, not staged.** A future write procedure
must commit rows and the manifest in one tested transaction. Live pgTAP,
advisor, staged reconciliation, rollback/restore evidence, and Kan's explicit
confirmation remain required; production and remote writes remain STOP-SHIP.

## 21. G3.6 mobile Save feedback — 2026-07-15

Live usability audit reproduced a daily-flow dead end: at 390x844, tapping the
top Save action on an incomplete draft created `กรุณาระบุ Symbol` around
`1413px`, outside the 845px viewport, while focus stayed on Save. The visible
result looked inert.

Implemented and verified locally:

- the mobile Add header is sticky and replaces the redundant generic Journal
  topbar only on `/journal/add`, leaving one compact Cerfinits header;
- one compact alert is inserted below the header and remains visible while the
  user is anywhere in the form;
- deterministic validation-to-draft mapping focuses and scrolls the first
  blocked field; Advanced details opens first when its field is the target;
- the focused field carries `aria-invalid` and `aria-describedby`, while any
  edit clears stale commit feedback;
- the original failure now renders the alert at approximately `124px`, focuses
  Symbol, and stays visible. At deep scroll, Save remains available and returns
  the blocked field to view;
- mobile and desktop have no horizontal overflow or relevant console errors;
  83/83 Journal tests, TypeScript, and the optimized 69-route build pass.

Current gate: **G3.6 daily-use feedback accepted locally.** This changes no
validation rule, financial value, Review decision, remote data, or dogfood
state. G4/G5 external gates remain unchanged.

## 22. G3.7 desktop one-click capture — 2026-07-15

Live usability audit reproduced a desktop navigation detour: `/journal` had
zero visible Add links because the only Add entry belonged to the hidden mobile
navigation. Manual capture required opening Trades first.

Implemented and verified locally:

- the desktop sidebar now exposes one adaptive capture group on every Journal
  page and preserves the selected range query;
- populated active accounts show Add trade first and primary, reaching
  `/journal/add?range=30d` in one click; Import remains directly available as a
  secondary action;
- empty active accounts keep Import first and primary while Add stays visible
  as the secondary alternative;
- priority is account-scoped, so trades owned by another account cannot change
  the active account's first action;
- `/journal/add` receives a restrained current-page treatment using the
  existing gold rule;
- at 390x844 the sidebar remains hidden and exactly one visible Add entry—the
  existing bottom-navigation action—remains; document client and scroll widths
  both measure `375px`;
- desktop client and scroll widths both measure `1265px`, Browser logs contain
  no errors or warnings, and the render remains faithful to the accepted
  Cerfinits overview reference;
- 85/85 Journal tests, TypeScript, and the optimized 69-route production build
  pass. The build's six blocked outbound fetch attempts remain the known
  restricted-workstation condition and do not affect Journal compilation.

Current gate: **G3.7 local daily capture accepted.** This introduces no trade
mutation, shortcut listener, Review surface, remote write, live-account action,
or dogfood evidence. Disposable staging proof and the 14-day G4 run remain
open; G5 production remains STOP-SHIP.

## 23. G3.8 mobile tab-bar continuity — 2026-07-15

Live Browser audit found two distinct navigation defects in the local preview:

- Add occupied column 4 of a five-column bottom bar. At a `375px` content
  width its center measured `262.5px`, `75px` right of the viewport center;
- the default bottom-left Next.js Dev Tools trigger rendered above the fixed
  Journal navigation. A visible Overview tap from Add left the route unchanged
  and moved focus into `NEXTJS-PORTAL`, with no Journal warning or error.

Implemented and verified locally:

- mobile order is now Overview, Trades, Add, Analytics, Settings, placing Add
  in grid column 3 of 5;
- Add center now measures exactly `187.5px`, matching the `375px` viewport
  center, while the document remains `375px` wide with no overflow;
- active desktop and mobile destinations expose `aria-current="page"`;
- Next.js development indicators are disabled so localhost interaction mirrors
  production tab-bar hit targets; terminal and browser diagnostics remain;
- Add -> Overview -> Add passed through real taps, preserved `range=30d`, and
  updated both heading and current-tab semantics on every transition;
- desktop retained its original side-navigation order, Add/Import priority,
  hidden bottom bar, and equal `1265px` client/scroll widths;
- Browser warning/error logs are empty; 85/85 Journal tests and TypeScript
  pass; the network-enabled optimized build generates all 69 routes. The
  existing Supabase Edge-runtime compatibility warning remains outside this UI
  slice and does not fail compilation.

Current gate: **G3.8 mobile navigation accepted locally.** No trade, draft,
financial value, remote state, Review decision, or dogfood evidence changed.
Disposable staging proof and the 14-day G4 run remain open; G5 production
remains STOP-SHIP.

## 24. G4 disposable staging environment audit — 2026-07-15

Current evidence:

- the workstation has no Docker-compatible runtime, Supabase CLI, or local
  Postgres/pgTAP tools, so the official isolated local stack cannot run;
- the only connected Supabase project is the Cerfinits main project and already
  contains finance tables; it is not a disposable target and remains untouched;
- branch listing failed at the connector permission boundary, so no existing
  disposable branch can be claimed from evidence;
- a new development branch currently quotes `$0.01344/hour` and therefore
  requires explicit cost confirmation;
- the locked recommendation is a branch with a two-hour teardown deadline and
  planned maximum exposure of approximately `$0.02688`, followed by verified
  rollback and deletion;
- current Supabase documentation/changelog confirms local Docker + CLI
  prerequisites, pgTAP testing, owner-bound RLS, and the April 2026 requirement
  for explicit Data API grants already present in the prepared schema.

Current gate: **G4 staging execution is waiting for new authority.** No project,
branch, schema, row, grant, secret, or billing state was changed. Kan must
explicitly confirm the quoted branch cost before creation. Production and real
financial data remain STOP-SHIP.
