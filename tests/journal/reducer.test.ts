import test from "node:test";
import assert from "node:assert/strict";
import { SEED_TRADES } from "../../lib/journal/mock-data.ts";
import { journalReducer } from "../../lib/journal/reducer.ts";
import { DEFAULT_JOURNAL_ACCOUNT } from "../../lib/journal/accounts.ts";
import type { JournalState } from "../../lib/journal/reducer.ts";

function initialState(): JournalState {
  return {
    trades: SEED_TRADES.slice(0, 2),
    accounts: [{ ...DEFAULT_JOURNAL_ACCOUNT }],
    activeAccountId: DEFAULT_JOURNAL_ACCOUNT.id,
    undo: null,
  };
}

test("reimporting the same trade ID is idempotent", () => {
  const initial = initialState();
  const next = journalReducer(initial, { type: "import", trades: [SEED_TRADES[0]], label: "import" });
  assert.equal(next, initial);
  assert.equal(next.trades.length, 2);
});

test("delete can be undone with the identical record set", () => {
  const initial = initialState();
  const deleted = journalReducer(initial, { type: "delete", id: SEED_TRADES[0].id, label: "delete" });
  assert.equal(deleted.trades.length, 1);
  const restored = journalReducer(deleted, { type: "undo" });
  assert.deepEqual(restored.trades, initial.trades);
});

test("account selection changes context without overwriting undo history", () => {
  const secondary = { ...DEFAULT_JOURNAL_ACCOUNT, id: "secondary", name: "Secondary" };
  const initial = { ...initialState(), accounts: [DEFAULT_JOURNAL_ACCOUNT, secondary] };
  const deleted = journalReducer(initial, { type: "delete", id: SEED_TRADES[0].id, label: "delete" });
  const selected = journalReducer(deleted, { type: "select-account", id: secondary.id });
  assert.equal(selected.activeAccountId, secondary.id);
  assert.equal(selected.undo?.label, "delete");
});

test("deleting an empty account can be undone with account context intact", () => {
  const secondary = { ...DEFAULT_JOURNAL_ACCOUNT, id: "secondary", name: "Secondary" };
  const initial = { ...initialState(), accounts: [DEFAULT_JOURNAL_ACCOUNT, secondary], activeAccountId: secondary.id };
  const deleted = journalReducer(initial, { type: "delete-account", id: secondary.id, label: "delete account" });
  assert.equal(deleted.accounts.length, 1);
  assert.equal(deleted.activeAccountId, DEFAULT_JOURNAL_ACCOUNT.id);
  const restored = journalReducer(deleted, { type: "undo" });
  assert.deepEqual(restored.accounts, initial.accounts);
  assert.equal(restored.activeAccountId, secondary.id);
});
