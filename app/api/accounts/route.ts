import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { deleteAccountById, readAccounts, writeAccounts } from "@/lib/store";
import { getSessionUserId } from "@/lib/auth/session";
import type { Account } from "@/lib/types";

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

function validate(body: any): { error?: string; fields?: Partial<Account> } {
  const fields: Partial<Account> = {};
  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) return { error: "กรอกชื่อบัญชี" };
    fields.name = name;
  }
  if (body.bank !== undefined) fields.bank = String(body.bank).trim();
  if (body.openingBalance !== undefined) {
    const v = Number(body.openingBalance);
    if (!Number.isFinite(v) || v < 0) return { error: "ยอดเริ่มต้นไม่ถูกต้อง" };
    fields.openingBalance = v;
  }
  if (body.interestRate !== undefined) {
    const v = Number(body.interestRate);
    if (!Number.isFinite(v) || v < 0 || v > 1) return { error: "อัตราดอกเบี้ยไม่ถูกต้อง" };
    fields.interestRate = v;
  }
  if (body.note !== undefined) fields.note = String(body.note).trim();
  return { fields };
}

export async function GET() {
  const userId = await getSessionUserId();
  const list = await readAccounts(userId);
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  const body = await req.json().catch(() => null);
  if (!body) return bad("ข้อมูลไม่ถูกต้อง");
  const { error, fields } = validate(body);
  if (error) return bad(error);
  if (!fields?.name) return bad("กรอกชื่อบัญชี");

  const account: Account = {
    id: body.id ? String(body.id) : randomUUID(),
    name: fields.name,
    bank: fields.bank ?? "cTrader",
    openingBalance: fields.openingBalance ?? 0,
    interestRate: fields.interestRate ?? 0,
    ...(fields.note ? { note: fields.note } : {}),
  };
  const list = await readAccounts();
  const existingIdx = list.findIndex((a) => a.id === account.id);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...account };
  } else {
    list.push(account);
  }
  await writeAccounts(list, userId);
  return NextResponse.json(account, { status: 201 });
}

export async function PATCH(req: Request) {
  const userId = await getSessionUserId();
  const body = await req.json().catch(() => null);
  if (!body?.id) return bad("ระบุ id");
  const { error, fields } = validate(body);
  if (error) return bad(error);

  const list = await readAccounts();
  const idx = list.findIndex((a) => a.id === body.id);
  if (idx === -1) {
    // If not found, insert
    const newAcc: Account = {
      id: String(body.id),
      name: fields?.name || "Account",
      bank: fields?.bank || "cTrader",
      openingBalance: fields?.openingBalance ?? 0,
      interestRate: fields?.interestRate ?? 0,
      ...(fields?.note ? { note: fields.note } : {}),
    };
    list.push(newAcc);
    await writeAccounts(list, userId);
    return NextResponse.json(newAcc);
  }
  list[idx] = { ...list[idx], ...fields };
  await writeAccounts(list, userId);
  return NextResponse.json(list[idx]);
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return bad("ระบุ id");
  await deleteAccountById(id);
  return NextResponse.json({ ok: true });
}
