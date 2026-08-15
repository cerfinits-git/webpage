"use client";

import { useEffect, useRef, useState } from "react";
import type { JournalTrade, TradeSide } from "@/lib/journal/types";
import { validateJournalTrade, withDerivedTradeValues } from "@/lib/journal/validation";
import { dateTimeInputInTimeZone, zonedDateTimeInputToIso } from "@/lib/journal/timezone";
import JournalIcon from "./JournalIcon";
import { useJournal } from "./JournalProvider";
import { T, useLang } from "@/components/site/LangContext";

interface TradeEditorProps {
  trade: JournalTrade;
  nextUnresolvedId: string | null;
  onClose: () => void;
  onSaved: (nextId: string | null) => void;
  onDeleted: () => void;
}

export default function TradeEditor({ trade, nextUnresolvedId, onClose, onSaved, onDeleted }: TradeEditorProps) {
  const { activeAccount, updateTrade, deleteTrade, isReadOnly } = useJournal();
  const { lang } = useLang();
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [symbol, setSymbol] = useState(trade.symbol);
  const [side, setSide] = useState<TradeSide>(trade.side);
  const [openedAt, setOpenedAt] = useState(dateTimeInputInTimeZone(trade.openedAt, activeAccount.reportingTimezone));
  const [closedAt, setClosedAt] = useState(dateTimeInputInTimeZone(trade.closedAt, activeAccount.reportingTimezone));
  const [quantity, setQuantity] = useState(String(trade.quantity));
  const [entry, setEntry] = useState(String(trade.averageEntry));
  const [exit, setExit] = useState(String(trade.averageExit));
  const [stop, setStop] = useState(trade.initialStop == null ? "" : String(trade.initialStop));
  const [risk, setRisk] = useState(trade.initialRiskAmount == null ? "" : String(trade.initialRiskAmount));
  const [netPnl, setNetPnl] = useState(String(trade.netPnl));
  const [setup, setSetup] = useState(trade.setup);
  const [timeframe, setTimeframe] = useState(trade.timeframe);
  const [notes, setNotes] = useState(trade.notes);
  const [error, setError] = useState("");

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const handleDialogKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? []).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleDialogKey);
    return () => {
      window.removeEventListener("keydown", handleDialogKey);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, []);

  const save = (goToNext: boolean) => {
    const openedIso = zonedDateTimeInputToIso(openedAt, activeAccount.reportingTimezone);
    const closedIso = zonedDateTimeInputToIso(closedAt, activeAccount.reportingTimezone);
    if (!openedIso || !closedIso) {
      setError(
        lang === "en"
          ? `Date/time must exist in timezone ${activeAccount.reportingTimezone}`
          : `วันเวลาต้องมีอยู่จริงใน timezone ${activeAccount.reportingTimezone}`,
      );
      return;
    }
    const candidate = withDerivedTradeValues({
      ...trade,
      symbol,
      side,
      openedAt: openedIso,
      closedAt: closedIso,
      quantity: Number(quantity),
      averageEntry: Number(entry),
      averageExit: Number(exit),
      initialStop: stop.trim() === "" ? null : Number(stop),
      initialRiskAmount: risk.trim() === "" ? null : Number(risk),
      netPnl: Number(netPnl),
      setup,
      timeframe,
      notes,
    });
    const issues = validateJournalTrade(candidate, { requireRisk: true });
    if (issues.length > 0) {
      setError(issues[0].message);
      return;
    }
    setError("");
    const result = updateTrade(candidate);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onSaved(goToNext ? nextUnresolvedId : null);
  };

  const remove = () => {
    const result = deleteTrade(trade.id);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onDeleted();
  };

  return (
    <div className="j-inspector-layer" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside ref={dialogRef} className="j-trade-inspector" role="dialog" aria-modal="true" aria-labelledby="trade-inspector-title">
        <header className="j-inspector-head">
          <div>
            <span className="j-kicker">TRADE DETAILS</span>
            <h2 id="trade-inspector-title">{trade.symbol}</h2>
            <p>{trade.source === "ctrader-csv" ? "Imported from cTrader" : "Manual trade"}</p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={lang === "en" ? "Close trade details" : "ปิดรายละเอียด trade"}><JournalIcon name="close"/></button>
        </header>

        <form className="j-inspector-form" onSubmit={(event) => { event.preventDefault(); save(false); }}>
          <div className="j-inspector-grid">
            <label className="j-field"><span>Symbol</span><input value={symbol} onChange={(event) => setSymbol(event.target.value)} disabled={isReadOnly}/></label>
            <div className="j-field"><span>Side</span><div className="j-side-control"><button type="button" className={side === "buy" ? "is-active" : ""} onClick={() => setSide("buy")} disabled={isReadOnly}>Buy</button><button type="button" className={side === "sell" ? "is-active" : ""} onClick={() => setSide("sell")} disabled={isReadOnly}>Sell</button></div></div>
            <label className="j-field j-span-2"><span>Opened · {activeAccount.reportingTimezone}</span><input type="datetime-local" value={openedAt} onChange={(event) => setOpenedAt(event.target.value)} disabled={isReadOnly}/></label>
            <label className="j-field j-span-2"><span>Closed · {activeAccount.reportingTimezone}</span><input type="datetime-local" value={closedAt} onChange={(event) => setClosedAt(event.target.value)} disabled={isReadOnly}/></label>
            <label className="j-field"><span>Quantity</span><input type="number" step="any" value={quantity} onChange={(event) => setQuantity(event.target.value)} disabled={isReadOnly}/></label>
            <label className="j-field"><span>Entry</span><input type="number" step="any" value={entry} onChange={(event) => setEntry(event.target.value)} disabled={isReadOnly}/></label>
            <label className="j-field"><span>Exit</span><input type="number" step="any" value={exit} onChange={(event) => setExit(event.target.value)} disabled={isReadOnly}/></label>
            <label className="j-field"><span>Initial stop</span><input type="number" step="any" value={stop} onChange={(event) => setStop(event.target.value)} disabled={isReadOnly}/></label>
            <label className="j-field j-span-2"><span>Initial risk ({activeAccount.baseCurrency})</span><input type="number" step="any" value={risk} onChange={(event) => setRisk(event.target.value)} disabled={isReadOnly}/><small><T th="จำเป็นสำหรับ R metrics" en="Required for R metrics"/></small></label>
            <label className="j-field j-span-2"><span>Net P&amp;L ({activeAccount.baseCurrency})</span><input type="number" step="any" value={netPnl} onChange={(event) => setNetPnl(event.target.value)} disabled={isReadOnly}/></label>
            <label className="j-field"><span>Setup</span><input value={setup} onChange={(event) => setSetup(event.target.value)} disabled={isReadOnly}/></label>
            <label className="j-field"><span>Timeframe</span><input value={timeframe} onChange={(event) => setTimeframe(event.target.value)} disabled={isReadOnly}/></label>
            <label className="j-field j-span-2"><span>Notes</span><textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} disabled={isReadOnly}/></label>
          </div>

          {error ? <p className="j-form-error" role="alert">{error}</p> : null}
          {isReadOnly ? <p className="j-form-error" role="alert"><T th="Storage อยู่ใน recovery mode จึงยังแก้ข้อมูลไม่ได้" en="Storage is in recovery mode, so edits aren't possible yet"/></p> : null}

          <div className="j-inspector-actions">
            <button className="j-primary-button" type="submit" disabled={isReadOnly}>Save changes</button>
            {nextUnresolvedId ? <button className="j-secondary-button" type="button" onClick={() => save(true)} disabled={isReadOnly}>Save &amp; next</button> : null}
            <button className="j-danger-button" type="button" onClick={remove} disabled={isReadOnly}>Delete trade</button>
          </div>
        </form>
      </aside>
    </div>
  );
}
