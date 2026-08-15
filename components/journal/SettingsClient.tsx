"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MAX_CTRADER_CSV_BYTES,
  MAX_CTRADER_CSV_DATA_ROWS,
  limitCtraderPreviewIssues,
  parseCtraderCsv,
  SAMPLE_CTRADER_CSV,
  summarizeCtraderImportPreview,
} from "@/lib/journal/csv";
import { buildJournalHref } from "@/lib/journal/range";
import { createJournalSyncManifest } from "@/lib/journal/sync";
import type { ImportPreview } from "@/lib/journal/types";
import JournalIcon from "./JournalIcon";
import AccountSettingsClient from "./AccountSettingsClient";
import RCard from "./RCard";
import { tradesForAccount } from "@/lib/journal/accounts";
import { useJournal } from "./JournalProvider";
import { T, useLang } from "@/components/site/LangContext";

type SyncPreviewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | {
      kind: "ready";
      match: boolean;
      differences: string[];
      remote: { tradeCount: number; executionCount: number; eligibleRCount: number };
    }
  | { kind: "error"; message: string };

interface ImportReceipt {
  fileName: string;
  importedCount: number;
  updatedCount: number;
  duplicateCount: number;
  missingRiskTrades: number;
  committedRevision: number | null;
  observedRevision: number;
  status: "committed" | "undone";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseSyncPreview(value: unknown): Exclude<SyncPreviewState, { kind: "idle" | "loading" | "error" }> {
  if (!isRecord(value)
    || value.writesPerformed !== 0
    || typeof value.match !== "boolean"
    || !Array.isArray(value.differences)
    || !isRecord(value.remote)
    || !Number.isSafeInteger(value.remote.tradeCount)
    || !Number.isSafeInteger(value.remote.executionCount)
    || !Number.isSafeInteger(value.remote.eligibleRCount)) {
    throw new Error("Staging returned an invalid comparison");
  }
  const differences = value.differences.map((item) => {
    if (!isRecord(item) || typeof item.code !== "string") {
      throw new Error("Staging returned invalid difference details");
    }
    return item.code;
  });
  return {
    kind: "ready",
    match: value.match,
    differences,
    remote: {
      tradeCount: Number(value.remote.tradeCount),
      executionCount: Number(value.remote.executionCount),
      eligibleRCount: Number(value.remote.eligibleRCount),
    },
  };
}

export default function SettingsClient({
  syncPreviewAvailable = false,
}: {
  syncPreviewAvailable?: boolean;
}) {
  const {
    trades,
    accounts,
    activeAccountId,
    activeAccount,
    updateAccount,
    importTrades,
    undoLastChange,
    canUndo,
    undoLabel,
    isReadOnly,
    revision,
    range,
  } = useJournal();
  const { lang } = useLang();
  const accountTrades = useMemo(() => tradesForAccount(trades, activeAccountId), [trades, activeAccountId]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [importReceipt, setImportReceipt] = useState<ImportReceipt | null>(null);
  const [message, setMessage] = useState("");
  const [syncPreview, setSyncPreview] = useState<SyncPreviewState>({ kind: "idle" });
  const importReceiptRef = useRef<HTMLDivElement>(null);
  const [isSyncingCtrader, setIsSyncingCtrader] = useState(false);
  const [connectedPorts, setConnectedPorts] = useState<any[]>([]);
  const [hasConnection, setHasConnection] = useState<boolean>(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState<boolean>(true);
  const hasAutoSynced = useRef(false);

  useEffect(() => {
    if (!activeAccountId) return;
    setIsLoadingAccounts(true);
    let isCancelled = false;
    const controller = new AbortController();

    fetch(`/api/ctrader/accounts?tradingAccountId=${activeAccountId}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (isCancelled) return;
        if (data.success) {
          if (data.accounts) setConnectedPorts(data.accounts);
          setHasConnection(Boolean(data.hasConnection || (data.accounts && data.accounts.length > 0)));
        }
      })
      .catch(err => {
        if (!isCancelled && err.name !== 'AbortError') {
          console.warn("Failed to fetch connected ports", err);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingAccounts(false);
        }
      });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [activeAccountId]);

  const disconnectCTrader = async () => {
    if (!activeAccountId) return;
    try {
      setIsLoadingAccounts(true);
      await fetch(`/api/ctrader/accounts?tradingAccountId=${activeAccountId}`, { method: 'DELETE' });
      setConnectedPorts([]);
      setHasConnection(false);
      if (activeAccount?.externalAccountId) {
        updateAccount({ ...activeAccount, externalAccountId: null });
      }
      setMessage(lang === "en" ? "Disconnected from cTrader" : "ยกเลิกการเชื่อมต่อ cTrader แล้ว");
    } catch (e) {
      console.error("Failed to disconnect", e);
      setMessage(lang === "en" ? "Failed to disconnect" : "ยกเลิกการเชื่อมต่อไม่สำเร็จ");
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const handleSyncCtrader = async () => {
    setIsSyncingCtrader(true);
    try {
      const body = activeAccount?.externalAccountId ? JSON.stringify({ cTraderAccountId: activeAccount.externalAccountId }) : undefined;
      const headers = body ? { 'Content-Type': 'application/json' } : undefined;
      const res = await fetch('/api/ctrader/sync', { method: 'POST', body, headers });
      const data = await res.json();
      if (res.ok) {
        if (data.trades && data.trades.length > 0) {
          const newJournalTrades = data.trades.map((t: any) => {
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
              externalPositionId: t.ticket,
              sourceEvidenceHash: `hash-${id}`
            };
          });
          
          // De-dupe within this payload only. Do NOT drop ids that already exist —
          // importTrades decides novel vs. update, so a re-sync can backfill cost
          // onto already-imported trades while keeping their annotations.
          const uniqueTradesMap = new Map();
          newJournalTrades.forEach((t: any) => uniqueTradesMap.set(t.id, t));
          const incomingTrades = Array.from(uniqueTradesMap.values());

          if (incomingTrades.length > 0) {
            importTrades(incomingTrades);
          }
        }
        setMessage(
          data.newTradesCount > 0
            ? (lang === "en" ? `Synced! Found ${data.newTradesCount} new orders` : `ซิงค์สำเร็จ! พบ ${data.newTradesCount} ออเดอร์ใหม่`)
            : (lang === "en" ? "Synced! Data is already up to date" : "ซิงค์สำเร็จ! ข้อมูลเป็นปัจจุบันแล้ว"),
        );
      } else {
        setMessage(
          lang === "en"
            ? `Sync failed: ${data.error || "Unknown error"}`
            : `ซิงค์ไม่สำเร็จ: ${data.error || 'Unknown error'}`,
        );
      }
    } catch (error) {
      setMessage(
        lang === "en"
          ? `Sync failed: ${error instanceof Error ? error.message : "Network error"}`
          : `ซิงค์ไม่สำเร็จ: ${error instanceof Error ? error.message : "Network error"}`,
      );
    } finally {
      setIsSyncingCtrader(false);
    }
  };

  const previewCounts = useMemo(
    () => preview ? summarizeCtraderImportPreview(preview, trades) : null,
    [preview, trades],
  );
  const previewIssueWindow = useMemo(
    () => limitCtraderPreviewIssues(preview?.issues ?? []),
    [preview],
  );

  useEffect(() => {
    setPreview(null);
    setImportReceipt(null);
  }, [activeAccountId]);

  useEffect(() => {
    if (importReceipt) importReceiptRef.current?.focus();
  }, [importReceipt]);

  useEffect(() => {
    if (importReceipt?.status === "committed" && revision > importReceipt.observedRevision) {
      setImportReceipt(null);
    }
  }, [importReceipt, revision]);

  useEffect(() => {
    if (searchParams.get("autoSync") === "true" && !hasAutoSynced.current) {
      hasAutoSynced.current = true;
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("autoSync");
      router.replace(`/journal?${newParams.toString()}`);
      
      setTimeout(() => {
        handleSyncCtrader();
      }, 500);
    }
  }, [searchParams, router]);

  const readCsv = async (file: File) => {
    setImportReceipt(null);
    if (file.size > MAX_CTRADER_CSV_BYTES) {
      setPreview({
        fileName: file.name,
        trades: [],
        issues: [{
          row: 1,
          message: lang === "en"
            ? `File ${(file.size / 1024 / 1024).toFixed(1)} MiB exceeds the local limit of ${MAX_CTRADER_CSV_BYTES / 1024 / 1024} MiB`
            : `ไฟล์ ${(file.size / 1024 / 1024).toFixed(1)} MiB เกิน local limit ${MAX_CTRADER_CSV_BYTES / 1024 / 1024} MiB`,
          kind: "rejected",
        }],
      });
      setMessage(
        lang === "en"
          ? "The file was not read, to avoid freezing the browser — your existing data is unchanged"
          : "ระบบยังไม่อ่านไฟล์ เพื่อป้องกัน browser ค้างและข้อมูลเดิมไม่ถูกเปลี่ยน",
      );
      return;
    }
    try {
      setPreview(parseCtraderCsv(await file.text(), file.name, { accountId: activeAccountId }));
      setMessage("");
    } catch {
      setPreview(null);
      setMessage(lang === "en" ? "Failed to read the CSV — nothing was imported" : "อ่าน CSV ไม่สำเร็จ ไฟล์เดิมยังไม่ถูกนำเข้า");
    }
  };

  const importPreview = () => {
    if (!preview?.trades.length) return;
    const fileName = preview.fileName;
    const missingRiskTrades = previewCounts?.missingRiskTrades ?? 0;
    const result = importTrades(preview.trades);
    if (!result.ok) {
      setMessage(`${result.message}${result.conflictIds?.length ? ` (${result.conflictIds.length} conflicts)` : ""}`);
      return;
    }
    setMessage("");
    setImportReceipt({
      fileName,
      importedCount: result.importedCount ?? 0,
      updatedCount: result.updatedCount ?? 0,
      duplicateCount: result.duplicateCount ?? 0,
      missingRiskTrades,
      committedRevision: result.revision ?? null,
      observedRevision: result.revision ?? revision,
      status: "committed",
    });
    setPreview(null);
  };

  const undoImport = () => {
    if (!importReceipt || importReceipt.committedRevision !== revision) return;
    const result = undoLastChange();
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage("");
    setImportReceipt({ ...importReceipt, committedRevision: null, status: "undone" });
  };

  const checkStagingMatch = async () => {
    setSyncPreview({ kind: "loading" });
    try {
      const manifest = await createJournalSyncManifest(trades, revision);
      const response = await fetch("/api/journal/sync/preview", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manifest),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const error = isRecord(payload) && typeof payload.error === "string"
          ? payload.error
          : "Staging comparison failed";
        throw new Error(error);
      }
      setSyncPreview(parseSyncPreview(payload));
    } catch (error) {
      setSyncPreview({
        kind: "error",
        message: error instanceof Error ? error.message : "Staging comparison failed",
      });
    }
  };

  return (
    <>
      {isSyncingCtrader && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          pointerEvents: "auto"
        }}>
          <svg className="spin" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px", color: "var(--j-gold, #d4af37)" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
          <h2 style={{ margin: 0, color: "white", fontWeight: 600, fontSize: "22px" }}><T th="กำลังซิงค์ข้อมูล cTrader..." en="Syncing cTrader data..."/></h2>
          <p style={{ opacity: 0.8, marginTop: "8px", fontSize: "14px" }}><T th="กรุณารอสักครู่ กำลังดึงรายการออเดอร์ล่าสุด..." en="Fetching live trades from broker..."/></p>
        </div>
      )}

      <div className="j-page" style={{ padding: "20px 24px 48px" }}>
        <header className="j-page-head" style={{ marginBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: "24px" }}><T th="Settings &amp; Preferences" en="Settings &amp; Import"/></h1>
            <p><T th="การตั้งค่าบัญชีเทรด การเชื่อมต่อ cTrader Auto-Sync และการนำเข้าข้อมูลประวัติการเทรด" en="Configure trading accounts, manage cTrader live sync, and import trade history"/></p>
          </div>
          <div className="j-head-controls">
            <Link href={buildJournalHref("/journal", range)} className="j-secondary-button" style={{ padding: "8px 16px", fontSize: "13px" }}>
              <JournalIcon name="arrow-left" size={14}/>
              <T th="กลับไปที่ Overview" en="Back to Overview"/>
            </Link>
          </div>
        </header>

        {/* Quick Jump Sub-Navigation */}
        <nav className="j-settings-nav" aria-label="Settings navigation">
          <a href="#accounts"><JournalIcon name="account" size={14}/><span><T th="บัญชีเทรด" en="Trading Accounts"/></span></a>
          <a href="#import-ctrader-sync"><JournalIcon name="zap" size={14}/><span><T th="cTrader Live Sync" en="cTrader Live Sync"/></span></a>
          <a href="#import-csv"><JournalIcon name="upload" size={14}/><span><T th="cTrader CSV Import" en="CSV Import"/></span></a>
          <a href="#monthly-summary"><JournalIcon name="chart" size={14}/><span><T th="สรุปผลงานประจำเดือน" en="Monthly Summary"/></span></a>
        </nav>

        {canUndo ? (
          <div className="j-undo-banner" role="status" style={{ marginTop: "12px", marginBottom: "16px" }}>
            <span>{undoLabel}</span>
            <button type="button" onClick={() => setMessage(undoLastChange().message)}>Undo</button>
          </div>
        ) : null}

        {message ? (
          <p className="j-success-message" role="status" style={{ marginTop: "12px", marginBottom: "16px" }}>
            {message}
          </p>
        ) : null}

        <div className="j-settings-container" style={{ marginTop: "16px" }}>
          {/* SECTION 1: TRADING ACCOUNTS */}
          <AccountSettingsClient onMessage={setMessage}/>

          {/* SECTION 2: CTRADER LIVE AUTO-SYNC */}
          <section className="j-panel j-settings-section" id="import-ctrader-sync">
            <div className="j-panel-head">
              <div>
                <h2><T th="cTrader Live Auto-Sync (ซิงค์อัตโนมัติ)" en="cTrader Live Auto-Sync"/></h2>
                <p><T th="เชื่อมต่อบัญชี cTrader ผ่าน Open API OAuth เพื่อดึงรายการเทรดสดเข้ามาอัตโนมัติ" en="Direct connection to cTrader Open API OAuth for seamless on-demand trade syncing"/></p>
              </div>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 600,
                background: connectedPorts.length > 0 || hasConnection ? "var(--j-up-tint, rgba(16, 185, 129, 0.12))" : "var(--j-soft)",
                color: connectedPorts.length > 0 || hasConnection ? "var(--j-positive, #10b981)" : "var(--j-muted)",
                border: `1px solid ${connectedPorts.length > 0 || hasConnection ? "var(--j-up-line, rgba(16, 185, 129, 0.35))" : "var(--j-line)"}`
              }}>
                <span style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: connectedPorts.length > 0 || hasConnection ? "var(--j-positive, #10b981)" : "var(--j-muted)",
                  boxShadow: connectedPorts.length > 0 || hasConnection ? "0 0 8px var(--j-positive, #10b981)" : "none"
                }}/>
                {connectedPorts.length > 0 || hasConnection ? <T th="เชื่อมต่อแล้ว (Connected)" en="Connected"/> : <T th="ยังไม่ได้เชื่อมต่อ (Disconnected)" en="Disconnected"/>}
              </span>
            </div>

            <div className="j-connection-card">
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <strong style={{ fontSize: "14px" }}><T th="สถานะการเชื่อมต่อบัญชีเทรด" en="Broker Connection Status"/></strong>
                {isLoadingAccounts ? (
                  <small style={{ color: 'var(--j-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg className="spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                    <T th="กำลังตรวจสอบการเชื่อมต่อ..." en="Checking connection details..."/>
                  </small>
                ) : connectedPorts.length > 0 ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <small style={{ color: 'var(--j-ink, #fff)', fontWeight: 600 }}>
                      <T th="บัญชีที่ผูก:" en="Linked Accounts:"/>
                    </small>
                    {connectedPorts.map(p => (
                      <code key={p.id} style={{ background: "var(--j-panel)", border: "1px solid var(--j-line)", padding: "3px 8px", borderRadius: "4px", fontSize: "12px", color: "var(--j-ink, #fff)" }}>
                        {p.isLive ? 'Live' : 'Demo'} #{p.id}
                      </code>
                    ))}
                  </div>
                ) : (
                  <small style={{ color: 'var(--j-muted)' }}>
                    <T th="คลิกปุ่ม Connect ด้านขวาเพื่อเชื่อมต่อกับ cTrader" en="Click Connect to authenticate with your cTrader account"/>
                  </small>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: "wrap" }}>
                <a
                  href={`/api/ctrader/auth?tradingAccountId=${activeAccountId}`}
                  className="j-primary-button"
                  style={{ padding: "9px 18px", fontSize: "13px" }}
                >
                  <JournalIcon name="zap" size={14}/>
                  <T th="Connect cTrader" en="Connect cTrader"/>
                </a>

                {(connectedPorts.length > 0 || hasConnection) && (
                  <>
                    <button
                      type="button"
                      className="j-secondary-button"
                      disabled={isSyncingCtrader}
                      onClick={handleSyncCtrader}
                      style={{ padding: "9px 16px", fontSize: "13px" }}
                    >
                      <JournalIcon name="search" size={14}/>
                      <T th="ซิงค์ทันที (Sync Now)" en="Sync Live Now"/>
                    </button>

                    <button
                      type="button"
                      onClick={disconnectCTrader}
                      className="j-secondary-button"
                      style={{ padding: "9px 14px", fontSize: "13px", color: "var(--j-ink, #e5e5ea)" }}
                    >
                      <T th="ตัดการเชื่อมต่อ" en="Disconnect"/>
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 3: MANUAL CTRADER CSV IMPORT */}
          <section className="j-panel j-settings-section" id="import-csv">
            <div className="j-panel-head">
              <div>
                <h2><T th="cTrader CSV Import (นำเข้าไฟล์)" en="cTrader CSV Import"/></h2>
                <p><T th="อัปโหลดไฟล์ Statement CSV ที่ Export จากโปรแกรม cTrader Desktop หรือ Web" en="Manually upload a CSV exported from cTrader Desktop / Web"/></p>
              </div>
              <span style={{ fontSize: "12px", color: "var(--j-muted)" }}>
                <T th="สูงสุด" en="Max limit:"/> {MAX_CTRADER_CSV_BYTES / 1024 / 1024} MiB
              </span>
            </div>

            <div className="j-import-zone">
              <JournalIcon name="upload" size={32}/>
              <b style={{ fontSize: "15px" }}><T th="ลากไฟล์ CSV มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์" en="Drop or choose a cTrader CSV"/></b>
              <p style={{ fontSize: "12px", color: "var(--j-muted)", margin: "0" }}>
                <T th="ระบบจะตรวจสอบและ Preview รายการก่อนบันทึกจริงเข้าสู่บัญชี" en="Preview and verify orders before saving into"/> <strong style={{ color: "var(--j-ink)" }}>{accounts.find((account) => account.id === activeAccountId)?.name}</strong>
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "10px" }}>
                <label className={`j-primary-button j-file-button${isReadOnly ? " is-disabled" : ""}`} style={{ padding: "9px 20px", fontSize: "13px" }}>
                  <JournalIcon name="upload" size={14}/>
                  <T th="เลือกไฟล์ CSV" en="Choose CSV"/>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    aria-label="Choose cTrader CSV"
                    disabled={isReadOnly}
                    onClick={(event) => { event.currentTarget.value = ""; }}
                    onChange={(event) => event.target.files?.[0] ? void readCsv(event.target.files[0]) : undefined}
                  />
                </label>

                <button
                  type="button"
                  className="j-text-link"
                  disabled={isReadOnly}
                  onClick={() => {
                    setImportReceipt(null);
                    setPreview(parseCtraderCsv(SAMPLE_CTRADER_CSV, "sample-ctrader.csv", { accountId: activeAccountId }));
                    setMessage("");
                  }}
                  style={{ fontSize: "12px" }}
                >
                  <T th="ทดลองโหลดไฟล์ตัวอย่าง (Sample CSV)" en="Load sample CSV"/>
                </button>
              </div>
            </div>

            {preview && previewCounts ? (
              <div className="j-import-preview">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "15px", margin: "0" }}>{preview.fileName}</h3>
                  <button
                    className="j-primary-button"
                    disabled={preview.trades.length === 0 || isReadOnly}
                    onClick={importPreview}
                    style={{ padding: "8px 18px" }}
                  >
                    <T th={`ยืนยันนำเข้า ${preview.trades.length} ออเดอร์`} en={`Import ${preview.trades.length} trades`}/>
                  </button>
                </div>

                <div className="j-import-counts">
                  <span>Ready trades: <b>{previewCounts.readyTrades}</b></span>
                  <span>Missing risk: <b>{previewCounts.missingRiskTrades}</b></span>
                  <span>Duplicates: <b>{previewCounts.duplicateRows}</b></span>
                  <span>Rejected: <b>{previewCounts.rejectedRows}</b></span>
                </div>

                {previewIssueWindow.visible.length > 0 ? (
                  <ul style={{ maxHeight: "160px", overflowY: "auto", fontSize: "12px", background: "var(--j-panel)", padding: "10px 16px", borderRadius: "4px", border: "1px solid var(--j-line)" }}>
                    {previewIssueWindow.visible.map((issue, index) => (
                      <li key={`${issue.row}-${index}`} data-kind={issue.kind} style={{ marginBottom: "4px" }}>
                        Row {issue.row}: {issue.message}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            {importReceipt ? (
              <div
                ref={importReceiptRef}
                className={`j-import-receipt${importReceipt.status === "undone" ? " is-undone" : ""}`}
                role="status"
                tabIndex={-1}
                style={{ marginTop: "16px" }}
              >
                <div>
                  <span className="j-kicker">{importReceipt.fileName}</span>
                  <h3>{importReceipt.status === "undone" ? "Import undone" : importReceipt.importedCount + importReceipt.updatedCount > 0 ? "Import complete" : "Already imported"}</h3>
                  <p>
                    {importReceipt.status === "undone"
                      ? <T th="คืนชุดข้อมูลก่อน Import แล้ว ไม่มีรายการค้างอยู่" en="Reverted to the pre-import state — nothing from this action remains"/>
                      : `${importReceipt.importedCount} new · ${importReceipt.updatedCount} updated · ${importReceipt.duplicateCount} duplicate`}
                  </p>
                </div>
                <div className="j-import-receipt-actions">
                  <Link className="j-primary-button" href={buildJournalHref("/journal/trades", range)}>
                    <T th="ดูรายการ Trades" en="View trades"/>
                  </Link>
                  {importReceipt.status === "committed" && importReceipt.committedRevision === revision && canUndo ? (
                    <button className="j-text-link" type="button" onClick={undoImport}>
                      Undo import
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>

          {/* SECTION 4: MONTHLY PERFORMANCE SUMMARY */}
          <section className="j-panel j-settings-section" id="monthly-summary">
            <div className="j-panel-head">
              <div>
                <h2><T th="การ์ดสรุปผลงานประจำเดือน (Monthly Performance Card)" en="Monthly Performance Summary Card"/></h2>
                <p><T th="การ์ดสรุปผลสถิติ Win Rate, Profit Factor และ R-Multiple ประจำเดือนสำหรับแชร์หรือบันทึก" en="Shareable monthly performance card with Win Rate, Profit Factor, and R-Multiple"/></p>
              </div>
            </div>
            <div style={{ marginTop: "8px" }}>
              <RCard trades={accountTrades} timeZone={activeAccount.reportingTimezone} currency={activeAccount.baseCurrency}/>
            </div>
          </section>

          {/* STAGING MATCH (IF ENABLED) */}
          {syncPreviewAvailable ? (
            <section className="j-panel j-settings-section" id="staging-match">
              <div className="j-panel-head">
                <div>
                  <h2>Staging Safety &amp; Read-only Match</h2>
                  <p>Compare browser state with staging database fingerprint.</p>
                </div>
                <button
                  className="j-secondary-button"
                  type="button"
                  disabled={syncPreview.kind === "loading"}
                  onClick={() => void checkStagingMatch()}
                >
                  {syncPreview.kind === "loading" ? "Checking…" : "Check staging match"}
                </button>
              </div>
              {syncPreview.kind === "ready" ? (
                <div className={`j-storage-notice${syncPreview.match ? " is-success" : " is-warning"}`} role="status">
                  <strong>{syncPreview.match ? "Exact staging match" : "Staging differs"}</strong>
                  <p>{syncPreview.remote.tradeCount} trades · {syncPreview.remote.executionCount} executions</p>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}
