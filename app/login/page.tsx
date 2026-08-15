"use client";

import Link from "next/link";
import { Suspense, useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { login, type AuthState } from "@/lib/actions/auth";

const initialLoginState: AuthState = {};

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/plan/portfolio";
  const [state, formAction, pending] = useActionState(login, initialLoginState);

  useEffect(() => {
    if (state?.success) window.location.href = callbackUrl;
  }, [state?.success, callbackUrl]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg, #f5f5f5)",
      fontFamily: "var(--sans, sans-serif)",
      padding: "20px"
    }}>
      <div style={{
        background: "var(--card, #fff)",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", color: "var(--ink, #333)", fontWeight: 600 }}>Cerfinits Login</h1>
          <p style={{ margin: "8px 0 0", color: "var(--muted, #666)", fontSize: "14px" }}>
            เข้าสู่ระบบด้วยชื่อผู้ใช้และรหัสผ่าน
          </p>
        </div>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px", textAlign: "left" }}>
          <input
            name="username"
            placeholder="ชื่อผู้ใช้"
            autoComplete="username"
            required
            style={{ padding: "11px 12px", border: "1px solid var(--line, #dadce0)", borderRadius: "6px", fontSize: "15px", background: "var(--bg, #fff)", color: "var(--ink, #333)", fontFamily: "inherit", boxSizing: "border-box" }}
          />
          <input
            name="password"
            type="password"
            placeholder="รหัสผ่าน"
            autoComplete="current-password"
            required
            style={{ padding: "11px 12px", border: "1px solid var(--line, #dadce0)", borderRadius: "6px", fontSize: "15px", background: "var(--bg, #fff)", color: "var(--ink, #333)", fontFamily: "inherit", boxSizing: "border-box" }}
          />
          {state?.error ? (
            <span style={{ fontSize: "13px", color: "#d33" }}>{state.error}</span>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            style={{ padding: "12px", background: "var(--ink, #1f1f1f)", color: "var(--bg, #fff)", border: "none", borderRadius: "6px", cursor: pending ? "not-allowed" : "pointer", fontSize: "15px", fontWeight: 500, fontFamily: "inherit", opacity: pending ? 0.6 : 1 }}
          >
            {pending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 18px 0" }}>
          <span style={{ flex: 1, height: "1px", background: "var(--line, #e5e5e5)" }} />
          <span style={{ fontSize: "12px", color: "var(--muted, #999)" }}>หรือ</span>
          <span style={{ flex: 1, height: "1px", background: "var(--line, #e5e5e5)" }} />
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/api/auth/google";
          }}
          style={{
            width: "100%",
            padding: "12px",
            background: "#fff",
            color: "#3c4043",
            border: "1px solid #dadce0",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxSizing: "border-box",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            transition: "background 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8f9fa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
          Continue with Google
        </button>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Link href="/" style={{ color: "var(--muted, #666)", fontSize: "14px", textDecoration: "none" }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
