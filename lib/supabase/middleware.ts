import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { SupabasePublicConfig } from "./config.ts";

function makePrivate(response: NextResponse) {
  response.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate, max-age=0",
  );
  response.headers.set("Expires", "0");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export type RefreshedJournalSession = {
  response: NextResponse;
  verified: boolean;
  subject: string | null;
};

export async function refreshJournalSession(
  request: NextRequest,
  config: SupabasePublicConfig,
): Promise<RefreshedJournalSession> {
  let response = makePrivate(NextResponse.next({ request }));

  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
        makePrivate(response);
      },
    },
  });

  try {
    const { data, error } = await supabase.auth.getClaims();
    const subject = data?.claims?.sub;
    const verified = !error && typeof subject === "string" && subject.length > 0;
    return { response, verified, subject: verified ? subject : null };
  } catch {
    return { response, verified: false, subject: null };
  }
}
