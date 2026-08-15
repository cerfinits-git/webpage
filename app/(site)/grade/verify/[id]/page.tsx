import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import CertificateCard from "@/components/grade/CertificateCard";
import { getCertificate } from "@/lib/grade/certificates";

// Looks up a live record, and the page must not be cached per-id at build time.
export const dynamic = "force-dynamic";

// Deliberately generic: the holder's name is on the page for whoever opens the
// link, but it is kept out of the share card, which crawlers fetch and cache.
export const metadata: Metadata = {
  title: "ตรวจสอบใบรับรอง · Cerfinits Grade",
  description: "ตรวจสอบว่าใบรับรอง Cerfinits Grade ใบนี้ออกให้จริงหรือไม่ ด้วยรหัสใบรับรอง",
  robots: { index: false, follow: false },
  openGraph: {
    title: "ตรวจสอบใบรับรอง · Cerfinits Grade",
    description: "ยืนยันความถูกต้องของใบรับรองการเรียนจบหลักสูตร Cerfinits Grade",
    images: ["/og-cover.png"],
    type: "website",
  },
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const certificate = await getCertificate(decodeURIComponent(id));

  const headerList = await headers();
  const host = headerList.get("host") ?? "cerfinits.com";
  const protocol = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";

  return (
    <div className="book">
      <div className="wrap runhead">
        <span className="brand">
          <span className="dot" /> Cerfinits Grade
        </span>
        <span>ตรวจสอบใบรับรอง</span>
      </div>

      <div className="wrap qz-opener">
        <Link href="/grade" className="qz-back">
          ← ไปที่หลักสูตร
        </Link>
        <span className="kicker">ตรวจสอบใบรับรอง</span>
        <h1>{certificate ? "ใบรับรองนี้ออกให้จริง" : "ไม่พบใบรับรองนี้"}</h1>
      </div>

      <div className="wrap">
        {certificate ? (
          <>
            <div className={`cert-verdict ${certificate.revokedAt ? "is-revoked" : "is-valid"}`}>
              <span className="cert-verdict-kicker">
                {certificate.revokedAt ? "ถูกยกเลิกแล้ว" : "ยืนยันแล้ว"}
              </span>
              <p>
                รหัส <b>{certificate.id}</b>{" "}
                {certificate.revokedAt
                  ? "เคยออกให้จริง แต่ถูกยกเลิกภายหลัง จึงไม่ควรใช้อ้างอิงอีก"
                  : "ตรงกับใบรับรองที่ระบบออกให้ตามรายละเอียดด้านล่าง"}
              </p>
            </div>
            <div className="cert-preview">
              <CertificateCard
                certificate={certificate}
                verifyUrl={`${protocol}://${host}/grade/verify/${certificate.id}`}
              />
            </div>
          </>
        ) : (
          <div className="cert-verdict is-missing">
            <span className="cert-verdict-kicker">ไม่พบข้อมูล</span>
            <p>
              ไม่มีใบรับรองที่ตรงกับรหัสนี้ในระบบ — ตรวจสอบว่าพิมพ์รหัสถูกต้องครบถ้วน
              (รูปแบบคือ CFG-F-XXXXXXXX หรือ CFG-A-XXXXXXXX)
              หากรหัสถูกต้องแล้วยังไม่พบ แปลว่าใบนี้ไม่ได้ออกโดย Cerfinits Grade
            </p>
          </div>
        )}
      </div>

      <div className="wrap bookfoot" style={{ paddingBottom: "30px", borderTop: "none" }}>
        <span>CERFINITS GRADE</span>
        <span>ใบรับรองนี้ไม่ใช่ใบอนุญาต และไม่ได้รับรองความสามารถในการทำกำไร</span>
      </div>
    </div>
  );
}
