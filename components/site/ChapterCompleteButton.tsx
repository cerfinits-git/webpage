"use client";

import { useState, useTransition } from "react";
import { toggleProgress } from "@/lib/actions/progress";
import { T } from "./LangContext";

export default function ChapterCompleteButton({ chapterId, isCompleted }: { chapterId: string, isCompleted: boolean }) {
  const [checked, setChecked] = useState(isCompleted);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const nextState = !checked;
    setChecked(nextState);
    startTransition(async () => {
      await toggleProgress(chapterId, nextState);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("grade-progress-updated"));
      }
    });
  };

  return (
    <div style={{ marginTop: '40px', padding: '20px', background: 'var(--card)', borderRadius: '8px', textAlign: 'center' }}>
      <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--muted)' }}>
        <T th="คุณเรียนจบบทนี้แล้วหรือยัง?" en="Have you completed this chapter?" />
      </p>
      <button 
        onClick={handleToggle}
        disabled={isPending}
        style={{
          padding: '10px 20px',
          background: checked ? 'var(--gold, #d4af37)' : 'var(--ink)',
          color: checked ? '#000' : 'var(--bg)',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 600,
          opacity: isPending ? 0.7 : 1
        }}
      >
        {checked ? <T th="✓ เรียนจบแล้ว" en="✓ Completed" /> : <T th="ทำเครื่องหมายว่าเรียนจบ" en="Mark as Complete" />}
      </button>
    </div>
  );
}
