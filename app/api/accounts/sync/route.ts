import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { writeAccounts } from "@/lib/store";
import type { Account } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.accounts)) {
      return NextResponse.json({ error: "Invalid accounts array" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const userEmail = cookieStore.get("cerfinits_auth")?.value || null;

    const accounts: Account[] = body.accounts.map((acc: any) => ({
      id: String(acc.id),
      name: String(acc.name || "Trading Account"),
      bank: String(acc.bank || acc.broker || "cTrader"),
      openingBalance: Number(acc.openingBalance) || 0,
      interestRate: Number(acc.interestRate) || 0,
      note: acc.note ? String(acc.note) : "Trading Journal Account",
    }));

    await writeAccounts(accounts, userEmail);
    return NextResponse.json({ ok: true, synced: accounts.length, user_id: userEmail });
  } catch (err) {
    console.error("Account sync to Supabase failed:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
