import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getQuiz, getQuizMeta, isPremiumQuiz } from "@/lib/grade/quiz";
import QuizRunner from "@/components/grade/QuizRunner";

// This page decides whether to serve paid content, so it must never be
// prerendered — a baked response would freeze one visitor's access state for
// everyone. Stated explicitly rather than left to the framework to infer, and
// generateStaticParams is deliberately absent: unknown levels hit notFound().
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const quiz = getQuiz(Number(level));
  if (!quiz) return { title: "ไม่พบแบบทดสอบ · Cerfinits Grade" };
  return {
    title: `แบบทดสอบ ${quiz.title} · Cerfinits Grade`,
    description: quiz.intro,
    alternates: { canonical: `/grade/checkpoint/${level}` },
  };
}

export default async function Page({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const quiz = getQuiz(Number(level));
  if (!quiz) notFound();

  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("cerfinits_auth");

  // The explanations restate the paid chapters, so a locked quiz must not
  // render its questions at all — hiding them with CSS would still ship them.
  if (isPremiumQuiz(quiz.level) && !isLoggedIn) {
    return (
      <div className="book">
        <div className="wrap runhead">
          <span className="brand">
            <span className="dot" /> Cerfinits Grade
          </span>
          <span>แบบทดสอบท้ายระดับ</span>
        </div>

        <div className="wrap qz-opener">
          <Link href="/grade" className="qz-back">
            ← กลับหน้าหลักสูตร
          </Link>
          <span className="kicker">แบบทดสอบ · ระดับ {quiz.level}</span>
          <h1>{quiz.title}</h1>
        </div>

        <div className="wrap">
          <div className="qz-locked">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <h2>แบบทดสอบ Premium</h2>
            <p>
              ระดับ 5–8 เป็นเนื้อหา Premium — แบบทดสอบและเฉลยอธิบายสาระของบทเรียนไว้ด้วย
              จึงเปิดให้เฉพาะผู้ที่เข้าถึงเนื้อหาส่วนนี้
            </p>
            <div className="qz-locked-actions">
              <Link href="/grade/checkpoint/4" className="qz-btn">
                ลองแบบทดสอบระดับ 4 (ไม่มีค่าใช้จ่าย)
              </Link>
              <Link href="/grade" className="qz-btn qz-btn-ghost">
                กลับหน้าหลักสูตร
              </Link>
            </div>
          </div>
        </div>

        <div className="wrap bookfoot" style={{ paddingBottom: "30px", borderTop: "none" }}>
          <span>CERFINITS GRADE</span>
          <span>ระดับ 1–4 เรียนและทำแบบทดสอบได้โดยไม่มีค่าใช้จ่าย</span>
        </div>
      </div>
    );
  }

  return (
    <div className="book">
      <div className="wrap runhead">
        <span className="brand">
          <span className="dot" /> Cerfinits Grade
        </span>
        <span>แบบทดสอบท้ายระดับ</span>
      </div>

      <div className="wrap qz-opener">
        <Link href="/grade" className="qz-back">
          ← กลับหน้าหลักสูตร
        </Link>
        <span className="kicker">แบบทดสอบ · ระดับ {quiz.level}</span>
        <h1>{quiz.title}</h1>
      </div>

      <div className="wrap">
        {/* Only the header travels to the client; questions arrive from the API
            without their answers, and grading happens on the server. */}
        <QuizRunner meta={getQuizMeta(quiz.level)!} />
      </div>

      <div className="wrap bookfoot" style={{ paddingBottom: "30px", borderTop: "none" }}>
        <span>CERFINITS GRADE</span>
        <span>แบบทดสอบนี้วัดความเข้าใจเนื้อหา ไม่ได้วัดความสามารถในการทำกำไร</span>
      </div>
    </div>
  );
}
