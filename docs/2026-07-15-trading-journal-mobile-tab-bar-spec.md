# Cerfinits Trading Journal — Mobile Tab Bar Spec

- Date: 2026-07-15
- Owner: Kan / Cerfinits
- Track: Product + Build/Dev
- AI-OS gate: B1 locked micro-spec / G3.8 mobile navigation hardening
- Status: LOCKED for local implementation

## 1. Reproduced problems

1. At a 390x844 Browser frame the content viewport is `375px`, but the Add
   tab's center is `262.5px` instead of the viewport center at `187.5px`. Add is
   rendered fourth in a five-item grid, despite being the tab bar's emphasized
   capture action.
2. Next.js Dev Tools renders above the fixed mobile navigation in development.
   Its bottom-left trigger intercepted the Overview tab: clicking the visible
   Journal link left the URL on `/journal/add` and focus moved to
   `NEXTJS-PORTAL`. No Journal error was logged.

## 2. Locked decision

- Mobile tab order is `Overview · Trades · Add · Analytics · Settings`.
- Add remains the only emphasized circular action and occupies grid column 3
  of 5.
- Desktop navigation order is unchanged.
- Disable Next.js development indicators for localhost previews. Diagnostics
  remain available in the terminal and browser console; production output is
  unchanged.
- Every active mobile tab exposes `aria-current="page"`.

## 3. Acceptance criteria

- At the measured `375px` content width, the Add tab center equals the viewport
  center within one pixel.
- Exactly one visible mobile Add link remains.
- From `/journal/add?range=30d`, tapping Overview reaches
  `/journal?range=30d`; tapping Add from Overview returns to Add.
- The selected range survives both transitions.
- No visible framework control overlaps the tab bar.
- No horizontal overflow or relevant browser warning/error is present.
- Desktop one-click capture actions and navigation order remain unchanged.
- Journal tests, TypeScript, and the production build pass.

## 4. Non-goals and safety boundary

- No change to trade data, draft schema, validation, persistence, or metrics.
- No new tab, Review surface, animation, or floating action button.
- No remote write, live-account action, deploy, or G4 evidence claim.

