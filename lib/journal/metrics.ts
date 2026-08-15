import type { JournalMetrics, JournalTrade } from "./types";

const validR = (trade: JournalTrade): trade is JournalTrade & { rMultiple: number } =>
  trade.initialRiskAmount != null &&
  trade.initialRiskAmount > 0 &&
  trade.rMultiple != null &&
  Number.isFinite(trade.rMultiple);

export function cumulativeRSeries(trades: JournalTrade[]) {
  const ordered = [...trades]
    .filter(validR)
    .sort((a, b) => a.closedAt.localeCompare(b.closedAt));
  let cumulative = 0;
  return ordered.map((trade) => {
    cumulative += trade.rMultiple;
    return { id: trade.id, date: trade.closedAt, value: cumulative, result: trade.rMultiple };
  });
}

export function cumulativePnlSeries(trades: JournalTrade[]) {
  const ordered = [...trades]
    .sort((a, b) => a.closedAt.localeCompare(b.closedAt));
  let cumulative = 0;
  return ordered.map((trade) => {
    cumulative += trade.netPnl;
    return { id: trade.id, date: trade.closedAt, value: cumulative, result: trade.netPnl };
  });
}

export function calculateJournalMetrics(trades: JournalTrade[]): JournalMetrics {
  const closed = trades.filter(validR);
  const sampleSize = closed.length;
  let netR = 0;
  let grossProfitR = 0;
  let grossLossR = 0;
  let peak = 0;
  let equity = 0;
  let maxDrawdownR = 0;

  for (const trade of [...closed].sort((a, b) => a.closedAt.localeCompare(b.closedAt))) {
    netR += trade.rMultiple;
    equity += trade.rMultiple;
    peak = Math.max(peak, equity);
    maxDrawdownR = Math.max(maxDrawdownR, peak - equity);
    if (trade.rMultiple > 0) {
      grossProfitR += trade.rMultiple;
    } else if (trade.rMultiple < 0) {
      grossLossR += Math.abs(trade.rMultiple);
    }
  }

  let allWins = 0;
  for (const trade of trades) {
    if (trade.netPnl > 0) allWins += 1;
  }

  const completeRisk = trades.filter((trade) => trade.initialRiskAmount != null && trade.initialRiskAmount > 0).length;

  return {
    sampleSize,
    netR,
    expectancy: sampleSize > 0 ? netR / sampleSize : 0,
    profitFactor: grossLossR > 0 ? grossProfitR / grossLossR : null,
    winRate: trades.length > 0 ? allWins / trades.length : 0,
    maxDrawdownR,
    dataCompleteness: trades.length > 0 ? completeRisk / trades.length : 0,
  };
}

export function groupExpectancy(trades: JournalTrade[], key: "setup" | "symbol" | "session") {
  const groups = new Map<string, { totalR: number; validCount: number; count: number; wins: number }>();
  for (const trade of trades) {
    const name = trade[key] || "ไม่ระบุ";
    const current = groups.get(name) ?? { totalR: 0, validCount: 0, count: 0, wins: 0 };
    
    current.count += 1;
    if (trade.netPnl > 0) current.wins += 1;
    
    if (validR(trade)) {
      current.totalR += trade.rMultiple;
      current.validCount += 1;
    }
    
    groups.set(name, current);
  }
  
  return [...groups.entries()]
    .map(([name, value]) => ({
      name,
      count: value.count,
      totalR: value.totalR,
      expectancy: value.validCount > 0 ? value.totalR / value.validCount : 0,
      winRate: value.count > 0 ? value.wins / value.count : 0,
    }))
    .sort((a, b) => b.expectancy - a.expectancy || b.count - a.count);
}

export interface HoldingTimeMetrics {
  avgWinMinutes: number;
  avgLossMinutes: number;
  avgAllMinutes: number;
  winCount: number;
  lossCount: number;
  ratio: number | null;
  formattedAvgWin: string;
  formattedAvgLoss: string;
  formattedAvgAll: string;
}

