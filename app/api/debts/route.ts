import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { readDebts, writeDebts } from "@/lib/store";
import type { Debt } from "@/lib/types";

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

function validate(body: any): { error?: string; fields?: Partial<Debt> } {
  const fields: Partial<Debt> = {};
  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) return { error: "กรอกชื่อหนี้" };
    fields.name = name;
  }
  if (body.type !== undefined) fields.type = String(body.type).trim();
  for (const key of ["principal", "remaining", "installment"] as const) {
    if (body[key] !== undefined) {
      const v = Number(body[key]);
      if (!Number.isFinite(v) || v < 0) return { error: `ค่า ${key} ไม่ถูกต้อง` };
      fields[key] = v;
    }
  }
  if (body.interestRate !== undefined) {
    const v = Number(body.interestRate);
    if (!Number.isFinite(v) || v < 0 || v > 1) return { error: "อัตราดอกเบี้ยไม่ถูกต้อง" };
    fields.interestRate = v;
  }
  for (const key of ["totalInstallments", "paidInstallments"] as const) {
    if (body[key] !== undefined) {
      const v = Number(body[key]);
      if (!Number.isInteger(v) || v < 0) return { error: `จำนวนงวดไม่ถูกต้อง` };
      fields[key] = v;
    }
  }
  if (body.dueDay !== undefined) {
    const v = Number(body.dueDay);
    if (!Number.isInteger(v) || v < 1 || v > 31) return { error: "วันครบกำหนดต้องอยู่ระหว่าง 1-31" };
    fields.dueDay = v;
  }
  if (body.note !== undefined) fields.note = String(body.note).trim();
  return { fields };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return bad("ข้อมูลไม่ถูกต้อง");
  const { error, fields } = validate(body);
  if (error) return bad(error);
  if (!fields?.name) return bad("กรอกชื่อหนี้");
  if (!fields.principal || fields.principal <= 0) return bad("ยอดหนี้ต้องมากกว่า 0");

  const debt: Debt = {
    id: randomUUID(),
    name: fields.name,
    type: fields.type ?? "อื่นๆ",
    principal: fields.principal,
    remaining: fields.remaining ?? fields.principal,
    interestRate: fields.interestRate ?? 0,
    installment: fields.installment ?? 0,
    totalInstallments: fields.totalInstallments ?? 1,
    paidInstallments: fields.paidInstallments ?? 0,
    dueDay: fields.dueDay ?? 1,
    ...(fields.note ? { note: fields.note } : {}),
  };
  const list = await readDebts();
  list.push(debt);
  await writeDebts(list);
  return NextResponse.json(debt, { status: 201 });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.id) return bad("ระบุ id");
  const { error, fields } = validate(body);
  if (error) return bad(error);

  const list = await readDebts();
  const idx = list.findIndex((d) => d.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "ไม่พบหนี้" }, { status: 404 });
  list[idx] = { ...list[idx], ...fields };
  await writeDebts(list);
  return NextResponse.json(list[idx]);
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return bad("ระบุ id");
  const list = await readDebts();
  const next = list.filter((d) => d.id !== id);
  if (next.length === list.length) {
    return NextResponse.json({ error: "ไม่พบหนี้" }, { status: 404 });
  }
  await writeDebts(next);
  return NextResponse.json({ ok: true });
}
