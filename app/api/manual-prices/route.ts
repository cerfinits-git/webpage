import { NextResponse } from "next/server";
import { readManualPrices, writeManualPrices } from "@/lib/store";
import type { ManualPrice } from "@/lib/types";

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });

  const symbol = String(body.symbol ?? "").trim().toUpperCase();
  if (!symbol) return NextResponse.json({ error: "ระบุ symbol" }, { status: 400 });
  const price = Number(body.price);
  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "ราคาต้องมากกว่า 0" }, { status: 400 });
  }
  const currency = body.currency === "USD" ? "USD" : "THB";

  const entry: ManualPrice = {
    symbol,
    price,
    currency,
    asOf: new Date().toISOString().slice(0, 10),
  };

  const list = await readManualPrices();
  const idx = list.findIndex((p) => p.symbol === symbol);
  if (idx === -1) list.push(entry);
  else list[idx] = entry;
  await writeManualPrices(list);
  return NextResponse.json(entry);
}
