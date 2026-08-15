# AAPL — DEEP+O v4.2 working paper (NOT PUBLISHED)

- MODE: FULL (web + code)
- Date: 2026-07-24 · Price used: $320.83 (Yahoo) · FY2025 ends 2025-09-27
- Status: **held for judgement.** Inputs are now fully sourced (ERP and beta
  from Damodaran); correcting them widened the gap to −70% and confirmed a
  >30% conflict between the DCF and the comps. The remaining question is which
  lens fits Apple, which is a judgement call, not a computation.

## What is verified

Every figure below traces to a filing or an official source.

**Revenue by category, FY2025 ($M, 10-K):**

| | FY2025 | share | YoY |
|---|---|---|---|
| iPhone | 209,586 | **50.4%** | +4% |
| Services | 109,158 | 26.2% | **+14%** |
| Wearables, Home & Accessories | 35,686 | 8.6% | −4% |
| Mac | 33,708 | 8.1% | +12% |
| iPad | 28,023 | 6.7% | +5% |
| **Total** | **416,161** | 100% | +6% |

**Gross margin, FY2025 (10-K):** Products 36.8% ($112,887M) · Services **75.4%**
($82,314M) · blended 46.9%. Services is 26.2% of revenue and **42.2% of gross
profit**, and its margin has risen three years running (70.8 → 73.9 → 75.4).

**Geography:** Americas $178,353M (+7%) · Europe $111,032M (+10%) · **Greater
China $64,377M (−4%, after −8%)** · Japan $28,703M (+15%) · Rest of APAC
$33,696M (+10%).

**From EDGAR:** revenue $416.2B · net profit $112.0B (26.9% margin, best in the
window) · free cash flow $98.8B · capex $12.7B (3.1% of revenue — asset-light) ·
net debt $54.7B against $111.5B operating cash flow (0.49 years) · dividend paid
all five years, $0.85 → $1.02, payout 13.8%.

## Retail Lights Reconciliation

| Light | Result | Basis |
|---|---|---|
| รายได้ | **ดี** | grew in 2 of 3 (2023 −3%, 2024 +2%, 2025 +6%) |
| กำไรสุทธิ | **น่ากังวล** | fell in 2 of 3 (2023 −2.8%, 2024 −3.4%) before a +19.5% 2025 |
| กระแสเงินสด | **ดี** | positive every year, latest −9% — inside the 40% band |
| หนี้สิน | **ดี** | 0.49 years of operating cash flow |

**Correction from the earlier draft, which reconciled net profit wrong.** The
rule reads three years of change, and Apple's net profit was down in 2023 and
2024 — the 2024 dip driven by a one-off EU back-tax charge, not an operating
decline; net income margin actually rose to a five-year high of 26.9% in 2025.
The light is red on the letter of the rule, and it is correct to be: it is not
the reconciliation's job to override a rule it dislikes, but to explain the
gap. The explanation (a tax-driven dip, not deterioration) goes into
`weaknesses` where the reader sees it, beside a 4-star quality score.

Beyond that one light, the trailing figures are strong. The question is price.

## Valuation — and why it is being held back

Model: five-year FCF projection with a margin glide, terminal perpetuity,
discounted at WACC. Computed in `scripts/aapl-dcf.mjs`.

Inputs are now sourced, not assumed: risk-free **4.67%** (US 10Y, Treasury.gov
2026-07-22) · ERP **4.42%** (Damodaran implied US, 2026-07-01) · beta **1.342**
(Damodaran Computers/Peripherals unlevered 1.32, Jan-2026, relevered to Apple's
2% D/E) · WACC **10.49%** · terminal growth 2.5%.

| Scenario | p | growth | stable FCF margin | value |
|---|---|---|---|---|
| Bear | 25% | 2.0% | 21.5% | $72.55 |
| Base | 50% | 5.5% | 25.0% | $96.87 |
| Bull | 25% | 8.0% | 27.0% | $115.71 |
| **E[V]** | | | | **$95.50** |

Against $320.83 that is **−70%**. Replacing the assumed inputs with sourced ones
**widened** the gap — the real beta (1.34) is higher than the 1.10 first
guessed, which lifts the discount rate and lowers the value. That is the tell:
the result does not move toward the market when the inputs are corrected, so the
disagreement is structural, not clerical.

**The gap is not about growth.** It is the terminal multiple:

