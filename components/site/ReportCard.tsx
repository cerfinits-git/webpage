import Link from "next/link";
import { money, pct } from "@/lib/format";
import { qualityToStars, valuationBadge, type Tone } from "@/lib/research/dashboard";
import { T } from "@/components/site/LangContext";

// Compact, clickable stock card — shared by the /research hub grid and the
// homepage teaser. Both are retail-facing, so the card speaks the dashboard's
// language, not the analyst's: quality stars and a price-vs-value badge, kept
// on separate axes (R6), and never a buy/sell/hold verdict (R11). The report's
// own verdict wording stays on the Advanced page.
// Self-contained styling (.scard*, in site.css) so it works on any site page.
export type ReportCardData = {
  ticker: string;
  company: string;
  ev: number;
  quality: number;
  asOf: string;
  price: number;
  changePct: number | null; // null → no live quote (fall back to report price)
};

/** Existing chip palette: up / gold / down. Reused so tone needs no new CSS. */
const toneClass: Record<Tone, string> = {
  good: "v-buy",
  watch: "v-hold",
  poor: "v-sell",
};

const toneWord: Record<Tone, React.ReactNode> = {
  good: <T th="ราคาต่ำกว่ามูลค่าประมาณ" en="Price below estimate" />,
  watch: <T th="ราคาใกล้เคียงมูลค่าประมาณ" en="Price near estimate" />,
  poor: <T th="ราคาสูงกว่ามูลค่าประมาณ" en="Price above estimate" />,
};

export default function ReportCard({ d }: { d: ReportCardData }) {
  const stars = qualityToStars(d.quality);
  const badge = valuationBadge(d.ev, d.price);

  return (
    <Link href={`/research/${d.ticker.toLowerCase()}`} className="scard">
      <div className="scard-top">
        <div>
          <div className="scard-tick">{d.ticker}</div>
          <div className="scard-co">{d.company}</div>
        </div>
        <div className="scard-price">
          <span className="p">{money(d.price, "USD")}</span>
          {d.changePct !== null ? (
            <span className={`chg ${d.changePct >= 0 ? "up" : "down"}`}>{pct(d.changePct)}</span>
          ) : (
            <span className="chg muted"><T th="ณ วันจัดทำ" en="at pub date" /></span>
          )}
        </div>
      </div>

      <span className={`scard-chip ${toneClass[badge.tone]}`}>{toneWord[badge.tone]}</span>

      <div className="scard-metrics">
        <div>
          <span className="k"><T th="คุณภาพธุรกิจ" en="Quality" /></span>
          <span className="v scard-stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className={i <= stars ? "on" : "off"} aria-hidden="true">
                ★
              </span>
            ))}
          </span>
        </div>
        <div>
          <span className="k"><T th="มูลค่าประมาณ" en="Estimated value" /></span>
          <span className="v">{money(d.ev, "USD")}</span>
        </div>
        <div>
          <span className="k"><T th="เทียบราคา" en="vs price" /></span>
          <span
            className="v"
            style={{ color: badge.gap >= 0 ? "var(--up)" : "var(--down)" }}
          >
            {pct(badge.gap)}
          </span>
        </div>
      </div>

      <div className="scard-foot">
        <span><T th={`ข้อมูล ณ ${d.asOf}`} en={`as of ${d.asOf}`} /></span>
        <span className="go"><T th="ดูรายละเอียด →" en="View →" /></span>
      </div>
    </Link>
  );
}
