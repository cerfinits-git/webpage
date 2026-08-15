import type { Metadata } from "next";
import Link from "next/link";
import UnsubscribeForm from "@/components/site/UnsubscribeForm";
import { CONTROLLER } from "@/lib/legal";

export const metadata: Metadata = {
  title: "ยกเลิกรับอีเมล | Cerfinits",
  description: "ลบอีเมลของคุณออกจากระบบ Cerfinits ถาวร ทำได้ทันทีโดยไม่ต้องรอการตอบกลับ",
  alternates: { canonical: "/unsubscribe" },
  // Nothing to gain from indexing a form, and it keeps the page out of results
  // for people searching the brand.
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <div className="wrap legal-wrap legal-wrap-narrow">
      <header className="legal-opener">
        <span className="kicker">ยกเลิกรับอีเมล</span>
        <h1>ลบอีเมลของคุณออกจากระบบ</h1>
        <p className="lead">
          กรอกอีเมลแล้วกดปุ่ม อีเมลจะถูกลบออกจากฐานข้อมูลทันที ไม่ใช่แค่ทำเครื่องหมายว่าไม่ส่ง
          ไม่ต้องเข้าสู่ระบบ ไม่ต้องรอการตอบกลับ และไม่มีคำถามว่าทำไม
        </p>
      </header>

      <UnsubscribeForm />

      <section className="legal-block">
        <h2>สิ่งที่ถูกลบ</h2>
        <p>
          อีเมลของคุณ วันที่สมัคร และรหัสประเภทเทรดเดอร์ที่ได้จากแบบทดสอบ (ถ้ามี) —
          ทั้งแถวจะถูกลบออก ไม่มีสำเนาเก็บไว้
        </p>
        <p className="legal-note">
          ถ้าคุณเคยเข้าสู่ระบบเพื่อเรียนหลักสูตร บัญชีและความคืบหน้าการเรียนเป็นคนละส่วนกัน
          และจะไม่ถูกลบด้วยหน้านี้ หากต้องการลบบัญชีทั้งหมด ส่งอีเมลมาที่{" "}
          <a href={`mailto:${CONTROLLER.email}`}>{CONTROLLER.email}</a>
        </p>
        <p className="legal-note">
          รายละเอียดว่าเก็บอะไรและใช้สิทธิอื่นได้อย่างไร อ่านได้ที่{" "}
          <Link href="/privacy">นโยบายความเป็นส่วนตัว</Link>
        </p>
      </section>
    </div>
  );
}
