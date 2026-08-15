import test from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyJournalDraft,
  journalDraftStorageKey,
  parseJournalDraft,
  serializeJournalDraft,
} from "../../lib/journal/draft.ts";
import { zonedDateTimeInputToIso } from "../../lib/journal/timezone.ts";

const THAI_CONTEXT = {
  accountId: "account-thb",
  reportingTimezone: "Asia/Bangkok",
  baseCurrency: "THB",
};

test("draft round-trips every editable field", () => {
  const draft = {
    ...createEmptyJournalDraft(
      new Date("2026-07-15T10:00:00.000Z"),
      THAI_CONTEXT.reportingTimezone,
      THAI_CONTEXT.accountId,
      THAI_CONTEXT.baseCurrency,
    ),
    symbol: "XAUUSD",
    risk: "1000",
    notes: "keep me",
  };
  const result = parseJournalDraft(serializeJournalDraft(draft), THAI_CONTEXT);
  assert.equal(result.kind, "ready");
  if (result.kind === "ready") {
    assert.equal(result.draft.accountId, THAI_CONTEXT.accountId);
    assert.equal(result.draft.symbol, "XAUUSD");
    assert.equal(result.draft.risk, "1000");
    assert.equal(result.draft.notes, "keep me");
  }
});

test("legacy v1 draft migrates once into the expected active account context", () => {
  const legacy = JSON.stringify({
    ...createEmptyJournalDraft(new Date("2026-07-15T10:00:00.000Z")),
    version: 1,
    accountId: undefined,
    reportingTimezone: undefined,
    baseCurrency: undefined,
    currencyReviewFrom: undefined,
    symbol: "EURUSD",
  });
  const result = parseJournalDraft(legacy, THAI_CONTEXT);
  assert.equal(result.kind, "ready");
  if (result.kind !== "ready") return;
  assert.equal(result.migratedFrom, 1);
  assert.equal(result.draft.version, 2);
  assert.equal(result.draft.accountId, THAI_CONTEXT.accountId);
  assert.equal(result.draft.reportingTimezone, THAI_CONTEXT.reportingTimezone);
  assert.equal(result.draft.baseCurrency, THAI_CONTEXT.baseCurrency);
  assert.equal(result.draft.symbol, "EURUSD");
});

test("draft from another account is rejected with its raw evidence intact", () => {
  const original = createEmptyJournalDraft(
    new Date("2026-07-15T10:00:00.000Z"),
    THAI_CONTEXT.reportingTimezone,
    "another-account",
    THAI_CONTEXT.baseCurrency,
  );
  const raw = serializeJournalDraft(original);
  const result = parseJournalDraft(raw, THAI_CONTEXT);
  assert.equal(result.kind, "error");
  if (result.kind === "error") {
    assert.equal(result.raw, raw);
    assert.match(result.message, /account อื่น/);
  }
});

test("timezone context change preserves instants and currency review survives reload", () => {
  const original = {
    ...createEmptyJournalDraft(
      new Date("2026-07-15T10:00:00.000Z"),
      THAI_CONTEXT.reportingTimezone,
      THAI_CONTEXT.accountId,
      THAI_CONTEXT.baseCurrency,
    ),
    openedAt: "2026-07-15T17:00",
    closedAt: "2026-07-15T18:30",
    risk: "1000",
    netPnl: "500",
  };
  const newContext = {
    accountId: THAI_CONTEXT.accountId,
    reportingTimezone: "America/New_York",
    baseCurrency: "USD",
  };
  const result = parseJournalDraft(serializeJournalDraft(original), newContext);
  assert.equal(result.kind, "ready");
  if (result.kind !== "ready") return;
  assert.equal(
    zonedDateTimeInputToIso(result.draft.openedAt, newContext.reportingTimezone),
    zonedDateTimeInputToIso(original.openedAt, THAI_CONTEXT.reportingTimezone),
  );
  assert.equal(
    zonedDateTimeInputToIso(result.draft.closedAt, newContext.reportingTimezone),
    zonedDateTimeInputToIso(original.closedAt, THAI_CONTEXT.reportingTimezone),
  );
  assert.equal(result.draft.risk, "1000");
  assert.equal(result.draft.netPnl, "500");
  assert.equal(result.draft.currencyReviewFrom, "THB");
  assert.deepEqual(result.contextChanges, {
    timezone: { from: "Asia/Bangkok", to: "America/New_York" },
    currency: { from: "THB", to: "USD" },
  });

  const reloaded = parseJournalDraft(serializeJournalDraft(result.draft), newContext);
  assert.equal(reloaded.kind, "ready");
  if (reloaded.kind === "ready") assert.equal(reloaded.draft.currencyReviewFrom, "THB");
});

test("per-account draft keys are deterministic and isolated", () => {
  assert.equal(journalDraftStorageKey("account-a"), journalDraftStorageKey("account-a"));
  assert.notEqual(journalDraftStorageKey("account-a"), journalDraftStorageKey("account-b"));
  assert.match(journalDraftStorageKey("broker/account 1"), /broker%2Faccount%201$/);
  assert.throws(() => journalDraftStorageKey(""), /invalid/);
});

test("corrupt draft is isolated with the original raw payload", () => {
  const result = parseJournalDraft("{broken", THAI_CONTEXT);
  assert.equal(result.kind, "error");
  if (result.kind === "error") assert.equal(result.raw, "{broken");
});
