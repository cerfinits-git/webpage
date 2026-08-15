import { fnv1a32 } from "./integrity.ts";
import type { JournalTrade } from "./types";

export const JOURNAL_DOGFOOD_STORAGE_KEY = "cerfinits.journal.dogfood.v1";
export const JOURNAL_DOGFOOD_VERSION = 1;
export const JOURNAL_DOGFOOD_DURATION_MS = 14 * 24 * 60 * 60 * 1_000;
export const JOURNAL_DOGFOOD_MIN_COHORT = 10;
export const JOURNAL_DOGFOOD_MIN_IMPORTED = 10;
export const JOURNAL_DOGFOOD_RISK_TARGET = 0.95;
export const JOURNAL_DOGFOOD_CORRECTION_LIMIT = 0.1;

const MAX_DOGFOOD_TRADES = 20_000;
const MAX_DOGFOOD_INCIDENTS = 1_000;
const MAX_DOGFOOD_ACTIVE_DAYS = 400;

export type JournalDogfoodIncidentKind =
  | "storage-recovery"
  | "revision-conflict"
  | "persistence-failure";

export interface JournalDogfoodTradeEvidence {
  evidenceId: string;
  source: "manual" | "ctrader-csv";
  firstClosedAt: string;
  firstSeenAt: string;
  missingRiskAtFirstSeen: boolean;
  riskCompletedAt: string | null;
  currentRiskValid: boolean;
  present: boolean;
  deletedAt: string | null;
  restoredAt: string | null;
}

export interface JournalDogfoodIncident {
  id: string;
  kind: JournalDogfoodIncidentKind;
  occurredAt: string;
}

export interface JournalDogfoodLedger {
  version: 1;
  revision: number;
  startedAt: string;
  accountRef: string;
  reportingTimezone: string;
  activeDays: string[];
  trades: JournalDogfoodTradeEvidence[];
  incidents: JournalDogfoodIncident[];
  checksumAlgorithm: "fnv1a32";
  checksum: string;
}

export type JournalDogfoodLoadResult =
  | { kind: "empty" }
  | { kind: "ready"; ledger: JournalDogfoodLedger }
  | { kind: "error"; message: string; raw: string };

export type JournalDogfoodGateStatus =
  | "collecting"
  | "insufficient"
  | "local-ready"
  | "failed";

export interface JournalDogfoodSummary {
  status: JournalDogfoodGateStatus;
  elapsedMs: number;
  day: number;
  durationMet: boolean;
  activeDayCount: number;
  cohortTradeCount: number;
  deletedTradeCount: number;
  timelyRiskCount: number;
  timelyRiskRate: number | null;
  importedTradeCount: number;
  importCorrectionCount: number;
  importCorrectionRate: number | null;
  reliabilityIncidentCount: number;
  minimumCohortMet: boolean;
  minimumImportedMet: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isTimezone(value: unknown): value is string {
  if (typeof value !== "string" || value.length < 1 || value.length > 80) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date(0));
    return true;
  } catch {
    return false;
  }
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, canonicalize(item)]),
    );
  }
  return value;
}

function ledgerBody(ledger: Omit<JournalDogfoodLedger, "checksumAlgorithm" | "checksum">) {
  return {
    ...ledger,
    activeDays: [...ledger.activeDays].sort(),
    trades: [...ledger.trades].sort((left, right) => left.evidenceId.localeCompare(right.evidenceId)),
    incidents: [...ledger.incidents].sort((left, right) => left.occurredAt.localeCompare(right.occurredAt) || left.id.localeCompare(right.id)),
  };
}

function checksumBody(body: ReturnType<typeof ledgerBody>) {
  return fnv1a32(JSON.stringify(canonicalize(body)));
}

function sealLedger(body: Omit<JournalDogfoodLedger, "checksumAlgorithm" | "checksum">): JournalDogfoodLedger {
  const normalized = ledgerBody(body);
  return {
    ...normalized,
    checksumAlgorithm: "fnv1a32",
    checksum: checksumBody(normalized),
  };
}