export function formatDurationMinutes(minutes: number, lang: "th" | "en" = "th"): string {
  const zero = lang === "en" ? "0 seconds" : "0 วินาที";
  if (isNaN(minutes) || minutes <= 0) return zero;
  const totalSeconds = minutes * 60;

  if (totalSeconds < 1) {
    const ms = Math.round(totalSeconds * 1000);
    if (ms <= 0) return zero;
    return lang === "en" ? `${totalSeconds.toFixed(2)} seconds` : `${totalSeconds.toFixed(2)} วินาที`;
  }

  if (totalSeconds < 60) {
    const sec = totalSeconds < 10 ? totalSeconds.toFixed(1) : Math.round(totalSeconds).toString();
    return lang === "en" ? `${sec} seconds` : `${sec} วินาที`;
  }

  if (minutes < 60) {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    if (lang === "en") return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    return secs > 0 ? `${mins} นาที ${secs} วิ` : `${mins} นาที`;
  }

  const hours = Math.floor(minutes / 60);
  const remMinutes = Math.round(minutes % 60);
  if (hours < 24) {
    if (lang === "en") return remMinutes > 0 ? `${hours}h ${remMinutes}m` : `${hours}h`;
    return remMinutes > 0 ? `${hours} ชม. ${remMinutes} นาที` : `${hours} ชม.`;
  }

  const days = Math.floor(hours / 24);
  const remHours = Math.round(hours % 24);
  if (lang === "en") return remHours > 0 ? `${days}d ${remHours}h` : `${days}d`;
  return remHours > 0 ? `${days} วัน ${remHours} ชม.` : `${days} วัน`;
}

export function calculateHoldingTimeMetrics(trades: JournalTrade[], lang: "th" | "en" = "th"): HoldingTimeMetrics {
  let winSum = 0;
  let winCount = 0;
  let lossSum = 0;
  let lossCount = 0;
  let totalSum = 0;
  let totalCount = 0;

  for (const trade of trades) {
    if (!trade.openedAt || !trade.closedAt) continue;
    const openTime = new Date(trade.openedAt).getTime();
    const closeTime = new Date(trade.closedAt).getTime();
    if (isNaN(openTime) || isNaN(closeTime) || closeTime < openTime) continue;

    const durationMinutes = (closeTime - openTime) / (1000 * 60);
    totalSum += durationMinutes;
    totalCount += 1;

    const isWin = trade.netPnl > 0 || (trade.rMultiple != null && trade.rMultiple > 0);
    const isLoss = trade.netPnl < 0 || (trade.rMultiple != null && trade.rMultiple < 0);

    if (isWin) {
      winSum += durationMinutes;
      winCount += 1;
    } else if (isLoss) {
      lossSum += durationMinutes;
      lossCount += 1;
    }
  }

  const avgWinMinutes = winCount > 0 ? winSum / winCount : 0;
  const avgLossMinutes = lossCount > 0 ? lossSum / lossCount : 0;
  const avgAllMinutes = totalCount > 0 ? totalSum / totalCount : 0;
  const ratio = avgLossMinutes > 0 ? avgWinMinutes / avgLossMinutes : null;

  return {
    avgWinMinutes,
    avgLossMinutes,
    avgAllMinutes,
    winCount,
    lossCount,
    ratio,
    formattedAvgWin: formatDurationMinutes(avgWinMinutes, lang),
    formattedAvgLoss: formatDurationMinutes(avgLossMinutes, lang),
    formattedAvgAll: formatDurationMinutes(avgAllMinutes, lang),
  };
}

export interface UnderwaterPoint {
  id: string;
  date: string;
  drawdownR: number;
  peakR: number;
  cumulativeR: number;
}

export interface UnderwaterMetrics {
  series: UnderwaterPoint[];
  maxDrawdownR: number;
  longestDrawdownMs: number;
  formattedLongestDrawdown: string;
  currentDrawdownR: number;
  inDrawdownCount: number;
}

