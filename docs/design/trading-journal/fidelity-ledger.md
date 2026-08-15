# Cerfinits Journal — Fidelity Ledger

- Date: 2026-07-14
- Reference: `overview.png`, `trades.png`, `mobile-add-trade.png`
- Rendered QA: Browser at 1440×960 and 390×844
- Verdict: ACCEPTED for local G2 prototype

| Area | Concept target | Implemented result | Verdict |
|---|---|---|---|
| App shell | 240px persistent sidebar, compact identity, five journal destinations | 240px desktop sidebar; mobile switches to five-item bottom navigation | Match |
| Visual language | Cerfinits warm gray, hairline borders, restrained gold, no shadows | Shared journal tokens use warm gray surfaces, 1px borders, near-square controls, gold focus/action accent | Match |
| Hierarchy | Large page title, compact controls, sparse metric band | Geist/Anuphan hierarchy with open four-column metric band and tabular values | Match |
| Overview data | Net R, Expectancy, Profit Factor, Win Rate, Cumulative R, recent trades, completeness | Seed data resolves to +12.4R, +0.31R, 1.74, 60%, and 95% completeness | Match |
| Trades | Filter rail above a dense table, R-first values, data-quality state | Search plus Setup/Side/Result/Data quality filters; 40 deterministic round-trip trades | Match |
| Review removal | No review route, queue, score, badge, or metric | Review surface and review-only code removed; data correction lives in import/trades flows | Match |
| Responsive | Mobile capture must remain usable without recreating desktop cards | One-column form at 390×844 with native date inputs, bottom navigation, and scroll-safe actions | Match |
| Copy and dates | Thai product copy with standard English trading terms; current-year data | Thai navigation/copy, Gregorian 2026 dates, English terms for trading metrics and setup names | Match |

## Intentional deviations

- The concept includes illustrative drawdown styling. The G2 implementation draws only cumulative R because the current deterministic dataset and acceptance criteria do not yet define a separate drawdown series UI.
- The mobile Save action sits below the initial viewport and is reached by natural scrolling; the bottom navigation remains fixed. This avoids hiding form fields behind a second sticky action bar.
- Account and date controls are presentation-only in G2. Their filtering behavior is deferred until persisted multi-account data exists.

## QA evidence

- Add trade navigated to `/journal/trades` and increased the local dataset by one.
- Search for `XAUUSD` narrowed the post-add dataset to 10 trades.
- Sample cTrader CSV produced 3 staged trades and 1 issue for a missing Initial Risk amount, then imported locally.
- Browser console error log was empty on Overview, Trades, and mobile Add Trade.
- Production build compiled and type-checked successfully.

## G2 polish evidence — 2026-07-15

- Date range is now a real control. The 7-day view reduced the deterministic sample from 29 valid-R trades in the 30-day view to 7 valid-R trades and regenerated the chart dates.
- Corrected the metric eligibility rule: a finite R-multiple is counted only when Initial Risk is present and positive.
- Missing-risk rows now display `—` for R and are excluded from Win/Loss result filters.
- Trades pagination now renders 10 rows per page, reports the visible range, and moves from `1–10 of 30` to `11–20 of 30` on page 2.
- The Data Quality action toggles between the two missing-risk trades and all 40 trades using the live local dataset, replacing the unsupported hard-coded import claim.
- Add Trade rejects a zero Initial Risk in place with a clear error and does not navigate or write to local storage.
- At 390×844, the cumulative-R chart fits its container and the document has no horizontal overflow.

## G2.1 local-safe evidence — 2026-07-15

- Versioned storage validation accepts the current schema, migrates the prior local schema, and shows recovery/read-only state for corrupt data instead of silently replacing it.
- The trade table opens a shared editor by click, keyboard, or the explicit details action. Initial Risk correction recalculates R immediately.
- Delete and edit are reversible through a single-step Undo snapshot; browser QA restored the original dataset after both correction checks.
- Import identity is deterministic, duplicate external positions are quarantined, and missing broker P&L is rejected instead of estimated from price distance.
- Fifteen domain tests pass across storage, reducer, validation, CSV import, and metrics.
- The production build compiles and type-checks. Browser QA passes on desktop and 390×844 mobile with no horizontal overflow or application console errors.
- Exact correction check: filtering showed two missing-risk trades; saving one Initial Risk reduced the count to one; Undo restored the count to two.

