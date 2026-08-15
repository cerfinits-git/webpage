"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import LogoMark from "@/components/LogoMark";
import { T } from "@/components/site/LangContext";
import LangToggle from "@/components/site/LangToggle";
import ThemeToggle from "@/components/site/ThemeToggle";

const LINKS = [
  { href: "/", th: "หน้าหลัก", en: "Home" },
  { href: "/plan/portfolio", th: "พอร์ต", en: "Portfolio" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="nav">
      <Link href="/plan/portfolio" className="brand">
        <LogoMark />
        <span>Cerfinits</span> <span className="brand-suffix">PLAN</span>
      </Link>
      <nav style={{ display: "flex", gap: 4 }}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={`nl ${path === l.href ? "on" : ""}`}>
            <T th={l.th} en={l.en} />
          </Link>
        ))}
      </nav>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        <ThemeToggle />
        <LangToggle className="nav-lang" />
      </div>
    </header>
  );
}
