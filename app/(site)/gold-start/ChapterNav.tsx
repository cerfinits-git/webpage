"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T, useLang } from "@/components/site/LangContext";

const CHAPTERS = [
  { path: "/gold-start/ch01", title: "บทที่ 01", en_title: "Chapter 01" },
  { path: "/gold-start/ch02", title: "บทที่ 02", en_title: "Chapter 02" },
  { path: "/gold-start/ch03", title: "บทที่ 03", en_title: "Chapter 03" },
  { path: "/gold-start/ch04", title: "บทที่ 04", en_title: "Chapter 04" },
  { path: "/gold-start/ch05", title: "บทที่ 05", en_title: "Chapter 05" },
  { path: "/gold-start/ch06", title: "บทที่ 06", en_title: "Chapter 06" },
  { path: "/gold-start/ch07", title: "บทที่ 07", en_title: "Chapter 07" },
  { path: "/gold-start/ch08", title: "บทที่ 08", en_title: "Chapter 08" },
  { path: "/gold-start/ch09", title: "บทที่ 09", en_title: "Chapter 09" },
  { path: "/gold-start/ch10", title: "บทที่ 10", en_title: "Chapter 10" },
  { path: "/gold-start/cheatsheet", title: "Cheat Sheet", en_title: "Cheat Sheet" },
  { path: "/gold-start/glossary", title: "อภิธานศัพท์", en_title: "Glossary" },
];

export default function ChapterNav() {
  const pathname = usePathname();
  const { lang } = useLang();
  if (pathname === "/gold-start") return null;

  const currentIndex = CHAPTERS.findIndex((c) => c.path === pathname);
  if (currentIndex === -1) return null; // fallback for unknown pages

  const prev = currentIndex > 0 ? CHAPTERS[currentIndex - 1] : { path: "/gold-start", title: "สารบัญ", en_title: "Index" };
  const next = currentIndex < CHAPTERS.length - 1 ? CHAPTERS[currentIndex + 1] : null;

  return (
    <div className="book" style={{ borderTop: 0, marginTop: '-1px' }}>
      <div className="wrap next" style={{ borderTop: 'none', marginTop: 0, paddingTop: '30px', paddingBottom: '40px' }}>
        <div className="nx"><T th="การนำทาง" en="Navigation" /></div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginTop: "24px" }}>
          <Link href={prev.path} className="btn ghost" style={{ flex: 1, minWidth: "200px" }}>
            ← <T th={`ก่อนหน้า: ${prev.title}`} en={`Previous: ${prev.en_title}`} />
          </Link>
          {next ? (
            <Link href={next.path} className="btn" style={{ flex: 1, minWidth: "200px" }}>
              <T th={`ถัดไป: ${next.title}`} en={`Next: ${next.en_title}`} /> →
            </Link>
          ) : (
            <Link href="/gold-start" className="btn" style={{ flex: 1, minWidth: "200px" }}>
              <T th="กลับสู่สารบัญ" en="Back to Index" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
