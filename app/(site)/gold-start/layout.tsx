import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/actions/auth";
import SiteHeader from "@/components/site/SiteHeader";
import { journalNavEnabled } from "@/lib/journal/auth-config";
import SiteFooter from "@/components/site/SiteFooter";
import ChapterNav from "./ChapterNav";
import "./gold-start.css";

export default async function GoldStartLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("cerfinits_auth");
  const user = isLoggedIn ? await getCurrentUser() : null;

  return (
    <div className="page gold-start">
      <SiteHeader isLoggedIn={isLoggedIn} user={user} journalEnabled={journalNavEnabled()} />
      <div className="gs">
        {children}
        <ChapterNav />
      </div>
      <SiteFooter />
    </div>
  );
}
