"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { THAI_BANKS } from "@/lib/types";

export default function AccountForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pending, startTransition] = useTransition();
  const [bank, setBank] = useState(THAI_BANKS[0].name);
  const [rate, setRate] = useState(String(THAI_BANKS[0].rate * 100));
  const busy = saving || pending;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          bank,
          openingBalance: Number(fd.get("openingBalance") || 0),
          interestRate: Number(rate || 0) / 100,
          note: fd.get("note") || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "บันทึกไม่สำเร็จ");
        return;
      }
      form.reset();
      setOpen(false);
      startTransition(() => router.refresh());
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="btn" onClick={() => setOpen(true)}>
        ＋ เพิ่มบัญชี
      </button>
    );
  }

  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <p className="section-label" style={{ marginBottom: 12 }}>
        บัญชีออมใหม่
      </p>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="ac-name">ชื่อบัญชี</label>
          <input id="ac-name" name="name" required placeholder="ออมทรัพย์หลัก" />
        </div>
        <div className="field">
          <label htmlFor="ac-bank">ธนาคาร (auto-fill ดอกเบี้ย)</label>
          <select
            id="ac-bank"
            value={bank}
            onChange={(e) => {
              setBank(e.target.value);
              const preset = THAI_BANKS.find((b) => b.name === e.target.value);
              if (preset) setRate(String(preset.rate * 100));
            }}
          >
            {THAI_BANKS.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ac-rate">ดอกเบี้ย (%/ปี)</label>
          <input
            id="ac-rate"
            type="number"
            step="any"
            min="0"
            max="100"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="ac-balance">ยอดปัจจุบัน (฿)</label>
          <input id="ac-balance" name="openingBalance" type="number" step="any" min="0" defaultValue={0} />
        </div>
        <div className="field">
          <label htmlFor="ac-note">โน้ต (ไม่บังคับ)</label>
          <input id="ac-note" name="note" />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "กำลังบันทึก…" : "บันทึก"}
        </button>
        <button className="btn ghost" type="button" onClick={() => setOpen(false)}>
          ยกเลิก
        </button>
        {error && <span className="form-error">{error}</span>}
      </div>
    </form>
  );
}
