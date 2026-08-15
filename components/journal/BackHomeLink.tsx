"use client";

import Link from "next/link";
import JournalIcon from "./JournalIcon";
import { useLang } from "@/components/site/LangContext";

// Small client wrapper so the aria-label (a plain string attribute, not JSX
// children) can follow the language toggle even though JournalShell itself is
// a server component.
export default function BackHomeLink() {
  const { lang } = useLang();
  return (
    <Link href="/" className="j-topbar-home" aria-label={lang === "en" ? "Back to Cerfinits" : "กลับหน้าหลัก Cerfinits"}>
      <JournalIcon name="arrow-left" size={18}/>
    </Link>
  );
}
