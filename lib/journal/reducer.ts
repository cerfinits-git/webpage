import type { JournalTrade, TradingAccount } from "./types";

export interface JournalUndoState {
  label: string;
  trades: JournalTrade[];
  accounts: TradingAccount[];
  activeAccountId: string;
}

export interface JournalState {
  trades: JournalTrade[];
  accounts: TradingAccount[];
  activeAccountId: string;
  undo: JournalUndoState | null;
}

export type JournalAction =
  | { type: "hydrate"; trades: JournalTrade[]; accounts: TradingAccount[]; activeAccountId: string }
  | { type: "upsert"; trade: JournalTrade; label: string }
  | { type: "import"; trades: JournalTrade[]; label: string }
  | { type: "delete"; id: string; label: string }
  | { type: "reset"; trades: JournalTrade[]; label: string }
  | { type: "replace"; trades: JournalTrade[]; accounts: TradingAccount[]; activeAccountId: string; label: string }
  | { type: "upsert-account"; account: TradingAccount; activate?: boolean; label: string }
  | { type: "delete-account"; id: string; label: string }
  | { type: "select-account"; id: string }
  | { type: "undo" };

function snapshot(state: JournalState, label: string): JournalUndoState {
  return {
    label,
    trades: state.trades,
    accounts: state.accounts,
    activeAccountId: state.activeAccountId,
  };
}

export function journalReducer(state: JournalState, action: JournalAction): JournalState {
  switch (action.type) {
    case "hydrate":
      return {
        trades: action.trades,
        accounts: action.accounts,
        activeAccountId: action.activeAccountId,
        undo: null,
      };
    case "upsert":
      return {
        ...state,
        trades: [action.trade, ...state.trades.filter((trade) => trade.id !== action.trade.id)],
        undo: snapshot(state, action.label),
      };
    case "import": {
      const existingIds = new Set(state.trades.map((trade) => trade.id));
      const novelTrades = action.trades.filter((trade) => !existingIds.has(trade.id));
      if (novelTrades.length === 0) return state;
      return {
        ...state,
        trades: [...novelTrades, ...state.trades],
        undo: snapshot(state, action.label),
      };
    }
    case "delete": {
      const trades = state.trades.filter((trade) => trade.id !== action.id);
      if (trades.length === state.trades.length) return state;
      return { ...state, trades, undo: snapshot(state, action.label) };
    }
    case "reset":
      return { ...state, trades: action.trades, undo: snapshot(state, action.label) };
    case "replace":
      return {
        trades: action.trades,
        accounts: action.accounts,
        activeAccountId: action.activeAccountId,
        undo: snapshot(state, action.label),
      };
    case "upsert-account": {
      const exists = state.accounts.some((account) => account.id === action.account.id);
      const accounts = exists
        ? state.accounts.map((account) => account.id === action.account.id ? action.account : account)
        : [...state.accounts, action.account];
      return {
        ...state,
        accounts,
        activeAccountId: action.activate ? action.account.id : state.activeAccountId,
        undo: snapshot(state, action.label),
      };
    }
    case "delete-account": {
      const accounts = state.accounts.filter((account) => account.id !== action.id);
      if (accounts.length === state.accounts.length) return state;
      const trades = state.trades.filter((trade) => trade.accountId !== action.id);
      return {
        ...state,
        accounts,
        trades,
        activeAccountId: accounts[0]?.id ?? "",
        undo: snapshot(state, action.label),
      };
    }
    case "select-account":
      return action.id === state.activeAccountId
        || !state.accounts.some((account) => account.id === action.id)
        ? state
        : { ...state, activeAccountId: action.id };
    case "undo":
      return state.undo
        ? {
            trades: state.undo.trades,
            accounts: state.undo.accounts,
            activeAccountId: state.undo.activeAccountId,
            undo: null,
          }
        : state;
    default:
      return state;
  }
}
