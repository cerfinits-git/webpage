// Live quotes for the public /research page — a lean, dependency-free wrapper
// around Yahoo's chart endpoint (same source lib/market.ts uses for the app).
//
// Deliberately resilient: one bad/blocked symbol never breaks the page. On any
// failure the symbol is simply absent from the map and the UI falls back to the
// report's reference price with an "as of report" note.

export type LiveQuote = {
  symbol: string;
  price: number;
  prevClose: number;
  changePct: number; // day change, signed fraction (0.012 = +1.2%)
  currency: string;
};

const REVALIDATE_SECONDS = 300; // 5-min server cache — public page, cheap + polite to Yahoo

async function fetchOne(symbol: string): Promise<LiveQuote | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (cerfinits-plan)" },
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    const price = meta?.regularMarketPrice;
    if (typeof price !== "number") return null;
    const prevClose =
      typeof meta.chartPreviousClose === "number" ? meta.chartPreviousClose : price;
    return {
      symbol,
      price,
      prevClose,
      changePct: prevClose ? price / prevClose - 1 : 0,
      currency: typeof meta.currency === "string" ? meta.currency : "USD",
    };
  } catch {
    return null;
  }
}

// Fetch many symbols in parallel; returns a map keyed by uppercase symbol.
// Missing keys = provider failed for that symbol (caller falls back gracefully).
export async function getStockQuotes(
  symbols: string[],
): Promise<Record<string, LiveQuote>> {
  const unique = Array.from(new Set(symbols.map((s) => s.toUpperCase())));
  const results = await Promise.all(unique.map((s) => fetchOne(s)));
  const map: Record<string, LiveQuote> = {};
  results.forEach((q, i) => {
    if (q) map[unique[i]] = q;
  });
  return map;
}
