"use client";

import { useActionState } from "react";
import {
  journalLogin,
  type JournalAuthState,
} from "@/lib/actions/journal-auth";

const INITIAL_STATE: JournalAuthState = {};

export default function LoginForm({ returnTo }: { returnTo: string }) {
  const [state, formAction, isPending] = useActionState(
    journalLogin,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="ja-form">
      <input type="hidden" name="returnTo" value={returnTo} />

      <label className="ja-field">
        <span>อีเมล</span>
        <input
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          autoFocus
        />
      </label>

      <label className="ja-field">
        <span>รหัสผ่าน</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {state.error ? (
        <p className="ja-error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="ja-submit" disabled={isPending}>
        {isPending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ Journal"}
      </button>
    </form>
  );
}
