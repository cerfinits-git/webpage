import type { JournalTrade } from "./types";
import { calculateJournalMetrics } from "./metrics.ts";
import { dailyResults, dayKeyInTimeZone, monthKey, monthSummary } from "./daily.ts";

export type RCardVerdict = "positive" | "negative" | "flat" | "empty";

export interface RCardData {
  monthKey: string;
  periodLabel: string;
  netR: number;
  expectancy: number | null;
  winRatePct: number | null;
  profitFactor: number | null;
  tradeCount: number;
  validR: number;
  netPnl: number;
  currency: string;
  greenDays: number;
  redDays: number;
  tradingDays: number;
  verdict: RCardVerdict;
}

/** Trades whose close time falls in the given month (reporting timezone). */
export function tradesInMonth(trades: JournalTrade[], year: number, month: number, timeZone: string): JournalTrade[] {
  const prefix = `${monthKey(year, month)}-`;
  return trades.filter((trade) => {
    const key = dayKeyInTimeZone(trade.closedAt, timeZone);
    return key != null && key.startsWith(prefix);
  });
}

/**
 * Build the shareable monthly summary. R-first and honest: R metrics only
 * count trades with valid initial risk (same rule as the rest of the journal),
 * currency P&L is secondary, and losing months read as losing — no inflation.
 */
export function buildMonthlyRCard(
  trades: JournalTrade[],
  year: number,
  month: number,
  timeZone: string,
  currency: string,
): RCardData {
  const monthTrades = tradesInMonth(trades, year, month, timeZone);
  const metrics = calculateJournalMetrics(monthTrades);
  const days = dailyResults(monthTrades, timeZone);
  const summary = monthSummary(days, year, month);

  let greenDays = 0;
  let redDays = 0;
  for (const day of days.values()) {
    if (day.trades === 0) continue;
    if (day.netPnl > 0) greenDays += 1;
    else if (day.netPnl < 0) redDays += 1;
  }

  const periodLabel = new Intl.DateTimeFormat("th-TH-u-ca-gregory", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));

  const verdict: RCardVerdict =
    monthTrades.length === 0
      ? "empty"
      : metrics.sampleSize > 0 && metrics.netR > 0
        ? "positive"
        : metrics.sampleSize > 0 && metrics.netR < 0
          ? "negative"
          : "flat";

  return {
    monthKey: monthKey(year, month),
    periodLabel,
    netR: metrics.netR,
    expectancy: metrics.sampleSize > 0 ? metrics.expectancy : null,
    winRatePct: monthTrades.length > 0 ? metrics.winRate * 100 : null,
    profitFactor: metrics.profitFactor,
    tradeCount: monthTrades.length,
    validR: metrics.sampleSize,
    netPnl: summary.netPnl,
    currency,
    greenDays,
    redDays,
    tradingDays: greenDays + redDays,
    verdict,
  };
}

/** Latest month (reporting timezone) that has at least one trade, else current month. */
export function latestTradeMonth(trades: JournalTrade[], timeZone: string): { year: number; month: number } {
  let latest: string | null = null;
  for (const trade of trades) {
    const key = dayKeyInTimeZone(trade.closedAt, timeZone);
    if (key && (!latest || key > latest)) latest = key;
  }
  const source = latest ?? dayKeyInTimeZone(new Date(), timeZone) ?? new Date().toISOString();
  return { year: Number(source.slice(0, 4)), month: Number(source.slice(5, 7)) };
}
