import Link from "next/link";
import { money, pct } from "@/lib/format";
import {
  qualityToStars,
  valuationBadge,
  trendLight,
  cashFlowLight,
  debtLight,
  stockTraits,
  type DashboardView,
  type HealthLight,
  type StockFundamentals,
  type Tone,
  type YearPoint,
} from "@/lib/research/dashboard";
import type { BusinessRisk, Translatable } from "@/lib/reports";
import { T } from "@/components/site/LangContext";

/**
 * The retail-facing stock view: eight modules, plain language, mobile-first.
 *
 * Deliberately absent (R11 of the pivot spec): any buy / sell / hold / wait
 * wording, and any claim about whether the stock suits the reader. The report's
 * own `verdictLabel` is analyst-facing and stays on the Advanced page.
 *
 * Modules whose data comes from the EDGAR pipeline (build order #2) render an
 * explicit pending state until it lands — never placeholder numbers (R7).
 */

function Stars({ count }: { count: number }) {
  return (
    <span className="sd-stars" aria-label={`คุณภาพธุรกิจ ${count} จาก 5 ดาว`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= count ? "on" : "off"} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

function Module({
  n,
  title,
  sub,
  children,
}: {
  n: number;
  title: React.ReactNode;
  sub?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="sd-mod">
      <header className="sd-mod-head">
        <span className="sd-mod-n">{String(n).padStart(2, "0")}</span>
        <div>
          <h2>{title}</h2>
          {sub && <p>{sub}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

const UNITS: [threshold: number, divisor: number, suffix: string][] = [
  [1e12, 1e12, "T"],
  [1e9, 1e9, "B"],
  [1e6, 1e6, "M"],
];

const compactUsd = (v: number) => {
  const abs = Math.abs(v);
  const [, divisor, suffix] = UNITS.find(([t]) => abs >= t) ?? [0, 1, ""];
  const n = Math.abs(v) / divisor;
  return `${v < 0 ? "−" : ""}$${n.toFixed(divisor === 1 ? 0 : n < 10 ? 2 : 1)}${suffix}`;
};

/**
 * Five reported years, one row each: year, value, bar.
 *
 * Horizontal rather than vertical — five columns of floating value labels
 * collided with each other and with the bars in a narrow column, and rows read
 * top-to-bottom on a phone anyway.
 *
 * Bars grow from zero, and zero sits wherever the data puts it: with a negative
 * year in the series the axis moves inward and losses extend left, so Amazon's
 * negative free cash flow reads as a loss rather than as a short win.
 */
function YearBars({
  series,
  format,
}: {
  series: YearPoint[];
  format: (v: number) => string;
}) {
  if (series.length < 2) return null;

  const values = series.map((p) => p.value);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const span = max - min || 1;
  const zeroPct = ((0 - min) / span) * 100;
  const hasNegative = min < 0;

  return (
    <div className="sd-bars">
      {series.map((p) => {
        const size = (Math.abs(p.value) / span) * 100;
        const negative = p.value < 0;
        return (
          <div className="sd-bar" key={p.fiscalYear}>
            <span className="sd-bar-y">{p.fiscalYear}</span>
            <span className={`sd-bar-v${negative ? " is-neg" : ""}`}>{format(p.value)}</span>
            <span className="sd-bar-track">
              {hasNegative && <i className="sd-bar-zero" style={{ left: `${zeroPct}%` }} />}
              <i
                className={negative ? "is-neg" : "is-pos"}
                style={{
                  left: `${negative ? zeroPct - size : zeroPct}%`,
                  width: `${Math.max(size, 0.6)}%`,
                }}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Shown where the data pipeline has not filled a module yet. */
function Pending({ what }: { what: React.ReactNode }) {
  return (
    <div className="sd-pending">
      <span className="sd-pending-tag">
        <T th="ยังไม่มีข้อมูล" en="No data yet" />
      </span>
      <p>{what}</p>
    </div>
  );
}

function Light({ label, light }: { label: React.ReactNode; light: HealthLight | null }) {
  if (!light) {
    return (
      <div className="sd-light is-empty">
        <span className="sd-light-k">{label}</span>
        <span className="sd-light-v">—</span>
      </div>
    );
  }
  const word: Record<Tone, React.ReactNode> = {
    good: <T th="ดี" en="Good" />,
    watch: <T th="เฝ้าระวัง" en="Watch" />,
    poor: <T th="น่ากังวล" en="Concerning" />,
  };
  return (
    <details className={`sd-light tone-${light.tone}`}>
      <summary>
        <span className="sd-light-k">{label}</span>
        <span className="sd-light-v">
          <i className="sd-dot" aria-hidden="true" />
          {word[light.tone]}
        </span>
      </summary>
      <div className="sd-light-why">
        <p className="sd-rule">{light.rule}</p>
        <ul>
          {light.evidence.map((e) => (
            <li key={e.label}>
              <span>{e.label}</span>
              <b>{e.value}</b>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

/** Plain-language label for the risk category, so the tag means something. */
const RISK_KIND: Record<BusinessRisk["kind"], Translatable> = {
  concentration: { th: "การกระจุกตัว", en: "Concentration" },
  regulation: { th: "กฎระเบียบ", en: "Regulation" },
  competition: { th: "การแข่งขัน", en: "Competition" },
  execution: { th: "การดำเนินงาน", en: "Execution" },
  cyclical: { th: "วัฏจักรเศรษฐกิจ", en: "Economic cycle" },
  financial: { th: "ฐานะการเงิน", en: "Finances" },
};

export default function StockDashboard({
  view,
  price,
  changePct,
  fundamentals,
  closes,
}: {
  view: DashboardView;
  price: number;
  changePct: number | null;
  fundamentals: StockFundamentals | null;
  closes: number[] | null;
}) {
  const traits = fundamentals ? stockTraits(fundamentals, closes) : [];
  const stars = qualityToStars(view.quality);
  const badge = valuationBadge(view.estimate, price);

  // `gap` measures the estimate against the current price, so the prose has to
  // say it in that direction. Describing it as "the price is X% above the
  // estimate" would be a different quantity on a different base.
  const gapSize = `${(Math.abs(badge.gap) * 100).toFixed(1)}%`;

  // Trailing yield from the last declared dividend per share against the live
  // price, and market cap from the latest annual share count. The share count
  // is a weighted average for the year rather than today's figure, so the cap
  // is approximate — close enough to convey size, which is all it is for.
  const lastDps = fundamentals?.dividendPerShare.at(-1)?.value ?? null;
  const dividendYield = lastDps != null && price > 0 ? lastDps / price : null;
  const marketCap =
    fundamentals?.sharesOutstanding != null && price > 0
      ? fundamentals.sharesOutstanding * price
      : null;

  const badgeWord: Record<Tone, React.ReactNode> = {
    good: <T th="ราคาต่ำกว่ามูลค่าประมาณ" en="Price below estimate" />,
    watch: <T th="ราคาใกล้เคียงมูลค่าประมาณ" en="Price near estimate" />,
    poor: <T th="ราคาสูงกว่ามูลค่าประมาณ" en="Price above estimate" />,
  };

  return (
    <div className="sd">
      {/* 01 — Overview */}
      <section className="sd-hero">
        <Link href="/research" className="back-link">
          ← <T th="หุ้นทั้งหมด" en="All stocks" />
        </Link>

        <div className="sd-id">
          <h1>{view.ticker}</h1>
          <p>
            {view.company} · {view.exchange}
          </p>
        </div>

        <div className="sd-price">
          <span className="sd-p">{money(price, "USD")}</span>
          {changePct !== null && (
            <span className={`sd-chg ${changePct >= 0 ? "up" : "down"}`}>
              {pct(changePct)} <T th="วันนี้" en="today" />
            </span>
          )}
        </div>

        <div className="sd-axes">
          <div className="sd-axis">
            <span className="sd-axis-k">
              <T th="คุณภาพธุรกิจ" en="Business quality" />
            </span>
            <Stars count={stars} />
          </div>
          <div className={`sd-axis tone-${badge.tone}`}>
            <span className="sd-axis-k">
              <T th="ราคาเทียบมูลค่า" en="Price vs value" />
            </span>
            <span className="sd-axis-v">
              <i className="sd-dot" aria-hidden="true" />
              {badgeWord[badge.tone]}
              {badge.tone !== "watch" && <b>{gapSize}</b>}
            </span>
          </div>
        </div>

        <p className="sd-axes-note">
          <T
            th="สองอย่างนี้แยกกัน — ธุรกิจดีไม่ได้แปลว่าราคาตอนนี้คุ้ม และธุรกิจธรรมดาก็อาจราคาถูกได้"
            en="These are separate — a good business is not automatically a good price, and an ordinary one can still be cheap."
          />
        </p>

        <dl className="sd-facts">
          <div>
            <dt>
              <T th="มูลค่าตลาด" en="Market cap" />
            </dt>
            <dd>{marketCap != null ? `≈ ${compactUsd(marketCap)}` : "—"}</dd>
          </div>
          <div>
            <dt>
              <T th="อุตสาหกรรม" en="Industry" />
            </dt>
            <dd>{fundamentals?.industry ?? "—"}</dd>
          </div>
          <div>
            <dt>
              <T th="ปันผล" en="Dividend yield" />
            </dt>
            <dd>{dividendYield != null ? `${(dividendYield * 100).toFixed(2)}%` : "—"}</dd>
          </div>
        </dl>
      </section>

      {/* 02 — Business summary */}
      <Module
        n={2}
        title={<T th="บริษัทนี้ทำอะไร" en="What the company does" />}
        sub={<T th="สรุปธุรกิจ รายได้มาจากไหน จุดแข็ง จุดอ่อน" en="The business, its revenue, strengths and weaknesses" />}
      >
        {view.business ? (
          <div className="sd-biz">
            <p className="sd-biz-lead">
              <T th={view.business.whatItDoes.th} en={view.business.whatItDoes.en} />
            </p>

            <h3><T th="รายได้มาจากไหน" en="Where the revenue comes from" /></h3>
            <div className="sd-mix">
              {view.business.revenueMix.map((m) => (
                <div className="sd-mix-row" key={m.label.th}>
                  <span className="sd-mix-k"><T th={m.label.th} en={m.label.en} /></span>
                  <span className="sd-mix-bar">
                    <i style={{ width: `${Math.max(m.sharePct, 1)}%` }} />
                  </span>
                  <span className="sd-mix-v">{m.sharePct}%</span>
                </div>
              ))}
            </div>

            <h3><T th="อะไรที่ทำให้คู่แข่งแย่งธุรกิจไปไม่ได้ง่าย ๆ" en="What keeps competitors out" /></h3>
            <p className="sd-biz-p">
              <T th={view.business.moat.th} en={view.business.moat.en} />
            </p>

            <div className="sd-swot">
              <div>
                <h3><T th="จุดแข็ง" en="Strengths" /></h3>
                <ul>
                  {view.business.strengths.map((s) => (
                    <li key={s.th}><T th={s.th} en={s.en} /></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3><T th="จุดอ่อน" en="Weaknesses" /></h3>
                <ul>
                  {view.business.weaknesses.map((s) => (
                    <li key={s.th}><T th={s.th} en={s.en} /></li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="sd-src">
              <T th="คู่แข่งหลัก" en="Main competitors" />: {view.business.competitors.join(" · ")}
            </p>
          </div>
        ) : (
          <Pending
            what={
              <T
                th="คำอธิบายภาษาไทยจะมาจากรายงาน DEEP+O ที่เรียบเรียงใหม่และผ่านการตรวจแล้ว"
                en="A plain-Thai summary rewritten from the reviewed DEEP+O report."
              />
            }
          />
        )}
      </Module>

      {/* 03 — Financial health */}
      <Module
        n={3}
        title={<T th="สุขภาพการเงิน" en="Financial health" />}
        sub={<T th="แตะแต่ละหัวข้อเพื่อดูว่าตัดสินจากตัวเลขอะไร" en="Tap any row to see the figures behind it" />}
      >
        {fundamentals ? (
          <div className="sd-lights">
            <Light label={<T th="รายได้" en="Revenue" />} light={trendLight(fundamentals.revenue, compactUsd)} />
            <Light label={<T th="กำไรสุทธิ" en="Net profit" />} light={trendLight(fundamentals.netProfit, compactUsd)} />
            <Light label={<T th="กระแสเงินสด" en="Cash flow" />} light={cashFlowLight(fundamentals.freeCashFlow, compactUsd)} />
            <Light label={<T th="หนี้สิน" en="Debt" />} light={debtLight(fundamentals.netDebt, fundamentals.operatingCashFlow, compactUsd)} />
          </div>
        ) : (
          <Pending
            what={
              <T
                th="ไฟสถานะคำนวณจากงบการเงินที่ยื่นต่อ SEC — รอ pipeline ดึงข้อมูล"
                en="These indicators are computed from SEC filings — awaiting the data pipeline."
              />
            }
          />
        )}
      </Module>

      {/* 04 — Valuation */}
      <Module
        n={4}
        title={<T th="ราคาตอนนี้เทียบกับมูลค่า" en="Price against value" />}
        sub={<T th="มูลค่าประมาณจากแบบจำลอง DEEP+O ไม่ใช่ราคาเป้าหมาย" en="A modelled estimate from DEEP+O — not a price target" />}
      >
        <div className="sd-val">
          <div className="sd-val-cell">
            <span>
              <T th="ราคาปัจจุบัน" en="Current price" />
            </span>
            <b>{money(price, "USD")}</b>
          </div>
          <div className="sd-val-cell">
            <span>
              <T th="มูลค่าประมาณ" en="Estimated value" />
            </span>
            <b>{money(view.estimate, "USD")}</b>
          </div>
          <div className={`sd-val-cell tone-${badge.tone}`}>
            <span>
              <T th="มูลค่าประมาณเทียบราคา" en="Estimate vs price" />
            </span>
            <b>{pct(badge.gap)}</b>
          </div>
        </div>
        <p className="sd-val-say">
          {badge.tone === "good" && (
            <T
              th={`มูลค่าที่แบบจำลองประเมินไว้สูงกว่าราคาปัจจุบันประมาณ ${gapSize}`}
              en={`The modelled estimate sits about ${gapSize} above the current price.`}
            />
          )}
          {badge.tone === "watch" && (
            <T
              th="มูลค่าที่แบบจำลองประเมินไว้ใกล้เคียงกับราคาปัจจุบัน"
              en="The modelled estimate sits close to the current price."
            />
          )}
          {badge.tone === "poor" && (
            <T
              th={`มูลค่าที่แบบจำลองประเมินไว้ต่ำกว่าราคาปัจจุบันประมาณ ${gapSize}`}
              en={`The modelled estimate sits about ${gapSize} below the current price.`}
            />
          )}
        </p>
        <Link href="/research/methodology" className="sd-method">
          <T th="วิธีคำนวณมูลค่า" en="How this is calculated" /> →
        </Link>
      </Module>

      {/* 05 — Growth */}
      <Module
        n={5}
        title={<T th="การเติบโต 5 ปี" en="Five-year growth" />}
        sub={<T th="รายได้ · กำไรต่อหุ้น · กระแสเงินสดอิสระ" en="Revenue · EPS · Free cash flow" />}
      >
        {fundamentals ? (
          <div className="sd-growth">
            <div className="sd-growth-row">
              <h3><T th="รายได้" en="Revenue" /></h3>
              <YearBars series={fundamentals.revenue} format={compactUsd} />
            </div>
            <div className="sd-growth-row">
              <h3><T th="กำไรต่อหุ้น" en="Earnings per share" /></h3>
              <YearBars series={fundamentals.eps} format={(v) => `$${v.toFixed(2)}`} />
            </div>
            <div className="sd-growth-row">
              <h3><T th="กระแสเงินสดอิสระ" en="Free cash flow" /></h3>
              <YearBars series={fundamentals.freeCashFlow} format={compactUsd} />
            </div>
            <p className="sd-src">
              <T
                th="ตัวเลขทั้งหมดมาจากงบที่ยื่นต่อ SEC — ไม่มีการประมาณการ"
                en="All figures come from SEC filings — nothing is estimated."
              />
            </p>
          </div>
        ) : (
          <Pending
            what={
              <T
                th="กราฟทุกเส้นจะเป็นตัวเลขจริงจากงบที่ยื่นต่อ SEC เท่านั้น"
                en="Every line will be actual reported figures from SEC filings."
              />
            }
          />
        )}
      </Module>

      {/* 06 — Dividend */}
      <Module
        n={6}
        title={<T th="เงินปันผล" en="Dividend" />}
        sub={<T th="อัตราปันผล 5 ปี · สัดส่วนการจ่าย · ประวัติ" en="Five-year yield · payout ratio · history" />}
      >
        {fundamentals && fundamentals.dividendPerShare.length > 0 ? (
          <div className="sd-growth">
            <div className="sd-val">
              <div className="sd-val-cell">
                <span><T th="อัตราปันผล (ย้อนหลัง)" en="Trailing yield" /></span>
                <b>{dividendYield != null ? `${(dividendYield * 100).toFixed(2)}%` : "—"}</b>
              </div>
              <div className="sd-val-cell">
                <span><T th="สัดส่วนจ่ายจากกำไร" en="Payout ratio" /></span>
                <b>
                  {fundamentals.payoutRatio != null
                    ? `${(fundamentals.payoutRatio * 100).toFixed(0)}%`
                    : "—"}
                </b>
              </div>
            </div>
            <div className="sd-growth-row">
              <h3><T th="ปันผลต่อหุ้น 5 ปี" en="Dividend per share, five years" /></h3>
              <YearBars
                series={fundamentals.dividendPerShare}
                format={(v) => `$${v.toFixed(2)}`}
              />
            </div>
          </div>
        ) : fundamentals ? (
          <p className="sd-val-say">
            <T th="บริษัทนี้ไม่จ่ายเงินปันผล" en="This company pays no dividend." />
          </p>
        ) : (
          <Pending
            what={<T th="รอข้อมูลปันผลจาก pipeline" en="Awaiting dividend data from the pipeline." />}
          />
        )}
      </Module>

      {/* 07 — Risks */}
      <Module
        n={7}
        title={<T th="ความเสี่ยง" en="Risks" />}
        sub={<T th="สิ่งที่อาจทำให้เรื่องนี้ไม่เป็นไปตามคาด" en="What could go wrong with this story" />}
      >
        {view.businessRisks?.length ? (
          <div className="sd-risks">
            {view.businessRisks.map((r) => (
              <div className="sd-risk" key={r.risk.th}>
                <span className="sd-risk-kind">
                  <T th={RISK_KIND[r.kind].th} en={RISK_KIND[r.kind].en} />
                </span>
                <b><T th={r.risk.th} en={r.risk.en} /></b>
                <p><T th={r.why.th} en={r.why.en} /></p>
              </div>
            ))}
          </div>
        ) : (
          <Pending
            what={
              <T
                th="สรุปความเสี่ยงภาษาไทยจากรายงานที่ตรวจแล้ว"
                en="A plain-Thai risk summary drawn from the reviewed report."
              />
            }
          />
        )}
      </Module>

      {/* 08 — Stock profile (descriptive only — never suitability, per R11) */}
      <Module
        n={8}
        title={<T th="ลักษณะของหุ้นตัวนี้" en="What kind of stock this is" />}
        sub={<T th="คำอธิบายลักษณะ ไม่ใช่คำแนะนำว่าเหมาะกับใคร" en="A description of the stock, not a recommendation" />}
      >
        {traits.length > 0 ? (
          <div className="sd-traits">
            {traits.map((t) => (
              <div className="sd-trait" key={t.label.th}>
                <b><T th={t.label.th} en={t.label.en} /></b>
                <span>{t.detail}</span>
              </div>
            ))}
          </div>
        ) : (
          <Pending
            what={
              <T
                th="เช่น เติบโตสูง · ผันผวนสูง · จ่ายปันผลสม่ำเสมอ — สรุปจากตัวเลขจริงเมื่อ pipeline พร้อม"
                en="For example: high growth · volatile · steady dividend — derived from reported figures once the pipeline lands."
              />
            }
          />
        )}
      </Module>

      <footer className="sd-foot">
        <p className="sd-asof">
          <T
            th={`ข้อมูลวิเคราะห์ ณ ${view.asOf}`}
            en={`Analysis as of ${view.asOf}`}
          />
          {fundamentals && ` · ${fundamentals.period}`}
        </p>
        <p className="sd-disclaimer">
          <T
            th="เพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · ข้อมูลอาจล่าช้าหรือคลาดเคลื่อน · การลงทุนมีความเสี่ยง ผู้ลงทุนควรตัดสินใจด้วยตนเอง"
            en="For education only, not investment advice · Data may be delayed or inaccurate · Investing carries risk; decisions are your own."
          />
        </p>
        <Link href={`/research/${view.ticker.toLowerCase()}/advanced`} className="sd-adv">
          <T th="ดูบทวิเคราะห์ฉบับเต็ม (สำหรับผู้ที่ต้องการเจาะลึก)" en="Full analyst report (for deeper reading)" /> →
        </Link>
      </footer>
    </div>
  );
}
