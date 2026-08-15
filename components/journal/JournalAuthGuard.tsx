"use client";

import { useEffect } from "react";
import Link from "next/link";
import { T } from "@/components/site/LangContext";

export default function JournalAuthGuard({ children, isLoggedIn }: { children: React.ReactNode, isLoggedIn: boolean }) {
  useEffect(() => {
    if (!isLoggedIn) {
      window.dispatchEvent(new CustomEvent("open-login"));
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '64px', textAlign: 'center', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', opacity: 0.2 }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h2 style={{ fontFamily: 'var(--thai)', fontSize: '24px', fontWeight: 600, marginBottom: '12px', color: 'var(--ink)' }}>
          <T th="ฟีเจอร์สงวนสิทธิ์" en="Members-only feature"/>
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: '32px', maxWidth: '400px' }}>
          <T th="กรุณาเข้าสู่ระบบเพื่อใช้งานส่วนของ Journal" en="Please sign in to use the Journal"/>
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-login'))}
            style={{ padding: '10px 24px', background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <T th="เข้าสู่ระบบ" en="Sign in"/>
          </button>
          <Link href="/" style={{ padding: '10px 24px', border: '1px solid var(--line)', borderRadius: '4px', color: 'var(--ink)', textDecoration: 'none' }}>
            <T th="กลับหน้าแรก" en="Back to home"/>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
