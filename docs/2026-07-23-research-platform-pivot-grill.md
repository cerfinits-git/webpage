# Cerfinits Research — Retail Stock Platform Pivot Grill

- Date: 2026-07-23
- Track: Product / Cerfinits
- AI-OS gate: G1 — Grill (13 questions, all resolved)
- Status: LOCKED — Kan confirmed every decision below
- Supersedes: **S2 of the 2026-07-17 journal SaaS pivot** ("SaaS first", journal as
  the priority track). The journal is now paused at its current state: cTrader
  sync merged, Supabase cutover never started, Gate 0 never entered. Also
  supersedes D1's "keep `/plan` operational until cutover" — `/plan` is archived
  by R8 below.

## Trigger

Kan is redirecting the product from the trading journal to a stock research
platform for ordinary retail investors. Positioning: **"Smart Stock Investing
Platform"** — not to make users analyse like analysts, but to make complex
investing understandable and improve decisions.

**Product vision:** a retail investor understands a stock in **5 minutes**
without reading hundreds of pages of filings.

**Primary persona:** age 20–50 · investable 100,000–5,000,000 THB · no
accounting background · **mobile-first** · long-term horizon. (The original
draft said "interested in Thai stocks"; R2 changes the market to US equities,
so the persona is a Thai investor buying US stocks.)

**Jobs the product must answer per stock:** what the business does · is revenue
growing · are profits rising · how much debt · is cash flow healthy · is the
price cheap or expensive · what is the risk level.

## Locked decisions

