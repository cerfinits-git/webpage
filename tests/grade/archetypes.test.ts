import assert from "node:assert/strict";
import test from "node:test";
import {
  ARCHETYPES,
  AXES,
  AXIS_ORDER,
  DEAD_ZONE,
  POLE_RISK,
  QUESTIONS,
  allCodes,
  getArchetype,
  maxRawFor,
  scoreQuiz,
  type AxisId,
  type PoleCode,
} from "../../lib/grade/archetypes.ts";
import { CURRICULUM } from "../../lib/grade/curriculum.ts";

const QUESTIONS_PER_AXIS = 6;

/** ตอบทุกข้อด้วยค่าเดียว หรือระบุค่าต่อแกน */
function answerWith(pick: (axis: AxisId, index: number) => number) {
  const answers: Record<string, number> = {};
  QUESTIONS.forEach((q, i) => {
    answers[q.id] = pick(q.axis, i);
  });
  return answers;
}

test("มีสี่แกน แต่ละแกนหกข้อ รวม 24 ข้อ", () => {
  assert.equal(AXIS_ORDER.length, 4);
  assert.equal(QUESTIONS.length, QUESTIONS_PER_AXIS * 4);
  for (const id of AXIS_ORDER) {
    assert.equal(
      QUESTIONS.filter((q) => q.axis === id).length,
      QUESTIONS_PER_AXIS,
      `แกน ${id} ต้องมี ${QUESTIONS_PER_AXIS} ข้อ`,
    );
  }
});

test("ทุกข้อมีสี่ตัวเลือก ครอบคลุมทั้งสองฝั่งและไม่มีค่าศูนย์", () => {
  for (const q of QUESTIONS) {
    assert.equal(q.choices.length, 4, `${q.id} ต้องมี 4 ตัวเลือก`);
    const values = q.choices.map((c) => c.value);
    assert.deepEqual([...values].sort((a, b) => a - b), [-2, -1, 1, 2], `${q.id} ค่าตัวเลือก`);
  }
});

