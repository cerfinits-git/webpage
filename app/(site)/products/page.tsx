import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/site/LangContext";
export const metadata: Metadata = {
  title: "E-book และ สินค้า | Cerfinits",
  description: "คู่มือเริ่มเทรดทอง (XAUUSD) ฟรี และ Digital products เครื่องมือที่ผมใช้จริง",
  alternates: { canonical: "/products" },
  openGraph: {
    siteName: "Cerfinits",
    title: "E-book และ สินค้า | Cerfinits",
    description: "คู่มือเทรดทอง XAUUSD ฟรี และ e-book COT/จิตวิทยา/ICT",
    type: "website",
    url: "/products",
    locale: "th_TH",
    images: [{ url: "/og-cover.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-book และ สินค้า | Cerfinits",
    images: ["/og-cover.png"],
  },
};

export default function ProductsPage() {
  return (
    <>
      <section className="blog-hero">
        <div className="wrap">
          <span className="eyebrow">Products</span>
          <h1>
            <T th="สินค้าและบริการ" en="Products & Services" />
          </h1>
          <p>
            <T 
              th="ระบบเทรดอัตโนมัติ คู่มือเทรดฟรี และเครื่องมือดิจิทัลที่จัดทำเพื่อให้ความรู้สำหรับเทรดเดอร์ที่มีวินัย" 
              en="Automated trading systems, free guides, and digital tools created to educate disciplined traders." 
            />
          </p>
        </div>
      </section>




      {/* FREE E-BOOK */}
      <section id="ebook">
        <div className="wrap">
          <span className="eyebrow reveal"><T th="ดาวน์โหลดฟรี" en="Free download" /></span>
          <h2 className="section-title reveal">GOLD START</h2>
          <p className="section-sub reveal">
            <T
              th="คู่มือเริ่มเทรดทอง (XAUUSD) สำหรับมือใหม่ตั้งแต่ศูนย์ — อย่างปลอดภัย ไม่ล้างพอร์ต · 10 บท + Cheat Sheet + อภิธานศัพท์ ครบในเล่มเดียว"
              en="A complete beginner's guide to trading gold (XAUUSD) from zero — safely, without blowing your account. 10 chapters + cheat sheet + glossary, all in one."
            />
          </p>
          <div className="hero-cta reveal" style={{ marginTop: 34, marginBottom: 0 }}>
            <a href="/gold-start-cerfinits.pdf" className="btn" download>
              <T th="ดาวน์โหลด PDF ฟรี" en="Download free PDF" />
            </a>
            <Link href="/gold-start" className="btn ghost">
              <T th="อ่านออนไลน์" en="Read online" />
            </Link>
          </div>
          <p className="note reveal">
            <T
              th="ฟรี 100% — อ่านจบแล้วมาฝึกเทรดจริงกันต่อใน Discord · เพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน"
              en="100% free — finish it, then come practice with us on Discord · For education only, not investment advice."
            />
          </p>
        </div>
      </section>


      {/* PRODUCTS */}
      <section id="products">
        <div className="wrap">
          <span className="eyebrow reveal"><T th="สินค้า" en="Products" /></span>
          <h2 className="section-title reveal">Digital products</h2>
          <p className="section-sub reveal">
            <T
              th="เครื่องมือที่ผมใช้จริง ส่งมอบเป็นไฟล์ดิจิทัลผ่าน Gumroad ดาวน์โหลดได้ทันทีหลังชำระเงิน"
              en="The tools I actually use — delivered as digital files via Gumroad, available instantly after checkout."
            />
          </p>

          <div className="product-grid">
            <div className="product reveal-scale">
              <div className="thumb">
                <img
                  src="https://public-files.gumroad.com/ozdfyhssupz8ogeuow6b8hn1elrd"
                  alt="ปกหนังสือ อ่าน COT ให้เป็น แล้วใช้เทรดทองคำ"
                  loading="lazy"
                />
              </div>
              <div className="pbody">
                <span className="ptype">E-BOOK · PDF</span>
                <h3><T th="อ่าน COT ให้เป็น แล้วใช้เทรดทองคำ" en="Reading COT for Gold Traders" /></h3>
                <p className="desc">
                  <T
                    th={<>ตามรอยเงินรายใหญ่บน COMEX — จาก &quot;ไม่เคยแตะ COT&quot; สู่การวางระบบเทรดทองได้จริง · 58 หน้า · 18 บท + 10 ภาคผนวก</>}
                    en="Follow big money on COMEX — from never touching COT to a real gold-trading system. 58 pages · 18 chapters + 10 appendices."
                  />
                </p>
                <div className="foot">
                  <div className="price">$10</div>
                  <a href="https://narabodin.gumroad.com/l/COT" target="_blank" rel="noopener" className="btn">
                    <T th="ซื้อบน Gumroad" en="Buy on Gumroad" />
                  </a>
                </div>
              </div>
            </div>
            <div className="product reveal-scale">
              <div className="thumb">
                <img
                  src="https://public-files.gumroad.com/2wy9ztnl6kha6f7wklo83ngdd0l3"
                  alt="ปกหนังสือ The Lion's Heart — Psychology of Trader"
                  loading="lazy"
                />
              </div>
              <div className="pbody">
                <span className="ptype">E-BOOK · PDF</span>
                <h3>The Lion&apos;s Heart — Psychology of Trader</h3>
                <p className="desc">
                  <T
                    th="ปลุกราชสีห์ในใจเทรดเดอร์ — จิตวิทยาการเทรดที่ตกตะกอนจากความเจ็บปวดจริงในตลาด เพราะระบบคือ 20% แต่จิตใจคือ 80% · 4 ภาค · 15 บท"
                    en="Awaken the lion within — trading psychology forged from real pain in the markets. The system is 20%; the mind is 80%. 4 parts · 15 chapters."
                  />
                </p>
                <div className="foot">
                  <div className="price">$5</div>
                  <a href="https://narabodin.gumroad.com/l/ttxhcq" target="_blank" rel="noopener" className="btn">
                    <T th="ซื้อบน Gumroad" en="Buy on Gumroad" />
                  </a>
                </div>
              </div>
            </div>
            <div className="product reveal-scale">
              <div className="thumb">
                <img
                  src="https://public-files.gumroad.com/cgktlnmw7xgh4fkuznrk4fdkkmz2"
                  alt="ปกหนังสือ Full ICT & MMM Guide"
                  loading="lazy"
                />
              </div>
              <div className="pbody">
                <span className="ptype">E-BOOK · PDF</span>
                <h3>Full ICT &amp; MMM Guide</h3>
                <p className="desc">
                  <T
                    th="สรุปแก่นวิชา ICT + Market Maker Model — อ่านร่องรอย Smart Money บนกราฟ แล้วเข้าเทรดในจุดที่ได้เปรียบที่สุดแบบสไนเปอร์"
                    en="The essence of ICT + Market Maker Model — read Smart Money's footprints on the chart and enter where the edge is greatest. Trade like a sniper."
                  />
                </p>
                <div className="foot">
                  <div className="price">$59</div>
                  <a href="https://narabodin.gumroad.com/l/cerfinits" target="_blank" rel="noopener" className="btn">
                    <T th="ซื้อบน Gumroad" en="Buy on Gumroad" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <p className="note reveal">
            <T
              th="* ทุกเล่มเป็นไฟล์ PDF ชำระเงินผ่าน Gumroad ดาวน์โหลดได้ทันที — จัดทำเพื่อให้ความรู้เท่านั้น ไม่ใช่คำแนะนำการลงทุน"
              en="* All titles are PDF files via Gumroad, downloadable instantly — for educational purposes only, not investment advice."
            />
          </p>
        </div>
      </section>


      {/* ALGO */}
      <section id="algo">
        <div className="wrap">
          <span className="eyebrow reveal"><T th="Algo Trading" en="Algo Trading" /></span>
          <h2 className="section-title reveal">Cerfinits Algo SDV.1</h2>
          <p className="section-sub reveal">
            <T
              th="EA เทรดทอง XAUUSD สาย Trend-Following — ทดสอบด้วย Tick จริง 100% ต่อเนื่อง 2.4 ปี เราโชว์ทุกตัวเลข ทั้งด้านที่ชนะและด้านที่เจ็บ"
              en="A Trend-Following XAUUSD EA — backtested on 100% real ticks for 2.4 years. Every number shown, the wins and the pain."
            />
          </p>

          <div className="algo-card reveal-scale">
            <div className="a-plan">XAUUSD · M15 · MT5 · REAL TICKS 100%</div>
            <h3>
              <T
                th={<>ระบบเทรดทองอัตโนมัติ<br />ที่ไม่ขายฝัน — ขายข้อมูล</>}
                en={<>A gold trading system that<br />sells data — not dreams</>}
              />
            </h3>
            <p className="a-sub">
              <T
                th="ทุกออเดอร์มี Stop Loss ไม่ใช้ Martingale/Grid เทรดสูงสุด 3 ไม้/วัน — วินัยที่โค้ดบังคับใช้แทนคุณ"
                en="Every order has a stop loss. No Martingale, no Grid, max 3 trades/day — discipline enforced by code."
              />
            </p>
            <div className="algo-stats">
              <div>
                <div className="v">+268%</div>
                <div className="k"><T th="กำไรสุทธิ (Backtest 2.4 ปี)" en="Net profit (2.4y backtest)" /></div>
              </div>
              <div>
                <div className="v">1.35</div>
                <div className="k">Profit Factor</div>
              </div>
              <div>
                <div className="v">14.0%</div>
                <div className="k">Max Drawdown</div>
              </div>
              <div>
                <div className="v">606</div>
                <div className="k"><T th="เทรดทั้งหมด" en="Total trades" /></div>
              </div>
            </div>
            <div className="algo-cta">
              <Link href="/algo/sdv1" className="btn-invert">
                <T th="ดูผลทดสอบเต็ม + รายละเอียด →" en="Full backtest + details →" />
              </Link>
              <span className="price-note">
                <T th="เช่ารายเดือน 990฿ · ยกเลิกได้ทุกเมื่อ" en="฿990/month · cancel anytime" />
              </span>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
