import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/actions/auth";
import SiteHeader from "@/components/site/SiteHeader";
import { journalNavEnabled } from "@/lib/journal/auth-config";
import SiteFooter from "@/components/site/SiteFooter";
import "./grade.css";

import GradeChapterLayout from "@/components/grade/GradeChapterLayout";

export default async function GradeLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("cerfinits_auth");
  const user = await getCurrentUser();
  const isPremium = user?.isPremium || false;

  return (
    <div className="page">
      <SiteHeader isLoggedIn={isLoggedIn} user={user} journalEnabled={journalNavEnabled()} />
      <GradeChapterLayout isLoggedIn={isLoggedIn} isPremium={isPremium}>{children}</GradeChapterLayout>
      <SiteFooter />
    </div>
  );
}
