export type TradeSide = "buy" | "sell";
export type ExecutionType = "entry" | "partial" | "exit" | "stop";

export interface TradingAccount {
  id: string;
  name: string;
  broker: string;
  externalAccountId: string | null;
  baseCurrency: string;
  reportingTimezone: string;
  defaultRiskAmount?: number;
}

export interface JournalSnapshot {
  accounts: TradingAccount[];
  activeAccountId: string;
  trades: JournalTrade[];
}

export interface Execution {
  id: string;
  tradeId: string;
  type: ExecutionType;
  side: TradeSide;
  executedAt: string;
  quantity: number;
  price: number;
  fee: number;
  externalId?: string;
  externalPositionId?: string;
  commissionPnl?: number;
  swapPnl?: number;
  sourceRow?: number;
  sourceHash?: string;
}

export interface JournalTrade {
  id: string;
  accountId: string;
  symbol: string;
  side: TradeSide;
  openedAt: string;
  closedAt: string;
  quantity: number;
  averageEntry: number;
  averageExit: number;
  initialStop: number | null;
  initialRiskAmount: number | null;
  grossPnl: number;
  fees: number;
  commissionPnl?: number;
  swap: number;
  netPnl: number;
  rMultiple: number | null;
  setup: string;
  timeframe: string;
  session: string;
  marketCondition: string;
  notes: string;
  tags: string[];
  executions: Execution[];
  source: "seed" | "manual" | "ctrader-csv";
  externalPositionId?: string;
  sourceEvidenceHash?: string;
}

export interface JournalMetrics {
  sampleSize: number;
  netR: number;
  expectancy: number;
  profitFactor: number | null;
  winRate: number;
  maxDrawdownR: number;
  dataCompleteness: number;
}

export interface ImportIssue {
  row: number;
  message: string;
  kind?: "needs-info" | "duplicate" | "rejected" | "conflict";
}

export interface ImportPreview {
  fileName: string;
  trades: JournalTrade[];
  issues: ImportIssue[];
}
