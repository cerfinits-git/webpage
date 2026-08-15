import test from "node:test";
import assert from "node:assert/strict";
import { createJournalBackup, inspectJournalBackup } from "../../lib/journal/backup.ts";
import { SEED_TRADES } from "../../lib/journal/mock-data.ts";
import { journalDatasetSha256, validateJournalDataset } from "../../lib/journal/integrity.ts";
import { DEFAULT_JOURNAL_ACCOUNT } from "../../lib/journal/accounts.ts";

test("backup round-trips with stable SHA-256 dataset checksum", async () => {
  const first = JSON.parse(await createJournalBackup(SEED_TRADES.slice(0, 3)));
  const second = JSON.parse(await createJournalBackup(SEED_TRADES.slice(0, 3)));
  assert.equal(first.datasetChecksum, second.datasetChecksum);
  const inspection = await inspectJournalBackup(JSON.stringify(first));
  assert.equal(inspection.ok, true);
  if (inspection.ok) {
    assert.equal(inspection.summary.tradeCount, 3);
    assert.equal(inspection.summary.accountCount, 1);
    assert.equal(inspection.activeAccountId, DEFAULT_JOURNAL_ACCOUNT.id);
  }
});

test("tampered backup is rejected", async () => {
  const backup = JSON.parse(await createJournalBackup(SEED_TRADES.slice(0, 1)));
  backup.trades[0].notes = "tampered";
  const inspection = await inspectJournalBackup(JSON.stringify(backup));
  assert.equal(inspection.ok, false);
});

test("duplicate trade IDs reject the entire backup", async () => {
  const backup = JSON.parse(await createJournalBackup(SEED_TRADES.slice(0, 2)));
  backup.trades[1].id = backup.trades[0].id;
  const inspection = await inspectJournalBackup(JSON.stringify(backup));
  assert.equal(inspection.ok, false);
});

test("schema v1 backup remains readable and is promoted to an account snapshot", async () => {
  const trades = validateJournalDataset(SEED_TRADES.slice(0, 2)).trades;
  const legacy = {
    format: "cerfinits-journal-backup",
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    tradeCount: trades.length,
    checksumAlgorithm: "SHA-256",
    datasetChecksum: await journalDatasetSha256(trades),
    trades,
  };
  const inspection = await inspectJournalBackup(JSON.stringify(legacy));
  assert.equal(inspection.ok, true);
  if (!inspection.ok) return;
  assert.equal(inspection.migratedFrom, 1);
  assert.equal(inspection.accounts.length, 1);
  assert.equal(inspection.activeAccountId, trades[0].accountId);
});

test("tampered account metadata rejects the full backup", async () => {
  const backup = JSON.parse(await createJournalBackup(SEED_TRADES.slice(0, 1)));
  backup.accounts[0].baseCurrency = "EUR";
  const inspection = await inspectJournalBackup(JSON.stringify(backup));
  assert.equal(inspection.ok, false);
});
