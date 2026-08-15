// Newsletter-only PostgREST helper. Journal Auth uses the request-scoped SSR
// clients in lib/supabase/; this helper never receives a secret/service key.
import { readSupabasePublicConfig } from "./supabase/config.ts";

const publicConfig = readSupabasePublicConfig();

export const supabaseConfigured = Boolean(publicConfig);

export type InsertResult = "ok" | "duplicate" | "error";

/** INSERT one row via PostgREST. RLS decides what the anon key may touch. */
export async function supabaseInsert(
  table: string,
  row: Record<string, unknown>,
): Promise<InsertResult> {
  if (!supabaseConfigured) return "error";
  try {
    const res = await fetch(`${publicConfig!.url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: publicConfig!.key,
        Authorization: `Bearer ${publicConfig!.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row),
    });
    if (res.ok) return "ok";
    if (res.status === 409) return "duplicate"; // unique violation
    console.error(`supabase insert ${table}: HTTP ${res.status}`, await res.text().catch(() => ""));
    return "error";
  } catch (e) {
    console.error(`supabase insert ${table}:`, e);
    return "error";
  }
}
