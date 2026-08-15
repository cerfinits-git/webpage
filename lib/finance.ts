import type { Holding, PortfolioSummary, Quote, Transaction } from "./types";

export function futureValue(
  present: number,
  monthly: number,
  annualReturn: number,
  months: number,
): number {
  const r = annualReturn / 12;
  if (r === 0) return present + monthly * months;
  const g = Math.pow(1 + r, months);
  return present * g + monthly * ((g - 1) / r);
}

export function requiredMonthly(
  target: number,
  present: number,
  annualReturn: number,
  months: number,
): number {
  if (months <= 0) return Infinity;
  const r = annualReturn / 12;
  if (r === 0) return Math.max((target - present) / months, 0);
  const g = Math.pow(1 + r, months);
  return Math.max((target - present * g) / ((g - 1) / r), 0);
}

export function monthsToTarget(
  present: number,
  monthly: number,
  annualReturn: number,
  target: number,
  maxMonths = 1200,
): number | null {
  let value = present;
  const r = annualReturn / 12;
  for (let m = 1; m <= maxMonths; m++) {
    value = value * (1 + r) + monthly;
    if (value >= target) return m;
  }
  return null;
}

export function computeHoldings(
  transactions: Transaction[],
  quotes: Quote[],
  usdThb: number,
): Holding[] {
  const quoteMap = new Map(quotes.map((q) => [q.symbol, q]));
  const groups = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const list = groups.get(tx.symbol) ?? [];
    list.push(tx);
    groups.set(tx.symbol, list);
  }

  const holdings: Holding[] = [];
  for (const [symbol, txs] of groups) {
    const sorted = [...txs].sort((a, b) => a.tradedAt.localeCompare(b.tradedAt));
    let qty = 0;
    let totalCost = 0;
    for (const tx of sorted) {
      if (tx.side === "buy") {
        totalCost += tx.quantity * tx.price + tx.fee;
        qty += tx.quantity;
      } else {
        // average-cost method: a sell removes cost at the current average, so avg cost is unchanged
        const avg = qty > 0 ? totalCost / qty : 0;
        totalCost -= tx.quantity * avg;
        qty -= tx.quantity;
      }
    }
    if (qty <= 0) continue;

    const quote = quoteMap.get(symbol);
    if (!quote) continue;
    const fx = quote.currency === "USD" ? usdThb : 1;
    const avgCost = totalCost / qty;
    holdings.push({
      symbol,
      name: sorted[0].name,
      assetType: sorted[0].assetType,
      quantity: qty,
      avgCost,
      currency: quote.currency,
      price: quote.price,
      valueThb: qty * quote.price * fx,
      // cost is converted at the current FX rate, not the rate on the trade date
      costThb: totalCost * fx,
      plPct: avgCost > 0 ? (quote.price - avgCost) / avgCost : 0,
      dayChangeThb: qty * (quote.price - quote.prevClose) * fx,
      unitLabel: sorted[0].unitLabel,
    });
  }
  return holdings;
}

export function summarize(holdings: Holding[]): PortfolioSummary {
  const totalValueThb = holdings.reduce((s, h) => s + h.valueThb, 0);
  const totalCostThb = holdings.reduce((s, h) => s + h.costThb, 0);
  const dayChangeThb = holdings.reduce((s, h) => s + h.dayChangeThb, 0);
  const plThb = totalValueThb - totalCostThb;
  return {
    totalValueThb,
    totalCostThb,
    plThb,
    plPct: totalCostThb > 0 ? plThb / totalCostThb : 0,
    dayChangeThb,
    dayChangePct:
      totalValueThb - dayChangeThb > 0 ? dayChangeThb / (totalValueThb - dayChangeThb) : 0,
  };
}
