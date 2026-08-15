import type { StockReport } from "@/lib/reports";
import { money } from "@/lib/format";
import { T } from "@/components/site/LangContext";

// 2-axis sensitivity grid (Section G). Cells are scenario valuations; the fill
// diverges around the LIVE price (green above / red below), so the heatmap shows
// which scenarios sit above or below where the stock trades right now.
type S = NonNullable<StockReport["sensitivity"]>;

function cellColor(value: number, pivot: number, min: number, max: number): string {
  if (value >= pivot) {
    const t = max > pivot ? (value - pivot) / (max - pivot) : 0;
    return `color-mix(in srgb, var(--up) ${Math.round(10 + t * 52)}%, var(--card))`;
  }
  const t = pivot > min ? (pivot - value) / (pivot - min) : 0;
  return `color-mix(in srgb, var(--down) ${Math.round(10 + t * 52)}%, var(--card))`;
}

export default function SensitivityHeatmap({ s, price }: { s: S; price: number }) {
  const flat = s.grid.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);

  return (
    <div className="heatmap">
      <div className="hm-axis-y"><T th={s.rowLabel.th} en={s.rowLabel.en} /></div>
      <div className="hm-scroll">
        <table>
          <thead>
            <tr>
              <th className="hm-corner"></th>
              {s.cols.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {s.grid.map((rowVals, ri) => (
              <tr key={ri}>
                <th className="hm-rowh">{s.rows[ri]}</th>
                {rowVals.map((v, ci) => {
                  const base = ri === s.baseRow && ci === s.baseCol;
                  return (
                    <td
                      key={ci}
                      className={base ? "hm-cell base" : "hm-cell"}
                      style={{ background: cellColor(v, price, min, max) }}
                    >
                      {base ? <b>{v}</b> : v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="hm-axis"><T th={s.colLabel.th} en={s.colLabel.en} /></div>
      <p className="hm-legend">
        <span>
          <i className="up" /> <T th={`สูงกว่าราคาปัจจุบัน ${money(price, "USD")}`} en={`Above current price ${money(price, "USD")}`} />
        </span>
        <span>
          <i className="down" /> <T th="ต่ำกว่าราคาปัจจุบัน" en="Below current price" />
        </span>
      </p>
      <p className="hm-caption"><T th={s.caption.th} en={s.caption.en} /></p>
    </div>
  );
}
