import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { gradeAttempt, isPremiumQuiz } from "@/lib/grade/quiz";
import { recordQuizAttempt } from "@/lib/grade/quiz-results";
import { getCurrentUser } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { level?: unknown; questionIds?: unknown; responses?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "รูปแบบคำขอไม่ถูกต้อง" }, { status: 400 });
  }

  const level = Number(body.level);
  if (!Number.isInteger(level)) {
    return NextResponse.json({ error: "ระดับไม่ถูกต้อง" }, { status: 400 });
  }

  if (isPremiumQuiz(level)) {
    const cookieStore = await cookies();
    if (!cookieStore.has("cerfinits_auth")) {
      return NextResponse.json({ error: "แบบทดสอบระดับนี้เปิดให้ผู้ที่เข้าถึงเนื้อหา Premium" }, { status: 403 });
    }
  }

  // Grading happens here, from the bank the browser never received.
  const outcome = gradeAttempt(level, body.questionIds, body.responses);
  if (!outcome.ok) {
    return NextResponse.json({ error: outcome.error }, { status: 400 });
  }

  // An anonymous reader still gets their score and explanations; only a signed-in
  // attempt is recorded, since a certificate needs someone to issue it to.
  const user = await getCurrentUser();
  let saved = false;
  if (user?.username) {
    saved = await recordQuizAttempt(user.username, level, outcome.percent, outcome.passed);
  }

  return NextResponse.json({
    percent: outcome.percent,
    correctCount: outcome.correctCount,
    total: outcome.total,
    passed: outcome.passed,
    graded: outcome.graded,
    saved,
  });
}
