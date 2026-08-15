"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  DEFAULT_JOURNAL_ACCOUNT,
  journalSnapshotChecksum,
  normalizeTradingAccount,
  validateJournalSnapshot,
  validateTradingAccount,
} from "@/lib/journal/accounts";
import { SEED_TRADES } from "@/lib/journal/mock-data";
import { journalReducer, type JournalAction } from "@/lib/journal/reducer";
import {
  DEFAULT_JOURNAL_RANGE,
  JOURNAL_RANGE_PREFERENCE_KEY,
  resolveJournalRange,
  type JournalRange,
} from "@/lib/journal/range";
import {
  JOURNAL_STORAGE_KEY,
  LEGACY_JOURNAL_STORAGE_KEYS,
  journalStorageBudget,
  loadJournalPayload,
  serializeJournalPayload,
} from "@/lib/journal/storage";
import {
  addJournalDogfoodIncident,
  createJournalDogfoodLedger,
  JOURNAL_DOGFOOD_STORAGE_KEY,
  loadJournalDogfoodLedger,
  observeJournalDogfoodLedger,
  serializeJournalDogfoodLedger,
  type JournalDogfoodIncidentKind,
  type JournalDogfoodLedger,
} from "@/lib/journal/dogfood";
import type { JournalSnapshot, JournalTrade, TradingAccount } from "@/lib/journal/types";
import { useLang } from "@/components/site/LangContext";

export type JournalStorageStatus = "loading" | "ready" | "recovered" | "error" | "conflict";
export type JournalDogfoodStatus = "idle" | "running" | "error";

export interface JournalCommitResult {
  ok: boolean;
  message: string;
  revision?: number;
  checksum?: string;
  importedCount?: number;
  updatedCount?: number;
  duplicateCount?: number;
  conflictIds?: string[];
  accountId?: string;
}

interface JournalContextValue {
  trades: JournalTrade[];
  accounts: TradingAccount[];
  activeAccount: TradingAccount;
  activeAccountId: string;
  addTrade: (trade: JournalTrade) => JournalCommitResult;
  updateTrade: (trade: JournalTrade) => JournalCommitResult;
  deleteTrade: (id: string) => JournalCommitResult;
  importTrades: (trades: JournalTrade[]) => JournalCommitResult;
  createAccount: (account: Omit<TradingAccount, "id">) => JournalCommitResult;
  updateAccount: (account: TradingAccount) => JournalCommitResult;
  deleteAccount: (id: string) => JournalCommitResult;
  selectAccount: (id: string) => JournalCommitResult;
  restoreJournal: (snapshot: JournalSnapshot) => JournalCommitResult;
  clearJournal: () => JournalCommitResult;
  loadDemoData: () => JournalCommitResult;
  undoLastChange: () => JournalCommitResult;
  canUndo: boolean;
  undoLabel: string | null;
  storageStatus: JournalStorageStatus;
  storageMessage: string | null;
  isReadOnly: boolean;
  isHydrated: boolean;
  revision: number;
  checksum: string;
  recoveryRaw: string | null;
  dogfoodLedger: JournalDogfoodLedger | null;
  dogfoodStatus: JournalDogfoodStatus;
  dogfoodMessage: string | null;
  startDogfood: () => JournalCommitResult;
  range: JournalRange;
  setRange: (range: JournalRange) => void;
}

const JournalContext = createContext<JournalContextValue | null>(null);

function failed(message: string, extras: Partial<JournalCommitResult> = {}): JournalCommitResult {
  return { ok: false, message, ...extras };
}

type DogfoodReadResult =
  | { status: "idle"; ledger: null; message: null }
  | { status: "running"; ledger: JournalDogfoodLedger; message: null }
  | { status: "error"; ledger: null; message: string };

function readDogfood(storage: Storage): DogfoodReadResult {
  const result = loadJournalDogfoodLedger(storage.getItem(JOURNAL_DOGFOOD_STORAGE_KEY));
  if (result.kind === "empty") return { status: "idle", ledger: null, message: null };
  if (result.kind === "error") return { status: "error", ledger: null, message: result.message };
  return { status: "running", ledger: result.ledger, message: null };
}

function writeDogfood(storage: Storage, ledger: JournalDogfoodLedger): JournalDogfoodLedger {
  storage.setItem(JOURNAL_DOGFOOD_STORAGE_KEY, serializeJournalDogfoodLedger(ledger));
  const verified = loadJournalDogfoodLedger(storage.getItem(JOURNAL_DOGFOOD_STORAGE_KEY));
  if (verified.kind !== "ready" || verified.ledger.revision !== ledger.revision) {
    throw new Error("Dogfood evidence write verification failed");
  }
  return verified.ledger;
}

