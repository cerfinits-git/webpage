// 6-month daily price history for the /research detail chart.
// Same Yahoo source as lib/quotes.ts; resilient (null on any failure → the
// page simply hides the chart). Cached an hour — history moves slowly.
export type PriceHistory = {
  closes: number[];
  startMs: number;
  endMs: number;
};

export async function getPriceHistory(symbol: string): Promise<PriceHistory | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=6mo`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (cerfinits-plan)" },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    const closes = result?.indicators?.quote?.[0]?.close;
    const ts = result?.timestamp;
    if (!Array.isArray(closes) || !Array.isArray(ts)) return null;

    const clean: { t: number; c: number }[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (typeof closes[i] === "number" && typeof ts[i] === "number") {
        clean.push({ t: ts[i], c: Math.round(closes[i] * 100) / 100 });
      }
    }
    if (clean.length < 2) return null;

    return {
      closes: clean.map((p) => p.c),
      startMs: clean[0].t * 1000,
      endMs: clean[clean.length - 1].t * 1000,
    };
  } catch {
    return null;
  }
}
