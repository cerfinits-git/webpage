import { NextResponse } from "next/server";
import { writeBudgets } from "@/lib/store";
import { EXPENSE_CATEGORIES, type Budget } from "@/lib/types";

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "ต้องส่งเป็นลิสต์" }, { status: 400 });
  }

  const budgets: Budget[] = [];
  for (const item of body) {
    const category = String(item?.category ?? "").trim();
    const limit = Number(item?.monthlyLimit);
    if (!EXPENSE_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `หมวด "${category}" ไม่ถูกต้อง` }, { status: 400 });
    }
    if (!Number.isFinite(limit) || limit < 0) {
      return NextResponse.json({ error: `งบของหมวด "${category}" ไม่ถูกต้อง` }, { status: 400 });
    }
    if (limit > 0) budgets.push({ category, monthlyLimit: limit });
  }

  await writeBudgets(budgets);
  return NextResponse.json(budgets);
}
