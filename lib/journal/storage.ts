import {
  createJournalSnapshot,
  inferActiveAccountId,
  inferJournalAccounts,
  isStoredTradingAccount,
  journalSnapshotChecksum,
  validateJournalSnapshot,
} from "./accounts.ts";
import { journalDatasetChecksum } from "./integrity.ts";
import type { Execution, JournalSnapshot, JournalTrade, TradingAccount } from "./types";

export const JOURNAL_STORAGE_VERSION = 5;
export const JOURNAL_STORAGE_KEY = "cerfinits-journal-v5";
export const LEGACY_JOURNAL_STORAGE_KEYS = [
  "cerfinits-journal-v4",
  "cerfinits-journal-v3",
  "cerfinits-journal-v2",
] as const;
export const JOURNAL_CHECKSUM_ALGORITHM = "fnv1a32";
export const JOURNAL_STORAGE_MAX_CHARACTERS = 4_000_000;

export function journalStorageBudget(raw: string, currentCharacters = 0) {
  return {
    valid: raw.length <= JOURNAL_STORAGE_MAX_CHARACTERS
      || (currentCharacters > JOURNAL_STORAGE_MAX_CHARACTERS && raw.length < currentCharacters),
    characters: raw.length,
    limit: JOURNAL_STORAGE_MAX_CHARACTERS,
  };
}

export interface JournalStoragePayload extends JournalSnapshot {
  version: typeof JOURNAL_STORAGE_VERSION;
  savedAt: string;
  revision: number;
  checksumAlgorithm: typeof JOURNAL_CHECKSUM_ALGORITHM;
  datasetChecksum: string;
}

type LoadedSnapshot = {
  trades: JournalTrade[];
  accounts: TradingAccount[];
  activeAccountId: string;
  revision: number;
  checksum: string;
};

export type JournalLoadResult =
  | ({ kind: "empty"; rejected: 0 } & LoadedSnapshot)
  | ({ kind: "ready"; rejected: 0; migratedFrom?: number } & LoadedSnapshot)
  | ({ kind: "recovered"; rejected: number; message: string } & LoadedSnapshot)
  | ({ kind: "error"; rejected: number; message: string } & LoadedSnapshot);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNullableFiniteNumber(value: unknown): value is number | null {
  return value === null || isFiniteNumber(value);
}

function optionalString(value: unknown) {
  return value === undefined || typeof value === "string";
}

function optionalNumber(value: unknown) {
  return value === undefined || isFiniteNumber(value);
}

function isExecution(value: unknown): value is Execution {
  if (!isRecord(value)) return false;
  return typeof value.id === "string"
    && typeof value.tradeId === "string"
    && ["entry", "partial", "exit", "stop"].includes(String(value.type))
    && ["buy", "sell"].includes(String(value.side))
    && typeof value.executedAt === "string"
    && isFiniteNumber(value.quantity)
    && isFiniteNumber(value.price)
    && isFiniteNumber(value.fee)
    && optionalString(value.externalId)
    && optionalString(value.externalPositionId)
    && optionalNumber(value.commissionPnl)
    && optionalNumber(value.swapPnl)
    && optionalNumber(value.sourceRow)
    && optionalString(value.sourceHash);
}

export function isStoredJournalTrade(value: unknown): value is JournalTrade {
  if (!isRecord(value)) return false;
  return typeof value.id === "string"
    && typeof value.accountId === "string"
    && typeof value.symbol === "string"
    && ["buy", "sell"].includes(String(value.side))
    && typeof value.openedAt === "string"
    && typeof value.closedAt === "string"
    && isFiniteNumber(value.quantity)
    && isFiniteNumber(value.averageEntry)
    && isFiniteNumber(value.averageExit)
    && isNullableFiniteNumber(value.initialStop)
    && isNullableFiniteNumber(value.initialRiskAmount)
    && isFiniteNumber(value.grossPnl)
    && isFiniteNumber(value.fees)
    && optionalNumber(value.commissionPnl)
    && isFiniteNumber(value.swap)
    && isFiniteNumber(value.netPnl)
    && isNullableFiniteNumber(value.rMultiple)
    && typeof value.setup === "string"
    && typeof value.timeframe === "string"
    && typeof value.session === "string"
    && typeof value.marketCondition === "string"
    && typeof value.notes === "string"
    && Array.isArray(value.tags)
    && value.tags.every((tag) => typeof tag === "string")
    && Array.isArray(value.executions)
    && value.executions.every(isExecution)
    && ["seed", "manual", "ctrader-csv"].includes(String(value.source))
    && optionalString(value.externalPositionId)
    && optionalString(value.sourceEvidenceHash);
}

function inferredSnapshot(trades: JournalTrade[]) {
  const accounts = inferJournalAccounts(trades);
  return createJournalSnapshot(trades, accounts, inferActiveAccountId(accounts));
}

function loadShape(snapshot: JournalSnapshot, revision: number): LoadedSnapshot {
  return {
    ...snapshot,
    revision,
    checksum: journalSnapshotChecksum(snapshot),
  };
}

function error(message: string, rejected = 0): JournalLoadResult {
  const snapshot = inferredSnapshot([]);
  return { kind: "error", rejected, message, ...loadShape(snapshot, 0) };
}