export function calculateUnderwaterSeries(trades: JournalTrade[], lang: "th" | "en" = "th"): UnderwaterMetrics {
  const ordered = [...trades]
    .filter(validR)
    .sort((a, b) => a.closedAt.localeCompare(b.closedAt));

  let cumulative = 0;
  let peak = 0;
  let maxDrawdownR = 0;

  let peakTime = ordered.length > 0 ? new Date(ordered[0].closedAt).getTime() : 0;
  let longestDrawdownMs = 0;

  const series: UnderwaterPoint[] = [];

  for (const trade of ordered) {
    cumulative += trade.rMultiple;
    const tradeTime = new Date(trade.closedAt).getTime();

    if (cumulative >= peak) {
      peak = cumulative;
      peakTime = tradeTime;
    } else {
      const ddDuration = tradeTime - peakTime;
      if (ddDuration > longestDrawdownMs) {
        longestDrawdownMs = ddDuration;
      }
    }

    const dd = cumulative - peak;
    if (Math.abs(dd) > maxDrawdownR) {
      maxDrawdownR = Math.abs(dd);
    }

    series.push({
      id: trade.id,
      date: trade.closedAt,
      drawdownR: dd,
      peakR: peak,
      cumulativeR: cumulative,
    });
  }

  const currentDrawdownR = series.length > 0 ? Math.min(0, series[series.length - 1].drawdownR) : 0;
  const inDrawdownCount = series.filter((p) => p.drawdownR < -0.001).length;
  const longestMinutes = longestDrawdownMs / (1000 * 60);

  return {
    series,
    maxDrawdownR,
    longestDrawdownMs,
    formattedLongestDrawdown: formatDurationMinutes(longestMinutes, lang),
    currentDrawdownR,
    inDrawdownCount,
  };
}

export interface DollarUnderwaterPoint {
  id: string;
  date: string;
  drawdownUsd: number; // <= 0, distance below the running peak
  peakUsd: number;
  cumulativeUsd: number;
}

export interface DollarUnderwaterMetrics {
  series: DollarUnderwaterPoint[];
  maxDrawdownUsd: number; // positive magnitude of the deepest drawdown
  maxDrawdownPct: number; // that drawdown as a fraction of the peak it fell from
  currentDrawdownUsd: number; // <= 0
  currentDrawdownPct: number;
  longestDrawdownMs: number;
  formattedLongestDrawdown: string;
}

/**
 * Equity-curve drawdown in account currency, from net P&L. Unlike the R-based
 * version it does not require an initial-risk figure, so it works with
 * cTrader-imported trades that carry no planned stop.
 */
export function calculateDollarUnderwaterSeries(
  trades: JournalTrade[],
  lang: "th" | "en" = "th",
): DollarUnderwaterMetrics {
  const ordered = [...trades].sort((a, b) => a.closedAt.localeCompare(b.closedAt));

  let cumulative = 0;
  let peak = 0;
  let maxDrawdownUsd = 0;
  let maxDrawdownPct = 0;
  let peakTime = ordered.length > 0 ? new Date(ordered[0].closedAt).getTime() : 0;
  let longestDrawdownMs = 0;
  const series: DollarUnderwaterPoint[] = [];

  for (const trade of ordered) {
    cumulative += trade.netPnl;
    const tradeTime = new Date(trade.closedAt).getTime();

    if (cumulative >= peak) {
      peak = cumulative;
      peakTime = tradeTime;
    } else {
      const ddDuration = tradeTime - peakTime;
      if (ddDuration > longestDrawdownMs) longestDrawdownMs = ddDuration;
    }

    const dd = cumulative - peak; // <= 0
    if (Math.abs(dd) > maxDrawdownUsd) {
      maxDrawdownUsd = Math.abs(dd);
      maxDrawdownPct = peak > 0 ? Math.abs(dd) / peak : 0;
    }

    series.push({ id: trade.id, date: trade.closedAt, drawdownUsd: dd, peakUsd: peak, cumulativeUsd: cumulative });
  }

  const last = series[series.length - 1];
  const currentDrawdownUsd = last ? Math.min(0, last.drawdownUsd) : 0;
  const currentDrawdownPct = last && last.peakUsd > 0 ? Math.abs(currentDrawdownUsd) / last.peakUsd : 0;

  return {
    series,
    maxDrawdownUsd,
    maxDrawdownPct,
    currentDrawdownUsd,
    currentDrawdownPct,
    longestDrawdownMs,
    formattedLongestDrawdown: formatDurationMinutes(longestDrawdownMs / (1000 * 60), lang),
  };
}

