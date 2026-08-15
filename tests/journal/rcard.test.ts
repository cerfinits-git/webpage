import test from "node:test";
import assert from "node:assert/strict";
import { SEED_TRADES } from "../../lib/journal/mock-data.ts";
import { buildMonthlyRCard, latestTradeMonth, tradesInMonth } from "../../lib/journal/rcard.ts";

const TZ = "Asia/Bangkok";

test("month filter uses reporting timezone at the day boundary", () => {
  // 23:30 UTC on 31 Mar is already 1 Apr in Bangkok -> belongs to April.
  const lateMarch = { ...SEED_TRADES[0], id: "late", closedAt: "2026-03-31T23:30:00.000Z" };
  const april = tradesInMonth([lateMarch], 2026, 4, TZ);
  const march = tradesInMonth([lateMarch], 2026, 3, TZ);
  assert.equal(april.length, 1);
  assert.equal(march.length, 0);
});

test("R-card is R-first and honest about losing months", () => {
  const win = { ...SEED_TRADES[0], id: "w", closedAt: "2026-05-04T04:00:00.000Z", netPnl: 300, initialRiskAmount: 100, rMultiple: 3 };
  const loss = { ...SEED_TRADES[1], id: "l", closedAt: "2026-05-05T04:00:00.000Z", netPnl: -500, initialRiskAmount: 100, rMultiple: -5 };
  const card = buildMonthlyRCard([win, loss], 2026, 5, TZ, "USD");
  assert.equal(card.netR, -2);
  assert.equal(card.verdict, "negative");
  assert.equal(card.tradeCount, 2);
  assert.equal(card.validR, 2);
  assert.equal(card.netPnl, -200);
  assert.equal(card.greenDays, 1);
  assert.equal(card.redDays, 1);
  assert.equal(Math.round(card.winRatePct ?? 0), 50);
});

test("trades missing initial risk count for P&L but not for R metrics", () => {
  const graded = { ...SEED_TRADES[0], id: "g", closedAt: "2026-06-02T04:00:00.000Z", netPnl: 120, initialRiskAmount: 100, rMultiple: 1.2 };
  const ungraded = { ...SEED_TRADES[1], id: "u", closedAt: "2026-06-03T04:00:00.000Z", netPnl: 80, initialRiskAmount: null, rMultiple: null };
  const card = buildMonthlyRCard([graded, ungraded], 2026, 6, TZ, "USD");
  assert.equal(card.tradeCount, 2);
  assert.equal(card.validR, 1);
  assert.equal(card.netR, 1.2);
  assert.equal(card.netPnl, 200);
});

test("an empty month reports the empty verdict without fabricating metrics", () => {
  const card = buildMonthlyRCard([], 2026, 7, TZ, "USD");
  assert.equal(card.verdict, "empty");
  assert.equal(card.tradeCount, 0);
  assert.equal(card.netR, 0);
  assert.equal(card.expectancy, null);
  assert.equal(card.winRatePct, null);
});

test("latest trade month picks the newest close date in the timezone", () => {
  const older = { ...SEED_TRADES[0], id: "o", closedAt: "2026-02-10T04:00:00.000Z" };
  const newer = { ...SEED_TRADES[1], id: "n", closedAt: "2026-08-20T04:00:00.000Z" };
  assert.deepEqual(latestTradeMonth([older, newer], TZ), { year: 2026, month: 8 });
});