Current gate: **G2.1 accepted locally. G3 and production remain STOP-SHIP** until partial-execution grouping, restore verification, Quick Add draft recovery, and authenticated staging persistence are complete.

## G3 local-core fidelity evidence — 2026-07-15

- The accepted Cerfinits visual system remains intact: warm gray surfaces,
  hairline borders, restrained gold focus, compact typography, square controls,
  desktop sidebar, and mobile bottom navigation.
- Quick Add is now one continuous capture flow. It has six essential groups,
  current-time defaults, a visible top Save action, a second end-of-form Save,
  and a resumable draft. Advanced fields stay collapsed by default.
- The previous concept's Review/stepper remains intentionally removed per the
  product decision. Correction happens directly in Trades and importer states.
- The concept's inert account selector is intentionally absent from Quick Add;
  the current build has one fixed local account and does not pretend to offer
  multi-account switching.
- Closed time and Net P&L remain visible before Advanced because a complete
  round-trip trade cannot be persisted truthfully without them.
- Data Safety now separates verified export, restore preview plus explicit
  Replace, Start clean, and Load demo data. Destructive actions are not merged
  into one ambiguous control.
- Browser evidence: no horizontal overflow at 390x844 or desktop, Save contrast
  is readable, Advanced opens and closes, draft survives reload, commit and
  Undo are durable, and cross-tab revisions converge.
- Import evidence: official cTrader columns, partial execution grouping,
  duplicate-safe reimport, conflict quarantine, and no guessed broker P&L.
- Automated evidence: 28/28 journal tests plus a successful production build.

Current verdict: **Accepted for the local-first G3 core.** The intentional
deviations improve capture speed and data truthfulness without changing the
accepted Cerfinits minimal design language. Supabase execution and production
financial data remain outside this verdict.

## G3 interaction hardening evidence — 2026-07-15

- Native blocking confirms were replaced with a compact inline confirmation
  state. Cancel receives initial focus; destructive copy includes the affected
  trade count; Confirm is visually separated; Undo remains the next action.
- The inspector behaves as a modal keyboard surface: close receives initial
  focus, Shift+Tab wraps to Delete, Tab wraps back to close, Escape exits, and
  focus returns to the source row.
- File labels are now backed by visible-size native file inputs in the
  accessibility tree rather than `display:none` inputs.
- The 390x844 touch audit found zero visible controls below 44px after file
  targets were increased to an effective 44.5px.
- Playbook keeps its sparse reading layout while removing Add/Edit controls that
  had no implementation. `Local templates · read only` communicates the actual
  capability without visual noise.
- Quick Add and Settings remain free of horizontal overflow and application
  console errors. The final Quick Add preview keeps the six-group capture flow,
  collapsed Advanced details, full-width completion actions, and bottom nav.

These changes are intentional interaction deviations from the original static
concept: they add recovery feedback and keyboard behavior without adding cards,
shadows, a review queue, or new navigation.

## G3.1 context continuity evidence — 2026-07-15

- `7d`, `30d`, and `all` now resolve through one JournalProvider preference;
  a valid URL value overrides the saved preference and navigation carries it.
- Overview, Trades, and Analytics use the same deterministic range filter.
  Browser QA moved `7d` from Overview to Analytics with `10/43 trades`, changed
  Analytics to `30d`, returned to Overview with the same range and `+15.9R`,
  then reloaded without losing it.
- Recent trade actions now deep-link to the exact trade. The verified URL
  `/journal/trades?range=7d&trade=trade-xau-20260714` opened the XAUUSD modal,
  focused its close control, retained `7d`, and removed `trade` on close.
- Unknown trade IDs open no dialog and are removed from the URL after hydration.
- Data completeness now exposes one direct `Resolve missing risk` action. The
  verified destination retained `30d`, selected `quality=missing`, and rendered
  only the unresolved row; no Review surface was reintroduced.
- Analytics now reports visible/total trade count and applies the selected
  range to every summary and expectancy group instead of silently using all
  records.
- 47/47 Journal tests, TypeScript validation, the 69-route optimized build, and
  dependency audit with zero vulnerabilities pass. Desktop browser QA reports
  no application errors or horizontal overflow; the added controls reuse the
  previously verified responsive 44px control primitives.

