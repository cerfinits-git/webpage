# Trading Journal import budget — locked spec

Date: 2026-07-15  
Gate: G3.3 local import hardening  
AI-OS: B1 feature grill  
Decision: bound CSV parsing, preview rendering, and local snapshot growth before a broker export can freeze the UI or fail at the final storage write.

## Problem and user

Kan needs to import real cTrader history without guessing whether a large file will hang the browser or exceed `localStorage`. The current parser reads the whole file, accepts an unbounded row count, retains every issue, and renders every issue as a list item. The durable commit catches a browser quota failure, but only after the user waits through parsing and preview.

## Cheap-test evidence

Synthetic official-column rows were parsed through the production parser on this machine:

| Data rows | CSV size | Parse time | Heap delta | Canonical trades | Issues |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1,000 | 0.09 MB | 17 ms | 3.6 MB | 1,000 | 1,000 |
| 10,000 | 0.90 MB | 160 ms | 20.6 MB | 10,000 | 10,000 |
| 25,000 | 2.25 MB | 395 ms | 33.0 MB | 25,000 | 25,000 |

The parser is not the first bottleneck. Rendering 10,000–25,000 issue rows is unbounded, and serialized storage grows by about 990 characters per one-execution trade:

| Canonical trades | Storage JSON |
| ---: | ---: |
| 1,000 | 0.94 MB |
| 2,000 | 1.88 MB |
| 3,000 | 2.83 MB |
| 5,000 | 4.72 MB |

Browser storage quotas vary, so a product that waits for `QuotaExceededError` is not predictable enough for daily use.

## Smallest solution that fixes 80%

1. Reject a CSV before reading when `File.size` exceeds 4 MiB.
2. Apply the same UTF-8 byte limit inside the parser for non-File callers.
3. Stop parsing after 10,000 data rows and reject the whole preview; no partial preview or import is allowed.
4. Render at most the first 100 issues while preserving truthful total counts and explaining how many are hidden.
5. Refuse any Journal mutation whose serialized v5 snapshot exceeds 4,000,000 characters before calling `localStorage.setItem`, except a strict monotonic shrink of an already stored oversized snapshot.
6. Keep the source file, current snapshot, form, and draft unchanged after every rejection.

The row limit protects CPU/memory abuse and the snapshot budget protects the much tighter durable-storage boundary. They are separate circuit breakers because partial closes can create many CSV rows but few trades, while compact one-row positions create a large canonical snapshot quickly.

## Cut from this slice

- streaming CSV parsing;
- IndexedDB or OPFS migration;
- server uploads or Supabase writes;
- background workers and progress bars;
- automatic file splitting;
- deleting or compacting existing trades to make room;
- claiming the remaining browser quota can be measured portably.

## Edge cases and circuit breakers

1. The header does not count as a data row.
2. Quoted newlines remain one logical CSV row.
3. A file at exactly 4 MiB is allowed; one byte over is rejected.
4. Exactly 10,000 data rows are allowed; row 10,001 rejects the entire file.
5. A sample or direct string parse is subject to the same parser limits.
6. Preview counts are computed from the full bounded issue set; only rendering is truncated.
7. A mutation over the snapshot budget returns a normal failed commit and does not dispatch state, increment revision, or write storage.
8. Existing valid snapshots larger than the new soft budget remain readable. Mutations may strictly shrink them so the user can recover below the limit; equal-size or growing writes remain blocked.
9. Browser quota errors below the soft budget remain caught by the existing write/read-back failure boundary.

## Acceptance evidence

1. A 4 MiB CSV parses or returns domain issues normally; a 4 MiB + 1 byte CSV is rejected without trades.
2. 10,000 data rows are accepted; 10,001 are rejected without a partial dataset.
3. Quoted newlines do not falsely trigger the row limit.
4. Import preview displays no more than 100 issue rows and states the hidden count.
5. A new/growing snapshot above 4,000,000 characters is rejected before write; state, revision, and checksum remain unchanged. A strictly smaller oversized snapshot is allowed so cleanup cannot deadlock.
6. Normal sample import, duplicate handling, partial-close grouping, account scoping, backup, and recovery tests still pass.
7. TypeScript, the optimized build, dependency audit, and browser QA pass.

## Gate

This is a local safety budget, not a remote-storage solution. It does not authorize Supabase or production financial-data writes. G4 and G5 remain STOP-SHIP.

## Implementation evidence — 2026-07-15

- The production CSV parser now enforces the 4 MiB UTF-8 byte budget and the
  10,000 logical data-row budget. Overflow rejects the whole preview without a
  partial trade set.
- The file-input boundary rejects an oversized `File` before reading its text.
- Import preview keeps truthful totals but renders at most 100 issue rows and
  reports the hidden count.
- Every normal Journal commit checks the complete serialized v5 snapshot before
  writing. A snapshot above 4,000,000 characters can only be written when it is
  strictly smaller than the already stored oversized snapshot.
- Boundary tests cover exact-limit and one-over-limit files and rows, quoted
  newlines, bounded issue rendering, and monotonic storage shrink.
- Verification passed: TypeScript, 60/60 Journal tests, the optimized 69-route
  Next.js build, and the current zero-vulnerability dependency audit.
- Browser QA passed sample-preview counts, visible limit guidance, reload, and a
  clean error/warning log. Native file-chooser automation is not exposed by the
  in-app Browser, so selecting a real oversized local file remains a manual
  smoke check; the same boundary is covered at both the `File.size` and parser
  layers in automated tests.
