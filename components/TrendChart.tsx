interface Point {
  month: string;
  income: number;
  expense: number;
}

const W = 600;
const H = 170;
const X0 = 12;
const X1 = 588;
const Y_TOP = 26;
const Y_BASE = 142;

export default function TrendChart({ series }: { series: Point[] }) {
  const max = Math.max(...series.map((p) => Math.max(p.income, p.expense)), 1);
  const x = (i: number) =>
    series.length > 1 ? X0 + (i / (series.length - 1)) * (X1 - X0) : (X0 + X1) / 2;
  const y = (v: number) => Y_BASE - (v / max) * (Y_BASE - Y_TOP);
  const line = (key: "income" | "expense") =>
    series.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
  const label = (m: string) => `${Number(m.slice(5))}/${m.slice(2, 4)}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="กราฟรายรับและรายจ่ายรายเดือนย้อนหลัง"
    >
      <text x={X1} y={16} fontSize="11" textAnchor="end" fill="var(--muted)" fontFamily="var(--mono)">
        <tspan fill="#5a7d5a">— รายรับ</tspan>
        <tspan dx="12" fill="#9d5a4f">— รายจ่าย</tspan>
      </text>
      <line x1={X0} y1={Y_BASE} x2={X1} y2={Y_BASE} stroke="var(--line)" strokeWidth="1" />
      <path d={line("income")} fill="none" stroke="#5a7d5a" strokeWidth="1.8" />
      <path d={line("expense")} fill="none" stroke="#9d5a4f" strokeWidth="1.8" />
      {series.map((p, i) =>
        i % 2 === 0 ? (
          <text
            key={p.month}
            x={x(i)}
            y={H - 8}
            fontSize="10.5"
            textAnchor="middle"
            fill="var(--muted)"
            fontFamily="var(--mono)"
          >
            {label(p.month)}
          </text>
        ) : null,
      )}
    </svg>
  );
}
