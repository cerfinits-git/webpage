import assert from "node:assert/strict";
import test from "node:test";
import { SEED_TRADES } from "../../lib/journal/mock-data.ts";
import { readAllJournalPages } from "../../lib/journal/supabase-read.ts";
import {
  createJournalSyncManifest,
  createRemoteJournalSyncFingerprint,
  parseJournalSyncManifest,
  reconcileJournalSync,
  type RemoteJournalRows,
} from "../../lib/journal/sync.ts";
import type { JournalTrade } from "../../lib/journal/types.ts";
import { withDerivedTradeValues } from "../../lib/journal/validation.ts";

const SUBJECT = "user-one";

function remoteRowsFor(trades: JournalTrade[], subject = SUBJECT): RemoteJournalRows {
  const accountIds = new Map<string, string>();
  for (const trade of trades) {
    if (!accountIds.has(trade.accountId)) {
      accountIds.set(trade.accountId, `remote-account-${accountIds.size + 1}`);
    }
  }
  const accounts = [...accountIds].map(([clientId, id]) => ({
    id,
    user_id: subject,
    client_id: clientId,
  }));
  const normalized = trades.map(withDerivedTradeValues);
  const tradeRemoteIds = new Map(normalized.map((trade, index) => [trade.id, `remote-trade-${index + 1}`]));
  const remoteTrades = normalized.map((trade) => ({
    id: tradeRemoteIds.get(trade.id),
    user_id: subject,
    account_id: accountIds.get(trade.accountId),
    client_id: trade.id,
    symbol: trade.symbol,
    side: trade.side,
    opened_at: trade.openedAt.replace("Z", "+00:00"),
    closed_at: trade.closedAt.replace("Z", "+00:00"),
    quantity: String(trade.quantity),
    average_entry: String(trade.averageEntry),
    average_exit: String(trade.averageExit),
    initial_stop: trade.initialStop == null ? null : String(trade.initialStop),
    initial_risk_amount: trade.initialRiskAmount == null ? null : String(trade.initialRiskAmount),
    gross_pnl: String(trade.grossPnl),
    commission_pnl: String(trade.commissionPnl ?? -trade.fees),
    swap_pnl: String(trade.swap),
    net_pnl: String(trade.netPnl),
    setup: trade.setup,
    timeframe: trade.timeframe,
    session: trade.session,
    market_condition: trade.marketCondition,
    notes: trade.notes,
    tags: [...trade.tags],
    source: trade.source,
    external_position_id: trade.externalPositionId ?? null,
    source_evidence_hash: trade.sourceEvidenceHash ?? null,
  }));
  const executions = normalized.flatMap((trade) => trade.executions.map((execution, index) => ({
    id: `remote-execution-${trade.id}-${index}`,
    user_id: subject,
    trade_id: tradeRemoteIds.get(trade.id),
    client_id: execution.id,
    execution_type: execution.type,
    side: execution.side,
    executed_at: execution.executedAt.replace("Z", "+00:00"),
    quantity: String(execution.quantity),
    price: String(execution.price),
    fee: String(execution.fee),
    commission_pnl: String(execution.commissionPnl ?? -execution.fee),
    swap_pnl: String(execution.swapPnl ?? 0),
    external_id: execution.externalId ?? null,
    external_position_id: execution.externalPositionId ?? null,
    source_hash: execution.sourceHash ?? null,
  })));
  return { accounts, trades: remoteTrades, executions };
}

function cloneTrade(index: number, accountId?: string) {
  const trade = structuredClone(SEED_TRADES[index]);
  if (accountId) trade.accountId = accountId;
  trade.source = "manual";
  return trade;
}

test("sync projection excludes browser-only seed fixtures", async () => {
  const seed = structuredClone(SEED_TRADES[0]);
  const manual = cloneTrade(1);
  const withSeed = await createJournalSyncManifest([seed, manual], 1);
  const withoutSeed = await createJournalSyncManifest([manual], 1);

  assert.deepEqual(withSeed, withoutSeed);

  const remote = remoteRowsFor([manual]);
  (remote.trades[0] as Record<string, unknown>).source = "seed";
  await assert.rejects(
    createRemoteJournalSyncFingerprint(remote, SUBJECT),
    /trade.source is invalid/,
  );
});

