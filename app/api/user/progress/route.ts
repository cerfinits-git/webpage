import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth";
import { toggleProgress } from "@/lib/actions/progress";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ isLoggedIn: false, completedChapters: [] });
  }
  return NextResponse.json({
    isLoggedIn: true,
    username: user.username,
    completedChapters: user.completedChapters || [],
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.chapterId !== "string" || typeof body.completed !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await toggleProgress(body.chapterId, body.completed);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const updatedUser = await getCurrentUser();
  return NextResponse.json({
    success: true,
    completedChapters: updatedUser?.completedChapters || [],
  });
}
