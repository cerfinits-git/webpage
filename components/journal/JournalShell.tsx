import JournalNav from "./JournalNav";
import JournalProvider from "./JournalProvider";
import { JournalStorageBadge, JournalStorageNotice } from "./JournalStorageStatus";
import { JournalThemeShell, JournalThemeToggle } from "./JournalTheme";
import { logout } from "@/lib/actions/auth";
import { T } from "@/components/site/LangContext";
import BackHomeLink from "./BackHomeLink";

export default function JournalShell({
  children,
  authEnabled,
  user,
}: {
  children: React.ReactNode;
  authEnabled: boolean;
  user?: { username: string; name: string; picture?: string } | null;
}) {
  return (
    <JournalProvider>
      <JournalThemeShell>
        <JournalNav authEnabled={authEnabled} user={user} />
        <main className="j-main">
          <div className="j-topbar">
            <BackHomeLink />
            <span className="j-topbar-brand">CERFINITS JOURNAL</span>
            <div className="j-topbar-actions">
              <JournalThemeToggle />
              <JournalStorageBadge />
              {user ? (
                <form action={logout}>
                  <button className="j-signout" type="submit">
                    <T th="ออกจากระบบ" en="Sign out" />
                  </button>
                </form>
              ) : null}
            </div>
          </div>
          <JournalStorageNotice />
          {children}
        </main>
      </JournalThemeShell>
    </JournalProvider>
  );
}
