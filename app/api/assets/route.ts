import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { readAssets, writeAssets } from "@/lib/store";
import type { PhysicalAsset } from "@/lib/types";

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

function validate(body: any): { error?: string; fields?: Partial<PhysicalAsset> } {
  const fields: Partial<PhysicalAsset> = {};
  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) return { error: "กรอกชื่อสินทรัพย์" };
    fields.name = name;
  }
  if (body.category !== undefined) fields.category = String(body.category).trim();
  if (body.purchasePrice !== undefined) {
    const v = Number(body.purchasePrice);
    if (!Number.isFinite(v) || v <= 0) return { error: "ราคาซื้อต้องมากกว่า 0" };
    fields.purchasePrice = v;
  }
  if (body.purchaseDate !== undefined) {
    const d = String(body.purchaseDate).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return { error: "วันที่ซื้อไม่ถูกต้อง" };
    fields.purchaseDate = d;
  }
  if (body.depreciationRate !== undefined) {
    const v = Number(body.depreciationRate);
    if (!Number.isFinite(v) || v < 0 || v > 1) return { error: "อัตราค่าเสื่อมไม่ถูกต้อง" };
    fields.depreciationRate = v;
  }
  if (body.valueOverride !== undefined && body.valueOverride !== null && body.valueOverride !== "") {
    const v = Number(body.valueOverride);
    if (!Number.isFinite(v) || v < 0) return { error: "มูลค่าปัจจุบันไม่ถูกต้อง" };
    fields.valueOverride = v;
  }
  return { fields };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return bad("ข้อมูลไม่ถูกต้อง");
  const { error, fields } = validate(body);
  if (error) return bad(error);
  if (!fields?.name) return bad("กรอกชื่อสินทรัพย์");
  if (!fields.purchasePrice) return bad("กรอกราคาซื้อ");

  const asset: PhysicalAsset = {
    id: randomUUID(),
    name: fields.name,
    category: fields.category ?? "อื่นๆ",
    purchasePrice: fields.purchasePrice,
    purchaseDate: fields.purchaseDate ?? new Date().toISOString().slice(0, 10),
    depreciationRate: fields.depreciationRate ?? 0,
    ...(fields.valueOverride != null ? { valueOverride: fields.valueOverride } : {}),
  };
  const list = await readAssets();
  list.push(asset);
  await writeAssets(list);
  return NextResponse.json(asset, { status: 201 });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.id) return bad("ระบุ id");
  const { error, fields } = validate(body);
  if (error) return bad(error);

  const list = await readAssets();
  const idx = list.findIndex((a) => a.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "ไม่พบสินทรัพย์" }, { status: 404 });
  list[idx] = { ...list[idx], ...fields };
  await writeAssets(list);
  return NextResponse.json(list[idx]);
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return bad("ระบุ id");
  const list = await readAssets();
  const next = list.filter((a) => a.id !== id);
  if (next.length === list.length) {
    return NextResponse.json({ error: "ไม่พบสินทรัพย์" }, { status: 404 });
  }
  await writeAssets(next);
  return NextResponse.json({ ok: true });
}
