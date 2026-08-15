# Trading Journal staging reconciliation — locked spec

Date: 2026-07-15  
Owner: Kan / Cerfinits  
Gate: G4 preparation only  
Decision: build a read-only authenticated staging comparison. Remote writes remain STOP-SHIP.

## One question

Can the authenticated user prove that the browser Journal and the rows visible through Supabase RLS represent the same analytically authoritative dataset, with zero remote writes?

## Scope

This slice may:

- derive a deterministic sync fingerprint from the current local Journal;
- read the authenticated user's staging rows through the normal Supabase SSR client;
- validate ownership and parent/child relationships before accepting remote rows;
- compare global and per-account fingerprints;
- report exact match or bounded differences in Settings.

This slice must not:

- insert, update, upsert, delete, call RPCs, or use a service-role key;
- send local trade rows to the server;
- expose staging comparison when Journal Auth or sync dry-run flags are off;
- treat a successful read as authorization for production or remote writes;
- silently normalize malformed or cross-owned remote data.

## Circuit breakers

The server route is available only when all conditions are true:

1. `JOURNAL_ENABLED=true`;
2. `JOURNAL_SUPABASE_AUTH_ENABLED=true` and Supabase public configuration is complete;
3. `JOURNAL_SYNC_ENABLED=true`;
4. `JOURNAL_SYNC_DRY_RUN=true`;
5. the request has a currently verified Supabase claim.

The resolved mode is one of:

- `disabled`: sync is not enabled;
- `misconfigured`: sync was requested without usable Supabase Auth/configuration;
- `writes-blocked`: sync was requested with dry-run disabled; no write path exists;
- `dry-run`: authenticated read and comparison are allowed.

Any mode except `dry-run` returns no staging data. Any read, validation, pagination, or ownership failure returns an error with `writesPerformed: 0` and no partial comparison.

## Sync projection v1

The backup checksum is not reused. Backup protects the complete browser artifact; sync projection v1 contains only fields that the staging schema can round-trip without changing meaning.

The global projection is an array of used accounts, sorted by `accountClientId`. Browser-only trades with `source = 'seed'` are excluded before grouping, so demo fixtures never become remote evidence. Empty remote account records are ignored because the browser does not yet own account metadata.

Each account contains trades sorted by local `clientId`. Each trade contains executions sorted by local `clientId`; tags are sorted lexicographically.

### Trade fields

- `clientId`
- `symbol`
- `side`
- `openedAt`
- `closedAt`
- `quantity`
- `averageEntry`
- `averageExit`
- `initialStop`
- `initialRiskAmount`
- `grossPnl`
- `commissionPnl`: local explicit value, otherwise `-fees`
- `swapPnl`: local `swap`
- `netPnl`
- `setup`
- `timeframe`
- `session`
- `marketCondition`
- `notes`
- `tags`
- `source`, restricted to `manual` or `ctrader-csv`
- `externalPositionId`, normalized to `null`
- `sourceEvidenceHash`, normalized to `null`
- `executions`

`rMultiple` is derived and omitted. It is recomputed as `netPnl / initialRiskAmount` when risk is eligible.

### Execution fields

- `clientId`
- `type`
- `side`
- `executedAt`
- `quantity`
- `price`
- `fee`
- `commissionPnl`: local explicit value, otherwise `-fee`
- `swapPnl`: local explicit value, otherwise `0`
- `externalId`, normalized to `null`
- `externalPositionId`, normalized to `null`
- `sourceHash`, normalized to `null`

Remote UUIDs, `user_id`, `created_at`, `updated_at`, local `sourceRow`, backup timestamps, and browser revision are excluded from the projection.

## Fingerprint and manifest

Projection objects are recursively canonicalized by sorted object keys. Arrays use the ordering above. SHA-256 is encoded as 64 lowercase hexadecimal characters.

A common fingerprint contains:

- `projectionVersion: 1`;
- `datasetSha256`;
- `accountCount`;
- `tradeCount`;
- `executionCount`;
- `eligibleRCount`;
- `netR`;
- per-account fingerprints with account client ID, checksum, counts, and Net R.

