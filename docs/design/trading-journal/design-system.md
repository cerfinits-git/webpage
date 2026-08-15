# Cerfinits Journal — Accepted Design System

- Status: ACCEPTED for G2 prototype
- Source concepts: revised `overview.png`, revised `trades.png`, and `mobile-add-trade.png`
- Native desktop viewport: 1440×960
- Native mobile viewport: 390×844

## Canonical decisions

The revised Overview concept owns the app shell. Trades owns the table layout. Trade Review is explicitly removed. Image-generation drift is rejected: Calendar, Performance, Reports, Review, Tags, Insights, trader profiles, and pricing-plan labels must not be added.

## Allowed primary navigation copy

- ภาพรวม
- เทรด
- วิเคราะห์
- Playbook
- ตั้งค่า
- Import trades

## Visual tokens

- Canvas: Cerfinits warm gray `#d7d6d0`
- Panel: `#dcdbd5`
- Surface: `#e2e1db`
- Ink: `#272727`
- Muted: `#6f6d66`
- Border: `rgba(39,39,39,.16)`
- Positive: `#5a7d5a`
- Negative: `#9d5a4f`
- Accent: Cerfinits gold `#9a7b3f`
- Black control: `#1f1f1f`
- Radius: 2–4px controls/tables/panels; no rounded fintech bubbles
- Shadow: none; hierarchy comes from borders, spacing, and type

## Typography

- Family: Geist + Anuphan from the existing root layout
- Page title: 32–36px / 650 desktop, 24px mobile
- Section title: 18–20px / 600
- Metric: 28–34px / 600 with tabular numerals
- Body: 14px desktop, 15–16px mobile
- UI chrome: 12–14px, never browser-default sizing
- Table: 13px with tabular numerals for values

## Container model

- Desktop: fixed 240px sidebar + fluid content; compact 64px top bar
- Desktop content gutter: 32–40px
- Mobile: no sidebar; top bar + bottom navigation + safe-area padding
- Dashboard metrics use four purposeful surfaces
- Main charts use one open bordered frame
- Trades uses a dense table and filter rail, not cards

## Component families

- `JournalShell`: sidebar, top utility area, mobile bottom nav
- `JournalSidebarLink`: icon + label + selected state
- `JournalButton`: primary, secondary, quiet
- `JournalSelect`, `JournalField`, `JournalSegmentedControl`
- `MetricCard`: label, value, sample size, optional sparkline
- `DataStatus`: complete, missing-risk, invalid
- `TradeTable`: filters, sortable-like header, selected row, row action
- `ChartFrame`: cumulative R and analytics SVGs

## Icon inventory

Use one custom outline SVG family: 20×20, 1.6px stroke, round caps/joins.

- Overview: trend line
- Trades: list
- Analytics: bar chart
- Playbook: open book
- Settings: gear
- Import: upload arrow
- Add: plus
- Search: magnifier
- Date: calendar
- Account: user circle
- Navigation: chevrons
- Row action: vertical dots

## Interaction and motion

- Selected navigation: soft gray background + ink text
- Table hover/selected: pale blue-gray background and left accent rule
- Form focus: teal 2px focus ring
- Buttons: 120ms background/transform transition; no floaty animation
- Respect `prefers-reduced-motion`

## Overview copy lock

- Trading Journal
- วัดกระบวนการ ไม่ใช่แค่กำไร
- Net R
- Expectancy
- Profit Factor
- Win Rate
- Cumulative R
- Recent trades
- Data completeness

## Trades copy lock

- Trades
- ทุก execution รวมเป็นหนึ่ง round-trip trade
- ค้นหา symbol หรือ setup
- Add trade
- Setup / Symbol / Side / Result / Data status
- Last import / Resolve / Clear filters
- Opened / Symbol / Side / Setup / Entry → Exit / Net P&L / R / Data

## Intentional concept corrections

- Use dates in 2026, not 2024/2025 drift from generated concepts.
- Use Thai navigation consistently; standard trading terms remain English.
- The mobile concept is taller than 844px in generated output; implementation must fit through natural scrolling while keeping sticky actions and bottom navigation usable. Its primary action becomes “Save trade”.
- Generated chart values are illustrative. Code uses the seeded trade dataset as the single source of truth.
- Do not implement invented profile, plan, notifications, help, or subscription UI.