Current verdict: **G3.1 continuity accepted locally.** Account continuity still
requires a real `TradingAccount` entity, and G4/G5 remain STOP-SHIP.

## G3.4 first-value flow evidence — 2026-07-15

- The Cerfinits surface stays minimal: the new receipt uses the accepted warm
  gray, hairline border, restrained green/gold state, square controls, and no
  tour, modal, card stack, or celebratory motion.
- Empty-account hierarchy now reflects the real workflow: broker Import is the
  black primary action and single manual Add is secondary.
- Import feedback remains in the user's manipulation context and gains a clear
  next action without adding navigation or restoring the removed Review surface.
- At 390x844, receipt actions stack into one column, measure approximately 46px
  high, and produce no horizontal overflow. The focused receipt remains visible
  above Data Safety and the fixed mobile navigation remains unchanged.
- Browser evidence covers ready, duplicate-only, undone, and Missing-risk
  handoff states with clean logs. Final data returned to 43 trades and checksum
  `f51c3f6b`.

Verdict: **G3.4 matches the accepted Cerfinits design system and improves the
first-value loop without expanding the product surface.**

## G4 dogfood instrumentation fidelity — 2026-07-15

- The new evidence surface stays inside Settings and adds no route, Review
  queue, dashboard navigation, notification, modal, shadow, or celebratory
  state.
- Idle state presents one restrained primary action. Running state reuses the
  accepted hairline metric band, tabular mono labels, warm gray surface, and
  small outlined status chip.
- The scorecard shows only decision-relevant measures: duration, cohort, timely
  risk, import correction, and reliability. Technical limitations remain one
  quiet footnote instead of competing with the daily workflow.
- At 390x844 the scorecard becomes two columns, the fifth measure spans the
  width, and Export evidence is a full-width action. Visual QA found no clipped
  text or horizontal overflow.
- A real cross-tab commit moved the isolated QA run to Cohort `1/10` and Risk
  `100%` without refresh, while the localhost dataset remained 43 trades with
  the tracker unstarted.

Verdict: **The local G4 instrument matches the Cerfinits minimal system and is
ready to collect evidence. It is not a G4 pass and does not authorize staging or
production.**

## G3.5 account-draft fidelity — 2026-07-15

Reference comparison used `mobile-add-trade.png` and the latest Browser render
at a 390x844 frame, inspected together at original detail.

1. **Primary hierarchy:** reference and render keep Add trade, account, symbol,
   side, time, size, price, and risk in one top-to-bottom capture flow.
2. **Container model:** the implementation retains the accepted open form with
   hairline separators; account isolation adds no modal, card stack, stepper, or
   new route.
3. **Typography and palette:** compact mono field labels, warm gray Cerfinits
   surface, black primary Save, restrained green selection, and square controls
   remain consistent across desktop and mobile.
4. **Responsive behavior:** the measured mobile document has `375px` client and
   scroll widths inside the 390px frame, so there is no horizontal overflow;
   every visible interactive target measured at least `44px`.
5. **State communication:** `Draft saved`, account-specific restore, timezone
   adaptation, and persistent currency review are inline status surfaces using
   existing primitives, not decorative UI.

Above-the-fold intentional deviations from the original concept remain the
locked product decisions: `Step 1 of 2`, `Continue to review`, `Save draft`, and
Review navigation are absent; Save commits directly after durable validation,
Advanced remains collapsed, and autosave is visible in the header. These changes
implement Kan's request to remove Review and keep the Journal minimal.

Verdict: **agency-signoff faithful to the accepted post-Review Cerfinits system.**
No material visual mismatch was introduced by account-bound draft continuity.

## G3.6 mobile Save-feedback fidelity — 2026-07-15

Reference comparison used `mobile-add-trade.png` and the latest 390x844 Browser
render in the same visual QA pass.

1. **Header hierarchy:** the redundant `CERFINITS JOURNAL` topbar is removed
   from Add on mobile. The remaining Cerfinits / Add trade / Save / Close header
   is the single sticky navigation surface and preserves the reference's clear
   top-level capture hierarchy.
2. **Validation state:** the new alert uses the existing thin red rule, muted
   semantic surface, mono-scale message, and square focused control. It adds no
   toast, modal, card stack, badge, or decorative state.
