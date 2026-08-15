// Retail research dashboard — scoring and health rules.
//
// Locked by docs/2026-07-23-research-platform-pivot-grill.md:
// - R6: stars measure business quality ONLY. Valuation is a separate badge.
//       The two are never merged into one score.
// - R9: "numbers decide, AI narrates, Kan signs" — every traffic light here is a
//       rule over reported figures and carries the evidence that produced it, so
//       the UI can answer "why is this green?".
// - R11: nothing in this module may express buy / sell / hold / wait. Output is
//       descriptive only.

import type { BusinessProfile, BusinessRisk, Translatable } from "../reports";

export type Tone = "good" | "watch" | "poor";

/**
 * The only fields the retail dashboard reads from a report.
 *
 * Deliberately narrow: passing the whole StockReport would serialise the
 * analyst verdict wording, the two-language one-pager and the sensitivity grid
 * into the RSC payload of every page load — bloat, and buy/sell language in the
 * HTML of a surface that must not carry it (R11).
 */
export type DashboardView = {
  ticker: string;
  company: string;
  exchange: string;
  asOf: string;
  quality: number;
  /** Probability-weighted DEEP+O estimate, E[V]. */
  estimate: number;
  /** Section 2A / 7A of a v4.2 report; absent on anything written before it. */
  business?: BusinessProfile;
  businessRisks?: BusinessRisk[];
};

/** A rule verdict plus the figures that produced it, for the UI drill-down. */
export type HealthLight = {
  tone: Tone;
  /** The rule that was applied, shown verbatim under the light. */
  rule: string;
  /** The values the rule read, oldest → newest. */
  evidence: { label: string; value: string }[];
};

/** Yearly reported figures from EDGAR companyfacts. Oldest → newest. */
export type YearPoint = { fiscalYear: number; value: number };

/**
 * The per-ticker fundamentals the data pipeline (build order #2) will produce.
 * Absent until that lands; the dashboard renders pending states meanwhile
 * rather than inventing numbers (R7: charts must be real reported data).
 */
export type StockFundamentals = {
  ticker: string;
  /** Fiscal period the figures come from, e.g. "Q2 2026". */
  period: string;
  /** ISO date this snapshot was built. */
  updatedAt: string;

  revenue: YearPoint[];
  netProfit: YearPoint[];
  freeCashFlow: YearPoint[];
  eps: YearPoint[];
  capex: YearPoint[];

  netDebt: number | null;
  /** Latest full-year operating cash flow — the denominator of the debt rule. */
  operatingCashFlow: number | null;

  dividendPerShare: YearPoint[];
  payoutRatio: number | null;

  /**
   * Latest annual weighted-average share count. Not a point-in-time figure —
   * a company buying back stock has fewer shares today — so market cap derived
   * from it is approximate, which is fine for conveying company size.
   */
  sharesOutstanding: number | null;
  industry: string | null;
};

// ---------------------------------------------------------------------------
// Quality stars (R6) — business quality axis only.
// ---------------------------------------------------------------------------

/** DEEP+O Quality Score (0–100) → 1–5 stars. */
export function qualityToStars(quality: number): number {
  if (!Number.isFinite(quality)) return 0;
  if (quality >= 90) return 5;
  if (quality >= 80) return 4;
  if (quality >= 70) return 3;
  if (quality >= 60) return 2;
  return 1;
}

// ---------------------------------------------------------------------------
// Valuation badge (R6) — price vs modelled value, kept off the star axis.
// ---------------------------------------------------------------------------

export type ValuationBadge = {
  tone: Tone;
  /** Signed fraction: +0.2 means the estimate sits 20% above the price. */
  gap: number;
};

export const VALUATION_BANDS = { cheap: 0.2, expensive: -0.1 } as const;

/**
 * Compare the live price against the DEEP+O probability-weighted estimate.
 * `good` only ever means "priced below the estimate" — never "buy" (R11).
 */
export function valuationBadge(estimate: number, price: number): ValuationBadge {
  if (!(price > 0) || !Number.isFinite(estimate)) return { tone: "watch", gap: 0 };
  // Round to the precision actually displayed (0.01%), so a gap that is exactly
  // on a band edge lands on the intended side instead of on float dust —
  // 120/100 - 1 evaluates to 0.19999999999999996.
  const gap = Math.round((estimate / price - 1) * 1e4) / 1e4;
  if (gap >= VALUATION_BANDS.cheap) return { tone: "good", gap };
  if (gap <= VALUATION_BANDS.expensive) return { tone: "poor", gap };
  return { tone: "watch", gap };
}

// ---------------------------------------------------------------------------
// Financial health rules (R9). Each returns the evidence it read.
// ---------------------------------------------------------------------------

/** ±2% counts as flat rather than a real move. */
export const GROWTH_BAND = 0.02;

function yoyMoves(series: YearPoint[], years: number): number[] {
  const tail = series.slice(-(years + 1));
  const moves: number[] = [];
  for (let i = 1; i < tail.length; i += 1) {
    const prev = tail[i - 1].value;
    const curr = tail[i].value;
    if (!(Math.abs(prev) > 0)) continue;
    moves.push(curr / Math.abs(prev) - 1);
  }
  return moves;
}

