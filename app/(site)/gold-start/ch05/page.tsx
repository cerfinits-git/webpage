import type { Metadata } from "next";
import { T } from "@/components/site/LangContext";

// Generated from gold-start-ch05.html by scripts/convert-gold-start.mjs — edit freely,
// but re-running the script will overwrite this file.
export const metadata: Metadata = {
  title: "GOLD START — บทที่ 05 · อ่านกราฟด้วยสายตาแบบ Cerfinits · Cerfinits",
  description: "กราฟไม่ใช่เส้นยุ่บยั่บที่ไว้เดา — มันคือเรื่องราวของการต่อสู้ระหว่างคนซื้อกับคนขาย บทนี้คุณจะเริ่มอ่านเรื่องราวนั้นออก ทีละองค์ประกอบ",
  alternates: { canonical: "/gold-start/ch05" },
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
          <span className="kicker"><T th="ภาค 3 — อ่านเกมให้เป็น" en="Part 3 — Learning to Read the Game" /></span>
          <div className="chno"><T th="บทที่ / 05" en="Chapter / 05" /></div>
          <h1><T th="อ่านกราฟด้วย" en="Reading Charts With" /><br /><T th="สายตาแบบ Cerfinits" en="the Cerfinits Eye" /></h1>
          <p className="lead"><T th="กราฟไม่ใช่เส้นยุ่บยั่บที่ไว้เดา — มันคือเรื่องราวของการต่อสู้ระหว่างคนซื้อกับคนขาย บทนี้คุณจะเริ่มอ่านเรื่องราวนั้นออก ทีละองค์ประกอบ" en="A chart isn't a messy squiggle for guessing — it's the story of the battle between buyers and sellers. In this chapter you'll start reading that story, one element at a time." /></p>
        </div>

        <div className="wrap content">

          <p className="intro"><T th={<>เราจะไม่ยัดอินดิเคเตอร์สิบตัวให้คุณ (จำปรัชญาบทที่ 1 ได้ไหม) เราจะเริ่มจากการอ่าน "ราคาเปล่า ๆ" ให้เป็นก่อน เพราะราคาคือความจริงเพียงหนึ่งเดียวบนกราฟ เริ่มจากหน่วยที่เล็กที่สุด: แท่งเทียน</>} en={<>We won't cram ten indicators onto your chart (remember the philosophy from Chapter 1?). We'll start by learning to read "bare price" first, because price is the one truth on the chart. Starting with the smallest unit: the candlestick.</>} /></p>

          <div className="sechead"><span className="n">01</span><h2><T th="แท่งเทียน — หน่วยเล็กที่สุดของเรื่องราว" en="Candlesticks — the Smallest Unit of the Story" /></h2></div>
          <p><T th="แท่งเทียน 1 แท่ง เล่าให้เรารู้ 4 อย่างในช่วงเวลาหนึ่ง: ราคาเปิด (Open), สูงสุด (High), ต่ำสุด (Low), ปิด (Close) สีบอกทิศ — เขียวคือปิดสูงกว่าเปิด (คนซื้อชนะ) แดงคือปิดต่ำกว่าเปิด (คนขายชนะ):" en="One candlestick tells us 4 things over a period: the Open, High, Low, and Close price. Color tells direction — green means it closed higher than it opened (buyers won); red means it closed lower than it opened (sellers won):" /></p>

          <div className="figure">
            <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" fontFamily="Geist Mono, monospace">

              <line x1="150" y1="30" x2="150" y2="270" stroke="#272727" strokeWidth="2"/>
              <rect x="134" y="95" width="32" height="110" fill="#5a7d5a"/>

              <g stroke="rgba(39,39,39,.3)" strokeWidth="1">
                <line x1="150" y1="30" x2="245" y2="30"/>
                <line x1="166" y1="95" x2="245" y2="95"/>
                <line x1="166" y1="205" x2="245" y2="205"/>
                <line x1="150" y1="270" x2="245" y2="270"/>
                <line x1="118" y1="60" x2="60" y2="60"/>
                <line x1="118" y1="150" x2="60" y2="150"/>
              </g>
              <g fontSize="13" fill="#272727">
                <text x="252" y="34">High — <T th="ราคาสูงสุด" en="highest price" /></text>
                <text x="252" y="99">Close — <T th="ราคาปิด (แท่งเขียว = ปิดสูงกว่าเปิด)" en="closing price (green = closed higher than open)" /></text>
                <text x="252" y="209">Open — <T th="ราคาเปิด" en="opening price" /></text>
                <text x="252" y="274">Low — <T th="ราคาต่ำสุด" en="lowest price" /></text>
              </g>
              <g fontSize="12" fill="#6f6d66" textAnchor="end">
                <text x="55" y="64"><T th="ไส้เทียน (wick)" en="Wick" /></text>
                <text x="55" y="154"><T th="ตัวเทียน (body)" en="Body" /></text>
              </g>
            </svg>
            <div className="figcap"><T th="กายวิภาคของแท่งเทียน 1 แท่ง" en="Anatomy of a single candlestick" /></div>
          </div>

          <p><T th={<>สิ่งที่ผมอยากให้คุณโฟกัสเป็นพิเศษคือ <b>ไส้เทียน (wick)</b> มันคือ "ร่องรอยการปฏิเสธ" — ราคาพยายามไปถึงตรงนั้นแล้ว แต่ถูกดันกลับ ไส้ยาว ๆ บอกเราว่าฝั่งหนึ่งพยายามดันราคา แต่อีกฝั่งสวนกลับแรงกว่า นี่คือเบาะแสแรกของพฤติกรรมราคา</>} en={<>What I want you to focus on especially is the <b>wick</b>. It's "a trace of rejection" — the price tried to reach there, but got pushed back. A long wick tells us one side tried to push the price, but the other side pushed back harder. This is the first clue to price behavior.</>} /></p>

          <div className="sechead"><span className="n">02</span><h2><T th="เทรนด์ — ทิศทางของกระแสน้ำ" en="Trend — the Direction of the Current" /></h2></div>
          <p><T th={<>เมื่อต่อแท่งเทียนหลาย ๆ แท่งเข้าด้วยกัน เราจะเห็น "ทิศทาง" ขาขึ้น (Uptrend) คือราคาทำ <b>ยอดสูงขึ้น และฐานสูงขึ้น</b> (Higher High / Higher Low) เรื่อย ๆ:</>} en={<>When you connect many candlesticks together, we see a "direction". An uptrend is when price keeps making <b>higher highs and higher lows</b> (Higher High / Higher Low):</>} /></p>

          <div className="figure">
            <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" fontFamily="Geist Mono, monospace">
              <polyline points="20,200 90,120 140,160 210,90 260,125 330,55 380,90 460,30" fill="none" stroke="#5a7d5a" strokeWidth="2.5"/>
              <g fill="#5a7d5a" fontSize="11">
                <circle cx="90" cy="120" r="4"/><circle cx="210" cy="90" r="4"/><circle cx="330" cy="55" r="4"/>
                <text x="84" y="110" textAnchor="middle">HH</text><text x="204" y="80" textAnchor="middle">HH</text><text x="324" y="45" textAnchor="middle">HH</text>
              </g>
              <g fill="#9a7b3f" fontSize="11">
                <circle cx="140" cy="160" r="4"/><circle cx="260" cy="125" r="4"/><circle cx="380" cy="90" r="4"/>
                <text x="140" y="180" textAnchor="middle">HL</text><text x="260" y="145" textAnchor="middle">HL</text><text x="380" y="110" textAnchor="middle">HL</text>
              </g>
              <text x="470" y="34" fontSize="12" fill="#272727">Uptrend ↗</text>
            </svg>
            <div className="figcap"><T th="ขาขึ้น = ยอดสูงขึ้น (HH) + ฐานสูงขึ้น (HL) · ขาลงคือกลับกัน" en="Uptrend = higher highs (HH) + higher lows (HL) · downtrend is the reverse" /></div>
          </div>

          <p><T th={<>หลักง่าย ๆ สำหรับมือใหม่: <b>เทรดไปตามเทรนด์ ปลอดภัยกว่าสวนเทรนด์เสมอ</b> ถ้าเทรนด์เป็นขาขึ้น เรามองหาจังหวะ Buy ไม่ใช่ฝืน Sell สวนกระแสน้ำ</>} en={<>A simple rule for beginners: <b>trading with the trend is always safer than fighting it.</b> If the trend is up, we look for a Buy opportunity, not force a Sell against the current.</>} /></p>

          <div className="sechead"><span className="n">03</span><h2><T th="แนวรับ - แนวต้าน — โซนที่มีเหตุผล" en="Support / Resistance — Zones With a Reason" /></h2></div>
          <p><T th={<><b>แนวรับ (Support)</b> คือโซนที่ราคาเคยลงไปแล้วเด้งขึ้น <b>แนวต้าน (Resistance)</b> คือโซนที่ราคาเคยขึ้นไปแล้วถูกตีกลับ เราเรียกโซนสำคัญเหล่านี้รวม ๆ ว่า <b>Key Level</b>:</>} en={<><b>Support</b> is a zone where price has fallen to before and bounced up. <b>Resistance</b> is a zone where price has risen to before and got pushed back. We collectively call these important zones a <b>Key Level</b>:</>} /></p>

          <div className="figure">
            <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" fontFamily="Geist Mono, monospace">
              <line x1="20" y1="60" x2="560" y2="60" stroke="#9d5a4f" strokeWidth="1.5" strokeDasharray="6 5"/>
              <line x1="20" y1="200" x2="560" y2="200" stroke="#5a7d5a" strokeWidth="1.5" strokeDasharray="6 5"/>
              <polyline points="30,150 90,200 150,110 210,60 270,120 330,200 390,130 450,60 510,100" fill="none" stroke="#272727" strokeWidth="2"/>
              <g fill="#5a7d5a"><circle cx="90" cy="200" r="4"/><circle cx="330" cy="200" r="4"/></g>
              <g fill="#9d5a4f"><circle cx="210" cy="60" r="4"/><circle cx="450" cy="60" r="4"/></g>
              <text x="26" y="50" fontSize="12" fill="#9d5a4f"><T th="แนวต้าน" en="Resistance" /> (Resistance)</text>
              <text x="26" y="222" fontSize="12" fill="#5a7d5a"><T th="แนวรับ" en="Support" /> (Support)</text>
            </svg>
            <div className="figcap"><T th="ราคามักกลับตัวที่ Key Level เดิม ๆ ซ้ำ ๆ" en="Price often reverses at the same Key Levels, again and again" /></div>
          </div>

          <p><T th="แต่นี่คือจุดที่แยกเทรดเดอร์มีวินัยออกจากมือใหม่:" en="But this is the point that separates a disciplined trader from a beginner:" /></p>
          <div className="pull"><T th="เราไม่ได้เทรดทุกโซนที่ราคาแตะ — เราเลือกเฉพาะ Key Level ที่มีเหตุผล มีบริบท และสอดคล้องกับเทรนด์ใหญ่เท่านั้น" en="We don't trade every zone price touches — we only pick Key Levels that have a reason, have context, and align with the larger trend." /></div>
          <p><T th={<>และก่อนจะหาจุดเข้า (Entry) เราต้องดู "ภาพใหญ่" ก่อนเสมอ — ดูกราฟ Timeframe ใหญ่ (HTF) เพื่อรู้บริบทและเทรนด์หลัก แล้วค่อยลงไป Timeframe เล็ก (LTF) เพื่อหาจังหวะเข้า การจับคู่สองอย่างนี้ให้สอดคล้องกัน เราเรียกว่า <b>Timeframe Alignment</b> — เป็นทักษะที่เราฝึกกันต่อในคอมมูนิตี้</>} en={<>And before looking for an entry, we must always look at the "big picture" first — check the higher timeframe (HTF) chart to know the context and main trend, then drop down to a lower timeframe (LTF) to find the entry timing. Matching these two together is what we call <b>Timeframe Alignment</b> — a skill we keep training in the community.</>} /></p>

          <div className="loop">
            <div className="llabel"><T th="ก้าวต่อไป — ลงลึกใน DISCORD" en="Next Step — Go Deeper in Discord" /></div>
            <p><T th={<>สังเกตไหมว่าบางโซนราคาเด้งกลับสวย ๆ แต่บางโซนกลับทะลุผ่านไปเฉย ๆ? เบื้องหลังมันมีสิ่งที่เรียกว่า <b>liquidity (สภาพคล่อง)</b> — บริเวณที่มีคำสั่งซื้อขายกองอยู่ ราคามักวิ่งไป "กวาด" มันก่อน แล้วค่อยกลับตัว นี่คือหัวใจของวิธีที่ผมเทรดจริง (สาย Smart Money) ซึ่งลึกเกินกว่าจะอัดหมดในเล่มสำหรับมือใหม่ — <b>เราเจาะลึกและฝึกอ่านมันแบบลงมือจริงกันใน Discord</b></>} en={<>Have you noticed that price bounces beautifully at some zones, but just blows straight through others? Behind this is something called <b>liquidity</b> — an area where a pile of buy/sell orders sits. Price often runs to "sweep" it first, then reverses. This is the core of how I actually trade (the Smart Money style), which is too deep to cram into a beginner's book — <b>we go deep and practice reading it hands-on in Discord.</b></>} /></p>
          </div>

          <div className="note">
            <div className="nlabel">CERFINITS NOTE — <T th="บันทึกจากกัน" en="A note from Kan" /></div>
            <p><T th={<>ตอนผมเริ่มใหม่ ผมขีดเส้นแนวรับแนวต้านเต็มจอไปหมด จนไม่รู้จะเทรดอันไหน — พอผมฝึก "ตัดให้เหลือเฉพาะเส้นที่สำคัญจริง ๆ" การตัดสินใจก็คมขึ้นทันที <b>กราฟที่ดีไม่ใช่กราฟที่มีเส้นเยอะ แต่เป็นกราฟที่มีเฉพาะเส้นที่มีความหมาย</b></>} en={<>When I started, I drew support/resistance lines all over my screen, until I didn't know which one to trade off. Once I practiced "cutting it down to only the truly important lines", my decisions got sharper immediately. <b>A good chart isn't one with lots of lines — it's one with only the lines that mean something.</b></>} /></p>
          </div>

          <div className="summary">
            <div className="slabel"><T th="สรุปให้จำง่าย" en="Easy-Recall Summary" /></div>
            <ul>
              <li><T th="แท่งเทียนบอก Open/High/Low/Close · ไส้เทียน (wick) = ร่องรอยการปฏิเสธราคา" en="A candlestick shows Open/High/Low/Close · a wick = a trace of price rejection" /></li>
              <li><T th="เทรนด์ขาขึ้น = HH + HL · เทรดตามเทรนด์ปลอดภัยกว่าสวน" en="An uptrend = HH + HL · trading with the trend is safer than against it" /></li>
              <li><T th="แนวรับ/แนวต้าน (Key Level) = โซนที่ราคาเคยกลับตัว" en="Support/Resistance (Key Level) = zones where price has reversed before" /></li>
              <li><T th="ไม่เทรดทุกโซน — เลือกเฉพาะที่มีบริบทและตรงกับเทรนด์ใหญ่" en="Don't trade every zone — pick only ones with context that align with the larger trend" /></li>
              <li><T th="ดู HTF เพื่อบริบท แล้วค่อยลง LTF หาจุดเข้า (Timeframe Alignment)" en="Check HTF for context, then drop to LTF for entry timing (Timeframe Alignment)" /></li>
            </ul>
          </div>

          <div className="checklist">
            <div className="clabel"><T th="เช็กลิสต์ท้ายบท — ติ๊กให้ครบก่อนไปบทต่อไป" en="End-of-Chapter Checklist — Check all before moving on" /></div>
            <ul>
              <li><T th="ผมอ่านองค์ประกอบของแท่งเทียนได้ และเข้าใจความหมายของไส้เทียน" en="I can read the parts of a candlestick and understand what the wick means" /></li>
              <li><T th="ผมแยกออกว่าเทรนด์ขาขึ้น/ขาลง/ออกข้าง ต่างกันยังไง" en="I can tell the difference between an uptrend/downtrend/sideways trend" /></li>
              <li><T th="ผมรู้จักแนวรับ-แนวต้าน และจะเลือกเฉพาะโซนที่มีเหตุผล" en="I know support/resistance and will only pick zones that have a reason" /></li>
              <li><T th="ผมเข้าใจว่าต้องดูภาพใหญ่ (HTF) ก่อนหาจุดเข้าเสมอ" en="I understand I must always check the big picture (HTF) before finding an entry" /></li>
            </ul>
          </div>

          <div className="next">
            <div className="nx"><T th="บทต่อไป — บทที่ 06" en="Next Chapter — Chapter 06" /></div>
            <p><T th={<>บทที่สำคัญที่สุดของทั้งเล่มกำลังมา: <b>Risk Management</b> — วิชาที่ทำให้คุณ "อยู่รอด" ในตลาดได้นานพอที่จะเก่งขึ้น เพราะต่อให้อ่านกราฟเก่งแค่ไหน ถ้าคุมความเสี่ยงไม่เป็น สุดท้ายก็ล้างพอร์ต</>} en={<>The most important chapter in the whole book is coming up: <b>Risk Management</b> — the subject that lets you "survive" in the market long enough to get good. Because no matter how well you read charts, if you can't control risk, you'll blow up your account eventually.</>} /></p>
          </div>

        </div>

        <div className="wrap bookfoot">
          <span>CERFINITS — GOLD START</span>
          <span><T th="บทที่ 05 · อ่านกราฟด้วยสายตาแบบ Cerfinits" en="Chapter 05 · Reading Charts With the Cerfinits Eye" /></span>
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
