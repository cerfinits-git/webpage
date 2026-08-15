// Balance-curve SVG for /algo — ported 1:1 from the inline script in
// algo.html (same data, same math), rendered declaratively instead of
// innerHTML. Pure computation, so it stays a server component.
// All paints are currentColor; the actual theme colors (--ink/--muted)
// are set on #eq in algo.css so the chart works in both themes.
const D = [
  10000, 10298, 9896, 9492, 9417, 9657, 9588, 10176, 10157, 10797, 11461, 11381, 11319, 11245,
  10816, 10389, 10277, 10229, 10517, 10457, 10065, 10008, 9961, 9918, 9528, 9784, 10074, 10024,
  9974, 10260, 10529, 10464, 10394, 10348, 10282, 10563, 10482, 10757, 10669, 10994, 10923, 11596,
  11512, 11849, 12176, 12929, 12420, 11932, 12705, 12628, 12563, 12901, 14192, 14111, 14997, 15439,
  14816, 15762, 15121, 15547, 14942, 15353, 15271, 15720, 16179, 16102, 17123, 17607, 18139, 19229,
  19794, 20389, 20988, 20873, 20795, 21384, 20546, 21879, 21734, 20884, 22239, 22881, 22693, 22595,
  21719, 23128, 24622, 25340, 24340, 24195, 23227, 23096, 22970, 22833, 23456, 24107, 23983, 23863,
  23734, 26158, 25062, 24062, 23943, 24644, 23691, 24408, 25119, 24972, 24839, 24694, 25403, 25255,
  25107, 24953, 24831, 24689, 23735, 24437, 24253, 25811, 25658, 25506, 25355, 25209, 25051, 25775,
  25622, 25476, 24428, 25325, 26067, 25902, 26664, 27418, 29177, 28003, 27802, 28612, 27437, 28250,
  28051, 28886, 29843, 30717, 30539, 31432, 31262, 32203, 34380, 35399, 36481, 37567, 36830,
];

const W = 1000;
const H = 320;
const P = { t: 14, r: 10, b: 26, l: 54 };

export default function EquityCurve() {
  const mn = Math.min(...D) * 0.99;
  const mx = Math.max(...D) * 1.01;
  const x = (i: number) => P.l + (i / (D.length - 1)) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - (v - mn) / (mx - mn)) * (H - P.t - P.b);

  let path = `M${x(0)},${y(D[0])}`;
  D.forEach((v, i) => {
    if (i) path += `L${x(i).toFixed(1)},${y(v).toFixed(1)}`;
  });
  const area = `${path}L${x(D.length - 1)},${H - P.b}L${x(0)},${H - P.b}Z`;
  const grid = [10000, 15000, 20000, 25000, 30000, 35000];

  return (
    <svg id="eq" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map((v) => (
        <g key={v}>
          <line x1={P.l} y1={y(v)} x2={W - P.r} y2={y(v)} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
          <text x={P.l - 8} y={y(v) + 4} fill="currentColor" fontSize="11" fontFamily="Geist Mono,monospace" textAnchor="end">
            {v / 1000}k
          </text>
        </g>
      ))}
      <path className="eq-area" d={area} fill="url(#gf)" />
      <path className="eq-line" pathLength={1} d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle className="eq-dot" cx={x(D.length - 1)} cy={y(D[D.length - 1])} r="4" fill="currentColor" />
    </svg>
  );
}
