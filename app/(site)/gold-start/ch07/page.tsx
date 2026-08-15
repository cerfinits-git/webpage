import type { Metadata } from "next";
import { T } from "@/components/site/LangContext";

// Generated from gold-start-ch07.html by scripts/convert-gold-start.mjs — edit freely,
// but re-running the script will overwrite this file.
export const metadata: Metadata = {
  title: "GOLD START — บทที่ 07 · กายวิภาคออเดอร์ + เซ็ตอัพล้อจักรยาน · Cerfinits",
  description: "ถึงเวลาประกอบทุกอย่างที่เรียนมาเข้าด้วยกัน — รู้ว่าออเดอร์หนึ่งไม้มีอะไรบ้าง แล้วได้ “รูทีนเข้าเทรด” ง่าย ๆ ปลอดภัย สำหรับลงไม้แรกอย่างมีกฎ",
  alternates: { canonical: "/gold-start/ch07" },
};

export default function Page() {
  return (
    <>
      <div className="book">

        <div className="wrap runhead">
          <span className="brand"><span className="dot"></span> Cerfinits</span>
          <span>GOLD START · EDGE + DISCIPLINE = SUCCESS</span>
        </div>

        <div className="wrap opener">
          <span className="kicker"><T th="ภาค 4 — ลงสนาม" en="Part 4 — Onto the Field" /></span>
          <div className="chno"><T th="บทที่ / 07" en="Chapter / 07" /></div>
          <h1><T th="กายวิภาคออเดอร์" en="Order Anatomy" /><br /><T th="+ เซ็ตอัพล้อจักรยาน" en="+ the Training-Wheels Setup" /></h1>
          <p className="lead"><T th={<>ถึงเวลาประกอบทุกอย่างที่เรียนมาเข้าด้วยกัน — รู้ว่าออเดอร์หนึ่งไม้มีอะไรบ้าง แล้วได้ "รูทีนเข้าเทรด" ง่าย ๆ ปลอดภัย สำหรับลงไม้แรกอย่างมีกฎ</>} en={<>Time to put everything you've learned together — know what makes up one order, and get a simple, safe "trading entry routine" for taking your first trade by the rules.</>} /></p>
        </div>

        <div className="wrap content">

          <p className="intro"><T th={<>บทนี้เราจะได้ "เซ็ตอัพ" แรกของคุณ — แต่ขอบอกตรง ๆ ก่อน: มันคือ <b>ล้อจักรยาน</b> ออกแบบมาให้ปลอดภัยและเรียบง่าย ไม่ใช่สูตรลับทำเงิน เป้าหมายของมันคือพาคุณ "ลงไม้แรกอย่างมีกฎ" ไม่ใช่ทำให้รวย</>} en={<>In this chapter you'll get your first "setup" — but let me be upfront: it's <b>training wheels</b>. Designed to be safe and simple, not a secret money-making formula. Its goal is to get you "taking your first trade by the rules", not to make you rich.</>} /></p>

          <div className="sechead"><span className="n">01</span><h2><T th="กายวิภาคของออเดอร์หนึ่งไม้" en="The Anatomy of One Order" /></h2></div>
          <p><T th="ทุกออเดอร์ที่คุณเปิด ประกอบด้วย 4 ส่วนที่ต้องตัดสินใจ ก่อน กดเสมอ: ทิศทาง (Buy/Sell), จุดเข้า (Entry), จุดตัดขาดทุน (Stop Loss), จุดทำกำไร (Take Profit):" en="Every order you open consists of 4 decisions you must always make before you click: direction (Buy/Sell), entry point, Stop Loss point, and Take Profit point:" /></p>

          <div className="figure">
            <svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" fontFamily="Geist Mono, monospace">
              <line x1="20" y1="40" x2="430" y2="40" stroke="#5a7d5a" strokeWidth="1.5" strokeDasharray="6 5"/>
              <line x1="20" y1="120" x2="430" y2="120" stroke="#272727" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="20" y1="170" x2="430" y2="170" stroke="#9d5a4f" strokeWidth="1.5" strokeDasharray="6 5"/>
              <polyline points="40,120 120,130 200,95 290,70 400,40" fill="none" stroke="#272727" strokeWidth="2"/>
              <path d="M40 132 l8 -12 l-16 0 z" fill="#5a7d5a"/>
              <text x="438" y="44" fontSize="12" fill="#5a7d5a">Take Profit — <T th="ปิดกำไร (3,430)" en="close in profit (3,430)" /></text>
              <text x="438" y="124" fontSize="12" fill="#272727">Entry + Buy — <T th="จุดเข้า (3,420)" en="entry point (3,420)" /></text>
              <text x="438" y="174" fontSize="12" fill="#9d5a4f">Stop Loss — <T th="ตัดขาดทุน (3,415)" en="cut losses (3,415)" /></text>
            </svg>
            <div className="figcap"><T th="ออเดอร์ Buy หนึ่งไม้ — รู้ทั้ง 3 ระดับก่อนกดเสมอ" en="One Buy order — always know all 3 levels before you press" /></div>
          </div>

          <p><T th="เรื่องประเภทคำสั่ง มี 2 แบบหลัก ตอนเริ่มใช้แบบแรกพอ:" en="On order types, there are 2 main kinds; when starting out, the first one is enough:" /></p>
          <ul className="clean">
            <li><T th={<><b>Market Order</b> — เข้าทันทีที่ราคาปัจจุบัน (ง่ายสุด เหมาะมือใหม่)</>} en={<><b>Market Order</b> — enters immediately at the current price (easiest, best for beginners)</>} /></li>
            <li><T th={<><b>Pending Order</b> — ตั้งรอให้ราคาวิ่งมาถึงจุดที่กำหนดก่อนค่อยเข้า (ใช้เมื่อชำนาญขึ้น)</>} en={<><b>Pending Order</b> — set to enter once price reaches a specified level (use once you're more experienced)</>} /></li>
          </ul>

          <div className="sechead"><span className="n">02</span><h2><T th={<>เซ็ตอัพล้อจักรยาน — "ย่อตามเทรนด์"</>} en={<>The Training-Wheels Setup — "Pullback With the Trend"</>} /></h2></div>
          <p><T th={<>นี่คือเซ็ตอัพเดียวที่ผมอยากให้คุณฝึกก่อน มันรวมทุกอย่างจากบทก่อน ๆ เข้าด้วยกัน: เทรนด์ + Key Level + แท่งยืนยัน + Risk Management หลักการคือ <b>"รอราคาย่อกลับมาที่แนว แล้วเข้าตามเทรนด์"</b></>} en={<>This is the one setup I want you to practice first. It combines everything from previous chapters: trend + Key Level + confirmation candle + Risk Management. The principle is <b>"wait for price to pull back to the level, then enter with the trend."</b></>} /></p>

          <div className="figure">
            <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" fontFamily="Geist Mono, monospace">
              <line x1="20" y1="190" x2="560" y2="190" stroke="#9a7b3f" strokeWidth="1.5" strokeDasharray="6 5"/>
              <text x="24" y="210" fontSize="11" fill="#9a7b3f">Key Level (<T th="แนวรับ" en="Support" />)</text>
              <line x1="20" y1="225" x2="560" y2="225" stroke="#9d5a4f" strokeWidth="1.2" strokeDasharray="4 4"/>
              <line x1="20" y1="80" x2="560" y2="80" stroke="#5a7d5a" strokeWidth="1.2" strokeDasharray="4 4"/>
              <polyline points="30,235 90,170 150,200 220,120 300,185 340,150 410,95 470,55" fill="none" stroke="#272727" strokeWidth="2"/>
              <g fontSize="11" fill="#fff">
                <circle cx="70" cy="205" r="10" fill="#9a7b3f"/><text x="70" y="209" textAnchor="middle">1</text>
                <circle cx="300" cy="185" r="10" fill="#9a7b3f"/><text x="300" y="189" textAnchor="middle">2</text>
                <circle cx="340" cy="150" r="10" fill="#9a7b3f"/><text x="340" y="154" textAnchor="middle">3</text>
                <circle cx="410" cy="95" r="10" fill="#9a7b3f"/><text x="410" y="99" textAnchor="middle">4</text>
              </g>
              <text x="486" y="59" fontSize="11" fill="#5a7d5a">TP (≥1:2)</text>
              <text x="486" y="229" fontSize="11" fill="#9d5a4f">SL</text>
            </svg>
            <div className="figcap"><T th="① เทรนด์ขึ้น → ② ย่อมาที่ Key Level → ③ แท่งยืนยัน → ④ เข้า Buy + SL/TP" en="① Uptrend → ② pulls back to Key Level → ③ confirmation candle → ④ enter Buy + SL/TP" /></div>
          </div>

          <p><T th="กฎของเซ็ตอัพนี้ ทำตามทุกข้อ ถ้าขาดข้อใดข้อหนึ่ง = ไม่เข้า:" en="Rules for this setup — follow every one; if even one is missing, don't enter:" /></p>
          <ul className="clean">
            <li><T th={<><b>1. ดูเทรนด์ใหญ่ก่อน</b> — เทรดเฉพาะตามเทรนด์ (ขาขึ้นหา Buy เท่านั้น)</>} en={<><b>1. Check the big trend first</b> — trade only with the trend (in an uptrend, look for Buy only)</>} /></li>
            <li><T th={<><b>2. รอราคาย่อ</b> กลับมาที่ Key Level ที่มีบริบท ไม่ไล่ราคา</>} en={<><b>2. Wait for a pullback</b> to a Key Level that has context — don't chase price</>} /></li>
            <li><T th={<><b>3. รอแท่งยืนยัน</b> — แท่งกลับตัว/ไส้ยาวปฏิเสธราคา ที่โซนนั้น</>} en={<><b>3. Wait for a confirmation candle</b> — a reversal candle / long rejection wick at that zone</>} /></li>
            <li><T th={<><b>4. เข้าตามเทรนด์</b> ตั้ง SL ใต้ Key Level, TP ที่ R:R อย่างน้อย 1:2</>} en={<><b>4. Enter with the trend</b>, set SL below the Key Level, TP at R:R of at least 1:2</>} /></li>
            <li><T th={<><b>5. คำนวณ lot</b> ตามกฎ 2% เสมอ (บทที่ 6)</>} en={<><b>5. Calculate lot</b> per the 2% rule, always (Chapter 6)</>} /></li>
          </ul>

          <div className="loop">
            <div className="llabel"><T th="ก้าวต่อไป — ลงลึกใน DISCORD" en="Next Step — Go Deeper in Discord" /></div>
            <p><T th={<>เซ็ตอัพนี้คือ "ล้อจักรยาน" — ปลอดภัยและใช้ได้จริง แต่ยังไม่ใช่ edge ตัวเต็มที่ผมเทรด ของจริงผมอ่าน <b>FVG (Fair Value Gap), liquidity และ POI (Point of Interest)</b> เพื่อหาจุดเข้าที่ได้เปรียบกว่านี้มาก — เราถอดมันทีละชิ้นแบบลงมือจริงกันใน <b>Discord</b> (และในคู่มือ ICT &amp; MMM ฉบับเต็ม สำหรับคนที่อยากถอดล้อจักรยานออก)</>} en={<>This setup is "training wheels" — safe and real, but not the full edge I actually trade. In reality I read <b>FVG (Fair Value Gap), liquidity, and POI (Point of Interest)</b> to find far more advantageous entries — we take it apart piece by piece, hands-on, in <b>Discord</b> (and in the full ICT &amp; MMM guide, for those who want to take the training wheels off).</>} /></p>
          </div>

          <div className="note">
            <div className="nlabel">CERFINITS NOTE — <T th="บันทึกจากกัน" en="A note from Kan" /></div>
            <p><T th={<>อย่าดูถูกความเรียบง่ายของเซ็ตอัพนี้ ผมรู้จักเทรดเดอร์ที่ทำกำไรสม่ำเสมอด้วยหลักการแค่ "ตามเทรนด์ + รอย่อ + คุมความเสี่ยง" มาหลายปี <b>ความมีวินัยกับเซ็ตอัพธรรมดา ชนะความมั่วกับเซ็ตอัพเทพ ๆ เสมอ</b> เก่งให้ได้กับอันนี้ก่อน แล้วค่อยไปต่อ</>} en={<>Don't underestimate this setup's simplicity. I know traders who've profited consistently for years on nothing more than "follow the trend + wait for pullback + manage risk." <b>Discipline with an ordinary setup always beats chaos with a fancy one.</b> Master this one first, then move on.</>} /></p>
          </div>

          <div className="summary">
            <div className="slabel"><T th="สรุปให้จำง่าย" en="Easy-Recall Summary" /></div>
            <ul>
              <li><T th="ทุกออเดอร์ตัดสินใจ 4 อย่างก่อนกด: ทิศทาง · Entry · SL · TP" en="Every order decides 4 things before you press: direction · Entry · SL · TP" /></li>
              <li><T th="มือใหม่ใช้ Market Order ก่อนพอ" en="Beginners: Market Order is enough for now" /></li>
              <li><T th="เซ็ตอัพล้อจักรยาน = ตามเทรนด์ + รอย่อมาที่ Key Level + แท่งยืนยัน" en="The training-wheels setup = follow the trend + wait for a pullback to a Key Level + a confirmation candle" /></li>
              <li><T th="ครบทุกกฎจึงเข้า — ขาดข้อเดียว = รอไม้ถัดไป" en="Enter only when every rule is met — miss even one = wait for the next trade" /></li>
              <li><T th="มันคือรูทีนปลอดภัย ไม่ใช่ edge เต็ม — ของจริงอยู่ใน Discord" en="It's a safe routine, not the full edge — the real thing is in Discord" /></li>
            </ul>
          </div>

          <div className="checklist">
            <div className="clabel"><T th="เช็กลิสต์ก่อนกดออเดอร์ — ผ่านครบทุกข้อจึงเข้า" en="Pre-Order Checklist — Enter only when every box is checked" /></div>
            <ul>
              <li><T th="เทรนด์ใหญ่ชัดเจน และผมจะเทรดตามเทรนด์" en="The main trend is clear, and I will trade with it" /></li>
              <li><T th="ราคาย่อกลับมาที่ Key Level ที่มีเหตุผล (ไม่ไล่ราคา)" en="Price has pulled back to a Key Level with a reason (not chasing price)" /></li>
              <li><T th="มีแท่งยืนยันที่โซนแล้ว" en="There's already a confirmation candle at the zone" /></li>
              <li><T th="ตั้ง SL/TP ได้ R:R อย่างน้อย 1:2" en="SL/TP is set at R:R of at least 1:2" /></li>
              <li><T th="คำนวณ lot ตามกฎ 2% เรียบร้อย" en="Lot has been calculated per the 2% rule" /></li>
            </ul>
          </div>

          <div className="next">
            <div className="nx"><T th="บทต่อไป — บทที่ 08" en="Next Chapter — Chapter 08" /></div>
            <p><T th={<>มีเซ็ตอัพแล้วยังไม่พอ — ศัตรูตัวจริงคือ "ตัวคุณเอง" บทต่อไปว่าด้วย <b>จิตวิทยาการเทรด</b> และเครื่องมือที่ทรงพลังที่สุดของมือใหม่: สมุดบันทึกเทรด</>} en={<>Having a setup isn't enough — the real enemy is "yourself." The next chapter is about <b>trading psychology</b> and the most powerful tool for a beginner: the trading journal.</>} /></p>
          </div>

        </div>

        <div className="wrap bookfoot">
          <span>CERFINITS — GOLD START</span>
          <span><T th="บทที่ 07 · กายวิภาคออเดอร์ + เซ็ตอัพล้อจักรยาน" en="Chapter 07 · Order Anatomy + the Training-Wheels Setup" /></span>
        </div>

        <div className="wrap disclaimer">
          <T
            th="เอกสารนี้จัดทำขึ้นเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง ผู้ลงทุนอาจสูญเสียเงินทุนทั้งหมด · โปรดตัดสินใจบนความเข้าใจและความเสี่ยงที่คุณรับได้"
            en="This document is prepared for educational purposes only, not investment advice · Trading carries high risk and investors may lose their entire capital · Please decide based on your understanding and the risk you can bear"
          />
        </div>

      </div>
    </>
  );
}
