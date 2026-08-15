"use client";

import { useState } from "react";
import { futureValue } from "@/lib/finance";
import { thb } from "@/lib/format";

export default function DcaCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [ret, setRet] = useState(7);
  const [years, setYears] = useState(10);

  const fv = futureValue(0, monthly, ret / 100, years * 12);
  const contributed = monthly * 12 * years;
  const gain = fv - contributed;

  return (
    <div className="card" style={{ marginTop: 14 }}>
      <p className="section-label" style={{ marginBottom: 14 }}>
        DCA CALCULATOR — ลงทุนสม่ำเสมอ
      </p>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="dca-monthly">ลงทุนต่อเดือน (฿)</label>
          <input
            id="dca-monthly"
            type="number"
            step="any"
            min="0"
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value) || 0)}
          />
        </div>
        <div className="field">
          <label htmlFor="dca-return">ผลตอบแทนคาดหวัง (%/ปี)</label>
          <input
            id="dca-return"
            type="number"
            step="any"
            min="0"
            max="100"
            value={ret}
            onChange={(e) => setRet(Number(e.target.value) || 0)}
          />
        </div>
        <div className="field">
          <label htmlFor="dca-years">ระยะเวลา (ปี)</label>
          <input
            id="dca-years"
            type="number"
            step="1"
            min="1"
            max="60"
            value={years}
            onChange={(e) => setYears(Math.max(Number(e.target.value) || 1, 1))}
          />
        </div>
      </div>
      <div className="whatif-result" style={{ marginTop: 14 }}>
        <span style={{ fontSize: 13.5, color: "var(--muted)" }}>มูลค่าปลายทาง</span>
        <span className="whatif-pmt">{thb(fv)}</span>
        <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
          เงินต้น {thb(contributed)} · <span className="up">กำไร {thb(gain)}</span>
        </span>
      </div>
    </div>
  );
}
