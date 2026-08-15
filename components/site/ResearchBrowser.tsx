"use client";

import { useState } from "react";
import Link from "next/link";
import { money, pct } from "@/lib/format";
import { qualityToStars, valuationBadge, type Tone } from "@/lib/research/dashboard";
import type { ReportCardData } from "./ReportCard";
import { T, useLang } from "./LangContext";

/** Existing chip palette: up / gold / down. */
const toneClass: Record<Tone, string> = { good: "v-buy", watch: "v-hold", poor: "v-sell" };

const toneWord: Record<Tone, React.ReactNode> = {
  good: <T th="ต่ำกว่ามูลค่า" en="Below estimate" />,
  watch: <T th="ใกล้เคียงมูลค่า" en="Near estimate" />,
  poor: <T th="สูงกว่ามูลค่า" en="Above estimate" />,
};

function Stars({ count }: { count: number }) {
  return (
    <span className="scard-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= count ? "on" : "off"} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

// Client-side search over the published reports (filter by ticker or company).
// Data is fetched server-side and passed in as plain props — no LLM, no live
// lookup of arbitrary tickers; this only narrows the list you already publish.
export default function ResearchBrowser({
  items,
  initialQuery = "",
}: {
  items: ReportCardData[];
  initialQuery?: string;
}) {
  const { lang } = useLang();
  const [q, setQ] = useState(initialQuery);
  const [sortCol, setSortCol] = useState<string>("ticker");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const norm = q.trim().toLowerCase();
  let filtered = norm
    ? items.filter(
        (i) =>
          i.ticker.toLowerCase().includes(norm) || i.company.toLowerCase().includes(norm),
      )
    : [...items];

  filtered.sort((a, b) => {
    let valA: any = a.ticker;
    let valB: any = b.ticker;
    
    if (sortCol === "price") { valA = a.price; valB = b.price; }
    else if (sortCol === "ev") { valA = a.ev; valB = b.ev; }
    else if (sortCol === "upside") { valA = (a.ev / a.price) - 1; valB = (b.ev / b.price) - 1; }
    else if (sortCol === "quality") { valA = a.quality; valB = b.quality; }
    else if (sortCol === "priced") {
      valA = valuationBadge(a.ev, a.price).gap;
      valB = valuationBadge(b.ev, b.price).gap;
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(col === "ticker"); }
  };

  const SortIcon = ({ col }: { col: string }) => {
    const isActive = sortCol === col;
    return (
      <span
        style={{
          display: "inline-block",
          width: 12,
          fontSize: 10,
          marginLeft: 4,
          opacity: isActive ? 1 : 0,
        }}
        aria-hidden="true"
      >
        {isActive ? (sortAsc ? "▲" : "▼") : "▲"}
      </span>
    );
  };

  const verdictClass = (v: string) =>
    v === "buy" || v === "accumulate" ? "v-buy" : v === "hold" ? "v-hold" : "v-sell";

  return (
    <>
      <div className="research-search">
        <svg
          className="rs-ico"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lang === "en" ? "Search stocks — ticker or company name" : "ค้นหาหุ้น — ticker หรือชื่อบริษัท"}
          aria-label={lang === "en" ? "Search stocks" : "ค้นหาหุ้น"}
        />
        {q && (
          <button type="button" className="rs-clear" onClick={() => setQ("")} aria-label={lang === "en" ? "Clear" : "ล้าง"}>
            ✕
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="rtable-wrap">
          <table className="rtable">
            <thead>
              <tr>
                <th onClick={() => handleSort("ticker")} style={{ cursor: "pointer", userSelect: "none" }}>Ticker <SortIcon col="ticker" /></th>
                <th onClick={() => handleSort("price")} style={{ cursor: "pointer", userSelect: "none" }}>Price <SortIcon col="price" /></th>
                <th onClick={() => handleSort("priced")} style={{ cursor: "pointer", userSelect: "none" }}><T th="ราคาเทียบมูลค่า" en="Price vs value" /> <SortIcon col="priced" /></th>
                <th onClick={() => handleSort("ev")} style={{ cursor: "pointer", userSelect: "none" }}><T th="มูลค่าประมาณ" en="Estimated value" /> <SortIcon col="ev" /></th>
                <th onClick={() => handleSort("upside")} style={{ cursor: "pointer", userSelect: "none" }}><T th="ส่วนต่าง" en="Gap" /> <SortIcon col="upside" /></th>
                <th onClick={() => handleSort("quality")} style={{ cursor: "pointer", userSelect: "none" }}><T th="คุณภาพธุรกิจ" en="Business quality" /> <SortIcon col="quality" /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const badge = valuationBadge(d.ev, d.price);
                return (
                  <tr key={d.ticker}>
                    <td>
                      <div className="tick">{d.ticker}</div>
                      <div className="co">{d.company}</div>
                    </td>
                    <td>
                      <div className="price">{money(d.price, "USD")}</div>
                      {d.changePct !== null ? (
                        <div className={`chg ${d.changePct >= 0 ? "up" : "down"}`}>{pct(d.changePct)}</div>
                      ) : (
                        <div className="chg muted"><T th="ณ วันจัดทำ" en="At publish" /></div>
                      )}
                    </td>
                    <td>
                      <span className={`scard-chip ${toneClass[badge.tone]}`}>
                        {toneWord[badge.tone]}
                      </span>
                    </td>
                    <td>{money(d.ev, "USD")}</td>
                    <td style={{ color: badge.gap >= 0 ? "var(--up)" : "var(--down)" }}>
                      {pct(badge.gap)}
                    </td>
                    <td><Stars count={qualityToStars(d.quality)} /></td>
                    <td className="action">
                      <Link href={`/research/${d.ticker.toLowerCase()}`} className="btn ghost">
                        <T th="ดูรายละเอียด →" en="View →" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="research-empty">
          <T 
            th={<>ไม่พบหุ้นที่ตรงกับ “{q}” — ลองค้นด้วย ticker (เช่น META) หรือชื่อบริษัท</>} 
            en={<>No stocks found matching “{q}” — try searching by ticker (e.g., META) or company name</>} 
          />
        </p>
      )}
    </>
  );
}
