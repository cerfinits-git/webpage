import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { readCashflows, readDebts, writeCashflows, writeDebts } from "@/lib/store";
import type { Cashflow } from "@/lib/types";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "ระบุ id" }, { status: 400 });

  const debts = await readDebts();
  const idx = debts.findIndex((d) => d.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "ไม่พบหนี้" }, { status: 404 });

  const debt = debts[idx];
  if (debt.remaining <= 0) {
    return NextResponse.json({ error: "หนี้นี้ชำระครบแล้ว" }, { status: 400 });
  }
  if (debt.installment <= 0) {
    return NextResponse.json({ error: "หนี้นี้ไม่ได้ตั้งยอดผ่อนต่องวด" }, { status: 400 });
  }

  const paid = Math.min(debt.installment, debt.remaining);
  debts[idx] = {
    ...debt,
    remaining: debt.remaining - paid,
    paidInstallments: debt.paidInstallments + 1,
  };

  const cashflow: Cashflow = {
    id: randomUUID(),
    kind: "expense",
    category: "ชำระหนี้",
    amount: paid,
    note: `${debt.name} งวดที่ ${debt.paidInstallments + 1}/${debt.totalInstallments}`,
    date: new Date().toISOString().slice(0, 10),
    ...(body.accountId ? { accountId: String(body.accountId) } : {}),
  };

  const cashflows = await readCashflows();
  cashflows.push(cashflow);
  await writeDebts(debts);
  await writeCashflows(cashflows);
  return NextResponse.json({ debt: debts[idx], cashflow }, { status: 201 });
}
