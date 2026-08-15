import type { JournalAccessMode } from "./auth-config.ts";

export type AppRouteKind =
  | "journal-page"
  | "journal-api"
  | "ctrader-api"
  | "journal-login"
  | "plan-page"
  | "legacy-api"
  | "open-api"
  | "legacy-pdf"
  | "other";

export type JournalRouteDecision =
  | "allow"
  | "not-found"
  | "redirect-login"
  | "unauthorized";

function isRoute(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Public newsletter endpoints, named individually to keep the surface small. */
const OPEN_NEWSLETTER_APIS = new Set(["/api/newsletter", "/api/newsletter/unsubscribe"]);

export function classifyAppRoute(pathname: string): AppRouteKind {
  if (pathname === "/GOLD-START-Cerfinits.pdf") return "legacy-pdf";
  // Newsletter paths are listed one by one rather than as a subtree, so a
  // future /api/newsletter/* route is private until someone decides otherwise.
  // Unsubscribe is on the list because withdrawing consent has to be at least
  // as easy as giving it (PDPA s.19) — it cannot sit behind a login.
  if (OPEN_NEWSLETTER_APIS.has(pathname) || isRoute(pathname, "/api/auth/google") || isRoute(pathname, "/api/accounts") || isRoute(pathname, "/api/journal/playbook")) return "open-api";
  if (isRoute(pathname, "/auth/journal/login")) return "journal-login";
  if (isRoute(pathname, "/api/journal")) return "journal-api";
  if (isRoute(pathname, "/api/ctrader")) return "ctrader-api";
  if (isRoute(pathname, "/journal")) return "journal-page";
  if (isRoute(pathname, "/plan")) return "plan-page";
  if (isRoute(pathname, "/api")) return "legacy-api";
  return "other";
}

export function decideJournalRoute(
  route: AppRouteKind,
  mode: JournalAccessMode,
  verifiedIdentity = false,
): JournalRouteDecision {
  const isJournalRoute =
    route === "journal-page" ||
    route === "journal-api" ||
    route === "ctrader-api" ||
    route === "journal-login";

  if (!isJournalRoute) return "allow";
  if (mode === "disabled" || mode === "misconfigured") return "not-found";
  if (route === "journal-login") return "allow";

  if (route === "journal-api") {
    if (mode === "preview") return "allow";
    return mode === "supabase" && verifiedIdentity ? "allow" : "unauthorized";
  }

  // Broker OAuth and pull-sync are server-only routes with no localStorage
  // equivalent, so they must run under `next dev` to be developable at all.
  // Preview mode is unreachable in production (auth-config turns a production
  // build with auth off into `misconfigured` -> 404), so this stays local.
  if (route === "ctrader-api") {
    if (mode === "preview") return "allow";
    return mode === "supabase" && verifiedIdentity ? "allow" : "unauthorized";
  }

  if (mode === "preview") return "allow";
  return verifiedIdentity ? "allow" : "redirect-login";
}
