"use client";

import { useState } from "react";

export default function UnsubscribeForm() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          botField: String(data.get("bot-field") ?? ""),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="unsub-ok">
        <strong>ดำเนินการแล้ว</strong>
        <p>
          หากอีเมลนี้อยู่ในระบบ ตอนนี้ถูกลบออกถาวรแล้ว และจะไม่ได้รับอีเมลจาก Cerfinits อีก
          ไม่ต้องทำอะไรเพิ่ม
        </p>
        <p className="unsub-note">
          ข้อความนี้แสดงเหมือนกันทุกกรณี ไม่ว่าอีเมลจะเคยอยู่ในระบบหรือไม่
          เพื่อไม่ให้ใครใช้หน้านี้ตรวจสอบว่าคนอื่นสมัครไว้หรือเปล่า
        </p>
      </div>
    );
  }

  return (
    <form className="unsub-form" onSubmit={submit}>
      <p className="hp">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>
      <label className="unsub-label" htmlFor="unsub-email">
        อีเมลที่ต้องการลบ
      </label>
      <input
        id="unsub-email"
        type="email"
        name="email"
        required
        placeholder="you@email.com"
        autoComplete="email"
      />
      <button type="submit" className="legal-btn" disabled={state === "busy"}>
        {state === "busy" ? "กำลังดำเนินการ…" : "ลบอีเมลของฉันออกจากระบบ"}
      </button>
      {state === "error" ? (
        <p className="unsub-err" role="alert">
          ดำเนินการไม่สำเร็จ — ลองอีกครั้ง หรือส่งอีเมลมาแจ้งได้โดยตรง
        </p>
      ) : null}
    </form>
  );
}
