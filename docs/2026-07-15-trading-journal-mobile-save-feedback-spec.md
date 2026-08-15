# Trading Journal mobile save feedback — locked spec

Date: 2026-07-15  
Owner: Kan / Cerfinits  
Gate: G3 daily-use continuity  
Decision: fix the current invalid-save dead end without adding a review step,
modal, wizard, or new route.

## One question

When a mobile user taps the always-visible Save action, do they immediately
understand what blocked the commit and land on the exact field they must fix?

## Reproduced failure

At a 390x844 Browser viewport on `/journal/add`, an empty draft produces
`กรุณาระบุ Symbol`, but the alert is rendered at approximately 1413px while the
viewport ends at 845px. The page stays at `scrollY = 0` and focus remains on the
Save button. The visible result looks like Save did nothing.

The page also renders two stacked mobile brand headers (`CERFINITS JOURNAL` and
`CERFINITS`) before the form, consuming scarce first-viewport space.

## Locked behavior

1. The Add-trade header is sticky on mobile so Save and Close remain reachable
   anywhere in the long capture form.
2. The generic Journal mobile topbar is hidden only on `/journal/add`; the form
   header remains the single Add-trade navigation surface.
3. A failed commit renders one compact alert directly below the sticky header.
   No toast, modal, review step, or error list is added.
4. The first blocking validation issue maps deterministically to its draft
   field. The field receives focus and is scrolled into view.
5. If the target lives in Advanced details, that disclosure opens before focus.
6. The focused input exposes `aria-invalid` and references the visible alert
   with `aria-describedby`.
7. Editing any field clears the stale commit error. Draft autosave, account
   isolation, currency review, and successful-save routing remain unchanged.
8. Operational errors without a field target remain visible in the same alert
   surface but do not guess a focus destination.

## Field contract

- `symbol` -> Symbol
- `openedAt` -> Opened
- `closedAt` -> Closed
- `quantity` -> Quantity
- `averageEntry` -> Entry
- `averageExit` -> Exit
- `initialRiskAmount` -> Initial risk
- `netPnl` -> Net P&L
- `initialStop` -> Advanced / Initial stop
- `fees` -> Advanced / Fees
- `swap` -> Advanced / Swap
- `setup` -> Setup

## Acceptance evidence

1. Pure mapping tests cover essential, advanced, and unmapped issue fields.
2. At 390x844, empty Save keeps the alert inside the viewport and focuses
   Symbol instead of the Save button.
3. After scrolling down, the sticky Save action remains visible and actionable.
4. The Add page has one visible brand/header system, no horizontal overflow,
   no framework overlay, and no relevant console warnings/errors.
5. Desktop Add layout remains usable and preserves the accepted Cerfinits
   container, typography, palette, and direct-save model.
6. Journal tests, TypeScript, and optimized production build pass.

## Out of scope

- changing trade validation rules;
- auto-filling financial values;
- adding Review back;
- remote persistence, Supabase writes, or production data;
- starting the 14-day dogfood run.

## Implementation evidence

- Before: at 390x844, invalid Save placed the alert at approximately
  `1413–1456px`, left `scrollY = 0`, and kept focus on Save.
- After: the same action places the alert at approximately `124–166px`, focuses
  `data-draft-field="symbol"`, and exposes both `aria-invalid="true"` and
  `aria-describedby="quick-add-form-error"`.
- At deep `scrollY ≈ 873`, the header remains at `0–116px`, the alert remains
  immediately below it without overlap, and Save remains visible. Activating
  Save returns Symbol to the viewport and keeps the alert visible.
- Mobile has exactly one visible Add header, `375px` client/scroll widths inside
  the 390px Browser frame, and no relevant console warnings/errors.
- Desktop 1280x720 keeps the original static header/layout, shows the alert in
  the first viewport, focuses Symbol, and has equal client/scroll widths.
- 83/83 Journal tests, TypeScript, and the optimized 69-route build pass. The
  six blocked outbound static-generation fetches are the known restricted-
  workstation condition; the build exits successfully.
