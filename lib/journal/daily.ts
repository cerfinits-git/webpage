import type { JournalTrade } from "./types";

export interface DailyResult {
  netPnl: number;
  rTotal: number;
  validR: number;
  trades: number;
}

const dayKeyFormatters = new Map<string, Intl.DateTimeFormat>();

function dayKeyFormatter(timeZone: string) {
  let formatter = dayKeyFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    dayKeyFormatters.set(timeZone, formatter);
  }
  return formatter;
}

/** Calendar day ("YYYY-MM-DD") of an instant in the account reporting timezone. */
export function dayKeyInTimeZone(value: string | Date, timeZone: string): string | null {
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;
  return dayKeyFormatter(timeZone).format(new Date(timestamp));
}

/**
 * Net result per calendar day, keyed by close date in the reporting timezone.
 * netPnl sums every closed trade; rTotal/validR only cover trades with valid
 * initial risk — same eligibility rule as calculateJournalMetrics.
 */
export function dailyResults(trades: JournalTrade[], timeZone: string): Map<string, DailyResult> {
  const days = new Map<string, DailyResult>();
  for (const trade of trades) {
    const key = dayKeyInTimeZone(trade.closedAt, timeZone);
    if (!key) continue;
    const current = days.get(key) ?? { netPnl: 0, rTotal: 0, validR: 0, trades: 0 };
    current.netPnl += trade.netPnl;
    current.trades += 1;
    if (
      trade.initialRiskAmount != null &&
      trade.initialRiskAmount > 0 &&
      trade.rMultiple != null &&
      Number.isFinite(trade.rMultiple)
    ) {
      current.rTotal += trade.rMultiple;
      current.validR += 1;
    }
    days.set(key, current);
  }
  return days;
}

/**
 * Sunday-first month grid. Each week has 7 slots; slots outside the month are
 * null, slots inside carry the day of month. Pure calendar arithmetic — the
 * timezone only matters when mapping instants to days (dayKeyInTimeZone).
 */
export function monthGrid(year: number, month: number): (number | null)[][] {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = new Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

/** Trades whose close time falls on the given day in the reporting timezone, oldest first. */
export function tradesOnDay(trades: JournalTrade[], dayKey: string, timeZone: string): JournalTrade[] {
  return trades
    .filter((trade) => dayKeyInTimeZone(trade.closedAt, timeZone) === dayKey)
    .sort((a, b) => a.closedAt.localeCompare(b.closedAt));
}

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

/** Aggregate of all days that fall inside the given month. */
export function monthSummary(days: Map<string, DailyResult>, year: number, month: number): DailyResult {
  const prefix = `${monthKey(year, month)}-`;
  const total: DailyResult = { netPnl: 0, rTotal: 0, validR: 0, trades: 0 };
  for (const [key, day] of days) {
    if (!key.startsWith(prefix)) continue;
    total.netPnl += day.netPnl;
    total.rTotal += day.rTotal;
    total.validR += day.validR;
    total.trades += day.trades;
  }
  return total;
}
