import type { Metadata } from "next";
import ArchetypeQuiz from "@/components/site/ArchetypeQuiz";
import { AXES, AXIS_ORDER, QUESTIONS } from "@/lib/grade/archetypes";

export const metadata: Metadata = {
  title: "คุณเป็นเทรดเดอร์แบบไหน — แบบทดสอบ 24 ข้อ | Cerfinits",
  description:
    "แบบทดสอบ 24 ข้อ วัดสี่พฤติกรรมที่ทำให้พอร์ตเสียหายจริง แล้วจัดเป็นรหัส 4 ตัวอักษรจาก 16 แบบ พร้อมบทเรียนที่ตรงกับจุดอ่อน ไม่ต้องสมัครสมาชิก",
  alternates: { canonical: "/quiz" },
  // ลิงก์นี้ถูกแชร์ต่อในแชทและโซเชียลเป็นหลัก การ์ดพรีวิวจึงต้องอ่านรู้เรื่องเอง
  openGraph: {
    title: "คุณเป็นเทรดเดอร์แบบไหน — แบบทดสอบ 24 ข้อ",
    description:
      "สี่พฤติกรรมที่ทำให้พอร์ตเสียหายจริง → รหัส 4 ตัวอักษรจาก 16 แบบ · ไม่ต้องสมัครสมาชิก",
    url: "/quiz",
    type: "website",
    images: ["/og-cover.png"],
  },
};

export default function Page() {
  return (
    <div className="wrap quiz-wrap">
      <header className="quiz-opener">
        <span className="kicker">
          แบบทดสอบ · {QUESTIONS.length} ข้อ · {AXIS_ORDER.length} แกน · 16 ประเภท
        </span>
        <h1>คุณเป็นเทรดเดอร์แบบไหน</h1>
        <p className="lead">
          แบบทดสอบนี้ไม่วัดบุคลิกภาพ แต่วัดสี่พฤติกรรมที่มีงานวิจัยรองรับว่าเป็นต้นทุนจริงของ
          นักเทรดรายย่อย แล้วสรุปเป็นรหัส 4 ตัวอักษร พร้อมบอกว่าจุดอ่อนของรูปแบบคุณอยู่ที่ไหน
          และควรอ่านบทไหนก่อน
        </p>
        <ul className="quiz-axis-list">
          {AXIS_ORDER.map((id) => (
            <li key={id}>
              <span className="quiz-axis-codes">
                {AXES[id].negative.code} / {AXES[id].positive.code}
              </span>
              <span className="quiz-axis-name">{AXES[id].title}</span>
              <span className="quiz-axis-poles">
                {AXES[id].negative.label} ↔ {AXES[id].positive.label}
              </span>
            </li>
          ))}
        </ul>
        <p className="quiz-honest">
          ตอบตามที่ทำจริง ไม่ใช่ตามที่ควรทำ — ผลลัพธ์จะมีประโยชน์เฉพาะเมื่อคำตอบตรงกับพฤติกรรมจริง
          ไม่ต้องล็อกอินและไม่ต้องกรอกอีเมลเพื่อดูผล
        </p>
      </header>

      <ArchetypeQuiz />

      <section className="quiz-basis">
        <h2>แบบทดสอบนี้ยืนอยู่บนอะไร</h2>
        <p>
          รูปแบบการนำเสนอเป็นแบบ MBTI (รหัส 4 ตัวอักษร 16 แบบ) แต่ <b>ไม่ได้ใช้แกนของ MBTI</b> —
          เพราะ MBTI มีปัญหาความเที่ยงที่ทราบกันดี ผู้ทำแบบทดสอบจำนวนมากได้ประเภทต่างจากเดิม
          เมื่อทำซ้ำในเวลาไม่กี่สัปดาห์ และคะแนนของประชากรกระจายต่อเนื่องไม่ได้แยกเป็นสองกลุ่ม
          ตามที่การแบ่งประเภทสันนิษฐาน
        </p>
        <p>
          สี่แกนที่ใช้จริงจึงยึดกับพฤติกรรมที่วัดได้ในงานวิจัยการเงิน และหน้าผลลัพธ์
          <b>แสดงคะแนนเป็นสเกลต่อเนื่องทั้งสี่แกน</b> พร้อมเตือนเมื่อคุณอยู่ใกล้กลางแกนใด
          แทนที่จะตัดเป็นสองฝั่งโดยไม่บอก
        </p>
        <p>
          หลักฐานผูกกับ<b>ขั้วของแกน</b> ไม่ใช่กับป้าย 16 แบบ — งานวิจัยรองรับพฤติกรรมที่วัด
          ไม่ได้รองรับป้ายที่เราตั้งชื่อขึ้นมา
        </p>
        <dl className="quiz-axes-basis">
          {AXIS_ORDER.map((id) => (
            <div key={id}>
              <dt>
                {AXES[id].title} ({AXES[id].negative.code} / {AXES[id].positive.code})
              </dt>
              <dd>{AXES[id].basis}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
