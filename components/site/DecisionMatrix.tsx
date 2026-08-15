// DEEP+O Decision Matrix (Section 5) — the framework's fixed decision rule:
// Quality tier × Valuation verdict → action. The current stock's cell is boxed.
import { T } from "@/components/site/LangContext";
import type { Translatable } from "@/lib/reports";

type Cell = { t: Translatable; c: "buy" | "hold" | "sell" };

const COLS = [
  { th: "Undervalued (≥1.25)", en: "Undervalued (≥1.25)" },
  { th: "Fair", en: "Fair" },
  { th: "Overvalued (≤0.80)", en: "Overvalued (≤0.80)" },
];

const ROWS: { tier: Translatable; cells: Cell[] }[] = [
  {
    tier: { th: "สูง (≥70)", en: "High (≥70)" },
    cells: [
      { t: { th: "ซื้อเพิ่ม", en: "Buy More" }, c: "buy" },
      { t: { th: "ถือ / รอจังหวะ", en: "Hold / Wait" }, c: "hold" },
      { t: { th: "ห้ามเพิ่ม", en: "Do Not Add" }, c: "hold" },
    ],
  },
  {
    tier: { th: "กลาง (45–69)", en: "Med (45–69)" },
    cells: [
      { t: { th: "เช็ค value trap", en: "Check Value Trap" }, c: "hold" },
      { t: { th: "ถือ", en: "Hold" }, c: "hold" },
      { t: { th: "ลด", en: "Trim" }, c: "sell" },
    ],
  },
  {
    tier: { th: "ต่ำ (<45)", en: "Low (<45)" },
    cells: [
      { t: { th: "สงสัย value trap", en: "Suspect Value Trap" }, c: "sell" },
      { t: { th: "ขาย", en: "Sell" }, c: "sell" },
      { t: { th: "ขาย", en: "Sell" }, c: "sell" },
    ],
  },
];

const dotColor = (c: Cell["c"]) =>
  c === "buy" ? "var(--up)" : c === "hold" ? "var(--gold)" : "var(--down)";

const qualityRow = (q: number) => (q >= 70 ? 0 : q >= 45 ? 1 : 2);
const valuationCol = (word: string) => {
  const w = word.toLowerCase();
  if (w.includes("under")) return 0;
  if (w.includes("over")) return 2;
  return 1;
};

export default function DecisionMatrix({
  quality,
  verdictWord,
  ticker,
}: {
  quality: number;
  verdictWord: Translatable;
  ticker: string;
}) {
  const activeRow = qualityRow(quality);
  // Use English word for internal routing
  const activeCol = valuationCol(verdictWord.en);

  return (
    <div className="dmatrix">
      <table>
        <thead>
          <tr>
            <th className="corner">Quality \ Valuation</th>
            {COLS.map((c, i) => (
              <th key={i}><T th={c.th} en={c.en} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, ri) => (
            <tr key={ri}>
              <th className="rowh">
                <T th={row.tier.th} en={row.tier.en} />
                {ri === activeRow && (
                  <span className="here">
                    {" "}
                    ← {ticker} {quality}
                  </span>
                )}
              </th>
              {row.cells.map((cell, ci) => {
                const active = ri === activeRow && ci === activeCol;
                return (
                  <td key={ci} className={active ? "cell active" : "cell"}>
                    <span className="dot" style={{ background: dotColor(cell.c) }} />
                    {active ? <b>→ <T th={cell.t.th} en={cell.t.en} /> ←</b> : <T th={cell.t.th} en={cell.t.en} />}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
