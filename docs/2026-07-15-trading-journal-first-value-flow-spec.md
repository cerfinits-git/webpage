# Trading Journal first-value flow — locked spec

Date: 2026-07-15  
Gate: G3.4 local daily-use UX  
AI-OS: B1 feature grill  
Decision: finish the empty-account and CSV-import handoff before adding a tour,
coach, or more navigation.

## Real problem and user

Kan needs the Journal to make the next useful action obvious after opening an
empty account and after committing a CSV. The current empty state promotes
manual Add even though cTrader CSV is the fastest truthful path for a systematic
trader. After Import succeeds, the preview disappears and the result plus Undo
move to the top of Settings, outside the user's current scroll position. The
import panel gives no direct path to the new trades or unresolved risk data.

Browser cheap test on the current local dataset proved the break: sample import
changed 43 trades at revision 18 to 46 trades at revision 19, but the import
panel returned to its initial drop zone. The only receipt and Undo were above the
account panel. Undo restored 43 trades and checksum `f51c3f6b` at revision 20.

## Smallest solution that fixes 80%

1. Make `Import cTrader CSV` the dominant empty-account action and keep manual
   Add as the secondary path.
2. Use truthful preview labels: trades are trades; row-level problems are
   explicitly called issues or rows.
3. After every successful Import attempt, replace the preview in place with a
   focused receipt containing new, updated, duplicate, and missing-risk counts.
4. Give the receipt one dominant next action: resolve missing risk when present,
   otherwise view Trades. Keep Overview as a secondary path.
5. Show contextual Undo only when this receipt still represents the latest
   durable revision. Keep the receipt in place after Undo and state that the
   dataset was restored.
6. Starting another preview or changing account clears the old receipt.

## Cut from this slice

- multi-page onboarding or product tour;
- coach marks, celebration animation, gamification, or notifications;
- broker connection or live cTrader sync;
- new Review surface or review metrics;
- production analytics events;
- changes to Supabase, staging, or production data.

## Edge cases and circuit breakers

1. Duplicate-only reimport is a successful no-op receipt, not a false claim that
   data changed; it exposes no import-specific Undo.
2. Missing-risk count is derived from canonical preview trades, not from issue
   text, because one trade can have multiple issues.
3. A later revision or account change invalidates the receipt's Undo affordance.
4. Failed imports keep the preview and existing dataset unchanged.
5. Account and date-range context survive every receipt link.
6. The receipt is keyboard focusable, announced politely, and remains usable at
   390x844 without horizontal overflow or sub-44px controls.

## Definition of done

1. Empty account exposes Import as the single primary action.
2. Sample preview reports `3 ready trades`, `2 needs-info issues`, and `1 trade
   missing risk` without implying five trades exist.
3. Import success keeps feedback beside the action and links directly to the
   appropriate next Journal surface.
4. Import Undo restores exact count and checksum and updates the same receipt.
5. Duplicate-only reimport reports no new data and does not expose stale Undo.
6. TypeScript, Journal tests, optimized build, desktop/mobile browser QA, focus,
   reload, and console checks pass.

## Gate

This is local interaction hardening only. G4 authenticated staging and G5
production remain STOP-SHIP; no real financial data action is authorized.

## Implementation evidence — 2026-07-15

- Empty-account Overview now promotes `Import cTrader CSV` and keeps manual Add
  as the secondary path.
- Preview labels distinguish ready trades, needs-info issues, missing-risk
  trades, duplicate rows, and rejected rows. The sample reports 3, 2, 1, 0,
  and 0 respectively.
- Successful and duplicate-only imports render a focused receipt beside the
  original action. The receipt preserves range context and links to the
  Missing-risk filter when canonical imported data still lacks risk.
- The missing-risk summary respects an existing user correction that the merge
  preserves; stale broker files do not tell the user to correct the same trade
  again.
- Contextual Undo is shown only for the receipt's latest durable revision.
  Import plus Undo restored 43 trades and checksum `f51c3f6b`; duplicate-only
  import exposed no stale receipt Undo.
- The receipt handoff opened `/journal/trades?range=30d&quality=missing` with the
  Data quality control selected. Global Undo remained available after route
  navigation and restored the same dataset.
- At the real 390x844 responsive width, the receipt had no horizontal overflow
  and its three controls measured approximately 46px high.
- Final reload preserved 43 trades at revision 32 and checksum `f51c3f6b`.
  Desktop and mobile Browser logs contained no errors or warnings.
- TypeScript, 61/61 Journal tests, and the optimized 69-route Next.js build pass.
  The build's six sandbox-denied fetch logs are non-fatal; all routes generated
  and the build exited 0.
