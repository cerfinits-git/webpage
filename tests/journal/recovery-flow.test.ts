import test from "node:test";
import assert from "node:assert/strict";
import { createJournalBackup, inspectJournalBackup } from "../../lib/journal/backup.ts";
import { DEFAULT_JOURNAL_ACCOUNT, journalSnapshotChecksum } from "../../lib/journal/accounts.ts";
import { calculateJournalMetrics } from "../../lib/journal/metrics.ts";
import { SEED_TRADES } from "../../lib/journal/mock-data.ts";
import { loadJournalPayload, serializeJournalPayload } from "../../lib/journal/storage.ts";

test("export, clear, restore, and reload preserve the exact journal dataset", async () => {
  const originalTrades = SEED_TRADES.slice(0, 12);
  const secondary = { ...DEFAULT_JOURNAL_ACCOUNT, id: "empty-secondary", name: "Empty secondary" };
  const accounts = [DEFAULT_JOURNAL_ACCOUNT, secondary];
  const beforeExport = loadJournalPayload(serializeJournalPayload(originalTrades, 12, false, accounts, secondary.id));
  assert.equal(beforeExport.kind, "ready");
  const originalChecksum = beforeExport.checksum;
  const originalMetrics = calculateJournalMetrics(beforeExport.trades);
  assert.equal(originalChecksum, journalSnapshotChecksum(beforeExport));

  const backup = await createJournalBackup(beforeExport.trades, beforeExport.accounts, beforeExport.activeAccountId);
  const cleared = loadJournalPayload(serializeJournalPayload([], 13, false, beforeExport.accounts, beforeExport.activeAccountId));
  assert.equal(cleared.kind, "ready");
  assert.equal(cleared.trades.length, 0);

  const inspected = await inspectJournalBackup(backup);
  assert.equal(inspected.ok, true);
  if (!inspected.ok) return;

  const restoredStorage = serializeJournalPayload(inspected.trades, 14, false, inspected.accounts, inspected.activeAccountId);
  const afterReload = loadJournalPayload(restoredStorage);
  assert.equal(afterReload.kind, "ready");
  assert.equal(afterReload.revision, 14);
  assert.equal(afterReload.checksum, originalChecksum);
  assert.deepEqual(afterReload.accounts, beforeExport.accounts);
  assert.equal(afterReload.activeAccountId, beforeExport.activeAccountId);
  assert.deepEqual(afterReload.trades.map((trade) => trade.id), beforeExport.trades.map((trade) => trade.id));
  assert.deepEqual(calculateJournalMetrics(afterReload.trades), originalMetrics);
});
