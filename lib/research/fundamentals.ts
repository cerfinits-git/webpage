import { readFile } from "node:fs/promises";
import path from "node:path";
import type { StockFundamentals, YearPoint } from "./dashboard";

/**
 * Reads a per-ticker fundamentals snapshot produced by the data pipeline
 * (build order #2): EDGAR companyfacts → computed series → committed JSON.
 *
 * Snapshots live in `content/research/` rather than `data/` because they are
 * reviewed, committed content that must ship with the deploy — `data/` is
 * gitignored runtime state.
 *
 * Returns null when a ticker has no snapshot yet, which the dashboard renders
 * as an explicit pending state. It never fabricates figures (R7).
 */

const DIR = path.join(process.cwd(), "content", "research");

function isYearSeries(value: unknown): value is YearPoint[] {
  return (
    Array.isArray(value) &&
    value.every(
      (p) =>
        typeof p === "object" &&
        p !== null &&
        Number.isFinite((p as YearPoint).fiscalYear) &&
        Number.isFinite((p as YearPoint).value),
    )
  );
}

function parse(raw: string, ticker: string): StockFundamentals | null {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null) return null;

  const f = value as Partial<StockFundamentals>;
  const required: (keyof StockFundamentals)[] = [
    "revenue",
    "netProfit",
    "freeCashFlow",
    "eps",
    "dividendPerShare",
  ];
  // A malformed snapshot is treated as absent: a pending state is honest,
  // half-parsed financials are not.
  if (!required.every((key) => isYearSeries(f[key]))) return null;
  if (typeof f.period !== "string" || typeof f.updatedAt !== "string") return null;

  return { ...(f as StockFundamentals), ticker: ticker.toUpperCase() };
}

export async function getFundamentals(ticker: string): Promise<StockFundamentals | null> {
  const file = path.join(DIR, `${ticker.toLowerCase()}.json`);
  try {
    return parse(await readFile(file, "utf8"), ticker);
  } catch {
    return null;
  }
}
