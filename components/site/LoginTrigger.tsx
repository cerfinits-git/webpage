"use client";

import { T } from "@/components/site/LangContext";

export default function LoginTrigger() {
  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new Event('open-login'));
      }}
      style={{ 
        display: 'inline-block', 
        background: 'var(--ink)', 
        color: 'var(--bg)', 
        padding: '8px 24px', 
        borderRadius: '4px', 
        fontSize: '13.5px', 
        fontWeight: 500, 
        border: 'none', 
        cursor: 'pointer' 
      }}
    >
      <T th="เข้าสู่ระบบ" en="Login" />
    </button>
  );
}
