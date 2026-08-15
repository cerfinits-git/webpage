import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { readCashflows, writeCashflows } from "@/lib/store";
import type { Cashflow, CashflowKind } from "@/lib/types";

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return bad("ข้อมูลไม่ถูกต้อง");

  const { kind, category, amount, note, accountId, date } = body;
  if (kind !== "income" && kind !== "expense") return bad("ประเภทไม่ถูกต้อง");
  const cat = String(category ?? "").trim();
  if (!cat) return bad("เลือกหมวดหมู่");
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) return bad("จำนวนเงินต้องมากกว่า 0");
  const d = String(date ?? "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return bad("วันที่ไม่ถูกต้อง");

  const cf: Cashflow = {
    id: randomUUID(),
    kind: kind as CashflowKind,
    category: cat,
    amount: amt,
    date: d,
    ...(note ? { note: String(note).trim() } : {}),
    ...(accountId ? { accountId: String(accountId) } : {}),
  };

  const list = await readCashflows();
  list.push(cf);
  await writeCashflows(list);
  return NextResponse.json(cf, { status: 201 });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return bad("ระบุ id");
  const list = await readCashflows();
  const next = list.filter((c) => c.id !== id);
  if (next.length === list.length) {
    return NextResponse.json({ error: "ไม่พบรายการ" }, { status: 404 });
  }
  await writeCashflows(next);
  return NextResponse.json({ ok: true });
}
