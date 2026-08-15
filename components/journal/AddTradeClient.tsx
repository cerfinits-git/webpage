"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  draftFieldForTradeIssue,
  isAdvancedDraftField,
  type JournalDraftFocusField,
} from "@/lib/journal/add-trade-form";
import {
  JOURNAL_DRAFT_KEY,
  createEmptyJournalDraft,
  journalDraftStorageKey,
  parseJournalDraft,
  serializeJournalDraft,
  type JournalTradeDraft,
} from "@/lib/journal/draft";
import { createCurrencyFormatter } from "@/lib/journal/format";
import { buildJournalHref } from "@/lib/journal/range";
import { zonedDateTimeInputToIso } from "@/lib/journal/timezone";
import type { JournalTrade } from "@/lib/journal/types";
import { validateJournalTrade, withDerivedTradeValues } from "@/lib/journal/validation";
import JournalIcon from "./JournalIcon";
import JournalAccountControl from "./JournalAccountControl";
import { useJournal } from "./JournalProvider";
import { T, useLang } from "@/components/site/LangContext";

type DraftStatus = "loading" | "saving" | "saved" | "restored" | "error";

function numberOrNaN(value: string) {
  return value.trim() === "" ? Number.NaN : Number(value);
}

function optionalNumber(value: string) {
  return value.trim() === "" ? null : Number(value);
}

