import test from "node:test";
import assert from "node:assert/strict";
import { ECON_EVENTS_2026, econEventInstant, econEventsByDay } from "../../lib/journal/econ-calendar.ts";

test("dataset is well-formed: unique ids, valid dates, resolvable instants", () => {
  const ids = new Set<string>();
  for (const event of ECON_EVENTS_2026) {
    assert.ok(!ids.has(event.id), `duplicate id ${event.id}`);
    ids.add(event.id);
    assert.match(event.dateET, /^2026-\d{2}-\d{2}$/);
    assert.match(event.timeET, /^\d{2}:\d{2}$/);
    assert.ok(econEventInstant(event), `unresolvable instant for ${event.id}`);
  }
  assert.equal(ECON_EVENTS_2026.filter((e) => e.type === "FOMC").length, 8);
  assert.equal(ECON_EVENTS_2026.filter((e) => e.type === "CPI").length, 12);
  assert.equal(ECON_EVENTS_2026.filter((e) => e.type === "NFP").length, 12);
});

test("ET to UTC conversion respects DST: winter CPI 13:30Z, summer CPI 12:30Z", () => {
  const january = ECON_EVENTS_2026.find((e) => e.id === "cpi-2026-01-13")!;
  const july = ECON_EVENTS_2026.find((e) => e.id === "cpi-2026-07-14")!;
  assert.equal(econEventInstant(january), "2026-01-13T13:30:00.000Z"); // EST = UTC-5
  assert.equal(econEventInstant(july), "2026-07-14T12:30:00.000Z"); // EDT = UTC-4
});

test("morning ET releases land on the same Bangkok day, FOMC lands on the next", () => {
  const days = econEventsByDay("Asia/Bangkok");
  // CPI Jul 14 08:30 ET = 19:30 Bangkok the same date
  assert.ok(days.get("2026-07-14")?.some((e) => e.type === "CPI"));
  // FOMC Jul 29 14:00 EDT = 01:00 Bangkok on Jul 30 — must show on the 30th
  assert.ok(days.get("2026-07-30")?.some((e) => e.type === "FOMC"));
  assert.ok(!days.get("2026-07-29")?.some((e) => e.type === "FOMC"));
});

test("UTC accounts see FOMC on its US date", () => {
  const days = econEventsByDay("UTC");
  assert.ok(days.get("2026-07-29")?.some((e) => e.type === "FOMC"));
});

test("pattern-scheduled NFP dates carry the tentative flag", () => {
  const tentative = ECON_EVENTS_2026.filter((e) => e.tentative);
  assert.deepEqual(tentative.map((e) => e.id).sort(), [
    "nfp-2026-09-04",
    "nfp-2026-10-02",
    "nfp-2026-11-06",
    "nfp-2026-12-04",
  ]);
});
