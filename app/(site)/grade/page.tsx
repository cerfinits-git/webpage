import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cerfinits Grade — หลักสูตรเทรด FX/Gold 8 ระดับ",
  description:
    "หลักสูตรเทรด FX/Gold ภาษาไทย 8 ระดับ — วางรากฐานการบริหารความเสี่ยงก่อนเทคนิคทำกำไร ทุกบทเรียนอ้างอิงหลักฐานที่ตรวจสอบได้",
  alternates: { canonical: "/grade" },
};

import GradeCurriculum from "@/components/grade/GradeCurriculum";
import Link from "next/link";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/actions/auth";

export default async function Page() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("cerfinits_auth");
  const user = await getCurrentUser();
  const initialCompleted = user?.completedChapters || [];

  return (
    <div className="book">
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>หลักสูตร · FX / GOLD</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">หลักสูตร · 8 ระดับ</span>
        <h1>เส้นทางเทรดเดอร์ 8 ระดับ — จากพื้นฐานสู่มืออาชีพ</h1>
        <p className="lead">
          หลักสูตรเทรด FX และทองคำอย่างเป็นระบบ แบ่งเป็น 8 ระดับ
          จัดวางให้ผู้เรียนเชี่ยวชาญ<b>การบริหารความเสี่ยงก่อนเทคนิคการทำกำไร</b> —
          ระดับ 4 ซึ่งว่าด้วยการบริหารความเสี่ยง เปิดให้เรียนโดยไม่มีค่าใช้จ่าย
          ทุกบทเรียนอ้างอิงหลักฐานที่ตรวจสอบได้ และระบุชัดเจนว่าสิ่งใดพิสูจน์ได้ สิ่งใดยังไม่มีข้อมูลรองรับ
        </p>
        <div className="legend">
          <span><i className="free" /> ไม่มีค่าใช้จ่าย · ระดับ 1–4</span>
          <span><i className="prem" /> Premium · ระดับ 5–8</span>
          <span><i className="soon" /> กำลังจัดทำ</span>
        </div>
      </div>

      {/* ทางเข้าแบบทดสอบ — คนที่เปิดหน้าหลักสูตร 30 บทแล้วไม่รู้จะเริ่มตรงไหน
          คือกลุ่มที่แบบทดสอบตอบโจทย์ที่สุด */}
      <div className="wrap">
        <Link href="/quiz" className="grade-quiz-cta">
          <span className="gqc-kicker">ไม่รู้จะเริ่มบทไหน · 24 ข้อ</span>
          <span className="gqc-title">ทำแบบทดสอบว่าคุณเป็นเทรดเดอร์แบบไหน</span>
          <span className="gqc-sub">
            วัดสี่พฤติกรรมที่ทำให้พอร์ตเสียหายจริง แล้วบอกว่าควรอ่านสามบทไหนก่อน
            ไม่ต้องล็อกอิน
          </span>
          <span className="gqc-go">เริ่มทำแบบทดสอบ →</span>
        </Link>
      </div>

      <div className="wrap">
        <GradeCurriculum isLoggedIn={isLoggedIn} initialCompleted={initialCompleted} />
      </div>

      <div className="wrap bookfoot" style={{ paddingBottom: '30px', borderTop: 'none' }}>
        <span>CERFINITS GRADE</span>
        <span>วางแผน · ลงทุน · เทรด — อย่างมีหลักฐาน</span>
      </div>
    </div>
  );
}
