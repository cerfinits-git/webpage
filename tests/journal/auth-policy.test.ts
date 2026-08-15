import assert from "node:assert/strict";
import test from "node:test";
import { safeJournalReturnTo } from "../../lib/auth/safe-return.ts";
import { readJournalAccessConfig } from "../../lib/journal/auth-config.ts";
import {
  classifyAppRoute,
  decideJournalRoute,
} from "../../lib/journal/route-policy.ts";
import { readSupabasePublicConfig } from "../../lib/supabase/config.ts";

const PUBLIC_CONFIG = {
  NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
};

test("production Journal fails closed unless enable, auth, and config are complete", () => {
  assert.equal(readJournalAccessConfig({ NODE_ENV: "production" }).mode, "disabled");

  assert.deepEqual(
    readJournalAccessConfig({
      NODE_ENV: "production",
      JOURNAL_ENABLED: "true",
    }),
    {
      mode: "misconfigured",
      reason: "auth-disabled-in-production",
      supabase: null,
    },
  );

  assert.equal(
    readJournalAccessConfig({
      NODE_ENV: "production",
      JOURNAL_ENABLED: "true",
      JOURNAL_SUPABASE_AUTH_ENABLED: "true",
    }).reason,
    "missing-supabase-config",
  );

  const ready = readJournalAccessConfig({
    NODE_ENV: "production",
    JOURNAL_ENABLED: "true",
    JOURNAL_SUPABASE_AUTH_ENABLED: "true",
    ...PUBLIC_CONFIG,
  });
  assert.equal(ready.mode, "supabase");
  assert.equal(ready.supabase?.keyKind, "publishable");
});

test("development defaults to preview but an incomplete requested auth mode fails closed", () => {
  assert.equal(readJournalAccessConfig({ NODE_ENV: "development" }).mode, "preview");
  assert.equal(
    readJournalAccessConfig({
      NODE_ENV: "development",
      JOURNAL_ENABLED: "false",
    }).mode,
    "disabled",
  );
  assert.equal(
    readJournalAccessConfig({
      NODE_ENV: "development",
      JOURNAL_SUPABASE_AUTH_ENABLED: "true",
    }).mode,
    "misconfigured",
  );
});

test("public Supabase config prefers publishable key and supports legacy anon key", () => {
  assert.deepEqual(readSupabasePublicConfig(PUBLIC_CONFIG), {
    url: "https://project.supabase.co",
    key: "sb_publishable_test",
    keyKind: "publishable",
  });

  assert.equal(
    readSupabasePublicConfig({
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321/",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "legacy-anon",
    })?.keyKind,
    "legacy-anon",
  );

  assert.equal(
    readSupabasePublicConfig({
      NEXT_PUBLIC_SUPABASE_URL: "javascript:alert(1)",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "x",
    }),
    null,
  );
});

test("route classifier keeps Journal, Plan, APIs, and public newsletter separate", () => {
  assert.equal(classifyAppRoute("/journal"), "journal-page");
  assert.equal(classifyAppRoute("/journal/trades"), "journal-page");
  assert.equal(classifyAppRoute("/journalism"), "other");
  assert.equal(classifyAppRoute("/api/journal/trades"), "journal-api");
  assert.equal(classifyAppRoute("/api/ctrader/sync"), "ctrader-api");
  assert.equal(classifyAppRoute("/api/newsletter"), "open-api");
  // Unsubscribe is named explicitly; withdrawing consent must not need a login.
  assert.equal(classifyAppRoute("/api/newsletter/unsubscribe"), "open-api");
  // Any other newsletter subpath stays private — the list is opt-in, not a subtree.
  assert.equal(classifyAppRoute("/api/newsletter/extra"), "legacy-api");
  // Supabase-era public APIs: accounts sync, Google OAuth, and the shared
  // playbook are reachable without the Journal identity gate.
  assert.equal(classifyAppRoute("/api/accounts"), "open-api");
  assert.equal(classifyAppRoute("/api/auth/google"), "open-api");
  assert.equal(classifyAppRoute("/api/journal/playbook"), "open-api");
  assert.equal(classifyAppRoute("/plan"), "plan-page");
  assert.equal(classifyAppRoute("/auth/journal/login"), "journal-login");
});

test("Journal route policy implements preview, verified, 401, redirect, and fail-closed states", () => {
  assert.equal(decideJournalRoute("journal-page", "preview"), "allow");
  // Preview is local-dev-only (a production build with auth off resolves to
  // `misconfigured` -> 404), so the journal API is open under `next dev` to
  // exercise the sync-preview endpoint, and still 401s a signed-out Supabase user.
  assert.equal(decideJournalRoute("journal-api", "preview"), "allow");
  assert.equal(
    decideJournalRoute("journal-page", "supabase", false),
    "redirect-login",
  );
  assert.equal(
    decideJournalRoute("journal-page", "supabase", true),
    "allow",
  );
  assert.equal(
    decideJournalRoute("journal-api", "supabase", false),
    "unauthorized",
  );
  assert.equal(decideJournalRoute("journal-api", "supabase", true), "allow");
  // Broker routes are server-only: allowed under local preview so `next dev`
  // can exercise OAuth and sync, but still 401 for a signed-out Supabase user.
  assert.equal(decideJournalRoute("ctrader-api", "preview"), "allow");
  assert.equal(
    decideJournalRoute("ctrader-api", "supabase", false),
    "unauthorized",
  );
  assert.equal(decideJournalRoute("ctrader-api", "supabase", true), "allow");
  assert.equal(
    decideJournalRoute("ctrader-api", "misconfigured", true),
    "not-found",
  );
  assert.equal(
    decideJournalRoute("journal-page", "misconfigured", true),
    "not-found",
  );
  assert.equal(decideJournalRoute("journal-login", "disabled"), "not-found");
  assert.equal(decideJournalRoute("journal-login", "supabase"), "allow");
  assert.equal(decideJournalRoute("open-api", "disabled"), "allow");
});

test("Journal returnTo accepts only bounded relative Journal paths", () => {
  assert.equal(
    safeJournalReturnTo("/journal/trades?range=30d#latest"),
    "/journal/trades?range=30d#latest",
  );

  for (const unsafe of [
    "https://evil.example/journal",
    "//evil.example/journal",
    "/\\evil.example/journal",
    "/plan",
    "/auth/journal/login",
    "/journal\nSet-Cookie: attack=1",
    `/journal/${"a".repeat(2_100)}`,
  ]) {
    assert.equal(safeJournalReturnTo(unsafe), "/journal", unsafe);
  }
});
