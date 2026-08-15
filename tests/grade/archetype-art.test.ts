import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { allCodes, frameFor } from "../../lib/grade/archetypes.ts";

const ART_DIR = path.join(process.cwd(), "public", "quiz", "archetypes");
const FRAME_DIR = path.join(process.cwd(), "public", "quiz", "frames");

/** เกินเท่านี้แปลว่ามีคนวางไฟล์ต้นฉบับทับ ไม่ได้ผ่านสคริปต์ย่อ */
const MAX_KB = 150;

test("ทุกประเภทมีภาพตัวละคร — หน้าผลลัพธ์จะพังถ้าขาดใบเดียว", () => {
  for (const code of allCodes()) {
    const file = path.join(ART_DIR, `${code}.webp`);
    assert.ok(existsSync(file), `ขาดภาพของ ${code} — รัน scripts/build-archetype-art.mjs`);
  }
});

test("ภาพถูกย่อแล้ว ไม่ใช่ไฟล์ต้นฉบับ 2-3MB", () => {
  for (const code of allCodes()) {
    const kb = statSync(path.join(ART_DIR, `${code}.webp`)).size / 1024;
    assert.ok(
      kb < MAX_KB,
      `${code}.webp หนัก ${kb.toFixed(0)} KB เกิน ${MAX_KB} KB — คนเข้าจาก IG ใช้เน็ตมือถือ`,
    );
  }
});

test("ทุกรหัสได้กรอบที่มีไฟล์อยู่จริง", () => {
  for (const code of allCodes()) {
    const file = path.join(FRAME_DIR, `${frameFor(code)}.webp`);
    assert.ok(existsSync(file), `${code} ใช้กรอบ ${frameFor(code)} ซึ่งไม่มีไฟล์`);
  }
});

test("สีกรอบมาจากแกน 1 คูณแกน 3 และใช้ครบทั้งสี่สี", () => {
  const used = new Map<string, string[]>();
  for (const code of allCodes()) {
    const f = frameFor(code);
    used.set(f, [...(used.get(f) ?? []), code]);
  }
  assert.equal(used.size, 4, "ต้องใช้กรอบครบสี่สี ไม่ขาดไม่เกิน");
  for (const [colour, codes] of used) {
    assert.equal(codes.length, 4, `กรอบ ${colour} ควรมี 4 ประเภท ได้ ${codes.length}`);
    // ทุกรหัสในกลุ่มต้องมีตัวอักษรที่ 1 และ 3 เหมือนกัน ไม่งั้นสีไม่ได้สื่ออะไร
    const key = (c: string) => `${c[0]}${c[2]}`;
    assert.equal(new Set(codes.map(key)).size, 1, `กรอบ ${colour} รวมรหัสที่แกนไม่ตรงกัน`);
  }
});

test("ไม่มีภาพส่วนเกินค้างในโฟลเดอร์", async () => {
  const { readdirSync } = await import("node:fs");
  const files = readdirSync(ART_DIR).filter((f) => !f.startsWith("."));
  const expected = allCodes().map((c) => `${c}.webp`);
  assert.deepEqual(
    files.sort(),
    expected.sort(),
    "โฟลเดอร์มีไฟล์ที่ไม่ตรงกับรหัส 16 แบบ",
  );
});
