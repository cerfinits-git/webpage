# Cerfinits Trading Journal — Disposable Staging Audit

- Date: 2026-07-15
- Owner: Kan / Cerfinits
- Track: Product + Build/Dev
- AI-OS gate: G4 environment prerequisite / Real-Money Protocol
- Status: BLOCKED pending explicit cost confirmation

## 1. One question

What is the smallest environment that can prove the prepared Journal schema,
48-assertion pgTAP suite, authenticated RLS, reconciliation, and rollback
without exposing or changing the Cerfinits main project?

## 2. Current facts

- This workstation has Node.js `v26.3.1`, but no Docker-compatible runtime,
  Supabase CLI, `psql`, `pg_isready`, or `pg_prove`.
- Official local development requires the Supabase CLI plus a Docker-compatible
  container runtime. A CLI-only install cannot run the required stack or pgTAP
  proof.
- The connected organization currently exposes one healthy Supabase project:
  `crzins's Project` (`vbdwurmfwidyxewrusjf`).
- Its public schema contains `allowed_emails`, `profiles`, `transactions`,
  `goals`, and `price_cache`; it contains no Journal tables. Because it already
  holds Cerfinits finance surfaces, it is not disposable staging.
- A read-only branch-list request failed at the connector permission boundary
  with `Project reference is missing when validating permissions`; this is not
  evidence that no branch exists.
- The current quoted development-branch cost is `$0.01344` per hour.
- The April 2026 Data API change makes explicit grants necessary. The prepared
  schema already revokes implicit access, grants only the intended authenticated
  operations, enables RLS on all six Journal tables, and grants nothing to
  `anon`.
- The current self-hosted/local default aligns with Postgres 17. The prepared
  Journal schema uses no extension removed by that change; pgTAP remains the
  required test extension.

## 3. Options

### A. Install Docker Desktop and Supabase CLI locally

No cloud cost and fully disposable, but this is a material workstation change,
requires a container runtime download, and cannot be completed from the current
environment without Kan authorizing installation.

### B. Create a Supabase development branch — recommended

The connector states that a branch applies main-project migrations to a fresh
database without carrying production data. It is the shortest environment that
can run the migration, pgTAP, advisor, reconciliation, and rollback sequence.
It creates a billable remote resource, so it requires explicit confirmation.

### C. Apply directly to `crzins's Project`

Rejected. It mixes an unproven Journal contract with the only connected
Cerfinits project and violates the production-data STOP-SHIP.

## 4. Locked bounded branch protocol

Proceed only after Kan explicitly confirms the quoted branch cost.

1. Confirm `$0.01344/hour` through the connector immediately before creation.
2. Create one branch named `journal-g4-disposable` from project
   `vbdwurmfwidyxewrusjf`.
3. Start a two-hour teardown deadline. Maximum planned exposure:
   `$0.02688`, excluding any provider rounding not shown by the quote.
4. Verify the branch has no copied production rows before applying Journal SQL.
5. Apply `journal_schema.sql` only to the branch.
6. Run the 48-assertion pgTAP suite with two users, then security/performance
   advisors and read-only Sync Projection v1 reconciliation.
7. Capture counts, checksums, Net R, advisor output, and `writesPerformed: 0`.
8. Run the rollback and prove all six Journal tables are absent.
9. Delete the branch immediately and verify it no longer appears in branch
   status. Do not merge, rebase, reset main, or keep the branch for convenience.

## 5. Real-Money Protocol

- **Worst case:** branch teardown fails or is forgotten and hourly billing
  continues; a mistaken project identifier could apply the schema to the main
  project.
- **Probability:** low after connector-ID checks and a single disposable branch,
  but non-zero because branch listing already returned a connector permission
  error.
- **Planned exposure:** at most two hours, approximately `$0.02688` at the
  current quote.
- **Circuit breakers:** explicit cost confirmation; assert branch project ID is
  different from main before every DDL/query; no service-role client in the app;
  no main-project migration; no merge; two-hour deadline; delete and verify.
- **Stop immediately if:** the branch ID equals main, production rows appear,
  pgTAP fails, advisor returns an unresolved security error, reconciliation
  differs, rollback leaves a Journal object, or branch deletion cannot be
  verified.

## 6. Required confirmation

Kan must explicitly approve creating the billable development branch at the
current `$0.01344/hour` quote with the two-hour `$0.02688` planned cap. Approval
of this branch does not authorize production migration, deployment, or any
operation on real financial data.

## 7. Sources checked

- https://supabase.com/docs/guides/local-development
- https://supabase.com/docs/guides/local-development/cli/testing-and-linting
- https://supabase.com/docs/guides/database/testing
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/changelog?tags=breaking-change

