import { MOCK_QUOTES, USD_THB as MOCK_USD_THB } from "./mock-data";
import { readManualPrices } from "./store";
import type { Currency, Quote, Transaction } from "./types";

// Live prices with per-symbol fallback: SEC (funds, when key set) → Yahoo → manual entry → mock,
// so the app keeps working offline or when a provider is down/rate-limited.

const REVALIDATE_SECONDS = 300;

const CRYPTO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
};

// ทองคำแท่งไทย: 1 บาททอง = 15.244 กรัม ที่ความบริสุทธิ์ 96.5%
// ราคาโดยประมาณจาก GC=F (COMEX futures ใกล้ spot) — ไม่รวมพรีเมียม/สเปรดของสมาคมค้าทองคำ
const BAHT_WEIGHT_GRAMS = 15.244;
const TROY_OZ_GRAMS = 31.1035;
const GOLD_PURITY = 0.965;

interface ChartQuote {
  price: number;
  prevClose: number;
  currency: Currency;
}

export interface MarketData {
  quotes: Quote[];
  usdThb: number;
  fxLive: boolean;
  liveCount: number;
  totalCount: number;
}

const MOCK_MAP = new Map(MOCK_QUOTES.map((q) => [q.symbol, q]));

async function fetchJson(url: string, headers: Record<string, string> = {}): Promise<any> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (cerfinits-plan)", ...headers },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function yahooChart(symbol: string): Promise<ChartQuote> {
  const json = await fetchJson(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`,
  );
  const meta = json?.chart?.result?.[0]?.meta;
  const price = meta?.regularMarketPrice;
  if (typeof price !== "number") throw new Error(`no price for ${symbol}`);
  const prevClose = typeof meta.chartPreviousClose === "number" ? meta.chartPreviousClose : price;
  const currency: Currency = meta.currency === "THB" ? "THB" : "USD";
  return { price, prevClose, currency };
}

// NAV กองทุนไทยจาก API ก.ล.ต. — สมัคร key ฟรีที่ api-portal.sec.or.th แล้วใส่ SEC_API_KEY ใน .env.local
// API จริงอ้างอิงกองทุนด้วย proj_id ไม่ใช่ชื่อย่อ — ถ้า endpoint นี้หากองทุนไม่เจอ ต้องเพิ่มขั้นค้นหา proj_id ก่อน
async function fetchSecNav(symbol: string): Promise<number | null> {
  const key = process.env.SEC_API_KEY;
  if (!key) return null;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const json = await fetchJson(
      `https://api.sec.or.th/FundDailyInfo/${encodeURIComponent(symbol)}/dailynav/${today}`,
      { "Ocp-Apim-Subscription-Key": key },
    );
    const nav = Number(json?.last_val ?? json?.nav);
    return Number.isFinite(nav) && nav > 0 ? nav : null;
  } catch {
    return null;
  }
}

async function fetchUsdThb(): Promise<number> {
  try {
    const json = await fetchJson("https://api.frankfurter.app/latest?from=USD&to=THB");
    const rate = json?.rates?.THB;
    if (typeof rate === "number") return rate;
    throw new Error("no THB rate");
  } catch {
    return (await yahooChart("THB=X")).price;
  }
}

export async function getMarketData(transactions: Transaction[]): Promise<MarketData> {
  const bySymbol = new Map<string, Transaction>();
  for (const tx of transactions) {
    if (!bySymbol.has(tx.symbol)) bySymbol.set(tx.symbol, tx);
  }
  const symbols = [...bySymbol.values()];
  const manualMap = new Map((await readManualPrices()).map((p) => [p.symbol, p]));

  let usdThb = MOCK_USD_THB;
  let fxLive = false;
  try {
    usdThb = await fetchUsdThb();
    fxLive = true;
  } catch {}

  const chartResults = new Map<string, ChartQuote>();
  await Promise.all(
    symbols
      .filter((t) => t.assetType === "stock" || t.assetType === "etf" || t.assetType === "fund")
      .map(async (t) => {
        if (t.assetType === "fund") {
          const nav = await fetchSecNav(t.symbol);
          if (nav != null) {
            chartResults.set(t.symbol, { price: nav, prevClose: nav, currency: "THB" });
            return;
          }
        }
        try {
          chartResults.set(t.symbol, await yahooChart(t.symbol));
        } catch {}
      }),
  );

  let cryptoPrices: Record<string, { usd?: number; usd_24h_change?: number }> = {};
  const cryptoIds = symbols
    .filter((t) => t.assetType === "crypto" && CRYPTO_IDS[t.symbol])
    .map((t) => CRYPTO_IDS[t.symbol]);
  if (cryptoIds.length > 0) {
    try {
      cryptoPrices = await fetchJson(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(",")}&vs_currencies=usd&include_24hr_change=true`,
      );
    } catch {}
  }

  let xau: ChartQuote | null = null;
  if (symbols.some((t) => t.assetType === "gold")) {
    try {
      xau = await yahooChart("GC=F");
    } catch {}
  }

  let liveCount = 0;
  const quotes: Quote[] = [];
  for (const t of symbols) {
    let quote: Quote | null = null;

    if (t.assetType === "stock" || t.assetType === "etf" || t.assetType === "fund") {
      const r = chartResults.get(t.symbol);
      if (r) {
        quote = { symbol: t.symbol, price: r.price, prevClose: r.prevClose, currency: r.currency };
        liveCount++;
      }
    } else if (t.assetType === "crypto") {
      const data = cryptoPrices[CRYPTO_IDS[t.symbol] ?? ""];
      if (typeof data?.usd === "number") {
        const chg = data.usd_24h_change ?? 0;
        quote = {
          symbol: t.symbol,
          price: data.usd,
          prevClose: data.usd / (1 + chg / 100),
          currency: "USD",
        };
        liveCount++;
      }
    } else if (t.assetType === "gold" && xau) {
      const factor = ((BAHT_WEIGHT_GRAMS * GOLD_PURITY) / TROY_OZ_GRAMS) * usdThb;
      quote = {
        symbol: t.symbol,
        price: Math.round(xau.price * factor),
        prevClose: Math.round(xau.prevClose * factor),
        currency: "THB",
      };
      liveCount++;
    }

    // ราคากรอกเอง (เช่น NAV กองทุน) นับเป็นราคาจริงจากผู้ใช้ ไม่ใช่ mock
    if (!quote) {
      const manual = manualMap.get(t.symbol);
      if (manual) {
        quote = { symbol: t.symbol, price: manual.price, prevClose: manual.price, currency: manual.currency };
        liveCount++;
      }
    }
    if (!quote) {
      const fallback = MOCK_MAP.get(t.symbol);
      if (fallback) quote = fallback;
    }
    if (quote) quotes.push(quote);
  }

  return { quotes, usdThb, fxLive, liveCount, totalCount: symbols.length };
}

export function priceSourceLabel(md: MarketData): string {
  if (md.totalCount === 0) return "—";
  if (md.liveCount === md.totalCount) return "LIVE";
  if (md.liveCount === 0) return "MOCK";
  return `LIVE ${md.liveCount}/${md.totalCount}`;
}
