# Cerfinits Trading Journal — One-click Capture Spec

- Date: 2026-07-15
- Owner: Kan / Cerfinits
- Track: Product + Build/Dev
- AI-OS gate: B1 locked micro-spec / G3.7 local daily-use hardening
- Status: LOCKED for local implementation

## 1. Reproduced problem

Desktop Browser evidence on `/journal` found zero visible links to
`/journal/add`. The only Add entry in the DOM belongs to the mobile bottom
navigation and is hidden above the mobile breakpoint. A desktop user therefore
has to open Trades before reaching Add trade.

Mobile already exposes one obvious Add action in the fixed center navigation.
Adding another mobile control would create competing actions rather than reduce
friction.

## 2. Locked decision

Add one adaptive action group to the desktop Journal sidebar:

1. An account with no trades keeps `Import trades` first and primary; `Add
   trade` remains visible as the secondary alternative.
2. An account with at least one trade shows `Add trade` first and primary;
   `Import trades` becomes secondary.
3. Both links preserve the selected Journal range.
4. `/journal/add` receives a restrained current-page treatment.
5. The mobile bottom navigation is unchanged and the desktop action group stays
   hidden at `760px` and below.

This is account-scoped. Trades in another account must not change the active
account's action priority.

## 3. Why this is the smallest useful change

- It removes one navigation step from daily manual capture on every desktop
  Journal page.
- It preserves the already locked empty-account first-value hierarchy, where a
  broker import is the fastest path to useful history.
- It introduces no mutation, shortcut listener, modal, Review surface, or new
  route.
- It reuses the accepted Cerfinits sidebar, icon, spacing, palette, and focus
  primitives.

## 4. Acceptance criteria

- A populated active account has exactly one visible desktop `Add trade` entry
  and reaches `/journal/add` in one click.
- An empty active account exposes Import as the first primary sidebar action and
  Add as secondary.
- The priority decision uses only trades owned by the active account.
- The selected `range` query survives both Add and Import navigation.
- At 390x844, the sidebar is hidden and exactly one visible Add entry remains in
  the existing bottom navigation.
- Desktop and mobile have no horizontal overflow or relevant console errors.
- Unit tests, TypeScript, and the production build pass.

## 5. Non-goals and safety boundary

- No keyboard shortcut in this slice.
- No change to trade validation, persistence, import logic, analytics, or
  dogfood evidence.
- No remote Supabase write, production data change, live trading action, or G4
  gate claim.

