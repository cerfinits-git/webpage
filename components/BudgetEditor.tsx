"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { EXPENSE_CATEGORIES, type Budget } from "@/lib/types";

export default function BudgetEditor({ budgets }: { budgets: Budget[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pending, startTransition] = useTransition();
  const busy = saving || pending;
  const current = new Map(budgets.map((b) => [b.category, b.monthlyLimit]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError("");
    setSaving(true);
    try {
      const payload = EXPENSE_CATEGORIES.map((category) => ({
        category,
        monthlyLimit: Number(fd.get(category) || 0),
      }));
      const res = await fetch("/api/budgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "บันทึกไม่สำเร็จ");
        return;
      }
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
      <button type="button" className="btn ghost" onClick={() => setOpen(true)}>
        ตั้งงบรายเดือน
      </button>
    );
  }

  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <p className="section-label" style={{ marginBottom: 12 }}>
        งบรายเดือนต่อหมวด (฿ · เว้น 0 = ไม่ตั้งงบ)
      </p>
      <div className="form-grid">
        {EXPENSE_CATEGORIES.map((c) => (
          <div className="field" key={c}>
            <label htmlFor={`bg-${c}`}>{c}</label>
            <input
              id={`bg-${c}`}
              name={c}
              type="number"
              step="any"
              min="0"
              defaultValue={current.get(c) ?? 0}
            />
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "กำลังบันทึก…" : "บันทึกงบ"}
        </button>
        <button className="btn ghost" type="button" onClick={() => setOpen(false)}>
          ยกเลิก
        </button>
        {error && <span className="form-error">{error}</span>}
      </div>
    </form>
  );
}
