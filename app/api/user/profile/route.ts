import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ isLoggedIn: false, user: null });
  }
  return NextResponse.json({
    isLoggedIn: true,
    user: {
      username: user.username,
      name: user.name,
      email: user.email,
      picture: user.picture,
      isPremium: user.isPremium ?? true,
      completedChapters: user.completedChapters || [],
    },
  });
}