test("sync projection is stable across account, trade, tag, and execution ordering", async () => {
  const first = cloneTrade(0, "account-b");
  const second = cloneTrade(1, "account-a");
  const baseline = await createJournalSyncManifest([first, second], 9);

  const reorderedFirst = structuredClone(first);
  reorderedFirst.tags.reverse();
  reorderedFirst.executions.reverse();
  const reorderedSecond = structuredClone(second);
  reorderedSecond.tags.reverse();
  reorderedSecond.executions.reverse();
  const reordered = await createJournalSyncManifest([reorderedSecond, reorderedFirst], 10);

  assert.equal(reordered.datasetSha256, baseline.datasetSha256);
  assert.deepEqual(reordered.accounts, baseline.accounts);
  assert.notEqual(reordered.revision, baseline.revision);
});

test("equivalent remote rows match despite UUID, numeric, timestamp, and optional-field representations", async () => {
  const trades = [cloneTrade(0), cloneTrade(1)];
  const local = await createJournalSyncManifest(trades, 4);
  const rows = remoteRowsFor(trades);
  rows.accounts.push({ id: "unused-remote-account", user_id: SUBJECT, client_id: "unused" });
  rows.trades.reverse();
  rows.executions.reverse();

  const remote = await createRemoteJournalSyncFingerprint(rows, SUBJECT);
  assert.deepEqual(reconcileJournalSync(local, remote), { match: true, differences: [] });
});

test("an authoritative remote field change produces bounded checksum differences", async () => {
  const trades = [cloneTrade(0)];
  const local = await createJournalSyncManifest(trades, 1);
  const rows = remoteRowsFor(trades);
  (rows.trades[0] as Record<string, unknown>).notes = "changed remotely";
  const remote = await createRemoteJournalSyncFingerprint(rows, SUBJECT);
  const comparison = reconcileJournalSync(local, remote);
  assert.equal(comparison.match, false);
  assert.ok(comparison.differences.some((item) => item.code === "dataset-checksum"));
  assert.ok(comparison.differences.some((item) => item.code === "account-checksum"));
});

test("remote mapper rejects ownership and missing-parent failures before hashing", async () => {
  const ownership = remoteRowsFor([cloneTrade(0)]);
  (ownership.trades[0] as Record<string, unknown>).user_id = "user-two";
  await assert.rejects(
    createRemoteJournalSyncFingerprint(ownership, SUBJECT),
    /ownership mismatch/,
  );

  const missingParent = remoteRowsFor([cloneTrade(0)]);
  (missingParent.executions[0] as Record<string, unknown>).trade_id = "missing";
  await assert.rejects(
    createRemoteJournalSyncFingerprint(missingParent, SUBJECT),
    /no owned trade parent/,
  );
});

test("manifest parser rejects invalid SHA, duplicate accounts, and inconsistent totals", async () => {
  const manifest = await createJournalSyncManifest([
    cloneTrade(0, "account-a"),
    cloneTrade(1, "account-b"),
  ], 5);
  assert.deepEqual(parseJournalSyncManifest(structuredClone(manifest)), manifest);

  const badSha = structuredClone(manifest) as Record<string, unknown>;
  badSha.datasetSha256 = "ABC";
  assert.throws(() => parseJournalSyncManifest(badSha), /SHA-256/);

  const duplicates = structuredClone(manifest);
  duplicates.accounts[1].accountClientId = duplicates.accounts[0].accountClientId;
  assert.throws(() => parseJournalSyncManifest(duplicates), /duplicate accounts/);

  const inconsistent = structuredClone(manifest);
  inconsistent.tradeCount += 1;
  assert.throws(() => parseJournalSyncManifest(inconsistent), /totals are inconsistent/);

  const impossibleAccount = structuredClone(manifest);
  impossibleAccount.accounts[0].eligibleRCount = impossibleAccount.accounts[0].tradeCount + 1;
  assert.throws(() => parseJournalSyncManifest(impossibleAccount), /Account fingerprint totals/);
});

test("page reader crosses the 1,000-row default without overlap or truncation", async () => {
  const source = Array.from({ length: 1_001 }, (_, index) => index);
  const calls: Array<[number, number]> = [];
  const rows = await readAllJournalPages(async (from, to) => {
    calls.push([from, to]);
    return { data: source.slice(from, to + 1), error: null };
  });
  assert.deepEqual(rows, source);
  assert.deepEqual(calls, [[0, 499], [500, 999], [1_000, 1_499]]);
  await assert.rejects(
    readAllJournalPages(async () => ({ data: [1, 2, 3], error: null }), 2),
    /page exceeded its limit/,
  );
});
