interface Point {
  month: string;
  income: number;
  expense: number;
}

const W = 600;
const H = 200;
const X0 = 14;
const X1 = 592;
const Y_TOP = 28;
const Y_BASE = 170;

export default function BarChart({ series }: { series: Point[] }) {
  const max = Math.max(...series.map((p) => Math.max(p.income, p.expense)), 1);
  const slot = (X1 - X0) / series.length;
  const bw = Math.min(slot * 0.32, 16);
  const y = (v: number) => Y_BASE - (v / max) * (Y_BASE - Y_TOP);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="กราฟแท่งรายรับเทียบรายจ่ายรายเดือน"
    >
      <text x={X1} y={16} fontSize="11" textAnchor="end" fill="var(--muted)" fontFamily="var(--mono)">
        <tspan fill="#5a7d5a">■ รายรับ</tspan>
        <tspan dx="12" fill="#9d5a4f">■ รายจ่าย</tspan>
      </text>
      <line x1={X0} y1={Y_BASE} x2={X1} y2={Y_BASE} stroke="var(--line)" strokeWidth="1" />
      {series.map((p, i) => {
        const cx = X0 + slot * i + slot / 2;
        return (
          <g key={p.month}>
            <rect
              x={cx - bw - 1}
              y={y(p.income)}
              width={bw}
              height={Math.max(Y_BASE - y(p.income), 0)}
              fill="#5a7d5a"
            />
            <rect
              x={cx + 1}
              y={y(p.expense)}
              width={bw}
              height={Math.max(Y_BASE - y(p.expense), 0)}
              fill="#9d5a4f"
            />
            <text
              x={cx}
              y={H - 12}
              fontSize="10.5"
              textAnchor="middle"
              fill="var(--muted)"
              fontFamily="var(--mono)"
            >
              {Number(p.month.slice(5))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
