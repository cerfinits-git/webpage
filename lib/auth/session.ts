import { cookies } from "next/headers";

/**
 * The signed-in user's id, or null when there is no session.
 *
 * Route handlers used to read this cookie with a `|| 'admin'` fallback, which
 * silently turned every anonymous request into the admin account — anyone could
 * read, overwrite, or delete that account's data without signing in. Callers
 * must now handle null themselves, so the failure mode is a 401 rather than a
 * privilege grant.
 */
export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const value = store.get("cerfinits_auth")?.value?.trim();
  return value ? normaliseUserId(value) : null;
}

/**
 * Lowercase the id before it reaches storage.
 *
 * The cookie carries whatever the sign-in form was given, so "Cerfinits@..."
 * and "cerfinits@..." used to resolve to two different accounts: the broker
 * connection and playbook lived under one while the trade history split across
 * both. users.username, grade_quiz_results and grade_certificates already
 * lowercase, so this brings the rest into line.
 */
export function normaliseUserId(userId: string): string {
  return userId.trim().toLowerCase();
}
