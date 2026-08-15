import type { Metadata } from "next";
import { REPORTS } from "@/lib/reports";
import { getStockQuotes } from "@/lib/quotes";
import ResearchBrowser from "@/components/site/ResearchBrowser";
import type { ReportCardData } from "@/components/site/ReportCard";
import { T } from "@/components/site/LangContext";

export const metadata: Metadata = {
  title: "บทวิเคราะห์หุ้น (DEEP+O Research) | Cerfinits",
  description:
    "บทวิเคราะห์หุ้นเชิงลึกด้วยกรอบ DEEP+O — Quality Score, Valuation แบบ 3 ฉากทัศน์, Variant Perception และ Thesis Killers พร้อมราคาอัปเดตสด เพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน",
  alternates: { canonical: "/research" },
  openGraph: {
    siteName: "Cerfinits",
    title: "บทวิเคราะห์หุ้น (DEEP+O Research) | Cerfinits",
    description: "บทวิเคราะห์หุ้นเชิงลึกด้วยกรอบ DEEP+O — โชว์ทั้งด้านที่ชนะและด้านที่เจ็บ",
    type: "website",
    url: "/research",
    locale: "th_TH",
    images: [{ url: "/og-cover.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "บทวิเคราะห์หุ้น (DEEP+O Research) | Cerfinits",
    images: ["/og-cover.png"],
  },
};

// Revalidate the page (prices) every 5 minutes.
export const revalidate = 300;

export default async function ResearchHub({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const quotes = await getStockQuotes(REPORTS.map((r) => r.ticker));

  const items: ReportCardData[] = REPORTS.map((r) => {
    const quote = quotes[r.ticker.toUpperCase()];
    return {
      ticker: r.ticker,
      company: r.company,
      ev: r.valuation.ev,
      quality: r.quality,
      asOf: r.asOf,
      price: quote?.price ?? r.refPrice,
      changePct: quote?.changePct ?? null,
    };
  });

  return (
    <>
      <section className="blog-hero">
        <div className="wrap" style={{ maxWidth: 1200 }}>
          <span className="eyebrow">Research</span>
          <h1><T th="บทวิเคราะห์หุ้น" en="Stock Research" /></h1>
          <p>
            <T
              th={<>บทวิเคราะห์เชิงลึกด้วยกรอบ <b>DEEP+O</b> — วัด Quality, ตีมูลค่าแบบ 3 ฉากทัศน์ (Bear / Base / Bull), หา Variant Perception และตั้ง Thesis Killers ที่วัดได้จริง เราโชว์ทั้งด้านที่ชนะและด้านที่เจ็บ · ราคาอัปเดตสด — ตัวเลขวิเคราะห์ freeze ณ วันจัดทำ</>}
              en={<>In-depth research using the <b>DEEP+O</b> framework — measuring Quality, 3-scenario Valuation (Bear / Base / Bull), Variant Perception, and measurable Thesis Killers. We show both the wins and the pain. · Live prices — analysis metrics frozen at publication.</>}
            />
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap" style={{ maxWidth: 1200 }}>
          <ResearchBrowser items={items} initialQuery={q ?? ""} />

          <p className="disclaimer" style={{ marginTop: 40, maxWidth: 920 }}>
            <T
              th={<><b>เพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน</b> — บทวิเคราะห์เหล่านี้เป็นความเห็นส่วนตัวจากกรอบ DEEP+O เพื่อสาธิตกระบวนการคิด ไม่ใช่คำชี้แนะให้ซื้อ/ขายหลักทรัพย์ใด การลงทุนมีความเสี่ยง ผู้ลงทุนควรศึกษาข้อมูลและตัดสินใจด้วยตนเอง Cerfinits ไม่ใช่ที่ปรึกษาการลงทุนที่ได้รับอนุญาต</>}
              en={<><b>For educational purposes only, not investment advice.</b> — These reports are personal opinions based on the DEEP+O framework to demonstrate thought processes, not a solicitation to buy or sell any securities. Investing carries risk. Investors should do their own research. Cerfinits is not a licensed financial advisor.</>}
            />
          </p>
        </div>
      </section>
    </>
  );
}
