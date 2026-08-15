"use client";

import { useMemo } from "react";
import { T, useLang } from "@/components/site/LangContext";
import { pct, qty, signedThb, thb, money } from "@/lib/format";
import type { Holding, PortfolioSummary, Transaction } from "@/lib/types";
import type { MarketData } from "@/lib/market";
import { priceSourceLabel } from "@/lib/market";
import { Sparkline } from "@/components/journal/JournalCharts";
import TransactionForm from "@/components/TransactionForm";
import DeleteButton from "@/components/DeleteButton";
import NavEditButton from "@/components/NavEditButton";
import TradeButtons from "@/components/TradeButtons";
import AllocationChart, { type AllocationSlice } from "@/components/AllocationChart";

const TYPE_BADGE_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  crypto: { bg: "rgba(139, 92, 246, 0.12)", color: "#a78bfa", border: "rgba(139, 92, 246, 0.3)" },
  stock: { bg: "rgba(6, 182, 212, 0.12)", color: "#22d3ee", border: "rgba(6, 182, 212, 0.3)" },
  etf: { bg: "rgba(59, 130, 246, 0.12)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" },
  fund: { bg: "rgba(16, 185, 129, 0.12)", color: "#34d399", border: "rgba(16, 185, 129, 0.3)" },
  gold: { bg: "rgba(245, 158, 11, 0.12)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
};