function lastPoints(series: YearPoint[], count: number, format: (v: number) => string) {
  return series
    .slice(-count)
    .map((p) => ({ label: String(p.fiscalYear), value: format(p.value) }));
}

/**
 * Growing in most of the recent years, shrinking in most, or neither.
 * Used for both revenue and net profit — same question, same rule.
 */
export function trendLight(
  series: YearPoint[],
  format: (v: number) => string,
  years = 3,
): HealthLight | null {
  const moves = yoyMoves(series, years);
  if (moves.length < 2) return null;

  const majority = Math.ceil(moves.length / 2);
  const up = moves.filter((m) => m > GROWTH_BAND).length;
  const down = moves.filter((m) => m < -GROWTH_BAND).length;

  const tone: Tone = up >= majority ? "good" : down >= majority ? "poor" : "watch";
  return {
    tone,
    rule: `โตใน ${up} จาก ${moves.length} ปีล่าสุด · หดใน ${down} ปี`,
    evidence: lastPoints(series, years + 1, format),
  };
}

/** A drop this steep in the latest year is treated as a change of state. */
export const CASH_FLOW_SLUMP = 0.4;

/**
 * Free cash flow: consistently positive, occasionally negative, or mostly
 * negative — and separately, whether the latest year fell off a cliff.
 *
 * Sign alone is not enough. Amazon's free cash flow was positive in each of the
 * last three years yet fell 77% in the most recent one; reporting that as
 * simply "good" would tell a beginner the opposite of what happened.
 */
export function cashFlowLight(
  series: YearPoint[],
  format: (v: number) => string,
  years = 3,
): HealthLight | null {
  const recent = series.slice(-years);
  if (recent.length < 2) return null;

  const negatives = recent.filter((p) => p.value < 0).length;
  const evidence = lastPoints(series, years, format);

  if (negatives > 0) {
    return {
      tone: negatives >= Math.ceil(recent.length / 2) ? "poor" : "watch",
      rule: `กระแสเงินสดอิสระติดลบ ${negatives} จาก ${recent.length} ปีล่าสุด`,
      evidence,
    };
  }

  const prev = recent.at(-2)!.value;
  const last = recent.at(-1)!.value;
  const drop = prev > 0 ? 1 - last / prev : 0;
  if (drop >= CASH_FLOW_SLUMP) {
    return {
      tone: "watch",
      rule: `เป็นบวกทุกปี แต่ปีล่าสุดลดลง ${Math.round(drop * 100)}% จากปีก่อน`,
      evidence,
    };
  }

  return {
    tone: "good",
    rule: `กระแสเงินสดอิสระเป็นบวกทุกปีใน ${recent.length} ปีล่าสุด`,
    evidence,
  };
}

// ---------------------------------------------------------------------------
// Stock traits (module 8) — descriptive only, never suitability (R11.2).
//
// Derived in code rather than asked of the analyst: every input is a reported
// figure or a price series, so each trait states the number behind it and needs
// no review cycle (R9).
// ---------------------------------------------------------------------------

export type StockTrait = { label: Translatable; detail: string };

export const TRAIT_BANDS = {
  growthFast: 0.15,
  growthSlow: 0.05,
  capexHeavy: 0.15,
  capexLight: 0.05,
  steadyDividendYears: 5,
  volatileHigh: 0.4,
  volatileLow: 0.2,
} as const;

/** Compound annual growth between the first and last point of a series. */
export function cagr(series: YearPoint[]): number | null {
  if (series.length < 2) return null;
  const first = series[0];
  const last = series[series.length - 1];
  const years = last.fiscalYear - first.fiscalYear;
  if (years <= 0 || !(first.value > 0) || !(last.value > 0)) return null;
  return (last.value / first.value) ** (1 / years) - 1;
}

/** Annualised standard deviation of daily returns, from closing prices. */
export function annualisedVolatility(closes: number[]): number | null {
  if (closes.length < 30) return null;
  const returns: number[] = [];
  for (let i = 1; i < closes.length; i += 1) {
    if (closes[i - 1] > 0) returns.push(closes[i] / closes[i - 1] - 1);
  }
  if (returns.length < 20) return null;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((a, r) => a + (r - mean) ** 2, 0) / (returns.length - 1);
  return Math.sqrt(variance) * Math.sqrt(252);
}

const pctText = (v: number) => `${(v * 100).toFixed(0)}%`;

