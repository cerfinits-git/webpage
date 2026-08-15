import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { REPORTS, getReport, upsideVs } from "@/lib/reports";
import { getStockQuotes } from "@/lib/quotes";
import { getPriceHistory } from "@/lib/history";
import { money, pct } from "@/lib/format";
import VerdictIcon from "@/components/site/VerdictIcon";
import PriceChart from "@/components/site/PriceChart";
import PrintButton from "@/components/site/PrintButton";
import DecisionMatrix from "@/components/site/DecisionMatrix";
import SensitivityHeatmap from "@/components/site/SensitivityHeatmap";
import { T } from "@/components/site/LangContext";

export const revalidate = 300;

export function generateStaticParams() {
  return REPORTS.map((r) => ({ ticker: r.ticker.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const { ticker } = await params;
  const r = getReport(ticker);
  if (!r) return { title: "ไม่พบบทวิเคราะห์ | Cerfinits" };
  const title = `${r.ticker} (${r.company}) — บทวิเคราะห์ฉบับเต็ม DEEP+O | Cerfinits`;
  const desc = `${r.verdictLabel.th} · Quality ${r.quality}/100 · Fair Value E[V] ${money(
    r.valuation.ev,
    "USD",
  )} · ${r.thesisOneSentence.th.slice(0, 110)}…`;
  const path = `/research/${r.ticker.toLowerCase()}/advanced`;
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      siteName: "Cerfinits",
      title,
      description: desc,
      type: "article",
      url: path,
      locale: "th_TH",
      images: [{ url: "/og-cover.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, images: ["/og-cover.png"] },
  };
}

export default async function ReportDetail({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const r = getReport(ticker);
  if (!r) notFound();

  const [quotes, history] = await Promise.all([
    getStockQuotes([r.ticker]),
    getPriceHistory(r.ticker),
  ]);
  const q = quotes[r.ticker.toUpperCase()];
  const price = q?.price ?? r.refPrice;

  const periodChange =
    history && history.closes.length > 1
      ? history.closes[history.closes.length - 1] / history.closes[0] - 1
      : null;
  const chartUp = (periodChange ?? 0) >= 0;
  const startLabel = history
    ? new Date(history.startMs).toLocaleDateString("th-TH", { month: "short", year: "2-digit" })
    : "";

  const { bear, base, bull, ev, trigger } = r.valuation;
  const span = bull - bear || 1;
  const posPct = (v: number) => Math.max(0, Math.min(100, ((v - bear) / span) * 100));
  const upside = upsideVs(ev, price);
  const toTrigger = trigger / price - 1; // drop from current price to reach trigger; <0 = still above

  const verdictColor =
    r.verdict === "buy" || r.verdict === "accumulate"
      ? "var(--up)"
      : r.verdict === "hold"
        ? "var(--gold)"
        : "var(--down)";

  return (
    <>
      <section className="detail-head">
        <div className="wrap">
          <Link href={`/research/${r.ticker.toLowerCase()}`} className="back-link">
            ← <T th={`กลับไปหน้าสรุป ${r.ticker}`} en={`Back to the ${r.ticker} summary`} />
          </Link>
          <div className="dh-row">
            <div>
              {/* The ticker is the page's heading. It used to be a plain div,
                  which left the page with no h1 at all — the first heading was
                  an h4 deep in the body, so assistive tech had no outline to
                  follow and search engines had no stated subject. */}
              <h1 className="dh-tick">
                {r.ticker}
                <span className="sr-only">
                  {" "}— {r.company} <T th="บทวิเคราะห์ฉบับเต็ม DEEP+O" en="full DEEP+O analysis" />
                </span>
              </h1>
              <div className="dh-co">
                {r.company} · {r.exchange}
              </div>
            </div>
            <div className="dh-price">
              <span className="p">{money(price, "USD")}</span>
              {q ? (
                <span className={`chg ${q.changePct >= 0 ? "up" : "down"}`}>
                  {pct(q.changePct)} <T th="วันนี้" en="Today" />
                </span>
              ) : (
                <span className="chg" style={{ color: "var(--muted)" }}>
                  <T th="ราคา ณ วันจัดทำ" en="Price at report date" />
                </span>
              )}
              <span className="asof">
                <T th={`รายงาน as-of ${r.asOf} · ราคาอ้างอิง ${money(r.refPrice, "USD")}`} en={`Report as of ${r.asOf} · Ref Price ${money(r.refPrice, "USD")}`} />
              </span>
            </div>
          </div>

          {/* The icon carries the verdict colour on its own; tinting the label
              too made this band the loudest thing on a page of hairlines. */}
          <div className="verdict-banner">
            <span className="vb-icon" style={{ color: verdictColor }}>
              <VerdictIcon verdict={r.verdict} size={15} />
            </span>
            <span className="vb-label">
              <T th={r.verdictLabel.th} en={r.verdictLabel.en} />
            </span>
            <div className="vb-tags">
              <span className="vb-tag">
                Quality <b>{r.quality}/100</b>
              </span>
              <span className="vb-tag">
                Valuation <b><T th={r.valuation.verdictWord.th} en={r.valuation.verdictWord.en} /></b>
              </span>
              <span className="vb-tag">
                Confidence <b>{r.confidence}/5</b>
              </span>
              <span className="vb-tag">
                Uncertainty <b>{r.uncertainty}</b>
              </span>
            </div>
          </div>

          {/* Price chart */}
          <div className="pricepanel">
            <div className="pp-head">
              <span className="pp-title">
                <T th="ราคาย้อนหลัง 6 เดือน" en="Past 6 Months Price" />
                {periodChange !== null && (
                  <>
                    {" · "}
                    <b className={chartUp ? "up" : "down"}>{pct(periodChange)}</b>
                  </>
                )}
              </span>
            </div>
            {history ? (
              <>
                <div className={`pc-wrap ${chartUp ? "up" : "down"}`}>
                  <PriceChart closes={history.closes} />
                </div>
                <div className="pp-axis">
                  <span>{startLabel}</span>
                  <span>
                    {money(price, "USD")} · <T th="วันนี้" en="Today" />
                  </span>
                </div>
              </>
            ) : (
              <p className="pp-none">
                <T th="โหลดกราฟราคาไม่สำเร็จชั่วคราว — ลองรีเฟรชอีกครั้ง" en="Temporarily failed to load price chart — try refreshing again" />
              </p>
            )}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 8 }}>
        <div className="wrap">
          {/* The One Question */}
          <div className="rblock">
            <span className="lbl">The One Question — <T th="คำถามข้อเดียวที่ตัดสินหุ้นตัวนี้" en="The single question defining this stock" /></span>
            <p className="oneq"><T th={r.oneQuestion.th} en={r.oneQuestion.en} /></p>
          </div>

          {/* Thesis */}
          <div className="rblock">
            <span className="lbl">Thesis in One Sentence</span>
            <p className="thesis-1"><T th={r.thesisOneSentence.th} en={r.thesisOneSentence.en} /></p>
          </div>

          {/* Football field */}
          <div className="rblock">
            <span className="lbl">Valuation — <T th="3 ฉากทัศน์ (Damodaran style)" en="3 Scenarios (Damodaran style)" /></span>
            <div className="ff">
              <div className="ff-track">
                <div className="ff-tick ev" style={{ left: `${posPct(ev)}%` }} />
                <div className="ff-tick trigger" style={{ left: `${posPct(trigger)}%` }} />
                <div className="ff-tick price" style={{ left: `${posPct(price)}%` }} />
              </div>
              <div className="ff-scale">
                <span>
                  Bear {money(bear, "USD")} · {(r.valuation.bearP * 100).toFixed(0)}%
                </span>
                <span>
                  Base {money(base, "USD")} · {(r.valuation.baseP * 100).toFixed(0)}%
                </span>
                <span>
                  Bull {money(bull, "USD")} · {(r.valuation.bullP * 100).toFixed(0)}%
                </span>
              </div>
              <div className="ff-legend">
                <span className="lg ev">
                  <i />
                  <span className="k">E[V]</span> {money(ev, "USD")}
                </span>
                <span className="lg price">
                  <i />
                  <span className="k"><T th="ราคาตอนนี้" en="Current Price" /></span> {money(price, "USD")}
                </span>
                <span className="lg trigger">
                  <i />
                  <span className="k">Trigger</span> {money(trigger, "USD")}
                </span>
              </div>
              <p className="ff-upside">
                E[V]/P ={" "}
                <b style={{ color: upside >= 0 ? "var(--up)" : "var(--down)" }}>{(ev / price).toFixed(2)}</b> ·
                Upside <b style={{ color: upside >= 0 ? "var(--up)" : "var(--down)" }}>{pct(upside)}</b>
                {toTrigger < 0 ? (
                  <>
                    {" "}
                    · <T th="ต้องลงอีก" en="Needs to drop" />{" "}
                    <b style={{ color: "var(--up)" }}>{pct(toTrigger)}</b> <T th="ถึงจะแตะ Trigger" en="to hit Trigger" />
                  </>
                ) : (
                  <>
                    {" "}
                    · <b style={{ color: "var(--up)" }}><T th="อยู่ต่ำกว่า Trigger แล้ว" en="Currently below Trigger" /></b>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Decision Matrix */}
          <div className="rblock">
            <span className="lbl">Decision Matrix — <T th="ตัวตัดสินเดียวของรายงาน" en="The sole decider of the report" /></span>
            <DecisionMatrix quality={r.quality} verdictWord={r.valuation.verdictWord} ticker={r.ticker} />
          </div>

          {/* Sensitivity */}
          {r.sensitivity && (
            <div className="rblock">
              <span className="lbl">Sensitivity — <T th="มูลค่าตามสองแกนของ One Question" en="Value based on the two axes of One Question" /></span>
              <SensitivityHeatmap s={r.sensitivity} price={price} />
            </div>
          )}

          {/* Variant Perception */}
          <div className="rblock">
            <span className="lbl">Variant Perception — <T th="จุดที่เราคิดต่างจากตลาด" en="Where we differ from the market" /></span>
            <div className="variant-grid">
              <div className="variant-col market">
                <h4><T th="ตลาดเชื่ออะไร" en="What the market believes" /></h4>
                <p><T th={r.variant.market.th} en={r.variant.market.en} /></p>
              </div>
              <div className="variant-col us">
                <h4><T th="เราเชื่อต่างตรงไหน" en="Where we differ" /></h4>
                <p><T th={r.variant.us.th} en={r.variant.us.en} /></p>
              </div>
            </div>
          </div>

          {/* Thesis Killers */}
          <div className="rblock">
            <span className="lbl">Thesis Killers — <T th="เกิดแล้ว exit ทันที" en="If occurs, exit immediately" /></span>
            <div className="killers">
              <ul>
                {r.killers.map((k, i) => (
                  <li key={i}>
                    <span className="n">{String(i + 1).padStart(2, "0")}</span>
                    <span><T th={k.th} en={k.en} /></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Catalysts */}
          <div className="rblock">
            <span className="lbl">Catalysts Map (12–24 <T th="เดือน" en="Months" />)</span>
            {r.catalysts.map((c, i) => (
              <div className="cat-row" key={i}>
                <span className="cat-when"><T th={c.when.th} en={c.when.en} /></span>
                <span className="cat-what"><T th={c.what.th} en={c.what.en} /></span>
              </div>
            ))}
          </div>

          {/* Return math */}
          <div className="rblock">
            <span className="lbl">Return Math — <T th="ผลตอบแทนคาดหวัง (3 ปี)" en="Expected Returns (3 Years)" /></span>
            <div className="ret-grid">
              <div className="ret">
                <div className="v" style={{ color: "var(--muted)" }}>
                  {r.returnMath.floorPct}
                  <span style={{ fontSize: 14 }}>/<T th="ปี" en="yr" /></span>
                </div>
                <div className="k">Floor (static)</div>
              </div>
              <div className="ret">
                <div className="v" style={{ color: "var(--up)" }}>
                  {r.returnMath.onTrackPct}
                  <span style={{ fontSize: 14 }}>/<T th="ปี" en="yr" /></span>
                </div>
                <div className="k">On-track (Base <T th="เดินตามแผน" en="on track" />)</div>
              </div>
            </div>
            <p className="ret-note"><T th={r.returnMath.note.th} en={r.returnMath.note.en} /></p>
          </div>

          {/* One-pager */}
          <div className="rblock">
            <span className="lbl">One-Pager — <T th="สรุปเป็นเรื่องเดียว" en="Summarized into one story" /></span>
            <p className="onepager"><T th={r.onePager.th} en={r.onePager.en} /></p>
          </div>

          {/* Sources */}
          <div className="rblock">
            <span className="lbl"><T th="แหล่งอ้างอิง" en="References" /></span>
            <ul className="sources">
              {r.sources.map((s, i) => (
                <li key={i}>
                  <a href={s.url} target="_blank" rel="noopener">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="disclaimer">
            <T 
              th={<><b>เพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน</b> — บทวิเคราะห์นี้เป็นความเห็นส่วนตัวจากกรอบ DEEP+O ณ วันที่ {r.asOf} ราคาและปัจจัยพื้นฐานเปลี่ยนแปลงได้ตลอดเวลา ตัวเลขวิเคราะห์ทั้งหมด freeze ณ วันจัดทำ (ยกเว้นราคาที่อัปเดตสด) การลงทุนมีความเสี่ยง ผู้ลงทุนควรศึกษาข้อมูลและตัดสินใจด้วยตนเอง Cerfinits เป็นผู้จัดทำคอนเทนต์เพื่อการศึกษา ไม่ใช่ที่ปรึกษาการลงทุนที่ได้รับอนุญาต และไม่รับประกันผลตอบแทนใด ๆ</>} 
              en={<><b>For educational purposes only, not investment advice.</b> — This analysis is a personal opinion based on the DEEP+O framework as of {r.asOf}. Prices and fundamentals change over time. All analyzed figures are frozen on the report date (except for live updated prices). Investing involves risks. Investors should conduct their own research and make their own decisions. Cerfinits provides educational content, is not a licensed investment advisor, and guarantees no returns whatsoever.</>} 
            />
          </p>

          {/* Report download — bottom of page */}
          <div className="report-download">
            {r.pdfUrl ? (
              <a href={r.pdfUrl} download className="btn">
                ↓ <T th="ดาวน์โหลด Report ฉบับเต็ม (PDF)" en="Download Full Report (PDF)" />
              </a>
            ) : (
              <PrintButton className="btn" label={<T th="↓ บันทึกรายงานเป็น PDF" en="↓ Save Report as PDF" />} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
