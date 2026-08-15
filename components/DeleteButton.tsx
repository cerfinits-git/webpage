"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useLang } from "@/components/site/LangContext";

export default function DeleteButton({ url, label, labelEn }: { url: string; label: string; labelEn?: string }) {
  const router = useRouter();
  const { lang } = useLang();
  const [pending, startTransition] = useTransition();
  const resolvedLabel = lang === "en" ? (labelEn ?? label) : label;
  const text = lang === "en" ? `Delete ${resolvedLabel}?` : `ลบ${resolvedLabel}?`;

  async function onClick() {
    if (!window.confirm(text)) return;
    const res = await fetch(url, { method: "DELETE" });
    if (res.ok) startTransition(() => router.refresh());
  }

  return (
    <button
      type="button"
      className="x-btn mono"
      onClick={onClick}
      disabled={pending}
      aria-label={text}
      title={text}
      style={{
        background: "transparent",
        color: "var(--j-muted)",
        border: "1px solid var(--j-line)",
        borderRadius: "4px",
        width: "24px",
        height: "24px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "15px",
        lineHeight: 1,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--j-negative)";
        e.currentTarget.style.borderColor = "var(--j-negative)";
        e.currentTarget.style.background = "var(--j-down-tint)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--j-muted)";
        e.currentTarget.style.borderColor = "var(--j-line)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      ×
    </button>
  );
}
