import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { readSupabasePublicConfig } from "@/lib/supabase/config";
import type { QuizResults } from "./quiz-public";
import {
  TRACKS as TRACK_SPECS,
  type Certificate,
  type CertificateTrack,
  type TrackEligibility,
} from "./certificates-public";

export type {
  Certificate,
  CertificateTrack,
  TrackEligibility,
  TrackSpec,
} from "./certificates-public";
export { TRACKS, formatIssueDate } from "./certificates-public";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function generateCertificateId(track: CertificateTrack): string {
  const prefix = track === "foundation" ? "FND" : "ADV";
  const bytes = crypto.randomBytes(6);
  let body = "";
  for (let i = 0; i < 6; i++) {
    body += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `${prefix}-${body}`;
}

function getSupabaseClient() {
  const config = readSupabasePublicConfig();
  if (!config) return null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(config.url, serviceKey || config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function evaluateTrack(results: QuizResults, track: CertificateTrack): TrackEligibility {
  const spec = TRACK_SPECS[track];
  const passedLevels = spec.levels.filter((level) => results[level]?.passed);
  const missingLevels = spec.levels.filter((level) => !results[level]?.passed);
  return {
    track,
    eligible: missingLevels.length === 0,
    passedLevels,
    missingLevels,
  };
}

export function evaluateAllTracks(results: QuizResults): TrackEligibility[] {
  return (Object.keys(TRACK_SPECS) as CertificateTrack[]).map((track) => evaluateTrack(results, track));
}

function fromRow(row: any): Certificate {
  return {
    id: String(row.id),
    username: String(row.username),
    track: row.track as CertificateTrack,
    recipientName: String(row.recipient_name),
    levels: (row.levels || []) as number[],
    issuedAt: String(row.issued_at),
    revokedAt: row.revoked_at ? String(row.revoked_at) : null,
  };
}

export async function getCertificate(id: string): Promise<Certificate | null> {
  const certId = id.trim().toUpperCase();
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("grade_certificates")
      .select("*")
      .eq("id", certId)
      .maybeSingle();
    if (!error && data) return fromRow(data);
  } catch (err) {
    console.error("Supabase getCertificate error:", err);
  }

  return null;
}

export async function getCertificatesFor(username: string): Promise<Certificate[]> {
  const user = username.trim().toLowerCase();
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("grade_certificates")
      .select("*")
      .eq("username", user);
    if (!error && data) return data.map(fromRow);
  } catch (err) {
    console.error("Supabase getCertificatesFor error:", err);
  }

  return [];
}

export type IssueOutcome =
  | { ok: true; certificate: Certificate; reissued: boolean }
  | { ok: false; error: string };

export async function issueCertificate(
  username: string,
  track: CertificateTrack,
  recipientName: string,
  eligibility: TrackEligibility,
): Promise<IssueOutcome> {
  if (!eligibility.eligible) {
    return { ok: false, error: "ยังผ่านแบบทดสอบไม่ครบทุกระดับของใบนี้" };
  }

  const name = recipientName.trim();
  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "ชื่อบนใบรับรองต้องมีความยาว 2–80 ตัวอักษร" };
  }

  const user = username.trim().toLowerCase();
  const existing = (await getCertificatesFor(user)).find((c) => c.track === track);

  const certificate: Certificate = {
    id: existing?.id ?? generateCertificateId(track),
    username: user,
    track,
    recipientName: name,
    levels: TRACK_SPECS[track].levels,
    issuedAt: existing?.issuedAt ?? new Date().toISOString(),
    revokedAt: null,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("grade_certificates").upsert(
        {
          id: certificate.id,
          username: certificate.username,
          track: certificate.track,
          recipient_name: certificate.recipientName,
          levels: certificate.levels,
          issued_at: certificate.issuedAt,
          revoked_at: null,
        },
        { onConflict: "username,track" },
      );
      if (error) console.error("Supabase issueCertificate error:", JSON.stringify(error));
    } catch (err) {
      console.error("Supabase issueCertificate exception:", err);
    }
  }

  return { ok: true, certificate, reissued: Boolean(existing) };
}
