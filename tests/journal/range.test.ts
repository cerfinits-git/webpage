import assert from "node:assert/strict";
import test from "node:test";
import { SEED_TRADES } from "../../lib/journal/mock-data.ts";
import {
  buildJournalHref,
  filterTradesByRange,
  parseJournalQuality,
  parseJournalRange,
  resolveJournalRange,
} from "../../lib/journal/range.ts";

test("range parser accepts only the locked values and URL wins over preference", () => {
  assert.equal(parseJournalRange("7d"), "7d");
  assert.equal(parseJournalRange("30d"), "30d");
  assert.equal(parseJournalRange("all"), "all");
  assert.equal(parseJournalRange("90d"), null);
  assert.equal(parseJournalRange(null), null);

  assert.equal(resolveJournalRange("7d", "all"), "7d");
  assert.equal(resolveJournalRange("invalid", "all"), "all");
  assert.equal(resolveJournalRange("invalid", "invalid"), "30d");
});

test("Journal deep links stay internal and encode selected trade identity", () => {
  assert.equal(
    buildJournalHref("/journal/trades", "30d", {
      trade: "trade / xau?&=1",
      quality: "missing",
    }),
    "/journal/trades?range=30d&trade=trade+%2F+xau%3F%26%3D1&quality=missing",
  );
  assert.throws(
    () => buildJournalHref("https://evil.example/journal", "30d"),
    /stay inside/,
  );
  assert.throws(
    () => buildJournalHref("//evil.example/journal", "30d"),
    /stay inside/,
  );
});

test("missing-risk query is allowlisted and range filtering remains deterministic", () => {
  assert.equal(parseJournalQuality("missing"), "missing");
  assert.equal(parseJournalQuality("complete"), "all");
  assert.equal(parseJournalQuality("<script>"), "all");

  const sevenDays = filterTradesByRange(SEED_TRADES, "7d");
  const thirtyDays = filterTradesByRange(SEED_TRADES, "30d");
  assert.ok(sevenDays.length < thirtyDays.length);
  assert.ok(thirtyDays.length < SEED_TRADES.length);
  assert.deepEqual(filterTradesByRange(SEED_TRADES, "all"), SEED_TRADES);
});
