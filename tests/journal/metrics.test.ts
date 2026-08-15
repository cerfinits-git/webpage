import test from "node:test";
import assert from "node:assert/strict";
import { SEED_TRADES } from "../../lib/journal/mock-data.ts";
import { calculateJournalMetrics } from "../../lib/journal/metrics.ts";

test("metrics exclude records without valid initial risk", () => {
  const valid = { ...SEED_TRADES[0], initialRiskAmount: 1000, rMultiple: 1 };
  const missing = { ...SEED_TRADES[1], initialRiskAmount: null, rMultiple: 10 };
  const metrics = calculateJournalMetrics([valid, missing]);
  assert.equal(metrics.sampleSize, 1);
  assert.equal(metrics.netR, 1);
  assert.equal(metrics.dataCompleteness, 0.5);
});

test("drawdown includes an initial loss from the zero starting peak", () => {
  const first = { ...SEED_TRADES[0], id: "first", closedAt: "2026-01-01T00:00:00.000Z", initialRiskAmount: 1000, rMultiple: -1 };
  const second = { ...SEED_TRADES[1], id: "second", closedAt: "2026-01-02T00:00:00.000Z", initialRiskAmount: 1000, rMultiple: 0.5 };
  const metrics = calculateJournalMetrics([second, first]);
  assert.equal(metrics.maxDrawdownR, 1);
  assert.equal(metrics.netR, -0.5);
});

