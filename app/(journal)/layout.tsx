import type { Metadata } from "next";
import JournalShell from "@/components/journal/JournalShell";
import { readJournalAccessConfig } from "@/lib/journal/auth-config";
import "./journal.css";
import JournalAuthGuard from "@/components/journal/JournalAuthGuard";
import JournalAccountGuard from "@/components/journal/JournalAccountGuard";
import { LanguageProvider } from "@/components/site/LangContext";
import { getCurrentUser } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cerfinits Journal — Trading analytics in R",
  description: "Trading journal prototype for cTrader imports, round-trip trades, and evidence-first R analytics.",
  robots: { index: false, follow: false },
};

export default async function JournalRouteLayout({ children }: { children: React.ReactNode }) {
  const authEnabled = readJournalAccessConfig().mode === "supabase";
  const user = await getCurrentUser();

  return (
    <LanguageProvider>
      <JournalShell authEnabled={authEnabled} user={user}>
        <JournalAuthGuard isLoggedIn={Boolean(user)}>
          <JournalAccountGuard>
            {children}
          </JournalAccountGuard>
        </JournalAuthGuard>
      </JournalShell>
    </LanguageProvider>
  );
}
