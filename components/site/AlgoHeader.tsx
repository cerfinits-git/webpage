"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AlgoHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || document.documentElement.scrollTop) > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <Link href="/" className="brand">
          <span className="dot" /> Cerfinits <span className="sub">/ ALGO SDV.1</span>
        </Link>
        <nav className="nav-links">
          <Link href="/">← หน้าหลัก</Link>
          <a href="#results">ผลทดสอบ</a>
          <a href="#system">ระบบ</a>
          <a href="#pricing">แพ็กเกจ</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a href="https://discord.gg/jANDuDvn" target="_blank" rel="noopener" className="btn nav-cta">
          เช่าใช้งาน
        </a>
      </div>
    </header>
  );
}
