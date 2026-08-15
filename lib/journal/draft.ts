import type { TradeSide } from "./types";
import { dateTimeInputInTimeZone, zonedDateTimeInputToIso } from "./timezone.ts";

export const JOURNAL_DRAFT_KEY = "cerfinits-journal-quick-add-draft-v1";
export const JOURNAL_DRAFT_STORAGE_PREFIX = "cerfinits.journal.quick-add-draft.v2";
export const JOURNAL_DRAFT_VERSION = 2;

const MAX_DRAFT_CHARACTERS = 200_000;
const DEFAULT_DRAFT_CONTEXT: JournalDraftContext = {
  accountId: "ctrader-demo-01",
  reportingTimezone: "Asia/Bangkok",
  baseCurrency: "USD",
};

export interface JournalDraftContext {
  accountId: string;
  reportingTimezone: string;
  baseCurrency: string;
}

export interface JournalDraftContextChanges {
  timezone: { from: string; to: string } | null;
  currency: { from: string; to: string } | null;
}

export interface JournalTradeDraft {
  version: typeof JOURNAL_DRAFT_VERSION;
  updatedAt: string;
  accountId: string;
  reportingTimezone: string;
  baseCurrency: string;
  currencyReviewFrom: string | null;
  side: TradeSide;
  symbol: string;
  openedAt: string;
  closedAt: string;
  quantity: string;
  entry: string;
  exit: string;
  stop: string;
  risk: string;
  netPnl: string;
  fees: string;
  swap: string;
  setup: string;
  timeframe: string;
  session: string;
  marketCondition: string;
  notes: string;
}

export type DraftLoadResult =
  | { kind: "empty" }
  | {
      kind: "ready";
      draft: JournalTradeDraft;
      migratedFrom?: 1;
      contextChanges?: JournalDraftContextChanges;
    }
  | { kind: "error"; raw: string; message: string };

function validTimezone(value: unknown): value is string {
  if (typeof value !== "string" || value.length < 1 || value.length > 80) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date(0));
    return true;
  } catch {
    return false;
  }
}

function validContext(context: JournalDraftContext) {
  return context.accountId.trim().length > 0
    && context.accountId.length <= 160
    && validTimezone(context.reportingTimezone)
    && /^[A-Z]{3,8}$/.test(context.baseCurrency);
}

function draftError(raw: string, message: string): DraftLoadResult {
  return { kind: "error", raw, message };
}

export function journalDraftStorageKey(accountId: string) {
  const normalized = accountId.trim();
  if (!normalized || normalized.length > 160) throw new Error("Draft account is invalid");
  return `${JOURNAL_DRAFT_STORAGE_PREFIX}:${encodeURIComponent(normalized)}`;
}

export function createEmptyJournalDraft(
  now = new Date(),
  timeZone = DEFAULT_DRAFT_CONTEXT.reportingTimezone,
  accountId = DEFAULT_DRAFT_CONTEXT.accountId,
  baseCurrency = DEFAULT_DRAFT_CONTEXT.baseCurrency,
): JournalTradeDraft {
  const context = { accountId, reportingTimezone: timeZone, baseCurrency };
  if (!Number.isFinite(now.getTime()) || !validContext(context)) {
    throw new Error("Draft context is invalid");
  }
  return {
    version: JOURNAL_DRAFT_VERSION,
    updatedAt: now.toISOString(),
    ...context,
    currencyReviewFrom: null,
    side: "buy",
    symbol: "",
    openedAt: dateTimeInputInTimeZone(now, timeZone),
    closedAt: dateTimeInputInTimeZone(now, timeZone),
    quantity: "",
    entry: "",
    exit: "",
    stop: "",
    risk: "",
    netPnl: "",
    fees: "0",
    swap: "0",
    setup: "Unmapped",
    timeframe: "M15",
    session: "Unmapped",
    marketCondition: "Unmapped",
    notes: "",
  };
}

