import Link from "next/link";
import { T } from "@/components/site/LangContext";
import { REPORTS } from "@/lib/reports";
import { getStockQuotes } from "@/lib/quotes";
import ReportCard, { type ReportCardData } from "@/components/site/ReportCard";

// Homepage / products teaser for /research: a compact, clickable card grid
// (scales as reports are added) plus a search box that hands off to the hub.
// Server component — fetches live quotes, degrades to report price gracefully.
const MAX_CARDS = 4;

export default async function ResearchTeaser() {
  if (REPORTS.length === 0) return null;

  const featured = [...REPORTS]
    .sort((a, b) => b.asOf.localeCompare(a.asOf))
    .slice(0, MAX_CARDS);
  const quotes = await getStockQuotes(featured.map((r) => r.ticker));

  const items: ReportCardData[] = featured.map((r) => {
    const q = quotes[r.ticker.toUpperCase()];
    return {
      ticker: r.ticker,
      company: r.company,
      ev: r.valuation.ev,
      quality: r.quality,
      asOf: r.asOf,
      price: q?.price ?? r.refPrice,
      changePct: q?.changePct ?? null,
    };
  });

  return (
    <section id="research" className="research-teaser">
      <div className="wrap">
        <span className="eyebrow reveal"><T th="บทวิเคราะห์หุ้น" en="Research" /></span>
        <h2 className="section-title reveal">DEEP+O Research</h2>
        <p className="section-sub reveal">
          <T
            th="บทวิเคราะห์หุ้นเชิงลึกด้วยกรอบ DEEP+O — วัดคุณภาพธุรกิจ ตีมูลค่าแบบ 3 ฉากทัศน์ และตั้งเงื่อนไขที่วัดได้จริง โชว์ทั้งด้านที่ชนะและด้านที่เจ็บ พร้อมราคาอัปเดตสด"
            en="In-depth stock research with the DEEP+O framework — business quality, 3-scenario valuation and testable triggers. We show the wins and the pain, with live prices."
          />
        </p>

        {/* Native GET form → /research?q=... (works without JS; the hub filters). */}
        <form className="teaser-search reveal" action="/research" role="search">
          <span className="ts-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input type="search" name="q" placeholder="ค้นหาหุ้น — ticker หรือชื่อบริษัท" aria-label="ค้นหาหุ้น" />
          <button type="submit" className="btn"><T th="ค้นหา" en="Search" /></button>
        </form>

        <div className="scard-grid reveal">
          {items.map((d) => (
            <ReportCard key={d.ticker} d={d} />
          ))}
        </div>

        <div className="hero-cta reveal" style={{ marginTop: 28, marginBottom: 0 }}>
          <Link href="/research" className="btn">
            <T th="ดูบทวิเคราะห์ทั้งหมด" en="See all research" />
          </Link>
        </div>
        <p className="news-note reveal" style={{ marginTop: 16 }}>
          <T
            th="เพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน"
            en="For education only, not investment advice."
          />
        </p>
      </div>
    </section>
  );
}
