import { validateJournalDataset } from "./integrity.ts";
import { JOURNAL_STORAGE_VERSION } from "./storage.ts";
import type { Execution, JournalTrade } from "./types";

export const JOURNAL_SYNC_PROJECTION_VERSION = 1;
export const JOURNAL_SYNC_SHA256_PATTERN = /^[0-9a-f]{64}$/;
export const JOURNAL_SYNC_REMOTE_SOURCES = ["manual", "ctrader-csv"] as const;

type SyncExecution = {
  clientId: string;
  type: Execution["type"];
  side: Execution["side"];
  executedAt: string;
  quantity: number;
  price: number;
  fee: number;
  commissionPnl: number;
  swapPnl: number;
  externalId: string | null;
  externalPositionId: string | null;
  sourceHash: string | null;
};

type SyncTrade = {
  clientId: string;
  symbol: string;
  side: JournalTrade["side"];
  openedAt: string;
  closedAt: string;
  quantity: number;
  averageEntry: number;
  averageExit: number;
  initialStop: number | null;
  initialRiskAmount: number | null;
  grossPnl: number;
  commissionPnl: number;
  swapPnl: number;
  netPnl: number;
  setup: string;
  timeframe: string;
  session: string;
  marketCondition: string;
  notes: string;
  tags: string[];
  source: JournalTrade["source"];
  externalPositionId: string | null;
  sourceEvidenceHash: string | null;
  executions: SyncExecution[];
};

type SyncAccount = {
  accountClientId: string;
  trades: SyncTrade[];
};

type ParsedRemoteExecution = SyncExecution & { id: string; tradeId: string };
type ParsedRemoteTrade = Omit<SyncTrade, "executions"> & {
  id: string;
  accountId: string;
  executions: ParsedRemoteExecution[];
};

export type JournalSyncAccountFingerprint = {
  accountClientId: string;
  datasetSha256: string;
  tradeCount: number;
  executionCount: number;
  eligibleRCount: number;
  netR: number;
};

export type JournalSyncFingerprint = {
  projectionVersion: typeof JOURNAL_SYNC_PROJECTION_VERSION;
  datasetSha256: string;
  accountCount: number;
  tradeCount: number;
  executionCount: number;
  eligibleRCount: number;
  netR: number;
  accounts: JournalSyncAccountFingerprint[];
};

export type JournalSyncManifest = JournalSyncFingerprint & {
  storageSchemaVersion: typeof JOURNAL_STORAGE_VERSION;
  revision: number;
};

export type RemoteJournalRows = {
  accounts: unknown[];
  trades: unknown[];
  executions: unknown[];
};

export type JournalSyncDifference = {
  code:
    | "dataset-checksum"
    | "account-count"
    | "trade-count"
    | "execution-count"
    | "eligible-r-count"
    | "net-r"
    | "missing-account"
    | "extra-account"
    | "account-checksum"
    | "account-trade-count"
    | "account-execution-count"
    | "account-eligible-r-count"
    | "account-net-r";
  accountClientId?: string;
};

