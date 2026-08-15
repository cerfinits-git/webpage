import test from "node:test";
import assert from "node:assert/strict";
import {
  addJournalDogfoodIncident,
  createJournalDogfoodLedger,
  createJournalDogfoodReport,
  JOURNAL_DOGFOOD_DURATION_MS,
  loadJournalDogfoodLedger,
  observeJournalDogfoodLedger,
  serializeJournalDogfoodLedger,
  summarizeJournalDogfood,
} from "../../lib/journal/dogfood.ts";
import { SEED_TRADES } from "../../lib/journal/mock-data.ts";
import type { JournalTrade } from "../../lib/journal/types.ts";

const ACCOUNT_ID = "dogfood-account";
const STARTED_AT = "2026-07-01T00:00:00.000Z";
const DAY_MS = 24 * 60 * 60 * 1_000;

function iso(offsetMs: number) {
  return new Date(Date.parse(STARTED_AT) + offsetMs).toISOString();
}

function trade(overrides: Partial<JournalTrade> = {}): JournalTrade {
  const id = overrides.id ?? "trade-dogfood-1";
  const closedAt = overrides.closedAt ?? iso(DAY_MS);
  return {
    ...SEED_TRADES[0],
    id,
    accountId: ACCOUNT_ID,
    source: "manual",
    openedAt: new Date(Date.parse(closedAt) - 60 * 60 * 1_000).toISOString(),
    closedAt,
    initialRiskAmount: 100,
    symbol: "PRIVATE-SYMBOL",
    notes: "PRIVATE-NOTE",
    executions: [],
    ...overrides,
  };
}

test("dogfood ledger round-trips with a verified checksum", () => {
  const ledger = createJournalDogfoodLedger(ACCOUNT_ID, "Asia/Bangkok", STARTED_AT);
  const result = loadJournalDogfoodLedger(serializeJournalDogfoodLedger(ledger));
  assert.equal(result.kind, "ready");
  if (result.kind !== "ready") return;
  assert.deepEqual(result.ledger, ledger);
});

test("dogfood ledger rejects a tampered payload without replacing it", () => {
  const ledger = createJournalDogfoodLedger(ACCOUNT_ID, "Asia/Bangkok", STARTED_AT);
  const payload = JSON.parse(serializeJournalDogfoodLedger(ledger));
  payload.startedAt = "2026-07-02T00:00:00.000Z";
  const raw = JSON.stringify(payload);
  const result = loadJournalDogfoodLedger(raw);
  assert.equal(result.kind, "error");
  if (result.kind === "error") assert.equal(result.raw, raw);
});

test("observation excludes seed, other accounts, and pre-start history", () => {
  const ledger = createJournalDogfoodLedger(ACCOUNT_ID, "UTC", STARTED_AT);
  const observed = observeJournalDogfoodLedger(ledger, [
    trade({ id: "seed", source: "seed" }),
    trade({ id: "other", accountId: "another-account" }),
    trade({ id: "history", closedAt: iso(-1) }),
    trade({ id: "boundary", closedAt: STARTED_AT }),
  ], iso(DAY_MS));
  assert.equal(observed.trades.length, 1);
  assert.equal(observed.trades[0].firstClosedAt, STARTED_AT);
});

test("risk completed at exactly 24 hours is timely and one millisecond later is not", () => {
  let ledger = createJournalDogfoodLedger(ACCOUNT_ID, "UTC", STARTED_AT);
  ledger = observeJournalDogfoodLedger(ledger, [
    trade({ id: "at-boundary", closedAt: STARTED_AT }),
    trade({ id: "after-boundary", closedAt: STARTED_AT }),
  ], iso(DAY_MS));
  const afterBoundary = ledger.trades.find((item) => item.evidenceId !== ledger.trades[0].evidenceId);
  assert.ok(afterBoundary);

  // Re-observe one item after the boundary with its first valid risk.
  const missingLedger = createJournalDogfoodLedger(ACCOUNT_ID, "UTC", STARTED_AT);
  let late = observeJournalDogfoodLedger(missingLedger, [
    trade({ id: "late", closedAt: STARTED_AT, initialRiskAmount: null }),
  ], iso(1));
  late = observeJournalDogfoodLedger(late, [
    trade({ id: "late", closedAt: STARTED_AT, initialRiskAmount: 100 }),
  ], iso(DAY_MS + 1));

  assert.equal(summarizeJournalDogfood(ledger, iso(DAY_MS)).timelyRiskCount, 2);
  assert.equal(summarizeJournalDogfood(late, iso(DAY_MS + 1)).timelyRiskCount, 0);
});

test("an imported risk correction preserves first-seen evidence", () => {
  let ledger = createJournalDogfoodLedger(ACCOUNT_ID, "UTC", STARTED_AT);
  ledger = observeJournalDogfoodLedger(ledger, [
    trade({ source: "ctrader-csv", initialRiskAmount: null, closedAt: STARTED_AT }),
  ], iso(60 * 60 * 1_000));
  ledger = observeJournalDogfoodLedger(ledger, [
    trade({ source: "ctrader-csv", initialRiskAmount: 100, closedAt: STARTED_AT }),
  ], iso(23 * 60 * 60 * 1_000));

  assert.equal(ledger.trades[0].missingRiskAtFirstSeen, true);
  assert.equal(ledger.trades[0].riskCompletedAt, iso(23 * 60 * 60 * 1_000));
  assert.equal(ledger.trades[0].currentRiskValid, true);
  const summary = summarizeJournalDogfood(ledger, iso(DAY_MS));
  assert.equal(summary.importCorrectionCount, 1);
  assert.equal(summary.timelyRiskCount, 1);
});

