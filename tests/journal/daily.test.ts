import test from "node:test";
import assert from "node:assert/strict";
import { SEED_TRADES } from "../../lib/journal/mock-data.ts";
import { dailyResults, dayKeyInTimeZone, monthGrid, monthSummary, tradesOnDay } from "../../lib/journal/daily.ts";

test("day grouping uses the account reporting timezone, not UTC", () => {
  // 23:30 UTC is already the next day in Bangkok (UTC+7).
  assert.equal(dayKeyInTimeZone("2026-01-01T23:30:00.000Z", "Asia/Bangkok"), "2026-01-02");
  assert.equal(dayKeyInTimeZone("2026-01-01T23:30:00.000Z", "UTC"), "2026-01-01");
  assert.equal(dayKeyInTimeZone("not-a-date", "Asia/Bangkok"), null);
});

test("daily net P&L includes every trade while R only counts valid risk", () => {
  const win = { ...SEED_TRADES[0], closedAt: "2026-03-02T04:00:00.000Z", netPnl: 150, initialRiskAmount: 100, rMultiple: 1.5 };
  const missingRisk = { ...SEED_TRADES[1], closedAt: "2026-03-02T09:00:00.000Z", netPnl: -40, initialRiskAmount: null, rMultiple: null };
  const otherDay = { ...SEED_TRADES[2] ?? SEED_TRADES[0], id: "other", closedAt: "2026-03-03T04:00:00.000Z", netPnl: 60, initialRiskAmount: 100, rMultiple: 0.6 };
  const days = dailyResults([win, missingRisk, otherDay], "Asia/Bangkok");

  const day = days.get("2026-03-02");
  assert.ok(day);
  assert.equal(day.trades, 2);
  assert.equal(day.netPnl, 110);
  assert.equal(day.validR, 1);
  assert.equal(day.rTotal, 1.5);
  assert.equal(days.get("2026-03-03")?.netPnl, 60);
});

test("month grid aligns weekdays and covers every day exactly once", () => {
  // 2026-01-01 is a Thursday (Sunday-first index 4) and January has 31 days.
  const january = monthGrid(2026, 1);
  assert.deepEqual(january[0].slice(0, 4), [null, null, null, null]);
  assert.equal(january[0][4], 1);
  const days = january.flat().filter((day) => day != null);
  assert.equal(days.length, 31);
  assert.equal(days[0], 1);
  assert.equal(days[30], 31);
  assert.ok(january.every((week) => week.length === 7));

  // Leap-year February resolves to 29 days.
  const leapFebruary = monthGrid(2028, 2).flat().filter((day) => day != null);
  assert.equal(leapFebruary.length, 29);
});

test("trades on a day match the timezone boundary and sort oldest first", () => {
  // 23:30 UTC on the 1st is already the 2nd in Bangkok — must be included.
  const lateUtc = { ...SEED_TRADES[0], id: "late-utc", closedAt: "2026-03-01T23:30:00.000Z" };
  const morning = { ...SEED_TRADES[1], id: "morning", closedAt: "2026-03-02T02:00:00.000Z" };
  const otherDay = { ...(SEED_TRADES[2] ?? SEED_TRADES[0]), id: "other-day", closedAt: "2026-03-03T02:00:00.000Z" };
  const result = tradesOnDay([morning, otherDay, lateUtc], "2026-03-02", "Asia/Bangkok");
  assert.deepEqual(result.map((trade) => trade.id), ["late-utc", "morning"]);
});

test("month summary aggregates only days inside the requested month", () => {
  const inMonth = { ...SEED_TRADES[0], closedAt: "2026-03-05T04:00:00.000Z", netPnl: 100, initialRiskAmount: 100, rMultiple: 1 };
  const nextMonth = { ...SEED_TRADES[1], closedAt: "2026-04-01T04:00:00.000Z", netPnl: 999, initialRiskAmount: 100, rMultiple: 2 };
  const days = dailyResults([inMonth, nextMonth], "Asia/Bangkok");
  const summary = monthSummary(days, 2026, 3);
  assert.equal(summary.netPnl, 100);
  assert.equal(summary.trades, 1);
  assert.equal(summary.rTotal, 1);
});
