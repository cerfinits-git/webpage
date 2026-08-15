"use client";

import { useState } from "react";
import { T } from "@/components/site/LangContext";
import { thb } from "@/lib/format";

export type AllocationSlice = {
  label: string;
  labelEn: string;
  color: string;
  value: number;
  share: number;
};

function inkOn(hex: string): string {
  const channels = [1, 3, 5]
    .map((i) => parseInt(hex.substr(i, 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  const onBlack = (luminance + 0.05) / 0.05;
  const onWhite = 1.05 / (luminance + 0.05);
  return onBlack >= onWhite ? "#000000" : "#ffffff";
}

export default function AllocationChart({
  slices,
  total,
}: {
  slices: AllocationSlice[];
  total: number;
}) {
  const formatValue = thb;
  const [active, setActive] = useState<string | null>(null);

  if (slices.length === 0) return null;

  return (
    <div className="alloc-wrap" style={{ width: "100%" }}>
      {/* Allocation Stacked Bar */}
      <div
        className="alloc-bar"
        role="img"
        aria-label={slices
          .map((s) => `${s.label} ${Math.round(s.share * 100)}%`)
          .join(", ")}
        style={{
          display: "flex",
          gap: "2px",
          height: "22px",
          borderRadius: "6px",
          overflow: "hidden",
          background: "var(--j-surface)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
        }}
      >
        {slices.map((s) => (
          <div
            key={s.label}
            className={`alloc-seg ${active && active !== s.label ? "is-dim" : ""}`}
            style={{
              width: `${(s.share * 100).toFixed(2)}%`,
              background: s.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              cursor: "pointer",
              opacity: active && active !== s.label ? 0.35 : 1,
              filter: active === s.label ? "brightness(1.15) drop-shadow(0 0 4px rgba(255,255,255,0.3))" : "none",
            }}
            onMouseEnter={() => setActive(s.label)}
            onMouseLeave={() => setActive(null)}
          >
            {s.share >= 0.12 ? (
              <span
                className="alloc-seg-label"
                style={{
                  color: inkOn(s.color),
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  pointerEvents: "none",
                }}
              >
                {Math.round(s.share * 100)}%
              </span>
            ) : null}
          </div>
        ))}
      </div>

      {/* Breakdown Legend Table */}
      <ul
        className="alloc-list"
        style={{
          listStyle: "none",
          margin: "18px 0 0",
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "10px",
        }}
      >
        {slices.map((s) => (
          <li
            key={s.label}
            className={`alloc-row ${active === s.label ? "is-active" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              padding: "8px 12px",
              borderRadius: "6px",
              background: active === s.label ? "var(--j-soft)" : "var(--j-surface)",
              border: `1px solid ${active === s.label ? "var(--j-gold)" : "var(--j-line)"}`,
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={() => setActive(s.label)}
            onMouseLeave={() => setActive(null)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "3px",
                  background: s.color,
                  boxShadow: `0 0 6px ${s.color}66`,
                  display: "inline-block",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--j-ink)" }}>
                <T th={s.label} en={s.labelEn} />
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <strong style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--j-gold)" }}>
                {(s.share * 100).toFixed(1)}%
              </strong>
              <small style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--j-muted)" }}>
                {formatValue(s.value)}
              </small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
