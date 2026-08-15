import { formatIssueDate, TRACKS, type Certificate } from "@/lib/grade/certificates-public";

/**
 * The certificate itself. Rendered as ordinary markup so it prints cleanly and
 * stays readable in both themes — and so the wording below can never be
 * mistaken for a licence or a promise about results.
 */
export default function CertificateCard({
  certificate,
  verifyUrl,
}: {
  certificate: Certificate;
  verifyUrl: string;
}) {
  const spec = TRACKS[certificate.track];
  const revoked = Boolean(certificate.revokedAt);

  return (
    <article className={`cert ${revoked ? "is-revoked" : ""}`}>
      <header className="cert-head">
        <span className="cert-brand">
          <span className="cert-dot" aria-hidden="true" />
          Cerfinits Grade
        </span>
        <span className="cert-kicker">ใบรับรองการเรียนจบหลักสูตร</span>
      </header>

      <div className="cert-body">
        <p className="cert-lead">มอบให้แก่</p>
        <h1 className="cert-name">{certificate.recipientName}</h1>

        <p className="cert-statement">
          ผู้ซึ่งได้ศึกษาหลักสูตร Cerfinits Grade และ
          <b> {spec.blurbTh}</b> ตามเกณฑ์ผ่านที่ 80% ของแต่ละระดับ
        </p>

        <div className="cert-track">
          <span className="cert-track-th">{spec.titleTh}</span>
          <span className="cert-track-en">{spec.titleEn}</span>
        </div>

        <ul className="cert-levels" aria-label="ระดับที่ผ่านแบบทดสอบ">
          {certificate.levels.map((level) => (
            <li key={level}>ระดับ {level}</li>
          ))}
        </ul>
      </div>

      <footer className="cert-foot">
        <div className="cert-meta">
          <span className="cert-meta-label">รหัสใบรับรอง</span>
          <b className="cert-id">{certificate.id}</b>
        </div>
        <div className="cert-meta">
          <span className="cert-meta-label">วันที่ออกใบ</span>
          <b>{formatIssueDate(certificate.issuedAt)}</b>
        </div>
        <div className="cert-meta cert-meta-verify">
          <span className="cert-meta-label">ตรวจสอบได้ที่</span>
          <b>{verifyUrl}</b>
        </div>
      </footer>

      {revoked ? <p className="cert-revoked-mark">ใบรับรองนี้ถูกยกเลิกแล้ว</p> : null}

      <p className="cert-disclaimer">
        ใบรับรองนี้ยืนยันการผ่านแบบทดสอบวัดความเข้าใจเนื้อหาของหลักสูตรเท่านั้น
        — <b>ไม่ใช่ใบอนุญาตประกอบวิชาชีพหรือใบอนุญาตทางการเงินใด ๆ</b>{" "}
        และไม่ได้รับรองความสามารถในการทำกำไร ผลการเทรดขึ้นกับผู้เทรดเองทั้งหมด
        การเทรดมีความเสี่ยงที่จะสูญเสียเงินลงทุน
      </p>
    </article>
  );
}
