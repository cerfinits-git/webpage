"use client";

import React from "react";
import Link from "next/link";
import { T } from "./LangContext";

export default function PremiumPaywall({ children, isPremium }: { children: React.ReactNode; isPremium: boolean }) {
  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Blurred Content */}
      <div style={{ filter: "blur(6px)", opacity: 0.4, pointerEvents: "none", userSelect: "none" }}>
        {children}
      </div>

      {/* Paywall Overlay */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "480px",
        background: "var(--panel)",
        border: "1px solid var(--gold)",
        borderRadius: "8px",
        padding: "40px 30px",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        zIndex: 10
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          background: "var(--gold-tint, rgba(154, 123, 63, 0.15))",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          color: "var(--gold)",
          fontSize: "24px",
          border: "1px solid var(--gold)"
        }}>
          🔒
        </div>
        
        <h3 style={{ margin: "0 0 12px", fontFamily: "var(--thai)", fontSize: "22px", color: "var(--ink)", fontWeight: 600 }}>
          <T th="เนื้อหานี้สงวนไว้สำหรับสมาชิก Premium" en="This content is for Premium members only" />
        </h3>
        
        <p style={{ margin: "0 0 28px", color: "var(--muted)", fontSize: "15px", lineHeight: 1.6, fontFamily: "var(--thai)" }}>
          <T 
            th="ปลดล็อกเนื้อหาเจาะลึก เทคนิคการลงทุน และบทเรียนทั้งหมดในหลักสูตรได้แบบไม่จำกัด ด้วยแพ็กเกจ Premium ของเรา" 
            en="Unlock in-depth content, investment techniques, and all lessons in the curriculum unlimitedly with our Premium package." 
          />
        </p>

        <Link href="/products" className="btn" style={{
          display: "inline-block",
          background: "var(--gold)",
          color: "#fff",
          padding: "14px 28px",
          borderRadius: "4px",
          textDecoration: "none",
          fontWeight: 500,
          fontFamily: "var(--thai)",
          fontSize: "16px",
          boxShadow: "0 4px 14px rgba(154, 123, 63, 0.3)",
          transition: "transform 0.2s, box-shadow 0.2s"
        }}>
          <T th="ดูรายละเอียด Premium" en="View Premium Details" />
        </Link>
        
        <div style={{ marginTop: "20px", fontSize: "13px", color: "var(--faint)", fontFamily: "var(--thai)" }}>
          <T th="มีข้อสงสัย? ติดต่อแอดมิน" en="Have questions? Contact Admin" />
        </div>
      </div>
    </div>
  );
}
