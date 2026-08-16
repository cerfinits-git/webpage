"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "@/components/LogoMark";
import { T } from "@/components/site/LangContext";
import LangToggle from "@/components/site/LangToggle";
import { JournalThemeToggle } from "@/components/journal/JournalTheme";
import JournalIcon from "@/components/journal/JournalIcon";

import { clientSignOut } from "@/lib/auth/client-logout";

const NAV = [
  { href: "/plan/portfolio", th: "พอร์ต", en: "Portfolio", icon: "overview" as const },
];

export default function PlanNav({
  user,
}: {
  user?: { username: string; name: string; picture?: string } | null;
}) {
  const path = usePathname();
  const initial = user?.name?.charAt(0).toUpperCase() ?? user?.username?.charAt(0).toUpperCase() ?? "L";

  return (
    <>
      <aside className="j-sidebar">
        <Link href="/plan/portfolio" className="j-brand" aria-label="Cerfinits Plan">
          <LogoMark className="j-brand-mark" />
          <span>
            CERFINITS
            <br />
            <b>PLAN</b>
          </span>
        </Link>

        <Link href="/" className="j-back-home">
          <JournalIcon name="arrow-left" size={16} />
          <span>
            <T th="กลับหน้าหลัก Cerfinits" en="Back to Cerfinits" />
          </span>
        </Link>

        <nav className="j-side-nav" aria-label="Plan navigation">
          {NAV.map((item) => {
            const active = path.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "is-active" : ""}
                aria-current={active ? "page" : undefined}
              >
                <JournalIcon name={item.icon} />
                <span>
                  <T th={item.th} en={item.en} />
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="j-sidebar-foot">
          <div className="j-foot-user">
            {user?.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.picture}
                alt={user.name}
                referrerPolicy="no-referrer"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid var(--j-line)",
                  display: "block",
                  flexShrink: 0,
                }}
              />
            ) : (
              <span className="j-avatar" style={{ flexShrink: 0 }}>{initial}</span>
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <b>{user ? user.name : "Local preview"}</b>
              <small>{user ? user.username : "This device only"}</small>
            </div>
            {user ? (
              <button
                type="button"
                className="j-foot-signout"
                onClick={() => clientSignOut()}
                title="ออกจากระบบ"
                aria-label="Sign out"
              >
                <JournalIcon name="signout" size={14} />
              </button>
            ) : null}
          </div>
          <div className="j-foot-controls">
            <LangToggle className="j-lang-toggle" />
            <JournalThemeToggle className="j-foot-toggle" />
          </div>
        </div>
      </aside>

      {/* Mobile navigation */}
      <nav className="j-bottom-nav" aria-label="Plan mobile navigation">
        <Link href="/">
          <JournalIcon name="arrow-left" size={16} />
          <span>
            <T th="หน้าหลัก" en="Home" />
          </span>
        </Link>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={path.startsWith(item.href) ? "is-active" : ""}
            aria-current={path.startsWith(item.href) ? "page" : undefined}
          >
            <JournalIcon name={item.icon} />
            <span>
              <T th={item.th} en={item.en} />
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
