import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { readTransactions, writeTransactions } from "@/lib/store";
import { getCurrentUser } from "@/lib/actions/auth";
import type { AssetType, Currency, Transaction } from "@/lib/types";

const ASSET_TYPES = ["stock", "etf", "crypto", "gold", "fund"];
const SIDES = ["buy", "sell"];
const CURRENCIES = ["USD", "THB"];

// Friendly suffix for the auto-generated name when the user leaves it blank,
// so an ETF never labels itself "· etf" or a stock "· stock".
const TYPE_LABEL: Record<string, string> = {
  stock: "หุ้น",
  etf: "ETF",
  fund: "กองทุน",
  crypto: "crypto",
  gold: "ทองคำ",
};

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const userId = user?.username || null;

  const body = await req.json().catch(() => null);
  if (!body) return bad("ข้อมูลไม่ถูกต้อง");

  const { assetType, symbol, name, side, quantity, price, currency, fee, tradedAt } = body;
  if (!ASSET_TYPES.includes(assetType)) return bad("ประเภทสินทรัพย์ไม่ถูกต้อง");
  if (!SIDES.includes(side)) return bad("ฝั่งซื้อ/ขายไม่ถูกต้อง");
  if (!CURRENCIES.includes(currency)) return bad("สกุลเงินไม่ถูกต้อง");
  const sym = String(symbol ?? "").trim().toUpperCase();
  if (!sym) return bad("กรอก symbol");
  const q = Number(quantity);
  if (!Number.isFinite(q) || q <= 0) return bad("จำนวนต้องมากกว่า 0");
  const p = Number(price);
  if (!Number.isFinite(p) || p < 0) return bad("ราคาไม่ถูกต้อง");
  const f = Number(fee ?? 0);
  if (!Number.isFinite(f) || f < 0) return bad("ค่าธรรมเนียมไม่ถูกต้อง");
  const date = String(tradedAt ?? "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return bad("วันที่ไม่ถูกต้อง");

  const tx: Transaction = {
    id: randomUUID(),
    assetType: assetType as AssetType,
    symbol: sym,
    name: String(name ?? "").trim() || `${sym} · ${TYPE_LABEL[assetType] ?? assetType}`,
    side,
    quantity: q,
    price: p,
    currency: currency as Currency,
    fee: f,
    tradedAt: date,
    ...(assetType === "gold" ? { unitLabel: "บาท" } : {}),
  };

  const list = await readTransactions(userId);
  list.push(tx);
  await writeTransactions(list, userId);
  return NextResponse.json(tx, { status: 201 });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  const userId = user?.username || null;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return bad("ระบุ id");
  const list = await readTransactions(userId);
  const next = list.filter((t) => t.id !== id);
  if (next.length === list.length) {
    return NextResponse.json({ error: "ไม่พบรายการ" }, { status: 404 });
  }
  await writeTransactions(next, userId);
  return NextResponse.json({ ok: true });
}
