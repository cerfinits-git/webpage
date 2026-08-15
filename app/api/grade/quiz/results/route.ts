import { NextResponse } from "next/server";
import { getQuizResultsFor } from "@/lib/grade/quiz-results";
import { getCurrentUser } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

/** The signed-in reader's own recorded results. Signed out returns an empty set. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.username) {
    return NextResponse.json({ results: {}, signedIn: false });
  }
  return NextResponse.json({
    results: await getQuizResultsFor(user.username),
    signedIn: true,
  });
}
