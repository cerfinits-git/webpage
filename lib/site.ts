// Single source of truth for the public site URL.
// Change NEXT_PUBLIC_SITE_URL (or this fallback) once at domain cutover —
// canonical/OG/sitemap URLs all derive from here.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cerfinits.netlify.app";