export function parseJournalDraft(
  raw: string | null,
  expectedContext: JournalDraftContext = DEFAULT_DRAFT_CONTEXT,
): DraftLoadResult {
  if (raw == null) return { kind: "empty" };
  if (raw.length > MAX_DRAFT_CHARACTERS) return draftError(raw, "Draft ใหญ่เกิน local safety limit");
  if (!validContext(expectedContext)) return draftError(raw, "Account context ของ draft ไม่ถูกต้อง");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return draftError(raw, "อ่าน draft เดิมไม่ได้");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return draftError(raw, "รูปแบบ draft ไม่ถูกต้อง");
  }

  const source = parsed as Record<string, unknown>;
  const stringFields = [
    "updatedAt", "symbol", "openedAt", "closedAt", "quantity", "entry",
    "exit", "stop", "risk", "netPnl", "fees", "swap", "setup",
    "timeframe", "session", "marketCondition", "notes",
  ];
  if (!([1, JOURNAL_DRAFT_VERSION] as unknown[]).includes(source.version)
    || !["buy", "sell"].includes(String(source.side))
    || !stringFields.every((field) => typeof source[field] === "string")
    || (source.version === JOURNAL_DRAFT_VERSION
      && source.currencyReviewFrom !== null
      && !/^[A-Z]{3,8}$/.test(String(source.currencyReviewFrom)))
    || !Number.isFinite(Date.parse(String(source.updatedAt)))) {
    return draftError(raw, "Draft schema ไม่รองรับ");
  }

  const migratedFrom = source.version === 1 ? 1 as const : undefined;
  const sourceContext: JournalDraftContext = source.version === 1
    ? expectedContext
    : {
        accountId: String(source.accountId ?? ""),
        reportingTimezone: String(source.reportingTimezone ?? ""),
        baseCurrency: String(source.baseCurrency ?? ""),
      };
  if (!validContext(sourceContext)) return draftError(raw, "Draft account context ไม่ถูกต้อง");
  if (sourceContext.accountId !== expectedContext.accountId) {
    return draftError(raw, "Draft นี้เป็นของ trading account อื่น");
  }

  const sourceOpenedAt = String(source.openedAt);
  const sourceClosedAt = String(source.closedAt);
  const openedIso = zonedDateTimeInputToIso(sourceOpenedAt, sourceContext.reportingTimezone);
  const closedIso = zonedDateTimeInputToIso(sourceClosedAt, sourceContext.reportingTimezone);
  if (!openedIso || !closedIso) return draftError(raw, "เวลาใน draft ไม่ถูกต้องหรือกำกวม");

  const timezoneChange = sourceContext.reportingTimezone === expectedContext.reportingTimezone
    ? null
    : { from: sourceContext.reportingTimezone, to: expectedContext.reportingTimezone };
  const currencyChange = sourceContext.baseCurrency === expectedContext.baseCurrency
    ? null
    : { from: sourceContext.baseCurrency, to: expectedContext.baseCurrency };
  const contextChanges = timezoneChange || currencyChange
    ? { timezone: timezoneChange, currency: currencyChange }
    : undefined;

  const draft: JournalTradeDraft = {
    version: JOURNAL_DRAFT_VERSION,
    updatedAt: String(source.updatedAt),
    ...expectedContext,
    currencyReviewFrom: currencyChange
      ? sourceContext.baseCurrency
      : source.version === JOURNAL_DRAFT_VERSION
        ? source.currencyReviewFrom as string | null
        : null,
    side: source.side as TradeSide,
    symbol: String(source.symbol),
    openedAt: timezoneChange
      ? dateTimeInputInTimeZone(openedIso, expectedContext.reportingTimezone)
      : sourceOpenedAt,
    closedAt: timezoneChange
      ? dateTimeInputInTimeZone(closedIso, expectedContext.reportingTimezone)
      : sourceClosedAt,
    quantity: String(source.quantity),
    entry: String(source.entry),
    exit: String(source.exit),
    stop: String(source.stop),
    risk: String(source.risk),
    netPnl: String(source.netPnl),
    fees: String(source.fees),
    swap: String(source.swap),
    setup: String(source.setup),
    timeframe: String(source.timeframe),
    session: String(source.session),
    marketCondition: String(source.marketCondition),
    notes: String(source.notes),
  };

  return {
    kind: "ready",
    draft,
    ...(migratedFrom ? { migratedFrom } : {}),
    ...(contextChanges ? { contextChanges } : {}),
  };
}

export function serializeJournalDraft(draft: JournalTradeDraft) {
  const context = {
    accountId: draft.accountId,
    reportingTimezone: draft.reportingTimezone,
    baseCurrency: draft.baseCurrency,
  };
  if (!validContext(context)) throw new Error("Draft account context is invalid");
  return JSON.stringify({
    ...draft,
    version: JOURNAL_DRAFT_VERSION,
    updatedAt: new Date().toISOString(),
  });
}
