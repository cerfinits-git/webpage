import test from "node:test";
import assert from "node:assert/strict";
import { SEED_TRADES } from "../../lib/journal/mock-data.ts";
import { journalDatasetChecksum } from "../../lib/journal/integrity.ts";
import { DEFAULT_JOURNAL_ACCOUNT, journalSnapshotChecksum } from "../../lib/journal/accounts.ts";
import {
  JOURNAL_STORAGE_MAX_CHARACTERS,
  JOURNAL_STORAGE_VERSION,
  journalStorageBudget,
  loadJournalPayload,
  serializeJournalPayload,
} from "../../lib/journal/storage.ts";

test("storage payload round-trips the complete schema v5 snapshot", () => {
  const result = loadJournalPayload(serializeJournalPayload(SEED_TRADES.slice(0, 2), 7));
  assert.equal(result.kind, "ready");
  assert.equal(result.trades.length, 2);
  assert.deepEqual(result.accounts, [DEFAULT_JOURNAL_ACCOUNT]);
  assert.equal(result.activeAccountId, DEFAULT_JOURNAL_ACCOUNT.id);
  assert.equal(result.revision, 7);
  assert.equal(result.checksum, journalSnapshotChecksum(result));
});

test("storage migrates a valid v4 payload without changing trade ownership", () => {
  const trades = SEED_TRADES.slice(0, 1);
  const result = loadJournalPayload(JSON.stringify({
    version: 4,
    savedAt: new Date().toISOString(),
    revision: 6,
    checksumAlgorithm: "fnv1a32",
    datasetChecksum: journalDatasetChecksum(trades),
    trades,
  }));
  assert.equal(result.kind, "ready");
  if (result.kind !== "ready") return;
  assert.equal(result.migratedFrom, 4);
  assert.equal(result.revision, 6);
  assert.equal(result.accounts[0].id, trades[0].accountId);
});

test("storage migrates a valid v3 payload", () => {
  const result = loadJournalPayload(JSON.stringify({ version: 3, trades: SEED_TRADES.slice(0, 1) }));
  assert.equal(result.kind, "ready");
  if (result.kind === "ready") assert.equal(result.migratedFrom, 3);
});

test("storage rejects corrupt JSON without falling back to seed data", () => {
  const result = loadJournalPayload("{broken");
  assert.equal(result.kind, "error");
  assert.equal(result.trades.length, 0);
});

test("legacy storage isolates invalid records and reports recovery", () => {
  const result = loadJournalPayload(JSON.stringify({ version: 3, trades: [SEED_TRADES[0], { id: "broken" }] }));
  assert.equal(result.kind, "recovered");
  assert.equal(result.trades.length, 1);
  assert.equal(result.rejected, 1);
});

test("schema v5 rejects checksum mismatch atomically", () => {
  const payload = JSON.parse(serializeJournalPayload(SEED_TRADES.slice(0, 1), 1));
  payload.trades[0].netPnl += 1;
  const result = loadJournalPayload(JSON.stringify(payload));
  assert.equal(result.kind, "error");
  assert.equal(result.trades.length, 0);
});

test("schema v5 rejects semantic corruption even with recomputed checksum", () => {
  const payload = JSON.parse(serializeJournalPayload(SEED_TRADES.slice(0, 1), 1));
  payload.trades[0].closedAt = "2020-01-01T00:00:00.000Z";
  payload.datasetChecksum = journalSnapshotChecksum(payload);
  const result = loadJournalPayload(JSON.stringify(payload));
  assert.equal(result.kind, "error");
});

test("schema v5 rejects orphaned trades even with a recomputed checksum", () => {
  const payload = JSON.parse(serializeJournalPayload(SEED_TRADES.slice(0, 1), 1));
  payload.trades[0].accountId = "missing-account";
  payload.datasetChecksum = journalSnapshotChecksum(payload);
  const result = loadJournalPayload(JSON.stringify(payload));
  assert.equal(result.kind, "error");
});

test("current storage schema version is five", () => {
  assert.equal(JOURNAL_STORAGE_VERSION, 5);
});

test("local storage soft budget is deterministic at the exact boundary", () => {
  assert.deepEqual(journalStorageBudget("x".repeat(JOURNAL_STORAGE_MAX_CHARACTERS)), {
    valid: true,
    characters: JOURNAL_STORAGE_MAX_CHARACTERS,
    limit: JOURNAL_STORAGE_MAX_CHARACTERS,
  });
  assert.equal(journalStorageBudget("x".repeat(JOURNAL_STORAGE_MAX_CHARACTERS + 1)).valid, false);
  assert.equal(journalStorageBudget(
    "x".repeat(JOURNAL_STORAGE_MAX_CHARACTERS + 1),
    JOURNAL_STORAGE_MAX_CHARACTERS + 2,
  ).valid, true);
  assert.equal(journalStorageBudget(
    "x".repeat(JOURNAL_STORAGE_MAX_CHARACTERS + 1),
    JOURNAL_STORAGE_MAX_CHARACTERS + 1,
  ).valid, false);
});
