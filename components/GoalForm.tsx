"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function GoalForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pending, startTransition] = useTransition();
  const [linked, setLinked] = useState(true);
  const busy = saving || pending;
  const defaultYear = new Date().getFullYear() + 10;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          targetAmount: Number(fd.get("targetAmount")),
          targetYear: Number(fd.get("targetYear")),
          monthlySaving: Number(fd.get("monthlySaving") || 0),
          expectedReturn: Number(fd.get("expectedReturn") || 0) / 100,
          linkedToPortfolio: linked,
          currentAmount: linked ? undefined : Number(fd.get("currentAmount") || 0),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "บันทึกไม่สำเร็จ");
        return;
      }
      form.reset();
      setLinked(true);
      setOpen(false);
      startTransition(() => router.refresh());
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ marginTop: 14 }}>
      {!open && (
        <button type="button" className="btn" onClick={() => setOpen(true)}>
          ＋ เพิ่มเป้าหมาย
        </button>
      )}
      {open && (
        <form className="card form-card" onSubmit={onSubmit}>
          <p className="section-label" style={{ marginBottom: 12 }}>
            NEW GOAL — เป้าหมายใหม่
          </p>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="g-name">ชื่อเป้าหมาย</label>
              <input id="g-name" name="name" required placeholder="เกษียณอายุ" />
            </div>
            <div className="field">
              <label htmlFor="g-target">ยอดเป้าหมาย (฿)</label>
              <input id="g-target" name="targetAmount" type="number" step="any" min="1" required />
            </div>
            <div className="field">
              <label htmlFor="g-year">ปีเป้าหมาย (ค.ศ.)</label>
              <input id="g-year" name="targetYear" type="number" step="1" defaultValue={defaultYear} required />
            </div>
            <div className="field">
              <label htmlFor="g-monthly">ออมต่อเดือน (฿)</label>
              <input id="g-monthly" name="monthlySaving" type="number" step="any" min="0" defaultValue={0} />
            </div>
            <div className="field">
              <label htmlFor="g-return">ผลตอบแทนคาดหวัง (%/ปี)</label>
              <input id="g-return" name="expectedReturn" type="number" step="any" min="0" max="100" defaultValue={7} />
            </div>
            <div className="field">
              <label htmlFor="g-linked">แหล่งเงินตั้งต้น</label>
              <select
                id="g-linked"
                value={linked ? "portfolio" : "manual"}
                onChange={(e) => setLinked(e.target.value === "portfolio")}
              >
                <option value="portfolio">ผูกกับมูลค่าพอร์ต</option>
                <option value="manual">กรอกยอดเอง</option>
              </select>
            </div>
            {!linked && (
              <div className="field">
                <label htmlFor="g-current">ยอดปัจจุบัน (฿)</label>
                <input id="g-current" name="currentAmount" type="number" step="any" min="0" defaultValue={0} />
              </div>
            )}
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
      )}
    </div>
  );
}
