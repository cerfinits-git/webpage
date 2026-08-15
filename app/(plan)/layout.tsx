import type { Metadata } from "next";
import PlanNav from "@/components/plan/PlanNav";
import "@/app/(journal)/journal.css";
import { JournalThemeShell } from "@/components/journal/JournalTheme";
import { LanguageProvider } from "@/components/site/LangContext";
import { T } from "@/components/site/LangContext";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Cerfinits Plan — วางแผนการเงินและการลงทุน",
  description:
    "เว็บวางแผนการเงินและติดตามพอร์ตการลงทุนสำหรับครอบครัว — หุ้น/ETF ต่างประเทศ, crypto, ทองคำ",
  robots: { index: false, follow: false },
};

export default async function PlanLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("cerfinits_auth");
  const user = isLoggedIn ? await getCurrentUser() : null;

  return (
    <LanguageProvider>
      <JournalThemeShell>
        <PlanNav user={user} />
        <div className="j-main">
          <main>{children}</main>
          <footer
            className="foot"
            style={{
              borderTop: "1px solid var(--j-line)",
              background: "var(--j-bg)",
              color: "var(--j-muted)",
              padding: "16px 24px",
              fontSize: "11px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>CERFINITS PLAN · EDGE + DISCIPLINE = SUCCESS</span>
            <span>
              <T
                th="ธุรกรรมเป็นข้อมูลตัวอย่าง · ไม่ใช่คำแนะนำการลงทุน"
                en="Transactions are sample data · not investment advice"
              />
            </span>
          </footer>
        </div>
      </JournalThemeShell>
    </LanguageProvider>
  );
}
