import test from "node:test";
import assert from "node:assert/strict";
import { SEED_TRADES } from "../../lib/journal/mock-data.ts";
import { validateJournalTrade, withDerivedTradeValues } from "../../lib/journal/validation.ts";

test("required risk rejects zero and missing values", () => {
  const trade = { ...SEED_TRADES[0], initialRiskAmount: 0 };
  const issues = validateJournalTrade(trade, { requireRisk: true });
  assert.equal(issues.some((issue) => issue.field === "initialRiskAmount"), true);
});

test("derived R always follows net P&L divided by initial risk", () => {
  const trade = withDerivedTradeValues({ ...SEED_TRADES[0], netPnl: 1500, initialRiskAmount: 1000, rMultiple: 99 });
  assert.equal(trade.rMultiple, 1.5);
});

test("close time before open time is rejected", () => {
  const trade = { ...SEED_TRADES[0], openedAt: "2026-07-15T10:00:00.000Z", closedAt: "2026-07-15T09:00:00.000Z" };
  const issues = validateJournalTrade(trade);
  assert.equal(issues.some((issue) => issue.field === "closedAt"), true);
});

