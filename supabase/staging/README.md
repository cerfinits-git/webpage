# Cerfinits Journal Supabase staging package

Status: **prepared, not applied**. Production and remote writes remain STOP-SHIP.

Supabase SSR Auth and Journal route protection are implemented in the app, but no disposable staging project or authenticated staging session is configured on this workstation. A feature-flagged read-only comparison endpoint now exists; it is unavailable by default and contains no mutation path.

## Contents

- `journal_schema.sql` — user-owned accounts/trades, append-only evidence leaves, whole-Journal sync manifests, explicit grants, and RLS.
- `journal_rls.test.sql` — 48 pgTAP assertions for structure, grants, two-user RLS, invariants, append-only evidence, and parent cascades.
- `journal_rollback.sql` — reverse-order teardown for disposable staging only.
- `../../docs/2026-07-15-trading-journal-staging-reconciliation-spec.md` — locked Sync Projection v1 and zero-write comparison contract.
- `../../docs/2026-07-15-trading-journal-staging-evidence-contract.md` — locked remote provenance and manifest contract.
- `../../docs/2026-07-15-trading-journal-disposable-staging-audit.md` — current environment, branch cost, and bounded teardown protocol.

## Gate order

1. Supabase Auth protection is complete in code; configure it only against a disposable staging project.
2. Install a pinned Supabase CLI version and commit its version/lock evidence.
3. Initialize a disposable local project, then use the CLI's current `--help` output to create a migration from `journal_schema.sql`.
4. Start the local stack and run the pgTAP suite with two distinct authenticated users.
5. Run Database and Security advisors and resolve every error.
6. Seed copied fixtures, enable authenticated dry-run flags, and reconcile account, trade, execution, eligible-R, Net R, and Sync Projection v1 SHA-256 values.
7. Repeat on a separate staging project. Do not link or push to production.

## Circuit breakers

- `JOURNAL_SYNC_ENABLED` defaults to `false`.
- `JOURNAL_SYNC_DRY_RUN` defaults to `true`.
- The runtime accepts remote reads only when Supabase Auth and both sync flags resolve to dry-run mode.
- The preview route sends a manifest only, reads explicit columns with the authenticated client, caps each table at 100,000 rows, and always reports `writesPerformed: 0`.
- A checksum/count mismatch stops the flow; it never hydrates, merges, or becomes last-write-wins.
- Browser-only `seed` fixtures are excluded from Sync Projection v1 and rejected by the remote trade source constraint.
- Execution rows, import rows, and sync manifests expose only `SELECT` and `INSERT` to `authenticated`; selective update/delete is unavailable.
- Owned trade and import-batch deletion may remove all child evidence through declared cascades. The pgTAP suite must prove this complete-parent lifecycle behavior.
- `anon` receives no Journal table grants.
- The SQL manifest now stores the whole-Journal v1 checksum contract. It is not authoritative until a future write procedure commits rows and its manifest in one tested transaction.
- Production requires a fresh backup, tested restore, reviewed migration diff, passing RLS tests, staged reconciliation, and Kan's explicit G5 confirmation.

## Current environment limitation — verified 2026-07-15

The workstation does not have the Supabase CLI, Docker-compatible runtime,
`psql`, `pg_isready`, or `pg_prove`. The only connected remote project already
contains Cerfinits finance tables and is not disposable. A development branch
currently quotes `$0.01344/hour`; creating it requires Kan's explicit cost
confirmation and the bounded teardown protocol in the audit above. Local static
contract tests can inspect the prepared SQL, but cannot replace the live
48-assertion pgTAP run. These artifacts are not evidence that G4 has passed.