function CompactMetricCard({
  label,
  value,
  sample,
  tone = "positive",
}: {
  label: string;
  value: string;
  sample: string;
  values?: number[];
  tone?: "positive" | "neutral" | "negative";
}) {
  return (
    <article
      className="j-metric-card"
      style={{
        minHeight: "86px",
        padding: "14px 16px",
        borderRadius: "8px",
        background: "var(--j-panel)",
        border: "1px solid var(--j-line)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <span style={{ fontSize: "11px", color: "var(--j-muted)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500 }}>
          {label}
        </span>
      </div>
      <strong
        className={tone === "positive" ? "j-positive" : tone === "negative" ? "j-negative" : ""}
        style={{ fontSize: "22px", marginTop: "6px", display: "block", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {value}
      </strong>
      <small style={{ fontSize: "10.5px", marginTop: "2px", color: "var(--j-muted)", display: "block" }}>
        {sample}
      </small>
    </article>
  );
}

export default function PortfolioClient({
  holdings,
  summary,
  market,
  alloc,
  recent,
}: {
  holdings: Holding[];
  summary: PortfolioSummary;
  market: MarketData;
  alloc: AllocationSlice[];
  recent: Transaction[];
}) {
  const { lang } = useLang();

  const largestAlloc = useMemo(() => {
    if (alloc.length === 0) return null;
    return alloc.reduce((a, b) => (b.share > a.share ? b : a), alloc[0]);
  }, [alloc]);

  // Sparkline series
  const valueTrend = [summary.totalValueThb * 0.96, summary.totalValueThb * 0.98, summary.totalValueThb * 0.99, summary.totalValueThb];
  const returnTrend = [summary.plThb * 0.7, summary.plThb * 0.85, summary.plThb * 0.95, summary.plThb];

  return (
    <div className="j-page" style={{ padding: "16px 24px 32px" }}>
      {/* Compact Page Head matching Trading Journal */}
      <header className="j-page-head" style={{ marginBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px" }}>
            <T th="พอร์ตลงทุน (Portfolio)" en="Portfolio" />
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--j-muted)" }}>
            <T
              th="ติดตามสินทรัพย์ การกระจายความเสี่ยง และผลตอบแทนรวม"
              en="Track assets, allocation, and portfolio performance"
            />
          </p>
        </div>

        <div className="j-head-controls">
          <TransactionForm />
        </div>
      </header>

      {/* Top 4 Metrics Horizontal Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
        <CompactMetricCard
          label={lang === "en" ? "Total Value" : "มูลค่าพอร์ตรวม"}
          value={thb(summary.totalValueThb)}
          sample={lang === "en" ? `${holdings.length} assets held` : `ถือครอง ${holdings.length} สินทรัพย์`}
          values={valueTrend}
          tone="neutral"
        />
        <CompactMetricCard
          label={lang === "en" ? "Total Return" : "กำไร / ขาดทุนรวม"}
          value={`${signedThb(summary.plThb)} (${pct(summary.plPct)})`}
          sample={lang === "en" ? "Overall portfolio P&L" : "ผลตอบแทนรวมตลอดกาล"}
          values={returnTrend}
          tone={summary.plThb >= 0 ? "positive" : "negative"}
        />
        <CompactMetricCard
          label={lang === "en" ? "Today's Change" : "การเปลี่ยนแปลงวันนี้"}
          value={pct(summary.dayChangePct, 2)}
          sample={lang === "en" ? `${signedThb(summary.dayChangeThb)} vs close` : `${signedThb(summary.dayChangeThb)} เทียบราคาปิด`}
          tone={summary.dayChangeThb >= 0 ? "positive" : "negative"}
        />
        <CompactMetricCard
          label={lang === "en" ? "Exchange Rate" : "อัตราแลกเปลี่ยน"}
          value={`33.13`}
          sample={`USDTHB · ${market.fxLive ? "LIVE" : "MOCK"} · ${priceSourceLabel(market)}`}
          tone="neutral"
        />
      </div>

      {/* SECTION 1: HOLDINGS */}
      <section className="j-full-view-panel" style={{ marginBottom: "20px" }}>
        <div className="j-full-view-head">
          <div>
            <h2><T th="Holdings — สินทรัพย์ที่ถือครองในพอร์ต" en="Holdings — Current Portfolio Assets" /></h2>
            <p><T th="ข้อมูลราคาเฉลี่ย, ราคาปัจจุบันแบบเรียลไทม์ และกำไร/ขาดทุนแต่ละสินทรัพย์" en="Average cost, realtime quotes, and profit/loss breakdown per asset." /></p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "13px", color: "var(--j-ink)", fontWeight: 600 }}>
              <T th="รวมมูลค่า: " en="Total Value: " />
              {thb(summary.totalValueThb)}
            </span>
          </div>
        </div>

        <div className="j-table-wrap" style={{ padding: "0 18px 12px" }}>
          <table className="j-table">
            <thead>
              <tr>
                <th style={{ width: "26%" }}><T th="สินทรัพย์" en="Asset" /></th>
                <th><T th="จำนวน" en="Qty" /></th>
                <th className="hide-sm"><T th="ต้นทุนเฉลี่ย" en="Avg Cost" /></th>
                <th className="hide-sm"><T th="ราคาล่าสุด" en="Last Price" /></th>
                <th><T th="มูลค่า (฿)" en="Value (฿)" /></th>
                <th style={{ textAlign: "right" }}><T th="กำไร" en="P&L" /></th>
                <th style={{ textAlign: "right", width: 110 }} aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {holdings.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "34px", color: "var(--j-muted)" }}>
                    <T th="ยังไม่มีสินทรัพย์ในพอร์ต — กด ＋ บันทึกธุรกรรม เพื่อเริ่มบันทึก" en="No assets in portfolio yet — press ＋ Log Transaction to begin" />
                  </td>
                </tr>
              ) : (
                holdings.map((h) => {
                  const badge = TYPE_BADGE_STYLE[h.assetType] || { bg: "var(--j-soft)", color: "var(--j-muted)", border: "var(--j-line)" };
                  return (
                    <tr key={h.symbol}>
                      <td style={{ fontWeight: 500 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{h.name}</span>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "1px 6px",
                              borderRadius: "3px",
                              fontSize: "10px",
                              fontWeight: 600,
                              fontFamily: "var(--mono)",
                              textTransform: "uppercase",
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                            }}
                          >
                            {h.assetType}
                          </span>
                        </div>
                      </td>
                      <td>
                        {qty(h.quantity)}
                        {h.unitLabel ? ` ${h.unitLabel}` : ""}
                      </td>
                      <td className="j-number-cell hide-sm">{money(h.avgCost, h.currency)}</td>
                      <td className="j-number-cell hide-sm">{money(h.price, h.currency)}</td>
                      <td className="j-number-cell">{Math.round(h.valueThb).toLocaleString("en-US")}</td>
                      <td className={`j-number-cell ${h.plPct >= 0 ? "j-data-ok" : "j-data-warn"}`} style={{ textAlign: "right", fontWeight: 600 }}>
                        {pct(h.plPct)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          {h.assetType === "fund" && (
                            <NavEditButton symbol={h.symbol} currency={h.currency} />
                          )}
                          <TradeButtons
                            prefill={{
                              assetType: h.assetType,
                              symbol: h.symbol,
                              name: h.name,
                              currency: h.currency,
                              price: h.price,
                            }}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2: ASSET ALLOCATION */}
      <section className="j-full-view-panel" style={{ marginBottom: "20px" }}>
        <div className="j-full-view-head">
          <div>
            <h2><T th="Asset Allocation — การกระจายสินทรัพย์" en="Asset Allocation — Portfolio Weighting" /></h2>
            <p><T th="สัดส่วนการลงทุนตามประเภทสินทรัพย์ (หุ้น, ETF, กองทุน, คริปโต, ทองคำ)" en="Investment allocation across asset classes (Stocks, ETF, Mutual Funds, Crypto, Gold)." /></p>
          </div>
          {largestAlloc && (
            <span style={{ fontSize: "12px", color: "var(--j-muted)" }}>
              <T
                th={<>ถือ <b>{largestAlloc.label}</b> หนักที่สุดที่ {Math.round(largestAlloc.share * 100)}% ของพอร์ต</>}
                en={<>Heaviest in <b>{largestAlloc.labelEn}</b> at {Math.round(largestAlloc.share * 100)}% of portfolio</>}
              />
            </span>
          )}
        </div>

        <div style={{ padding: "16px 20px 24px" }}>
          <AllocationChart slices={alloc} total={summary.totalValueThb} />
        </div>
      </section>

      {/* SECTION 3: RECENT TRANSACTIONS */}
      <section className="j-full-view-panel">
        <div className="j-full-view-head">
          <div>
            <h2><T th="Recent Transactions — ประวัติธุรกรรมล่าสุด" en="Recent Transactions — Trade History" /></h2>
            <p><T th="รายการซื้อ-ขายล่าสุด และการปรับปรุงพอร์ต" en="Recent buys, sells, and portfolio adjustments." /></p>
          </div>
          <span style={{ fontSize: "12px", color: "var(--j-muted)" }}>
            {recent.length} <T th="รายการล่าสุด" en="recent trades" />
          </span>
        </div>

        <div className="j-table-wrap" style={{ padding: "0 18px 12px" }}>
          <table className="j-table">
            <thead>
              <tr>
                <th style={{ width: "16%" }}><T th="วันที่" en="Date" /></th>
                <th style={{ width: "12%" }}><T th="ฝั่ง" en="Side" /></th>
                <th><T th="สินทรัพย์" en="Asset" /></th>
                <th><T th="จำนวน / ราคา" en="Qty @ Price" /></th>
                <th style={{ textAlign: "right", width: 60 }}><T th="จัดการ" en="Action" /></th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "34px", color: "var(--j-muted)" }}>
                    <T th="ยังไม่มีรายการธุรกรรม" en="No transactions logged yet" />
                  </td>
                </tr>
              ) : (
                recent.map((tx) => (
                  <tr key={tx.id}>
                    <td className="j-number-cell" style={{ color: "var(--j-muted)" }}>{tx.tradedAt}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          fontFamily: "var(--mono)",
                          background: tx.side === "buy" ? "var(--j-up-tint, rgba(16, 185, 129, 0.12))" : "var(--j-down-tint, rgba(244, 63, 94, 0.12))",
                          color: tx.side === "buy" ? "var(--j-positive)" : "var(--j-negative)",
                          border: `1px solid ${tx.side === "buy" ? "var(--j-up-line, rgba(16, 185, 129, 0.35))" : "var(--j-down-line, rgba(244, 63, 94, 0.35))"}`,
                        }}
                      >
                        <T th={tx.side === "buy" ? "ซื้อ" : "ขาย"} en={tx.side === "buy" ? "BUY" : "SELL"} />
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{tx.name}</td>
                    <td className="j-number-cell" style={{ color: "var(--j-muted)" }}>
                      {qty(tx.quantity)}
                      {tx.unitLabel ? ` ${tx.unitLabel}` : ""} @ {money(tx.price, tx.currency)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <DeleteButton
                        url={`/api/transactions?id=${tx.id}`}
                        label="ธุรกรรมนี้"
                        labelEn="this transaction"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