function observeStoredDogfood(storage: Storage, trades: JournalTrade[], observedAt: string): DogfoodReadResult {
  const current = readDogfood(storage);
  if (current.status !== "running") return current;
  const next = observeJournalDogfoodLedger(current.ledger, trades, observedAt);
  return {
    status: "running",
    ledger: next === current.ledger ? current.ledger : writeDogfood(storage, next),
    message: null,
  };
}

function recordStoredDogfoodIncident(
  storage: Storage,
  kind: JournalDogfoodIncidentKind,
  occurredAt: string,
): DogfoodReadResult {
  const current = readDogfood(storage);
  if (current.status !== "running") return current;
  const next = addJournalDogfoodIncident(current.ledger, kind, occurredAt);
  return { status: "running", ledger: writeDogfood(storage, next), message: null };
}

export default function JournalProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useLang();
  const [state, dispatch] = useReducer(journalReducer, {
    trades: [],
    accounts: [],
    activeAccountId: "",
    undo: null,
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const [persistenceEnabled, setPersistenceEnabled] = useState(false);
  const [storageStatus, setStorageStatus] = useState<JournalStorageStatus>("loading");
  const [storageMessage, setStorageMessage] = useState<string | null>(null);
  const [recoveryRaw, setRecoveryRaw] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [checksum, setChecksum] = useState(() => journalSnapshotChecksum({
    trades: [],
    accounts: [],
    activeAccountId: "",
  }));
  const [range, setRangeState] = useState<JournalRange>(DEFAULT_JOURNAL_RANGE);
  const [dogfoodLedger, setDogfoodLedger] = useState<JournalDogfoodLedger | null>(null);
  const [dogfoodStatus, setDogfoodStatus] = useState<JournalDogfoodStatus>("idle");
  const [dogfoodMessage, setDogfoodMessage] = useState<string | null>(null);
  const revisionRef = useRef(0);

  const applyDogfoodResult = useCallback((result: DogfoodReadResult) => {
    setDogfoodStatus(result.status);
    setDogfoodLedger(result.ledger);
    setDogfoodMessage(result.message);
  }, []);

  const captureDogfood = useCallback((trades: JournalTrade[], observedAt = new Date().toISOString()) => {
    try {
      applyDogfoodResult(observeStoredDogfood(window.localStorage, trades, observedAt));
    } catch (error) {
      applyDogfoodResult({
        status: "error",
        ledger: null,
        message: error instanceof Error ? error.message : "Dogfood evidence is unavailable",
      });
    }
  }, [applyDogfoodResult]);

  const captureDogfoodIncident = useCallback((kind: JournalDogfoodIncidentKind, occurredAt = new Date().toISOString()) => {
    try {
      applyDogfoodResult(recordStoredDogfoodIncident(window.localStorage, kind, occurredAt));
    } catch (error) {
      applyDogfoodResult({
        status: "error",
        ledger: null,
        message: error instanceof Error ? error.message : "Dogfood evidence is unavailable",
      });
    }
  }, [applyDogfoodResult]);

  useEffect(() => {
    try {
      const urlRange = new URLSearchParams(window.location.search).get("range");
      const storedRange = window.localStorage.getItem(JOURNAL_RANGE_PREFERENCE_KEY);
      const resolvedRange = resolveJournalRange(urlRange, storedRange);
      setRangeState(resolvedRange);
      window.localStorage.setItem(JOURNAL_RANGE_PREFERENCE_KEY, resolvedRange);
    } catch {
      const urlRange = new URLSearchParams(window.location.search).get("range");
      setRangeState(resolveJournalRange(urlRange, null));
    }

    try {
      const currentRaw = window.localStorage.getItem(JOURNAL_STORAGE_KEY);
      let sourceRaw = currentRaw;
      let sourceKey = JOURNAL_STORAGE_KEY;
      if (sourceRaw == null) {
        for (const legacyKey of LEGACY_JOURNAL_STORAGE_KEYS) {
          const candidate = window.localStorage.getItem(legacyKey);
          if (candidate != null) {
            sourceRaw = candidate;
            sourceKey = legacyKey;
            break;
          }
        }
      }

      const result = loadJournalPayload(sourceRaw);
      if (result.kind === "empty" || result.kind === "ready") {
        const nextRevision = result.kind === "ready" ? result.revision : 0;
        if (sourceKey !== JOURNAL_STORAGE_KEY || result.kind === "empty" || result.migratedFrom) {
          window.localStorage.setItem(JOURNAL_STORAGE_KEY, serializeJournalPayload(
            result.trades,
            nextRevision,
            false,
            result.accounts,
            result.activeAccountId,
          ));
          const verified = loadJournalPayload(window.localStorage.getItem(JOURNAL_STORAGE_KEY));
          if (verified.kind !== "ready") throw new Error("Journal migration verification failed");
        }
        dispatch({
          type: "hydrate",
          trades: result.trades,
          accounts: result.accounts,
          activeAccountId: result.activeAccountId,
        });
        revisionRef.current = nextRevision;
        setRevision(nextRevision);
        setChecksum(result.checksum);
        setStorageStatus("ready");
        setStorageMessage(
          result.kind === "ready" && result.migratedFrom
            ? (lang === "en" ? `Migrated journal schema v${result.migratedFrom} to v5` : `ย้าย Journal schema v${result.migratedFrom} เป็น v5 แล้ว`)
            : null,
        );
        setPersistenceEnabled(true);
        captureDogfood(result.trades);
      } else {
        dispatch({
          type: "hydrate",
          trades: result.trades,
          accounts: result.accounts,
          activeAccountId: result.activeAccountId,
        });
        setStorageStatus(result.kind);
        setStorageMessage(result.message);
        setRecoveryRaw(sourceRaw);
        setChecksum(result.checksum);
        setPersistenceEnabled(false);
        captureDogfood(result.trades);
        captureDogfoodIncident("storage-recovery");
      }
    } catch {
      dispatch({
        type: "hydrate",
        trades: [],
        accounts: [],
        activeAccountId: "",
      });
      setStorageStatus("error");
      setStorageMessage(lang === "en" ? "The browser won't allow saving the journal, so it's open read-only" : "Browser ไม่อนุญาตให้บันทึก Journal จึงเปิดแบบ read-only");
      setPersistenceEnabled(false);
      captureDogfoodIncident("persistence-failure");
    } finally {
      setIsHydrated(true);
    }
  // lang deliberately excluded: this effect hydrates from localStorage once on
  // mount, and switching language must not re-trigger the whole hydration
  // (it would re-dispatch and briefly reset transient state for no reason).
  // The one-off messages above resolve `lang` from the closure, so they are
  // correct for the language active at the moment hydration runs.
  }, [captureDogfood, captureDogfoodIncident]);

  // Fetch remote accounts from Supabase and sync with local state
  useEffect(() => {
    if (!isHydrated) return;

    fetch("/api/accounts")
      .then((res) => res.json())
      .then((remoteList) => {
        const mappedRemote: TradingAccount[] = Array.isArray(remoteList)
          ? remoteList
              .filter((a: any) => a.id !== DEFAULT_JOURNAL_ACCOUNT.id && (a.name || a.account_name) !== "cTrader Demo 01")
              .map((a: any) => ({
                id: String(a.id),
                name: String(a.name || a.account_name || "Account"),
                broker: String(a.bank || a.bank_name || "cTrader"),
                externalAccountId: a.note && a.note !== "Trading Journal Account" ? a.note : null,
                baseCurrency: "USD",
                reportingTimezone: "Asia/Bangkok",
                defaultRiskAmount: a.openingBalance ? Number(a.openingBalance) : undefined,
              }))
          : [];

        const currentTrades = state.trades;
        // Filter out any default placeholder account
        const currentAccounts = state.accounts.filter(
          (a) => a.id !== DEFAULT_JOURNAL_ACCOUNT.id && a.name !== "cTrader Demo 01"
        );

        let nextAccounts: TradingAccount[];
        let nextActiveId = state.activeAccountId;

        if (mappedRemote.length > 0) {
          const existingIds = new Set(currentAccounts.map((a) => a.id));
          const toAdd = mappedRemote.filter((r) => !existingIds.has(r.id));
          nextAccounts = [...currentAccounts, ...toAdd];
          if (!nextAccounts.some((a) => a.id === nextActiveId)) {
            nextActiveId = nextAccounts[0]?.id || "";
          }
        } else {
          nextAccounts = currentAccounts;
          if (!nextAccounts.some((a) => a.id === nextActiveId)) {
            nextActiveId = nextAccounts[0]?.id || "";
          }
        }

        const accountsChanged =
          nextAccounts.length !== state.accounts.length ||
          nextAccounts.some((a, i) => a.id !== state.accounts[i]?.id) ||
          nextActiveId !== state.activeAccountId;

        if (!accountsChanged) return;

        const semantic = validateJournalSnapshot({
          trades: currentTrades,
          accounts: nextAccounts,
          activeAccountId: nextActiveId,
        });

        if (semantic.valid) {
          const nextRevision = revisionRef.current + 1;
          const serialized = serializeJournalPayload(
            semantic.snapshot.trades,
            nextRevision,
            false,
            semantic.snapshot.accounts,
            semantic.snapshot.activeAccountId,
          );
          window.localStorage.setItem(JOURNAL_STORAGE_KEY, serialized);
          const verified = loadJournalPayload(window.localStorage.getItem(JOURNAL_STORAGE_KEY));
          if (verified.kind === "ready") {
            dispatch({
              type: "replace",
              trades: currentTrades,
              accounts: semantic.snapshot.accounts,
              activeAccountId: semantic.snapshot.activeAccountId,
              label: "Sync accounts from Supabase",
            });
            revisionRef.current = nextRevision;
            setRevision(nextRevision);
            setChecksum(verified.checksum);
          }
        }
      })
      .catch((err) => {
        console.warn("Failed to load accounts from Supabase:", err);
      });
  }, [isHydrated]);

  const setRange = useCallback((nextRange: JournalRange) => {
    setRangeState(nextRange);
    try {
      window.localStorage.setItem(JOURNAL_RANGE_PREFERENCE_KEY, nextRange);
    } catch {
      // UI preference persistence must never disable Journal data persistence.
    }
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === JOURNAL_DOGFOOD_STORAGE_KEY) {
        try {
          applyDogfoodResult(readDogfood(window.localStorage));
        } catch (error) {
          applyDogfoodResult({
            status: "error",
            ledger: null,
            message: error instanceof Error ? error.message : "Dogfood evidence is unavailable",
          });
        }
        return;
      }
      if (event.key !== JOURNAL_STORAGE_KEY || event.newValue == null) return;
      const incoming = loadJournalPayload(event.newValue);
      if (incoming.kind !== "ready") {
        setStorageStatus("conflict");
        setStorageMessage(
          lang === "en"
            ? "The journal was changed from another tab with data that can't be verified — saving has stopped"
            : "Journal ถูกเปลี่ยนจากอีกแท็บด้วยข้อมูลที่ตรวจสอบไม่ได้ ระบบหยุดการบันทึกแล้ว",
        );
        setRecoveryRaw(event.newValue);
        setPersistenceEnabled(false);
        captureDogfoodIncident("revision-conflict");
        return;
      }
      if (incoming.revision <= revisionRef.current) return;
      dispatch({
        type: "hydrate",
        trades: incoming.trades,
        accounts: incoming.accounts,
        activeAccountId: incoming.activeAccountId,
      });
      revisionRef.current = incoming.revision;
      setRevision(incoming.revision);
      setChecksum(incoming.checksum);
      setStorageStatus("ready");
      setStorageMessage(lang === "en" ? "Journal updated from another tab" : "อัปเดต Journal จากอีกแท็บแล้ว");
      setPersistenceEnabled(true);
      captureDogfood(incoming.trades);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [applyDogfoodResult, captureDogfood, captureDogfoodIncident, lang]);

  const commitAction = useCallback((action: JournalAction): JournalCommitResult => {
    if (!persistenceEnabled) {
      return failed(lang === "en" ? "Journal is in read-only mode — data has not been saved" : "Journal อยู่ใน read-only mode ข้อมูลยังไม่ถูกบันทึก");
    }
    const nextState = journalReducer(state, action);
    if (nextState === state) return failed(lang === "en" ? "No data changed" : "ไม่มีข้อมูลเปลี่ยนแปลง");

    const semantic = validateJournalSnapshot({
      trades: nextState.trades,
      accounts: nextState.accounts,
      activeAccountId: nextState.activeAccountId,
    });
    if (!semantic.valid) return failed(semantic.issues[0] ?? "Journal validation failed");

    try {
      const currentRaw = window.localStorage.getItem(JOURNAL_STORAGE_KEY);
      const current = loadJournalPayload(currentRaw);
      if (current.kind !== "ready" || current.revision !== revisionRef.current) {
        setStorageStatus("conflict");
        setStorageMessage(
          lang === "en" ? "A newer revision was found from another tab — stopping before overwriting data" : "พบ revision ใหม่จากอีกแท็บ ระบบหยุดก่อนเขียนทับข้อมูล",
        );
        setPersistenceEnabled(false);
        captureDogfoodIncident("revision-conflict");
        return failed(
          lang === "en" ? "Data changed in another tab — please reload before saving again" : "ข้อมูลเปลี่ยนจากอีกแท็บ กรุณา reload ก่อนบันทึกอีกครั้ง",
        );
      }

      const nextRevision = revisionRef.current + 1;
      const serialized = serializeJournalPayload(
        semantic.snapshot.trades,
        nextRevision,
        false,
        semantic.snapshot.accounts,
        semantic.snapshot.activeAccountId,
      );
      const budget = journalStorageBudget(serialized, currentRaw?.length ?? 0);
      if (!budget.valid) {
        return failed(
          lang === "en"
            ? `Journal would exceed the local safety limit (${(budget.characters / 1_000_000).toFixed(1)}M / ${(budget.limit / 1_000_000).toFixed(1)}M characters) — please export a backup or reduce the data range first`
            : `Journal จะเกิน local safety limit (${(budget.characters / 1_000_000).toFixed(1)}M / ${(budget.limit / 1_000_000).toFixed(1)}M characters) กรุณา Export backup หรือลดช่วงข้อมูลก่อน`,
        );
      }
      window.localStorage.setItem(JOURNAL_STORAGE_KEY, serialized);
      const verified = loadJournalPayload(window.localStorage.getItem(JOURNAL_STORAGE_KEY));
      if (verified.kind !== "ready" || verified.revision !== nextRevision) throw new Error("Commit verification failed");

      // Sync accounts to Supabase Database
      try {
        const accountsToSync = semantic.snapshot.accounts.map((acc: any) => ({
          id: acc.id,
          name: acc.name,
          bank: acc.broker || "cTrader",
          openingBalance: 0,
          interestRate: 0,
          note: acc.externalAccountId || "Trading Account",
        }));
        fetch("/api/accounts/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accounts: accountsToSync }),
        }).catch((err) => console.error("Supabase accounts sync error:", err));
      } catch (syncErr) {
        console.error("Supabase accounts sync error:", syncErr);
      }

      dispatch(action);
      revisionRef.current = nextRevision;
      setRevision(nextRevision);
      setChecksum(verified.checksum);
      setStorageStatus("ready");
      setStorageMessage(null);
      captureDogfood(verified.trades);
      return { ok: true, message: lang === "en" ? "Saved" : "บันทึกแล้ว", revision: nextRevision, checksum: verified.checksum };
    } catch {
      setStorageStatus("error");
      setStorageMessage(
        lang === "en" ? "Failed to save the journal — the on-screen data has not been changed" : "บันทึก Journal ไม่สำเร็จ ข้อมูลบนหน้าจอยังไม่ถูกเปลี่ยน",
      );
      setPersistenceEnabled(false);
      captureDogfoodIncident("persistence-failure");
      return failed(lang === "en" ? "Save failed — the form and draft are still intact" : "บันทึกไม่สำเร็จ ฟอร์มและ draft ยังอยู่ครบ");
    }
  }, [captureDogfood, captureDogfoodIncident, persistenceEnabled, state, lang]);

  const addTrade = useCallback((trade: JournalTrade) => (
    commitAction({ type: "upsert", trade, label: lang === "en" ? `Add ${trade.symbol}` : `เพิ่ม ${trade.symbol}` })
  ), [commitAction, lang]);

  const updateTrade = useCallback((trade: JournalTrade) => (
    commitAction({ type: "upsert", trade, label: lang === "en" ? `Edit ${trade.symbol}` : `แก้ไข ${trade.symbol}` })
  ), [commitAction, lang]);

  const deleteTrade = useCallback((id: string) => {
    const trade = state.trades.find((item) => item.id === id);
    if (!trade) return failed(lang === "en" ? "Trade to delete not found" : "ไม่พบ trade ที่ต้องการลบ");
    return commitAction({ type: "delete", id, label: lang === "en" ? `Delete ${trade.symbol}` : `ลบ ${trade.symbol}` });
  }, [commitAction, state.trades, lang]);

  const importTrades = useCallback((incoming: JournalTrade[]) => {
    if (incoming.length === 0) return failed(lang === "en" ? "No trades to import" : "ไม่มี trade พร้อมนำเข้า");
    const existing = new Map(state.trades.map((trade) => [trade.id, trade]));
    const novel: JournalTrade[] = [];
    const updates: JournalTrade[] = [];
    const conflicts: string[] = [];
    let duplicates = 0;

    incoming.forEach((trade) => {
      const current = existing.get(trade.id);
      if (!current) {
        novel.push(trade);
        return;
      }
      if (current.sourceEvidenceHash && current.sourceEvidenceHash === trade.sourceEvidenceHash) {
        // Same broker evidence, but a mapping improvement (e.g. commission/swap
        // added) can change the financials of an already-imported trade. Refresh
        // those on re-sync while preserving the user's own annotations; if the
        // money fields are unchanged it is a true duplicate.
        const financialsDiffer =
          current.grossPnl !== trade.grossPnl ||
          current.commissionPnl !== trade.commissionPnl ||
          current.swap !== trade.swap ||
          current.fees !== trade.fees ||
          current.netPnl !== trade.netPnl;
        if (financialsDiffer) {
          const preservedRisk = current.initialRiskAmount ?? trade.initialRiskAmount;
          updates.push({
            ...trade,
            initialRiskAmount: preservedRisk,
            rMultiple: preservedRisk ? trade.netPnl / preservedRisk : null,
            setup: current.setup === "Unmapped" ? trade.setup : current.setup,
            timeframe: current.timeframe === "Unmapped" ? trade.timeframe : current.timeframe,
            session: current.session === "Unmapped" ? trade.session : current.session,
            marketCondition: current.marketCondition === "Unmapped" ? trade.marketCondition : current.marketCondition,
            notes: current.notes,
            tags: current.tags,
          });
        } else {
          duplicates += 1;
        }
        return;
      }
      const currentEvidence = new Set(current.executions.map((execution) => execution.externalId).filter(Boolean));
      const incomingEvidence = new Set(trade.executions.map((execution) => execution.externalId).filter(Boolean));
      const extendsLifecycle = current.source === "ctrader-csv"
        && trade.source === "ctrader-csv"
        && currentEvidence.size > 0
        && [...currentEvidence].every((id) => incomingEvidence.has(id))
        && incomingEvidence.size > currentEvidence.size;
      if (!extendsLifecycle) {
        conflicts.push(trade.id);
        return;
      }
      updates.push({
        ...trade,
        initialRiskAmount: current.initialRiskAmount ?? trade.initialRiskAmount,
        setup: current.setup === "Unmapped" ? trade.setup : current.setup,
        timeframe: current.timeframe === "Unmapped" ? trade.timeframe : current.timeframe,
        session: current.session === "Unmapped" ? trade.session : current.session,
        marketCondition: current.marketCondition === "Unmapped" ? trade.marketCondition : current.marketCondition,
        notes: current.notes,
        tags: current.tags,
      });
    });

    if (conflicts.length > 0) {
      return failed(
        lang === "en" ? "Found broker evidence edited after the fact — not overwriting" : "พบ broker evidence ที่แก้ไขย้อนหลัง ระบบยังไม่เขียนทับ",
        {
          importedCount: 0,
          updatedCount: 0,
          duplicateCount: duplicates,
          conflictIds: conflicts,
        },
      );
    }
    if (novel.length === 0 && updates.length === 0) {
      return {
        ok: true,
        message: lang === "en" ? "Nothing new to import" : "ไม่มีรายการใหม่",
        importedCount: 0,
        updatedCount: 0,
        duplicateCount: duplicates,
        conflictIds: [],
      };
    }

    const updateIds = new Set(updates.map((trade) => trade.id));
    const nextTrades = [...novel, ...updates, ...state.trades.filter((trade) => !updateIds.has(trade.id))];
    const result = commitAction({
      type: "reset",
      trades: nextTrades,
      label: lang === "en" ? `Import ${novel.length} · update ${updates.length}` : `นำเข้า ${novel.length} · อัปเดต ${updates.length}`,
    });
    return {
      ...result,
      importedCount: result.ok ? novel.length : 0,
      updatedCount: result.ok ? updates.length : 0,
      duplicateCount: duplicates,
      conflictIds: [],
    };
  }, [commitAction, state.trades, lang]);

  const createAccount = useCallback((draft: Omit<TradingAccount, "id"> & { id?: string }) => {
    const id = (draft as any).id || (globalThis.crypto?.randomUUID?.() ?? `account-${Date.now().toString(36)}`);
    const validation = validateTradingAccount({ ...draft, id });
    if (!validation.valid) return failed(validation.issues[0] ?? "Account validation failed");
    const result = commitAction({
      type: "upsert-account",
      account: validation.account,
      activate: true,
      label: lang === "en" ? `Add account ${validation.account.name}` : `เพิ่มบัญชี ${validation.account.name}`,
    });
    return { ...result, accountId: result.ok ? id : undefined };
  }, [commitAction, lang]);

  const updateAccount = useCallback((account: TradingAccount) => {
    if (!state.accounts.some((item) => item.id === account.id)) {
      return failed(lang === "en" ? "Account to edit not found" : "ไม่พบบัญชีที่ต้องการแก้ไข");
    }
    const validation = validateTradingAccount(account);
    if (!validation.valid) return failed(validation.issues[0] ?? "Account validation failed");
    return commitAction({
      type: "upsert-account",
      account: validation.account,
      label: lang === "en" ? `Edit account ${validation.account.name}` : `แก้ไขบัญชี ${validation.account.name}`,
    });
  }, [commitAction, state.accounts, lang]);

  const deleteAccount = useCallback((id: string) => {
    const account = state.accounts.find((item) => item.id === id);
    if (!account) return failed(lang === "en" ? "Account to delete not found" : "ไม่พบบัญชีที่ต้องการลบ");
    return commitAction({ type: "delete-account", id, label: lang === "en" ? `Delete account ${account.name}` : `ลบบัญชี ${account.name}` });
  }, [commitAction, state.accounts, lang]);

  const selectAccount = useCallback((id: string) => {
    if (!state.accounts.some((account) => account.id === id)) {
      return failed(lang === "en" ? "Selected account not found" : "ไม่พบบัญชีที่เลือก");
    }
    if (state.activeAccountId === id) {
      return { ok: true, message: lang === "en" ? "Already using this account" : "กำลังใช้บัญชีนี้อยู่", accountId: id };
    }
    const result = commitAction({ type: "select-account", id });
    return { ...result, accountId: result.ok ? id : undefined };
  }, [commitAction, state.accounts, state.activeAccountId, lang]);

  const restoreJournal = useCallback((snapshot: JournalSnapshot) => {
    if (persistenceEnabled) {
      return commitAction({
        type: "replace",
        trades: snapshot.trades,
        accounts: snapshot.accounts,
        activeAccountId: snapshot.activeAccountId,
        label: `Restore ${snapshot.trades.length} trades · ${snapshot.accounts.length} accounts`,
      });
    }
    const semantic = validateJournalSnapshot(snapshot);
    if (!semantic.valid) return failed(semantic.issues[0] ?? "Backup validation failed");
    try {
      const nextRevision = 1;
      const serialized = serializeJournalPayload(
        semantic.snapshot.trades,
        nextRevision,
        false,
        semantic.snapshot.accounts,
        semantic.snapshot.activeAccountId,
      );
      const budget = journalStorageBudget(serialized);
      if (!budget.valid) {
        return failed(
          lang === "en"
            ? `Backup would exceed the local safety limit (${(budget.characters / 1_000_000).toFixed(1)}M / ${(budget.limit / 1_000_000).toFixed(1)}M characters)`
            : `Backup จะเกิน local safety limit (${(budget.characters / 1_000_000).toFixed(1)}M / ${(budget.limit / 1_000_000).toFixed(1)}M characters)`,
        );
      }
      window.localStorage.setItem(JOURNAL_STORAGE_KEY, serialized);
      const verified = loadJournalPayload(window.localStorage.getItem(JOURNAL_STORAGE_KEY));
      if (verified.kind !== "ready") throw new Error("Recovery verification failed");
      dispatch({
        type: "hydrate",
        trades: verified.trades,
        accounts: verified.accounts,
        activeAccountId: verified.activeAccountId,
      });
      revisionRef.current = nextRevision;
      setRevision(nextRevision);
      setChecksum(verified.checksum);
      setRecoveryRaw(null);
      setStorageStatus("ready");
      setStorageMessage(lang === "en" ? "Journal restored and checksum verified" : "กู้คืน Journal และตรวจ checksum แล้ว");
      setPersistenceEnabled(true);
      captureDogfood(verified.trades);
      captureDogfoodIncident("storage-recovery");
      return {
        ok: true,
        message: lang === "en" ? "Restored and saved" : "กู้คืนและบันทึกแล้ว",
        revision: nextRevision,
        checksum: verified.checksum,
      };
    } catch {
      captureDogfoodIncident("persistence-failure");
      return failed(
        lang === "en" ? "The browser still can't write storage — the original data is unchanged" : "Browser ยังเขียน storage ไม่ได้ ต้นฉบับเดิมยังไม่ถูกเปลี่ยน",
      );
    }
  }, [captureDogfood, captureDogfoodIncident, commitAction, persistenceEnabled, lang]);

  const clearJournal = useCallback(() => {
    const unlinkedAccounts = state.accounts.map(acc => ({ ...acc, externalAccountId: null }));
    return persistenceEnabled
      ? commitAction({
        type: "replace",
        trades: [],
        accounts: unlinkedAccounts,
        activeAccountId: state.activeAccountId,
        label: lang === "en" ? "Clear journal" : "ล้าง Journal",
      })
      : restoreJournal({ trades: [], accounts: unlinkedAccounts, activeAccountId: state.activeAccountId });
  }, [commitAction, persistenceEnabled, restoreJournal, state.accounts, state.activeAccountId, lang]);

  const loadDemoData = useCallback(() => {
    const existingDefault = state.accounts.find((account) => account.id === DEFAULT_JOURNAL_ACCOUNT.id);
    const accounts = existingDefault
      ? state.accounts
      : [...state.accounts, { ...DEFAULT_JOURNAL_ACCOUNT }];
    const snapshot = {
      trades: SEED_TRADES,
      accounts,
      activeAccountId: DEFAULT_JOURNAL_ACCOUNT.id,
    };
    return persistenceEnabled
      ? commitAction({ type: "replace", ...snapshot, label: lang === "en" ? "Load demo data" : "โหลดข้อมูลตัวอย่าง" })
      : restoreJournal(snapshot);
  }, [commitAction, persistenceEnabled, restoreJournal, state.accounts, lang]);

  const undoLastChange = useCallback(() => {
    if (!state.undo) return failed(lang === "en" ? "Nothing to undo" : "ไม่มีรายการให้ Undo");
    return commitAction({ type: "undo" });
  }, [commitAction, state.undo, lang]);

  const activeAccount = useMemo(
    () => state.accounts.find((account) => account.id === state.activeAccountId)
      ?? state.accounts[0]
      ?? {
          id: "",
          name: "",
          broker: "cTrader",
          externalAccountId: null,
          baseCurrency: "USD",
          reportingTimezone: "Asia/Bangkok",
        },
    [state.accounts, state.activeAccountId],
  );

  const startDogfood = useCallback((): JournalCommitResult => {
    if (!persistenceEnabled) {
      return failed(lang === "en" ? "Can't start dogfooding until journal storage is ready" : "เริ่ม dogfood ไม่ได้จนกว่า Journal storage จะพร้อม");
    }
    try {
      const current = readDogfood(window.localStorage);
      if (current.status === "running") {
        applyDogfoodResult(current);
        return failed(lang === "en" ? "Already collecting dogfood evidence" : "กำลังเก็บหลักฐาน dogfood อยู่แล้ว");
      }
      if (current.status === "error") {
        applyDogfoodResult(current);
        return failed(
          lang === "en" ? "The existing dogfood evidence failed verification — not overwriting it" : "หลักฐาน dogfood เดิมตรวจสอบไม่ผ่าน ระบบจะไม่เขียนทับ",
        );
      }
      const startedAt = new Date().toISOString();
      const initial = createJournalDogfoodLedger(activeAccount.id, activeAccount.reportingTimezone, startedAt);
      const observed = observeJournalDogfoodLedger(initial, state.trades, startedAt);
      const verified = writeDogfood(window.localStorage, observed);
      applyDogfoodResult({ status: "running", ledger: verified, message: null });
      return { ok: true, message: lang === "en" ? "Started collecting 14-day local dogfood evidence" : "เริ่มเก็บหลักฐาน local dogfood 14 วันแล้ว" };
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : (lang === "en" ? "Failed to start dogfooding" : "เริ่ม dogfood ไม่สำเร็จ");
      applyDogfoodResult({ status: "error", ledger: null, message });
      return failed(message);
    }
  }, [activeAccount.id, activeAccount.reportingTimezone, applyDogfoodResult, persistenceEnabled, state.trades, lang]);

  const value = useMemo<JournalContextValue>(
    () => ({
      trades: state.trades,
      accounts: state.accounts,
      activeAccount,
      activeAccountId: state.activeAccountId,
      addTrade,
      updateTrade,
      deleteTrade,
      importTrades,
      createAccount,
      updateAccount,
      deleteAccount,
      selectAccount,
      restoreJournal,
      clearJournal,
      loadDemoData,
      undoLastChange,
      canUndo: state.undo != null,
      undoLabel: state.undo?.label ?? null,
      storageStatus,
      storageMessage,
      isReadOnly: !persistenceEnabled,
      isHydrated,
      revision,
      checksum,
      recoveryRaw,
      dogfoodLedger,
      dogfoodStatus,
      dogfoodMessage,
      startDogfood,
      range,
      setRange,
    }),
    [state.trades, state.accounts, state.activeAccountId, state.undo, activeAccount, addTrade, updateTrade, deleteTrade, importTrades, createAccount, updateAccount, deleteAccount, selectAccount, restoreJournal, clearJournal, loadDemoData, undoLastChange, storageStatus, storageMessage, persistenceEnabled, isHydrated, revision, checksum, recoveryRaw, dogfoodLedger, dogfoodStatus, dogfoodMessage, startDogfood, range, setRange],
  );

  if (!isHydrated) {
    return <div className="j-journal-loading" role="status">{lang === "en" ? "Checking journal data…" : "กำลังตรวจข้อมูล Journal…"}</div>;
  }
  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) throw new Error("useJournal must be used inside JournalProvider");
  return context;
}
