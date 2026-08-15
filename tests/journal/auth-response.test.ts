import assert from "node:assert/strict";
import test from "node:test";
import { NextResponse } from "next/server.js";
import { carryJournalAuthArtifacts } from "../../lib/supabase/auth-response.ts";

test("auth cookies and anti-cache headers survive a redirect response", () => {
  const source = NextResponse.next();
  source.cookies.set("sb-session", "refreshed-token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  source.headers.set("Cache-Control", "private, no-store");
  source.headers.set("Expires", "0");
  source.headers.set("Pragma", "no-cache");

  const target = NextResponse.redirect("https://cerfinits.test/journal");
  carryJournalAuthArtifacts(target, source);

  assert.equal(target.cookies.get("sb-session")?.value, "refreshed-token");
  assert.equal(target.headers.get("cache-control"), "private, no-store");
  assert.equal(target.headers.get("expires"), "0");
  assert.equal(target.headers.get("pragma"), "no-cache");
});