test("a valid imported risk is not mislabeled as a correction", () => {
  const ledger = observeJournalDogfoodLedger(
    createJournalDogfoodLedger(ACCOUNT_ID, "UTC", STARTED_AT),
    [trade({ source: "ctrader-csv", closedAt: STARTED_AT })],
    iso(60 * 60 * 1_000),
  );
  assert.equal(ledger.trades[0].missingRiskAtFirstSeen, false);
  assert.equal(summarizeJournalDogfood(ledger, iso(DAY_MS)).importCorrectionCount, 0);
});

test("deletion preserves evidence and restoration re-enters the denominator", () => {
  let ledger = createJournalDogfoodLedger(ACCOUNT_ID, "UTC", STARTED_AT);
  ledger = observeJournalDogfoodLedger(ledger, [trade({ closedAt: STARTED_AT })], iso(1));
  ledger = observeJournalDogfoodLedger(ledger, [], iso(2));
  let summary = summarizeJournalDogfood(ledger, iso(2));
  assert.equal(summary.cohortTradeCount, 0);
  assert.equal(summary.deletedTradeCount, 1);
  assert.equal(ledger.trades[0].present, false);

  ledger = observeJournalDogfoodLedger(ledger, [trade({ closedAt: STARTED_AT })], iso(3));
  summary = summarizeJournalDogfood(ledger, iso(3));
  assert.equal(summary.cohortTradeCount, 1);
  assert.equal(summary.deletedTradeCount, 0);
  assert.equal(ledger.trades[0].restoredAt, iso(3));
});

test("the local gate requires 14 days and both minimum samples", () => {
  const imports = Array.from({ length: 10 }, (_, index) => trade({
    id: `import-${index}`,
    source: "ctrader-csv",
    closedAt: iso(DAY_MS + index * 1_000),
  }));
  const ledger = observeJournalDogfoodLedger(
    createJournalDogfoodLedger(ACCOUNT_ID, "UTC", STARTED_AT),
    imports,
    iso(DAY_MS + 60 * 60 * 1_000),
  );
  assert.equal(summarizeJournalDogfood(ledger, iso(JOURNAL_DOGFOOD_DURATION_MS - 1)).status, "collecting");
  const ready = summarizeJournalDogfood(ledger, iso(JOURNAL_DOGFOOD_DURATION_MS));
  assert.equal(ready.status, "local-ready");
  assert.equal(ready.day, 14);
  assert.equal(ready.cohortTradeCount, 10);
  assert.equal(ready.importedTradeCount, 10);

  const insufficient = observeJournalDogfoodLedger(
    createJournalDogfoodLedger(ACCOUNT_ID, "UTC", STARTED_AT),
    imports.slice(0, 9),
    iso(DAY_MS + 60 * 60 * 1_000),
  );
  assert.equal(summarizeJournalDogfood(insufficient, iso(JOURNAL_DOGFOOD_DURATION_MS)).status, "insufficient");
});

test("correction rate above ten percent or any reliability incident fails the gate", () => {
  const imports = Array.from({ length: 10 }, (_, index) => trade({
    id: `import-${index}`,
    source: "ctrader-csv",
    initialRiskAmount: index < 2 ? null : 100,
    closedAt: iso(DAY_MS),
  }));
  let corrected = observeJournalDogfoodLedger(
    createJournalDogfoodLedger(ACCOUNT_ID, "UTC", STARTED_AT),
    imports,
    iso(DAY_MS + 1),
  );
  corrected = observeJournalDogfoodLedger(
    corrected,
    imports.map((item) => ({ ...item, initialRiskAmount: 100 })),
    iso(DAY_MS + 2),
  );
  assert.equal(summarizeJournalDogfood(corrected, iso(JOURNAL_DOGFOOD_DURATION_MS)).status, "failed");

  const noCorrections = observeJournalDogfoodLedger(
    createJournalDogfoodLedger(ACCOUNT_ID, "UTC", STARTED_AT),
    imports.map((item) => ({ ...item, initialRiskAmount: 100 })),
    iso(DAY_MS + 1),
  );
  const incident = addJournalDogfoodIncident(noCorrections, "revision-conflict", iso(DAY_MS + 2));
  assert.equal(summarizeJournalDogfood(incident, iso(JOURNAL_DOGFOOD_DURATION_MS)).status, "failed");
});

test("dogfood report is deterministic and excludes financial and narrative fields", () => {
  const ledger = observeJournalDogfoodLedger(
    createJournalDogfoodLedger(ACCOUNT_ID, "UTC", STARTED_AT),
    [trade({
      id: "PRIVATE-TRADE-ID",
      symbol: "PRIVATE-SYMBOL",
      notes: "PRIVATE-NOTE",
      grossPnl: 987654,
      netPnl: 876543,
      averageEntry: 765432,
      initialRiskAmount: 123456,
      source: "ctrader-csv",
      closedAt: STARTED_AT,
    })],
    iso(1),
  );
  const left = createJournalDogfoodReport(ledger, iso(DAY_MS));
  const right = createJournalDogfoodReport(ledger, iso(DAY_MS));
  assert.deepEqual(left, right);
  const serialized = JSON.stringify(left);
  for (const secret of ["PRIVATE-TRADE-ID", "PRIVATE-SYMBOL", "PRIVATE-NOTE", "987654", "876543", "765432", "123456"]) {
    assert.equal(serialized.includes(secret), false, secret);
  }
});
