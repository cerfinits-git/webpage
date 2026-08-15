"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, type CashflowKind } from "@/lib/types";

interface AccountOption {
  id: string;
  name: string;
}

export default function CashflowForm({ accounts }: { accounts: AccountOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pending, startTransition] = useTransition();
  const [kind, setKind] = useState<CashflowKind>("expense");
  const [category, setCategory] = useState("อาหาร");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const busy = saving || pending;

  const categories = kind === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function switchKind(k: CashflowKind) {
    setKind(k);
    setCategory(k === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  }

  function openForm() {
    setOpen(true);
    setTimeout(() => (document.getElementById("cf-amount") as HTMLInputElement | null)?.focus(), 60);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/cashflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          category,
          amount: Number(amount),
          note,
          accountId: accountId || undefined,
          date,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "บันทึกไม่สำเร็จ");
        return;
      }
      setAmount("");
      setNote("");
      setOpen(false);
      startTransition(() => router.refresh());
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span className="section-label">รายการเดือนนี้</span>
        <button
          type="button"
          className="btn"
          style={{ marginLeft: "auto" }}
          onClick={() => (open ? setOpen(false) : openForm())}
        >
          {open ? "× ปิดฟอร์ม" : "＋ บันทึกรายการ"}
        </button>
      </div>
      {open && (
        <form className="card form-card" onSubmit={onSubmit}>
          <div className="presets" style={{ marginBottom: 10 }}>
            <button
              type="button"
              className={`pill ${kind === "expense" ? "on" : ""}`}
              onClick={() => switchKind("expense")}
            >
              รายจ่าย
            </button>
            <button
              type="button"
              className={`pill ${kind === "income" ? "on" : ""}`}
              onClick={() => switchKind("income")}
            >
              รายรับ
            </button>
          </div>
          <div className="presets">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`pill ${category === c ? "on" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="cf-amount">จำนวนเงิน (฿)</label>
              <input
                id="cf-amount"
                type="number"
                step="any"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="cf-account">บัญชี (ไม่บังคับ)</label>
              <select id="cf-account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                <option value="">ไม่ระบุ</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="cf-date">วันที่</label>
              <input id="cf-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="cf-note">โน้ต (ไม่บังคับ)</label>
              <input id="cf-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="ข้าวเที่ยง" />
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
      )}
    </>
  );
}
