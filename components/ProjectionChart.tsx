import { futureValue } from "@/lib/finance";
import { thb } from "@/lib/format";

interface Props {
  startValue: number;
  monthlySaving: number;
  annualReturn: number;
  targetAmount: number;
  startYear: number;
  targetYear: number;
}

const W = 600;
const H = 150;
const X0 = 30;
const X1 = 585;
const Y_TOP = 24;
const Y_BASE = 132;

export default function ProjectionChart({
  startValue,
  monthlySaving,
  annualReturn,
  targetAmount,
  startYear,
  targetYear,
}: Props) {
  const years = targetYear - startYear;
  const points: { year: number; value: number }[] = [];
  for (let y = 0; y <= years; y++) {
    points.push({ year: startYear + y, value: futureValue(startValue, monthlySaving, annualReturn, y * 12) });
  }
  const maxVal = Math.max(targetAmount, points[points.length - 1].value) * 1.06;
  const x = (i: number) => X0 + (i / years) * (X1 - X0);
  const y = (v: number) => Y_BASE - (v / maxVal) * (Y_BASE - Y_TOP);

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${line} L${X1},${Y_BASE + 8} L${X0},${Y_BASE + 8} Z`;
  const targetY = y(targetAmount);
  const midYear = startYear + Math.round(years / 2);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label={`กราฟคาดการณ์มูลค่าพอร์ตจากปี ${startYear} ถึงเป้าปี ${targetYear}`}
    >
      <line x1={X0} y1={targetY} x2={X1} y2={targetY} stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x={X0} y={targetY - 8} fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">
        เป้า {thb(targetAmount)}
      </text>
      <path d={area} fill="var(--ink)" fillOpacity="0.08" />
      <path d={line} fill="none" stroke="var(--ink)" strokeWidth="1.8" />
      <text x={X0} y={H - 1} fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">
        {startYear}
      </text>
      <text x={(X0 + X1) / 2} y={H - 1} fontSize="11" fill="var(--muted)" textAnchor="middle" fontFamily="var(--mono)">
        {midYear}
      </text>
      <text x={X1} y={H - 1} fontSize="11" fill="var(--muted)" textAnchor="end" fontFamily="var(--mono)">
        {targetYear}
      </text>
    </svg>
  );
}
