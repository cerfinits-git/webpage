"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAdjacentChapters, getFlatChapters } from "@/lib/grade/curriculum";

export default function GradeChapterNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const { prev, next } = getAdjacentChapters(pathname);
  const flatChapters = getFlatChapters();
  const totalChapters = flatChapters.length;

  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/user/progress")
        .then((res) => res.json())
        .then((data) => {
          if (data.completedChapters && Array.isArray(data.completedChapters)) {
            const isDone = data.completedChapters.includes(pathname);
            setIsCompleted(isDone);
            localStorage.setItem("cerfinits_grade_progress", JSON.stringify(data.completedChapters));
            return;
          }
          const completed = JSON.parse(localStorage.getItem("cerfinits_grade_progress") || "[]");
          setIsCompleted(completed.includes(pathname));
        })
        .catch(() => {
          const completed = JSON.parse(localStorage.getItem("cerfinits_grade_progress") || "[]");
          setIsCompleted(completed.includes(pathname));
        });
    }
  }, [pathname, isLoggedIn]);

  const toggleComplete = async () => {
    if (!isLoggedIn) {
      window.dispatchEvent(new CustomEvent("open-login"));
      return;
    }
    const nextState = !isCompleted;
    setIsCompleted(nextState);

    try {
      const res = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId: pathname, completed: nextState }),
      });
      const data = await res.json();
      if (data.completedChapters && Array.isArray(data.completedChapters)) {
        localStorage.setItem("cerfinits_grade_progress", JSON.stringify(data.completedChapters));
      }
    } catch (err) {
      console.error("Failed to update progress on server", err);
    }

    window.dispatchEvent(new CustomEvent("grade-progress-updated"));
  };

  return (
    <div className="chapter-nav" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: '24px',
      marginTop: '64px',
      paddingTop: '32px',
      borderTop: '1px solid var(--line)',
      fontFamily: 'var(--mono)'
    }}>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={toggleComplete}
          style={{
            padding: '12px 24px',
            background: isCompleted ? 'var(--ink)' : 'transparent',
            color: isCompleted ? 'var(--bg)' : 'var(--ink)',
            border: '1px solid var(--ink)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'inherit',
            transition: 'all 0.2s'
          }}
        >
          {isCompleted ? "✓ เรียนจบแล้ว" : "ทำเครื่องหมายว่าเรียนจบแล้ว"}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {prev ? (
          <Link href={prev.href!} style={{ color: 'var(--muted)', textDecoration: 'none' }}>
            <span style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>← บทก่อนหน้า</span>
            <span style={{ color: 'var(--ink)' }}>{prev.n} {prev.t}</span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link href={next.href!} style={{ color: 'var(--muted)', textDecoration: 'none', textAlign: 'right' }}>
            <span style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>บทถัดไป →</span>
            <span style={{ color: 'var(--ink)' }}>{next.n} {next.t}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
