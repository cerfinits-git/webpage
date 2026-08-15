import { canonicalJournalJson, fnv1a32, validateJournalDataset } from "./integrity.ts";
import type { JournalSnapshot, JournalTrade, TradingAccount } from "./types";

export const DEFAULT_JOURNAL_ACCOUNT: TradingAccount = {
  id: "ctrader-demo-01",
  name: "cTrader Demo 01",
  broker: "cTrader",
  externalAccountId: null,
  baseCurrency: "USD",
  reportingTimezone: "Asia/Bangkok",
};

const CURRENCY_PATTERN = /^[A-Z]{3,8}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validTimezone(value: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format(0);
    return true;
  } catch {
    return false;
  }
}

export function isStoredTradingAccount(value: unknown): value is TradingAccount {
  if (!isRecord(value)) return false;
  return typeof value.id === "string"
    && typeof value.name === "string"
    && typeof value.broker === "string"
    && (value.externalAccountId === null || typeof value.externalAccountId === "string")
    && typeof value.baseCurrency === "string"
    && typeof value.reportingTimezone === "string";
}

export function normalizeTradingAccount(account: TradingAccount): TradingAccount {
  return {
    id: account.id.trim(),
    name: account.name.trim(),
    broker: account.broker.trim(),
    externalAccountId: account.externalAccountId?.trim() || null,
    baseCurrency: account.baseCurrency.trim().toUpperCase(),
    reportingTimezone: account.reportingTimezone.trim(),
  };
}

export function validateTradingAccount(account: TradingAccount) {
  const normalized = normalizeTradingAccount(account);
  const issues: string[] = [];
  if (normalized.id.length < 1 || normalized.id.length > 160) issues.push("Account ID must be 1–160 characters");
  if (normalized.name.length < 1 || normalized.name.length > 120) issues.push("Account name must be 1–120 characters");
  if (normalized.broker.length < 1 || normalized.broker.length > 80) issues.push("Broker must be 1–80 characters");
  if (normalized.externalAccountId && normalized.externalAccountId.length > 160) issues.push("External account ID is too long");
  if (!CURRENCY_PATTERN.test(normalized.baseCurrency)) issues.push("Base currency must be 3–8 uppercase letters");
  if (!validTimezone(normalized.reportingTimezone)) issues.push("Reporting timezone must be a valid IANA timezone");
  return { valid: issues.length === 0, account: normalized, issues };
}

export function inferJournalAccounts(trades: JournalTrade[]) {
  const ids = [...new Set(trades.map((trade) => trade.accountId.trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));
  if (ids.length === 0) return [{ ...DEFAULT_JOURNAL_ACCOUNT }];
  return ids.map((id): TradingAccount => id === DEFAULT_JOURNAL_ACCOUNT.id
    ? { ...DEFAULT_JOURNAL_ACCOUNT }
    : {
        id,
        name: id,
        broker: "Unmapped",
        externalAccountId: null,
        baseCurrency: "USD",
        reportingTimezone: "Asia/Bangkok",
      });
}

export function inferActiveAccountId(accounts: TradingAccount[]) {
  return accounts.some((account) => account.id === DEFAULT_JOURNAL_ACCOUNT.id)
    ? DEFAULT_JOURNAL_ACCOUNT.id
    : accounts[0]?.id ?? DEFAULT_JOURNAL_ACCOUNT.id;
}

export function createJournalSnapshot(
  trades: JournalTrade[],
  accounts = inferJournalAccounts(trades),
  activeAccountId = inferActiveAccountId(accounts),
): JournalSnapshot {
  return { trades, accounts, activeAccountId };
}

export function validateJournalSnapshot(snapshot: JournalSnapshot) {
  const issues: string[] = [];
  if (!Array.isArray(snapshot.accounts)) {
    issues.push("Journal accounts must be an array");
  }
  const accounts: TradingAccount[] = [];
  const ids = new Set<string>();
  for (const account of (snapshot.accounts || [])) {
    const result = validateTradingAccount(account);
    if (!result.valid) issues.push(`${account.id || "account"}: ${result.issues[0]}`);
    if (ids.has(result.account.id)) issues.push(`Duplicate account ID: ${result.account.id}`);
    ids.add(result.account.id);
    accounts.push(result.account);
  }
  if (accounts.length > 0 && !ids.has(snapshot.activeAccountId)) {
    issues.push("Active account does not exist");
  }

  const semantic = validateJournalDataset(snapshot.trades);
  issues.push(...semantic.issues);
  for (const trade of semantic.trades) {
    if (!ids.has(trade.accountId)) issues.push(`${trade.id}: account does not exist`);
  }
  return {
    valid: issues.length === 0,
    snapshot: {
      accounts,
      activeAccountId: snapshot.activeAccountId,
      trades: semantic.trades,
    } satisfies JournalSnapshot,
    issues,
  };
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, canonicalize(item)]),
    );
  }
  return value;
}

export function canonicalJournalSnapshotJson(snapshot: JournalSnapshot) {
  const normalized = {
    accounts: [...snapshot.accounts].sort((left, right) => left.id.localeCompare(right.id)),
    activeAccountId: snapshot.activeAccountId,
    trades: JSON.parse(canonicalJournalJson(snapshot.trades)) as unknown,
  };
  return JSON.stringify(canonicalize(normalized));
}

export function journalSnapshotChecksum(snapshot: JournalSnapshot) {
  return fnv1a32(canonicalJournalSnapshotJson(snapshot));
}

export async function journalSnapshotSha256(snapshot: JournalSnapshot) {
  const bytes = new TextEncoder().encode(canonicalJournalSnapshotJson(snapshot));
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function tradesForAccount(trades: JournalTrade[], accountId: string) {
  return trades.filter((trade) => trade.accountId === accountId);
}
