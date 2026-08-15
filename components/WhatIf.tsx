"use client";

import { useState } from "react";
import { requiredMonthly } from "@/lib/finance";
import { thb } from "@/lib/format";

interface Props {
  currentValue: number;
  targetAmount: number;
  targetYear: number;
  monthlySaving: number;
  expectedReturn: number;
  baseYear: number;
}

export default function WhatIf({
  currentValue,
  targetAmount,
  targetYear,
  monthlySaving,
  expectedReturn,
  baseYear,
}: Props) {
  const [year, setYear] = useState(targetYear);
  const minYear = Math.max(baseYear + 2, targetYear - 10);

  const months = (year - baseYear) * 12;
  const need = requiredMonthly(targetAmount, currentValue, expectedReturn, months);
  const rounded = Math.round(need / 100) * 100;
  const delta = rounded - monthlySaving;

  return (
    <div className="card">
      <p className="section-label" style={{ marginBottom: 14 }}>
        WHAT-IF — อยากถึงเป้าเร็วขึ้น?
      </p>
      <div className="whatif-row">
        <span style={{ fontSize: 13.5, color: "var(--muted)", flex: "none" }}>ถึงเป้าปี</span>
        <input
          type="range"
          min={minYear}
          max={targetYear}
          step={1}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          aria-label="เลือกปีที่ต้องการถึงเป้าหมาย"
        />
        <span className="mono" style={{ fontSize: 14, fontWeight: 500, minWidth: 44, textAlign: "right" }}>
          {year}
        </span>
      </div>
      <div className="whatif-result">
        <span style={{ fontSize: 13.5, color: "var(--muted)" }}>ต้องออมเดือนละ</span>
        <span className="whatif-pmt">{thb(rounded)}</span>
        <span className="mono" style={{ fontSize: 12, color: delta <= 0 ? "var(--up)" : "var(--down)" }}>
          {delta <= 0
            ? `แผนปัจจุบัน ${thb(monthlySaving)}/เดือน เพียงพอแล้ว`
            : `+${thb(delta)}/เดือน จากแผนปัจจุบัน ${thb(monthlySaving)}`}
        </span>
      </div>
    </div>
  );
}