function dateKey(iso: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function evidenceId(accountRef: string, tradeId: string) {
  return fnv1a32(`${accountRef}\u0000${tradeId}`);
}

export function journalDogfoodAccountRef(accountId: string) {
  return fnv1a32(accountId);
}

function validRisk(trade: JournalTrade) {
  return trade.initialRiskAmount != null
    && Number.isFinite(trade.initialRiskAmount)
    && trade.initialRiskAmount > 0;
}

function isEvidence(value: unknown): value is JournalDogfoodTradeEvidence {
  if (!isRecord(value)) return false;
  return typeof value.evidenceId === "string"
    && /^[0-9a-f]{8}$/.test(value.evidenceId)
    && (value.source === "manual" || value.source === "ctrader-csv")
    && isIsoDate(value.firstClosedAt)
    && isIsoDate(value.firstSeenAt)
    && typeof value.missingRiskAtFirstSeen === "boolean"
    && (value.riskCompletedAt === null || isIsoDate(value.riskCompletedAt))
    && typeof value.currentRiskValid === "boolean"
    && typeof value.present === "boolean"
    && (value.deletedAt === null || isIsoDate(value.deletedAt))
    && (value.restoredAt === null || isIsoDate(value.restoredAt));
}

function isIncident(value: unknown): value is JournalDogfoodIncident {
  if (!isRecord(value)) return false;
  return typeof value.id === "string"
    && /^[0-9a-f]{8}$/.test(value.id)
    && (value.kind === "storage-recovery"
      || value.kind === "revision-conflict"
      || value.kind === "persistence-failure")
    && isIsoDate(value.occurredAt);
}

export function createJournalDogfoodLedger(
  accountId: string,
  reportingTimezone: string,
  startedAt = new Date().toISOString(),
) {
  if (!accountId.trim() || accountId.length > 160) throw new Error("Dogfood account is invalid");
  if (!isTimezone(reportingTimezone)) throw new Error("Dogfood reporting timezone is invalid");
  if (!isIsoDate(startedAt)) throw new Error("Dogfood start time is invalid");
  const accountRef = journalDogfoodAccountRef(accountId);
  return sealLedger({
    version: JOURNAL_DOGFOOD_VERSION,
    revision: 0,
    startedAt,
    accountRef,
    reportingTimezone,
    activeDays: [dateKey(startedAt, reportingTimezone)],
    trades: [],
    incidents: [],
  });
}

export function serializeJournalDogfoodLedger(ledger: JournalDogfoodLedger) {
  const { checksumAlgorithm: _algorithm, checksum: _checksum, ...body } = ledger;
  return JSON.stringify(sealLedger(body));
}

export function loadJournalDogfoodLedger(raw: string | null): JournalDogfoodLoadResult {
  if (raw == null) return { kind: "empty" };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)
      || parsed.version !== JOURNAL_DOGFOOD_VERSION
      || !Number.isSafeInteger(parsed.revision)
      || Number(parsed.revision) < 0
      || !isIsoDate(parsed.startedAt)
      || typeof parsed.accountRef !== "string"
      || !/^[0-9a-f]{8}$/.test(parsed.accountRef)
      || !isTimezone(parsed.reportingTimezone)
      || !Array.isArray(parsed.activeDays)
      || parsed.activeDays.length > MAX_DOGFOOD_ACTIVE_DAYS
      || !parsed.activeDays.every((day) => typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day))
      || new Set(parsed.activeDays).size !== parsed.activeDays.length
      || !Array.isArray(parsed.trades)
      || parsed.trades.length > MAX_DOGFOOD_TRADES
      || !parsed.trades.every(isEvidence)
      || new Set(parsed.trades.map((item) => item.evidenceId)).size !== parsed.trades.length
      || !Array.isArray(parsed.incidents)
      || parsed.incidents.length > MAX_DOGFOOD_INCIDENTS
      || !parsed.incidents.every(isIncident)
      || new Set(parsed.incidents.map((item) => item.id)).size !== parsed.incidents.length
      || parsed.checksumAlgorithm !== "fnv1a32"
      || typeof parsed.checksum !== "string"
      || !/^[0-9a-f]{8}$/.test(parsed.checksum)) {
      throw new Error("Dogfood evidence schema is invalid");
    }
    const ledger = parsed as unknown as JournalDogfoodLedger;
    const { checksumAlgorithm: _algorithm, checksum, ...body } = ledger;
    if (checksumBody(ledgerBody(body)) !== checksum) throw new Error("Dogfood evidence checksum mismatch");
    return { kind: "ready", ledger: sealLedger(body) };
  } catch (error) {
    return {
      kind: "error",
      message: error instanceof Error ? error.message : "Dogfood evidence is invalid",
      raw,
    };
  }
}

