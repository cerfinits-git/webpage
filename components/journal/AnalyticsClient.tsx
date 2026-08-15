"use client";

import { useMemo, useState } from "react";
import {
  calculateJournalMetrics,
  groupExpectancy,
  calculateHoldingTimeMetrics,
  calculateTimeHeatmap,
  calculateWinLossDollarMetrics,
  calculateDurationBuckets,
  calculateDollarUnderwaterSeries,
  calculateCostMetrics,
  HOUR_BLOCK_LABELS,
} from "@/lib/journal/metrics";
import { formatR, createCurrencyFormatter } from "@/lib/journal/format";
import { filterTradesByRange, JOURNAL_RANGE_OPTIONS, replaceJournalUrlQuery, type JournalRange } from "@/lib/journal/range";
import { tradesForAccount } from "@/lib/journal/accounts";
import { useJournal } from "./JournalProvider";
import JournalIcon from "./JournalIcon";
import JournalAccountControl from "./JournalAccountControl";
import { Gauge, DurationBarChart, DollarUnderwaterChart } from "./JournalCharts";
import { T, useLang } from "@/components/site/LangContext";

type AnalyticsTab = "gauges" | "duration" | "drawdown" | "cost" | "heatmap" | "breakdown" | "all";

function GroupTable({ title, rows }: { title: string; rows: ReturnType<typeof groupExpectancy> }) {
  const max = Math.max(...rows.map((row) => Math.abs(row.expectancy)), 0.01);
  return (
    <section className="j-panel j-analytics-panel">
      <div className="j-panel-head">
        <div>
          <h2>{title}</h2>
          <p><T th="Expectancy ต่อ trade พร้อม sample size" en="Expectancy per trade, with sample size"/></p>
        </div>
      </div>
      <div className="j-group-list">
        {rows.map((row) => (
          <div className="j-group-row" key={row.name}>
            <div>
              <b>{row.name}</b>
              <span>{row.count} trades · win {Math.round(row.winRate * 100)}%</span>
            </div>
            <div className="j-group-track">
              <i
                className={row.expectancy >= 0 ? "is-positive" : "is-negative"}
                style={{ width: `${Math.max(8, (Math.abs(row.expectancy) / max) * 100)}%` }}
              />
            </div>
            <strong className={row.expectancy >= 0 ? "j-positive" : "j-negative"}>
              {formatR(row.expectancy)}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AnalyticsClient() {
  const { trades, activeAccountId, activeAccount, range, setRange } = useJournal();
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("gauges");

  const timeZone = activeAccount?.reportingTimezone || "Asia/Bangkok";
  const accountTrades = useMemo(() => tradesForAccount(trades, activeAccountId), [trades, activeAccountId]);
  const visibleTrades = useMemo(() => filterTradesByRange(accountTrades, range), [accountTrades, range]);

  const metrics = useMemo(() => calculateJournalMetrics(visibleTrades), [visibleTrades]);
  const holdingMetrics = useMemo(() => calculateHoldingTimeMetrics(visibleTrades, lang), [visibleTrades, lang]);
  const heatmapGrid = useMemo(() => calculateTimeHeatmap(visibleTrades, timeZone), [visibleTrades, timeZone]);
  const dollarMetrics = useMemo(() => calculateWinLossDollarMetrics(visibleTrades), [visibleTrades]);
  const durationBuckets = useMemo(() => calculateDurationBuckets(visibleTrades), [visibleTrades]);
  const usdDrawdown = useMemo(() => calculateDollarUnderwaterSeries(visibleTrades, lang), [visibleTrades, lang]);
  const costMetrics = useMemo(() => calculateCostMetrics(visibleTrades), [visibleTrades]);
  const currencyFormatter = useMemo(() => createCurrencyFormatter(activeAccount?.baseCurrency ?? "USD"), [activeAccount]);

  const totalHoldingSum = holdingMetrics.avgWinMinutes + holdingMetrics.avgLossMinutes;
  const winHoldingPct = totalHoldingSum > 0 ? (holdingMetrics.avgWinMinutes / totalHoldingSum) * 100 : 50;
  const winRatePct = Math.round(metrics.winRate * 100);
  const gaugeMaxFor = (value: number) => Math.max(100, Math.ceil((value * 2) / 100) * 100);

  const tabs: { id: AnalyticsTab; labelTh: string; labelEn: string; icon: "target" | "trend" | "chart" | "grid" | "split" }[] = [
    { id: "gauges", labelTh: "Performance", labelEn: "Performance", icon: "target" },
    { id: "duration", labelTh: "Duration", labelEn: "Duration", icon: "trend" },
    { id: "drawdown", labelTh: "Drawdown", labelEn: "Drawdown", icon: "chart" },
    { id: "cost", labelTh: "Cost Drag", labelEn: "Cost Drag", icon: "trend" },
    { id: "heatmap", labelTh: "Heatmap", labelEn: "Heatmap", icon: "grid" },
    { id: "breakdown", labelTh: "Setups", labelEn: "Setups", icon: "chart" },
    { id: "all", labelTh: "Split View", labelEn: "Split View", icon: "split" },
  ];

  return (
    <div className="j-page">
      <header className="j-page-head">
        <div>
          <h1>Analytics</h1>
          <p>
            <T
              th="วิเคราะห์ประสิทธิภาพการเทรด มิติเวลา และสถิติ Drawdown"
              en="Trading performance, timing, and drawdown statistics"
            /> · {visibleTrades.length}/{accountTrades.length} trades
          </p>
        </div>
        <div className="j-head-controls">
          <JournalAccountControl ariaLabel="Analytics trading account"/>
          <label className="j-select-like j-select-control">
            <JournalIcon name="calendar"/>
            <select
              aria-label="Analytics date range"
              value={range}
              onChange={(event) => {
                const next = event.target.value as JournalRange;
                setRange(next);
                replaceJournalUrlQuery(next);
              }}
            >
              {JOURNAL_RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {lang === "en" ? option.labelEn : option.label}
                </option>
              ))}
            </select>
            <JournalIcon name="chevron"/>
          </label>
        </div>
      </header>

      {/* Top 4 KPI Metrics Bar */}
      <section className="j-analytics-summary" style={{ marginBottom: "20px" }}>
        <div>
          <span>Expectancy</span>
          <strong className={metrics.expectancy >= 0 ? "j-positive" : "j-negative"}>
            {formatR(metrics.expectancy)}
          </strong>
        </div>
        <div>
          <span>Max drawdown</span>
          <strong className="j-negative">-{metrics.maxDrawdownR.toFixed(1)}R</strong>
        </div>
        <div>
          <span>Win rate</span>
          <strong>{Math.round(metrics.winRate * 100)}%</strong>
        </div>
        <div>
          <span>Valid sample</span>
          <strong>{metrics.sampleSize}</strong>
        </div>
      </section>

      {/* Segmented Tab Switcher Navigation Bar */}
      <nav className="j-view-tabs" aria-label="Analytics sections">
        <div className="j-view-tabs-left">
          {tabs.filter((t) => t.id !== "all").map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`j-view-tab-btn ${activeTab === tab.id ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <JournalIcon name={tab.icon} size={15}/>
              <span>{lang === "en" ? tab.labelEn : tab.labelTh}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`j-view-tab-btn j-view-tab-split ${activeTab === "all" ? "is-active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <JournalIcon name="split" size={15}/>
          <span><T th="Split View" en="Split View"/></span>
        </button>
      </nav>

      {/* ── SECTION 1: PERFORMANCE GAUGES ── */}
      {(activeTab === "gauges" || activeTab === "all") && (
        <section className="j-panel j-analytics-panel j-full-view-panel" style={{ marginBottom: "24px" }}>
          <div className="j-panel-head">
            <div>
              <span className="j-kicker">PERFORMANCE</span>
              <h2><T th="ตัวชี้วัดภาพรวม (Performance Gauges)" en="Performance Gauges"/></h2>
              <p><T th="สรุปเป็นภาพเข้าใจง่าย — แสดงสถิติ Win Rate และค่าเฉลี่ย $ ไม้ชนะเทียบไม้แพ้" en="Glanceable summary — Win Rate and average dollar win vs loss"/></p>
            </div>
            {activeTab === "all" && <span className="j-tab-badge">1 / 6</span>}
          </div>
          <div className="j-gauge-row">
            <Gauge
              value={winRatePct}
              max={100}
              label={lang === "en" ? "Win Rate" : "อัตราชนะ"}
              formattedValue={`${winRatePct}%`}
              minLabel="0"
              maxLabel="100"
              tone="neutral"
            />
            <Gauge
              value={dollarMetrics.avgWinDollar}
              max={gaugeMaxFor(dollarMetrics.avgWinDollar)}
              label={lang === "en" ? "Avg Winning Trade" : "กำไรเฉลี่ยต่อไม้ชนะ"}
              formattedValue={currencyFormatter.format(dollarMetrics.avgWinDollar)}
              minLabel={currencyFormatter.format(0)}
              maxLabel={currencyFormatter.format(gaugeMaxFor(dollarMetrics.avgWinDollar))}
              tone="positive"
            />
            <Gauge
              value={dollarMetrics.avgLossDollar}
              max={gaugeMaxFor(dollarMetrics.avgLossDollar)}
              label={lang === "en" ? "Avg Losing Trade" : "ขาดทุนเฉลี่ยต่อไม้แพ้"}
              formattedValue={currencyFormatter.format(dollarMetrics.avgLossDollar)}
              minLabel={currencyFormatter.format(0)}
              maxLabel={currencyFormatter.format(gaugeMaxFor(dollarMetrics.avgLossDollar))}
              tone="negative"
            />
          </div>
        </section>
      )}

      {/* ── SECTION 2: DURATION & HOLDING TIME ── */}
      {(activeTab === "duration" || activeTab === "all") && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "24px" }}>
          {/* Duration Bar Chart */}
          <section className="j-panel j-analytics-panel j-full-view-panel">
            <div className="j-panel-head">
              <div>
                <span className="j-kicker">DURATION</span>
                <h2><T th="ไม้สำเร็จตามระยะเวลาถือไม้" en="Successful Trades by Duration"/></h2>
                <p><T th="จำนวนไม้ที่สำเร็จเทียบไม่สำเร็จ แบ่งตามระยะเวลาที่ถือไม้ (openedAt ถึง closedAt)" en="Count of successful vs unsuccessful trades grouped by holding duration"/></p>
              </div>
              {activeTab === "all" && <span className="j-tab-badge">2 / 6</span>}
            </div>
            <div style={{ padding: "16px 20px" }}>
              <DurationBarChart buckets={durationBuckets}/>
            </div>
          </section>

          {/* Holding Duration Ratio Card */}
          <section className="j-panel j-analytics-panel j-full-view-panel">
            <div className="j-panel-head">
              <div>
                <span className="j-kicker">HOLDING TIME</span>
                <h2><T th="ระยะเวลาถือไม้ (Holding Duration)" en="Holding Duration"/></h2>
                <p><T th="เปรียบเทียบเวลาถือไม้ชนะ vs ไม้แพ้ (คำนวณจาก openedAt ถึง closedAt)" en="Winning vs losing hold time comparison"/></p>
              </div>
            </div>
            <div className="j-holding-card" style={{ padding: "20px 24px" }}>
              <div className="j-holding-stat">
                <span><T th="ระยะเวลาถือไม้ชนะ (Avg Win)" en="Avg hold — wins"/></span>
                <strong className="j-positive">{holdingMetrics.formattedAvgWin}</strong>
                <small style={{ color: "var(--j-muted)", fontSize: "11px" }}>
                  {holdingMetrics.winCount} <T th="ไม้ชนะ" en="wins"/>
                </small>
              </div>
              <div className="j-holding-stat">
                <span><T th="ระยะเวลาถือไม้แพ้ (Avg Loss)" en="Avg hold — losses"/></span>
                <strong className="j-negative">{holdingMetrics.formattedAvgLoss}</strong>
                <small style={{ color: "var(--j-muted)", fontSize: "11px" }}>
                  {holdingMetrics.lossCount} <T th="ไม้แพ้" en="losses"/>
                </small>
              </div>
              <div className="j-holding-stat">
                <span><T th="อัตราส่วนเวลาถือไม้ (Win/Loss Ratio)" en="Hold time ratio (win/loss)"/></span>
                <strong>{holdingMetrics.ratio != null ? `${holdingMetrics.ratio.toFixed(2)}x` : "N/A"}</strong>
                <small style={{ color: "var(--j-muted)", fontSize: "11px" }}>
                  {holdingMetrics.ratio != null && holdingMetrics.ratio < 1
                    ? <T th="ถือไม้แพ้นานกว่าไม้ชนะ" en="Losers held longer than winners"/>
                    : <T th="ถือไม้ชนะนานกว่าไม้แพ้" en="Winners held longer than losers"/>}
                </small>
              </div>

              <div className="j-holding-bar-wrap" style={{ marginTop: "14px" }}>
                <div className="j-holding-bar-win" style={{ width: `${winHoldingPct}%` }} title={`Win: ${holdingMetrics.formattedAvgWin}`}/>
                <div className="j-holding-bar-loss" style={{ width: `${100 - winHoldingPct}%` }} title={`Loss: ${holdingMetrics.formattedAvgLoss}`}/>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── SECTION 3: EQUITY DRAWDOWN ($) ── */}
      {(activeTab === "drawdown" || activeTab === "all") && (
        <section className="j-panel j-analytics-panel j-full-view-panel" style={{ marginBottom: "24px" }}>
          <div className="j-panel-head">
            <div>
              <span className="j-kicker">DRAWDOWN</span>
              <h2><T th="Equity Drawdown (สกุลเงินบัญชี)" en="Equity Drawdown (account currency)"/></h2>
              <p><T th="ความลึกและเวลาที่จมใต้จุดสูงสุด คำนวณจากยอดกำไรสุทธิสะสม — ใช้ได้กับข้อมูล cTrader ที่ไม่มี R" en="How deep the equity falls below its peak and how long it stays there, from cumulative net P&L"/></p>
            </div>
            {activeTab === "all" && <span className="j-tab-badge">3 / 6</span>}
          </div>
          <div className="j-drawdown-stats">
            <div>
              <span>Max Drawdown</span>
              <strong className="j-negative">
                -{currencyFormatter.format(usdDrawdown.maxDrawdownUsd)}
                {usdDrawdown.maxDrawdownPct > 0 ? <span style={{ fontSize: "13px", opacity: 0.7 }}> ({(usdDrawdown.maxDrawdownPct * 100).toFixed(1)}%)</span> : null}
              </strong>
            </div>
            <div>
              <span>Longest Drawdown Duration</span>
              <strong>{usdDrawdown.formattedLongestDrawdown}</strong>
            </div>
            <div>
              <span>Current Drawdown</span>
              <strong className={usdDrawdown.currentDrawdownUsd < 0 ? "j-negative" : "j-positive"}>
                {usdDrawdown.currentDrawdownUsd < 0 ? currencyFormatter.format(usdDrawdown.currentDrawdownUsd) : "Peak Equity"}
              </strong>
            </div>
          </div>
          <div style={{ padding: "0 16px 16px" }}>
            <DollarUnderwaterChart trades={visibleTrades} timeZone={timeZone} currency={activeAccount?.baseCurrency ?? "USD"}/>
          </div>
        </section>
      )}

      {/* ── SECTION 4: COST DRAG (commission + swap) ── */}
      {(activeTab === "cost" || activeTab === "all") && (
        <section className="j-panel j-analytics-panel j-full-view-panel" style={{ marginBottom: "24px" }}>
          <div className="j-panel-head">
            <div>
              <span className="j-kicker">COST</span>
              <h2><T th="ต้นทุนการเทรด (Cost Drag)" en="Cost Drag"/></h2>
              <p><T th="ค่าคอมและ swap กินกำไรดิบไปเท่าไหร่ — วัดจากผลรวม gross เทียบ net ของ cTrader" en="How much commission and swap eat into your raw edge — gross vs net across all trades"/></p>
            </div>
            {activeTab === "all" && <span className="j-tab-badge">4 / 6</span>}
          </div>

          {costMetrics.tradesWithCost === 0 ? (
            <div style={{ padding: "16px 24px 4px", color: "var(--j-muted)", fontSize: "13px", lineHeight: 1.6 }}>
              <T
                th="ยังไม่มีข้อมูลต้นทุน — ออเดอร์ที่ sync มาก่อนหน้านี้ยังไม่มี commission/swap แนบมา เชื่อมต่อ cTrader แล้ว sync ใหม่อีกครั้งเพื่อดึงค่าคอมและ swap จริงเข้ามา"
                en="No cost data yet — trades synced earlier carry no commission/swap. Reconnect cTrader and re-sync to pull the real costs in."
              />
            </div>
          ) : null}

          <div className="j-drawdown-stats">
            <div>
              <span>Gross P&amp;L</span>
              <strong className={costMetrics.totalGross >= 0 ? "j-positive" : "j-negative"}>
                {currencyFormatter.format(costMetrics.totalGross)}
              </strong>
            </div>
            <div>
              <span>Total Cost (comm + swap)</span>
              <strong className="j-negative">{currencyFormatter.format(costMetrics.totalCost)}</strong>
            </div>
            <div>
              <span>Net P&amp;L</span>
              <strong className={costMetrics.totalNet >= 0 ? "j-positive" : "j-negative"}>
                {currencyFormatter.format(costMetrics.totalNet)}
              </strong>
            </div>
            <div>
              <span>Cost / Gross</span>
              <strong className={costMetrics.costPctOfGross > 0 ? "j-negative" : ""}>
                {costMetrics.costPctOfGross.toFixed(1)}%
              </strong>
            </div>
          </div>

          <div className="j-analytics-grid" style={{ padding: "4px 24px 20px", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
            <div className="j-holding-stat">
              <span><T th="ค่าคอมมิชชั่นรวม" en="Total commission"/></span>
              <strong className="j-negative">{currencyFormatter.format(costMetrics.totalCommission)}</strong>
            </div>
            <div className="j-holding-stat">
              <span>Swap / <T th="ค่าถือข้ามคืน" en="overnight"/></span>
              <strong className={costMetrics.totalSwap >= 0 ? "j-positive" : "j-negative"}>{currencyFormatter.format(costMetrics.totalSwap)}</strong>
            </div>
            <div className="j-holding-stat">
              <span><T th="ต้นทุนเฉลี่ยต่อไม้" en="Avg cost / trade"/></span>
              <strong className={costMetrics.avgCostPerTrade < 0 ? "j-negative" : ""}>{currencyFormatter.format(costMetrics.avgCostPerTrade)}</strong>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 5: 2D EXPECTANCY HEATMAP ── */}
      {(activeTab === "heatmap" || activeTab === "all") && (
        <section className="j-panel j-analytics-panel j-full-view-panel" style={{ marginBottom: "24px" }}>
          <div className="j-panel-head">
            <div>
              <span className="j-kicker">EXPECTANCY</span>
              <h2><T th="Expectancy Heatmap (วันในสัปดาห์ × ช่วงเวลา)" en="Expectancy Heatmap (day of week × time block)"/></h2>
              <p>
                <T
                  th={`แปลงเวลาจาก openedAt ตามโซนเวลาบัญชี (${timeZone}) · แบ่งช่วงละ 4 ชั่วโมงเพื่อความแม่นยำทางสถิติ`}
                  en={`openedAt converted to account timezone (${timeZone}) · bucketed into 4-hour blocks`}
                />
              </p>
            </div>
            {activeTab === "all" && <span className="j-tab-badge">5 / 6</span>}
          </div>

          <div style={{ padding: "20px 24px" }}>
            <div className="j-heatmap-grid">
              <div className="j-heatmap-header"><T th="วัน / เวลา" en="Day / Time"/></div>
              {HOUR_BLOCK_LABELS.map((blockLabel) => (
                <div className="j-heatmap-header" key={blockLabel}>{blockLabel}<T th=" น." en=""/></div>
              ))}

              {heatmapGrid.map((row) => (
                <div key={row[0].dayLabel} style={{ display: "contents" }}>
                  <div className="j-heatmap-row-label"><T th={row[0].dayLabel} en={row[0].dayLabelEn}/></div>
                  {row.map((cell) => {
                    const hasTrades = cell.count > 0;
                    const hasValidR = cell.validCount > 0;
                    const metricVal = hasValidR ? cell.expectancy : cell.avgPnl;
                    const isPositive = metricVal > 0;
                    const isNegative = metricVal < 0;

                    let stateClass = "";
                    if (!hasTrades) {
                      stateClass = "";
                    } else if (cell.isLowSample) {
                      stateClass = "is-low-sample";
                    } else if (isPositive) {
                      stateClass = "is-positive";
                    } else if (isNegative) {
                      stateClass = "is-negative";
                    }

                    const formatVal = () => {
                      if (!hasTrades) return "·";
                      if (hasValidR) return formatR(cell.expectancy);
                      const val = cell.avgPnl;
                      const absVal = Math.abs(val);
                      const formattedStr = absVal >= 1000 ? `$${(absVal / 1000).toFixed(1)}k` : `$${absVal.toFixed(1)}`;
                      return val > 0 ? `+${formattedStr}` : val < 0 ? `-${formattedStr}` : "$0.0";
                    };

                    const valText = formatVal();

                    return (
                      <div
                        key={`${cell.dayLabel}-${cell.blockLabel}`}
                        className={`j-heatmap-cell ${stateClass}`}
                        title={`${lang === "en" ? `${cell.dayLabelEn} ${cell.blockLabel}` : `${cell.dayLabel} ช่วง ${cell.blockLabel} น.`}: ${hasValidR ? `Expectancy ${formatR(cell.expectancy)}` : `Avg P&L ${valText}`} (${cell.count} trades)${cell.isLowSample ? " - [n < 10 low sample]" : ""}`}
                      >
                        {hasTrades ? (
                          <>
                            <span className={`j-heatmap-exp ${cell.isLowSample ? "is-neutral" : isPositive ? "is-positive" : isNegative ? "is-negative" : "is-neutral"}`}>
                              {valText}
                            </span>
                            <span className="j-heatmap-sample">n={cell.count}</span>
                          </>
                        ) : (
                          <span className="j-heatmap-exp is-neutral">·</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "20px", alignItems: "center", marginTop: "16px", fontSize: "12px", color: "var(--j-muted)", fontFamily: "var(--mono)", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: "color-mix(in srgb, var(--j-positive) 30%, transparent)", border: "1px solid var(--j-positive)" }}/>
                <T th="Expectancy บวก (n ≥ 10)" en="Positive expectancy (n ≥ 10)"/>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: "color-mix(in srgb, var(--j-negative) 30%, transparent)", border: "1px solid var(--j-negative)" }}/>
                <T th="Expectancy ลบ (n ≥ 10)" en="Negative expectancy (n ≥ 10)"/>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: "var(--j-soft)", border: "1px dashed var(--j-line)" }}/>
                <T th="สีกระเบื้องเทา n < 10 (Sample ต่ำเพื่อป้องกันภาพลวงตา)" en="Grey tile: n < 10 (sample too low to trust)"/>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 5: BREAKDOWN TABLES ── */}
      {(activeTab === "breakdown" || activeTab === "all") && (
        <section className="j-panel j-analytics-panel j-full-view-panel" style={{ marginBottom: "24px" }}>
          <div className="j-panel-head">
            <div>
              <span className="j-kicker">BREAKDOWN</span>
              <h2><T th="เจาะลึกตาม Setup, Symbol และ Session" en="Performance Breakdown by Setup, Symbol, and Session"/></h2>
              <p><T th="วิเคราะห์ Expectancy และ Win Rate แยกตามกลุ่มเพื่อค้นหาข้อได้เปรียบ (Edge)" en="Compare expectancy and win rate across setups, instruments, and trading sessions"/></p>
            </div>
            {activeTab === "all" && <span className="j-tab-badge">6 / 6</span>}
          </div>
          <div className="j-analytics-grid" style={{ padding: "20px 24px" }}>
            <GroupTable title="By setup" rows={groupExpectancy(visibleTrades, "setup")}/>
            <GroupTable title="By symbol" rows={groupExpectancy(visibleTrades, "symbol")}/>
            <GroupTable title="By session" rows={groupExpectancy(visibleTrades, "session")}/>
          </div>
        </section>
      )}
    </div>
  );
}
