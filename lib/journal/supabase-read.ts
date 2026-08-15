import type { SupabaseClient } from "@supabase/supabase-js";
import type { RemoteJournalRows } from "./sync.ts";

export const JOURNAL_REMOTE_PAGE_SIZE = 500;
export const JOURNAL_REMOTE_MAX_ROWS_PER_TABLE = 100_000;

const ACCOUNT_COLUMNS = "id,user_id,client_id";
const TRADE_COLUMNS = [
  "id",
  "user_id",
  "account_id",
  "client_id",
  "symbol",
  "side",
  "opened_at",
  "closed_at",
  "quantity",
  "average_entry",
  "average_exit",
  "initial_stop",
  "initial_risk_amount",
  "gross_pnl",
  "commission_pnl",
  "swap_pnl",
  "net_pnl",
  "setup",
  "timeframe",
  "session",
  "market_condition",
  "notes",
  "tags",
  "source",
  "external_position_id",
  "source_evidence_hash",
].join(",");
const EXECUTION_COLUMNS = [
  "id",
  "user_id",
  "trade_id",
  "client_id",
  "execution_type",
  "side",
  "executed_at",
  "quantity",
  "price",
  "fee",
  "commission_pnl",
  "swap_pnl",
  "external_id",
  "external_position_id",
  "source_hash",
].join(",");

type PageResult<T> = {
  data: T[] | null;
  error: { message: string } | null;
};

export async function readAllJournalPages<T>(
  load: (from: number, to: number) => Promise<PageResult<T>>,
  pageSize = JOURNAL_REMOTE_PAGE_SIZE,
) {
  if (!Number.isSafeInteger(pageSize) || pageSize <= 0 || pageSize > 1_000) {
    throw new Error("Journal page size is invalid");
  }
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const result = await load(from, from + pageSize - 1);
    if (result.error) throw new Error("Staging Journal read failed");
    const page = result.data ?? [];
    if (page.length > pageSize) throw new Error("Staging Journal page exceeded its limit");
    if (rows.length + page.length > JOURNAL_REMOTE_MAX_ROWS_PER_TABLE) {
      throw new Error("Staging Journal row safety limit exceeded");
    }
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

async function readTable(
  client: SupabaseClient,
  table: "journal_accounts" | "journal_trades" | "journal_executions",
  columns: string,
  subject: string,
) {
  return readAllJournalPages<unknown>(async (from, to) => {
    const result = await client
      .from(table)
      .select(columns)
      .eq("user_id", subject)
      .range(from, to);
    return {
      data: result.data as unknown[] | null,
      error: result.error ? { message: result.error.message } : null,
    };
  });
}

export async function readRemoteJournalRows(
  client: SupabaseClient,
  subject: string,
): Promise<RemoteJournalRows> {
  const verifiedSubject = subject.trim();
  if (!verifiedSubject) throw new Error("Verified Journal subject is required");

  const [accounts, trades, executions] = await Promise.all([
    readTable(client, "journal_accounts", ACCOUNT_COLUMNS, verifiedSubject),
    readTable(client, "journal_trades", TRADE_COLUMNS, verifiedSubject),
    readTable(client, "journal_executions", EXECUTION_COLUMNS, verifiedSubject),
  ]);

  return { accounts, trades, executions };
}
