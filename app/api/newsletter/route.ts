import { NextResponse } from "next/server";
import { supabaseConfigured, supabaseInsert } from "@/lib/supabase";
import { readNewsletter, writeNewsletter } from "@/lib/store";
import { allCodes } from "@/lib/grade/archetypes";
import { CONSENT_VERSION } from "@/lib/legal";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const botField = typeof body?.botField === "string" ? body.botField : "";

  // Honeypot filled → bot. Pretend success so it learns nothing.
  if (botField) return NextResponse.json({ ok: true });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  // Consent is checked here, not only in the form. A disabled button is a
  // courtesy to the person filling it in; it is not evidence that anyone
  // agreed to anything, and this endpoint is public.
  if (body?.consent !== true) {
    return NextResponse.json({ error: "consent required" }, { status: 400 });
  }

  // Record which wording they agreed to. PDPA s.19 puts the burden of proving
  // consent on us, and that proof has to name a version.
  const consentVersion =
    typeof body?.consentVersion === "string" && body.consentVersion.length <= 32
      ? body.consentVersion
      : CONSENT_VERSION;

  // Attribution for /quiz. Whitelisted so a public endpoint cannot write
  // arbitrary strings into the table; an unrecognised tag is dropped rather
  // than rejected — a bad tag is no reason to lose the signup.
  //
  // The list comes from the quiz itself so it cannot drift out of step with
  // the archetypes, which is exactly what happened when the quiz went from
  // two-letter to four-letter codes.
  const source = body?.source === "quiz" ? "quiz" : undefined;
  const archetype = allCodes().includes(body?.archetype)
    ? (body.archetype as string)
    : undefined;

  const list = await readNewsletter();
  const existing = list.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    // Already subscribed. Backfill attribution only where it is missing, so a
    // repeat submit still counts toward the quiz tally without rewriting where
    // they first came from. Upsert one row, not the whole table.
    // The consent version is refreshed rather than backfilled: they have just
    // agreed again, to whatever the wording says today.
    const filled = {
      ...existing,
      source: existing.source ?? source,
      archetype: existing.archetype ?? archetype,
      consentVersion,
    };
    if (
      filled.source !== existing.source ||
      filled.archetype !== existing.archetype ||
      filled.consentVersion !== existing.consentVersion
    ) {
      await writeNewsletter([filled]);
    }
  } else {
    await writeNewsletter([
      { email, at: new Date().toISOString(), source, archetype, consentVersion },
    ]);
  }
  return NextResponse.json({ ok: true });
}
