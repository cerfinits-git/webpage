import {
  readJournalAccessConfig,
  type JournalAccessConfig,
} from "./auth-config.ts";
import type { PublicEnvironment } from "../supabase/config.ts";

export type JournalSyncMode =
  | "disabled"
  | "misconfigured"
  | "writes-blocked"
  | "dry-run";

export type JournalSyncConfig = {
  mode: JournalSyncMode;
  reason:
    | "sync-disabled"
    | "supabase-auth-required"
    | "remote-writes-not-authorized"
    | "staging-read-only";
  access: JournalAccessConfig;
};

function isTrue(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

export function readJournalSyncConfig(
  env: PublicEnvironment = process.env,
): JournalSyncConfig {
  const access = readJournalAccessConfig(env);

  if (!isTrue(env.JOURNAL_SYNC_ENABLED)) {
    return { mode: "disabled", reason: "sync-disabled", access };
  }

  if (access.mode !== "supabase") {
    return {
      mode: "misconfigured",
      reason: "supabase-auth-required",
      access,
    };
  }

  if (!isTrue(env.JOURNAL_SYNC_DRY_RUN)) {
    return {
      mode: "writes-blocked",
      reason: "remote-writes-not-authorized",
      access,
    };
  }

  return { mode: "dry-run", reason: "staging-read-only", access };
}
