import assert from "node:assert/strict";
import test from "node:test";
import { journalSidebarPrimaryAction } from "../../lib/journal/capture-entry.ts";

test("empty active account keeps Import as the first-value action", () => {
  assert.equal(journalSidebarPrimaryAction([], "account-a"), "import");
  assert.equal(
    journalSidebarPrimaryAction([{ accountId: "account-b" }], "account-a"),
    "import",
  );
});

test("a populated active account makes Add the daily capture action", () => {
  assert.equal(
    journalSidebarPrimaryAction(
      [{ accountId: "account-b" }, { accountId: "account-a" }],
      "account-a",
    ),
    "add",
  );
});

