import type { JournalTrade } from "./types";

export interface TradeValidationIssue {
  field: keyof JournalTrade | "executions";
  message: string;
}

function isPositiveFinite(value: number) {
  return Number.isFinite(value) && value > 0;
}

export function hasValidInitialRisk(trade: JournalTrade) {
  return trade.initialRiskAmount != null && isPositiveFinite(trade.initialRiskAmount);
}

export function validateJournalTrade(
  trade: JournalTrade,
  options: { requireRisk?: boolean } = {},
) {
  const issues: TradeValidationIssue[] = [];
  const openedAt = Date.parse(trade.openedAt);
  const closedAt = Date.parse(trade.closedAt);

  if (!trade.symbol.trim()) issues.push({ field: "symbol", message: "กรุณาระบุ Symbol" });
  if (!Number.isFinite(openedAt)) issues.push({ field: "openedAt", message: "เวลาเปิด trade ไม่ถูกต้อง" });
  if (!Number.isFinite(closedAt)) issues.push({ field: "closedAt", message: "เวลาปิด trade ไม่ถูกต้อง" });
  if (Number.isFinite(openedAt) && Number.isFinite(closedAt) && closedAt < openedAt) {
    issues.push({ field: "closedAt", message: "เวลาปิดต้องไม่อยู่ก่อนเวลาเปิด" });
  }
  if (!isPositiveFinite(trade.quantity)) issues.push({ field: "quantity", message: "Quantity ต้องมากกว่า 0" });
  if (!isPositiveFinite(trade.averageEntry)) issues.push({ field: "averageEntry", message: "Entry ต้องมากกว่า 0" });
  if (!isPositiveFinite(trade.averageExit)) issues.push({ field: "averageExit", message: "Exit ต้องมากกว่า 0" });
  if (trade.initialStop != null && !isPositiveFinite(trade.initialStop)) {
    issues.push({ field: "initialStop", message: "Initial stop ต้องมากกว่า 0 หรือเว้นว่าง" });
  }
  if (options.requireRisk && !hasValidInitialRisk(trade)) {
    issues.push({ field: "initialRiskAmount", message: "Initial Risk ต้องมากกว่า 0 เพื่อคำนวณ R" });
  } else if (trade.initialRiskAmount != null && !isPositiveFinite(trade.initialRiskAmount)) {
    issues.push({ field: "initialRiskAmount", message: "Initial Risk ต้องมากกว่า 0 หรือเว้นว่าง" });
  }
  if (!Number.isFinite(trade.netPnl)) issues.push({ field: "netPnl", message: "Net P&L ต้องเป็นตัวเลข" });
  if (!Number.isFinite(trade.fees) || trade.fees < 0) issues.push({ field: "fees", message: "Fees ต้องเป็นค่าใช้จ่ายตั้งแต่ 0 ขึ้นไป" });
  if (trade.commissionPnl != null && !Number.isFinite(trade.commissionPnl)) {
    issues.push({ field: "fees", message: "Commission P&L ต้องเป็นตัวเลข" });
  }
  if (!Number.isFinite(trade.swap)) issues.push({ field: "swap", message: "Swap ต้องเป็นตัวเลข" });
  if (!trade.setup.trim()) issues.push({ field: "setup", message: "กรุณาระบุ Setup" });

  return issues;
}

export function withDerivedTradeValues(trade: JournalTrade): JournalTrade {
  const initialRiskAmount = hasValidInitialRisk(trade) ? trade.initialRiskAmount : null;
  const commissionPnl = trade.commissionPnl ?? -Math.abs(trade.fees);
  return {
    ...trade,
    symbol: trade.symbol.trim().toUpperCase(),
    setup: trade.setup.trim() || "Unmapped",
    timeframe: trade.timeframe.trim() || "Unmapped",
    grossPnl: trade.netPnl - commissionPnl - trade.swap,
    fees: Math.max(0, -commissionPnl),
    commissionPnl,
    initialRiskAmount,
    rMultiple: initialRiskAmount == null ? null : trade.netPnl / initialRiskAmount,
  };
}