test("id ของคำถามไม่ซ้ำกัน", () => {
  const ids = QUESTIONS.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("ตัวอักษรของทั้งแปดขั้วไม่ชนกัน — ไม่งั้นถอดรหัสกลับไม่ได้", () => {
  const codes = AXIS_ORDER.flatMap((id) => [AXES[id].negative.code, AXES[id].positive.code]);
  assert.equal(new Set(codes).size, 8, `ตัวอักษรซ้ำ: ${codes.join("")}`);
});

test("ตอบสุดทางฝั่งเดียวได้ ±100 ทุกแกน และไม่ถูกทำเครื่องหมายกลางแกน", () => {
  const allNegative = scoreQuiz(answerWith(() => -2));
  assert.equal(allNegative.code, "CSKO");
  assert.equal(allNegative.borderline, false);
  for (const id of AXIS_ORDER) assert.equal(allNegative.axes[id].score, -100);

  const allPositive = scoreQuiz(answerWith(() => 2));
  assert.equal(allPositive.code, "HIRG");
  assert.equal(allPositive.borderline, false);
  for (const id of AXIS_ORDER) assert.equal(allPositive.axes[id].score, 100);
});

test("แต่ละแกนถูกให้คะแนนแยกกัน — สุดทางแกนเดียวไม่ลากแกนอื่นไปด้วย", () => {
  // แกน loss สุดทางฝั่ง ถือ, แกนอื่นสลับ +1/−1 ให้หักล้างเป็นศูนย์
  const result = scoreQuiz(answerWith((axis, i) => (axis === "loss" ? 2 : i % 2 === 0 ? 1 : -1)));
  assert.equal(result.axes.loss.score, 100);
  for (const id of AXIS_ORDER) {
    if (id === "loss") continue;
    assert.equal(result.axes[id].score, 0, `แกน ${id} ต้องหักล้างเป็น 0`);
  }
});

test("คะแนนใกล้กลางถูกทำเครื่องหมาย borderline รายแกน — จุดที่ MBTI ตัดเงียบ ๆ", () => {
  const result = scoreQuiz(answerWith((_, i) => (i % 2 === 0 ? 1 : -1)));
  assert.equal(result.borderline, true);
  assert.deepEqual(result.borderlineAxes, AXIS_ORDER, "ทุกแกนควรอยู่กลาง");
  for (const id of AXIS_ORDER) assert.equal(result.axes[id].score, 0);
});

test("พ้นเขตกลางแล้วต้องไม่ถูกทำเครื่องหมาย borderline", () => {
  // แกน loss: +2,+2,−1,−1,+1,−1 → raw 2 จาก 12 = 17 คะแนน (เกิน DEAD_ZONE 15)
  const lossQs = QUESTIONS.filter((q) => q.axis === "loss");
  const pattern = [2, 2, -1, -1, 1, -1];
  const answers: Record<string, number> = {};
  QUESTIONS.forEach((q, i) => {
    answers[q.id] = i % 2 === 0 ? 1 : -1;
  });
  lossQs.forEach((q, i) => {
    answers[q.id] = pattern[i];
  });
  const result = scoreQuiz(answers);
  assert.equal(result.axes.loss.score, 17);
  assert.ok(Math.abs(result.axes.loss.score) > DEAD_ZONE);
  assert.equal(result.axes.loss.borderline, false);
  assert.ok(!result.borderlineAxes.includes("loss"));
});

test("คำตอบที่ยังไม่ตอบนับเป็นศูนย์ ไม่ทำให้ล้ม", () => {
  const result = scoreQuiz({});
  assert.ok(result.archetype, "ต้องยังคืน archetype ได้");
  assert.equal(result.borderline, true);
  for (const id of AXIS_ORDER) assert.equal(result.axes[id].score, 0);
});

test("มี archetype ครบทั้ง 16 รหัส ไม่ขาดไม่เกิน", () => {
  const expected = allCodes();
  assert.equal(expected.length, 16);
  assert.deepEqual(Object.keys(ARCHETYPES).sort(), [...expected].sort());
  for (const code of expected) {
    assert.equal(ARCHETYPES[code].code, code, `${code} รหัสในข้อมูลไม่ตรงกับคีย์`);
  }
});

test("ทุกประเภทมีจุดอ่อน ข้อดี และขั้วที่ขับความเสี่ยงซึ่งอยู่ในรหัสจริง", () => {
  for (const code of allCodes()) {
    const a = ARCHETYPES[code];
    assert.ok(a.weakness.length > 40, `${code} ต้องมีจุดอ่อนที่เขียนจริง`);
    assert.ok(a.strength.length > 20, `${code} ต้องมีข้อดี`);
    assert.ok(a.behaviour.length > 40, `${code} ต้องมีคำอธิบายพฤติกรรม`);
    assert.ok(a.tagline.length > 10, `${code} ต้องมี tagline`);
    assert.ok(
      code.includes(a.dominant),
      `${code} ระบุขั้วเสี่ยงหลักเป็น ${a.dominant} ซึ่งไม่ได้อยู่ในรหัสตัวเอง`,
    );
  }
});

test("ชื่อประเภทไม่ซ้ำกัน ทั้งไทยและอังกฤษ", () => {
  const names = Object.values(ARCHETYPES).map((a) => a.name);
  const english = Object.values(ARCHETYPES).map((a) => a.english);
  assert.equal(new Set(names).size, 16, "ชื่อไทยซ้ำ");
  assert.equal(new Set(english).size, 16, "ชื่ออังกฤษซ้ำ");
});

test("ทั้งแปดขั้วมีหลักฐานกำกับ — ไม่มีขั้วไหนไร้ต้นทุน", () => {
  const poles = AXIS_ORDER.flatMap((id) => [AXES[id].negative.code, AXES[id].positive.code]);
  for (const pole of poles as PoleCode[]) {
    assert.ok(POLE_RISK[pole], `ขาดหลักฐานของขั้ว ${pole}`);
    assert.ok(POLE_RISK[pole].evidence.length > 60, `หลักฐานของขั้ว ${pole} สั้นเกินไป`);
  }
});

test("รหัสที่ scoreQuiz คืนตรงกับ archetype ที่ผูกไว้ ทุกชุดค่าสุดทาง", () => {
  for (const code of allCodes()) {
    const answers: Record<string, number> = {};
    for (const q of QUESTIONS) {
      const axis = AXES[q.axis];
      const wanted = code[AXIS_ORDER.indexOf(q.axis)];
      answers[q.id] = wanted === axis.negative.code ? -2 : 2;
    }
    const result = scoreQuiz(answers);
    assert.equal(result.code, code);
    assert.equal(result.archetype.code, code);
    assert.equal(result.dominantRisk, POLE_RISK[result.archetype.dominant]);
  }
});

test("บทเรียนที่แนะนำต้องเป็นบทฟรีที่มีอยู่จริงในหลักสูตร", () => {
  const freeHrefs = new Set(
    CURRICULUM.filter((g) => g.tier === "free").flatMap((g) =>
      g.secs.map((s) => s.href).filter((h): h is string => Boolean(h)),
    ),
  );

  for (const archetype of Object.values(ARCHETYPES)) {
    assert.equal(archetype.chapters.length, 3, `${archetype.code} ต้องแนะนำ 3 บท`);
    const hrefs = archetype.chapters.map((c) => c.href);
    assert.equal(new Set(hrefs).size, 3, `${archetype.code} แนะนำบทซ้ำ`);
    for (const chapter of archetype.chapters) {
      assert.ok(
        freeHrefs.has(chapter.href),
        `${archetype.code} ลิงก์ ${chapter.href} ซึ่งไม่ใช่บทฟรี — หน้าผลลัพธ์สาธารณะห้ามส่งคนไปชน paywall`,
      );
      assert.ok(chapter.why.length > 15, `${chapter.href} ต้องบอกเหตุผลที่แนะนำ`);
    }
  }
});

test("หมายเลขและชื่อบทตรงกับหลักสูตร ไม่ใช่ที่พิมพ์ไว้เอง", () => {
  const byHref = new Map(CURRICULUM.flatMap((g) => g.secs).map((s) => [s.href, s] as const));
  for (const archetype of Object.values(ARCHETYPES)) {
    for (const chapter of archetype.chapters) {
      assert.equal(byHref.get(chapter.href)?.n, chapter.n, `${chapter.href} หมายเลขบท`);
      assert.equal(byHref.get(chapter.href)?.t, chapter.title, `${chapter.href} ชื่อบท`);
    }
  }
});

test("maxRawFor ตรงกับจำนวนคำถามคูณสอง", () => {
  for (const id of AXIS_ORDER) assert.equal(maxRawFor(id), QUESTIONS_PER_AXIS * 2);
});

test("getArchetype คืน null เมื่อรหัสไม่รู้จัก", () => {
  assert.equal(getArchetype("XXXX"), null);
  assert.equal(getArchetype("CS"), null);
  assert.equal(getArchetype("CSKO")?.code, "CSKO");
});
