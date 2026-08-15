# Trading Journal dogfood evidence — locked spec

Date: 2026-07-15  
Gate: G4 preparation; local demo evidence only  
AI-OS: B1 feature grill  
Decision: instrument the two-week demo-account gate locally before any remote
schema or production action.

## Current evidence and blocker

The connected Supabase account exposes one active project named `crzins's
Project`. It is not identified as a disposable staging project and already
contains non-Journal finance tables. A read-only Security Advisor check reports
two public `SECURITY DEFINER` functions executable by `anon` and
`authenticated`, plus one RLS-enabled table without a policy. These findings do
not prove an exploit, but they make the project unsuitable for an unreviewed
Journal staging apply.

The repo has no `.env.local`; Journal Auth and sync dry-run cannot execute
against a real session. The prepared Journal SQL has explicit authenticated-only
grants, which is required by Supabase's April/May 2026 Data API default change,
but it remains unapplied. G4 staging is therefore not accepted.

## Real problem and user

Kan needs evidence that the Journal is reliable and fast enough for daily demo
trading. The locked G4 gate asks for two weeks of use, at least 95% timely Initial
risk completion, at most 10% import correction, and no observed data-loss or
identity-isolation failure. The current app stores only the latest trade state,
so it cannot prove when a trade first appeared, when risk became valid, or
whether an imported trade initially required manual correction.

## Smallest solution that fixes 80%

1. Add a separate versioned, checksummed local dogfood ledger. It records only
   timing, pseudonymous trade identity, source, risk-completion state, and
   reliability incidents; it does not duplicate prices, P&L, notes, or raw CSV.
2. Start the run explicitly for the active account. Existing seed/history is
   excluded; the cohort contains non-seed trades closed at or after `startedAt`.
3. Record first observation and first valid Initial risk time. Timely means
   `riskCompletedAt <= closedAt + 24 hours`.
4. Mark an imported trade as needing correction when its effective canonical
   Initial risk is missing at first observation. Later reimports never erase a
   user correction.
5. Record Journal recovery, conflict, and persistence failures as reliability
   incidents without blocking the primary Journal commit.
6. Show a compact Settings scorecard and export a deterministic JSON evidence
   report. The report is explicitly local-clock evidence, not tamper-proof
   compliance evidence.

## Gate calculation

- Duration: at least 14 x 24 hours from explicit start.
- Minimum useful cohort: 10 non-seed closed trades still present in the tracked
  account. Empty or tiny cohorts cannot pass.
- Timely risk: at least 95% of the cohort has valid Initial risk within 24 hours
  of close.
- Import correction: at least 10 cTrader-imported cohort trades and no more than
  10% were first observed without valid Initial risk.
- Reliability: zero recorded Journal recovery, revision-conflict, or persistence
  failure incidents.
- Staging and identity isolation remain separate requirements; the local
  scorecard can become `Local gate ready`, never `G4 passed` by itself.

## Cut from this slice

- Supabase schema apply, branch creation, seed, or remote writes;
- production env configuration, deployment, or real financial data;
- analytics SaaS, tracking pixels, notifications, or background sync;
- raw CSV rows, P&L, prices, notes, or account credentials in evidence;
- claiming localStorage evidence is tamper-proof;
- retroactively guessing timing for the 43 existing demo records.

## Edge cases and circuit breakers

1. Browser clock changes can distort duration; the exported report states the
   clock limitation and includes generated/start timestamps.
2. A corrupt evidence ledger never disables Journal writes and is never silently
   replaced. The scorecard reports `Evidence unavailable`.
3. Evidence writes use read-merge-write plus read-back validation. Cross-tab
   storage events refresh the scorecard.
4. A deleted cohort trade remains in evidence with `deletedAt`; deletion cannot
   erase its history. Deleted trades are reported separately and excluded from
   pass-rate denominators.
5. Imported lifecycle updates retain first-seen and initial-correction facts.
6. Restoring a backup observes only eligible post-start trades and never invents
   timestamps for pre-start history.
7. Starting is blocked while another run exists; this slice has no silent reset.
8. Dogfood evidence failure is visible but never rolls back an already verified
   Journal commit.

## Definition of done

1. Idle Settings shows one obvious `Start 14-day dogfood` action for the active
   account and explains that no remote write occurs.
2. Start, reload, add/import, risk correction, delete, and cross-tab observation
   preserve a valid checksummed ledger.
3. Unit tests cover empty/ready/corrupt parsing, cohort boundaries, 24-hour
   boundary, correction preservation, deletion, minimum samples, thresholds,
   and deterministic export.
4. Scorecard never labels G4 passed; it distinguishes collecting, insufficient,
   local-ready, and failed states.
5. Export contains summary, pseudonymous evidence, checksum, and limitations but
   no financial values.
6. TypeScript, Journal tests, optimized build, desktop/mobile browser QA, reload,
   focus, and clean console checks pass.

## Gate

CONTINUE local instrumentation. STOP-SHIP for the connected Supabase project,
remote schema changes, staging claims, and production. A separate disposable
staging project must be explicitly identified before the prepared SQL is run.

## Implementation evidence — 2026-07-15

- Added a separate v1 FNV-checksummed ledger under its own browser key. It stores
  only pseudonymous identity, timing, source, risk state, deletion/restoration,
  active days, and bounded reliability incidents.
- Verified Journal commits observe the resulting durable snapshot. Recovery,
  revision conflict, and persistence failure paths attempt to add an incident;
  tracker failure is isolated and never changes the primary commit result.
- Settings now has one explicit start action, a five-measure scorecard, truthful
  collecting/insufficient/local-ready/failed states, account mismatch guidance,
  and privacy-safe deterministic export. There is no reset or remote action.
- Boundary tests cover tampering, start-time inclusion, seed/history/account
  exclusion, exact 24-hour completion, import correction preservation,
  delete/restore, minimum samples, both failure thresholds, incidents, and
  report privacy/determinism.
- Browser hard test on an isolated origin started a run, committed a valid-risk
  manual trade in a second tab, and observed `Cohort 1/10`, `Risk 100%`, and
  `Reliability 0` in the first tab. Reload retained the run.
- Desktop and 390x844 render checks preserve the Cerfinits minimal language; the
  mobile scorecard becomes two columns with a full-width reliability row and
  export action without horizontal overflow.
- The final localhost preview still has the original 43 trades and revision 32;
  the dogfood tracker remains idle there, so no historical trade was enrolled.
- 71/71 Journal tests, TypeScript validation, and the optimized 69-route build
  pass. No Supabase branch, migration, grant, row, environment, or production
  configuration was changed.

Current result: **instrumentation ready; G4 not passed.** The next valid action
is Kan explicitly starting the run on the intended demo account. A separate,
explicitly identified disposable Supabase staging environment is still required
before the staging/identity portion of G4 can begin.
