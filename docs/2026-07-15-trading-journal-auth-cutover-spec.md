# Trading Journal Auth Cutover — Locked Spec

Date: 2026-07-15  
Owner: Kan / Cerfinits  
Gate: G3 implementation package; production remains STOP-SHIP until G4 staging evidence exists.

## Problem

The current `cerfinits_auth` cookie contains an unsigned username and middleware only checks whether the cookie exists. It is not valid identity proof for a Trading Journal that may hold real financial records. The legacy `/plan` APIs also store one global JSON dataset without `user_id`, so moving Plan and Journal in the same cutover would increase blast radius without creating real tenant isolation.

## Locked decisions

1. Supabase SSR Auth applies to `/journal/**` and the reserved `/api/journal/**` namespace only.
2. `/plan/**` and existing finance APIs remain production-disabled behind `PLAN_ENABLED=false`; their legacy auth is not accepted by Journal.
3. Production Journal is available only when all are true:
   - `JOURNAL_ENABLED=true`
   - `JOURNAL_SUPABASE_AUTH_ENABLED=true`
   - Supabase URL and publishable/legacy anon public key are configured
4. Missing flags or configuration fail closed with `404`; there is no production preview fallback.
5. Local development keeps an explicit local preview when Supabase Auth is off. This mode is never valid production evidence.
6. Page requests without verified claims redirect to `/auth/journal/login` with a sanitized relative `returnTo`.
7. Reserved Journal API requests without verified claims return JSON `401`, never an HTML redirect.
8. Identity is verified with `supabase.auth.getClaims()`. `getSession()` is not authorization proof.
9. Refreshed auth cookies and no-cache headers must survive allowed responses, redirects, and `401` responses.
10. Sign-out affects the current browser session only (`scope: local`).
11. Journal remote sync remains independent and off:
    - `JOURNAL_SYNC_ENABLED=false`
    - `JOURNAL_SYNC_DRY_RUN=true`
12. No production Supabase project, credentials, schema, or financial data is touched in this gate.

## Route matrix

| Route | Local preview | Supabase mode, signed out | Supabase mode, verified | Production disabled/misconfigured |
|---|---|---|---|---|
| `/journal/**` | allow | login redirect | allow | `404` |
| `/api/journal/**` | `401` | JSON `401` | allow | `404` |
| `/auth/journal/login` | allow with preview explanation | allow | allow | `404` |
| `/api/newsletter` | public | public | public | public |
| `/plan/**`, legacy finance APIs | existing dev behavior | independent legacy gate | independent legacy gate | `404` unless separately enabled |

## Circuit breakers

- Any middleware bypass advisory affecting the installed Next.js version is STOP-SHIP.
- Any open redirect, missing-config allow, cookie-loss-on-redirect, or authenticated response caching is STOP-SHIP.
- Any Journal path accepted by `cerfinits_auth` is STOP-SHIP.
- Any remote write while sync is disabled/dry-run is STOP-SHIP.
- Any cross-user RLS failure in staging is STOP-SHIP.

## G3 acceptance evidence

- Exact Supabase package versions and lockfile are present.
- Route/config/safe-return policy tests cover allow, redirect, `401`, and fail-closed paths.
- `npm audit --omit=dev` has no high or critical findings.
- Journal tests, TypeScript check, and production build pass.
- Local preview remains usable after the auth boundary changes.

## G4 evidence still required

- Staging Supabase Auth user and asymmetric signing keys.
- Deep link -> login -> same deep link -> reload -> sign out browser flow.
- Expired-token refresh and cookie propagation check.
- pgTAP RLS isolation for two users plus import reconciliation.
- Two weeks of dogfood without data loss, identity leak, or recovery failure.

## Rollback

App-first only: set `JOURNAL_ENABLED=false`. Keep additive staging tables and migrations intact for diagnosis. Do not drop tables during an incident. Local backups remain the recovery path until staging reconciliation passes.

## G3 verification — 2026-07-15

Status: implementation package passes localhost G3; production remains STOP-SHIP.

- Runtime security:
  - Upgraded Next.js `15.3.3` -> `15.5.20` to remove the audited critical RSC and middleware-bypass findings.
  - Pinned `@supabase/ssr@0.12.0` and `@supabase/supabase-js@2.110.2`.
  - Overrode Next's nested PostCSS to patched `8.5.10`.
  - `npm audit --omit=dev`: `found 0 vulnerabilities`.
- Automated evidence:
  - `npm test`: 36/36 pass, including auth config, route matrix, safe return, and refreshed-cookie propagation.
  - `npx tsc --noEmit`: pass.
  - `npm run build`: pass on Next `15.5.20`; 69/69 static pages generated and all Journal routes compiled as dynamic.
- Browser evidence at 390 x 844:
  - Local preview remains reachable and labels storage honestly as `This device only`.
  - `/journal/trades?range=30d` in Supabase mode redirects to `/auth/journal/login` with the same relative `returnTo`.
  - Login email receives initial focus; all visible inputs/buttons are at least 44 px and no horizontal overflow exists.
  - An external `returnTo=https://evil.example` is reduced to `/journal`.
  - Local preview follows the valid deep link back to `/journal/trades?range=30d`.
  - `/api/journal/probe` returns `401`; `/api/accounts` returns `401`; public `/api/newsletter` reaches the route and returns `405` for unsupported GET rather than an auth response.
  - Overview touch targets were hardened; the mobile audit found zero visible targets under 44 px.
- Limitations:
  - The Auth UI was exercised with a non-routable QA project URL. A real sign-in, token refresh, sign-out, and two-user isolation still require staging credentials and G4.
  - Journal remote sync remains disabled and dry-run.
  - Native file chooser restore/import still requires one manual smoke test on the target device/browser.
