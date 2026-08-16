"use client";

import { logout } from "@/lib/actions/auth";

/**
 * Clears all user, trading journal, quiz, and portfolio data stored in browser localStorage.
 * Preserves general appearance preferences (theme, language) if present.
 */
export function clearCerfinitsClientStorage() {
  if (typeof window === "undefined") return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (
        key &&
        (key.startsWith("cerfinits") ||
          key.startsWith("cf_") ||
          key.includes("journal") ||
          key.includes("playbook") ||
          key.includes("quiz") ||
          key.includes("draft"))
      ) {
        // Retain site-wide theme and language preference so user UI remains consistent
        if (key !== "cf-theme" && key !== "cf-lang" && key !== "cerfinits-journal-theme-v1") {
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch (e) {
    console.error("Failed to clear Cerfinits client storage:", e);
  }
}

/**
 * Performs a complete sign out:
 * 1. Purges local journal, trading accounts, and quiz caches from localStorage.
 * 2. Deletes the server-side cerfinits_auth cookie.
 * 3. Redirects the user to the homepage.
 */
export async function clientSignOut() {
  clearCerfinitsClientStorage();
  await logout();
}
