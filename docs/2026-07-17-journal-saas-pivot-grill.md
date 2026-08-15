# Cerfinits Journal — SaaS Pivot Grill

- Date: 2026-07-17
- Track: Product / Cerfinits
- AI-OS gate: G1 — Grill (11 questions, all resolved)
- Status: LOCKED — Kan confirmed every decision below
- Supersedes: journal MVP scope "Kan as single user" (2026-07-14 grill D5) and
  visual direction D9; the G2.1 takeover data-integrity principles remain in force.

## Trigger

Kan wants the journal to compete with Tradespad.com as a real paid SaaS.
Reference features requested: Tradespad-grade look and feel, economic
calendar, broker auto-sync.

## Locked decisions

| # | Decision | Resolution |
|---|---|---|
| S1 | Positioning | **Differentiated wedge, not feature parity**: Thai-language R-first journal integrated with the Cerfinits Grade course (journal surfaces the weakness → links to the module that fixes it) + shareable R-card. Do not chase Tradespad's roadmap. |
| S2 | Priority | **SaaS first.** Main-site/course launch is paused. (Recommendation was launch-first with journal as free flagship; Kan overrode — accepted, with hard gates in S11 as the safety net.) |
| S3 | Market | **Thailand first.** Thai UI leads, Thai payment rails, PDPA. Global/EN is a later phase (the `<T th en>` groundwork already exists). |
| S4 | Pricing | **Freemium.** Free: full journal for 1 account — manual + CSV, R-first analytics, P&L calendar, R-card. Forever free; it is the funnel. Pro ~**249฿/mo** (~20% off yearly): multi-account, auto-sync, economic calendar, chart screenshots, advanced export. Free/Pro line = features with real running costs. |
| S5 | v1 scope | (1) Supabase cutover (per-user + prepared RLS) + signup/login + payment · (2) redesign to a show-off standard · (3) per-trade chart screenshots (D7 reinstated — real functional gap) · (4) economic calendar inside the P&L calendar · (5) auto-sync **cTrader only** via Open API (OAuth, read-only). **Cut from v1:** MT5/other brokers, backtesting, communities, TradingView embeds, EN. |
| S6 | Sync architecture | **Pull-based**: fetch on app open / manual refresh + daily cron. Supabase Edge Functions + pg_cron; no always-on server, no streaming. Upgrade path exists if users demand it. |
| S7 | Design (D9 revised) | **Cerfinits palette + dual theme.** Dark and light both supported; **dark is the in-app default** for the pro "trading screen" feel. Brand DNA keeps: ink/gold, hairlines, near-square geometry, Anuphan/Geist Mono. Marketing site stays warm paper. Never a blue-black fintech clone. |
| S8 | Payments | **PromptPay QR + semi-automatic activation** for v1 (admin approve at first, automate later; 30-day/annual passes with renewal reminders). Subscription schema carries `expiry` + `source` so a real gateway (card/MoR) can slot in once revenue is proven. Income = personal income; keep evidence per the 8.2 discipline from day one. |
| S9 | Data & legal minimum | Non-negotiable before the first real user: ToS + Privacy Policy (PDPA-aligned, human-readable) + Risk Disclosure pages; in-app consent, data export (exists), permanent account deletion (to build); broker access is OAuth read-only only — never store broker credentials; never sell/share user data. |
| S10 | Support & ops | **LINE OA is the single support channel** (email/IG DMs redirect there). SLA: reply within 1 business day. Help/FAQ page; any question asked twice becomes FAQ. Ops time budget ≤1 hr/day — exceeding it consistently means pause new signups, not lose sleep. Indie transparency: the site says it is a one-person product. |
| S11 | Gates & kill criteria | **Gate 0** dogfood: Kan uses it on real trading ≥2 weeks (G4 carryover). **Gate 1** private beta: 10–20 users from @Crzin_s, free, 2 weeks — pass requires ≥50% still active in week 2 AND sync success ≥95% without manual fixes; no sale until passed. **Gate 2** open Pro sales: first target 10 paying users within 60 days. **Kill:** at 90 days after sales open, if paying < 10 OR first-month churn > 50% → stop SaaS development; journal reverts to the site's free flagship tool (nothing wasted, role change only). Infra spend cap ~1,000฿/mo until revenue covers it. |

## Build order

1. **Supabase cutover** — auth live, per-user rows + RLS (staging schema exists), migrate localStorage flow to remote source of truth with the existing checksum/reconciliation specs. Foundation for everything.
2. **Dual-theme redesign** (S7) — tokens first, then surfaces.
3. **Chart screenshots** per trade (Supabase Storage, Pro-gated).
4. **Economic calendar** (data source TBD at build time; render inside P&L calendar).
5. **cTrader auto-sync** — Open API OAuth app, pull-based Edge Function + cron (S6).
6. **Billing** — PromptPay flow + subscription table + admin approve screen (S8).
7. **Legal pages + account deletion** (S9), LINE OA setup (S10).
8. Gate 0 dogfood → Gate 1 beta → Gate 2 sale (S11).

## External dependencies (Kan personally)

- Create the Supabase project (SQL + keys — pending since Phase 2 was defined).
- Register a cTrader Open API application (client id/secret).
- Set up LINE Official Account.
- Domain + Vercel deploy for the app surface.

## Standing constraints carried forward

- G2.1 data-integrity principles still bind: idempotent imports, no guessed
  P&L/R, undo on mutations, versioned storage, "Needs info" over inference.
- Real-Money Protocol: production financial data remains STOP-SHIP until the
  Supabase cutover passes its RLS tests and checksum reconciliation.