- The market pays **48.6× free cash flow** ($4.80T on $98.8B).
- WACC 10.49% with 2.5% terminal growth implies **12.5×**.
- Even WACC 7.0% with 4.0% terminal growth reaches only 33.3×.

## Triangulation — the second estimate the DCF was missing

A DCF alone is one lens. Against mega-cap peers on the same date:

| | P/FCF | FCF yield | P/E | revenue growth |
|---|---|---|---|---|
| AAPL | 48.6× | 2.06% | 43.0× | +6% |
| META | 32.8× | 3.05% | 25.5× | +22% |
| AMZN | 322× | 0.31% | 32.5× | +12% |
| LLY | 118× | 0.85% | 51.5× | +45% |

This is where the two lenses disagree, and the disagreement is the finding.
**Every mega-cap trades at a free-cash-flow multiple a perpetuity DCF cannot
reproduce** — AMZN at 322×, LLY at 118×. Apple at 48.6× is high for 6% growth
and richer than META, which grows far faster, but it is not the extreme outlier
against its peer set that the DCF's −70% makes it against its own intrinsic
value. The comps say "expensive for the growth"; the DCF says "worth a third of
this." A conflict this size (>30%) caps confidence under the v3.1 rule, and the
report cannot resolve it by computation — only by naming which lens is wrong for
this company.

What would have to be true to reach $320.83, holding the other inputs at Base:

| Lever | Required |
|---|---|
| WACC | **~5.0%** — with a 4.67% risk-free that is an equity risk premium of roughly zero |
| Terminal growth | above 5.5% in perpetuity |
| Stable FCF margin | **~80%**, against 23.7% today |

The reverse DCF cannot solve for an implied growth rate: at the Base margin,
even 25%/yr does not reach the price. Each lever on its own is implausible; the
market is not underwriting any single one of them but paying for the franchise
as a whole, which is precisely what the comps capture and the DCF does not.

## Why this is still not being published

The inputs the earlier draft flagged as assumptions are now sourced — ERP and
beta both come from Damodaran — and the comps cross-check is done. Correcting
them did not close the gap; it widened it and confirmed a >30% conflict between
the two lenses. What remains is not a data gap but a frame question, and that is
a judgement call:

1. **The two lenses genuinely disagree, and neither is obviously right.** The
   DCF says −70%. The comps say expensive-for-growth but in line with a peer set
   that all trades far above what a perpetuity DCF allows. When a whole cohort of
   the largest, most-analysed companies sits at 33–322× free cash flow, the
   honest reading is that the market prices mega-cap quality on something a
   five-year-plus-perpetuity model does not capture — brand durability, an
   installed base, the optionality of a 75%-margin services annuity — not that
   every one of them is 60–90% overvalued.

2. **Publishing −70% on Apple would be a claim about the model, dressed as a
   claim about the stock.** The number is real arithmetic on sourced inputs, but
   presenting it to a beginner as "value $95" implies a confidence the
   triangulation does not support.

3. **This is exactly the call the sign-off gate exists for.** Under the locked
   rules the analyst signs before anything reaches the site. AMZN and LLY were
   clear enough to sign; this one is not, and that is information, not failure.

## What would make it publishable

- **Resolve the frame explicitly.** Either (a) treat the services annuity with a
  higher terminal multiple / lower terminal discount and re-run, or (b) make the
  comps the primary lens and the DCF the cross-check, inverting the usual order
  for a company whose value is this concentrated in a durable franchise.
- **Set a verdict the triangulation can carry.** With a >30% lens conflict the
  framework caps confidence at 3; a publishable entry needs an E[V], a verdict
  and a trigger that both lenses can live with, which today they cannot.

Sections 2A and 7A are fully grounded and would stand on their own — but a
registry entry needs a verdict, an E[V] and a trigger, so nothing ships until the
frame question is settled. That decision is yours, not the model's.

## Sources

- [AAPL Form 10-K FY2025](https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250927.htm) — revenue by category, gross margin by products and services, segment net sales
- [EDGAR companyfacts CIK 0000320193](https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json) — five-year financials
- [US Treasury daily yield curve](https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/2026/all?type=daily_treasury_yield_curve) — 10Y at 4.67%, 2026-07-22
- [Damodaran — Betas by Sector](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html) — Computers/Peripherals unlevered beta 1.32 (cash-corrected), Jan-2026
- [Damodaran — Historical Implied ERP](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histimpl.html) — US implied ERP 4.42% / mature-market 4.20%, 2026-07-01