The local manifest additionally contains:

- `storageSchemaVersion: 5`;
- non-negative integer `revision`.

Comparison ignores revision because the remote UUID/timestamp lifecycle is independent. It requires exact checksums and counts. Net R is also compared with a maximum absolute tolerance of `1e-9` to make diagnostic output explicit; the checksum remains authoritative.

The prepared staging manifest table mirrors this whole-Journal contract with
`projection_version`, `storage_schema_version`, `checksum_algorithm`, global
checksum/counts/Net R, and the per-account fingerprint array. It is append-only
to authenticated clients and unique by user/revision. It remains non-
authoritative until a future write procedure commits data rows and the manifest
in one tested database transaction.

## Server read contract

Endpoint: `POST /api/journal/sync/preview`

Request body contains only the local manifest. It must be valid JSON, at most 64 KiB, use supported versions, contain lowercase SHA-256 values, non-negative safe-integer counts/revision, finite Net R values, unique account client IDs, and internally consistent account totals.

The route verifies the user again with `getClaims()`; middleware alone is not trusted as authorization.

The reader:

- uses the authenticated SSR client and never a service-role client;
- selects explicit columns only;
- applies `user_id = verified subject` in every query as defense in depth in addition to RLS;
- reads accounts, trades, and executions in parallel;
- paginates every table with inclusive `range()` windows of 500 rows until exhausted;
- stops safely if any table exceeds 100,000 rows in one comparison;
- runtime-validates every returned field;
- maps remote account UUIDs to account `client_id` and remote trade UUIDs to trade `client_id`;
- rejects duplicate remote UUIDs/client IDs, missing parents, ownership mismatch, invalid numbers/dates/enums, and P&L reconciliation outside the schema tolerance;
- ignores remote accounts with no trades when constructing projection v1.

Response is `Cache-Control: no-store` and always includes `writesPerformed: 0`.

Success includes:

- `match`;
- `remote` fingerprint;
- bounded difference codes for global checksum/count/Net R and missing, extra, or mismatched accounts.

The route does not echo local financial rows or remote financial rows.

## Settings UX

The staging section renders only when the server resolves `dry-run` mode. It states `Dry-run · 0 writes` and offers one action: `Check staging match`.

The UI derives the local manifest in the browser and sends only that manifest. Results are:

- exact match: clear green confirmation and the compared counts;
- mismatch: neutral warning with bounded difference labels, not raw rows;
- unavailable/error: no claim of synchronization and no mutation of local data.

The action never changes Journal data and must remain usable without leaving Settings.

## Acceptance tests

1. Projection checksum is stable across input trade, execution, tag, and account ordering.
2. Equivalent local and remote rows match despite different remote UUIDs and normalized optional commission/swap fields.
3. A changed authoritative field produces a checksum and account mismatch.
4. Browser seed fixtures are excluded locally and rejected as a remote source.
5. Invalid manifests, duplicate account client IDs, inconsistent totals, and unsupported versions are rejected.
6. Missing or cross-owned account/trade relationships are rejected before hashing.
7. Pagination reads beyond 1,000 rows without truncation and stops after a short page.
8. Auth-disabled, sync-disabled, misconfigured, signed-out, and non-dry-run states return no staging comparison.
9. No code path in this slice calls a remote mutation method; every response reports `writesPerformed: 0`.
10. Existing local-only preview behavior is unchanged when flags are false.
11. Unit tests, TypeScript, production build, dependency audit, and localhost Settings QA pass.

## STOP-SHIP after this slice

Remote write, migration, production enablement, and any operation involving real financial data remain blocked until:

- a disposable staging Supabase project is explicitly provided;
- schema and RLS tests pass with two distinct authenticated users;
- the read-only comparison is exercised against staged fixtures and matches;
- account metadata ownership is designed because the current browser model stores only account IDs;
- a future write procedure transactionally commits remote rows and their whole-Journal manifest;
- rollback and backup evidence are captured;
- Kan explicitly confirms the Real-Money Protocol for the next gate.
