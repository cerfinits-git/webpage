import type { Metadata } from "next";
import { T } from "@/components/site/LangContext";

// Generated from gold-start-cheatsheet.html by scripts/convert-gold-start.mjs — edit freely,
// but re-running the script will overwrite this file.
export const metadata: Metadata = {
  title: "GOLD START — Cheat Sheet ก่อนกดออเดอร์ · Cerfinits",
  description: "เปิดดูทุกครั้งก่อนเข้าเทรด — ผ่านครบทุกข้อค่อยกด ถ้าขาดข้อเดียว คือ “รอไม้ถัดไป”",
  alternates: { canonical: "/gold-start/cheatsheet" },
};

export default function Page() {
  return (
    <>
      <div className="book">

        <div className="wrap runhead">
          <span className="brand"><span className="dot"></span> Cerfinits</span>
          <span>GOLD START · CHEAT SHEET</span>
        </div>

        <div className="wrap opener" style={{ padding: "64px 0 40px" }}>
          <span className="kicker"><T th="ภาคผนวก · ปรินต์แปะข้างจอได้" en="Appendix · Printable, Stick Next to Your Screen" /></span>
          <h1>Cheat Sheet<br /><T th="ก่อนกดออเดอร์" en="Before You Press" /></h1>
          <p className="lead"><T th={<>เปิดดูทุกครั้งก่อนเข้าเทรด — ผ่านครบทุกข้อค่อยกด ถ้าขาดข้อเดียว คือ "รอไม้ถัดไป"</>} en={<>Check this every time before you trade — press only when every box is checked. If even one is missing, it's "wait for the next trade."</>} /></p>
        </div>

        <div className="wrap cs-content">
          <div className="cs-grid">

            <div className="cs-box">
              <div className="cs-l">✓ <T th="เช็กลิสต์ก่อนเข้า" en="Pre-Entry Checklist" /></div>
              <ul>
                <li><T th="เทรนด์ใหญ่ชัด และเทรดตามเทรนด์" en="The main trend is clear, and I'm trading with it" /></li>
                <li><T th="ราคาย่อมาที่ Key Level (ไม่ไล่ราคา)" en="Price has pulled back to a Key Level (not chasing)" /></li>
                <li><T th="มีแท่งยืนยันที่โซนแล้ว" en="There's a confirmation candle at the zone" /></li>
                <li><T th="SL/TP ได้ R:R อย่างน้อย 1:2" en="SL/TP gives R:R of at least 1:2" /></li>
                <li><T th="คำนวณ lot ตามกฎ 2% แล้ว" en="Lot has been calculated per the 2% rule" /></li>
              </ul>
            </div>

            <div className="cs-box rule">
              <div className="cs-l">⚖ <T th="กฎความเสี่ยง" en="Risk Rules" /></div>
              <ul>
                <li><T th="เสี่ยงไม่เกิน 1–2% ของพอร์ต/ไม้" en="Risk no more than 1–2% of the account per trade" /></li>
                <li><T th="เริ่มที่ 0.01 lot เสมอ" en="Always start at 0.01 lot" /></li>
                <li><T th="ทุก ๆ ไม้ต้องมี Stop Loss" en="Every trade must have a Stop Loss" /></li>
              </ul>
              <div className="formula">
                <T th="เงินเสี่ยง = ทุน × 2%" en="Risk amount = Capital × 2%" /><br />
                <T th="lot = (เงินเสี่ยง ÷ ระยะ SL$) × 0.01" en="lot = (Risk amount ÷ SL distance$) × 0.01" /><br />
                <span style={{ color: "var(--muted)" }}><T th="เช่น $1,000 → เสี่ยง $20, SL $5 → 0.04 lot" en="e.g. $1,000 → risk $20, SL $5 → 0.04 lot" /></span>
              </div>
            </div>

            <div className="cs-box rule">
              <div className="cs-l">◷ <T th="เวลา + เป้าหมาย" en="Timing + Goals" /></div>
              <ul>
                <li><T th="เทรดช่วง London–NY (19:00–23:00 น.)" en="Trade the London–NY session (19:00–23:00 Thai time)" /></li>
                <li><T th="เลี่ยงช่วงข่าวแรงตอนเป็นมือใหม่" en="Avoid high-impact news times as a beginner" /></li>
                <li><T th="เป้าหมาย 3 เดือนแรก = อยู่รอด ไม่ใช่รวย" en="Goal for the first 3 months = survive, not get rich" /></li>
                <li><T th="ฝึกบนเดโมจนเป็นนิสัยก่อนเงินจริง" en="Practice on demo until it's a habit, before real money" /></li>
              </ul>
            </div>

            <div className="cs-box no">
              <div className="cs-l">✕ <T th="3 ห้ามของมือใหม่" en="3 Beginner Don'ts" /></div>
              <ul>
                <li><T th="ไล่ราคา (เข้าเพราะกลัวตกรถ)" en="Chasing price (entering out of FOMO)" /></li>
                <li><T th="เลื่อน Stop Loss หนีเมื่อติดลบ" en="Moving the Stop Loss away when in the red" /></li>
                <li><T th="แก้แค้นตลาด (รีบเข้าไม้ใหม่เพื่อเอาคืน)" en="Revenge trading (rushing into a new trade to get it back)" /></li>
              </ul>
            </div>

            <div className="cs-box full" style={{ textAlign: "center", background: "var(--btn)", borderColor: "var(--btn)" }}>
              <div className="eq" style={{ fontFamily: "var(--mono)", fontSize: "clamp(18px,3vw,24px)", color: "var(--btn-text)" }}>Edge&nbsp; + &nbsp;Discipline&nbsp; = &nbsp;Success</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "11.5px", color: "#9a988f", marginTop: "12px" }}>CERFINITS · discord.gg/jANDuDvn — <T th="ฝึกของจริงไปด้วยกัน" en="practice the real thing together" /></div>
            </div>

          </div>
        </div>

        <div className="wrap disclaimer">
          <T
            th="เอกสารนี้จัดทำขึ้นเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง ผู้ลงทุนอาจสูญเสียเงินทุนทั้งหมด"
            en="This document is prepared for educational purposes only, not investment advice · Trading carries high risk and investors may lose their entire capital"
          />
        </div>

      </div>
    </>
  );
}
