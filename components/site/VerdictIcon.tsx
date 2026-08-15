import type { ReactNode } from "react";
import type { Verdict } from "@/lib/reports";

// Vector verdict indicator (replaces the 🟢/🟡/🔴 emoji in the UI).
// Meaning doubles up: shape (up / wait / down) + inherited color (green / gold / red).
// Uses currentColor, so the caller sets the color via `color` on the parent.
export default function VerdictIcon({ verdict, size = 18 }: { verdict: Verdict; size?: number }) {
  let paths: ReactNode;
  if (verdict === "buy" || verdict === "accumulate") {
    // trending up
    paths = (
      <>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </>
    );
  } else if (verdict === "sell" || verdict === "trim") {
    // trending down
    paths = (
      <>
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
      </>
    );
  } else {
    // hold / wait → pause bars
    paths = (
      <>
        <line x1="9" y1="6" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="18" />
      </>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flex: "none" }}
    >
      {paths}
    </svg>
  );
}
