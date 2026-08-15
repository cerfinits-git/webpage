import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth";
import { getQuizResultsFor } from "@/lib/grade/quiz-results";
import {
  evaluateAllTracks,
  evaluateTrack,
  getCertificatesFor,
  issueCertificate,
  TRACKS,
  type CertificateTrack,
} from "@/lib/grade/certificates";

export const dynamic = "force-dynamic";

/** The signed-in reader's eligibility and any certificates already issued. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.username) {
    return NextResponse.json({ signedIn: false, eligibility: [], certificates: [] });
  }

  const results = await getQuizResultsFor(user.username);
  return NextResponse.json({
    signedIn: true,
    defaultName: user.name || user.username,
    eligibility: evaluateAllTracks(results),
    certificates: await getCertificatesFor(user.username),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.username) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนออกใบรับรอง" }, { status: 401 });
  }

  let body: { track?: unknown; recipientName?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "รูปแบบคำขอไม่ถูกต้อง" }, { status: 400 });
  }

  const track = String(body.track ?? "") as CertificateTrack;
  if (!(track in TRACKS)) {
    return NextResponse.json({ error: "ไม่พบใบรับรองประเภทนี้" }, { status: 400 });
  }

  // Eligibility is recomputed here from the stored results. The request only
  // says which certificate is wanted — never whether it was earned.
  const results = await getQuizResultsFor(user.username);
  const eligibility = evaluateTrack(results, track);

  const recipientName = typeof body.recipientName === "string" && body.recipientName.trim()
    ? body.recipientName
    : user.name || user.username;

  const outcome = await issueCertificate(user.username, track, recipientName, eligibility);
  if (!outcome.ok) {
    return NextResponse.json({ error: outcome.error, eligibility }, { status: 400 });
  }

  return NextResponse.json({ certificate: outcome.certificate, reissued: outcome.reissued });
}