export interface HeatmapCell {
  dayIndex: number;
  dayLabel: string;
  dayLabelEn: string;
  blockIndex: number;
  blockLabel: string;
  count: number;
  totalR: number;
  totalPnl: number;
  validCount: number;
  expectancy: number;
  avgPnl: number;
  isLowSample: boolean;
}

export const HOUR_BLOCK_LABELS = ["00-03", "04-07", "08-11", "12-15", "16-19", "20-23"];
export const DAY_LABELS = [
  { index: 1, label: "จันทร์", labelEn: "Mon" },
  { index: 2, label: "อังคาร", labelEn: "Tue" },
  { index: 3, label: "พุธ", labelEn: "Wed" },
  { index: 4, label: "พฤหัส", labelEn: "Thu" },
  { index: 5, label: "ศุกร์", labelEn: "Fri" },
];

export function getLocalDayAndHour(isoString: string, timeZone: string): { dayIndex: number; hour: number } | null {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return null;

  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      hour: "numeric",
      hourCycle: "h23",
    });
    const parts = formatter.formatToParts(date);
    let weekdayStr = "";
    let hour = 0;
    for (const part of parts) {
      if (part.type === "weekday") weekdayStr = part.value;
      if (part.type === "hour") hour = parseInt(part.value, 10);
    }
    const daysMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const dayIndex = daysMap[weekdayStr] ?? 0;
    return { dayIndex, hour };
  } catch {
    return null;
  }
}

export function calculateTimeHeatmap(trades: JournalTrade[], timeZone: string = "Asia/Bangkok") {
  const grid: HeatmapCell[][] = DAY_LABELS.map((day) =>
    HOUR_BLOCK_LABELS.map((blockLabel, blockIndex) => ({
      dayIndex: day.index,
      dayLabel: day.label,
      dayLabelEn: day.labelEn,
      blockIndex,
      blockLabel,
      count: 0,
      totalR: 0,
      totalPnl: 0,
      validCount: 0,
      expectancy: 0,
      avgPnl: 0,
      isLowSample: true,
    }))
  );

  for (const trade of trades) {
    if (!trade.openedAt) continue;
    const info = getLocalDayAndHour(trade.openedAt, timeZone);
    if (!info) continue;

    const { dayIndex, hour } = info;
    if (dayIndex < 1 || dayIndex > 5) continue;
    const rowIndex = dayIndex - 1;
    const blockIndex = Math.floor(hour / 4);
    if (blockIndex < 0 || blockIndex > 5) continue;

    const cell = grid[rowIndex][blockIndex];
    cell.count += 1;
    cell.totalPnl += trade.netPnl || 0;
    if (validR(trade)) {
      cell.totalR += trade.rMultiple;
      cell.validCount += 1;
    }
  }

  for (const row of grid) {
    for (const cell of row) {
      cell.expectancy = cell.validCount > 0 ? cell.totalR / cell.validCount : 0;
      cell.avgPnl = cell.count > 0 ? cell.totalPnl / cell.count : 0;
      cell.isLowSample = cell.count < 10;
    }
  }

  return grid;
}

export interface WinLossDollarMetrics {
  avgWinDollar: number;
  avgLossDollar: number;
  winCount: number;
  lossCount: number;
}

export function calculateWinLossDollarMetrics(trades: JournalTrade[]): WinLossDollarMetrics {
  let winSum = 0;
  let winCount = 0;
  let lossSum = 0;
  let lossCount = 0;

  for (const trade of trades) {
    const isWin = trade.netPnl > 0 || (trade.rMultiple != null && trade.rMultiple > 0);
    const isLoss = trade.netPnl < 0 || (trade.rMultiple != null && trade.rMultiple < 0);
    if (isWin) {
      winSum += trade.netPnl;
      winCount += 1;
    } else if (isLoss) {
      lossSum += trade.netPnl;
      lossCount += 1;
    }
  }

  return {
    avgWinDollar: winCount > 0 ? winSum / winCount : 0,
    avgLossDollar: lossCount > 0 ? Math.abs(lossSum / lossCount) : 0,
    winCount,
    lossCount,
  };
}

