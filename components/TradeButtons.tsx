"use client";

import type { TradePrefill } from "@/lib/types";
import { T } from "@/components/site/LangContext";

export default function TradeButtons({ prefill }: { prefill: Omit<TradePrefill, "side"> }) {
  const fire = (side: "buy" | "sell") =>
    window.dispatchEvent(new CustomEvent("prefill-tx", { detail: { ...prefill, side } }));

  return (
    <span style={{ display: "inline-flex", gap: 6 }}>
      <button
        type="button"
        onClick={() => fire("buy")}
        style={{
          background: "var(--j-up-tint, rgba(16, 185, 129, 0.12))",
          color: "var(--j-positive, #10b981)",
          border: "1px solid var(--j-up-line, rgba(16, 185, 129, 0.35))",
          borderRadius: "4px",
          padding: "3px 8px",
          fontSize: "11px",
          fontWeight: 600,
          fontFamily: "var(--mono)",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 0 8px var(--j-positive-glow, rgba(16, 185, 129, 0.3))";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <T th="ซื้อ" en="BUY" />
      </button>
      <button
        type="button"
        onClick={() => fire("sell")}
        style={{
          background: "var(--j-down-tint, rgba(244, 63, 94, 0.12))",
          color: "var(--j-negative, #f43f5e)",
          border: "1px solid var(--j-down-line, rgba(244, 63, 94, 0.35))",
          borderRadius: "4px",
          padding: "3px 8px",
          fontSize: "11px",
          fontWeight: 600,
          fontFamily: "var(--mono)",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 0 8px var(--j-negative-glow, rgba(244, 63, 94, 0.3))";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <T th="ขาย" en="SELL" />
      </button>
    </span>
  );
}
