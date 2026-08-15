"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CertificateCard from "./CertificateCard";
import {
  TRACKS,
  type Certificate,
  type CertificateTrack,
  type TrackEligibility,
} from "@/lib/grade/certificates-public";

type Payload = {
  signedIn: boolean;
  defaultName?: string;
  eligibility: TrackEligibility[];
  certificates: Certificate[];
};

export default function CertificateClient({ origin }: { origin: string }) {
  const [data, setData] = useState<Payload | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<CertificateTrack | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const download = async (certificate: Certificate) => {
    setDownloading(certificate.id);
    setError(null);
    try {
      // Loaded on demand so the canvas renderer stays out of the initial bundle.
      const { downloadCertificatePng } = await import("@/lib/grade/certificate-image");
      await downloadCertificatePng(certificate, `${origin}/grade/verify/${certificate.id}`);
    } catch {
      setError("สร้างรูปไม่สำเร็จ — ลองใช้ปุ่มพิมพ์/บันทึกเป็น PDF แทน");
    } finally {
      setDownloading(null);
    }
  };

  const load = async () => {
    try {
      const res = await fetch("/api/grade/certificate", { cache: "no-store" });
      const payload = (await res.json()) as Payload;
      setData(payload);
      setName((current) => current || payload.defaultName || "");
    } catch {
      setError("โหลดข้อมูลใบรับรองไม่สำเร็จ");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const issue = async (track: CertificateTrack) => {
    setBusy(track);
    setError(null);
    try {
      const res = await fetch("/api/grade/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track, recipientName: name }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error || "ออกใบรับรองไม่สำเร็จ");
        return;
      }
      await load();
    } catch {
      setError("ออกใบรับรองไม่สำเร็จ — ตรวจสอบการเชื่อมต่อแล้วลองใหม่");
    } finally {
      setBusy(null);
    }
  };

  if (!data) {
    return <div className="qz qz-loading">กำลังโหลด…</div>;
  }

  if (!data.signedIn) {
    return (
      <div className="cert-empty">
        <h2>เข้าสู่ระบบเพื่อดูใบรับรอง</h2>
        <p>
          ใบรับรองออกจากผลแบบทดสอบที่บันทึกไว้ในบัญชีของคุณ
          — ทำแบบทดสอบขณะยังไม่เข้าสู่ระบบจะไม่ถูกบันทึก
        </p>
        <button
          type="button"
          className="qz-btn"
          onClick={() => window.dispatchEvent(new CustomEvent("open-login"))}
        >
          เข้าสู่ระบบ
        </button>
      </div>
    );
  }

  const certByTrack = new Map(data.certificates.map((c) => [c.track, c]));

  return (
    <div className="cert-page">
      <div className="cert-name-field">
        <label htmlFor="cert-name">ชื่อที่จะปรากฏบนใบรับรอง</label>
        <input
          id="cert-name"
          type="text"
          value={name}
          maxLength={80}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อ–นามสกุล"
        />
        <small>
          ชื่อนี้จะแสดงบนหน้าตรวจสอบใบรับรองซึ่งเปิดให้คนทั่วไปเข้าดูได้ด้วยรหัสใบ
          — เลือกชื่อที่คุณยินดีให้ปรากฏต่อสาธารณะ
        </small>
      </div>

      {error ? <p className="cert-error">{error}</p> : null}

      {data.eligibility.map((track) => {
        const spec = TRACKS[track.track];
        const certificate = certByTrack.get(track.track);
        return (
          <section className="cert-track-block" key={track.track}>
            <div className="cert-track-head">
              <div>
                <span className="kicker">{spec.titleEn}</span>
                <h2>{spec.titleTh}</h2>
                <p>{spec.blurbTh}</p>
              </div>
              <span className={`cert-status ${track.eligible ? "is-ready" : ""}`}>
                {track.passedLevels.length}/{spec.levels.length} ระดับ
              </span>
            </div>

            {track.eligible ? (
              <div className="cert-actions">
                <button
                  type="button"
                  className="qz-btn"
                  disabled={busy === track.track || name.trim().length < 2}
                  onClick={() => issue(track.track)}
                >
                  {busy === track.track
                    ? "กำลังดำเนินการ…"
                    : certificate
                      ? "อัปเดตชื่อบนใบรับรอง"
                      : "ออกใบรับรอง"}
                </button>
                {certificate ? (
                  <>
                    <button
                      type="button"
                      className="qz-btn qz-btn-ghost"
                      disabled={downloading === certificate.id}
                      onClick={() => download(certificate)}
                    >
                      {downloading === certificate.id ? "กำลังสร้างรูป…" : "ดาวน์โหลดรูป (PNG)"}
                    </button>
                    <button type="button" className="qz-btn qz-btn-ghost" onClick={() => window.print()}>
                      พิมพ์ / บันทึกเป็น PDF
                    </button>
                  </>
                ) : null}
              </div>
            ) : (
              <p className="cert-missing">
                ยังเหลืออีก {track.missingLevels.length} ระดับ —{" "}
                {track.missingLevels.map((level, index) => (
                  <span key={level}>
                    {index > 0 ? ", " : ""}
                    <Link href={`/grade/checkpoint/${level}`}>ระดับ {level}</Link>
                  </span>
                ))}
              </p>
            )}

            {certificate ? (
              <div className="cert-preview">
                <CertificateCard
                  certificate={certificate}
                  verifyUrl={`${origin}/grade/verify/${certificate.id}`}
                />
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
