// Builds the per-ticker fundamentals snapshots the research dashboard reads.
//
//   node scripts/build-fundamentals.mjs            (all tickers in the registry)
//   node scripts/build-fundamentals.mjs LLY AMZN   (just these)
//
// Source is SEC EDGAR only — companyfacts XBRL for the financials, submissions
// for the industry label. Both are official, free and unmetered. Output lands in
// content/research/<ticker>.json as committed content: reviewed data ships with
// the deploy (R3/R7 of docs/2026-07-23-research-platform-pivot-grill.md).
//
// Nothing here estimates or interpolates. A figure the filings do not carry is
// written as null and the dashboard renders a pending state instead.

import fs from "node:fs/promises";
import path from "node:path";

// SEC requires a descriptive User-Agent with contact details; without one the
// API answers 403. https://www.sec.gov/os/webmaster-faq#developers
const USER_AGENT = "Cerfinits Research (narabodin09ask@gmail.com)";
const OUT_DIR = path.join(process.cwd(), "content", "research");
const YEARS = 5;

// Concept names differ by filer and by era, so each metric carries a fallback
// chain tried in order. Verified against LLY / AMZN / META, which between them
// cover the common variants.
const CONCEPTS = {
  revenue: [
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "Revenues",
    "SalesRevenueNet",
    "RevenueFromContractWithCustomerIncludingAssessedTax",
  ],
  netProfit: ["NetIncomeLoss", "ProfitLoss"],
  eps: ["EarningsPerShareDiluted", "EarningsPerShareBasicAndDiluted"],
  operatingCashFlow: [
    "NetCashProvidedByUsedInOperatingActivities",
    "NetCashProvidedByUsedInOperatingActivitiesContinuingOperations",
  ],
  capex: [
    "PaymentsToAcquirePropertyPlantAndEquipment",
    // Lilly reports capital spending under this tag in its 10-K and only tags
    // PaymentsToAcquireProductiveAssets in quarterlies.
    "PaymentsToAcquireOtherPropertyPlantAndEquipment",
    "PaymentsToAcquireProductiveAssets",
  ],
  dividendPerShare: [
    "CommonStockDividendsPerShareDeclared",
    "CommonStockDividendsPerShareCashPaid",
  ],
  // Cash actually paid out — a firmer basis for the payout ratio than
  // per-share dividends multiplied by a share count from a different date.
  dividendsPaid: [
    "PaymentsOfDividendsCommonStock",
    "PaymentsOfDividends",
  ],
  cash: ["CashAndCashEquivalentsAtCarryingValue"],
  shortTermInvestments: ["ShortTermInvestments", "OtherShortTermInvestments"],
  longTermDebt: ["LongTermDebtNoncurrent", "LongTermDebt"],
  currentDebt: ["LongTermDebtCurrent", "DebtCurrent"],
  // The cover-page count (dei:EntityCommonStockSharesOutstanding) is the most
  // current figure but is missing for some filers — Meta tags none. Every filer
  // reports weighted-average shares because EPS depends on them, so those are
  // the dependable source. Basic sits closer to shares actually outstanding
  // than diluted, which adds unexercised options and RSUs.
  sharesOutstanding: [
    "WeightedAverageNumberOfSharesOutstandingBasic",
    "WeightedAverageNumberOfSharesOutstandingBasicAndDiluted",
    "WeightedAverageNumberOfDilutedSharesOutstanding",
  ],
};

const ANNUAL_FORMS = new Set(["10-K", "10-K/A"]);

async function secFetch(url) {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
}

/** ticker → zero-padded CIK, from SEC's own mapping file. */
async function loadTickerMap() {
  const raw = await secFetch("https://www.sec.gov/files/company_tickers.json");
  const map = new Map();
  for (const row of Object.values(raw)) {
    map.set(row.ticker.toUpperCase(), String(row.cik_str).padStart(10, "0"));
  }
  return map;
}

const daysBetween = (a, b) => (Date.parse(b) - Date.parse(a)) / 86_400_000;

