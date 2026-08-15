import type { TradeValidationIssue } from "./validation";

export type JournalDraftFocusField =
  | "symbol"
  | "openedAt"
  | "closedAt"
  | "quantity"
  | "entry"
  | "exit"
  | "risk"
  | "netPnl"
  | "stop"
  | "fees"
  | "swap"
  | "setup";

const DRAFT_FIELD_BY_TRADE_FIELD: Partial<
  Record<TradeValidationIssue["field"], JournalDraftFocusField>
> = {
  symbol: "symbol",
  openedAt: "openedAt",
  closedAt: "closedAt",
  quantity: "quantity",
  averageEntry: "entry",
  averageExit: "exit",
  initialRiskAmount: "risk",
  netPnl: "netPnl",
  initialStop: "stop",
  fees: "fees",
  swap: "swap",
  setup: "setup",
};

const ADVANCED_DRAFT_FIELDS = new Set<JournalDraftFocusField>([
  "stop",
  "fees",
  "swap",
]);

export function draftFieldForTradeIssue(
  field: TradeValidationIssue["field"],
): JournalDraftFocusField | null {
  return DRAFT_FIELD_BY_TRADE_FIELD[field] ?? null;
}

export function isAdvancedDraftField(field: JournalDraftFocusField) {
  return ADVANCED_DRAFT_FIELDS.has(field);
}
