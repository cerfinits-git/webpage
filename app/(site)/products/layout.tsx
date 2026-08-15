import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/actions/auth";
import SiteHeader from "@/components/site/SiteHeader";
import { journalNavEnabled } from "@/lib/journal/auth-config";
import SiteFooter from "@/components/site/SiteFooter";

export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("cerfinits_auth");
  const user = isLoggedIn ? await getCurrentUser() : null;

  return (
    <div className="page">
      <SiteHeader isLoggedIn={isLoggedIn} user={user} journalEnabled={journalNavEnabled()} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
