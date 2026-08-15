"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Currency } from "@/lib/types";
import { useLang } from "@/components/site/LangContext";

export default function NavEditButton({ symbol, currency }: { symbol: string; currency: Currency }) {
  const router = useRouter();
  const { lang } = useLang();
  const [pending, startTransition] = useTransition();

  async function onClick() {
    const input = window.prompt(
      lang === "en" ? `NAV / last price for ${symbol} (${currency})` : `NAV/ราคาล่าสุดของ ${symbol} (${currency})`,
    );
    if (input == null) return;
    const price = Number(input);
    if (!Number.isFinite(price) || price <= 0) {
      window.alert(lang === "en" ? "Price must be a number greater than 0" : "ราคาต้องเป็นตัวเลขมากกว่า 0");
      return;
    }
    const res = await fetch("/api/manual-prices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, price, currency }),
    });
    if (res.ok) startTransition(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      style={{
        background: "var(--j-soft)",
        color: "var(--j-gold)",
        border: "1px solid var(--j-line)",
        borderRadius: "4px",
        padding: "3px 8px",
        fontSize: "11px",
        fontWeight: 600,
        fontFamily: "var(--mono)",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
      title={lang === "en" ? `Update NAV for ${symbol} manually` : `อัปเดต NAV ของ ${symbol} เอง`}
      aria-label={lang === "en" ? `Update NAV for ${symbol}` : `อัปเดต NAV ของ ${symbol}`}
    >
      ✎ NAV
    </button>
  );
}
