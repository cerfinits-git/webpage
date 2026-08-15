import test from "node:test";
import assert from "node:assert/strict";
import { journalDatasetChecksum } from "../../lib/journal/integrity.ts";
import {
  MAX_CTRADER_CSV_BYTES,
  MAX_CTRADER_CSV_DATA_ROWS,
  SAMPLE_CTRADER_CSV,
  limitCtraderPreviewIssues,
  parseCtraderCsv,
  summarizeCtraderImportPreview,
} from "../../lib/journal/csv.ts";

const officialHeader = "PositionId,ClosingDealId,TradeType,SymbolName,VolumeInUnits,EntryTime,EntryPrice,ClosingTime,ClosingPrice,GrossProfit,NetProfit,Commissions,Swap,Initial Risk";
const firstPartial = "1001,501,Buy,XAUUSD,0.04,2026-07-14T08:30:00Z,2405,2026-07-14T10:00:00Z,2420,836,800,-32,-4,1900";
const finalPartial = "1001,502,Buy,XAUUSD,0.06,2026-07-14T08:30:00Z,2407,2026-07-14T11:05:00Z,2437,2674,2620,-48,-6,1900";

test("official cTrader Algo history columns are recognized", () => {
  const csv = `${officialHeader}\n1002,601,Sell,EURUSD,1,2026-07-14T08:30:00Z,1.09,2026-07-14T11:05:00Z,1.08,1020,1000,-20,0,1000`;
  const result = parseCtraderCsv(csv, "official.csv", { accountId: "account-a" });
  assert.equal(result.trades.length, 1);
  assert.equal(result.trades[0].id, "ctrader-account-a-position-1002");
  assert.equal(result.trades[0].executions[0].externalId, "601");
});

test("partial closes group into one position lifecycle with weighted prices and signed costs", () => {
  const result = parseCtraderCsv(`${officialHeader}\n${firstPartial}\n${finalPartial}`);
  assert.equal(result.trades.length, 1);
  const trade = result.trades[0];
  assert.equal(trade.quantity, 0.1);
  assert.ok(Math.abs(trade.averageEntry - 2406.2) < 1e-9);
  assert.ok(Math.abs(trade.averageExit - 2430.2) < 1e-9);
  assert.equal(trade.grossPnl, 3510);
  assert.equal(trade.commissionPnl, -80);
  assert.equal(trade.fees, 80);
  assert.equal(trade.swap, -10);
  assert.equal(trade.netPnl, 3420);
  assert.equal(trade.executions.length, 2);
  assert.deepEqual(trade.executions.map((execution) => execution.type), ["partial", "exit"]);
});

test("partial row order does not change canonical dataset checksum", () => {
  const forward = parseCtraderCsv(`${officialHeader}\n${firstPartial}\n${finalPartial}`).trades;
  const reverse = parseCtraderCsv(`${officialHeader}\n${finalPartial}\n${firstPartial}`).trades;
  assert.equal(journalDatasetChecksum(forward), journalDatasetChecksum(reverse));
});

test("duplicate closing deal evidence is counted once", () => {
  const result = parseCtraderCsv(`${officialHeader}\n${firstPartial}\n${firstPartial}`);
  assert.equal(result.trades.length, 1);
  assert.equal(result.trades[0].quantity, 0.04);
  assert.equal(result.issues.some((issue) => issue.kind === "duplicate"), true);
});

test("same Position ID is scoped by account", () => {
  const csv = `${officialHeader}\n${firstPartial}`;
  const accountA = parseCtraderCsv(csv, "a.csv", { accountId: "account-a" });
  const accountB = parseCtraderCsv(csv, "b.csv", { accountId: "account-b" });
  assert.notEqual(accountA.trades[0].id, accountB.trades[0].id);
});

test("commission credits keep their signed contribution", () => {
  const row = "2001,701,Buy,NAS100,1,2026-07-14T08:30:00Z,20000,2026-07-14T09:30:00Z,20100,100,102,2,0,1000";
  const trade = parseCtraderCsv(`${officialHeader}\n${row}`).trades[0];
  assert.equal(trade.grossPnl, 100);
  assert.equal(trade.commissionPnl, 2);
  assert.equal(trade.fees, 0);
  assert.equal(trade.netPnl, 102);
});

