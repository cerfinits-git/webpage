"use client";

import Link from "next/link";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { createCurrencyFormatter, createDateTimeFormatter, formatPrice, formatR } from "@/lib/journal/format";
import { tradesForAccount } from "@/lib/journal/accounts";
import {
  DEFAULT_JOURNAL_RANGE,
  buildJournalHref,
  filterTradesByRange,
  JOURNAL_RANGE_OPTIONS,
  parseJournalQuality,
  replaceJournalUrlQuery,
  type JournalRange,
} from "@/lib/journal/range";
import { useJournal } from "./JournalProvider";
import JournalIcon from "./JournalIcon";
import JournalAccountControl from "./JournalAccountControl";
import TradeEditor from "./TradeEditor";
import { T, useLang } from "@/components/site/LangContext";

function getTradeSource(trade: any): "sync" | "csv" | "manual" {
  if (trade.setup === "cTrader Sync" || (trade.tags && trade.tags.includes("sync")) || (trade.id && String(trade.id).startsWith("ctrader-"))) {
    return "sync";
  }
  if (trade.source === "ctrader-csv" || (trade.tags && trade.tags.includes("csv"))) {
    return "csv";
  }
  return "manual";
}

function getVisiblePages(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function TradesClient() {
  const { trades, activeAccount, activeAccountId, canUndo, undoLabel, undoLastChange, range, setRange } = useJournal();
  const { lang } = useLang();
  const [search, setSearch] = useState("");
  const [setup, setSetup] = useState("all");
  const [side, setSide] = useState("all");
  const [result, setResult] = useState("all");
  const [dataQuality, setDataQuality] = useState("all");
  const [tradeSourceFilter, setTradeSourceFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [undoMessage, setUndoMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const deepLinkApplied = useRef(false);
  const [queryReady, setQueryReady] = useState(false);
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const accountTrades = useMemo(() => tradesForAccount(trades, activeAccountId), [trades, activeAccountId]);
  const setups = useMemo(() => [...new Set(accountTrades.map((trade) => trade.setup))].sort(), [accountTrades]);
  const dateTimeFormatter = useMemo(() => createDateTimeFormatter(activeAccount.reportingTimezone), [activeAccount.reportingTimezone]);
  const currencyFormatter = useMemo(() => createCurrencyFormatter(activeAccount.baseCurrency), [activeAccount.baseCurrency]);

  const filtered = useMemo(() => [...filterTradesByRange(accountTrades, range)]
    .filter((trade) => !deferredSearch || `${trade.symbol} ${trade.setup}`.toLowerCase().includes(deferredSearch))
    .filter((trade) => setup === "all" || trade.setup === setup)
    .filter((trade) => side === "all" || trade.side === side)
    .filter((trade) => result === "all" || (trade.initialRiskAmount != null && trade.initialRiskAmount > 0 && trade.rMultiple != null && (result === "win" ? trade.rMultiple > 0 : trade.rMultiple <= 0)))
    .filter((trade) => dataQuality === "all" || (dataQuality === "complete" ? trade.initialRiskAmount != null && trade.initialRiskAmount > 0 : trade.initialRiskAmount == null || trade.initialRiskAmount <= 0))
    .filter((trade) => tradeSourceFilter === "all" || getTradeSource(trade) === tradeSourceFilter)
    .sort((a, b) => b.openedAt.localeCompare(a.openedAt)), [accountTrades, range, deferredSearch, setup, side, result, dataQuality, tradeSourceFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(pageStart, pageStart + pageSize);
  const pages = getVisiblePages(currentPage, pageCount);
  const missingRiskCount = accountTrades.filter((trade) => trade.initialRiskAmount == null || trade.initialRiskAmount <= 0).length;
  const selectedTrade = selected == null ? null : accountTrades.find((trade) => trade.id === selected) ?? null;
  const unresolvedIds = filtered
    .filter((trade) => trade.initialRiskAmount == null || trade.initialRiskAmount <= 0)
    .map((trade) => trade.id);
  const selectedUnresolvedIndex = selected == null ? -1 : unresolvedIds.indexOf(selected);
  const nextUnresolvedId = unresolvedIds.find((id, index) => id !== selected && (selectedUnresolvedIndex < 0 || index > selectedUnresolvedIndex))
    ?? unresolvedIds.find((id) => id !== selected)
    ?? null;
  useEffect(() => {
    if (deepLinkApplied.current) return;
    deepLinkApplied.current = true;
    const params = new URLSearchParams(window.location.search);
    const quality = parseJournalQuality(params.get("quality"));
    const tradeId = params.get("trade");
    setDataQuality(quality);
    if (tradeId && accountTrades.some((trade) => trade.id === tradeId)) {
      setSelected(tradeId);
    } else if (tradeId) {
      replaceJournalUrlQuery(range, { trade: null });
    }
    setQueryReady(true);
  }, [range, accountTrades]);

  useEffect(() => {
    if (!queryReady) return;
    replaceJournalUrlQuery(range, {
      quality: dataQuality === "missing" ? "missing" : null,
      trade: selected,
    });
  }, [dataQuality, queryReady, range, selected]);

  const selectTrade = useCallback((id: string | null) => {
    setSelected(id);
    replaceJournalUrlQuery(range, { trade: id });
  }, [range]);
  const closeEditor = useCallback(() => selectTrade(null), [selectTrade]);
  const finishEditor = useCallback((nextId: string | null) => selectTrade(nextId), [selectTrade]);

  const resetView = () => {
    setPage(1);
    closeEditor();
  };

  const changeRange = (next: JournalRange) => {
    setRange(next);
    setPage(1);
    setSelected(null);
    replaceJournalUrlQuery(next, { trade: null });
  };

  const clearFilters = () => {
    setSearch("");
    setSetup("all");
    setSide("all");
    setResult("all");
    setDataQuality("all");
    setTradeSourceFilter("all");
    setRange(DEFAULT_JOURNAL_RANGE);
    setPage(1);
    setSelected(null);
    replaceJournalUrlQuery(DEFAULT_JOURNAL_RANGE, { quality: null, trade: null });
  };

  const summaryStats = useMemo(() => {
    let totalPnl = 0;
    let wins = 0;
    let losses = 0;
    let totalR = 0;
    let rCount = 0;

    for (const t of filtered) {
      totalPnl += t.netPnl || 0;
      if (t.netPnl > 0) wins++;
      else if (t.netPnl < 0) losses++;

      if (t.initialRiskAmount && t.initialRiskAmount > 0 && t.rMultiple != null) {
        totalR += t.rMultiple;
        rCount++;
      }
    }

    const totalTrades = filtered.length;
    const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : "0.0";
    const avgR = rCount > 0 ? (totalR / rCount).toFixed(2) : "0.00";

    return { totalPnl, wins, losses, totalTrades, winRate, avgR };
  }, [filtered]);

  return (
    <div className="j-page j-trades-page">
      <header className="j-page-head j-trades-head">
        <div>
          <h1>Trades Log</h1>
          <p><T th="ประวัติและบันทึกการเทรดแบบ Round-trip รวมทุก Executions ไว้ในไม้เดียว" en="Your round-trip trade history — every execution rolled into one trade"/></p>
        </div>
        <div className="j-head-controls">
          <label className="j-search">
            <JournalIcon name="search"/>
            <input value={search} onChange={(event) => { setSearch(event.target.value); resetView(); }} placeholder={lang === "en" ? "Search symbol or setup..." : "ค้นหา symbol หรือ setup..."}/>
          </label>
          <label className="j-select-like j-select-control">
            <JournalIcon name="calendar"/>
            <select aria-label="Date range" value={range} onChange={(event) => changeRange(event.target.value as JournalRange)}>
              {JOURNAL_RANGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{lang === "en" ? option.labelEn : option.label}</option>)}
            </select>
            <JournalIcon name="chevron"/>
          </label>
          <JournalAccountControl ariaLabel="Trades trading account" onChanged={() => { setPage(1); setSelected(null); }}/>
          <Link href={buildJournalHref("/journal/add", range)} className="j-primary-button j-v2-glow-btn">
            + Add trade <JournalIcon name="plus"/>
          </Link>
        </div>
      </header>

      {/* Undo lives where the destructive actions are. Deleting or editing a
          trade happens on this page, so the way back has to be here too — it
          used to exist only in Settings, which nobody would think to open. */}
      {canUndo ? (
        <div className="j-undo-bar" role="status">
          <span>
            <T th="ย้อนกลับได้: " en="Undo available: "/>
            <b>{undoLabel}</b>
          </span>
          <button
            type="button"
            className="j-undo-btn"
            onClick={() => {
              const result = undoLastChange();
              setUndoMessage(result.message);
              setSelected(null);
              setTimeout(() => setUndoMessage(""), 4000);
            }}
          >
            <T th="เลิกทำ" en="Undo"/>
          </button>
        </div>
      ) : null}
      {undoMessage ? <p className="j-undo-message" role="status">{undoMessage}</p> : null}

      {/* KPI Summary Bar */}
      <section className="j-v2-kpi-bar" aria-label="Filtered performance summary">
        <div className="j-v2-kpi-card">
          <span className="j-v2-kpi-label">Total net P&amp;L</span>
          <strong className={`j-v2-kpi-value ${summaryStats.totalPnl >= 0 ? "j-positive" : "j-negative"}`}>
            {currencyFormatter.format(summaryStats.totalPnl)}
          </strong>
          <small className="j-v2-kpi-sub">
            <T th={`จาก ${summaryStats.totalTrades} รายการ`} en={`from ${summaryStats.totalTrades} trades`}/>
          </small>
        </div>

        <div className="j-v2-kpi-card">
          <span className="j-v2-kpi-label">Win rate</span>
          <strong className={`j-v2-kpi-value ${Number(summaryStats.winRate) >= 50 ? "j-positive" : "j-gold"}`}>
            {summaryStats.winRate}%
          </strong>
          <small className="j-v2-kpi-sub">
            <span className="j-positive">{summaryStats.wins} W</span> / <span className="j-negative">{summaryStats.losses} L</span>
          </small>
        </div>

        <div className="j-v2-kpi-card">
          <span className="j-v2-kpi-label">Avg R-multiple</span>
          <strong className={`j-v2-kpi-value ${Number(summaryStats.avgR) >= 0 ? "j-positive" : "j-negative"}`}>
            {summaryStats.avgR} R
          </strong>
          <small className="j-v2-kpi-sub"><T th="เฉลี่ยต่อการเทรด" en="average per trade"/></small>
        </div>

        <div className="j-v2-kpi-card">
          <span className="j-v2-kpi-label">Data completeness</span>
          <strong className={`j-v2-kpi-value ${missingRiskCount === 0 ? "j-positive" : "j-gold"}`}>
            {missingRiskCount === 0 ? "100%" : `${accountTrades.length - missingRiskCount}/${accountTrades.length}`}
          </strong>
          <small className="j-v2-kpi-sub">
            {missingRiskCount === 0
              ? <T th="ข้อมูล Initial Risk ครบ" en="Initial risk fully recorded"/>
              : <T th={`${missingRiskCount} ไม้ต้องระบุ Risk`} en={`${missingRiskCount} trades need risk`}/>}
          </small>
        </div>
      </section>

      {/* Filter Rail */}
      <section className="j-filter-rail j-v2-filter-rail" aria-label="Trade filters">
        <label>
          <span>Source</span>
          <select value={tradeSourceFilter} onChange={(event) => { setTradeSourceFilter(event.target.value); resetView(); }}>
            <option value="all">{lang === "en" ? "All Sources" : "ทั้งหมด (All Sources)"}</option>
            <option value="sync">cTrader Sync</option>
            <option value="csv">CSV Import</option>
            <option value="manual">Manual Entry</option>
          </select>
        </label>
        <label>
          <span>Setup</span>
          <select value={setup} onChange={(event) => { setSetup(event.target.value); resetView(); }}>
            <option value="all">{lang === "en" ? "All Setups" : "ทั้งหมด (All Setups)"}</option>
            {setups.map((name) => <option key={name}>{name}</option>)}
          </select>
        </label>
        <label>
          <span>Side</span>
          <select value={side} onChange={(event) => { setSide(event.target.value); resetView(); }}>
            <option value="all">{lang === "en" ? "All Sides" : "ทั้งหมด (All Sides)"}</option>
            <option value="buy">Buy (Long)</option>
            <option value="sell">Sell (Short)</option>
          </select>
        </label>
        <label>
          <span>Result</span>
          <select value={result} onChange={(event) => { setResult(event.target.value); resetView(); }}>
            <option value="all">{lang === "en" ? "All (Win & Loss)" : "ทั้งหมด (Win & Loss)"}</option>
            <option value="win">Win Only</option>
            <option value="loss">Loss Only</option>
          </select>
        </label>
        <label>
          <span>Data quality</span>
          <select value={dataQuality} onChange={(event) => { setDataQuality(event.target.value); resetView(); }}>
            <option value="all">{lang === "en" ? "All" : "ทั้งหมด"}</option>
            <option value="complete">{lang === "en" ? "Complete (has risk)" : "Complete (มี Risk)"}</option>
            <option value="missing">{lang === "en" ? "Missing risk (needs risk)" : "Missing risk (รอระบุ Risk)"}</option>
          </select>
        </label>
        <button className="j-clear-button" onClick={clearFilters}>
          <JournalIcon name="close"/> Clear filters
        </button>
      </section>

      {/* Import Health status banner */}
      <div className="j-import-health j-v2-health-bar">
        <span>
          <b>Data Status:</b>{" "}
          {missingRiskCount === 0
            ? <T th="ข้อมูลครบถ้วนพร้อมประมวลผล R-Multiple" en="Data complete — ready to compute R-multiple"/>
            : <span><T th={`พบ ${missingRiskCount} ไม้ที่ไม่ได้ระบุ Initial Risk (ส่งผลต่อการคำนวณ Expectancy)`} en={`${missingRiskCount} trades have no initial risk recorded (this affects the expectancy calculation)`}/></span>}
        </span>
        {missingRiskCount > 0 ? (
          <button onClick={() => { setDataQuality(dataQuality === "missing" ? "all" : "missing"); setRange("all"); resetView(); }}>
            {dataQuality === "missing" ? "Show all trades" : "Show missing risk"} <JournalIcon name="arrow-right"/>
          </button>
        ) : (
          <Link href={`${buildJournalHref("/journal/settings", range)}#import`}>
            <T th="ตั้งค่าบัญชี / อิมพอร์ตข้อมูล" en="Account settings / import data"/> <JournalIcon name="arrow-right"/>
          </Link>
        )}
      </div>

      {/* Trade Table */}
      <div className="j-table-wrap j-trades-table-wrap j-v2-table-card">
        <table className="j-table j-trades-table">
          <thead>
            <tr>
              <th aria-label="Open details"/>
              <th>Opened ↓</th>
              <th>Symbol</th>
              <th>Side</th>
              <th>Setup</th>
              <th>Entry → Exit</th>
              <th>Net P&amp;L</th>
              <th>R-Multiple</th>
              <th>Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((trade) => {
              const src = getTradeSource(trade);
              const isWin = trade.netPnl > 0;
              const isLoss = trade.netPnl < 0;

              return (
                <tr 
                  key={trade.id} 
                  className={`j-v2-tr-row ${selected === trade.id ? "is-selected" : ""}`} 
                  onClick={() => setSelected(trade.id)} 
                  tabIndex={0} 
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(trade.id); } }}
                >
                  <td>
                    <button type="button" className="j-row-open" onClick={(event) => { event.stopPropagation(); setSelected(trade.id); }} aria-label={lang === "en" ? `Open details ${trade.symbol}` : `เปิดรายละเอียด ${trade.symbol}`}>
                      <JournalIcon name="chevron"/>
                    </button>
                  </td>
                  <td style={{ color: "var(--j-muted)", fontSize: "11px" }}>
                    {dateTimeFormatter.format(new Date(trade.openedAt))}
                  </td>
                  <td>
                    <b className="j-v2-symbol-tag">{trade.symbol}</b>
                  </td>
                  <td>
                    <span className={`j-v2-side-pill ${trade.side === "buy" ? "is-buy" : "is-sell"}`}>
                      {trade.side === "buy" ? "BUY" : "SELL"}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{trade.setup || "-"}</td>
                  <td className="j-number-cell" style={{ color: "var(--j-muted)" }}>
                    {formatPrice(trade.averageEntry)} <span style={{ opacity: 0.4 }}>→</span> {formatPrice(trade.averageExit)}
                  </td>
                  <td>
                    <strong className={`j-v2-pnl-text ${isWin ? "j-positive" : isLoss ? "j-negative" : ""}`}>
                      {currencyFormatter.format(trade.netPnl)}
                    </strong>
                  </td>
                  <td>
                    <span className={`j-v2-r-badge ${trade.initialRiskAmount != null && trade.initialRiskAmount > 0 && (trade.rMultiple ?? 0) >= 0 ? "is-positive" : (trade.rMultiple ?? 0) < 0 ? "is-negative" : "is-neutral"}`}>
                      {formatR(trade.initialRiskAmount != null && trade.initialRiskAmount > 0 ? trade.rMultiple : null, 1)}
                    </span>
                  </td>
                  <td>
                    {src === "sync" ? (
                      <span className="j-v2-source-tag is-sync">cTrader</span>
                    ) : src === "csv" ? (
                      <span className="j-v2-source-tag is-csv">CSV</span>
                    ) : (
                      <span className="j-v2-source-tag is-manual">Manual</span>
                    )}
                  </td>
                  <td>
                    <span className={trade.initialRiskAmount != null && trade.initialRiskAmount > 0 ? "j-data-ok" : "j-data-warn"}>
                      {trade.initialRiskAmount != null && trade.initialRiskAmount > 0 ? "Complete" : "Risk missing"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <div className="j-empty-state">
            <h2><T th="ไม่พบรายการเทรด" en="No trades found"/></h2>
            <p><T th="ลองเปลี่ยนคำค้นหาหรือกด Clear filters เพื่อแสดงรายการทั้งหมด" en="Try a different search, or press Clear filters to see everything"/></p>
          </div>
        ) : null}
      </div>

      {/* Pagination Footer */}
      <footer className="j-table-footer j-v2-footer">
        <span>
          {filtered.length === 0
            ? "0 trades"
            : lang === "en"
              ? `Showing ${pageStart + 1}–${Math.min(pageStart + pageSize, filtered.length)} of ${filtered.length} trades`
              : `แสดง ${pageStart + 1}–${Math.min(pageStart + pageSize, filtered.length)} จากทั้งหมด ${filtered.length} ไม้`}
        </span>
        <div className="j-pagination">
          <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
            <JournalIcon name="arrow-left"/>
          </button>
          {pages.map((item, idx) => typeof item === "string" ? (
            <span key={`ellipsis-${idx}`} style={{ padding: '0 6px', opacity: 0.5, userSelect: 'none', display: 'inline-flex', alignItems: 'center' }}>...</span>
          ) : (
            <button key={item} aria-label={`Page ${item}`} className={item === currentPage ? "is-current" : ""} onClick={() => { setPage(item); setSelected(null); }}>
              {item}
            </button>
          ))}
          <button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>
            <JournalIcon name="arrow-right"/>
          </button>
        </div>
        <label className="j-page-size">
          <span>Rows</span>
          <select aria-label="Rows per page" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); resetView(); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
          </select>
        </label>
      </footer>

      {selectedTrade ? (
        <TradeEditor 
          key={selectedTrade.id} 
          trade={selectedTrade} 
          nextUnresolvedId={nextUnresolvedId} 
          onClose={closeEditor} 
          onSaved={finishEditor} 
          onDeleted={closeEditor}
        />
      ) : null}
    </div>
  );
}

