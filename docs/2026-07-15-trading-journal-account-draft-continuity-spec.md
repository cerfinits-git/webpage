# Trading Journal account-bound draft continuity — locked spec

Date: 2026-07-15  
Gate: local daily-use hardening  
AI-OS: B1 feature grill  
Decision: replace the global Quick Add draft with one versioned draft per
trading account before authenticated staging.

## Evidence and problem

Quick Add currently persists one v1 draft at
`cerfinits-journal-quick-add-draft-v1`. The payload has no account ID,
reporting timezone, or base currency. The active account selector is real, so a
user can switch account while the same draft remains on screen. The dates are
then interpreted in the new account timezone and monetary fields are relabeled
with the new currency even though their values came from the previous account.

This is a correctness defect disguised as convenience. A silent cross-account
draft is worse than requiring another tap because the resulting trade can look
valid while its timestamp or money context is wrong.

## Locked behavior

1. Draft schema v2 records `accountId`, `reportingTimezone`, and `baseCurrency`.
2. Each account uses a distinct bounded localStorage key. Switching account
   restores that account's draft or a fresh current-time draft; it never copies
   field values from the account just left.
3. Existing v1 draft is migrated once into the active account, written and
   read back under the v2 account key, then the legacy key is removed.
4. A v2 draft stored under the wrong account is rejected and preserved as raw
   recovery evidence; it is never silently reassigned.
5. If an account timezone changes, the opened/closed instants are preserved and
   re-rendered in the new reporting timezone. Invalid or ambiguous conversion is
   rejected with the raw draft preserved.
6. If base currency changes, monetary values are preserved but Quick Add shows
   a visible review warning. No FX conversion or silent clearing is attempted.
7. Autosave writes only when the loaded draft belongs to the currently active
   account. During account transition, the form cannot save or display the
   previous account's fields as if they belonged to the new account.
8. Successful durable trade commit removes only the active account draft.
   Other account drafts remain intact.
9. Clear draft removes only the active account draft plus a still-unmigrated
   legacy key. Corrupt draft recovery remains scoped to the active account.

## Cut from this slice

- remote draft sync, Supabase writes, notifications, or background tasks;
- automatic FX conversion;
- copying setup, size, price, risk, or P&L across accounts;
- changing TradingAccount identity or Journal storage schema;
- starting dogfood evidence on Kan's localhost dataset.

## Definition of done

1. Domain tests cover v2 round-trip, v1 migration, account mismatch rejection,
   timezone instant preservation, currency-change warning, corruption, and
   deterministic per-account keys.
2. Browser hard test creates two local accounts with different timezone and
   currency, enters distinct drafts, switches both ways, reloads, and recovers
   the correct values each time.
3. A successful save clears only its account draft and the other draft survives.
4. Quick Add remains at six essential groups, Advanced closed, touch targets at
   least 44px, and no horizontal overflow at 390x844.
5. TypeScript, all Journal tests, optimized build, and Browser QA pass without
   changing the user's 43-trade localhost dataset.

## Gate

CONTINUE local implementation. This fixes a concrete multi-account correctness
and daily-use defect without expanding the product surface. G4 staging and the
14-day evidence run remain separate and open.

## Implementation evidence — 2026-07-15

- Draft schema v2 now includes account, timezone, currency, and a persistent
  currency-review marker; per-account keys are deterministic and bounded.
- Quick Add loads the scoped draft before rendering editable fields and blocks
  autosave/save while account context is transitioning or raw corruption awaits
  recovery.
- Legacy v1 is migrated into the active account with write/read-back validation.
  A mismatched v2 account is rejected with the original raw payload intact.
- Timezone adaptation converts the old local wall time to an instant and then
  renders that instant in the new timezone. Currency values are never converted;
  the warning survives reload until `Values reviewed` is explicitly pressed.
- Browser hard test used isolated THB/Bangkok and USD/New York accounts. USD
  values did not appear in THB, both drafts survived switching and reload, a
  USD commit cleared only the USD draft, and the THB draft remained `THBQA`,
  risk `999`, P&L `-100`.
- After changing New York/USD to UTC/EUR, `05:06` became `09:06`, preserving the
  same instant. Symbol `CTXQA` and risk `500` survived, while an `USD → EUR`
  review warning persisted across reload and disappeared only after review.
- The QA account, trade, and both scoped drafts were removed after verification.
  The user's localhost Journal was not opened on Quick Add or mutated.
- Mobile harness measured client width `375`, scroll width `375`, and minimum
  visible target `44px` at a 390x844 frame. The form remains six essential
  groups with Advanced collapsed.
- 75/75 Journal tests, TypeScript, and the optimized 69-route build pass.

Current result: **account-bound draft continuity accepted locally.** This closes
the cross-account draft leakage defect but does not change the G4/G5 gates.
