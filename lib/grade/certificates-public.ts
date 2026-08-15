// Client-safe half of the certificate module.
//
// `certificates.ts` reaches for fs, crypto and Supabase, so a client component
// importing it fails to build. The shapes and the track descriptions live here
// instead — none of it is sensitive, and both the issue page and the public
// verify page render from it.

export type CertificateTrack = "foundation" | "advanced";

export type TrackSpec = {
  track: CertificateTrack;
  /** Every level that must be passed before the certificate can be issued. */
  levels: number[];
  titleTh: string;
  titleEn: string;
  blurbTh: string;
};

/**
 * Advanced requires the whole curriculum, not levels 5–8 alone: it is the
 * completion certificate, and passing the advanced material without the
 * foundation it builds on is not something worth certifying.
 */
export const TRACKS: Record<CertificateTrack, TrackSpec> = {
  foundation: {
    track: "foundation",
    levels: [1, 2, 3, 4],
    titleTh: "ระดับพื้นฐาน",
    titleEn: "Foundation",
    blurbTh: "ผ่านแบบทดสอบท้ายระดับ 1–4 ครบทุกระดับ",
  },
  advanced: {
    track: "advanced",
    levels: [1, 2, 3, 4, 5, 6, 7, 8],
    titleTh: "จบหลักสูตรเต็ม",
    titleEn: "Advanced",
    blurbTh: "ผ่านแบบทดสอบท้ายระดับครบทั้ง 8 ระดับ",
  },
};

export type Certificate = {
  id: string;
  username: string;
  track: CertificateTrack;
  recipientName: string;
  levels: number[];
  issuedAt: string;
  revokedAt: string | null;
};

export type TrackEligibility = {
  track: CertificateTrack;
  eligible: boolean;
  passedLevels: number[];
  missingLevels: number[];
};

export function formatIssueDate(iso: string, lang: "th" | "en" = "th"): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(date);
}
