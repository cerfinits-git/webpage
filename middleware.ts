import { NextResponse, type NextRequest } from "next/server";
import { safeJournalReturnTo } from "./lib/auth/safe-return.ts";
import { readJournalAccessConfig } from "./lib/journal/auth-config.ts";
import {
  classifyAppRoute,
  decideJournalRoute,
  type JournalRouteDecision,
} from "./lib/journal/route-policy.ts";
import {
  refreshJournalSession,
  type RefreshedJournalSession,
} from "./lib/supabase/middleware.ts";
import { carryJournalAuthArtifacts } from "./lib/supabase/auth-response.ts";

function hidden() {
  return new NextResponse(null, { status: 404 });
}

function unauthorized() {
  return NextResponse.json({ error: "Authentication required" }, { status: 401 });
}

function loginRedirect(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  const returnTo = safeJournalReturnTo(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  loginUrl.pathname = "/auth/journal/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("returnTo", returnTo);
  return NextResponse.redirect(loginUrl);
}

function applyJournalDecision(
  decision: JournalRouteDecision,
  request: NextRequest,
  refreshed?: RefreshedJournalSession,
) {
  if (decision === "allow") {
    return refreshed?.response ?? NextResponse.next();
  }

  const response =
    decision === "redirect-login"
      ? loginRedirect(request)
      : decision === "unauthorized"
        ? unauthorized()
        : hidden();

  return refreshed
    ? carryJournalAuthArtifacts(response, refreshed.response)
    : response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const route = classifyAppRoute(pathname);

  // Exact legacy PDF redirect. next.config redirects are case-insensitive and
  // would loop on the lowercase destination.
  if (route === "legacy-pdf") {
    return NextResponse.redirect(
      new URL("/gold-start-cerfinits.pdf", request.url),
      308,
    );
  }

  if (route === "open-api") return NextResponse.next();

  if (
    route === "journal-page" ||
    route === "journal-api" ||
    route === "journal-login"
  ) {
    const access = readJournalAccessConfig();

    if (access.mode !== "supabase") {
      return applyJournalDecision(
        decideJournalRoute(route, access.mode, false),
        request,
      );
    }

    // The login screen itself is public. Protected Journal routes validate a
    // signed JWT claim and carry refresh cookies onto redirects/401 responses.
    if (route === "journal-login") {
      const response = NextResponse.next();
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }

    const refreshed = await refreshJournalSession(request, access.supabase!);
    const hasCerfinitsAuth = Boolean(request.cookies.get("cerfinits_auth")?.value?.trim());
    const verified = refreshed.verified || hasCerfinitsAuth;

    return applyJournalDecision(
      decideJournalRoute(route, access.mode, verified),
      request,
      refreshed,
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/plan/:path*",
    "/journal/:path*",
    "/auth/journal/login/:path*",
    "/api/:path*",
    "/GOLD-START-Cerfinits.pdf",
  ],
};
