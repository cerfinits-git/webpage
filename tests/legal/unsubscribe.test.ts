import assert from "node:assert/strict";
import test from "node:test";
import {
  CONSENT_PURPOSES,
  CONSENT_VERSION,
  CONTROLLER,
  OFFERINGS,
  PROCESSORS,
  controllerName,
} from "../../lib/legal.ts";

test("ผู้ควบคุมข้อมูลมีชื่อและช่องทางติดต่อ — ม.23 บังคับ", () => {
  assert.ok(controllerName().length > 0, "นโยบายต้องระบุชื่อผู้ควบคุมข้อมูลได้");
  assert.match(CONTROLLER.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});

test("ผู้ประมวลผลทุกรายระบุที่ตั้ง — ม.28 การส่งข้อมูลข้ามแดน", () => {
  assert.ok(PROCESSORS.length > 0);
  for (const p of PROCESSORS) {
    assert.ok(p.name.length > 0, "ผู้ประมวลผลต้องมีชื่อ");
    assert.ok(p.role.length > 5, `${p.name} ต้องบอกว่าทำหน้าที่อะไร`);
    assert.ok(p.location.length > 5, `${p.name} ต้องบอกที่ตั้งของข้อมูล`);
  }
});

test("ทุกรายการที่ขายต้องบอกวิธีชำระเงิน — เงื่อนไขห้ามบรรยาย checkout ที่ไม่มีจริง", () => {
  assert.ok(OFFERINGS.length > 0);
  for (const o of OFFERINGS) {
    assert.ok(o.name.length > 0);
    assert.ok(o.detail.length > 5, `${o.name} ต้องบอกว่าคืออะไร`);
    assert.ok(o.payment.length > 5, `${o.name} ต้องบอกวิธีชำระเงิน`);
  }
});

test("ไม่มีรายการใดอ้างว่าชำระเงินบนเว็บไซต์เอง", () => {
  // เว็บไม่มี payment processor — ถ้าวันหนึ่งมี ต้องแก้ทั้งเงื่อนไขและนโยบายด้วย
  for (const o of OFFERINGS) {
    assert.doesNotMatch(
      o.payment,
      /บัตรเครดิต|บัตรเดบิต|ตัดบัตร/,
      `${o.name} อ้างการรับชำระด้วยบัตร ซึ่งเว็บไซต์ยังทำไม่ได้`,
    );
  }
});

test("ความยินยอมมีเวอร์ชันที่อ้างอิงได้ — ม.19 ภาระพิสูจน์อยู่ที่ผู้ควบคุม", () => {
  assert.match(CONSENT_VERSION, /^\d{4}-\d{2}-\d{2}$/, "เวอร์ชันควรเป็นวันที่ที่เรียงลำดับได้");
  assert.ok(CONSENT_VERSION.length <= 32, "ยาวเกินขีดที่ route ยอมรับ");
});

test("ต้องบอกวัตถุประสงค์ข้างช่องติ๊ก ไม่ใช่ซ่อนหลังลิงก์", () => {
  assert.ok(CONSENT_PURPOSES.length > 0, "ความยินยอมต้องระบุวัตถุประสงค์");
  for (const p of CONSENT_PURPOSES) {
    assert.ok(p.length > 10, `วัตถุประสงค์สั้นเกินจนไม่สื่อ: ${p}`);
  }
});

test("Supabase ถูกระบุว่าอยู่เกาหลีใต้ ไม่ใช่ไทย", () => {
  // ap-northeast-2 คือโซล — ถ้าย้าย region ต้องแก้นโยบายด้วย ไม่ใช่แก้เฉพาะโค้ด
  const supabase = PROCESSORS.find((p) => p.name === "Supabase");
  assert.ok(supabase, "ต้องเปิดเผย Supabase ในฐานะผู้ประมวลผล");
  assert.match(supabase.location, /เกาหลี/);
});
