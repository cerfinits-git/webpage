import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/actions/auth";
import SiteHeader from "@/components/site/SiteHeader";
import { journalNavEnabled } from "@/lib/journal/auth-config";
import SiteFooter from "@/components/site/SiteFooter";
import "./legal.css";

/**
 * Route group, so the pages under it stay at /privacy and /unsubscribe rather
 * than gaining a /legal prefix. They share a layout because they are read the
 * same way: long prose on a narrow measure, no marketing furniture.
 */
export default async function LegalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("cerfinits_auth");
  const user = isLoggedIn ? await getCurrentUser() : null;

  return (
    <div className="page">
      <SiteHeader isLoggedIn={isLoggedIn} user={user} journalEnabled={journalNavEnabled()} />
      <main className="legal-page">{children}</main>
      <SiteFooter />
    </div>
  );
}