3. **Form anatomy:** account, symbol, side, two timestamps, quantity, entry,
   exit, risk, P&L, setup, Advanced, risk summary, and fixed five-item mobile
   navigation remain in the same direct-capture order.
4. **Container and palette:** open hairline groups, warm gray Cerfinits surface,
   black Save, muted green Buy state, square controls, and zero decorative
   shadow stacks remain unchanged. The alert shadow appears only while sticky
   to separate actionable feedback from scrolling content.
5. **Responsive evidence:** the 390px frame reports `375px` client and scroll
   widths. Header `0–116px` and alert `116–158px` do not overlap at deep scroll;
   desktop remains static and keeps equal client/scroll widths.
6. **Interaction evidence:** invalid Save focuses Symbol, exposes
   `aria-invalid`/`aria-describedby`, and returns the field into view when Save
   is activated from the bottom of the form.

Above-the-fold copy changes are intentionally limited to the validation message
that appears only after a failed commit. The already locked deviations remain:
no Step 1 of 2, progress bar, Review, Continue to review, or separate Save draft
button. Autosave plus direct Save remains the accepted product model.

Verdict: **agency-signoff faithful to the accepted post-Review Cerfinits system.**
The visible feedback fixes a functional dead end without introducing a material
visual mismatch.

## G3.7 desktop one-click capture fidelity — 2026-07-15

Reference comparison used `overview.png` and the latest 1280x720 Browser render
in the same visual QA pass.

1. **Hierarchy:** a populated account now presents Add trade as the single
   black primary sidebar action, with Import immediately below as an outlined
   secondary action. An empty account reverses that priority without adding a
   third action.
2. **Container model:** both actions stay in the existing sidebar rail. No
   floating button, modal, card, shortcut hint, topbar action, or navigation
   destination was added.
3. **Typography and palette:** compact uppercase mono labels, warm-gray ground,
   black primary surface, hairline secondary border, square geometry, and
   restrained gold icons reuse the accepted Cerfinits primitives.
4. **Responsive behavior:** the action group disappears with the sidebar at
   `760px`; the existing centered mobile Add remains the only visible mobile
   capture entry. Measured client and scroll widths match at both `375px`
   mobile and `1265px` desktop.
5. **Continuity:** Add and Import preserve the selected range. The active Add
   route receives only the existing gold inset rule, avoiding a competing badge
   or decorative state.

The change intentionally differs from the original concept's single Import
button because daily manual capture becomes the higher-frequency action after
first value. The original empty-account Import priority is still preserved by
the account-adaptive rule.

Verdict: **agency-signoff faithful to the accepted Cerfinits minimal system.**
The added action removes a desktop navigation step without creating mobile
duplication or weakening the empty-account import hierarchy.

## G3.8 mobile tab-bar fidelity — 2026-07-15

Reference comparison used `mobile-add-trade.png` and the latest 390x844 Browser
render in the same visual QA pass.

1. **Primary capture position:** the emphasized black/gold Add circle is now the
   actual center item in a five-column bar. Its measured center equals the
   `187.5px` content midpoint instead of the previous `262.5px` position.
2. **Information architecture:** removing Review left five useful destinations:
   Overview, Trades, Add, Analytics, and Settings. Analytics moves after Add;
   no removed Review concept or substitute queue returns.
3. **Visual language:** icon size, mono labels, warm-gray translucent rail,
   black circular Add surface, gold active state, hairline top rule, and fixed
   safe-area behavior remain unchanged.
4. **Semantic state:** the active tab exposes `aria-current="page"` while the
   existing visual active treatment remains restrained.
5. **Preview fidelity:** the development-tools trigger is disabled because it
   occupied an app hit target. This changes no production chrome and removes no
   product control.
6. **Responsive evidence:** the 390px frame reports `375px` client and scroll
   widths, exactly one visible Add link, successful bidirectional tab taps, no
   overlay, and no relevant console warning/error.

The reference used four tabs and Review; the accepted product has five tabs and
no Review. Centering Add in the resulting structure is the intentional
post-Review adaptation, not a return to the discarded flow.

Verdict: **agency-signoff faithful to the accepted post-Review Cerfinits
system.** Navigation now behaves and reads like a deliberate mobile tab bar
rather than a reordered desktop menu.
