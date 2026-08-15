"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ASSET_CATEGORIES } from "@/lib/types";

const DEFAULT_DEPRECIATION: Record<string, number> = {
  บ้าน: 0,
  ที่ดิน: 0,
  รถ: 10,
  ทอง: 0,
  อื่นๆ: 0,
};

export default function AssetForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pending, startTransition] = useTransition();
  const [category, setCategory] = useState("บ้าน");
  const [rate, setRate] = useState("0");
  const busy = saving || pending;
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          category,
          purchasePrice: Number(fd.get("purchasePrice")),
          purchaseDate: fd.get("purchaseDate"),
          depreciationRate: Number(rate || 0) / 100,
          valueOverride: fd.get("valueOverride") || undefined,
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
        ＋ เพิ่มสินทรัพย์
      </button>
    );
  }

  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <p className="section-label" style={{ marginBottom: 12 }}>
        สินทรัพย์ใหม่ (บ้าน ที่ดิน รถ ทอง ฯลฯ)
      </p>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="as-name">ชื่อ</label>
          <input id="as-name" name="name" required placeholder="รถกระบะ" />
        </div>
        <div className="field">
          <label htmlFor="as-category">ประเภท</label>
          <select
            id="as-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setRate(String(DEFAULT_DEPRECIATION[e.target.value] ?? 0));
            }}
          >
            {ASSET_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="as-price">ราคาซื้อ (฿)</label>
          <input id="as-price" name="purchasePrice" type="number" step="any" min="1" required />
        </div>
        <div className="field">
          <label htmlFor="as-date">วันที่ซื้อ</label>
          <input id="as-date" name="purchaseDate" type="date" defaultValue={today} required />
        </div>
        <div className="field">
          <label htmlFor="as-rate">ค่าเสื่อม (%/ปี)</label>
          <input
            id="as-rate"
            type="number"
            step="any"
            min="0"
            max="100"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="as-override">มูลค่าปัจจุบัน (฿ · เว้นว่าง = คำนวณจากค่าเสื่อม)</label>
          <input id="as-override" name="valueOverride" type="number" step="any" min="0" />
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
