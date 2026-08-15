import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { readGoals, writeGoals } from "@/lib/store";
import type { Goal } from "@/lib/types";

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return bad("ข้อมูลไม่ถูกต้อง");

  const { name, targetAmount, targetYear, monthlySaving, expectedReturn, linkedToPortfolio, currentAmount } = body;
  const n = String(name ?? "").trim();
  if (!n) return bad("กรอกชื่อเป้าหมาย");
  const target = Number(targetAmount);
  if (!Number.isFinite(target) || target <= 0) return bad("ยอดเป้าหมายต้องมากกว่า 0");
  const year = Number(targetYear);
  if (!Number.isInteger(year) || year < 2000 || year > 2200) return bad("ปีเป้าหมายไม่ถูกต้อง");
  const monthly = Number(monthlySaving ?? 0);
  if (!Number.isFinite(monthly) || monthly < 0) return bad("ยอดออมต่อเดือนไม่ถูกต้อง");
  const ret = Number(expectedReturn ?? 0);
  if (!Number.isFinite(ret) || ret < 0 || ret > 1) return bad("ผลตอบแทนคาดหวังไม่ถูกต้อง");

  const goal: Goal = {
    id: randomUUID(),
    name: n,
    targetAmount: target,
    targetYear: year,
    monthlySaving: monthly,
    expectedReturn: ret,
    linkedToPortfolio: Boolean(linkedToPortfolio),
    ...(linkedToPortfolio ? {} : { currentAmount: Math.max(Number(currentAmount ?? 0), 0) }),
  };

  const list = await readGoals();
  list.push(goal);
  await writeGoals(list);
  return NextResponse.json(goal, { status: 201 });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return bad("ระบุ id");
  const list = await readGoals();
  const next = list.filter((g) => g.id !== id);
  if (next.length === list.length) {
    return NextResponse.json({ error: "ไม่พบรายการ" }, { status: 404 });
  }
  await writeGoals(next);
  return NextResponse.json({ ok: true });
}