/**
 * Pull one concept as a fiscal-year series.
 *
 * `fy`/`fp` on a fact describe the filing that reported it, not the period the
 * number covers — a single 10-K carries three years of figures all tagged with
 * the filing's own year. The period therefore comes from `end`, and annual
 * flows are recognised by a start→end span of roughly a year. Where a year
 * appears more than once (restatements), the most recently filed value wins.
 *
 * The fallback chain is merged rather than first-match: filers switch tags
 * mid-history, so one name can hold the recent years and another the older
 * ones. Amazon is the case in point — its capital spending sits under
 * PaymentsToAcquirePropertyPlantAndEquipment up to 2016 and under
 * PaymentsToAcquireProductiveAssets after, and taking whichever name merely
 * appeared first yielded a decade-old series. Earlier names in the chain win
 * when the same year appears under more than one.
 */
function series(facts, names, { instant = false, unit = "USD" } = {}) {
  const byYear = new Map();

  for (const name of names) {
    const rows = facts[name]?.units?.[unit];
    if (!rows) continue;

    for (const row of rows) {
      if (!ANNUAL_FORMS.has(row.form)) continue;
      if (instant) {
        if (row.start) continue; // want a balance, not a duration
      } else {
        if (!row.start) continue;
        const span = daysBetween(row.start, row.end);
        if (span < 340 || span > 400) continue;
      }
      const fiscalYear = new Date(row.end).getUTCFullYear();
      const prev = byYear.get(fiscalYear);
      // A year already claimed by an earlier name in the chain stays with it;
      // within one name, the latest filing wins (restatements).
      if (prev && (prev.rank < names.indexOf(name) || row.filed <= prev.filed)) continue;
      byYear.set(fiscalYear, { value: row.val, filed: row.filed, rank: names.indexOf(name) });
    }
  }

  return [...byYear.entries()]
    .sort((a, b) => a[0] - b[0])
    .slice(-YEARS)
    .map(([fiscalYear, v]) => ({ fiscalYear, value: v.value }));
}

const latest = (s) => (s.length ? s[s.length - 1].value : null);

/**
 * Per-share figures filed before a stock split are never restated in the older
 * filings that carry them, so a five-year window spanning a split mixes two
 * bases. Super Micro's FY2021 EPS implies 54M shares against 538M the next
 * year — a 10:1 split, which would draw a chart showing earnings per share
 * collapsing 75% in a year when they rose.
 *
 * Detect the break by the share count each year's figure implies, and keep only
 * the consistent trailing run. No company changes its share count several-fold
 * in a year without a split, so the threshold is safe against buybacks.
 */
function dropPreSplitYears(perShare, totals, label, ticker) {
  if (perShare.length < 2) return perShare;

  const totalByYear = new Map(totals.map((p) => [p.fiscalYear, p.value]));
  const implied = perShare.map((p) => {
    const total = totalByYear.get(p.fiscalYear);
    return total != null && p.value !== 0 ? Math.abs(total / p.value) : null;
  });

  let start = 0;
  for (let i = 1; i < implied.length; i += 1) {
    const prev = implied[i - 1];
    const curr = implied[i];
    if (prev == null || curr == null || !(prev > 0)) continue;
    const ratio = curr / prev;
    if (ratio > 2 || ratio < 0.5) start = i;
  }

  if (start > 0) {
    const dropped = perShare.slice(0, start).map((p) => p.fiscalYear).join(", ");
    console.warn(
      `  ⚠️  ${ticker}: ${label} for ${dropped} sits on a pre-split basis — dropped`,
    );
  }
  return perShare.slice(start);
}

/** Align two series on fiscal year and subtract — used for revenue-less derivations. */
function subtractSeries(a, b) {
  const bByYear = new Map(b.map((p) => [p.fiscalYear, p.value]));
  return a
    .filter((p) => bByYear.has(p.fiscalYear))
    .map((p) => ({ fiscalYear: p.fiscalYear, value: p.value - bByYear.get(p.fiscalYear) }));
}

