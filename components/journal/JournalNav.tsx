"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "@/components/LogoMark";
import { logout } from "@/lib/actions/auth";
import { buildJournalHref } from "@/lib/journal/range";
import JournalIcon, { type JournalIconName } from "./JournalIcon";
import { JournalThemeToggle } from "./JournalTheme";
import { useJournal } from "./JournalProvider";
import { T } from "@/components/site/LangContext";
import LangToggle from "@/components/site/LangToggle";

const NAV: { href: string; th: string; en: string; icon: JournalIconName }[] = [
  { href: "/journal", th: "ภาพรวม", en: "Overview", icon: "overview" },
  { href: "/journal/trades", th: "เทรด", en: "Trades", icon: "trades" },
  { href: "/journal/analytics", th: "วิเคราะห์", en: "Analytics", icon: "analytics" },
  { href: "/journal/playbook", th: "Playbook", en: "Playbook", icon: "playbook" },
  { href: "/journal/settings", th: "ตั้งค่า", en: "Settings", icon: "settings" },
];

const MOBILE_NAV: { href: string; th: string; en: string; icon: JournalIconName; capture?: boolean }[] = [
  { href: "/journal", th: "ภาพรวม", en: "Overview", icon: "overview" },
  { href: "/journal/trades", th: "เทรด", en: "Trades", icon: "trades" },
  { href: "/journal/add", th: "เพิ่ม", en: "Add", icon: "plus", capture: true },
  { href: "/journal/analytics", th: "วิเคราะห์", en: "Analytics", icon: "analytics" },
  { href: "/journal/settings", th: "ตั้งค่า", en: "Settings", icon: "settings" },
];

function isActive(path: string, href: string) {
  return href === "/journal" ? path === href : path.startsWith(href);
}

export default function JournalNav({
  authEnabled,
  user,
}: {
  authEnabled: boolean;
  user?: { username: string; name: string; picture?: string } | null;
}) {
  const path = usePathname();
  const { range } = useJournal();

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.username
    ? user.username.charAt(0).toUpperCase()
    : "L";

  return (
    <>
      <aside className="j-sidebar">
        <Link href={buildJournalHref("/journal", range)} className="j-brand" aria-label="Cerfinits Journal home">
          <LogoMark className="j-brand-mark" />
          <span>CERFINITS<br/><b>JOURNAL</b></span>
        </Link>
        <Link href="/" className="j-back-home">
          <JournalIcon name="arrow-left" size={16}/><span><T th="กลับหน้าหลัก Cerfinits" en="Back to Cerfinits"/></span>
        </Link>
        <nav className="j-side-nav" aria-label="Journal navigation">
          {NAV.map((item) => {
            const active = isActive(path, item.href);
            return (
              <Link key={item.href} href={buildJournalHref(item.href, range)} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined}>
                <JournalIcon name={item.icon}/><span><T th={item.th} en={item.en}/></span>
              </Link>
            );
          })}
        </nav>
        <div className="j-sidebar-foot">
          <div className="j-foot-user">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                referrerPolicy="no-referrer"
                style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--j-line)", display: "block" }}
              />
            ) : (
              <span className="j-avatar">{userInitial}</span>
            )}
            <div>
              <b>{user ? user.name : "Local preview"}</b>
              <small>{user ? user.username : "This device only"}</small>
            </div>
          </div>
          <div className="j-foot-controls">
            <LangToggle className="j-lang-toggle"/>
            <JournalThemeToggle className="j-foot-toggle"/>
          </div>
        </div>
      </aside>

      <nav className="j-bottom-nav" aria-label="Journal mobile navigation">
        {MOBILE_NAV.map((item) => {
          const active = isActive(path, item.href);
          return (
            <Link
              key={item.href}
              href={buildJournalHref(item.href, range)}
              className={`${active ? "is-active" : ""}${item.capture ? " j-add-nav" : ""}`.trim()}
              aria-current={active ? "page" : undefined}
            >
              {item.capture ? <span className="j-add-circle"><JournalIcon name={item.icon}/></span> : <JournalIcon name={item.icon}/>}<span><T th={item.th} en={item.en}/></span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
