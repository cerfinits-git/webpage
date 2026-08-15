# Trading Journal staging evidence contract — locked spec

Date: 2026-07-15  
Owner: Kan / Cerfinits  
Gate: G4 preparation only  
Decision: harden the unapplied staging schema without enabling remote writes.

## One question

Can the future staging write path preserve trustworthy import and execution
evidence while storing the same whole-Journal checksum contract that the
browser already validates?

## Locked decisions

1. Demo seed trades are browser-only fixtures. Sync Projection v1 excludes
   `source = 'seed'`, and the remote schema accepts only `manual` and
   `ctrader-csv` trades.
2. Execution rows, import rows, and sync manifests are append-only to the
   authenticated Data API surface: authenticated users receive `SELECT` and
   `INSERT`, but no direct `UPDATE` or `DELETE` grant or policy.
3. Parent lifecycle deletion remains explicit. Deleting an owned trade may
   cascade all of its executions; deleting an owned import batch may cascade
   all of its import rows. This permits deleting a complete user-owned object
   without allowing selective evidence removal.
4. A sync manifest represents the whole Journal for one user and revision, not
   one account. It stores projection version, storage schema version, checksum
   algorithm, global SHA-256, global counts, Net R, and the validated
   per-account fingerprint array.
5. Manifests are unique by `(user_id, revision)` and append-only. Comparison
   still ignores revision and uses the checksum as authority.
6. `anon` and `public` receive no Journal table grants. Every Journal table has
   RLS enabled and every authenticated policy is owner-bound through
   `auth.uid()`.

## Invariants

- SHA-256 values are 64 lowercase hexadecimal characters.
- `projection_version = 1` and `checksum_algorithm = 'sha256'` in this locked
  contract.
- counts and revision are non-negative; eligible-R count cannot exceed trade
  count; account fingerprints must be a JSON array.
- a user cannot read or insert another user's accounts, trades, executions,
  import evidence, or manifests.
- direct evidence-row deletion fails at the grant boundary even when the row is
  owned.
- deleting an owned parent removes its owned child evidence through the
  declared foreign-key cascade.

## Verification layers

1. A local static contract test checks that the prepared SQL retains the
   locked grants, source allowlist, manifest columns, RLS declarations, and
   absence of direct evidence delete policies.
2. The pgTAP suite must run against a disposable local/staging Supabase stack
   and prove grants, two-user RLS isolation, data constraints, append-only
   evidence, and parent cascades.
3. A staged read-only reconciliation must match Sync Projection v1 before any
   remote mutation path is designed.

## STOP-SHIP after this slice

- The SQL remains an unapplied staging artifact.
- No remote insert, update, upsert, delete, RPC, or service-role path is added.
- The future write batch and manifest must be committed in one database
  transaction; the transaction procedure does not exist yet.
- Disposable staging credentials, a passing live pgTAP run, advisor results,
  backup/restore evidence, and Kan's explicit Real-Money Protocol confirmation
  are still required before G5.
