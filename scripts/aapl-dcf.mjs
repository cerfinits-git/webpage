// AAPL DEEP+O v4.2 — valuation engine. Every figure printed here is computed,
// never carried in prose (iron rule 4).
import { readFileSync } from "node:fs";

const f = JSON.parse(readFileSync("content/research/aapl.json", "utf8"));

// ---- Inputs, all stated ------------------------------------------------
const PRICE = 320.61;              // Yahoo, 2026-07-23
const SHARES = f.sharesOutstanding; // weighted-average basic, FY2025 10-K
const RF = 0.0467;                 // US 10Y, Treasury.gov 2026-07-22
const ERP = 0.045;                 // assumption: mature-market equity risk premium
const BETA = 1.10;                 // assumption: levered beta for the hardware/services mix
const PRETAX_KD = 0.052;           // assumption: AA+ issuer, 10Y + ~50bp
const TAX = 0.16;                  // effective rate, computed below and overridden
const TERMINAL_G = 0.025;          // below long-run nominal GDP
const YEARS = 5;

const revenue0 = f.revenue.at(-1).value;
const fcf0 = f.freeCashFlow.at(-1).value;
const netDebt = f.netDebt;
const fcfMargin0 = fcf0 / revenue0;

// Debt weight is small enough that WACC sits a few basis points under CoE, but
// compute it rather than assert it.
const marketCap = SHARES * PRICE;
const grossDebt = netDebt + 30e9; // cash net of debt is known; gross debt approximated
const wd = grossDebt / (grossDebt + marketCap);
const we = 1 - wd;
const coe = RF + BETA * ERP;
const wacc = we * coe + wd * PRETAX_KD * (1 - TAX);

const scenarios = [
  { name: "Bear", p: 0.25, growth: 0.02, margin: 0.215 },
  { name: "Base", p: 0.50, growth: 0.055, margin: 0.25 },
  { name: "Bull", p: 0.25, growth: 0.08, margin: 0.27 },
];

function valuePerShare({ growth, margin }) {
  let rev = revenue0;
  let pv = 0;
  for (let t = 1; t <= YEARS; t += 1) {
    rev *= 1 + growth;
    // Margin glides from today's level to the scenario's stable level.
    const m = fcfMargin0 + ((margin - fcfMargin0) * t) / YEARS;
    pv += (rev * m) / (1 + wacc) ** t;
  }
  const terminalFcf = rev * margin * (1 + TERMINAL_G);
  const terminal = terminalFcf / (wacc - TERMINAL_G);
  pv += terminal / (1 + wacc) ** YEARS;
  return (pv - netDebt) / SHARES;
}

const results = scenarios.map((s) => ({ ...s, value: valuePerShare(s) }));
const ev = results.reduce((a, s) => a + s.p * s.value, 0);

// Reverse DCF: the growth the current price implies at the Base margin.
function impliedGrowth() {
  let lo = -0.05;
  let hi = 0.25;
  for (let i = 0; i < 80; i += 1) {
    const mid = (lo + hi) / 2;
    if (valuePerShare({ growth: mid, margin: 0.25 }) < PRICE) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const out = (label, v) => console.log(label.padEnd(34), v);

console.log("=== AAPL DEEP+O v4.2 — valuation ===\n");
out("FY2025 revenue", `$${(revenue0 / 1e9).toFixed(1)}B`);
out("FY2025 free cash flow", `$${(fcf0 / 1e9).toFixed(1)}B  (margin ${(fcfMargin0 * 100).toFixed(1)}%)`);
out("shares (wtd avg basic)", `${(SHARES / 1e9).toFixed(2)}B`);
out("price / market cap", `$${PRICE}  /  $${(marketCap / 1e12).toFixed(2)}T`);
out("net debt", `$${(netDebt / 1e9).toFixed(1)}B`);
console.log();
out("risk-free (US 10Y)", `${(RF * 100).toFixed(2)}%`);
out("cost of equity", `${(coe * 100).toFixed(2)}%   = ${(RF * 100).toFixed(2)} + ${BETA} x ${(ERP * 100).toFixed(1)}`);
out("WACC", `${(wacc * 100).toFixed(2)}%   (debt weight ${(wd * 100).toFixed(1)}%)`);
out("terminal growth", `${(TERMINAL_G * 100).toFixed(1)}%`);
console.log();
for (const r of results) {
  out(
    `${r.name}  p=${(r.p * 100).toFixed(0)}%`,
    `growth ${(r.growth * 100).toFixed(1)}%/yr, FCF margin ${(r.margin * 100).toFixed(1)}% -> $${r.value.toFixed(2)}`,
  );
}
console.log();
out("E[V] probability-weighted", `$${ev.toFixed(2)}`);
out("E[V] / Price", (ev / PRICE).toFixed(3));
out("upside", `${(((ev / PRICE) - 1) * 100).toFixed(1)}%`);
out("trigger (E[V]/P = 1.25)", `$${(ev / 1.25).toFixed(2)}`);
console.log();
out("market-implied growth @25% margin", `${(impliedGrowth() * 100).toFixed(2)}%/yr`);

// Sensitivity: the two axes of the One Question.
console.log("\n=== sensitivity: revenue CAGR x stable FCF margin ===");
const margins = [0.29, 0.27, 0.25, 0.23, 0.21];
const growths = [0.02, 0.04, 0.055, 0.07, 0.09];
console.log("margin\\growth".padEnd(14) + growths.map((g) => `${(g * 100).toFixed(1)}%`.padStart(9)).join(""));
const grid = [];
for (const m of margins) {
  const row = growths.map((g) => Math.round(valuePerShare({ growth: g, margin: m })));
  grid.push(row);
  console.log(`${(m * 100).toFixed(0)}%`.padEnd(14) + row.map((v) => `$${v}`.padStart(9)).join(""));
}
console.log("\ngrid JSON:", JSON.stringify(grid));
