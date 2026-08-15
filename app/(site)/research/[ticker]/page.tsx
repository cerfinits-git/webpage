import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { REPORTS, getReport } from "@/lib/reports";
import { getStockQuotes } from "@/lib/quotes";
import { getFundamentals } from "@/lib/research/fundamentals";
import { getPriceHistory } from "@/lib/history";
import { money, pct } from "@/lib/format";
import { qualityToStars, valuationBadge, type DashboardView } from "@/lib/research/dashboard";
import StockDashboard from "@/components/site/StockDashboard";

export const revalidate = 300;

export function generateStaticParams() {
  return REPORTS.map((r) => ({ ticker: r.ticker.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const { ticker } = await params;
  const r = getReport(ticker);
  if (!r) return { title: "ไม่พบหุ้นตัวนี้ | Cerfinits" };

  const stars = qualityToStars(r.quality);
  const badge = valuationBadge(r.valuation.ev, r.refPrice);
  const gapSize = `${(Math.abs(badge.gap) * 100).toFixed(1)}%`;
  const priced =
    badge.tone === "good"
      ? `มูลค่าประมาณสูงกว่าราคาปัจจุบัน ${gapSize}`
      : badge.tone === "poor"
        ? `มูลค่าประมาณต่ำกว่าราคาปัจจุบัน ${gapSize}`
        : "ราคาใกล้เคียงมูลค่าประมาณ";

  const title = `${r.ticker} (${r.company}) — เข้าใจหุ้นตัวนี้ใน 5 นาที | Cerfinits`;
  const desc = `คุณภาพธุรกิจ ${stars}/5 ดาว · ${priced} (${money(r.valuation.ev, "USD")}) · สรุปธุรกิจ สุขภาพการเงิน การเติบโต และความเสี่ยง แบบอ่านเข้าใจง่าย`;
  const path = `/research/${r.ticker.toLowerCase()}`;

  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      siteName: "Cerfinits",
      title,
      description: desc,
      type: "article",
      url: path,
      locale: "th_TH",
      images: [{ url: "/og-cover.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, images: ["/og-cover.png"] },
  };
}

export default async function StockPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const r = getReport(ticker);
  if (!r) notFound();

  const [quotes, fundamentals, history] = await Promise.all([
    getStockQuotes([r.ticker]),
    getFundamentals(r.ticker),
    getPriceHistory(r.ticker),
  ]);
  const q = quotes[r.ticker.toUpperCase()];

  // Narrow the report down to the fields the dashboard renders. Anything passed
  // here is serialised into the page payload, and the analyst verdict wording
  // must not travel to this surface (R11).
  const view: DashboardView = {
    ticker: r.ticker,
    company: r.company,
    exchange: r.exchange,
    asOf: r.asOf,
    quality: r.quality,
    estimate: r.valuation.ev,
    business: r.business,
    businessRisks: r.businessRisks,
  };

  return (
    <StockDashboard
      view={view}
      price={q?.price ?? r.refPrice}
      changePct={q?.changePct ?? null}
      fundamentals={fundamentals}
      closes={history?.closes ?? null}
    />
  );
}
