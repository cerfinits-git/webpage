import type { NextResponse } from "next/server";

const AUTH_RESPONSE_HEADERS = ["cache-control", "expires", "pragma"] as const;

/** Preserve refreshed cookies and anti-cache headers on redirects and 401s. */
export function carryJournalAuthArtifacts(
  target: NextResponse,
  source: NextResponse,
) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });

  AUTH_RESPONSE_HEADERS.forEach((name) => {
    const value = source.headers.get(name);
    if (value) target.headers.set(name, value);
  });

  return target;
}