test("missing authoritative P&L is rejected instead of estimated", () => {
  const csv = `${officialHeader}\n1002,601,Buy,NAS100,1,2026-07-14T08:30:00Z,20000,2026-07-14T11:05:00Z,20100,100,,0,0,1000`;
  const result = parseCtraderCsv(csv);
  assert.equal(result.trades.length, 0);
  assert.equal(result.issues.some((issue) => issue.message.includes("authoritative Net P&L")), true);
});

test("ambiguous timezone is rejected", () => {
  const csv = `${officialHeader}\n1003,602,Sell,EURUSD,1,2026-07-14T08:30:00,1.09,2026-07-14T09:30:00,1.08,1000,980,-20,0,1000`;
  const result = parseCtraderCsv(csv);
  assert.equal(result.trades.length, 0);
  assert.equal(result.issues.some((issue) => issue.message.includes("UTC offset")), true);
});

test("gross, commission, swap, and net mismatch is rejected", () => {
  const csv = `${officialHeader}\n1004,603,Buy,XAUUSD,1,2026-07-14T08:30:00Z,2400,2026-07-14T09:30:00Z,2410,1000,999,-20,-5,1000`;
  const result = parseCtraderCsv(csv);
  assert.equal(result.trades.length, 0);
  assert.equal(result.issues.some((issue) => issue.message.includes("reconcile")), true);
});

function importRows(count: number, note = "") {
  const header = `${officialHeader},Notes`;
  const rows = Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    return `${id},${100_000 + id},Buy,XAUUSD,1,2026-07-14T08:30:00Z,2400,2026-07-14T09:30:00Z,2410,100,98,-2,0,1000,"${note}"`;
  });
  return [header, ...rows].join("\n");
}

test("CSV byte budget accepts the exact boundary and rejects one byte over", () => {
  const exact = parseCtraderCsv("a".repeat(MAX_CTRADER_CSV_BYTES));
  assert.equal(exact.issues.some((issue) => issue.message.includes("MiB")), false);

  const over = parseCtraderCsv("a".repeat(MAX_CTRADER_CSV_BYTES + 1));
  assert.equal(over.trades.length, 0);
  assert.equal(over.issues.some((issue) => issue.message.includes("MiB")), true);
});

test("CSV row budget accepts 10,000 data rows and rejects 10,001 atomically", () => {
  const exact = parseCtraderCsv(importRows(MAX_CTRADER_CSV_DATA_ROWS));
  assert.equal(exact.trades.length, MAX_CTRADER_CSV_DATA_ROWS);

  const over = parseCtraderCsv(importRows(MAX_CTRADER_CSV_DATA_ROWS + 1));
  assert.equal(over.trades.length, 0);
  assert.equal(over.issues.length, 1);
  assert.equal(over.issues[0].message.includes("partial preview"), true);
});

test("quoted newlines remain inside one logical CSV row", () => {
  const result = parseCtraderCsv(importRows(2, "line one\nline two"));
  assert.equal(result.trades.length, 2);
  assert.equal(result.issues.some((issue) => issue.message.includes("data rows")), false);
});

test("issue preview is bounded without changing truthful totals", () => {
  const issues = Array.from({ length: 135 }, (_, index) => ({ row: index + 2, message: `issue ${index}`, kind: "rejected" as const }));
  const window = limitCtraderPreviewIssues(issues);
  assert.equal(window.visible.length, 100);
  assert.equal(window.hiddenCount, 35);
  assert.equal(issues.length, 135);
});

test("sample preview summary separates trades, issues, rows, and missing risk", () => {
  const preview = parseCtraderCsv(SAMPLE_CTRADER_CSV, "sample.csv", { accountId: "account-a" });
  assert.deepEqual(summarizeCtraderImportPreview(preview), {
    readyTrades: 3,
    missingRiskTrades: 1,
    needsInfoIssues: 2,
    duplicateRows: 0,
    rejectedRows: 0,
  });

  const correctedExisting = [{ ...preview.trades.find((trade) => trade.initialRiskAmount == null)!, initialRiskAmount: 500 }];
  assert.equal(summarizeCtraderImportPreview(preview, correctedExisting).missingRiskTrades, 0);
});
