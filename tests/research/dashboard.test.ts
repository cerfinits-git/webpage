import test from "node:test";
import assert from "node:assert/strict";
import {
  qualityToStars,
  valuationBadge,
  trendLight,
  cashFlowLight,
  debtLight,
  cagr,
  annualisedVolatility,
  stockTraits,
  LEVERAGE_THRESHOLDS,
  type YearPoint,
} from "../../lib/research/dashboard.ts";
import { REPORTS } from "../../lib/reports.ts";

const raw = (v: number) => String(v);
const years = (...values: number[]): YearPoint[] =>
  values.map((value, i) => ({ fiscalYear: 2021 + i, value }));

/** Amazon-shaped: fast growth, no dividend, heavy capex, one loss year. */
const FUNDAMENTALS = {
  ticker: 'TEST', period: 'FY 2025', updatedAt: '2026-07-23',
  revenue: years(469.8e9, 514e9, 574.8e9, 638e9, 716.9e9),
  netProfit: years(33.4e9, -2.7e9, 30.4e9, 59.2e9, 77.7e9),
  freeCashFlow: years(-14.7e9, -16.9e9, 32.2e9, 32.9e9, 7.7e9),
  eps: years(3.24, -0.27, 2.9, 5.53, 7.17),
  capex: years(61e9, 63.6e9, 52.7e9, 83e9, 131.8e9),
  netDebt: -18.4e9, operatingCashFlow: 139.5e9,
  dividendPerShare: [], payoutRatio: null,
  sharesOutstanding: 10.656e9, industry: 'Retail',
};

test("quality stars stay on the business-quality axis alone", () => {
  assert.equal(qualityToStars(91), 5);
  assert.equal(qualityToStars(90), 5);
  assert.equal(qualityToStars(86), 4);
  assert.equal(qualityToStars(80), 4);
  assert.equal(qualityToStars(70), 3);
  assert.equal(qualityToStars(59), 1);
  assert.equal(qualityToStars(Number.NaN), 0);
});

test("LLY keeps five stars while its price reads expensive (the v2 bug)", () => {
  // The case that proved quality and valuation must never share one score:
  // highest quality ever scored, yet priced far above the modelled estimate.
  const lly = REPORTS.find((r) => r.ticker === "LLY");
  assert.ok(lly, "LLY report present");

  assert.equal(qualityToStars(lly.quality), 5);
  const badge = valuationBadge(lly.valuation.ev, lly.refPrice);
  assert.equal(badge.tone, "poor");
  assert.ok(badge.gap < -0.3, `expected a deep discount gap, got ${badge.gap}`);
});

test("valuation badge bands match the published reports", () => {
  const meta = REPORTS.find((r) => r.ticker === "META");
  const amzn = REPORTS.find((r) => r.ticker === "AMZN");
  assert.ok(meta && amzn);

  // META: estimate ~13% above price → neither cheap nor expensive.
  assert.equal(valuationBadge(meta.valuation.ev, meta.refPrice).tone, "watch");
  // AMZN: estimate ~25% below price → expensive.
  assert.equal(valuationBadge(amzn.valuation.ev, amzn.refPrice).tone, "poor");

  assert.equal(valuationBadge(120, 100).tone, "good"); // +20% exactly
  assert.equal(valuationBadge(90, 100).tone, "poor"); // −10% exactly
  assert.equal(valuationBadge(100, 0).tone, "watch"); // no price, no claim
});

test("trend light needs a majority of years, not one good year", () => {
  assert.equal(trendLight(years(100, 110, 121, 133), raw)?.tone, "good");
  assert.equal(trendLight(years(100, 90, 81, 73), raw)?.tone, "poor");
  // Two up years out of three is a majority, even with a bad year in between.
  assert.equal(trendLight(years(100, 130, 95, 125), raw)?.tone, "good");
  // Up, down, flat — nothing reaches a majority.
  assert.equal(trendLight(years(100, 130, 95, 96), raw)?.tone, "watch");
  // Moves inside ±2% count as flat, so nothing reaches a majority.
  assert.equal(trendLight(years(100, 101, 102, 103), raw)?.tone, "watch");
});

test("trend light reports the evidence it read and refuses thin series", () => {
  const light = trendLight(years(100, 110, 121, 133), raw);
  assert.deepEqual(
    light?.evidence.map((e) => e.label),
    ["2021", "2022", "2023", "2024"],
  );
  assert.match(light!.rule, /โตใน 3 จาก 3 ปีล่าสุด/);
  assert.equal(trendLight(years(100, 110), raw), null);
});

test("cash flow light distinguishes one bad year from a bad habit", () => {
  assert.equal(cashFlowLight(years(10, 12, 14), raw)?.tone, "good");
  assert.equal(cashFlowLight(years(10, -2, 14), raw)?.tone, "watch");
  assert.equal(cashFlowLight(years(-5, -2, 14), raw)?.tone, "poor");
});

