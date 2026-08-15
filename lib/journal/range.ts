import type { JournalTrade } from "./types";

export type JournalRange = "7d" | "30d" | "all";

export const JOURNAL_RANGE_PREFERENCE_KEY = "cerfinits-journal-range-v1";
export const DEFAULT_JOURNAL_RANGE: JournalRange = "30d";

/**
 * These windows are measured back from the most recent trade, not from today
 * (see filterTradesByRange), so a journal left alone for months still shows
 * something instead of an empty page. "Last 30 days" would therefore misread:
 * adding one trade today makes every older trade drop out of view, which looks
 * like data loss. The labels state what the filter actually does.
 */
export const JOURNAL_RANGE_OPTIONS: ReadonlyArray<{ value: JournalRange; label: string; labelEn: string }> = [
  { value: "7d", label: "7 วันนับจากไม้ล่าสุด", labelEn: "7 days from last trade" },
  { value: "30d", label: "30 วันนับจากไม้ล่าสุด", labelEn: "30 days from last trade" },
  { value: "all", label: "ทั้งหมด", labelEn: "All time" },
];

const DAY_MS = 24 * 60 * 60 * 1000;

export function parseJournalRange(value: unknown): JournalRange | null {
  return value === "7d" || value === "30d" || value === "all" ? value : null;
}

export function resolveJournalRange(
  urlValue: unknown,
  persistedValue: unknown,
): JournalRange {
  return parseJournalRange(urlValue)
    ?? parseJournalRange(persistedValue)
    ?? DEFAULT_JOURNAL_RANGE;
}

export function parseJournalQuality(value: unknown): "all" | "missing" {
  return value === "missing" ? "missing" : "all";
}

export function buildJournalHref(
  path: string,
  range: JournalRange,
  params: Record<string, string | null | undefined> = {},
) {
  if (!path.startsWith("/journal") || path.startsWith("//")) {
    throw new Error("Journal href must stay inside /journal");
  }
  const query = new URLSearchParams({ range });
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== "") query.set(key, value);
  }
  return `${path}?${query.toString()}`;
}

export function replaceJournalUrlQuery(
  range: JournalRange,
  updates: Record<string, string | null | undefined> = {},
) {
  const url = new URL(window.location.href);
  url.searchParams.set("range", range);
  for (const [key, value] of Object.entries(updates)) {
    if (value == null || value === "") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}

export function filterTradesByRange(trades: JournalTrade[], range: JournalRange) {
  if (range === "all" || trades.length === 0) return trades;

  const latestClosedAt = trades.reduce((latest, trade) => {
    const timestamp = Date.parse(trade.closedAt);
    return Number.isFinite(timestamp) ? Math.max(latest, timestamp) : latest;
  }, Number.NEGATIVE_INFINITY);

  if (!Number.isFinite(latestClosedAt)) return [];
  const days = range === "7d" ? 7 : 30;
  const cutoff = latestClosedAt - days * DAY_MS;
  return trades.filter((trade) => Date.parse(trade.closedAt) >= cutoff);
}
