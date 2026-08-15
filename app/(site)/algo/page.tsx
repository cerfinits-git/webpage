import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/site/LangContext";

export const metadata: Metadata = {
  title: "ระบบเทรดอัตโนมัติ (Algo Trading) | Cerfinits",
  description: "ระบบเทรดอัตโนมัติ (EA) ของ Cerfinits",
  alternates: { canonical: "/algo" },
};

export default function AlgoIndexPage() {
  return (
    <>
      <section className="blog-hero">
        <div className="wrap">
          <span className="eyebrow">Algo Trading</span>
          <h1><T th="ระบบเทรดอัตโนมัติ" en="Automated Trading Systems" /></h1>
          <p>
            <T 
              th="รวมระบบเทรดอัตโนมัติ (EA) ของเราที่มีการรันและเก็บสถิติจริง เพื่อการลงทุนที่เป็นระบบและมีวินัย" 
              en="A collection of our automated trading systems (EA) running with real statistics for systematic and disciplined investing." 
            />
          </p>
        </div>
      </section>

      <section id="algo">
        <div className="wrap">
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