test("a collapsing but still positive cash flow does not read as good", () => {
  // Amazon's shape: positive every year, then a 77% fall in the latest.
  const light = cashFlowLight(years(32.2e9, 32.9e9, 7.7e9), raw);
  assert.equal(light?.tone, "watch");
  assert.match(light!.rule, /ปีล่าสุดลดลง 77%/);

  // A mild dip is still good.
  assert.equal(cashFlowLight(years(30, 32, 28), raw)?.tone, "good");
});

test("debt light applies the documented leverage thresholds", () => {
  assert.equal(debtLight(100, 100, raw)?.tone, "good"); // 1.0 years
  assert.equal(debtLight(300, 100, raw)?.tone, "watch"); // 3.0 years
  assert.equal(debtLight(500, 100, raw)?.tone, "poor"); // 5.0 years
  assert.equal(debtLight(LEVERAGE_THRESHOLDS.watch * 100, 100, raw)?.tone, "watch"); // boundary
  assert.equal(debtLight(null, 100, raw), null);
  assert.equal(debtLight(100, 0, raw), null); // no cash generation, no verdict
  assert.equal(debtLight(100, -50, raw), null); // negative operating cash flow
});

test("net cash reads as healthy without dividing by anything", () => {
  const light = debtLight(-5000, 1000, raw);
  assert.equal(light?.tone, "good");
  assert.match(light!.rule, /มีเงินสดมากกว่าหนี้สิน/);
});

test("every light states the rule it applied so the UI can justify it", () => {
  const lights = [
    trendLight(years(100, 110, 121, 133), raw),
    cashFlowLight(years(10, 12, 14), raw),
    debtLight(100, 100, raw),
  ];
  for (const light of lights) {
    assert.ok(light, "light produced");
    assert.ok(light.rule.length > 0, "rule text present");
    assert.ok(light.evidence.length > 0, "evidence present");
  }
});

test("CAGR compounds between the first and last reported year", () => {
  // 100 → 200 over four years.
  const g = cagr(years(100, 0, 0, 0, 200));
  assert.ok(g !== null);
  assert.ok(Math.abs(g - (2 ** 0.25 - 1)) < 1e-9, `got ${g}`);
  assert.equal(cagr(years(100)), null); // one point proves nothing
  assert.equal(cagr(years(-10, 50)), null); // a negative base has no growth rate
});

test("volatility needs enough observations before it claims anything", () => {
  assert.equal(annualisedVolatility([100, 101, 102]), null);
  const flat = Array.from({ length: 60 }, () => 100);
  assert.equal(annualisedVolatility(flat), 0);
});

test("traits describe the company and never the reader", () => {
  const traits = stockTraits(FUNDAMENTALS, null);
  const labels = traits.map((t) => t.label.th);
  // 469.8B → 716.9B over four years is 11.2%/yr — the same base-case CAGR the
  // DEEP+O report reaches, and moderate rather than fast.
  assert.ok(labels.includes("เติบโตปานกลาง"), labels.join(" · "));
  assert.ok(labels.includes("ไม่จ่ายปันผล"));
  assert.ok(labels.includes("ลงทุนหนัก"));
  assert.ok(labels.includes("กำไรเคยติดลบ"));
  // R11.2: nothing may address the reader or imply an action.
  const banned = ["เหมาะ", "ควร", "ซื้อ", "ขาย", "คุณ", "น่าสนใจ"];
  for (const t of traits) {
    const text = `${t.label.th} ${t.detail}`;
    for (const word of banned) {
      assert.ok(!text.includes(word), `"${word}" appeared in "${text}"`);
    }
  }
});

test("every trait carries the figure that produced it", () => {
  for (const t of stockTraits(FUNDAMENTALS, null)) {
    assert.ok(/\d/.test(t.detail), `no number behind "${t.label.th}"`);
  }
});

test("a steady dividend payer reads differently from a new one", () => {
  const steady = { ...FUNDAMENTALS, dividendPerShare: years(1, 1.1, 1.2, 1.3, 1.4) };
  const fresh = { ...FUNDAMENTALS, dividendPerShare: years(1, 1.1) };
  assert.ok(stockTraits(steady, null).some((t) => t.label.th === "จ่ายปันผลสม่ำเสมอ"));
  assert.ok(stockTraits(fresh, null).some((t) => t.label.th === "เพิ่งเริ่มจ่ายปันผล"));
});

test("a per-share series spanning a split is not charted as a collapse", () => {
  // Super Micro's shape: FY2021 EPS is pre-split, the rest post-10:1.
  // Charting them together shows earnings per share falling 75% in a year
  // when they in fact rose, so the pre-split years must be dropped upstream.
  const spliced = years(2.09, 0.53, 1.14, 1.92, 1.68);
  const consistent = spliced.slice(1);
  const light = trendLight(consistent, raw);
  assert.equal(light?.tone, "good", "post-split years grow");
  assert.equal(trendLight(spliced, raw)?.tone, "good");
  // The guard lives in the pipeline; this records why the series is short.
  assert.equal(consistent.length, 4);
});
