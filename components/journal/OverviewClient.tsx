"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { calculateJournalMetrics, cumulativeRSeries, cumulativePnlSeries } from "@/lib/journal/metrics";
import { createDateTimeFormatter, createShortDateFormatter, formatR } from "@/lib/journal/format";
import { tradesForAccount } from "@/lib/journal/accounts";
import { buildJournalHref, filterTradesByRange, JOURNAL_RANGE_OPTIONS, replaceJournalUrlQuery, type JournalRange } from "@/lib/journal/range";
import { useJournal } from "./JournalProvider";
import { CumulativeRChart, Sparkline, CumulativePnlChart, UnderwaterChart } from "./JournalCharts";
import JournalIcon from "./JournalIcon";
import JournalAccountControl from "./JournalAccountControl";
import PnlCalendar from "./PnlCalendar";
import { T, useLang } from "@/components/site/LangContext";

type ViewTab = "calendar" | "cumulative" | "trades" | "completeness" | "all";

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
  tone?: "positive" | "neutral" | "negative" | "cyan";
}) {
  const toneClass =
    tone === "positive"
      ? "j-positive"
      : tone === "negative"
      ? "j-negative"
      : tone === "cyan"
      ? "j-cyan"
      : "";

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
        className={toneClass}
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

export default function OverviewClient() {
  const { trades, activeAccount, activeAccountId, range, setRange, importTrades, isHydrated } = useJournal();
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Tab Selection
  const initialTab = (searchParams.get("tab") as ViewTab) || "calendar";
  const [activeTab, setActiveTab] = useState<ViewTab>(initialTab);

  // Filters & State for Recent Trades Tab
  const [tradeSearch, setTradeSearch] = useState("");
  const [tradeFilter, setTradeFilter] = useState<"all" | "win" | "loss" | "missing">("all");
  const [chartSubTab, setChartSubTab] = useState<"r" | "pnl" | "drawdown">("pnl");

  const accountTrades = useMemo(() => tradesForAccount(trades, activeAccountId), [trades, activeAccountId]);
  const visibleTrades = useMemo(() => filterTradesByRange(accountTrades, range), [accountTrades, range]);
  const dateTimeFormatter = useMemo(() => createDateTimeFormatter(activeAccount.reportingTimezone), [activeAccount.reportingTimezone]);
  const metrics = calculateJournalMetrics(visibleTrades);
  const series = cumulativeRSeries(visibleTrades);
  const trend = series.map((point) => point.value).slice(-12);

  const completeTrades = visibleTrades.filter((trade) => trade.initialRiskAmount != null && trade.initialRiskAmount > 0).length;
  const missingRiskTrades = visibleTrades.filter((trade) => trade.initialRiskAmount == null || trade.initialRiskAmount <= 0);
  const totalNetPnl = useMemo(() => visibleTrades.reduce((acc, t) => acc + (t.netPnl || 0), 0), [visibleTrades]);

  // Filtered trades for Recent Trades Tab
  const sortedTrades = useMemo(() => {
    return [...visibleTrades].sort((a, b) => b.closedAt.localeCompare(a.closedAt));
  }, [visibleTrades]);

  const filteredTrades = useMemo(() => {
    return sortedTrades.filter((trade) => {
      if (tradeFilter === "win" && (trade.netPnl || 0) <= 0) return false;
      if (tradeFilter === "loss" && (trade.netPnl || 0) >= 0) return false;
      if (tradeFilter === "missing" && trade.initialRiskAmount != null && trade.initialRiskAmount > 0) return false;
      if (tradeSearch) {
        const query = tradeSearch.toLowerCase();
        const matchSymbol = trade.symbol.toLowerCase().includes(query);
        const matchSetup = trade.setup.toLowerCase().includes(query);
        const matchSide = trade.side.toLowerCase().includes(query);
        if (!matchSymbol && !matchSetup && !matchSide) return false;
      }
      return true;
    });
  }, [sortedTrades, tradeFilter, tradeSearch]);

  const [syncStatus, setSyncStatus] = useState("");
  const [isCheckingSync, setIsCheckingSync] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncedAccountIdRef = useRef<string | null>(null);

  // The auto-sync effect needs these, but they get a new identity on most
  // renders — importTrades is rebuilt whenever the trade list changes. Listing
  // them as dependencies restarted the effect mid-flight, and its cleanup then
  // aborted the request that was already running. Held in a ref instead, so the
  // effect can depend only on what should actually retrigger a sync.
  const syncDepsRef = useRef({ importTrades, activeAccount, lang });
  syncDepsRef.current = { importTrades, activeAccount, lang };

  const handleManualSync = async () => {
    if (isSyncing || isCheckingSync) return;
    setIsSyncing(true);
    setSyncStatus(lang === "en" ? "Syncing..." : "กำลังซิงค์...");

    try {
      const accRes = await fetch(`/api/ctrader/accounts?tradingAccountId=${activeAccountId}`);
      const accountsData = await accRes.json();

      if (!accountsData.success || !accountsData.accounts || accountsData.accounts.length === 0) {
        setSyncStatus(lang === "en" ? "Not connected" : "ยังไม่ได้เชื่อมต่อ");
        setTimeout(() => setSyncStatus(""), 4000);
        setIsSyncing(false);
        return;
      }

      const bodyPayload: any = { tradingAccountId: activeAccountId };
      if (activeAccount?.externalAccountId) {
        bodyPayload.cTraderAccountId = activeAccount.externalAccountId;
      }

      const syncRes = await fetch("/api/ctrader/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });
      const data = await syncRes.json();

      if (data.success && data.trades && data.trades.length > 0) {
        const mappedTrades = data.trades.map((t: any) => {
          const id = `ctrader-${activeAccountId}-${t.cTraderAccountId || "0"}-${t.ticket}`;
          const pnl = t.profit || 0;
          const commissionPnl = t.commission || 0;
          const swap = t.swap || 0;
          const grossPnl = t.grossProfit != null ? t.grossProfit : pnl - commissionPnl - swap;
          const defaultRisk = activeAccount?.defaultRiskAmount;
          return {
            id,
            accountId: activeAccountId,
            symbol: t.symbol || "UNKNOWN",
            side: (t.side || "buy").toLowerCase() as "buy" | "sell",
            openedAt: t.openTime,
            closedAt: t.closeTime,
            quantity: t.volume || 1000,
            averageEntry: t.entryPrice || t.exitPrice || 1,
            averageExit: t.exitPrice || t.entryPrice || 1,
            initialStop: null,
            initialRiskAmount: defaultRisk || null,
            grossPnl,
            fees: 0,
            commissionPnl,
            swap,
            netPnl: pnl,
            rMultiple: defaultRisk ? pnl / defaultRisk : null,
            setup: "cTrader Sync",
            timeframe: "Unmapped",
            session: "Unmapped",
            marketCondition: "Unmapped",
            notes: "Auto-synced from cTrader Open API",
          };
        });

        importTrades(mappedTrades);
        setSyncStatus(lang === "en" ? `✓ Synced ${data.trades.length} trades` : `✓ ซิงค์ ${data.trades.length} รายการสำเร็จ`);
      } else {
        setSyncStatus(lang === "en" ? "✓ Up to date" : "✓ ข้อมูลเป็นปัจจุบันแล้ว");
      }
    } catch (err) {
      console.error("Manual sync error:", err);
      setSyncStatus(lang === "en" ? "Sync failed" : "ข้อผิดพลาดซิงค์");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(""), 4000);
    }
  };

  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat(lang === "en" ? "en-US" : "th-TH", {
      style: "currency",
      currency: activeAccount.baseCurrency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }, [lang, activeAccount.baseCurrency]);

  const handleTabChange = (tab: ViewTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const autoSyncRequested = searchParams.get("autoSync") === "true";

  useEffect(() => {
    if (!isHydrated) return;
    if (!activeAccountId) return;

    const isExplicitAutoSync = autoSyncRequested;
    if (syncedAccountIdRef.current === activeAccountId && !isExplicitAutoSync) {
      return;
    }
    syncedAccountIdRef.current = activeAccountId;

    if (isExplicitAutoSync) {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("autoSync");
        window.history.replaceState(null, "", url.toString());
      }
    }
    
    setIsCheckingSync(true);
    setSyncStatus(lang === "en" ? "Checking..." : "กำลังตรวจสอบ...");

    const controller = new AbortController();
    // A cTrader round-trip opens a TLS socket to the broker and can hang; without
    // a ceiling the badge sat on "Checking…" indefinitely with nothing to read.
    let timedOut = false;
    // Set when this effect instance is torn down. The request is deliberately
    // NOT aborted then: React re-invokes effects (StrictMode does it on every
    // mount), and aborting on teardown killed the sync mid-flight while the ref
    // guard stopped the next run from starting a replacement — so no sync ever
    // completed. Let it finish; just stop it touching state afterwards.
    let cancelled = false;
    // The ref guard is claimed before the request starts, so a run that gets
    // torn down early must release it — otherwise the first (discarded) run
    // holds the claim and the run that replaces it returns immediately, leaving
    // the account never synced.
    let completed = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 45000);

    fetch(`/api/ctrader/accounts?tradingAccountId=${activeAccountId}`, { signal: controller.signal })
    .then(res => res.json())
    .then(accountsData => {
      if (cancelled) return;
      if (!accountsData.success || !accountsData.accounts || accountsData.accounts.length === 0) {
        setSyncStatus(lang === "en" ? "Not connected" : "ยังไม่ได้เชื่อมต่อ");
        setIsCheckingSync(false);
        setTimeout(() => setSyncStatus(""), 4000);
        return;
      }

      const { activeAccount } = syncDepsRef.current;
      const bodyPayload: any = { tradingAccountId: activeAccountId };
      if (activeAccount?.externalAccountId) {
        bodyPayload.cTraderAccountId = activeAccount.externalAccountId;
      }
      const body = JSON.stringify(bodyPayload);
      
      return fetch('/api/ctrader/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal
      })
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        const { importTrades, activeAccount, lang } = syncDepsRef.current;
        if (data.success && data.trades && data.trades.length > 0) {
          const mappedTrades = data.trades.map((t: any) => {
            const id = `ctrader-${activeAccountId}-${t.cTraderAccountId || '0'}-${t.ticket}`;
            const pnl = t.profit || 0;           // net (already gross + commission + swap)
            const commissionPnl = t.commission || 0;
            const swap = t.swap || 0;
            const grossPnl = t.grossProfit != null ? t.grossProfit : pnl - commissionPnl - swap;
            const defaultRisk = activeAccount?.defaultRiskAmount;
            return {
              id,
              accountId: activeAccountId,
              symbol: t.symbol || "UNKNOWN",
              side: (t.side || "buy").toLowerCase() as "buy" | "sell",
              openedAt: t.openTime,
              closedAt: t.closeTime,
              quantity: t.volume || 1000,
              averageEntry: t.entryPrice || t.exitPrice || 1,
              averageExit: t.exitPrice || t.entryPrice || 1,
              initialStop: null,
              initialRiskAmount: defaultRisk || null,
              grossPnl,
              fees: 0,
              commissionPnl,
              swap,
              netPnl: pnl,
              rMultiple: defaultRisk ? pnl / defaultRisk : null,
              setup: "cTrader Sync",
              timeframe: "Unmapped",
              session: "Unmapped",
              marketCondition: "Unmapped",
              notes: "Auto-synced from cTrader Open API",
              tags: ["sync", "ctrader"],
              executions: [],
              source: "ctrader-csv" as const,
              externalPositionId: String(t.ticket),
              sourceEvidenceHash: `hash-${id}`
            };
          });
          const result = importTrades(mappedTrades);
          if (result.ok) {
            setSyncStatus(lang === "en" ? `+${data.newTradesCount} trades` : `+${data.newTradesCount} ออเดอร์`);
          } else {
            setSyncStatus(lang === "en" ? "Synced" : "ซิงค์แล้ว");
          }
        } else {
          setSyncStatus(lang === "en" ? "Up to date" : "อัปเดตแล้ว");
        }
        setTimeout(() => setSyncStatus(""), 3000);
      })
      .finally(() => setIsCheckingSync(false));
    })
    .catch(err => {
      if (cancelled) return;
      const { lang } = syncDepsRef.current;
      if (timedOut) {
        setSyncStatus(lang === "en" ? "Sync timed out" : "ซิงค์นานเกินกำหนด");
        setTimeout(() => setSyncStatus(""), 5000);
        return;
      }
      if (err?.name === 'AbortError') {
        // Left the page or switched accounts — clear the badge rather than
        // leaving "Checking…" on screen with no request behind it.
        setSyncStatus("");
        return;
      }
      console.warn("Auto sync failed:", err);
      setSyncStatus(lang === "en" ? "Sync failed" : "ข้อผิดพลาดซิงค์");
      setTimeout(() => setSyncStatus(""), 4000);
    })
    .finally(() => {
      completed = true;
      clearTimeout(timeoutId);
      if (!cancelled) setIsCheckingSync(false);
    });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      if (!completed) syncedAccountIdRef.current = null;
    };
    // Only a hydrated mount, a different account, or an explicit ?autoSync
    // should start a sync. Everything else the effect reads comes from
    // syncDepsRef, so re-renders no longer abort a sync that is in flight.
  }, [isHydrated, activeAccountId, autoSyncRequested]);

  return (
    <>
      <div className="j-page j-overview-page" style={{ padding: "16px 24px 32px" }}>
        {/* Compact Page Head */}
        <header className="j-page-head" style={{ marginBottom: "16px" }}>
          <div>
            <h1 style={{ fontSize: "24px" }}>Trading Journal</h1>
          </div>
          <div className="j-head-controls">
            {syncStatus && (
              <span style={{ fontSize: "12px", padding: "4px 10px", background: "var(--ink)", color: "var(--bg)", borderRadius: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                {(isCheckingSync || isSyncing) && <svg className="spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>}
                {syncStatus}
              </span>
            )}
            <JournalAccountControl ariaLabel="Overview trading account"/>
            <label className="j-select-like j-select-control" style={{ minHeight: "36px" }}>
              <JournalIcon name="calendar" size={14}/>
              <select aria-label="Date range" value={range} onChange={(event) => { const next = event.target.value as JournalRange; setRange(next); replaceJournalUrlQuery(next); }}>
                {JOURNAL_RANGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{lang === "en" ? option.labelEn : option.label}</option>)}
              </select>
              <JournalIcon name="chevron" size={12}/>
            </label>
          </div>
        </header>

        {accountTrades.length === 0 ? (
          <section className="j-panel j-account-empty-state">
            <JournalIcon name="account" size={28}/>
            <span className="j-kicker">{activeAccount.name}</span>
            <h2><T th="บัญชีนี้ยังไม่มี trade" en="This account has no trades yet"/></h2>
            <p>
              <T
                th="ข้อมูลของบัญชีอื่นจะไม่ถูกนำมารวม เลือกบัญชีเดิมด้านบน หรือเริ่มบันทึกข้อมูลของบัญชีนี้"
                en="Other accounts' trades are never mixed in — pick a different account above, or start logging this one"
              />
            </p>
            <div className="j-inline-actions" style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", alignItems: "center", marginTop: "14px" }}>
              <a
                href={`/api/ctrader/auth?tradingAccountId=${activeAccountId}`}
                className="j-primary-button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 20px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#000000",
                  fontWeight: 600,
                  boxShadow: "0 0 16px rgba(245, 158, 11, 0.35)",
                  textDecoration: "none",
                }}
              >
                <JournalIcon name="zap" size={15}/>
                <span>cTrader</span>
              </a>

              <Link href={`${buildJournalHref("/journal/settings", range)}#import`} className="j-secondary-button" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 18px" }}>
                Import cTrader CSV <JournalIcon name="upload" size={14}/>
              </Link>
              <Link href={buildJournalHref("/journal/add", range)} className="j-secondary-button" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 18px" }}>
                Add one trade
              </Link>
            </div>
          </section>
        ) : (
          <>
            {/* Top 4 Metrics Horizontal Bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
              <CompactMetricCard label="Net R" value={formatR(metrics.netR, 1)} sample={`${metrics.sampleSize}/${visibleTrades.length} valid`} values={trend} tone={metrics.netR >= 0 ? "positive" : "negative"}/>
              <CompactMetricCard label="Expectancy" value={formatR(metrics.expectancy)} sample={`${metrics.sampleSize}/${visibleTrades.length} valid`} values={trend.slice(-8)} tone={metrics.expectancy >= 0 ? "positive" : "negative"}/>
              <CompactMetricCard label="Profit Factor" value={metrics.profitFactor?.toFixed(2) ?? "—"} sample={`${metrics.sampleSize}/${visibleTrades.length} valid`} values={[1.2, 1.35, 1.31, 1.48, 1.56, metrics.profitFactor ?? 1.5]} tone="neutral"/>
              <CompactMetricCard label="Win Rate" value={`${Math.round(metrics.winRate * 100)}%`} sample={`${metrics.sampleSize}/${visibleTrades.length} valid`} values={[52, 54, 56, 55, 58, metrics.winRate * 100]} tone="cyan"/>
            </div>

            {/* Quick Section Selector Buttons (Full width view tabs) */}
            <nav className="j-view-tabs" aria-label="Overview Section Tabs">
              <div className="j-view-tabs-left">
                <button
                  type="button"
                  className={`j-view-tab-btn ${activeTab === "calendar" ? "is-active" : ""}`}
                  onClick={() => handleTabChange("calendar")}
                >
                  <JournalIcon name="calendar" size={15}/>
                  <span><T th="P&L Calendar" en="P&L Calendar"/></span>
                </button>

                <button
                  type="button"
                  className={`j-view-tab-btn ${activeTab === "cumulative" ? "is-active" : ""}`}
                  onClick={() => handleTabChange("cumulative")}
                >
                  <JournalIcon name="chart" size={15}/>
                  <span><T th="Cumulative P&L" en="Cumulative P&L"/></span>
                </button>

                <button
                  type="button"
                  className={`j-view-tab-btn ${activeTab === "trades" ? "is-active" : ""}`}
                  onClick={() => handleTabChange("trades")}
                >
                  <JournalIcon name="trades" size={15}/>
                  <span><T th="Recent trades" en="Recent trades"/></span>
                </button>

                <button
                  type="button"
                  className={`j-view-tab-btn ${activeTab === "completeness" ? "is-active" : ""}`}
                  onClick={() => handleTabChange("completeness")}
                >
                  <JournalIcon name="target" size={15}/>
                  <span><T th="Data completeness" en="Data completeness"/></span>
                </button>
              </div>

              <button
                type="button"
                className={`j-view-tab-btn j-view-tab-split ${activeTab === "all" ? "is-active" : ""}`}
                onClick={() => handleTabChange("all")}
              >
                <JournalIcon name="grid" size={15}/>
                <span><T th="Split View" en="Split View"/></span>
              </button>
            </nav>

            {/* TAB 1: FULL SCREEN P&L CALENDAR */}
            {(activeTab === "calendar" || activeTab === "all") && (
              <section className="j-full-view-panel" style={{ marginBottom: activeTab === "all" ? "24px" : "0" }}>
                <div className="j-full-view-head">
                  <div>
                    <h2><T th="P&L Calendar — ปฏิทินกำไรขาดทุนรายวัน" en="P&L Calendar — Daily Performance"/></h2>
                    <p><T th="แสดงผลกำไร/ขาดทุนสุทธิรายวัน พร้อมสัญญาณข่าวแรง USD (คลิกแต่ละวันเพื่อดูออเดอร์ย่อย)" en="Net daily P&L by closed date with high-impact USD economic events. Click any date to view trade details."/></p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", color: totalNetPnl >= 0 ? "var(--j-positive)" : "var(--j-negative)", fontWeight: 600 }}>
                      <T th="รวมสุทธิ: " en="Net Total: "/>
                      {totalNetPnl >= 0 ? "+" : ""}{currencyFormatter.format(totalNetPnl)}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "16px 20px 20px" }}>
                  <PnlCalendar trades={accountTrades} timeZone={activeAccount.reportingTimezone} currency={activeAccount.baseCurrency} range={range}/>
                </div>
              </section>
            )}

            {/* TAB 2: FULL SCREEN CUMULATIVE P&L / R */}
            {(activeTab === "cumulative" || activeTab === "all") && (
              <section className="j-full-view-panel" style={{ marginBottom: activeTab === "all" ? "24px" : "0" }}>
                <div className="j-full-view-head">
                  <div>
                    <h2>
                      {chartSubTab === "pnl" ? <T th="กราฟ Cumulative P&L ($)" en="Cumulative P&L Chart ($)"/> : chartSubTab === "r" ? <T th="กราฟ Cumulative R Multiple" en="Cumulative R Multiple Chart"/> : <T th="กราฟ Drawdown (Underwater)" en="Underwater Drawdown Chart"/>}
                    </h2>
                    <p><T th="แนวโน้มความมั่งคั่งและ Equity Curve ตลอดช่วงเวลาที่เลือก" en="Equity curve and cumulative performance progression over time."/></p>
                  </div>
                  <div className="j-filter-pills">
                    <button
                      type="button"
                      className={`j-filter-pill-btn ${chartSubTab === "pnl" ? "is-active" : ""}`}
                      onClick={() => setChartSubTab("pnl")}
                    >
                      Cumulative P&L ($)
                    </button>
                    <button
                      type="button"
                      className={`j-filter-pill-btn ${chartSubTab === "r" ? "is-active" : ""}`}
                      onClick={() => setChartSubTab("r")}
                    >
                      Cumulative R
                    </button>
                    <button
                      type="button"
                      className={`j-filter-pill-btn ${chartSubTab === "drawdown" ? "is-active" : ""}`}
                      onClick={() => setChartSubTab("drawdown")}
                    >
                      Drawdown
                    </button>
                  </div>
                </div>

                <div style={{ padding: "20px" }}>
                  <div style={{ minHeight: "280px" }}>
                    {chartSubTab === "r" ? (
                      <CumulativeRChart trades={visibleTrades} timeZone={activeAccount.reportingTimezone}/>
                    ) : chartSubTab === "drawdown" ? (
                      <UnderwaterChart trades={visibleTrades} timeZone={activeAccount.reportingTimezone}/>
                    ) : (
                      <CumulativePnlChart trades={visibleTrades} timeZone={activeAccount.reportingTimezone}/>
                    )}
                  </div>

                  {/* Analytical Breakdown Strip */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--j-line)" }}>
                    <div style={{ padding: "10px 14px", background: "var(--j-surface)", borderRadius: "4px", border: "1px solid var(--j-line)" }}>
                      <span style={{ fontSize: "11px", color: "var(--j-muted)" }}><T th="กำไรสุทธิรวม" en="Total Net P&L"/></span>
                      <strong style={{ display: "block", fontSize: "16px", marginTop: "4px", color: totalNetPnl >= 0 ? "var(--j-positive)" : "var(--j-negative)" }}>
                        {totalNetPnl >= 0 ? "+" : ""}{currencyFormatter.format(totalNetPnl)}
                      </strong>
                    </div>
                    <div style={{ padding: "10px 14px", background: "var(--j-surface)", borderRadius: "4px", border: "1px solid var(--j-line)" }}>
                      <span style={{ fontSize: "11px", color: "var(--j-muted)" }}><T th="Expectancy" en="Expectancy"/></span>
                      <strong style={{ display: "block", fontSize: "16px", marginTop: "4px" }}>
                        {formatR(metrics.expectancy)}
                      </strong>
                    </div>
                    <div style={{ padding: "10px 14px", background: "var(--j-surface)", borderRadius: "4px", border: "1px solid var(--j-line)" }}>
                      <span style={{ fontSize: "11px", color: "var(--j-muted)" }}><T th="Profit Factor" en="Profit Factor"/></span>
                      <strong style={{ display: "block", fontSize: "16px", marginTop: "4px" }}>
                        {metrics.profitFactor?.toFixed(2) ?? "—"}
                      </strong>
                    </div>
                    <div style={{ padding: "10px 14px", background: "var(--j-surface)", borderRadius: "4px", border: "1px solid var(--j-line)" }}>
                      <span style={{ fontSize: "11px", color: "var(--j-muted)" }}><T th="Win Rate" en="Win Rate"/></span>
                      <strong style={{ display: "block", fontSize: "16px", marginTop: "4px" }}>
                        {Math.round(metrics.winRate * 100)}%
                      </strong>
                    </div>
                    <div style={{ padding: "10px 14px", background: "var(--j-surface)", borderRadius: "4px", border: "1px solid var(--j-line)" }}>
                      <span style={{ fontSize: "11px", color: "var(--j-muted)" }}><T th="Max Drawdown R" en="Max Drawdown R"/></span>
                      <strong style={{ display: "block", fontSize: "16px", marginTop: "4px", color: "var(--j-negative)" }}>
                        -{metrics.maxDrawdownR.toFixed(1)}R
                      </strong>
                    </div>
                    <div style={{ padding: "10px 14px", background: "var(--j-surface)", borderRadius: "4px", border: "1px solid var(--j-line)" }}>
                      <span style={{ fontSize: "11px", color: "var(--j-muted)" }}><T th="จำนวน Trade ทั้งหมด" en="Total Trades"/></span>
                      <strong style={{ display: "block", fontSize: "16px", marginTop: "4px" }}>
                        {visibleTrades.length}
                      </strong>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* TAB 3: FULL SCREEN RECENT TRADES */}
            {(activeTab === "trades" || activeTab === "all") && (
              <section className="j-full-view-panel" style={{ marginBottom: activeTab === "all" ? "24px" : "0" }}>
                <div className="j-full-view-head">
                  <div>
                    <h2><T th="Recent trades — รายการออเดอร์ล่าสุด" en="Recent trades — Order History"/></h2>
                    <p><T th="รายการออเดอร์แบบเต็มจอ พร้อมการค้นหาและฟิลเตอร์สถานะ" en="Full-width order log with search, filters, and fast inspection."/></p>
                  </div>
                  <Link href={buildJournalHref("/journal/trades", range)} className="j-primary-button" style={{ padding: "6px 14px", fontSize: "12px" }}>
                    <T th="ไปที่หน้า Trades ทั้งหมด" en="View all in Trades"/> <JournalIcon name="arrow-right" size={12}/>
                  </Link>
                </div>

                {/* Toolbar */}
                <div className="j-table-toolbar">
                  <div className="j-search-box">
                    <JournalIcon name="search" size={14}/>
                    <input
                      type="text"
                      placeholder={lang === "en" ? "Search symbol, setup..." : "ค้นหาคู่เงิน, Setup..."}
                      value={tradeSearch}
                      onChange={(e) => setTradeSearch(e.target.value)}
                    />
                    {tradeSearch && (
                      <button type="button" onClick={() => setTradeSearch("")} style={{ background: "none", border: "none", color: "var(--j-muted)", cursor: "pointer", padding: 0 }}>
                        <JournalIcon name="close" size={12}/>
                      </button>
                    )}
                  </div>

                  <div className="j-filter-pills">
                    <button
                      type="button"
                      className={`j-filter-pill-btn ${tradeFilter === "all" ? "is-active" : ""}`}
                      onClick={() => setTradeFilter("all")}
                    >
                      <T th={`ทั้งหมด (${visibleTrades.length})`} en={`All (${visibleTrades.length})`}/>
                    </button>
                    <button
                      type="button"
                      className={`j-filter-pill-btn ${tradeFilter === "win" ? "is-active" : ""}`}
                      onClick={() => setTradeFilter("win")}
                    >
                      <T th="เฉพาะที่กำไร" en="Wins Only"/>
                    </button>
                    <button
                      type="button"
                      className={`j-filter-pill-btn ${tradeFilter === "loss" ? "is-active" : ""}`}
                      onClick={() => setTradeFilter("loss")}
                    >
                      <T th="เฉพาะที่ขาดทุน" en="Losses Only"/>
                    </button>
                    <button
                      type="button"
                      className={`j-filter-pill-btn ${tradeFilter === "missing" ? "is-active" : ""}`}
                      onClick={() => setTradeFilter("missing")}
                    >
                      <T th={`Missing Risk (${missingRiskTrades.length})`} en={`Missing Risk (${missingRiskTrades.length})`}/>
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="j-table-wrap">
                  <table className="j-table">
                    <thead>
                      <tr>
                        <th><T th="วันที่ปิด" en="Close Date"/></th>
                        <th><T th="คู่เงิน" en="Symbol"/></th>
                        <th><T th="ฝั่ง" en="Side"/></th>
                        <th><T th="Setup" en="Setup"/></th>
                        <th><T th="ราคาเข้า / ออก" en="Entry / Exit"/></th>
                        <th><T th="Net P&L" en="Net P&L"/></th>
                        <th><T th="R Multiple" en="R Multiple"/></th>
                        <th><T th="สถานะ Risk" en="Risk Status"/></th>
                        <th aria-label="Action"/>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrades.length === 0 ? (
                        <tr>
                          <td colSpan={9} style={{ textAlign: "center", padding: "32px", color: "var(--j-muted)" }}>
                            <T th="ไม่พบรายการ trade ที่ตรงกับเงื่อนไข" en="No trades matched your filter criteria"/>
                          </td>
                        </tr>
                      ) : (
                        filteredTrades.slice(0, activeTab === "all" ? 8 : 25).map((trade) => (
                          <tr key={trade.id} className="j-v2-tr-row">
                            <td>{dateTimeFormatter.format(new Date(trade.closedAt))}</td>
                            <td>
                              <span className="j-v2-symbol-tag">{trade.symbol}</span>
                            </td>
                            <td>
                              <span className={`j-v2-side-pill ${trade.side === "buy" ? "is-buy" : "is-sell"}`}>
                                {trade.side.toUpperCase()}
                              </span>
                            </td>
                            <td>{trade.setup || "—"}</td>
                            <td style={{ fontFamily: "var(--mono)", fontSize: "12px" }}>
                              {trade.averageEntry ? trade.averageEntry.toFixed(trade.averageEntry > 50 ? 2 : 5) : "—"} → {trade.averageExit ? trade.averageExit.toFixed(trade.averageExit > 50 ? 2 : 5) : "—"}
                            </td>
                            <td className={trade.netPnl > 0 ? "j-positive" : trade.netPnl < 0 ? "j-negative" : ""}>
                              <b>{trade.netPnl > 0 ? "+" : ""}{currencyFormatter.format(trade.netPnl)}</b>
                            </td>
                            <td>
                              {trade.initialRiskAmount != null && trade.initialRiskAmount > 0 && trade.rMultiple != null ? (
                                <span className={`j-v2-r-badge ${trade.rMultiple >= 0 ? "is-positive" : "is-negative"}`}>
                                  {formatR(trade.rMultiple, 1)}
                                </span>
                              ) : (
                                <span style={{ color: "var(--j-muted)", fontSize: "11px" }}>—</span>
                              )}
                            </td>
                            <td>
                              <span className={trade.initialRiskAmount != null && trade.initialRiskAmount > 0 ? "j-data-ok" : "j-data-warn"}>
                                {trade.initialRiskAmount != null && trade.initialRiskAmount > 0 ? "Complete" : "Missing risk"}
                              </span>
                            </td>
                            <td>
                              <Link
                                href={buildJournalHref("/journal/trades", range, { trade: trade.id })}
                                className="j-row-action"
                                aria-label={`Open ${trade.symbol} trade`}
                              >
                                <T th="เปิดดู" en="Open"/>
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ padding: "12px 18px", borderTop: "1px solid var(--j-line)", background: "var(--j-surface)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--j-muted)" }}>
                  <span><T th={`แสดง ${Math.min(filteredTrades.length, activeTab === "all" ? 8 : 25)} จาก ${filteredTrades.length} รายการ`} en={`Showing ${Math.min(filteredTrades.length, activeTab === "all" ? 8 : 25)} of ${filteredTrades.length} trades`}/></span>
                  <Link href={buildJournalHref("/journal/trades", range)} className="j-text-link">
                    <T th="ดูทั้งหมดในหน้า Trades" en="View complete log"/> <JournalIcon name="arrow-right" size={12}/>
                  </Link>
                </div>
              </section>
            )}

            {/* TAB 4: FULL SCREEN DATA COMPLETENESS */}
            {(activeTab === "completeness" || activeTab === "all") && (
              <section className="j-full-view-panel" style={{ marginBottom: "24px" }}>
                <div className="j-full-view-head">
                  <div>
                    <h2><T th="Data completeness — การตรวจสอบความสมบูรณ์ของข้อมูล" en="Data completeness & Quality Audit"/></h2>
                    <p><T th="ข้อมูล Risk และ Setup ช่วยให้การคำนวณ Expectancy และ R-Multiple แม่นยำ 100%" en="Complete risk & setup tags unlock accurate Net R, Expectancy, and Win-Rate analysis."/></p>
                  </div>
                  {missingRiskTrades.length > 0 && (
                    <Link
                      href={buildJournalHref("/journal/trades", range, { quality: "missing" })}
                      className="j-primary-button"
                      style={{ padding: "6px 14px", fontSize: "12px" }}
                    >
                      <T th={`แก้ไข Missing Risk (${missingRiskTrades.length})`} en={`Resolve ${missingRiskTrades.length} Missing Risk`}/> <JournalIcon name="arrow-right" size={12}/>
                    </Link>
                  )}
                </div>

                <div style={{ padding: "24px" }}>
                  {/* Completeness Health Cards Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                    <div style={{ padding: "18px 20px", background: "var(--j-surface)", borderRadius: "6px", border: "1px solid var(--j-line)" }}>
                      <span style={{ fontSize: "12px", color: "var(--j-muted)" }}><T th="ระดับความสมบูรณ์ Risk" en="Risk Data Completeness"/></span>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
                        <strong style={{ fontSize: "32px", color: metrics.dataCompleteness >= 0.8 ? "var(--j-positive)" : "var(--j-gold)" }}>
                          {Math.round(metrics.dataCompleteness * 100)}%
                        </strong>
                        <span style={{ fontSize: "12px", color: "var(--j-muted)" }}>
                          {completeTrades} / {visibleTrades.length} <T th="ออเดอร์" en="trades"/>
                        </span>
                      </div>
                      {/* Visual Progress Bar */}
                      <div style={{ width: "100%", height: "6px", background: "var(--j-soft)", borderRadius: "3px", overflow: "hidden", marginTop: "12px" }}>
                        <div style={{ width: `${Math.round(metrics.dataCompleteness * 100)}%`, height: "100%", background: metrics.dataCompleteness >= 0.8 ? "var(--j-positive)" : "var(--j-gold)", transition: "width 0.4s ease" }}/>
                      </div>
                    </div>

                    <div style={{ padding: "18px 20px", background: "var(--j-surface)", borderRadius: "6px", border: "1px solid var(--j-line)" }}>
                      <span style={{ fontSize: "12px", color: "var(--j-muted)" }}><T th="ออเดอร์ที่มี Risk สมบูรณ์" en="Valid Risk Trades"/></span>
                      <strong style={{ display: "block", fontSize: "32px", marginTop: "8px", color: "var(--j-positive)" }}>
                        {completeTrades}
                      </strong>
                      <span style={{ fontSize: "12px", color: "var(--j-muted)", marginTop: "4px", display: "block" }}>
                        <T th="คำนวณ Expectancy ได้ทันที" en="Ready for Expectancy calc"/>
                      </span>
                    </div>

                    <div style={{ padding: "18px 20px", background: "var(--j-surface)", borderRadius: "6px", border: "1px solid var(--j-line)" }}>
                      <span style={{ fontSize: "12px", color: "var(--j-muted)" }}><T th="ออเดอร์ที่ยังขาด Risk" en="Missing Risk Trades"/></span>
                      <strong style={{ display: "block", fontSize: "32px", marginTop: "8px", color: missingRiskTrades.length > 0 ? "var(--j-negative)" : "var(--j-positive)" }}>
                        {missingRiskTrades.length}
                      </strong>
                      <span style={{ fontSize: "12px", color: "var(--j-muted)", marginTop: "4px", display: "block" }}>
                        {missingRiskTrades.length > 0 ? <T th="ต้องระบุ Initial Risk เพิ่มเติม" en="Requires initial stop / risk amount"/> : <T th="ข้อมูลครบถ้วน 100%" en="All trades fully quantified"/>}
                      </span>
                    </div>
                  </div>

                  {/* Missing Risk Trades Action Table */}
                  {missingRiskTrades.length > 0 ? (
                    <div>
                      <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "var(--j-gold)" }}>⚠️</span>
                        <T th="รายการออเดอร์ที่ยังไม่ได้กำหนด Risk (คลิกแก้ไขเพื่อเปิดการคำนวณ R-Multiple)" en="Trades missing initial risk (click to specify risk for accurate metrics)"/>
                      </h3>
                      <div className="j-table-wrap">
                        <table className="j-table">
                          <thead>
                            <tr>
                              <th><T th="วันที่ปิด" en="Close Date"/></th>
                              <th><T th="คู่เงิน" en="Symbol"/></th>
                              <th><T th="ฝั่ง" en="Side"/></th>
                              <th><T th="Setup" en="Setup"/></th>
                              <th><T th="Net P&L" en="Net P&L"/></th>
                              <th><T th="ข้อเสนอแนะ" en="Recommendation"/></th>
                              <th aria-label="Action"/>
                            </tr>
                          </thead>
                          <tbody>
                            {missingRiskTrades.slice(0, 10).map((trade) => (
                              <tr key={trade.id} className="j-v2-tr-row">
                                <td>{dateTimeFormatter.format(new Date(trade.closedAt))}</td>
                                <td><span className="j-v2-symbol-tag">{trade.symbol}</span></td>
                                <td>
                                  <span className={`j-v2-side-pill ${trade.side === "buy" ? "is-buy" : "is-sell"}`}>
                                    {trade.side.toUpperCase()}
                                  </span>
                                </td>
                                <td>{trade.setup || "—"}</td>
                                <td className={trade.netPnl > 0 ? "j-positive" : trade.netPnl < 0 ? "j-negative" : ""}>
                                  {trade.netPnl > 0 ? "+" : ""}{currencyFormatter.format(trade.netPnl)}
                                </td>
                                <td style={{ fontSize: "12px", color: "var(--j-muted)" }}>
                                  <T th="กำหนด Stop Loss หรือจำนวนเงินที่ยอมเสีย" en="Add initial stop or default risk"/>
                                </td>
                                <td>
                                  <Link
                                    href={buildJournalHref("/journal/trades", range, { trade: trade.id })}
                                    className="j-row-action"
                                  >
                                    <T th="กำหนด Risk" en="Set Risk"/>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "32px", background: "var(--j-surface)", borderRadius: "6px", border: "1px solid var(--j-line)" }}>
                      <span style={{ fontSize: "32px" }}>🎉</span>
                      <h3 style={{ fontSize: "16px", marginTop: "8px" }}><T th="ข้อมูลความเสี่ยงครบถ้วนสมบูรณ์ 100%" en="All trades have complete risk parameters!"/></h3>
                      <p style={{ fontSize: "12px", color: "var(--j-muted)", marginTop: "4px" }}><T th="ค่า Net R, Expectancy และ Profit Factor มีความแม่นยำสูงสุด" en="Metrics such as Net R, Expectancy, and Win Rate are 100% statistically valid."/></p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
