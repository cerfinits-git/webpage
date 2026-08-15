"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { JournalTrade } from "@/lib/journal/types";
import { dailyResults, dayKeyInTimeZone, monthGrid, monthKey, monthSummary, tradesOnDay } from "@/lib/journal/daily";
import { econEventsByDay } from "@/lib/journal/econ-calendar";
import { formatR } from "@/lib/journal/format";
import { buildJournalHref, type JournalRange } from "@/lib/journal/range";
import JournalIcon from "./JournalIcon";
import { T, useLang } from "@/components/site/LangContext";

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const WEEKDAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseKey(key: string) {
  return { year: Number(key.slice(0, 4)), month: Number(key.slice(5, 7)) };
}

function validR(trade: JournalTrade) {
  return trade.initialRiskAmount != null && trade.initialRiskAmount > 0 && trade.rMultiple != null && Number.isFinite(trade.rMultiple);
}

export default function PnlCalendar({
  trades,
  timeZone,
  currency,
  range,
}: {
  trades: JournalTrade[];
  timeZone: string;
  currency: string;
  range: JournalRange;
}) {
  const { lang } = useLang();
  const days = useMemo(() => dailyResults(trades, timeZone), [trades, timeZone]);
  const econDays = useMemo(() => econEventsByDay(timeZone), [timeZone]);

  const initial = useMemo(() => {
    let latest: string | null = null;
    for (const key of days.keys()) if (!latest || key > latest) latest = key;
    return parseKey(latest ?? dayKeyInTimeZone(new Date(), timeZone) ?? new Date().toISOString());
  }, [days, timeZone]);

  const [{ year, month }, setMonth] = useState(initial);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const weeks = useMemo(() => monthGrid(year, month), [year, month]);
  const summary = useMemo(() => monthSummary(days, year, month), [days, year, month]);
  const todayKey = dayKeyInTimeZone(new Date(), timeZone);
  const selectedTrades = useMemo(
    () => (selectedDay ? tradesOnDay(trades, selectedDay, timeZone) : []),
    [trades, selectedDay, timeZone],
  );
  const selectedEvents = selectedDay ? econDays.get(selectedDay) ?? [] : [];

  const compactPnl = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact", maximumFractionDigits: 1 }),
    [currency],
  );
  const fullPnl = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }),
    [currency],
  );
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("th-TH-u-ca-gregory", { month: "long", year: "numeric", timeZone: "UTC" }).format(
        new Date(Date.UTC(year, month - 1, 1)),
      ),
    [year, month],
  );
  const dayLabelFormatter = useMemo(
    () => new Intl.DateTimeFormat("th-TH-u-ca-gregory", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
    [],
  );
  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }),
    [timeZone],
  );

  const shift = (delta: number) => {
    setSelectedDay(null);
    setMonth(({ year: y, month: m }) => {
      const next = new Date(Date.UTC(y, m - 1 + delta, 1));
      return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1 };
    });
  };

  const selectedResult = selectedDay ? days.get(selectedDay) : undefined;
  const selectedLabel = selectedDay
    ? dayLabelFormatter.format(new Date(Date.UTC(year, month - 1, Number(selectedDay.slice(8, 10)))))
    : "";

  return (
    <section className="j-panel j-calendar-panel">
      <div className="j-panel-head">
        <div>
          <h2>P&amp;L Calendar</h2>
          <p>
            <T
              th={`กำไร/ขาดทุนสุทธิรายวัน ตามวันปิด trade (เขตเวลา ${timeZone}) — ทุก trade ของบัญชีนี้`}
              en={`Net daily P&L, by trade close date (${timeZone} timezone) — every trade on this account`}
            /> · <T th="กดวันเพื่อดูรายการ" en="click a day to see its trades"/> · <span className="j-cal-econ-legend">◆</span> <T th="ข่าวแรง USD" en="high-impact USD news"/>
          </p>
        </div>
        <div className="j-cal-month-control">
          <button type="button" className="j-cal-nav" aria-label={lang === "en" ? "Previous month" : "เดือนก่อนหน้า"} onClick={() => shift(-1)}>
            <JournalIcon name="arrow-left" size={16} />
          </button>
          <strong className="j-cal-month-label">{monthLabel}</strong>
          <button type="button" className="j-cal-nav" aria-label={lang === "en" ? "Next month" : "เดือนถัดไป"} onClick={() => shift(1)}>
            <JournalIcon name="arrow-right" size={16} />
          </button>
        </div>
      </div>

      <div className="j-cal-grid" role="grid" aria-label={lang === "en" ? `Daily results for ${monthLabel}` : `ผลรายวันเดือน ${monthLabel}`}>
        {(lang === "en" ? WEEKDAYS_EN : WEEKDAYS).map((label) => (
          <span key={label} className="j-cal-weekday" role="columnheader">
            {label}
          </span>
        ))}
        {weeks.flat().map((day, index) => {
          if (day == null) return <span key={`empty-${index}`} className="j-cal-cell is-empty" aria-hidden="true" />;
          const key = `${monthKey(year, month)}-${String(day).padStart(2, "0")}`;
          const result = days.get(key);
          const events = econDays.get(key);
          const tone = !result || result.trades === 0 ? "" : result.netPnl > 0 ? "is-up" : result.netPnl < 0 ? "is-down" : "is-flat";
          const selected = key === selectedDay;
          const parts: string[] = [];
          if (result) {
            parts.push(`${fullPnl.format(result.netPnl)} · ${result.trades} trade${result.trades > 1 ? "s" : ""} · ${
              result.validR > 0 ? formatR(result.rTotal, 1) : "no valid R"
            }`);
          }
          if (events) parts.push(events.map((event) => (lang === "en" ? event.nameEn : event.nameTh)).join(" · "));
          const title = parts.length > 0 ? `${key} · ${parts.join(" · ")}` : undefined;
          return (
            <button
              key={key}
              type="button"
              role="gridcell"
              disabled={!result && !events}
              aria-pressed={selected}
              aria-label={title ?? `${key} ${lang === "en" ? "no trades" : "ไม่มี trade"}`}
              className={`j-cal-cell ${tone} ${key === todayKey ? "is-today" : ""} ${selected ? "is-selected" : ""}`}
              title={title}
              onClick={() => setSelectedDay(selected ? null : key)}
            >
              <small>{day}</small>
              {events ? <em className="j-cal-econ" aria-hidden="true">◆</em> : null}
              {result ? (
                <>
                  <b>{`${result.netPnl > 0 ? "+" : ""}${compactPnl.format(result.netPnl)}`}</b>
                  <i>{result.trades}</i>
                </>
              ) : null}
            </button>
          );
        })}
      </div>

      {selectedDay && (selectedResult || selectedEvents.length > 0) ? (
        <div className="j-cal-day-detail">
          <div className="j-cal-day-head">
            <div>
              <b>{selectedLabel}</b>
              <span>
                {selectedResult ? (
                  <>
                    {selectedResult.trades} trade{selectedResult.trades > 1 ? "s" : ""} ·{" "}
                    <em className={selectedResult.netPnl > 0 ? "j-positive" : selectedResult.netPnl < 0 ? "j-negative" : ""}>
                      {`${selectedResult.netPnl > 0 ? "+" : ""}${fullPnl.format(selectedResult.netPnl)}`}
                    </em>{" "}
                    · {selectedResult.validR > 0 ? formatR(selectedResult.rTotal, 1) : "no valid R"}
                  </>
                ) : (
                  <><T th="ไม่มี trade · ข่าวแรง" en="No trades · high-impact news"/> {selectedEvents.length} <T th="รายการ" en="events"/></>
                )}
              </span>
            </div>
            <button type="button" className="j-cal-nav" aria-label={lang === "en" ? "Close today's list" : "ปิดรายการวันนี้"} onClick={() => setSelectedDay(null)}>
              <JournalIcon name="close" size={14} />
            </button>
          </div>
          {selectedEvents.length > 0 ? (
            <ul className="j-cal-econ-list">
              {selectedEvents.map((event) => (
                <li key={event.id}>
                  <span className="j-cal-econ-time">{timeFormatter.format(new Date(event.at))}</span>
                  <span className="j-cal-econ-name">{lang === "en" ? event.nameEn : event.nameTh}</span>
                  <span className="j-cal-econ-badge">USD · HIGH{event.tentative ? (lang === "en" ? " · Unconfirmed" : " · รอยืนยัน") : ""}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {selectedTrades.length > 0 ? (
          <div className="j-table-wrap">
            <table className="j-table j-compact-table">
              <thead>
                <tr>
                  <th>Closed</th>
                  <th>Symbol</th>
                  <th>Side</th>
                  <th>Setup</th>
                  <th>Net P&amp;L</th>
                  <th>R</th>
                  <th aria-label="Action" />
                </tr>
              </thead>
              <tbody>
                {selectedTrades.map((trade) => (
                  <tr key={trade.id}>
                    <td>{timeFormatter.format(new Date(trade.closedAt))}</td>
                    <td>
                      <b>{trade.symbol}</b>
                    </td>
                    <td>{trade.side === "buy" ? "Buy" : "Sell"}</td>
                    <td>{trade.setup}</td>
                    <td className={trade.netPnl > 0 ? "j-positive" : trade.netPnl < 0 ? "j-negative" : ""}>
                      {`${trade.netPnl > 0 ? "+" : ""}${fullPnl.format(trade.netPnl)}`}
                    </td>
                    <td className={validR(trade) && (trade.rMultiple ?? 0) >= 0 ? "j-positive" : "j-negative"}>
                      {formatR(validR(trade) ? trade.rMultiple : null, 1)}
                    </td>
                    <td>
                      <Link
                        href={buildJournalHref("/journal/trades", range, { trade: trade.id })}
                        className="j-row-action"
                        aria-label={`Open ${trade.symbol} trade`}
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ) : null}
        </div>
      ) : null}

      <footer className="j-cal-summary">
        <span>
<T th="รวมเดือนนี้" en="Month total"/>:{" "}
          <b className={summary.netPnl > 0 ? "j-positive" : summary.netPnl < 0 ? "j-negative" : ""}>
            {`${summary.netPnl > 0 ? "+" : ""}${fullPnl.format(summary.netPnl)}`}
          </b>
        </span>
        <span>{summary.trades} trades</span>
        <span>{summary.validR > 0 ? `${formatR(summary.rTotal, 1)} (${summary.validR} valid R)` : "no valid R"}</span>
      </footer>
    </section>
  );
}