export function observeJournalDogfoodLedger(
  ledger: JournalDogfoodLedger,
  trades: JournalTrade[],
  observedAt = new Date().toISOString(),
) {
  if (!isIsoDate(observedAt)) throw new Error("Dogfood observation time is invalid");
  const startedMs = Date.parse(ledger.startedAt);
  const byId = new Map(ledger.trades.map((item) => [item.evidenceId, { ...item }]));
  const currentEvidenceIds = new Set<string>();

  for (const trade of trades) {
    if (journalDogfoodAccountRef(trade.accountId) !== ledger.accountRef || trade.source === "seed") continue;
    const id = evidenceId(ledger.accountRef, trade.id);
    currentEvidenceIds.add(id);
    if (Date.parse(trade.closedAt) < startedMs && !byId.has(id)) continue;
    const riskIsValid = validRisk(trade);
    const existing = byId.get(id);
    if (!existing) {
      byId.set(id, {
        evidenceId: id,
        source: trade.source,
        firstClosedAt: trade.closedAt,
        firstSeenAt: observedAt,
        missingRiskAtFirstSeen: !riskIsValid,
        riskCompletedAt: riskIsValid ? observedAt : null,
        currentRiskValid: riskIsValid,
        present: true,
        deletedAt: null,
        restoredAt: null,
      });
      continue;
    }
    if (!existing.present) {
      existing.present = true;
      existing.restoredAt = observedAt;
    }
    existing.currentRiskValid = riskIsValid;
    if (riskIsValid && existing.riskCompletedAt == null) existing.riskCompletedAt = observedAt;
  }

  for (const item of byId.values()) {
    if (item.present && !currentEvidenceIds.has(item.evidenceId)) {
      item.present = false;
      item.deletedAt = observedAt;
    }
  }

  const activeDays = new Set(ledger.activeDays);
  activeDays.add(dateKey(observedAt, ledger.reportingTimezone));
  const nextBody = ledgerBody({
    version: JOURNAL_DOGFOOD_VERSION,
    revision: ledger.revision,
    startedAt: ledger.startedAt,
    accountRef: ledger.accountRef,
    reportingTimezone: ledger.reportingTimezone,
    activeDays: [...activeDays],
    trades: [...byId.values()],
    incidents: ledger.incidents,
  });
  const currentComparable = ledgerBody({
    version: JOURNAL_DOGFOOD_VERSION,
    revision: ledger.revision,
    startedAt: ledger.startedAt,
    accountRef: ledger.accountRef,
    reportingTimezone: ledger.reportingTimezone,
    activeDays: ledger.activeDays,
    trades: ledger.trades,
    incidents: ledger.incidents,
  });
  if (JSON.stringify(canonicalize(nextBody)) === JSON.stringify(canonicalize(currentComparable))) return ledger;
  return sealLedger({ ...nextBody, revision: ledger.revision + 1 });
}

export function addJournalDogfoodIncident(
  ledger: JournalDogfoodLedger,
  kind: JournalDogfoodIncidentKind,
  occurredAt = new Date().toISOString(),
) {
  if (!isIsoDate(occurredAt)) throw new Error("Dogfood incident time is invalid");
  if (ledger.incidents.length >= MAX_DOGFOOD_INCIDENTS) throw new Error("Dogfood incident safety limit exceeded");
  let counter = 0;
  let id = fnv1a32(`${kind}\u0000${occurredAt}\u0000${ledger.revision}\u0000${counter}`);
  const used = new Set(ledger.incidents.map((item) => item.id));
  while (used.has(id)) {
    counter += 1;
    id = fnv1a32(`${kind}\u0000${occurredAt}\u0000${ledger.revision}\u0000${counter}`);
  }
  const activeDays = new Set(ledger.activeDays);
  activeDays.add(dateKey(occurredAt, ledger.reportingTimezone));
  return sealLedger({
    version: JOURNAL_DOGFOOD_VERSION,
    revision: ledger.revision + 1,
    startedAt: ledger.startedAt,
    accountRef: ledger.accountRef,
    reportingTimezone: ledger.reportingTimezone,
    activeDays: [...activeDays],
    trades: ledger.trades,
    incidents: [...ledger.incidents, { id, kind, occurredAt }],
  });
}

