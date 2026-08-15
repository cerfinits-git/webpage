import assert from "node:assert/strict";
import test from "node:test";
import { readJournalSyncConfig } from "../../lib/journal/sync-config.ts";

const SUPABASE_AUTH = {
  JOURNAL_SUPABASE_AUTH_ENABLED: "true",
  NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
};

test("Journal sync defaults to disabled and never inherits local preview authority", () => {
  assert.equal(readJournalSyncConfig({ NODE_ENV: "development" }).mode, "disabled");
  assert.equal(readJournalSyncConfig({
    NODE_ENV: "development",
    JOURNAL_SYNC_ENABLED: "true",
    JOURNAL_SYNC_DRY_RUN: "true",
  }).mode, "misconfigured");
});

test("Journal sync enables authenticated dry-run only with every breaker satisfied", () => {
  const base = {
    NODE_ENV: "production",
    JOURNAL_ENABLED: "true",
    JOURNAL_SYNC_ENABLED: "true",
    ...SUPABASE_AUTH,
  };
  assert.equal(readJournalSyncConfig(base).mode, "writes-blocked");
  assert.equal(readJournalSyncConfig({
    ...base,
    JOURNAL_SYNC_DRY_RUN: "true",
  }).mode, "dry-run");
  assert.equal(readJournalSyncConfig({
    ...base,
    JOURNAL_ENABLED: "false",
    JOURNAL_SYNC_DRY_RUN: "true",
  }).mode, "misconfigured");
});
