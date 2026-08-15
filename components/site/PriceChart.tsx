// 6-month price line for the /research detail page. Pure computation → server
// component. All paints use currentColor; the actual color (green/red by period
// performance) is set on the container in research.css, so it works in both
// themes (no hardcoded colors — unlike the older EquityCurve).
const W = 1000;
const H = 200;
const P = { t: 14, r: 8, b: 14, l: 8 };

export default function PriceChart({ closes }: { closes: number[] }) {
  const mn = Math.min(...closes);
  const mx = Math.max(...closes);
  const range = mx - mn || 1;
  const x = (i: number) => P.l + (i / (closes.length - 1)) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - (v - mn) / range) * (H - P.t - P.b);

  let path = `M${x(0)},${y(closes[0])}`;
  closes.forEach((v, i) => {
    if (i) path += `L${x(i).toFixed(1)},${y(v).toFixed(1)}`;
  });
  const area = `${path}L${x(closes.length - 1).toFixed(1)},${H - P.b}L${x(0)},${H - P.b}Z`;

  return (
    <svg
      className="pc-svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="กราฟราคาย้อนหลัง 6 เดือน"
    >
      <defs>
        <linearGradient id="pcfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#pcfill)" />
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* The end marker is a zero-length round-capped stroke, not a circle:
          preserveAspectRatio="none" stretches the viewBox unevenly, which turns
          a filled circle into an egg at taller sizes. A non-scaling stroke
          stays round whatever the container's aspect ratio is. */}
      <line
        x1={x(closes.length - 1)}
        y1={y(closes[closes.length - 1])}
        x2={x(closes.length - 1)}
        y2={y(closes[closes.length - 1])}
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
