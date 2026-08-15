export type PublicEnvironment = Record<string, string | undefined>;

export type SupabasePublicConfig = {
  url: string;
  key: string;
  keyKind: "publishable" | "legacy-anon";
};

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeSupabaseUrl(value: string | undefined) {
  const raw = clean(value);
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/** Public browser credentials only. Never add a secret/service-role key here. */
export function readSupabasePublicConfig(
  env: PublicEnvironment = process.env,
): SupabasePublicConfig | null {
  const url = normalizeSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = clean(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const legacyAnonKey = clean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const key = publishableKey ?? legacyAnonKey;

  if (!url || !key) return null;

  return {
    url,
    key,
    keyKind: publishableKey ? "publishable" : "legacy-anon",
  };
}
