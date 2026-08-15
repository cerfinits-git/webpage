"use client";

import { useState, useTransition } from "react";
import { toggleProgress } from "@/lib/actions/progress";

export default function ProgressCheckbox({ chapterId, isCompleted }: { chapterId: string, isCompleted: boolean }) {
  const [checked, setChecked] = useState(isCompleted);
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link
    e.stopPropagation(); // Stop event bubbling
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
    <button 
      onClick={handleClick}
      disabled={isPending}
      style={{
        marginRight: '14px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: `2px solid ${checked ? 'var(--gold)' : 'var(--line-soft)'}`,
        background: checked ? 'var(--gold)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0,
        padding: 0,
        opacity: isPending ? 0.6 : 1
      }}
      title={checked ? "Mark as uncompleted" : "Mark as complete"}
    >
      <svg 
        viewBox="0 0 24 24" 
        width="14" 
        height="14" 
        stroke={checked ? "var(--bg)" : "transparent"} 
        strokeWidth="3.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ transition: 'stroke 0.2s ease' }}
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </button>
  );
}