export default function AddTradeClient() {
  const router = useRouter();
  const { lang } = useLang();
  const { addTrade, activeAccount, activeAccountId, isReadOnly, range } = useJournal();
  const [draft, setDraft] = useState<JournalTradeDraft>(() => createEmptyJournalDraft(
    new Date(),
    activeAccount.reportingTimezone,
    activeAccountId,
    activeAccount.baseCurrency,
  ));
  const [draftAccountId, setDraftAccountId] = useState(activeAccountId);
  const [draftReady, setDraftReady] = useState(false);
  const [draftStatus, setDraftStatus] = useState<DraftStatus>("loading");
  const [corruptDraftRaw, setCorruptDraftRaw] = useState<string | null>(null);
  const [contextNotice, setContextNotice] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<JournalDraftFocusField | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    setDraftReady(false);
    setDraftStatus("loading");
    setCorruptDraftRaw(null);
    setContextNotice(null);
    setError("");
    setErrorField(null);
    const context = {
      accountId: activeAccountId,
      reportingTimezone: activeAccount.reportingTimezone,
      baseCurrency: activeAccount.baseCurrency,
    };
    const scopedKey = journalDraftStorageKey(activeAccountId);
    try {
      const scopedRaw = window.localStorage.getItem(scopedKey);
      const legacyRaw = scopedRaw == null ? window.localStorage.getItem(JOURNAL_DRAFT_KEY) : null;
      const loaded = parseJournalDraft(scopedRaw ?? legacyRaw, context);
      if (loaded.kind === "ready") {
        setDraft(loaded.draft);
        setDraftAccountId(activeAccountId);
        setDraftStatus("restored");
        if (loaded.contextChanges?.timezone) {
          setContextNotice(
            lang === "en"
              ? `Time adjusted ${loaded.contextChanges.timezone.from} → ${loaded.contextChanges.timezone.to}, keeping the original instant`
              : `ปรับเวลา ${loaded.contextChanges.timezone.from} → ${loaded.contextChanges.timezone.to} โดยรักษา instant เดิมแล้ว`,
          );
        }
        if (legacyRaw != null || loaded.migratedFrom || loaded.contextChanges) {
          window.localStorage.setItem(scopedKey, serializeJournalDraft(loaded.draft));
          const verified = parseJournalDraft(window.localStorage.getItem(scopedKey), context);
          if (verified.kind !== "ready") throw new Error("Draft migration verification failed");
          if (legacyRaw != null) window.localStorage.removeItem(JOURNAL_DRAFT_KEY);
        }
      } else if (loaded.kind === "error") {
        setCorruptDraftRaw(loaded.raw);
        setDraft(createEmptyJournalDraft(new Date(), activeAccount.reportingTimezone, activeAccountId, activeAccount.baseCurrency));
        setDraftAccountId(activeAccountId);
        setDraftStatus("error");
      } else {
        setDraft(createEmptyJournalDraft(new Date(), activeAccount.reportingTimezone, activeAccountId, activeAccount.baseCurrency));
        setDraftAccountId(activeAccountId);
        setDraftStatus("saved");
      }
    } catch {
      setDraftStatus("error");
    } finally {
      setDraftReady(true);
    }
  }, [activeAccount.baseCurrency, activeAccount.reportingTimezone, activeAccountId]);

  useEffect(() => {
    if (!draftReady || corruptDraftRaw || draftAccountId !== activeAccountId) return;
    setDraftStatus((current) => current === "error" ? current : "saving");
    try {
      window.localStorage.setItem(journalDraftStorageKey(activeAccountId), serializeJournalDraft(draft));
      setDraftStatus("saved");
    } catch {
      setDraftStatus("error");
    }
  }, [activeAccountId, corruptDraftRaw, draft, draftAccountId, draftReady]);

  const update = <Key extends keyof JournalTradeDraft>(key: Key, value: JournalTradeDraft[Key]) => {
    setError("");
    setErrorField(null);
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const reportError = (message: string, field?: JournalDraftFocusField) => {
    setError(message);
    setErrorField(field ?? null);
    if (!field) return;
    const target = formRef.current?.querySelector<HTMLElement>(`[data-draft-field="${field}"]`);
    if (!target) return;
    if (isAdvancedDraftField(field)) {
      const disclosure = target.closest("details");
      if (disclosure instanceof HTMLDetailsElement) disclosure.open = true;
    }
    window.requestAnimationFrame(() => {
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "center" });
    });
  };

  const validationProps = (field: JournalDraftFocusField) => ({
    "data-draft-field": field,
    "aria-invalid": errorField === field ? true : undefined,
    "aria-describedby": errorField === field ? "quick-add-form-error" : undefined,
  });

  const rMultiple = useMemo(() => {
    const risk = Number(draft.risk);
    const pnl = Number(draft.netPnl);
    return risk > 0 && Number.isFinite(pnl) ? pnl / risk : null;
  }, [draft.risk, draft.netPnl]);
  const currencyFormatter = useMemo(() => createCurrencyFormatter(activeAccount.baseCurrency), [activeAccount.baseCurrency]);
  const draftUsable = draftReady && draftAccountId === activeAccountId && corruptDraftRaw == null;

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draftUsable) {
      return reportError(
        lang === "en" ? "Opening this account's draft — please wait a moment" : "กำลังเปิด draft ของบัญชีนี้ กรุณารอสักครู่",
      );
    }
    if (isReadOnly) {
      return reportError(
        lang === "en" ? "Journal is in recovery mode, so new trades can't be added yet" : "Journal อยู่ใน recovery mode จึงยังเพิ่มข้อมูลไม่ได้",
      );
    }
    const openedAt = zonedDateTimeInputToIso(draft.openedAt, activeAccount.reportingTimezone);
    const closedAt = zonedDateTimeInputToIso(draft.closedAt, activeAccount.reportingTimezone);
    if (!openedAt) {
      return reportError(
        lang === "en"
          ? `Open date/time must exist in timezone ${activeAccount.reportingTimezone}`
          : `วันที่และเวลาเปิดต้องมีอยู่จริงใน timezone ${activeAccount.reportingTimezone}`,
        "openedAt",
      );
    }
    if (!closedAt) {
      return reportError(
        lang === "en"
          ? `Close date/time must exist in timezone ${activeAccount.reportingTimezone}`
          : `วันที่และเวลาปิดต้องมีอยู่จริงใน timezone ${activeAccount.reportingTimezone}`,
        "closedAt",
      );
    }
    const id = crypto.randomUUID();
    const fees = Math.abs(Number(draft.fees) || 0);
    const trade = withDerivedTradeValues({
      id,
      accountId: activeAccountId,
      symbol: draft.symbol,
      side: draft.side,
      openedAt,
      closedAt,
      quantity: numberOrNaN(draft.quantity),
      averageEntry: numberOrNaN(draft.entry),
      averageExit: numberOrNaN(draft.exit),
      initialStop: optionalNumber(draft.stop),
      initialRiskAmount: optionalNumber(draft.risk),
      grossPnl: 0,
      fees,
      commissionPnl: -fees,
      swap: Number(draft.swap) || 0,
      netPnl: numberOrNaN(draft.netPnl),
      rMultiple: null,
      setup: draft.setup,
      timeframe: draft.timeframe,
      session: draft.session,
      marketCondition: draft.marketCondition,
      notes: draft.notes,
      tags: [],
      source: "manual",
      executions: [
        { id: `${id}-entry`, tradeId: id, type: "entry", side: draft.side, executedAt: openedAt, quantity: numberOrNaN(draft.quantity), price: numberOrNaN(draft.entry), fee: fees / 2, commissionPnl: -fees / 2, swapPnl: 0 },
        { id: `${id}-exit`, tradeId: id, type: "exit", side: draft.side === "buy" ? "sell" : "buy", executedAt: closedAt, quantity: numberOrNaN(draft.quantity), price: numberOrNaN(draft.exit), fee: fees / 2, commissionPnl: -fees / 2, swapPnl: Number(draft.swap) || 0 },
      ],
    } satisfies JournalTrade);
    const issues = validateJournalTrade(trade, { requireRisk: true });
    if (issues.length > 0) {
      const firstIssue = issues[0];
      return reportError(
        firstIssue.message,
        draftFieldForTradeIssue(firstIssue.field) ?? undefined,
      );
    }

    const result = addTrade(trade);
    if (!result.ok) return reportError(result.message);
    try {
      window.localStorage.removeItem(journalDraftStorageKey(activeAccountId));
    } catch {
      // The trade is already durably committed; a stale draft is safe to discard later.
    }
    setError("");
    setErrorField(null);
    router.push(buildJournalHref("/journal/trades", range, { trade: id }));
  };

  const discardDraft = () => {
    try {
      window.localStorage.removeItem(journalDraftStorageKey(activeAccountId));
      window.localStorage.removeItem(JOURNAL_DRAFT_KEY);
    } catch {
      setDraftStatus("error");
      return;
    }
    setCorruptDraftRaw(null);
    setContextNotice(null);
    setError("");
    setErrorField(null);
    setDraft(createEmptyJournalDraft(new Date(), activeAccount.reportingTimezone, activeAccountId, activeAccount.baseCurrency));
    setDraftAccountId(activeAccountId);
    setDraftReady(true);
    setDraftStatus("saved");
  };

  const downloadCorruptDraft = () => {
    if (!corruptDraftRaw) return;
    const url = URL.createObjectURL(new Blob([corruptDraftRaw], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `cerfinits-draft-recovery-${activeAccountId}-${new Date().toISOString().slice(0, 10)}.txt`;
    anchor.hidden = true;
    document.body.append(anchor);
    anchor.click();
    window.setTimeout(() => {
      anchor.remove();
      URL.revokeObjectURL(url);
    }, 5_000);
  };

  return (
    <div className="j-page j-add-page">
      <header className="j-mobile-form-head">
        <div><span>CERFINITS</span><h1>Add trade</h1></div>
        <div className={`j-draft-status is-${draftStatus}`} role="status">
          {!draftUsable && !corruptDraftRaw ? "Opening draft…" : draftStatus === "saving" ? "Saving draft…" : draftStatus === "restored" ? "Draft restored" : draftStatus === "error" ? "Draft not saved" : "Draft saved"}
        </div>
        <div className="j-form-head-actions">
          <button className="j-primary-button" type="submit" form="quick-add-form" disabled={isReadOnly || !draftUsable}>Save</button>
          <button className="j-close-button" type="button" onClick={() => router.back()} aria-label={lang === "en" ? "Close" : "ปิด"}><JournalIcon name="close"/></button>
        </div>
      </header>

      {error ? <p id="quick-add-form-error" className="j-form-error j-form-error-head" role="alert">{error}</p> : null}

      {corruptDraftRaw ? (
        <div className="j-storage-notice is-error" role="alert">
          <div>
            <strong><T th="Draft เดิมเสียหาย" en="The old draft is corrupted"/></strong>
            <p><T th="ดาวน์โหลดต้นฉบับไว้ก่อน หรือเริ่มฟอร์มใหม่ได้โดยไม่กระทบ Journal" en="Download the original first, or start a fresh form — either way the journal itself is unaffected"/></p>
          </div>
          <div className="j-inline-actions"><button className="j-secondary-button" type="button" onClick={downloadCorruptDraft}>Download raw draft</button><button className="j-danger-button" type="button" onClick={discardDraft}>Discard draft</button></div>
        </div>
      ) : null}

      {contextNotice ? (
        <div className="j-storage-notice is-warning" role="status">
          <div><strong>Draft timezone updated</strong><p>{contextNotice}</p></div>
        </div>
      ) : null}

      {draftUsable && draft.currencyReviewFrom ? (
        <div className="j-storage-notice is-warning" role="alert">
          <div>
            <strong>Review monetary values</strong>
            <p>
              <T th="บัญชีเปลี่ยนสกุลเงิน" en="Account currency changed"/> {draft.currencyReviewFrom} → {activeAccount.baseCurrency};{" "}
              <T th="ระบบไม่แปลง Risk, P&amp;L, Fees หรือ Swap ให้อัตโนมัติ" en="Risk, P&amp;L, Fees, and Swap are not converted automatically"/>
            </p>
          </div>
          <button className="j-secondary-button" type="button" onClick={() => update("currencyReviewFrom", null)}>Values reviewed</button>
        </div>
      ) : null}

      {draftUsable ? <form ref={formRef} id="quick-add-form" className="j-trade-form j-quick-capture" onSubmit={save} noValidate>
        <div className="j-capture-group j-capture-account">
          <div className="j-field"><span>Trading account</span><JournalAccountControl ariaLabel="Add trade account"/></div>
          <label className="j-field"><span>Symbol</span><input {...validationProps("symbol")} value={draft.symbol} onChange={(event) => update("symbol", event.target.value.toUpperCase())} placeholder={lang === "en" ? "e.g. XAUUSD" : "เช่น XAUUSD"} autoFocus required/></label>
          <div className="j-field"><span>Side</span><div className="j-side-control"><button type="button" className={draft.side === "buy" ? "is-active" : ""} onClick={() => update("side", "buy")}>Buy</button><button type="button" className={draft.side === "sell" ? "is-active" : ""} onClick={() => update("side", "sell")}>Sell</button></div></div>
        </div>
        <div className="j-capture-group">
          <label className="j-field"><span>Opened · {activeAccount.reportingTimezone}</span><input {...validationProps("openedAt")} type="datetime-local" value={draft.openedAt} onChange={(event) => update("openedAt", event.target.value)} required/></label>
          <label className="j-field"><span>Closed · {activeAccount.reportingTimezone}</span><input {...validationProps("closedAt")} type="datetime-local" value={draft.closedAt} onChange={(event) => update("closedAt", event.target.value)} required/></label>
        </div>
        <div className="j-capture-group">
          <label className="j-field"><span>Quantity</span><input {...validationProps("quantity")} inputMode="decimal" type="number" step="any" min="0" value={draft.quantity} onChange={(event) => update("quantity", event.target.value)} placeholder="0.10" required/></label>
        </div>
        <div className="j-capture-group">
          <label className="j-field"><span>Entry</span><input {...validationProps("entry")} inputMode="decimal" type="number" step="any" min="0" value={draft.entry} onChange={(event) => update("entry", event.target.value)} required/></label>
          <label className="j-field"><span>Exit</span><input {...validationProps("exit")} inputMode="decimal" type="number" step="any" min="0" value={draft.exit} onChange={(event) => update("exit", event.target.value)} required/></label>
        </div>
        <div className="j-capture-group">
          <label className="j-field"><span>Initial risk ({activeAccount.baseCurrency})</span><input {...validationProps("risk")} inputMode="decimal" type="number" step="any" min="0" value={draft.risk} onChange={(event) => update("risk", event.target.value)} required/></label>
          <label className="j-field"><span>Net P&amp;L ({activeAccount.baseCurrency})</span><input {...validationProps("netPnl")} inputMode="decimal" type="number" step="any" value={draft.netPnl} onChange={(event) => update("netPnl", event.target.value)} required/></label>
        </div>
        <div className="j-capture-group">
          <label className="j-field"><span>Setup</span><select {...validationProps("setup")} value={draft.setup} onChange={(event) => update("setup", event.target.value)}><option>Unmapped</option><option>Breakout</option><option>Pullback</option><option>Momentum</option></select></label>
        </div>

        <details className="j-advanced-fields">
          <summary>Advanced details</summary>
          <div className="j-form-grid">
            <label className="j-field"><span>Initial stop</span><input {...validationProps("stop")} type="number" step="any" min="0" value={draft.stop} onChange={(event) => update("stop", event.target.value)}/></label>
            <label className="j-field"><span>Fees ({activeAccount.baseCurrency})</span><input {...validationProps("fees")} type="number" step="any" min="0" value={draft.fees} onChange={(event) => update("fees", event.target.value)}/></label>
            <label className="j-field"><span>Swap ({activeAccount.baseCurrency})</span><input {...validationProps("swap")} type="number" step="any" value={draft.swap} onChange={(event) => update("swap", event.target.value)}/></label>
            <label className="j-field"><span>Timeframe</span><select value={draft.timeframe} onChange={(event) => update("timeframe", event.target.value)}><option>M15</option><option>M30</option><option>H1</option><option>H4</option></select></label>
            <label className="j-field"><span>Session</span><input value={draft.session} onChange={(event) => update("session", event.target.value)}/></label>
            <label className="j-field"><span>Market condition</span><input value={draft.marketCondition} onChange={(event) => update("marketCondition", event.target.value)}/></label>
            <label className="j-field j-span-2"><span>Notes</span><textarea rows={3} value={draft.notes} onChange={(event) => update("notes", event.target.value)}/></label>
          </div>
        </details>

        <div className="j-risk-summary"><span>Initial risk<strong>{currencyFormatter.format(Number(draft.risk) || 0)}</strong></span><span>Result<strong>{rMultiple == null ? "—" : `${rMultiple > 0 ? "+" : ""}${rMultiple.toFixed(2)}R`}</strong></span></div>
        <div className="j-form-actions"><button className="j-primary-button" type="submit" disabled={isReadOnly}>Save trade</button><button className="j-secondary-button" type="button" onClick={() => router.back()}>Close</button><button className="j-text-link" type="button" onClick={discardDraft}>Clear draft</button></div>
      </form> : corruptDraftRaw == null ? (
        <div className="j-draft-loading" role="status">
          <T th="กำลังเปิด draft ของ" en="Opening the draft for"/> {activeAccount.name}…
        </div>
      ) : null}
    </div>
  );
}