export function summarizeJournalDogfood(
  ledger: JournalDogfoodLedger,
  now = new Date().toISOString(),
): JournalDogfoodSummary {
  if (!isIsoDate(now)) throw new Error("Dogfood summary time is invalid");
  const elapsedMs = Math.max(0, Date.parse(now) - Date.parse(ledger.startedAt));
  const durationMet = elapsedMs >= JOURNAL_DOGFOOD_DURATION_MS;
  const present = ledger.trades.filter((trade) => trade.present);
  const deletedTradeCount = ledger.trades.length - present.length;
  const timelyRiskCount = present.filter((trade) => (
    trade.currentRiskValid
      && trade.riskCompletedAt != null
      && Date.parse(trade.riskCompletedAt) <= Date.parse(trade.firstClosedAt) + 24 * 60 * 60 * 1_000
  )).length;
  const imported = present.filter((trade) => trade.source === "ctrader-csv");
  const importCorrectionCount = imported.filter((trade) => trade.missingRiskAtFirstSeen).length;
  const timelyRiskRate = present.length > 0 ? timelyRiskCount / present.length : null;
  const importCorrectionRate = imported.length > 0 ? importCorrectionCount / imported.length : null;
  const minimumCohortMet = present.length >= JOURNAL_DOGFOOD_MIN_COHORT;
  const minimumImportedMet = imported.length >= JOURNAL_DOGFOOD_MIN_IMPORTED;
  let status: JournalDogfoodGateStatus = "collecting";
  if (durationMet) {
    if (!minimumCohortMet || !minimumImportedMet) status = "insufficient";
    else if ((timelyRiskRate ?? 0) >= JOURNAL_DOGFOOD_RISK_TARGET
      && (importCorrectionRate ?? 1) <= JOURNAL_DOGFOOD_CORRECTION_LIMIT
      && ledger.incidents.length === 0) status = "local-ready";
    else status = "failed";
  }
  return {
    status,
    elapsedMs,
    day: Math.min(14, Math.floor(elapsedMs / (24 * 60 * 60 * 1_000)) + 1),
    durationMet,
    activeDayCount: ledger.activeDays.length,
    cohortTradeCount: present.length,
    deletedTradeCount,
    timelyRiskCount,
    timelyRiskRate,
    importedTradeCount: imported.length,
    importCorrectionCount,
    importCorrectionRate,
    reliabilityIncidentCount: ledger.incidents.length,
    minimumCohortMet,
    minimumImportedMet,
  };
}

export function createJournalDogfoodReport(
  ledger: JournalDogfoodLedger,
  generatedAt = new Date().toISOString(),
) {
  const summary = summarizeJournalDogfood(ledger, generatedAt);
  const reportBody = {
    kind: "cerfinits-journal-dogfood-report",
    version: 1,
    generatedAt,
    ledgerChecksum: ledger.checksum,
    summary,
    evidence: {
      startedAt: ledger.startedAt,
      accountRef: ledger.accountRef,
      reportingTimezone: ledger.reportingTimezone,
      activeDays: ledger.activeDays,
      trades: ledger.trades,
      incidents: ledger.incidents,
    },
    limitations: [
      "Local browser clock evidence; not tamper-proof.",
      "Contains no prices, P&L, notes, raw CSV, credentials, or remote rows.",
      "Local-ready does not prove Supabase staging or identity isolation.",
    ],
  };
  return {
    ...reportBody,
    reportChecksumAlgorithm: "fnv1a32" as const,
    reportChecksum: fnv1a32(JSON.stringify(canonicalize(reportBody))),
  };
}