function validMetadata(parsed: Record<string, unknown>) {
  return typeof parsed.savedAt === "string"
    && Number.isFinite(Date.parse(parsed.savedAt))
    && Number.isSafeInteger(parsed.revision)
    && Number(parsed.revision) >= 0
    && parsed.checksumAlgorithm === JOURNAL_CHECKSUM_ALGORITHM
    && typeof parsed.datasetChecksum === "string";
}

export function createJournalStoragePayload(
  trades: JournalTrade[],
  revision = 0,
  accounts = inferJournalAccounts(trades),
  activeAccountId = inferActiveAccountId(accounts),
): JournalStoragePayload {
  if (!Number.isSafeInteger(revision) || revision < 0) throw new Error("Journal revision is invalid");
  const validation = validateJournalSnapshot({ trades, accounts, activeAccountId });
  if (!validation.valid) throw new Error(validation.issues[0] ?? "Journal validation failed");
  return {
    version: JOURNAL_STORAGE_VERSION,
    savedAt: new Date().toISOString(),
    revision,
    checksumAlgorithm: JOURNAL_CHECKSUM_ALGORITHM,
    datasetChecksum: journalSnapshotChecksum(validation.snapshot),
    ...validation.snapshot,
  };
}

export function loadJournalPayload(raw: string | null): JournalLoadResult {
  if (raw == null) {
    const snapshot = inferredSnapshot([]);
    return { kind: "empty", rejected: 0, ...loadShape(snapshot, 0) };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return error("อ่านข้อมูล Journal ไม่ได้ กรุณาเก็บ raw payload ก่อนเริ่มใหม่");
  }
  if (!isRecord(parsed) || !Array.isArray(parsed.trades)) {
    return error("รูปแบบข้อมูล Journal ไม่ถูกต้อง ระบบหยุดการบันทึกเพื่อป้องกันข้อมูลทับ");
  }

  const version = parsed.version;
  if (version !== 2 && version !== 3 && version !== 4 && version !== JOURNAL_STORAGE_VERSION) {
    return error(`ไม่รองรับ Journal schema version ${String(version)}`, parsed.trades.length);
  }

  const structurallyValid = parsed.trades.filter(isStoredJournalTrade);
  const rejected = parsed.trades.length - structurallyValid.length;

  if (version === JOURNAL_STORAGE_VERSION) {
    if (rejected > 0) return error(`Journal v5 มี ${rejected} records ที่โครงสร้างเสียหาย`, rejected);
    if (!Array.isArray(parsed.accounts)
      || !parsed.accounts.every(isStoredTradingAccount)
      || typeof parsed.activeAccountId !== "string") {
      return error("Journal v5 มี account metadata ที่ไม่ถูกต้อง");
    }
    if (!validMetadata(parsed)) return error("Journal v5 metadata ไม่ถูกต้อง");
    const snapshot: JournalSnapshot = {
      accounts: parsed.accounts,
      activeAccountId: parsed.activeAccountId,
      trades: structurallyValid,
    };
    if (journalSnapshotChecksum(snapshot) !== parsed.datasetChecksum) {
      return error("Journal snapshot checksum ไม่ตรง ระบบเปิดแบบ read-only", structurallyValid.length);
    }
    const validation = validateJournalSnapshot(snapshot);
    if (!validation.valid) return error(`Journal validation ไม่ผ่าน: ${validation.issues[0]}`, validation.issues.length);
    return {
      kind: "ready",
      rejected: 0,
      ...loadShape(validation.snapshot, Number(parsed.revision)),
    };
  }

  if (version === 4) {
    if (rejected > 0) return error(`Journal v4 มี ${rejected} records ที่โครงสร้างเสียหาย`, rejected);
    if (!validMetadata(parsed)) return error("Journal v4 metadata ไม่ถูกต้อง");
    if (journalDatasetChecksum(structurallyValid) !== parsed.datasetChecksum) {
      return error("Journal v4 checksum ไม่ตรง ระบบเปิดแบบ read-only", structurallyValid.length);
    }
  }

  const snapshot = inferredSnapshot(structurallyValid);
  const validation = validateJournalSnapshot(snapshot);
  if (rejected > 0 || !validation.valid) {
    const totalRejected = rejected + validation.issues.length;
    const safeSnapshot = validation.valid ? validation.snapshot : inferredSnapshot([]);
    return {
      kind: "recovered",
      rejected: totalRejected,
      revision: 0,
      checksum: journalSnapshotChecksum(safeSnapshot),
      ...safeSnapshot,
      message: `กู้คืน schema v${String(version)} ได้บางส่วน แต่พบ ${totalRejected} ปัญหา ระบบยังไม่เขียนทับต้นฉบับ`,
    };
  }

  return {
    kind: "ready",
    rejected: 0,
    migratedFrom: Number(version),
    ...loadShape(validation.snapshot, version === 4 ? Number(parsed.revision) : 0),
  };
}

export function serializeJournalPayload(
  trades: JournalTrade[],
  revision = 0,
  pretty = false,
  accounts = inferJournalAccounts(trades),
  activeAccountId = inferActiveAccountId(accounts),
) {
  return JSON.stringify(
    createJournalStoragePayload(trades, revision, accounts, activeAccountId),
    null,
    pretty ? 2 : undefined,
  );
}