export function stockTraits(
  f: StockFundamentals,
  closes: number[] | null,
): StockTrait[] {
  const traits: StockTrait[] = [];

  const growth = cagr(f.revenue);
  if (growth != null) {
    const detail = `รายได้เติบโตเฉลี่ย ${pctText(growth)} ต่อปี ในช่วง ${f.revenue.length} ปีที่ผ่านมา`;
    if (growth >= TRAIT_BANDS.growthFast) {
      traits.push({ label: { th: "เติบโตสูง", en: "High growth" }, detail });
    } else if (growth >= TRAIT_BANDS.growthSlow) {
      traits.push({ label: { th: "เติบโตปานกลาง", en: "Moderate growth" }, detail });
    } else {
      traits.push({ label: { th: "เติบโตช้า", en: "Slow growth" }, detail });
    }
  }

  const years = f.dividendPerShare.length;
  if (years >= TRAIT_BANDS.steadyDividendYears) {
    traits.push({
      label: { th: "จ่ายปันผลสม่ำเสมอ", en: "Steady dividend" },
      detail: `จ่ายปันผลต่อเนื่องอย่างน้อย ${years} ปี`,
    });
  } else if (years > 0) {
    traits.push({
      label: { th: "เพิ่งเริ่มจ่ายปันผล", en: "New dividend payer" },
      detail: `มีประวัติจ่ายปันผล ${years} ปี`,
    });
  } else {
    traits.push({
      label: { th: "ไม่จ่ายปันผล", en: "No dividend" },
      detail: `ไม่มีประวัติจ่ายปันผลใน ${f.revenue.length} ปีที่ดูได้`,
    });
  }

  // Capital intensity: how much of a year's sales goes back into plant.
  const capex = f.capex.at(-1)?.value;
  const revenue = f.revenue.at(-1)?.value;
  if (capex != null && revenue != null && revenue > 0) {
    const ratio = Math.abs(capex) / revenue;
    const detail = `ใช้เงินลงทุนในสินทรัพย์ถาวรราว ${pctText(ratio)} ของรายได้ในปีล่าสุด`;
    if (ratio >= TRAIT_BANDS.capexHeavy) {
      traits.push({ label: { th: "ลงทุนหนัก", en: "Capital-hungry" }, detail });
    } else if (ratio < TRAIT_BANDS.capexLight) {
      traits.push({ label: { th: "ใช้เงินลงทุนน้อย", en: "Asset-light" }, detail });
    }
  }

  const lossYears = f.netProfit.filter((p) => p.value < 0).length;
  if (lossYears > 0) {
    traits.push({
      label: { th: "กำไรเคยติดลบ", en: "Has posted losses" },
      detail: `ขาดทุน ${lossYears} ปี จาก ${f.netProfit.length} ปีที่ดูได้`,
    });
  }

  const vol = closes ? annualisedVolatility(closes) : null;
  if (vol != null) {
    const detail = `ความผันผวนของราคาย้อนหลังราว ${pctText(vol)} ต่อปี`;
    if (vol >= TRAIT_BANDS.volatileHigh) {
      traits.push({ label: { th: "ราคาผันผวนสูง", en: "Highly volatile" }, detail });
    } else if (vol < TRAIT_BANDS.volatileLow) {
      traits.push({ label: { th: "ราคาค่อนข้างนิ่ง", en: "Relatively steady" }, detail });
    } else {
      traits.push({ label: { th: "ผันผวนปานกลาง", en: "Moderately volatile" }, detail });
    }
  }

  return traits;
}

/**
 * Leverage as net debt over annual operating cash flow — roughly "how many
 * years of cash generation would clear the debt".
 *
 * EBITDA would be the textbook denominator, but it is not reliably derivable
 * from XBRL: Eli Lilly, a mega-cap, tags no `OperatingIncomeLoss` at all, so an
 * EBITDA-based light would sit blank for a meaningful share of the universe.
 * `NetCashProvidedByUsedInOperatingActivities` is tagged by essentially every
 * filer, and the "years of cash flow" framing reads better for a beginner than
 * a multiple of an adjusted earnings figure.
 *
 * Thresholds are this module's documented defaults and still want reconciling
 * against the DEEP+O v4 Credit Module. They are exported so the UI can state
 * them next to the light.
 */
export const LEVERAGE_THRESHOLDS = { good: 2, watch: 4 } as const;

export function debtLight(
  netDebt: number | null,
  operatingCashFlow: number | null,
  format: (v: number) => string,
): HealthLight | null {
  if (netDebt == null || operatingCashFlow == null || !(operatingCashFlow > 0)) return null;

  // Net cash (more cash than debt) is unambiguously the healthy end.
  if (netDebt <= 0) {
    return {
      tone: "good",
      rule: "มีเงินสดมากกว่าหนี้สิน",
      evidence: [
        { label: "หนี้สุทธิ", value: format(netDebt) },
        { label: "กระแสเงินสดจากการดำเนินงาน", value: format(operatingCashFlow) },
      ],
    };
  }

  const ratio = netDebt / operatingCashFlow;
  const tone: Tone =
    ratio < LEVERAGE_THRESHOLDS.good
      ? "good"
      : ratio <= LEVERAGE_THRESHOLDS.watch
        ? "watch"
        : "poor";

  return {
    tone,
    rule: `หนี้สุทธิ / กระแสเงินสดจากการดำเนินงาน = ${ratio.toFixed(1)} ปี (ดี < ${LEVERAGE_THRESHOLDS.good} · เฝ้าระวัง ≤ ${LEVERAGE_THRESHOLDS.watch})`,
    evidence: [
      { label: "หนี้สุทธิ", value: format(netDebt) },
      { label: "กระแสเงินสดจากการดำเนินงาน", value: format(operatingCashFlow) },
    ],
  };
}
