import {
  inferActiveAccountId,
  inferJournalAccounts,
  isStoredTradingAccount,
  journalSnapshotSha256,
  validateJournalSnapshot,
} from "./accounts.ts";
import { journalDatasetSha256, validateJournalDataset } from "./integrity.ts";
import { calculateJournalMetrics } from "./metrics.ts";
import { isStoredJournalTrade } from "./storage.ts";
import type { JournalSnapshot, JournalTrade, TradingAccount } from "./types";

export const JOURNAL_BACKUP_FORMAT = "cerfinits-journal-backup";
export const JOURNAL_BACKUP_VERSION = 2;

export interface JournalBackupEnvelope extends JournalSnapshot {
  format: typeof JOURNAL_BACKUP_FORMAT;
  schemaVersion: typeof JOURNAL_BACKUP_VERSION;
  createdAt: string;
  accountCount: number;
  tradeCount: number;
  checksumAlgorithm: "SHA-256";
  datasetChecksum: string;
}

export interface JournalBackupSummary {
  createdAt: string;
  accountCount: number;
  tradeCount: number;
  eligibleRCount: number;
  netR: number;
  datasetChecksum: string;
}

export type JournalBackupInspection =
  | {
      ok: true;
      accounts: TradingAccount[];
      activeAccountId: string;
      trades: JournalTrade[];
      summary: JournalBackupSummary;
      migratedFrom?: 1;
    }
  | { ok: false; message: string; raw: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasBaseEnvelopeShape(parsed: Record<string, unknown>) {
  return parsed.format === JOURNAL_BACKUP_FORMAT
    && parsed.checksumAlgorithm === "SHA-256"
    && typeof parsed.createdAt === "string"
    && Number.isFinite(Date.parse(parsed.createdAt))
    && Number.isSafeInteger(parsed.tradeCount)
    && Number(parsed.tradeCount) >= 0
    && typeof parsed.datasetChecksum === "string"
    && Array.isArray(parsed.trades);
}

function inspection(
  parsed: Record<string, unknown>,
  snapshot: JournalSnapshot,
  checksum: string,
  migratedFrom?: 1,
): JournalBackupInspection {
  const metrics = calculateJournalMetrics(snapshot.trades);
  return {
    ok: true,
    accounts: snapshot.accounts,
    activeAccountId: snapshot.activeAccountId,
    trades: snapshot.trades,
    summary: {
      createdAt: String(parsed.createdAt),
      accountCount: snapshot.accounts.length,
      tradeCount: snapshot.trades.length,
      eligibleRCount: metrics.sampleSize,
      netR: metrics.netR,
      datasetChecksum: checksum,
    },
    ...(migratedFrom ? { migratedFrom } : {}),
  };
}

export async function createJournalBackup(
  trades: JournalTrade[],
  accounts = inferJournalAccounts(trades),
  activeAccountId = inferActiveAccountId(accounts),
) {
  const semantic = validateJournalSnapshot({ trades, accounts, activeAccountId });
  if (!semantic.valid) throw new Error(semantic.issues[0] ?? "Journal validation failed");
  const envelope: JournalBackupEnvelope = {
    format: JOURNAL_BACKUP_FORMAT,
    schemaVersion: JOURNAL_BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    accountCount: semantic.snapshot.accounts.length,
    tradeCount: semantic.snapshot.trades.length,
    checksumAlgorithm: "SHA-256",
    datasetChecksum: await journalSnapshotSha256(semantic.snapshot),
    ...semantic.snapshot,
  };
  return JSON.stringify(envelope, null, 2);
}

export async function inspectJournalBackup(raw: string): Promise<JournalBackupInspection> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, message: "ไฟล์ backup ไม่ใช่ JSON ที่อ่านได้", raw };
  }

  if (!isRecord(parsed) || !hasBaseEnvelopeShape(parsed)) {
    return { ok: false, message: "รูปแบบ backup หรือ schema version ไม่รองรับ", raw };
  }
  if (parsed.schemaVersion !== 1 && parsed.schemaVersion !== JOURNAL_BACKUP_VERSION) {
    return { ok: false, message: "รูปแบบ backup หรือ schema version ไม่รองรับ", raw };
  }
  if (!(parsed.trades as unknown[]).every(isStoredJournalTrade)) {
    return { ok: false, message: "backup มี trade ที่โครงสร้างไม่ถูกต้อง", raw };
  }

  const trades = parsed.trades as JournalTrade[];
  if (parsed.tradeCount !== trades.length) {
    return { ok: false, message: "จำนวน trade ใน backup ไม่ตรงกับ metadata", raw };
  }

  if (parsed.schemaVersion === 1) {
    const semantic = validateJournalDataset(trades);
    if (!semantic.valid) return { ok: false, message: semantic.issues[0], raw };
    const checksum = await journalDatasetSha256(semantic.trades);
    if (checksum !== parsed.datasetChecksum) {
      return { ok: false, message: "SHA-256 checksum ไม่ตรง ไฟล์อาจเสียหายหรือถูกแก้ไข", raw };
    }
    const accounts = inferJournalAccounts(semantic.trades);
    return inspection(parsed, {
      accounts,
      activeAccountId: inferActiveAccountId(accounts),
      trades: semantic.trades,
    }, checksum, 1);
  }

  if (!Number.isSafeInteger(parsed.accountCount)
    || Number(parsed.accountCount) < 1
    || !Array.isArray(parsed.accounts)
    || !parsed.accounts.every(isStoredTradingAccount)
    || typeof parsed.activeAccountId !== "string") {
    return { ok: false, message: "backup มี account metadata ที่ไม่ถูกต้อง", raw };
  }
  if (parsed.accountCount !== parsed.accounts.length) {
    return { ok: false, message: "จำนวนบัญชีใน backup ไม่ตรงกับ metadata", raw };
  }

  const semantic = validateJournalSnapshot({
    accounts: parsed.accounts,
    activeAccountId: parsed.activeAccountId,
    trades,
  });
  if (!semantic.valid) return { ok: false, message: semantic.issues[0], raw };

  const checksum = await journalSnapshotSha256(semantic.snapshot);
  if (checksum !== parsed.datasetChecksum) {
    return { ok: false, message: "SHA-256 checksum ไม่ตรง ไฟล์อาจเสียหายหรือถูกแก้ไข", raw };
  }
  return inspection(parsed, semantic.snapshot, checksum);
}