export const DURATION_BUCKETS = [
  { label: "0-5m", maxMinutes: 5 },
  { label: "5-10m", maxMinutes: 10 },
  { label: "10-20m", maxMinutes: 20 },
  { label: "20-30m", maxMinutes: 30 },
  { label: "30-45m", maxMinutes: 45 },
  { label: "45-60m", maxMinutes: 60 },
  { label: "60m+", maxMinutes: Infinity },
];

export interface DurationBucket {
  label: string;
  successCount: number;
  failCount: number;
}

export function calculateDurationBuckets(trades: JournalTrade[]): DurationBucket[] {
  const buckets: DurationBucket[] = DURATION_BUCKETS.map((b) => ({ label: b.label, successCount: 0, failCount: 0 }));

  for (const trade of trades) {
    if (!trade.openedAt || !trade.closedAt) continue;
    const openTime = new Date(trade.openedAt).getTime();
    const closeTime = new Date(trade.closedAt).getTime();
    if (isNaN(openTime) || isNaN(closeTime) || closeTime < openTime) continue;

    const durationMinutes = (closeTime - openTime) / (1000 * 60);
    const bucketIndex = DURATION_BUCKETS.findIndex((b) => durationMinutes <= b.maxMinutes);
    if (bucketIndex === -1) continue;

    const isWin = trade.netPnl > 0 || (trade.rMultiple != null && trade.rMultiple > 0);
    if (isWin) {
      buckets[bucketIndex].successCount += 1;
    } else {
      buckets[bucketIndex].failCount += 1;
    }
  }

  return buckets;
}

export interface CostMetrics {
  totalGross: number;         // sum of grossPnl
  totalCommission: number;    // sum of commissionPnl (<= 0)
  totalSwap: number;          // sum of swap (can be +/-)
  totalFees: number;          // sum of fees
  totalCost: number;          // commission + swap, signed (negative = drag)
  totalNet: number;           // sum of netPnl
  costPctOfGross: number;     // |totalCost| / |totalGross| * 100
  tradesWithCost: number;     // how many trades carry any non-zero cost
  avgCostPerTrade: number;    // totalCost / trade count
}

/**
 * Aggregate the cost drag across a set of trades. Commission and swap are
 * stored as signed values (drag is negative), so totalCost is what net paid
 * away from gross. costPctOfGross expresses that drag as a share of the gross
 * edge, which is the number that tells you how much of your raw profit the
 * broker takes.
 */
export function calculateCostMetrics(trades: JournalTrade[]): CostMetrics {
  let totalGross = 0;
  let totalCommission = 0;
  let totalSwap = 0;
  let totalFees = 0;
  let totalNet = 0;
  let tradesWithCost = 0;

  for (const trade of trades) {
    const commission = trade.commissionPnl ?? 0;
    const swap = trade.swap ?? 0;
    const fees = trade.fees ?? 0;
    const gross = trade.grossPnl ?? trade.netPnl - commission - swap - fees;

    totalGross += gross;
    totalCommission += commission;
    totalSwap += swap;
    totalFees += fees;
    totalNet += trade.netPnl;

    if (commission !== 0 || swap !== 0 || fees !== 0) tradesWithCost += 1;
  }

  // `fees` is the positive mirror of `commissionPnl` in this model
  // (validation normalises fees = max(0, -commissionPnl)), so it is the SAME
  // commission cost — adding it here would double-count and cancel. Total drag
  // is the signed commission plus swap.
  const totalCost = totalCommission + totalSwap;
  const count = trades.length;

  return {
    totalGross,
    totalCommission,
    totalSwap,
    totalFees,
    totalCost,
    totalNet,
    costPctOfGross: totalGross !== 0 ? (Math.abs(totalCost) / Math.abs(totalGross)) * 100 : 0,
    tradesWithCost,
    avgCostPerTrade: count > 0 ? totalCost / count : 0,
  };
}

