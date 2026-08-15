# Mobile Readability Pass

- Date: 2026-07-31
- Track: Product / Cerfinits site
- Scope: the public site — `/`, `/products`, `/blog`, `/algo`, `/research`,
  `/grade`, `/gold-start` (23 representative routes, 55 pages)
- Out of scope: `/journal` (paused 2026-07-23) and `/plan` (due for archive under
  R8 of the research-platform grill). Polishing a surface no reader will reach is
  work spent on nothing; both are the larger half of the offences and would
  drown the worklist.

## Why

R13 of `2026-07-23-research-platform-pivot-grill.md` locks the research surface
as **mobile-first** for a persona that is not a trader. The site is not that
today: it is a desktop layout that survives a narrow viewport rather than one
designed for it.

## Baseline, measured 2026-07-31

Two audits, because a declaration and a rendered box are different facts.

**Static — `node scripts/mobile-audit.mjs`** (6 in-scope stylesheets):

| Check | Count |
|---|---|
| `font-size` under 14px | **212** (76 of them under 12px) |
| thin weight (≤300) on type under 14px | **18** |
| fixed widths over 360px | **3** (`.rtable` 760px, `.dmatrix table` 580px, `.heatmap table` 540px) |
| distinct breakpoints | **6** (560 / 620 / 640 / 700 / 860 / 1024) |

**Rendered — `scripts/mobile-audit.browser.js` at 375×812**, 23 routes:

| Check | Count | Concentrated in |
|---|---|---|
| elements rendering type under 14px | **1,196** | `/gold-start/full` 256, `/research/nvda` 140, `/research/nvda/advanced` 69 |
| tap targets under 40px | **372** | `/grade/checkpoint/1` 62, then ~13–17 on every page (footer, nav, back-links) |
| elements overflowing the viewport | **211** | `/research` 132, `/research/nvda/advanced` 43, `/gold-start` glossary+full 36 |
| content clipped with no way to scroll to it | **5** | `.book` on `/gold-start/full` and `/gold-start/glossary` (385px inside 372px) |
| text fields under 16px (iOS zooms the page on focus) | **3** | `/research` search, the two login fields |

Two figures in the first draft of this table were wrong, and the correction
changed the work rather than just the number:

- The 62 tap targets on `/grade/checkpoint/1` are not 62 places a reader has to
  hit. Each radio sits inside a `label.qz-choice` that renders **261×68**, so
  the whole card is the target and the quiz is perfectly usable one-handed. Only
  the radio's own 13px box is small, which is an aiming problem, not a reach
  problem — the fix is 20px of radio, not a rebuilt answer control.
- The 51 zooming inputs were 48 radios plus 3 real text fields. iOS only zooms
  for fields that raise a keyboard. The audit now filters by input type.

No route scrolls horizontally as a document (`scrollWidth` = 375 everywhere) —
the mobile drawer and hero work from the earlier pass hold up. The overflow
above is inside containers, some scrollable, some not.

## The five findings

1. **Type is too small, everywhere.** The dashboard's explanatory copy is
   `12.5px / weight 300 / --muted` — small, thin and grey at once. Grade pages
   reach 9.92px, `/gold-start/ch03` 9px.
2. **There is no phone tier.** `site.css` — which dresses the home page, blog,
   grade, header and footer — breaks only at 1024px and 860px, so a 375px handset
   is served the same type scale as an 800px tablet. Six breakpoints exist across
   the stylesheets with no shared scale.
3. **Touch targets are below the thumb.** Footer links render 23px tall, the
   brand 28px, back-links 16–20px, the blog filter pills 39px, the research
   search field 23px. Links inside a sentence are exempt: padding a run of
   inline text to 44px breaks the line it sits in, which is why WCAG 2.5.8
   carves them out.
4. **Desktop tables are served to phones.** `.rtable` declares `min-width: 760px`
   inside a 327px column, so five columns sit off-screen behind a scroll with no
   affordance. `.book` on `/gold-start` clips instead of scrolling — that content
   is not reachable at all.
5. **Fixed chrome ignores the safe area.** A 65px sticky header and a 48px fixed
   login bar sit on every page, and `env(safe-area-inset-*)` appears nowhere in
   the repo.

## Plan