async function buildTicker(ticker, cik) {
  const [facts, submission] = await Promise.all([
    secFetch(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`),
    secFetch(`https://data.sec.gov/submissions/CIK${cik}.json`),
  ]);
  const gaap = facts.facts["us-gaap"] ?? {};

  const revenue = series(gaap, CONCEPTS.revenue);
  const netProfit = series(gaap, CONCEPTS.netProfit);
  const epsRaw = series(gaap, CONCEPTS.eps, { unit: "USD/shares" });
  const eps = dropPreSplitYears(epsRaw, netProfit, "EPS", ticker);
  const ocf = series(gaap, CONCEPTS.operatingCashFlow);
  const capex = series(gaap, CONCEPTS.capex);
  const dividendPerShare = series(gaap, CONCEPTS.dividendPerShare, { unit: "USD/shares" });

  // Free cash flow is not filed as a line item; it is operating cash flow less
  // capital expenditure, both of which are.
  const freeCashFlow = subtractSeries(ocf, capex);

  const cash = latest(series(gaap, CONCEPTS.cash, { instant: true }));
  const shortTerm = latest(series(gaap, CONCEPTS.shortTermInvestments, { instant: true }));
  const longTermDebt = latest(series(gaap, CONCEPTS.longTermDebt, { instant: true }));
  const currentDebt = latest(series(gaap, CONCEPTS.currentDebt, { instant: true }));

  const totalDebt =
    longTermDebt == null && currentDebt == null ? null : (longTermDebt ?? 0) + (currentDebt ?? 0);
  const liquid = cash == null ? null : cash + (shortTerm ?? 0);
  const netDebt = totalDebt == null || liquid == null ? null : totalDebt - liquid;

  const netProfitLatest = latest(netProfit);
  const dividendsPaid = latest(series(gaap, CONCEPTS.dividendsPaid));
  const payoutRatio =
    dividendsPaid != null && netProfitLatest > 0 ? dividendsPaid / netProfitLatest : null;

  // Weighted-average shares are a duration fact, not a balance.
  const shares = latest(series(gaap, CONCEPTS.sharesOutstanding, { unit: "shares" }));

  const lastYear = revenue.at(-1)?.fiscalYear ?? netProfit.at(-1)?.fiscalYear ?? null;

  return {
    ticker: ticker.toUpperCase(),
    period: lastYear ? `FY ${lastYear}` : "unknown",
    updatedAt: new Date().toISOString().slice(0, 10),
    source: `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`,

    revenue,
    netProfit,
    freeCashFlow,
    eps,
    // Kept in its own right, not just as an input to free cash flow: capital
    // spending against revenue is what tells a reader whether this is a
    // capital-hungry business.
    capex,

    netDebt,
    operatingCashFlow: latest(ocf),

    dividendPerShare,
    payoutRatio,

    // Market cap moves with the price, so it is computed at render from the
    // live quote; the share count is what the filings actually carry.
    sharesOutstanding: shares,
    industry: submission.sicDescription ?? null,
    dividendYield: null,
  };
}

async function main() {
  const args = process.argv.slice(2).map((t) => t.toUpperCase());
  let tickers = args;
  if (tickers.length === 0) {
    const registry = await fs.readFile(path.join(process.cwd(), "lib", "reports.ts"), "utf8");
    tickers = [...registry.matchAll(/^\s*ticker:\s*"([A-Z.]+)"/gm)].map((m) => m[1]);
  }
  if (tickers.length === 0) {
    console.error("No tickers found.");
    process.exitCode = 1;
    return;
  }

  const map = await loadTickerMap();
  await fs.mkdir(OUT_DIR, { recursive: true });

  let failures = 0;
  for (const ticker of tickers) {
    const cik = map.get(ticker);
    if (!cik) {
      console.error(`${ticker}: not found in SEC ticker map — skipped`);
      failures += 1;
      continue;
    }
    try {
      const snapshot = await buildTicker(ticker, cik);
      const file = path.join(OUT_DIR, `${ticker.toLowerCase()}.json`);
      await fs.writeFile(file, JSON.stringify(snapshot, null, 2) + "\n");

      const rev = snapshot.revenue.at(-1);
      console.log(
        `${ticker.padEnd(6)} ${snapshot.period.padEnd(9)} ` +
          `revenue ${rev ? (rev.value / 1e9).toFixed(1) + "B" : "—"} · ` +
          `years ${snapshot.revenue.length}/${YEARS} · ` +
          `netDebt ${snapshot.netDebt == null ? "—" : (snapshot.netDebt / 1e9).toFixed(1) + "B"} · ` +
          `${snapshot.industry ?? "—"}`,
      );
    } catch (error) {
      console.error(`${ticker}: ${error.message}`);
      failures += 1;
    }
    // SEC asks for no more than 10 requests a second; stay well under.
    await new Promise((r) => setTimeout(r, 400));
  }

  if (failures > 0) process.exitCode = 1;
}

main();
