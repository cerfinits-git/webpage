import PortfolioClient from "@/components/plan/PortfolioClient";
import { computeHoldings, summarize } from "@/lib/finance";
import { getMarketData } from "@/lib/market";
import { readTransactions } from "@/lib/store";
import { getCurrentUser } from "@/lib/actions/auth";
import type { AssetType } from "@/lib/types";

export const dynamic = "force-dynamic";

const ALLOC_META: {
  types: AssetType[];
  label: string;
  labelEn: string;
  color: string;
}[] = [
  { types: ["crypto"], label: "Crypto", labelEn: "Crypto", color: "#8b5cf6" },
  { types: ["stock", "etf"], label: "หุ้น / ETF", labelEn: "Stocks / ETF", color: "#06b6d4" },
  { types: ["fund"], label: "กองทุนรวม", labelEn: "Mutual Funds", color: "#10b981" },
  { types: ["gold"], label: "ทองคำ", labelEn: "Gold", color: "#f59e0b" },
];

export default async function PortfolioPage() {
  const user = await getCurrentUser();
  const userId = user?.username || null;
  const transactions = await readTransactions(userId);
  const market = await getMarketData(transactions);
  const holdings = computeHoldings(transactions, market.quotes, market.usdThb);
  const summary = summarize(holdings);

  const alloc = ALLOC_META.map((m) => {
    const value = holdings
      .filter((h) => m.types.includes(h.assetType))
      .reduce((sum, h) => sum + h.valueThb, 0);
    return {
      ...m,
      value,
      share: summary.totalValueThb > 0 ? value / summary.totalValueThb : 0,
    };
  }).filter((a) => a.value > 0);

  const recent = [...transactions]
    .sort((a, b) => b.tradedAt.localeCompare(a.tradedAt))
    .slice(0, 10);

  return (
    <PortfolioClient
      holdings={holdings}
      summary={summary}
      market={market}
      alloc={alloc}
      recent={recent}
    />
  );
}
