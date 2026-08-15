import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { safeJournalReturnTo } from "../../../../lib/auth/safe-return.ts";
import { readJournalAccessConfig } from "../../../../lib/journal/auth-config.ts";
import LoginForm from "./LoginForm";
import "./journal-auth.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ — Cerfinits Journal",
  robots: { index: false, follow: false },
};

export default async function JournalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const access = readJournalAccessConfig();
  if (access.mode === "disabled" || access.mode === "misconfigured") {
    notFound();
  }

  const query = await searchParams;
  const rawReturnTo = Array.isArray(query.returnTo)
    ? query.returnTo[0]
    : query.returnTo;
  const returnTo = safeJournalReturnTo(rawReturnTo);

  return (
    <main className="ja-page">
      <section className="ja-card" aria-labelledby="journal-login-title">
        <div className="ja-mark" aria-hidden="true">
          C
        </div>
        <p className="ja-eyebrow">CERFINITS JOURNAL</p>
        <h1 id="journal-login-title">
          {access.mode === "preview" ? "Local preview" : "ยินดีต้อนรับกลับ"}
        </h1>
        <p className="ja-lead">
          {access.mode === "preview"
            ? "ข้อมูลอยู่ในเบราว์เซอร์เครื่องนี้เท่านั้น ยังไม่มี remote sync"
            : "เข้าสู่ระบบเพื่อเปิด Journal ส่วนตัวของคุณ"}
        </p>

        {access.mode === "preview" ? (
          <Link className="ja-submit ja-link" href={returnTo}>
            เปิด Journal บนเครื่องนี้
          </Link>
        ) : (
          <LoginForm returnTo={returnTo} />
        )}

        <p className="ja-footnote">
          Remote sync ยังปิดอยู่จนกว่าจะผ่าน staging reconciliation
        </p>
      </section>
    </main>
  );
}
