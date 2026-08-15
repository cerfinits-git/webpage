import test from "node:test";
import assert from "node:assert/strict";
import { dateTimeInputInTimeZone, zonedDateTimeInputToIso } from "../../lib/journal/timezone.ts";

test("datetime-local round-trips through the account reporting timezone", () => {
  assert.equal(zonedDateTimeInputToIso("2026-07-14T09:00", "Asia/Bangkok"), "2026-07-14T02:00:00.000Z");
  assert.equal(zonedDateTimeInputToIso("2026-07-14T09:00", "America/New_York"), "2026-07-14T13:00:00.000Z");
  assert.equal(dateTimeInputInTimeZone("2026-07-14T13:00:00.000Z", "America/New_York"), "2026-07-14T09:00");
});

test("nonexistent DST wall time is rejected instead of silently shifted", () => {
  assert.equal(zonedDateTimeInputToIso("2026-03-08T02:30", "America/New_York"), null);
});
