import { NextResponse } from "next/server";
import { deleteNewsletterSignup } from "@/lib/store";

/**
 * Unsubscribe = delete the row, not flag it.
 *
 * The email address is the only thing stored for a newsletter subscriber, so
 * keeping a suppression record would mean retaining the exact personal data
 * the person asked us to stop holding. Deleting satisfies both the withdrawal
 * of consent (PDPA s.19) and the right to erasure (s.33) in one action, and
 * there is no mail sender that would need a suppression list.
 *
 * No token: the site has no email infrastructure, so there is no message in
 * which to put a signed link. Anyone who knows an address can therefore remove
 * it. That is a deliberate trade — the worst case is someone stops receiving
 * marketing they did not ask to keep, which is far milder than making
 * withdrawal harder than signing up, something s.19 does not allow.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const botField = typeof body?.botField === "string" ? body.botField : "";

  if (botField) return NextResponse.json({ ok: true });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  await deleteNewsletterSignup(email);

  // Always the same answer whether or not the address was on the list, so the
  // endpoint cannot be used to check who is subscribed.
  return NextResponse.json({ ok: true });
}