| # | Decision | Resolution |
|---|---|---|
| R1 | Priority | **This replaces the journal as the active track.** Kan overrode the recommendation to finish the journal's Gate 0 first; recorded as the 5th instance of the build-before-validate pattern, accepted with R12 gates as the safety net. |
| R2 | Market | **US equities only.** Kills the Thai-data problem outright (SET has no free EDGAR-equivalent). |
| R3 | Generation model | **Pre-generated universe, human-reviewed, served static.** No on-demand LLM per search: cost is bounded, output is stable, and no unreviewed AI reaches a beginner. Same shape already locked in the screener grill (#4–5). |
| R4 | Universe | **20–25 tickers at launch.** Seeded by the 5 existing DEEP+O reports (META, LLY, AMZN, ABNB, ORCL), filled out with mega-caps Thai retail actually searches (AAPL, MSFT, GOOGL, NVDA, TSLA, KO, MCD, NKE, V, MA, JNJ…). Coverage is never promised; UI states "deep-dive one at a time, more each month" plus a **vote button** to collect demand signal instead of guessing. |
| R5 | Refresh cadence | **Narrative + E[V]: quarterly**, within ~2 weeks of the 10-Q/10-K (≈2–3 reviews/day through earnings season). **Mechanical fields: daily cron** (price, % change, market cap, yield, discount-vs-E[V]). Every report **stamps the filing period and update date**. Thesis-changing events trigger an off-cycle review; until it lands the report carries a "new event not yet reflected" badge. The platform sells depth, not speed — it will never beat the news and must not pretend to. |
| R6 | Scoring | **Stars measure business quality only** (mapped from the DEEP+O Quality score); **valuation is always a separate badge**. Never merge them into one number — that is exactly the v2 bug fixed in v3, and LLY is the proof (Quality 91 but overvalued; a merged score would have shown the best business ever analysed as a 2-star stock). Showing both axes side by side teaches "good company ≠ good buy today" through the UI itself. |
| R7 | Data sources | **SEC EDGAR companyfacts (XBRL)** for 5-year financials — official, free, unlimited. **Yahoo chart API** (already implemented in `lib/market.ts`) with **Finnhub free** as fallback for quotes. Architecture: **cron → fetch → compute → per-ticker JSON → static serve**. No database, no always-on backend, ~0 THB at 25 tickers. **Every chart line must be real reported data** — no synthetic or forecast series presented as history (the failure found in the screener reference clone). |
| R8 | Placement | **Evolve `/research`**, which already serves DEEP+O reports through the `reports.ts` registry — it is already "pre-generated + human-reviewed + static". New per-ticker route renders the 8-module dashboard; the existing PDF becomes the **full report inside Advanced mode** (matching "Simple First, Deep When Needed"). **`/plan` is archived**: routes removed, header link removed, its 8 live records (6 transactions + 2 goals) exported to file first. Route name stays `/research`. |
| R9 | Content authority | **Numbers decide · AI narrates · Kan signs.** Traffic lights are **rule-based on EDGAR data and auditable** (e.g. Revenue 🟢 if growing in ≥2 of the last 3 years; Debt thresholds from the DEEP+O v4 Credit Module); every light is tappable to reveal the figures behind it. The LLM only rewrites the already-locked report into Thai prose (Business Summary, Risks, strengths/weaknesses) — it never performs fresh analysis and never sets a light. Kan reviews as part of the quarterly cycle. |
| R10 | Access | **Free, but login required.** Kan overrode the recommendation of fully public access; accepted for the sharper demand signal and the reusable user base, at the cost of drop-off at the gate. |
| R10b | Auth | **Supabase Auth** — email OTP/magic link + Google OAuth, **no passwords stored**. The legacy `cerfinits_auth` cookie is rejected: the auth-cutover spec already calls it invalid identity proof, and this product faces the public. **v1 uses Supabase for auth only** — no per-user data, no journal RLS migration, no personal watchlist; report content stays static JSON behind a session check. |
| R11 | Information, not advice | Five binding rules: (1) **never say buy / sell / hold / wait** anywhere — state facts (price vs estimated value, discount %) and stop; (2) **module 8 describes the stock, not the user** — "profile: growth stock · high volatility · no dividend", never "suitable for you" (suitability language is the core of investment advice); (3) always **"estimated value from the model"**, never "price target", backed by a **public methodology page**; (4) **disclaimer on every report** plus the filing date from R5; (5) **ToS + Privacy Policy (PDPA) before the first user** — mandatory since login collects email. Rules 1–2 cut features that were in the original vision draft. |
| R12 | Gates & kill criteria | **Gate 0:** Kan dogfoods the dashboard instead of opening the PDFs for ≥2 weeks — if the PDF is still easier, the dashboard has failed. **Gate 1 (soft launch via @Crzin_s + newsletter, no ads), 60 days:** ≥100 logins **and** ≥20% of signups returning in week 2+ (return rate matters more than signups, which posting frequency can inflate). **Kill at 90 days:** <50 total logins **or** <10% return rate → stop expanding the universe and fall back to the PDF library; the pipeline and dashboard keep serving the existing 25. **Infra cap ≤1,000 THB/month.** **Refresh commitment:** missing the review cycle two quarters running (reports staler than 6 months) means shrinking the universe, never serving rotten data. |
| R13 | Design | **Warm paper + mobile-first.** The persona is not a trader — the dark terminal register is the thing that scared them off. `/research` sits inside `(site)`, so it inherits the existing tokens, components, three fonts, and dark-mode toggle. Every module is designed narrow-first, not a shrunken desktop (the journal needed a retrofit tab-bar spec; do not repeat it). Traffic lights and stars reuse `--up` / `--down` / `--gold`. |

## The 8 modules

| # | Module | Content |
|---|---|---|
| 1 | Overview | Price, today's change, market cap, industry, dividend yield · **quality stars + valuation badge shown together** (R6) |
| 2 | Business Summary | What it does, where revenue comes from, strengths, weaknesses, competitors, moat — one page |
| 3 | Financial Health | Revenue / Net Profit / Cash Flow / Debt as auditable traffic lights (R9) with supporting charts |
| 4 | Valuation | Current price · estimated value (DEEP+O method) · discount % · plain-language explanation |
| 5 | Growth | Revenue, EPS, Free Cash Flow — 5 years, real reported data only |
| 6 | Dividend | Yield (5y), payout ratio, dividend history |
| 7 | Risks | Thai-language risk summary drafted from the locked report |
| 8 | Stock Profile | Descriptive characteristics only — **not** suitability (R11) |

**Kept out of the main view, available in Advanced mode:** FCFF, FCFE, WACC,
CAPM, Monte Carlo, Residual Income, debt schedule, working-capital schedule,
10-year forecast, EV bridge, sensitivity matrix.

## Build order

1. **Supabase project + Auth** (R10b) — blocks launch; Kan's 15-minute task.
2. **Data pipeline** (R7) — EDGAR companyfacts + quote cron → per-ticker JSON.
3. **Rule engine** (R9) — traffic lights with drill-down to the underlying figures.
4. **Dashboard, 8 modules** (R13) — warm paper, mobile-first, inside `/research`.
5. **Content pipeline** (R9) — DEEP+O → Thai draft → Kan review → publish.
6. **Legal surface** (R11) — ToS, Privacy (PDPA), methodology page, disclaimers.
7. **Archive `/plan`** (R8) — export the 8 records, remove routes and header link.
8. **Fill the universe to 20–25** (R4).
9. **Gate 0 dogfood → Gate 1 soft launch** (R12).

## External dependencies (Kan personally)

- **Create the Supabase project + keys** in `.env.local` and Vercel — now a real
  launch blocker, not a deferrable one.
- **Review 20–25 DEEP+O reports** — the true bottleneck, ~30–60 min each.
- Domain + Vercel deploy for the research surface.

## Standing constraints carried forward

- Evidence-first: every traffic light and every chart traces to reported data.
- Real-Money Protocol: this platform never issues buy/sell guidance (R11); the
  methodology page must stay accurate to what the pipeline actually computes.
- The journal is paused, not deleted; its specs remain valid if it resumes.
