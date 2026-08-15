"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DEBT_TYPES } from "@/lib/types";

export default function DebtForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pending, startTransition] = useTransition();
  const busy = saving || pending;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError("");
    setSaving(true);
    try {
      const principal = Number(fd.get("principal"));
      const remainingRaw = fd.get("remaining");
      const res = await fetch("/api/debts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          type: fd.get("type"),
          principal,
          remaining: remainingRaw ? Number(remainingRaw) : principal,
          interestRate: Number(fd.get("interestRate") || 0) / 100,
          installment: Number(fd.get("installment") || 0),
          totalInstallments: Number(fd.get("totalInstallments") || 1),
          paidInstallments: Number(fd.get("paidInstallments") || 0),
          dueDay: Number(fd.get("dueDay") || 1),
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
        ＋ เพิ่มหนี้
      </button>
    );
  }

  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <p className="section-label" style={{ marginBottom: 12 }}>
        หนี้ใหม่
      </p>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="db-name">ชื่อหนี้</label>
          <input id="db-name" name="name" required placeholder="ผ่อนรถ" />
        </div>
        <div className="field">
          <label htmlFor="db-type">ประเภท</label>
          <select id="db-type" name="type" defaultValue={DEBT_TYPES[1]}>
            {DEBT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="db-principal">ยอดหนี้ทั้งหมด (฿)</label>
          <input id="db-principal" name="principal" type="number" step="any" min="1" required />
        </div>
        <div className="field">
          <label htmlFor="db-remaining">ยอดคงเหลือ (฿ · เว้นว่าง = เท่ายอดหนี้)</label>
          <input id="db-remaining" name="remaining" type="number" step="any" min="0" />
        </div>
        <div className="field">
          <label htmlFor="db-rate">ดอกเบี้ย (%/ปี)</label>
          <input id="db-rate" name="interestRate" type="number" step="any" min="0" max="100" defaultValue={0} />
        </div>
        <div className="field">
          <label htmlFor="db-installment">ผ่อนต่องวด (฿)</label>
          <input id="db-installment" name="installment" type="number" step="any" min="0" defaultValue={0} />
        </div>
        <div className="field">
          <label htmlFor="db-total">จำนวนงวดทั้งหมด</label>
          <input id="db-total" name="totalInstallments" type="number" step="1" min="1" defaultValue={12} />
        </div>
        <div className="field">
          <label htmlFor="db-paid">จ่ายไปแล้ว (งวด)</label>
          <input id="db-paid" name="paidInstallments" type="number" step="1" min="0" defaultValue={0} />
        </div>
        <div className="field">
          <label htmlFor="db-dueday">ครบกำหนดทุกวันที่</label>
          <input id="db-dueday" name="dueDay" type="number" step="1" min="1" max="31" defaultValue={1} required />
        </div>
        <div className="field">
          <label htmlFor="db-note">โน้ต (ไม่บังคับ)</label>
          <input id="db-note" name="note" />
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
