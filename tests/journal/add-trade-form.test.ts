import assert from "node:assert/strict";
import test from "node:test";
import {
  draftFieldForTradeIssue,
  isAdvancedDraftField,
} from "../../lib/journal/add-trade-form.ts";

test("trade validation fields map to the exact Quick Add inputs", () => {
  assert.equal(draftFieldForTradeIssue("symbol"), "symbol");
  assert.equal(draftFieldForTradeIssue("averageEntry"), "entry");
  assert.equal(draftFieldForTradeIssue("averageExit"), "exit");
  assert.equal(draftFieldForTradeIssue("initialRiskAmount"), "risk");
  assert.equal(draftFieldForTradeIssue("netPnl"), "netPnl");
});

test("advanced validation fields open their disclosure before focus", () => {
  assert.equal(draftFieldForTradeIssue("initialStop"), "stop");
  assert.equal(isAdvancedDraftField("stop"), true);
  assert.equal(isAdvancedDraftField("symbol"), false);
});

test("validation fields without a Quick Add control do not guess a target", () => {
  assert.equal(draftFieldForTradeIssue("executions"), null);
  assert.equal(draftFieldForTradeIssue("accountId"), null);
});
