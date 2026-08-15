import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  readSupabasePublicConfig,
  type SupabasePublicConfig,
} from "./config.ts";

export async function createSupabaseServerClient(
  suppliedConfig?: SupabasePublicConfig,
) {
  const config = suppliedConfig ?? readSupabasePublicConfig();
  if (!config) {
    throw new Error("Supabase public configuration is missing");
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Middleware refreshes them.
        }
      },
    },
  });
}