| Phase | Work | Fixes |
|---|---|---|
| 0 | Both audits, committed and repeatable; baseline above | measurement |
| 1 | Type scale: readable floor on phones, breakpoints collapsed to 480 / 768 / 1024 | 1, 2 |
| 2 | Tap targets to 44px; checkpoint radios become pressable cards; inputs to 16px | 3 |
| 3 | `/research` hub to cards on phones; frozen first column + scroll affordance on the advanced tables; unclip `.book` | 4 |
| 4 | `env(safe-area-inset-*)` on the fixed chrome; reconsider the floating login bar on phones | 5 |
| 5 | Family sweep — grade figures, gold-start, blog, the eight dashboard modules | residue |
| 6 | Re-run both audits at 320 / 375 / 414 in both themes; add a regression test | proof |

Verification for every phase: `node scripts/mobile-audit.mjs`, the browser audit,
`npx tsc --noEmit`, `npm test`, `next build`.

## Where phases 1–2 landed

Re-measured on the same 23 routes at 375×812, after the type floor and the
touch-target work:

| Check | Before | After |
|---|---|---|
| declarations under 14px (static) | 212 | **0** |
| elements rendering type under 14px | 1,196 | **66** |
| tap targets under 40px | 372 | **0** |
| text fields under 16px | 3 | **0** |
| elements overflowing the viewport | 211 | 225 |
| content clipped with no way to scroll | 5 | 3 |

Desktop is unchanged by construction, and checked: at 1280px `.sd-mod-head p`
still computes to 12.5px/300 and `.take .tl` to 10.56px, exactly as before.

The 66 remaining small elements are SVG `<text>` labels inside figures and
`<sup>` footnote markers. Those numbers are coordinates in a drawing, not type
in a paragraph — raising one moves the diagram — so they belong to the
per-figure sweep in phase 5, not to a codemod.

## Phase 3 — tables, and the two clips

| Check | After phase 2 | After phase 3 |
|---|---|---|
| elements overflowing the viewport | 225 | **47** — all inside the two tables that stay tables (below) |
| content clipped with no way to scroll | 3 | **0** |

Four things, in the order the plan named them:

1. **`/research` hub.** `ResearchBrowser.tsx` now renders the same `filtered`
   array through two markups — the existing sortable `.rtable`, and a
   `ReportCard` grid (already shared by the home teaser and `/products`).
   `display:none` swaps between them at 640px, so only one is ever in the
   accessibility tree and a phone reader never lands on the table's off-screen
   columns. Overflow on this page: 141 → 0.
2. **The decision matrix and sensitivity heatmap** (`/research/[ticker]/advanced`)
   are genuine two-axis lookups — quality tier × valuation verdict, discount
   rate × growth rate — read by scanning a row and a column together. Turning
   either into a card list would sever the relationship the table exists to
   show, so both stay tables and keep their horizontal scroll. What changed:
   the row-label column is `position: sticky; left: 0` through the scroll, so
   a reader never loses the "which row am I on" anchor while swiping through
   columns, and a small `← เลื่อนดูตาราง →` hint (phone-only, matching the
   site's mono eyebrow-label idiom) says the scroll exists before a reader has
   to discover it by accident. The 47 elements still reported as "overflowing"
   here are the table's own columns inside its own `overflow-x: auto`
   container — working as designed, not a defect; the audit does not yet tell
   scrollable overflow apart from lost overflow, which is worth fixing in
   phase 6.
3. **`.book`** on `/gold-start/full` and `/gold-start/glossary` was clipping,
   not scrolling — `overflow-x: hidden` on the page shell with a table inside
   it wider than the shell. The cause was `.dtable td:first-child` forcing
   `white-space: nowrap; width: 34%` on every glossary term ("Timeframe
   Alignment" does not fit 34% of 356px on one line); phone tier now frees
   that column to wrap. Six chapters use `.dtable`; all are plain two-cell
   term/definition or short numeric rows, none depend on a fixed first column
   to read correctly, so one CSS change covers all six.
4. Fixing #3 exposed a second, smaller clip: the quotebox illustration
   (`SELL (Bid) / SPREAD / BUY (Ask)`) overflowed `.book` by 18px on chapters
   4 and the full book. Cause was a CSS grid default — a grid item's min-width
   is its content's min-content size unless told otherwise, so the `1fr auto
   1fr` columns refused to shrink below the width of "3,420.10". `min-width:
   0` on the cells fixed it.

Full re-audit, 23 routes: overflow 225 → 47 (all inside the two working
scrollers), clipped 5 → 0, tap targets and type floor unchanged from phase 2.
`tsc --noEmit` 0, tests 128/128.