const PNL_TOLERANCE = 0.02;
const NET_R_TOLERANCE = 1e-9;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeNumber(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

function finiteNumber(value: unknown, label: string) {
  const parsed = typeof value === "number"
    ? value
    : typeof value === "string" && value.trim() !== ""
      ? Number(value)
      : Number.NaN;
  if (!Number.isFinite(parsed)) throw new Error(`${label} must be a finite number`);
  return normalizeNumber(parsed);
}

function nonNegativeInteger(value: unknown, label: string) {
  if (!Number.isSafeInteger(value) || Number(value) < 0) {
    throw new Error(`${label} must be a non-negative safe integer`);
  }
  return Number(value);
}

function nonEmptyString(value: unknown, label: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string`);
  }
  return value;
}

function stringValue(value: unknown, label: string) {
  if (typeof value !== "string") throw new Error(`${label} must be a string`);
  return value;
}

function nullableString(value: unknown, label: string) {
  if (value === null) return null;
  return stringValue(value, label);
}

function nullableNumber(value: unknown, label: string) {
  if (value === null) return null;
  return finiteNumber(value, label);
}

function normalizedDate(value: unknown, label: string) {
  const source = nonEmptyString(value, label);
  const timestamp = Date.parse(source);
  if (!Number.isFinite(timestamp)) throw new Error(`${label} must be a valid timestamp`);
  return new Date(timestamp).toISOString();
}

function oneOf<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
  label: string,
): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw new Error(`${label} is invalid`);
  }
  return value as T[number];
}

function stringArray(value: unknown, label: string) {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error(`${label} must be a string array`);
  }
  return [...value].sort((left, right) => left.localeCompare(right));
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

export function canonicalJournalSyncJson(value: unknown) {
  return JSON.stringify(canonicalize(value));
}

async function sha256(value: unknown) {
  const bytes = new TextEncoder().encode(canonicalJournalSyncJson(value));
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(
    new Uint8Array(digest),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
}

function projectExecution(execution: Execution): SyncExecution {
  const quantity = finiteNumber(execution.quantity, `${execution.id}.quantity`);
  const price = finiteNumber(execution.price, `${execution.id}.price`);
  const fee = finiteNumber(execution.fee, `${execution.id}.fee`);
  if (quantity <= 0 || price <= 0 || fee < 0) {
    throw new Error(`${execution.id} has invalid execution values`);
  }

  return {
    clientId: nonEmptyString(execution.id, "execution.id"),
    type: oneOf(execution.type, ["entry", "partial", "exit", "stop"] as const, `${execution.id}.type`),
    side: oneOf(execution.side, ["buy", "sell"] as const, `${execution.id}.side`),
    executedAt: normalizedDate(execution.executedAt, `${execution.id}.executedAt`),
    quantity,
    price,
    fee,
    commissionPnl: finiteNumber(execution.commissionPnl ?? -fee, `${execution.id}.commissionPnl`),
    swapPnl: finiteNumber(execution.swapPnl ?? 0, `${execution.id}.swapPnl`),
    externalId: execution.externalId ?? null,
    externalPositionId: execution.externalPositionId ?? null,
    sourceHash: execution.sourceHash ?? null,
  };
}

function projectTrade(trade: JournalTrade): SyncTrade {
  const openedAt = normalizedDate(trade.openedAt, `${trade.id}.openedAt`);
  const closedAt = normalizedDate(trade.closedAt, `${trade.id}.closedAt`);
  if (Date.parse(closedAt) < Date.parse(openedAt)) {
    throw new Error(`${trade.id}.closedAt must not precede openedAt`);
  }

  return {
    clientId: nonEmptyString(trade.id, "trade.id"),
    symbol: nonEmptyString(trade.symbol, `${trade.id}.symbol`),
    side: oneOf(trade.side, ["buy", "sell"] as const, `${trade.id}.side`),
    openedAt,
    closedAt,
    quantity: finiteNumber(trade.quantity, `${trade.id}.quantity`),
    averageEntry: finiteNumber(trade.averageEntry, `${trade.id}.averageEntry`),
    averageExit: finiteNumber(trade.averageExit, `${trade.id}.averageExit`),
    initialStop: trade.initialStop,
    initialRiskAmount: trade.initialRiskAmount,
    grossPnl: finiteNumber(trade.grossPnl, `${trade.id}.grossPnl`),
    commissionPnl: finiteNumber(trade.commissionPnl ?? -trade.fees, `${trade.id}.commissionPnl`),
    swapPnl: finiteNumber(trade.swap, `${trade.id}.swapPnl`),
    netPnl: finiteNumber(trade.netPnl, `${trade.id}.netPnl`),
    setup: nonEmptyString(trade.setup, `${trade.id}.setup`),
    timeframe: nonEmptyString(trade.timeframe, `${trade.id}.timeframe`),
    session: nonEmptyString(trade.session, `${trade.id}.session`),
    marketCondition: nonEmptyString(trade.marketCondition, `${trade.id}.marketCondition`),
    notes: stringValue(trade.notes, `${trade.id}.notes`),
    tags: [...trade.tags].sort((left, right) => left.localeCompare(right)),
    source: oneOf(trade.source, JOURNAL_SYNC_REMOTE_SOURCES, `${trade.id}.source`),
    externalPositionId: trade.externalPositionId ?? null,
    sourceEvidenceHash: trade.sourceEvidenceHash ?? null,
    executions: [...trade.executions]
      .sort((left, right) => left.id.localeCompare(right.id))
      .map(projectExecution),
  };
}

function localAccounts(trades: JournalTrade[]) {
  const semantic = validateJournalDataset(trades);
  if (!semantic.valid) {
    throw new Error(semantic.issues[0] ?? "Journal dataset is invalid");
  }

  const grouped = new Map<string, JournalTrade[]>();
  for (const trade of semantic.trades) {
    if (trade.source === "seed") continue;
    const accountClientId = nonEmptyString(trade.accountId, `${trade.id}.accountId`);
    grouped.set(accountClientId, [...(grouped.get(accountClientId) ?? []), trade]);
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([accountClientId, accountTrades]): SyncAccount => ({
      accountClientId,
      trades: accountTrades
        .sort((left, right) => left.id.localeCompare(right.id))
        .map(projectTrade),
    }));
}

function accountMetrics(account: SyncAccount) {
  let eligibleRCount = 0;
  let netR = 0;
  for (const trade of account.trades) {
    if (trade.initialRiskAmount != null && trade.initialRiskAmount > 0) {
      eligibleRCount += 1;
      netR += trade.netPnl / trade.initialRiskAmount;
    }
  }
  return {
    tradeCount: account.trades.length,
    executionCount: account.trades.reduce(
      (total, trade) => total + trade.executions.length,
      0,
    ),
    eligibleRCount,
    netR: normalizeNumber(netR),
  };
}

async function fingerprint(accounts: SyncAccount[]): Promise<JournalSyncFingerprint> {
  const accountFingerprints = await Promise.all(
    accounts.map(async (account) => ({
      accountClientId: account.accountClientId,
      datasetSha256: await sha256(account),
      ...accountMetrics(account),
    })),
  );

  return {
    projectionVersion: JOURNAL_SYNC_PROJECTION_VERSION,
    datasetSha256: await sha256(accounts),
    accountCount: accounts.length,
    tradeCount: accountFingerprints.reduce((total, item) => total + item.tradeCount, 0),
    executionCount: accountFingerprints.reduce((total, item) => total + item.executionCount, 0),
    eligibleRCount: accountFingerprints.reduce((total, item) => total + item.eligibleRCount, 0),
    netR: normalizeNumber(accountFingerprints.reduce((total, item) => total + item.netR, 0)),
    accounts: accountFingerprints,
  };
}

export async function createJournalSyncManifest(
  trades: JournalTrade[],
  revision: number,
): Promise<JournalSyncManifest> {
  const safeRevision = nonNegativeInteger(revision, "revision");
  return {
    ...(await fingerprint(localAccounts(trades))),
    storageSchemaVersion: JOURNAL_STORAGE_VERSION,
    revision: safeRevision,
  };
}

function parseRemoteAccount(value: unknown, subject: string) {
  if (!isRecord(value)) throw new Error("Remote account row is invalid");
  if (value.user_id !== subject) throw new Error("Remote account ownership mismatch");
  return {
    id: nonEmptyString(value.id, "account.id"),
    clientId: nonEmptyString(value.client_id, "account.client_id"),
  };
}

function parseRemoteTrade(value: unknown, subject: string): ParsedRemoteTrade {
  if (!isRecord(value)) throw new Error("Remote trade row is invalid");
  if (value.user_id !== subject) throw new Error("Remote trade ownership mismatch");
  const openedAt = normalizedDate(value.opened_at, "trade.opened_at");
  const closedAt = normalizedDate(value.closed_at, "trade.closed_at");
  if (Date.parse(closedAt) < Date.parse(openedAt)) {
    throw new Error("Remote trade closes before it opens");
  }
  const quantity = finiteNumber(value.quantity, "trade.quantity");
  const averageEntry = finiteNumber(value.average_entry, "trade.average_entry");
  const averageExit = finiteNumber(value.average_exit, "trade.average_exit");
  const initialStop = nullableNumber(value.initial_stop, "trade.initial_stop");
  const initialRiskAmount = nullableNumber(value.initial_risk_amount, "trade.initial_risk_amount");
  const grossPnl = finiteNumber(value.gross_pnl, "trade.gross_pnl");
  const commissionPnl = finiteNumber(value.commission_pnl, "trade.commission_pnl");
  const swapPnl = finiteNumber(value.swap_pnl, "trade.swap_pnl");
  const netPnl = finiteNumber(value.net_pnl, "trade.net_pnl");
  if (quantity <= 0 || averageEntry <= 0 || averageExit <= 0
    || (initialStop != null && initialStop <= 0)
    || (initialRiskAmount != null && initialRiskAmount <= 0)) {
    throw new Error("Remote trade contains invalid positive values");
  }
  if (Math.abs(grossPnl + commissionPnl + swapPnl - netPnl) > PNL_TOLERANCE) {
    throw new Error("Remote trade P&L does not reconcile");
  }

  return {
    id: nonEmptyString(value.id, "trade.id"),
    accountId: nonEmptyString(value.account_id, "trade.account_id"),
    clientId: nonEmptyString(value.client_id, "trade.client_id"),
    symbol: nonEmptyString(value.symbol, "trade.symbol"),
    side: oneOf(value.side, ["buy", "sell"] as const, "trade.side"),
    openedAt,
    closedAt,
    quantity,
    averageEntry,
    averageExit,
    initialStop,
    initialRiskAmount,
    grossPnl,
    commissionPnl,
    swapPnl,
    netPnl,
    setup: nonEmptyString(value.setup, "trade.setup"),
    timeframe: nonEmptyString(value.timeframe, "trade.timeframe"),
    session: nonEmptyString(value.session, "trade.session"),
    marketCondition: nonEmptyString(value.market_condition, "trade.market_condition"),
    notes: stringValue(value.notes, "trade.notes"),
    tags: stringArray(value.tags, "trade.tags"),
    source: oneOf(value.source, JOURNAL_SYNC_REMOTE_SOURCES, "trade.source"),
    externalPositionId: nullableString(value.external_position_id, "trade.external_position_id"),
    sourceEvidenceHash: nullableString(value.source_evidence_hash, "trade.source_evidence_hash"),
    executions: [],
  };
}

function parseRemoteExecution(value: unknown, subject: string): ParsedRemoteExecution {
  if (!isRecord(value)) throw new Error("Remote execution row is invalid");
  if (value.user_id !== subject) throw new Error("Remote execution ownership mismatch");
  const quantity = finiteNumber(value.quantity, "execution.quantity");
  const price = finiteNumber(value.price, "execution.price");
  const fee = finiteNumber(value.fee, "execution.fee");
  if (quantity <= 0 || price <= 0 || fee < 0) {
    throw new Error("Remote execution contains invalid positive values");
  }
  return {
    id: nonEmptyString(value.id, "execution.id"),
    tradeId: nonEmptyString(value.trade_id, "execution.trade_id"),
    clientId: nonEmptyString(value.client_id, "execution.client_id"),
    type: oneOf(value.execution_type, ["entry", "partial", "exit", "stop"] as const, "execution.execution_type"),
    side: oneOf(value.side, ["buy", "sell"] as const, "execution.side"),
    executedAt: normalizedDate(value.executed_at, "execution.executed_at"),
    quantity,
    price,
    fee,
    commissionPnl: finiteNumber(value.commission_pnl, "execution.commission_pnl"),
    swapPnl: finiteNumber(value.swap_pnl, "execution.swap_pnl"),
    externalId: nullableString(value.external_id, "execution.external_id"),
    externalPositionId: nullableString(value.external_position_id, "execution.external_position_id"),
    sourceHash: nullableString(value.source_hash, "execution.source_hash"),
  };
}

export async function createRemoteJournalSyncFingerprint(
  rows: RemoteJournalRows,
  subject: string,
) {
  const accountById = new Map<string, ReturnType<typeof parseRemoteAccount>>();
  const accountClientIds = new Set<string>();
  for (const row of rows.accounts) {
    const account = parseRemoteAccount(row, subject);
    if (accountById.has(account.id) || accountClientIds.has(account.clientId)) {
      throw new Error("Duplicate remote account identity");
    }
    accountById.set(account.id, account);
    accountClientIds.add(account.clientId);
  }

  const tradeById = new Map<string, ReturnType<typeof parseRemoteTrade>>();
  const tradeClientIdsByAccount = new Set<string>();
  for (const row of rows.trades) {
    const trade = parseRemoteTrade(row, subject);
    const account = accountById.get(trade.accountId);
    if (!account) throw new Error("Remote trade has no owned account parent");
    const composite = `${trade.accountId}\u0000${trade.clientId}`;
    if (tradeById.has(trade.id) || tradeClientIdsByAccount.has(composite)) {
      throw new Error("Duplicate remote trade identity");
    }
    tradeById.set(trade.id, trade);
    tradeClientIdsByAccount.add(composite);
  }

  const executionIds = new Set<string>();
  const executionClientIdsByTrade = new Set<string>();
  for (const row of rows.executions) {
    const execution = parseRemoteExecution(row, subject);
    const trade = tradeById.get(execution.tradeId);
    if (!trade) throw new Error("Remote execution has no owned trade parent");
    const composite = `${execution.tradeId}\u0000${execution.clientId}`;
    if (executionIds.has(execution.id) || executionClientIdsByTrade.has(composite)) {
      throw new Error("Duplicate remote execution identity");
    }
    executionIds.add(execution.id);
    executionClientIdsByTrade.add(composite);
    trade.executions.push(execution);
  }

  const grouped = new Map<string, SyncTrade[]>();
  for (const trade of tradeById.values()) {
    const account = accountById.get(trade.accountId);
    if (!account) throw new Error("Remote trade account mapping failed");
    const { id: _id, accountId: _accountId, ...projected } = trade;
    const executions = projected.executions
      .map(({ id: _executionId, tradeId: _tradeId, ...execution }) => execution)
      .sort((left, right) => left.clientId.localeCompare(right.clientId));
    grouped.set(account.clientId, [
      ...(grouped.get(account.clientId) ?? []),
      { ...projected, executions },
    ]);
  }

  const accounts = [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([accountClientId, trades]): SyncAccount => ({
      accountClientId,
      trades: trades.sort((left, right) => left.clientId.localeCompare(right.clientId)),
    }));
  return fingerprint(accounts);
}

function parseAccountFingerprint(value: unknown): JournalSyncAccountFingerprint {
  if (!isRecord(value)) throw new Error("Account fingerprint is invalid");
  const datasetSha256 = stringValue(value.datasetSha256, "account.datasetSha256");
  if (!JOURNAL_SYNC_SHA256_PATTERN.test(datasetSha256)) {
    throw new Error("Account fingerprint SHA-256 is invalid");
  }
  const parsed = {
    accountClientId: nonEmptyString(value.accountClientId, "account.accountClientId"),
    datasetSha256,
    tradeCount: nonNegativeInteger(value.tradeCount, "account.tradeCount"),
    executionCount: nonNegativeInteger(value.executionCount, "account.executionCount"),
    eligibleRCount: nonNegativeInteger(value.eligibleRCount, "account.eligibleRCount"),
    netR: finiteNumber(value.netR, "account.netR"),
  };
  if (parsed.eligibleRCount > parsed.tradeCount) {
    throw new Error("Account fingerprint totals are inconsistent");
  }
  return parsed;
}

export function parseJournalSyncManifest(value: unknown): JournalSyncManifest {
  if (!isRecord(value) || !Array.isArray(value.accounts)) {
    throw new Error("Journal sync manifest is invalid");
  }
  if (value.projectionVersion !== JOURNAL_SYNC_PROJECTION_VERSION
    || value.storageSchemaVersion !== JOURNAL_STORAGE_VERSION) {
    throw new Error("Journal sync manifest version is unsupported");
  }
  const datasetSha256 = stringValue(value.datasetSha256, "datasetSha256");
  if (!JOURNAL_SYNC_SHA256_PATTERN.test(datasetSha256)) {
    throw new Error("Journal sync manifest SHA-256 is invalid");
  }
  const accounts = value.accounts.map(parseAccountFingerprint);
  const accountIds = new Set(accounts.map((account) => account.accountClientId));
  if (accountIds.size !== accounts.length) {
    throw new Error("Journal sync manifest has duplicate accounts");
  }
  const parsed: JournalSyncManifest = {
    projectionVersion: JOURNAL_SYNC_PROJECTION_VERSION,
    storageSchemaVersion: JOURNAL_STORAGE_VERSION,
    revision: nonNegativeInteger(value.revision, "revision"),
    datasetSha256,
    accountCount: nonNegativeInteger(value.accountCount, "accountCount"),
    tradeCount: nonNegativeInteger(value.tradeCount, "tradeCount"),
    executionCount: nonNegativeInteger(value.executionCount, "executionCount"),
    eligibleRCount: nonNegativeInteger(value.eligibleRCount, "eligibleRCount"),
    netR: finiteNumber(value.netR, "netR"),
    accounts,
  };
  const totals = accounts.reduce(
    (total, account) => ({
      tradeCount: total.tradeCount + account.tradeCount,
      executionCount: total.executionCount + account.executionCount,
      eligibleRCount: total.eligibleRCount + account.eligibleRCount,
      netR: total.netR + account.netR,
    }),
    { tradeCount: 0, executionCount: 0, eligibleRCount: 0, netR: 0 },
  );
  if (parsed.accountCount !== accounts.length
    || parsed.tradeCount !== totals.tradeCount
    || parsed.executionCount !== totals.executionCount
    || parsed.eligibleRCount !== totals.eligibleRCount
    || Math.abs(parsed.netR - totals.netR) > NET_R_TOLERANCE
    || parsed.eligibleRCount > parsed.tradeCount) {
    throw new Error("Journal sync manifest totals are inconsistent");
  }
  return parsed;
}

export function reconcileJournalSync(
  local: JournalSyncManifest,
  remote: JournalSyncFingerprint,
) {
  const differences: JournalSyncDifference[] = [];
  const compare = (
    mismatch: boolean,
    code: JournalSyncDifference["code"],
    accountClientId?: string,
  ) => {
    if (mismatch) differences.push({ code, ...(accountClientId ? { accountClientId } : {}) });
  };

  compare(local.datasetSha256 !== remote.datasetSha256, "dataset-checksum");
  compare(local.accountCount !== remote.accountCount, "account-count");
  compare(local.tradeCount !== remote.tradeCount, "trade-count");
  compare(local.executionCount !== remote.executionCount, "execution-count");
  compare(local.eligibleRCount !== remote.eligibleRCount, "eligible-r-count");
  compare(Math.abs(local.netR - remote.netR) > NET_R_TOLERANCE, "net-r");

  const localAccounts = new Map(local.accounts.map((account) => [account.accountClientId, account]));
  const remoteAccounts = new Map(remote.accounts.map((account) => [account.accountClientId, account]));
  for (const [accountClientId, account] of localAccounts) {
    const observed = remoteAccounts.get(accountClientId);
    if (!observed) {
      differences.push({ code: "missing-account", accountClientId });
      continue;
    }
    compare(account.datasetSha256 !== observed.datasetSha256, "account-checksum", accountClientId);
    compare(account.tradeCount !== observed.tradeCount, "account-trade-count", accountClientId);
    compare(account.executionCount !== observed.executionCount, "account-execution-count", accountClientId);
    compare(account.eligibleRCount !== observed.eligibleRCount, "account-eligible-r-count", accountClientId);
    compare(Math.abs(account.netR - observed.netR) > NET_R_TOLERANCE, "account-net-r", accountClientId);
  }
  for (const accountClientId of remoteAccounts.keys()) {
    if (!localAccounts.has(accountClientId)) {
      differences.push({ code: "extra-account", accountClientId });
    }
  }

  return { match: differences.length === 0, differences: differences.slice(0, 100) };
}
