import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getQuiz, getQuizMeta, drawPublicQuestions, isPremiumQuiz } from "@/lib/grade/quiz";

// Each request draws a fresh random set, so this must never be cached.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const level = Number(new URL(request.url).searchParams.get("level"));
  const quiz = getQuiz(level);
  if (!quiz) {
    return NextResponse.json({ error: "ไม่พบแบบทดสอบระดับนี้" }, { status: 404 });
  }

  // Premium quizzes restate the paid chapters in their explanations, so the
  // questions must not be served at all to a signed-out reader.
  if (isPremiumQuiz(level)) {
    const cookieStore = await cookies();
    if (!cookieStore.has("cerfinits_auth")) {
      return NextResponse.json({ error: "แบบทดสอบระดับนี้เปิดให้ผู้ที่เข้าถึงเนื้อหา Premium" }, { status: 403 });
    }
  }

  return NextResponse.json({
    meta: getQuizMeta(level),
    questions: drawPublicQuestions(quiz),
  });
}
