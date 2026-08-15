# Cerfinits

Next.js 15 + TypeScript, plain CSS, no UI dependencies. Supabase for data and
sign-in. One codebase, several products at different stages of readiness.

```bash
npm install
npm run dev      # http://localhost:3000
```

The public half runs on an empty `.env.local`. Copy `.env.example` when you
need sign-in, the portfolio, or the journal.

---

## What is in here

| Route | What it is | State |
|---|---|---|
| `/` | Marketing site, blog, products, `/algo`, `/gold-start` | Live |
| `/grade` | Thai FX/Gold course, 29 chapters. Levels 1–4 free, 5–8 premium | Free levels live; premium has **no purchase flow yet** |
| `/research` | US equity analysis, 12 reports at `/research/[ticker]` | Live, sign-in required |
| `/quiz` | Trader archetype quiz, 24 questions → one of 16 codes | Built, **not launched** |
| `/plan` | Family finance app — portfolio, holdings, allocation | **Off in production** (`PLAN_ENABLED`) |
| `/journal` | Trading journal, cTrader import, R analytics | **Off in production** (`JOURNAL_ENABLED`) |
| `/privacy` `/terms` `/unsubscribe` | Legal, PDPA | Built, **blocked** — see below |

Both gated apps fail closed in production by design. `/plan` still writes to a
global JSON store rather than per-user rows; `/journal` is waiting on auth plus
RLS tests. Neither gate is a forgotten to-do — read
`lib/journal/route-policy.ts` before opening either.

---

## Before anything ships

**`CONTROLLER.nameTh` in `lib/legal.ts` is empty.** `/privacy` and `/terms`
render a visible warning until it holds the legal name in Thai. A privacy
notice that cannot name its data controller does not satisfy PDPA s.23, and a
contract that cannot name a party is not enforceable. This is the hard blocker
on launching `/quiz`, because the quiz collects email addresses.

Also outstanding: the `/quiz` link is not in the Instagram bio, and nothing is
deployed anywhere.

---

## Layout

```
app/
  (site)/          marketing, blog, grade, research, quiz, gold-start, algo
    (legal)/       privacy, terms, unsubscribe — route group, no URL prefix
  (plan)/          family finance app, gated
  (journal)/       trading journal, gated
  api/             route handlers
lib/
  grade/           curriculum, quizzes, certificates, archetypes, share card
  journal/         range maths, route policy, auth config
  legal.ts         data controller, processors, consent version
  store.ts         every Supabase read and write
  reports.ts       research report registry
components/        site/ plan/ journal/ grade/
public/quiz/       archetype art and card frames (generated — see below)
scripts/           one-off tools, not part of `next build`
tests/             node:test, run with `npm test`
docs/              specs and decision records
supabase/          SQL, applied by hand
```

CSS is plain and scoped by prefix — `.site`, `.j-`, `.p-`, `.aq-`. No CSS
framework, no component library. Keep it that way unless there is a reason
worth writing down.

---

## Data

`lib/store.ts` is the only file that talks to Supabase; everything else goes
through it. SQL lives in `supabase/` and is applied by hand — there is no
migration runner, so read the file before assuming a column exists.

The schema drifted from the code once and it cost a silent bug: every
newsletter signup was dropped because the code selected `subscribed_at` from a
table whose column is `created_at`, and Supabase fails the whole query when a
selected column is missing. If a write appears to succeed but nothing lands,
check column names first.

---

## Testing

```bash
npm test          # 162 tests, node:test
npx tsc --noEmit  # types
npm run build     # the real gate — catches what the other two miss
```

Tests are grouped by area under `tests/`. **A new directory must be added to
the `test` script in `package.json`** — it globs explicit paths rather than
recursing, so a whole file can silently stop running.

---

## Generated assets

`public/quiz/` is built from source art that is **not** in the repo:

```bash
node scripts/build-archetype-art.mjs --sheet
```

