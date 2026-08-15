import {
  readSupabasePublicConfig,
  type PublicEnvironment,
  type SupabasePublicConfig,
} from "../supabase/config.ts";

export type JournalAccessMode =
  | "disabled"
  | "preview"
  | "supabase"
  | "misconfigured";

export type JournalAccessConfig = {
  mode: JournalAccessMode;
  reason:
    | "journal-disabled"
    | "local-preview"
    | "supabase-auth"
    | "auth-disabled-in-production"
    | "missing-supabase-config";
  supabase: SupabasePublicConfig | null;
};

function isTrue(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

function isFalse(value: string | undefined) {
  return value?.trim().toLowerCase() === "false";
}

/**
 * Whether site navigation should surface an entry point to /journal.
 * Mirrors route policy: visible only when the journal would actually serve
 * (local preview or Supabase-auth mode) — never links to a 404/hidden route.
 */
export function journalNavEnabled(
  env: PublicEnvironment = process.env,
): boolean {
  const mode = readJournalAccessConfig(env).mode;
  return mode === "preview" || mode === "supabase";
}

export function readJournalAccessConfig(
  env: PublicEnvironment = process.env,
): JournalAccessConfig {
  const production = env.NODE_ENV === "production";
  const journalEnabled = production
    ? isTrue(env.JOURNAL_ENABLED)
    : !isFalse(env.JOURNAL_ENABLED);

  if (!journalEnabled) {
    return {
      mode: "disabled",
      reason: "journal-disabled",
      supabase: null,
    };
  }

  const authEnabled = isTrue(env.JOURNAL_SUPABASE_AUTH_ENABLED);
  if (!authEnabled) {
    return production
      ? {
          mode: "misconfigured",
          reason: "auth-disabled-in-production",
          supabase: null,
        }
      : { mode: "preview", reason: "local-preview", supabase: null };
  }

  const supabase = readSupabasePublicConfig(env);
  if (!supabase) {
    return {
      mode: "misconfigured",
      reason: "missing-supabase-config",
      supabase: null,
    };
  }

  return { mode: "supabase", reason: "supabase-auth", supabase };
}
