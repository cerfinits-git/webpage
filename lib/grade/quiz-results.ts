import { createClient } from "@supabase/supabase-js";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import type { QuizResults } from "./quiz-public";

type StoredRow = {
  username: string;
  level: number;
  bestPercent: number;
  passed: boolean;
  attempts: number;
  firstPassedAt: string | null;
};

function getSupabaseClient() {
  const config = readSupabasePublicConfig();
  if (!config) return null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY missing — quiz results cannot be persisted to Supabase");
    return null;
  }
  return createClient(config.url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function normaliseUser(username: string): string {
  return username.trim().toLowerCase();
}

/** Fold one attempt into the running record for that level. */
function applyAttempt(previous: StoredRow | undefined, percent: number, passed: boolean, user: string, level: number): StoredRow {
  const nowPassed = passed || (previous?.passed ?? false);
  return {
    username: user,
    level,
    bestPercent: Math.max(percent, previous?.bestPercent ?? 0),
    passed: nowPassed,
    attempts: (previous?.attempts ?? 0) + 1,
    firstPassedAt: previous?.firstPassedAt ?? (passed ? new Date().toISOString() : null),
  };
}

export async function recordQuizAttempt(
  username: string,
  level: number,
  percent: number,
  passed: boolean,
): Promise<boolean> {
  const user = normaliseUser(username);
  let stored = false;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: existing } = await supabase
        .from("grade_quiz_results")
        .select("best_percent, passed, attempts, first_passed_at")
        .eq("username", user)
        .eq("level", level)
        .maybeSingle();

      const previous: StoredRow | undefined = existing
        ? {
            username: user,
            level,
            bestPercent: Number(existing.best_percent ?? 0),
            passed: Boolean(existing.passed),
            attempts: Number(existing.attempts ?? 0),
            firstPassedAt: existing.first_passed_at ? String(existing.first_passed_at) : null,
          }
        : undefined;

      const next = applyAttempt(previous, percent, passed, user, level);

      const { error } = await supabase.from("grade_quiz_results").upsert(
        {
          username: next.username,
          level: next.level,
          best_percent: next.bestPercent,
          passed: next.passed,
          attempts: next.attempts,
          first_passed_at: next.firstPassedAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "username,level" },
      );

      if (error) {
        console.error("Supabase recordQuizAttempt error:", JSON.stringify(error));
      } else {
        stored = true;
      }
    } catch (err) {
      console.error("Supabase recordQuizAttempt exception:", err);
    }
  }

  return stored;
}

export async function getQuizResultsFor(username: string): Promise<QuizResults> {
  const user = normaliseUser(username);
  const supabase = getSupabaseClient();
  if (!supabase) return {};

  try {
    const { data, error } = await supabase
      .from("grade_quiz_results")
      .select("level, best_percent, passed, attempts")
      .eq("username", user);

    if (!error && data) {
      const results: QuizResults = {};
      for (const row of data) {
        results[String(row.level)] = {
          bestPercent: Number(row.best_percent ?? 0),
          passed: Boolean(row.passed),
          attempts: Number(row.attempts ?? 0),
        };
      }
      return results;
    }
  } catch (err) {
    console.error("Supabase getQuizResultsFor error:", err);
  }

  return {};
}
