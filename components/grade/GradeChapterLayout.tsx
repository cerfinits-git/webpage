"use client";

import { usePathname } from "next/navigation";
import GradeChapterNav from "./GradeChapterNav";

import { CURRICULUM } from "@/lib/grade/curriculum";
import Link from "next/link";

export default function GradeChapterLayout({ children, isLoggedIn, isPremium }: { children: React.ReactNode, isLoggedIn: boolean, isPremium: boolean }) {
  const pathname = usePathname();
  
  // Exclude the main grade page from this layout
  if (pathname === "/grade") {
    return <div className="gsc">{children}</div>;
  }
  
  // Find chapter tier
  const currentGrade = CURRICULUM.find(grade => 
    grade.secs.some(sec => sec.href === pathname)
  );
  
  const isPremChapter = currentGrade?.tier === "prem";
  
  if (isPremChapter && (!isLoggedIn || !isPremium)) {
    return (
      <div className="gsc">
        <div className="book" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '64px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', opacity: 0.2 }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--thai)', fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>เนื้อหาสำหรับสมาชิก Premium</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '32px', maxWidth: '400px' }}>
            คุณต้องเข้าสู่ระบบและมีสิทธิ์ Premium จึงจะสามารถเข้าถึงเนื้อหาบทเรียนนี้ได้
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {!isLoggedIn ? (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-login'))}
                style={{ padding: '10px 24px', background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                เข้าสู่ระบบ
              </button>
            ) : null}
            <Link href="/grade" style={{ padding: '10px 24px', border: '1px solid var(--line)', borderRadius: '4px', color: 'var(--ink)' }}>
              กลับไปหน้ารวม
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gsc">
      <div className="book">
        {children}
        <div className="wrap" style={{ paddingBottom: '64px' }}>
          <GradeChapterNav isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </div>
  );
}
