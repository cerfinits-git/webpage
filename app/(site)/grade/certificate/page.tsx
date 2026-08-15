import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import CertificateClient from "@/components/grade/CertificateClient";

// Reads the signed-in reader's own record, so it must never be prerendered.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ใบรับรอง · Cerfinits Grade",
  description:
    "ใบรับรองการเรียนจบหลักสูตร Cerfinits Grade ออกให้เมื่อผ่านแบบทดสอบท้ายระดับครบตามเกณฑ์",
  alternates: { canonical: "/grade/certificate" },
  robots: { index: false, follow: false },
};

export default async function Page() {
  const headerList = await headers();
  const host = headerList.get("host") ?? "cerfinits.com";
  const protocol = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";

  return (
    <div className="book">
      <div className="wrap runhead">
        <span className="brand">
          <span className="dot" /> Cerfinits Grade
        </span>
        <span>ใบรับรอง</span>
      </div>

      <div className="wrap qz-opener">
        <Link href="/grade" className="qz-back">
          ← กลับหน้าหลักสูตร
        </Link>
        <span className="kicker">ใบรับรอง</span>
        <h1>ใบรับรองการเรียนจบหลักสูตร</h1>
        <p className="cert-intro">
          ใบรับรองออกจากผลแบบทดสอบที่บันทึกไว้ในบัญชีของคุณ ไม่ใช่จากการกดว่าอ่านจบ
          — ต้องผ่านแบบทดสอบท้ายระดับที่เกณฑ์ 80% ครบทุกระดับของใบนั้น
        </p>
      </div>

      <div className="wrap">
        <CertificateClient origin={`${protocol}://${host}`} />
      </div>

      <div className="wrap bookfoot" style={{ paddingBottom: "30px", borderTop: "none" }}>
        <span>CERFINITS GRADE</span>
        <span>ใบรับรองนี้ไม่ใช่ใบอนุญาต และไม่ได้รับรองความสามารถในการทำกำไร</span>
      </div>
    </div>
  );
}
