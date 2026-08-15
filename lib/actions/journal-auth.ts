"use server";

import { redirect } from "next/navigation";
import { safeJournalReturnTo } from "../auth/safe-return.ts";
import { readJournalAccessConfig } from "../journal/auth-config.ts";
import { createSupabaseServerClient } from "../supabase/server.ts";

export type JournalAuthState = { error?: string };

export async function journalLogin(
  _previousState: JournalAuthState,
  formData: FormData,
): Promise<JournalAuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const returnTo = safeJournalReturnTo(formData.get("returnTo"));

  if (!email || !password) {
    return { error: "กรอกอีเมลและรหัสผ่านให้ครบ" };
  }

  const access = readJournalAccessConfig();
  if (access.mode !== "supabase" || !access.supabase) {
    return { error: "ระบบเข้าสู่ระบบยังไม่พร้อมใช้งาน" };
  }

  try {
    const supabase = await createSupabaseServerClient(access.supabase);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
    }
  } catch {
    return { error: "เชื่อมต่อระบบเข้าสู่ระบบไม่ได้ กรุณาลองใหม่" };
  }

  redirect(returnTo);
}

export async function journalLogout() {
  const access = readJournalAccessConfig();
  if (access.mode === "supabase" && access.supabase) {
    try {
      const supabase = await createSupabaseServerClient(access.supabase);
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      // Redirect to the login boundary even if the remote revoke is unavailable.
    }
  }

  redirect("/auth/journal/login");
}
