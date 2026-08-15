// AAPL DEEP+O v4.2 — sum-of-the-parts valuation.
//
// The single-stream perpetuity DCF (scripts/aapl-dcf.mjs) values Apple's whole
// cash flow at one discount rate and one terminal growth, which cannot reflect
// that the company is really two businesses: a cyclical hardware franchise and
// a recurring, 75%-gross-margin services annuity. This splits them.
//
// Discount rates are relevered from Damodaran sector betas (Jan 2026), not
// chosen to hit a target:
//   Products → Computers/Peripherals unlevered 1.32, relevered to Apple's
//              2% D/E → 1.342 → CoE 10.60% ≈ WACC 10.49%
//   Services → Computer Services unlevered 0.92 → CoE 8.74%, reflecting the
//              lower risk of a recurring annuity with high switching costs.
//
// Current FCF is split by gross-profit share (services 42.2%). Services almost
// certainly converts to FCF at a higher rate than that — less capex, less
// working capital — so this allocation is conservative for services and biases
// the estimate DOWN, away from the price.
import { readFileSync } from "node:fs";

const f = JSON.parse(readFileSync("content/research/aapl.json", "utf8"));

const PRICE = 320.83;
const SHARES = f.sharesOutstanding;
const NET_DEBT = f.netDebt;
const FCF0 = f.freeCashFlow.at(-1).value; // $98.8B
const YEARS = 5;

const RF = 0.0467;
const ERP = 0.0442; // Damodaran implied US ERP, 2026-07-01

const SERVICES_FCF_SHARE = 0.422; // services gross profit / total gross profit
const KE_PRODUCTS = RF + 1.342 * ERP; // 10.60%
const KE_SERVICES = RF + 0.92 * ERP; // 8.74%

function streamValue({ fcf0, growth, discount, terminalGrowth }) {
  let fcf = fcf0;
  let pv = 0;
  for (let t = 1; t <= YEARS; t += 1) {
    fcf *= 1 + growth;
    pv += fcf / (1 + discount) ** t;
  }
  const terminal = (fcf * (1 + terminalGrowth)) / (discount - terminalGrowth);
  pv += terminal / (1 + discount) ** YEARS;
  return pv;
}

// Assumptions fixed BEFORE running, each defensible on its own:
// products barely grow (replacement cycle); services decelerate from the
// recent 14% and keep a structural terminal above GDP.
const scenarios = [
  {
    name: "Bear",
    p: 0.25,
    services: { growth: 0.07, terminalGrowth: 0.03, discount: KE_SERVICES + 0.01 },
    products: { growth: -0.01, terminalGrowth: 0.01, discount: KE_PRODUCTS },
  },
  {
    name: "Base",
    p: 0.5,
    services: { growth: 0.1, terminalGrowth: 0.04, discount: KE_SERVICES },
    products: { growth: 0.01, terminalGrowth: 0.015, discount: KE_PRODUCTS },
  },
  {
    name: "Bull",
    p: 0.25,
    services: { growth: 0.13, terminalGrowth: 0.05, discount: KE_SERVICES - 0.005 },
    products: { growth: 0.02, terminalGrowth: 0.02, discount: KE_PRODUCTS },
  },
];

const servicesFcf0 = FCF0 * SERVICES_FCF_SHARE;
const productsFcf0 = FCF0 * (1 - SERVICES_FCF_SHARE);

function perShare(sc) {
  const sv = streamValue({ fcf0: servicesFcf0, ...sc.services });
  const pv = streamValue({ fcf0: productsFcf0, ...sc.products });
  return { sv, pv, value: (sv + pv - NET_DEBT) / SHARES };
}

const out = (l, v) => console.log(l.padEnd(38), v);

console.log("=== AAPL sum-of-the-parts ===\n");
out("services FCF (42.2% of $98.8B)", `$${(servicesFcf0 / 1e9).toFixed(1)}B`);
out("products FCF (57.8%)", `$${(productsFcf0 / 1e9).toFixed(1)}B`);
out("services discount (Computer Svcs β0.92)", `${(KE_SERVICES * 100).toFixed(2)}%`);
out("products discount (Computers β1.34)", `${(KE_PRODUCTS * 100).toFixed(2)}%`);
console.log();

const results = scenarios.map((sc) => ({ ...sc, ...perShare(sc) }));
for (const r of results) {
  const svMult = r.sv / servicesFcf0;
  const pvMult = r.pv / productsFcf0;
  out(
    `${r.name}  p=${(r.p * 100).toFixed(0)}%`,
    `services $${(r.sv / 1e9).toFixed(0)}B (${svMult.toFixed(0)}x) + ` +
      `products $${(r.pv / 1e9).toFixed(0)}B (${pvMult.toFixed(0)}x) -> $${r.value.toFixed(2)}`,
  );
}

const ev = results.reduce((a, r) => a + r.p * r.value, 0);
console.log();
out("E[V] probability-weighted", `$${ev.toFixed(2)}`);
out("E[V] / Price", (ev / PRICE).toFixed(3));
out("gap vs $" + PRICE, `${(((ev / PRICE) - 1) * 100).toFixed(1)}%`);
out("trigger (E[V]/P = 1.25)", `$${(ev / 1.25).toFixed(2)}`);
console.log();

// What the market implies for services if products is taken at the Base 11x.
const productsBase = perShare(results[1]).pv;
const impliedServicesEquity = SHARES * PRICE + NET_DEBT - productsBase;
out("market cap + net debt", `$${((SHARES * PRICE + NET_DEBT) / 1e9).toFixed(0)}B`);
out("less products @ Base multiple", `$${(productsBase / 1e9).toFixed(0)}B`);
out("=> implied services value", `$${(impliedServicesEquity / 1e9).toFixed(0)}B`);
out("=> implied services multiple", `${(impliedServicesEquity / servicesFcf0).toFixed(0)}x FCF`);
