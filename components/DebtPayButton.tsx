"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { thb } from "@/lib/format";

interface AccountOption {
  id: string;
  name: string;
}

export default function DebtPayButton({
  debtId,
  installment,
  accounts,
}: {
  debtId: string;
  installment: number;
  accounts: AccountOption[];
}) {
  const router = useRouter();
  const [accountId, setAccountId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pending, startTransition] = useTransition();
  const busy = saving || pending;

  async function pay() {
    if (!window.confirm(`บันทึกจ่ายงวดนี้ ${thb(installment)}?`)) return;
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/debts/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: debtId, accountId: accountId || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "บันทึกไม่สำเร็จ");
        return;
      }
      startTransition(() => router.refresh());
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
      {accounts.length > 0 && (
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            padding: "5px 8px",
            font: "inherit",
            fontSize: 12.5,
            color: "var(--ink)",
            borderRadius: 2,
          }}
        >
          <option value="">ไม่หักบัญชี</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              หัก: {a.name}
            </option>
          ))}
        </select>
      )}
      <button type="button" className="btn" style={{ padding: "6px 14px" }} onClick={pay} disabled={busy}>
        {busy ? "กำลังบันทึก…" : `จ่ายงวดนี้ ${thb(installment)}`}
      </button>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
