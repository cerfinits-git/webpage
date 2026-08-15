"use client";

import { useState } from "react";
import { T } from "./LangContext";
import ConsentCheckbox from "./ConsentCheckbox";
import { CONSENT_VERSION } from "@/lib/legal";

// Replaces Netlify Forms: posts to /api/newsletter (Supabase table when env
// is set, data/newsletter.json fallback in dev). Honeypot field kept.
export default function NewsletterForm({ label }: { label?: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);

  if (done) {
    return (
      <div className="news-ok reveal in">
        <T th="✓ สมัครเรียบร้อย! เช็กอีเมลของคุณไว้ได้เลย" en="✓ You're in! Keep an eye on your inbox." />
      </div>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          botField: String(data.get("bot-field") ?? ""),
          consent: true,
          consentVersion: CONSENT_VERSION,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setDone(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form className="news-form reveal" onSubmit={submit}>
        <p className="hp">
          <label>
            Don&apos;t fill this out: <input name="bot-field" />
          </label>
        </p>
        <input type="email" name="email" required placeholder="you@email.com" aria-label="Email" />
        {/* Disabled until the box is ticked — consent has to gate the action,
            not merely sit beside it. */}
        <button type="submit" className="btn" disabled={busy || !consent}>
          {label ?? <T th="สมัครรับข่าว" en="Subscribe" />}
        </button>
      </form>
      <ConsentCheckbox id="news-consent" checked={consent} onChange={setConsent} />
      {error && (
        <p className="news-note" role="alert">
          <T
            th="ส่งไม่สำเร็จ — ลองใหม่อีกครั้ง หรือทักมาทาง Discord ได้เลย"
            en="Something went wrong — try again, or ping me on Discord."
          />
        </p>
      )}
    </>
  );
}