It reads `~/Downloads/MBTI/v2/` and `~/Downloads/MBTI/frames/`, cuts the white
backdrop out of sixteen figures, and writes web-sized WebP. `--sheet` lays all
sixteen on one grid, which is the only practical way to spot a hole bitten out
of a pale cloak. `docs/archetype-art.md` records which obvious sharp APIs fail
silently here — read it before touching the cutout code.

After regenerating, clear `.next/cache/images` or the dev server keeps serving
the previous ones and nothing appears to have changed.

---

## Traps worth knowing

**Running `npm run build` while `npm run dev` is up** overwrites `.next`, and
the running server starts throwing `__webpack_modules__[moduleId] is not a
function`. Restart the dev server; nothing is actually broken.

**The consent version.** `CONSENT_VERSION` in `lib/legal.ts` is stored with
every newsletter signup, because PDPA s.19 puts the burden of proving consent
on the controller. Change the wording beside the checkbox and you must bump
the version, or everyone who agreed to the old text is recorded as agreeing to
the new one and the whole record becomes worthless.

**The card layout exists twice.** The `/quiz` result card is laid out in
`app/(site)/quiz/quiz.css` and drawn again on canvas in
`lib/grade/share-card.ts` so it can be shared as a file. Both carry a comment
saying so. Change one without the other and the shared image stops matching
the page.

**Archetype data is the source of truth.** Names, weaknesses, dominant poles
and recommended chapters live in `lib/grade/archetypes.ts` and are covered by
tests — including one that stops the public result page linking to a premium
chapter. Art never carries text for this reason: a supplied set once did, and
its text disagreed with the data on several cards.

---

## Plan domain notes

Carried over from the original build; none of it is obvious from the code.

- Holdings are always computed live from transactions — there is no holdings
  table, so editing an old transaction corrects the numbers by itself.
- Cost basis is average cost. USD costs convert at the current rate, not the
  rate on the trade date.
- What-if: `PMT = (goal − portfolio×(1+r)^n) / (((1+r)^n − 1)/r)`, r = expected
  annual return ÷ 12.
- Thai gold is approximated from spot:
  `XAUUSD × (15.244 × 0.965 / 31.1035) × USDTHB`. It excludes the Gold Traders
  Association premium and spread — a few hundred baht out in practice.
- Thai equities use the `.BK` suffix (`PTT.BK`); Yahoo returns THB itself.
- Thai fund NAV needs `SEC_API_KEY`; without it, NAV is typed in through the ✎
  button and stored in `data/manual-prices.json`.
- Bank interest rates are a preset table in `lib/types.ts` (`THAI_BANKS`),
  editable in the form. There is no public API worth trusting.
- Savings balance = opening balance + linked income − linked expenses. Asset
  depreciation is straight-line from the purchase date.

---

## Conventions

- Commits are conventional and scoped: `feat(quiz):`, `fix(legal):`. Say why,
  not what — the diff already says what.
- Comments explain decisions and traps, not syntax.
- Thai for user-facing copy; English for code, commits and comments.
- Evidence before claims. Nothing on the site is personalised investment
  advice, `/terms` s.3 and s.4 say so explicitly, and backtest figures must be
  labelled as backtests.

---

## Where decisions are written down

`docs/` holds the specs. Worth reading before changing anything substantial:

| File | Covers |
|---|---|
| `2026-08-14-trader-archetype-quiz-spec.md` | Quiz scope, kill criteria, why MBTI's own axes were not used |
| `archetype-art.md` | Image pipeline and its failure modes |
| `2026-07-23-research-platform-pivot-grill.md` | Why `/research` exists and what it refuses to do |
| `2026-07-17-journal-saas-pivot-grill.md` | Journal product decisions |
| `2026-07-31-mobile-readability-pass.md` | Type floor and touch target rules |

The quiz has a written kill criterion — three Instagram posts in thirty days,
and under thirty emails means stop. It sits in the spec so it is harder to
quietly move later.
