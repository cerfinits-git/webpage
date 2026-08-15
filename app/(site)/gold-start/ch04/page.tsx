import type { Metadata } from "next";
import { T } from "@/components/site/LangContext";

// Generated from gold-start-ch04.html by scripts/convert-gold-start.mjs — edit freely,
// but re-running the script will overwrite this file.
export const metadata: Metadata = {
  title: "GOLD START — บทที่ 04 · ภาษาของเทรดเดอร์ · Cerfinits",
  description: "pip · lot · spread · leverage — สี่คำนี้คือคำที่คุณจะเจอทุกวัน ถ้าเข้าใจมันชัด คุณจะรู้ทันทีว่าแต่ละไม้ที่กด หมายถึงเงินจริงเท่าไหร่ และทำไมบางคนถึงล้างพอร์ตในไม้เดียว",
  alternates: { canonical: "/gold-start/ch04" },
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
          <span className="kicker"><T th="ภาค 2 — รู้จักสนามรบ" en="Part 2 — Know the Battlefield" /></span>
          <div className="chno"><T th="บทที่ / 04" en="Chapter / 04" /></div>
          <h1><T th="ภาษาของเทรดเดอร์" en="The Trader's Language" /></h1>
          <p className="lead"><T th="pip · lot · spread · leverage — สี่คำนี้คือคำที่คุณจะเจอทุกวัน ถ้าเข้าใจมันชัด คุณจะรู้ทันทีว่าแต่ละไม้ที่กด หมายถึงเงินจริงเท่าไหร่ และทำไมบางคนถึงล้างพอร์ตในไม้เดียว" en="pip · lot · spread · leverage — four words you'll run into every day. Understand them clearly and you'll instantly know how much real money each trade you press represents, and why some people blow their whole account on a single trade." /></p>
        </div>

        <div className="wrap content">

          <p className="intro"><T th="มือใหม่กลัวศัพท์พวกนี้ ทั้งที่จริงมันง่ายมากถ้าอธิบายด้วยตัวเลขจริง บทนี้สั้นแต่สำคัญ เพราะมันคือพื้นฐานที่ทำให้บท Risk Management (บทที่ 6) เข้าใจได้ง่ายขึ้นมาก" en="Beginners fear these terms, even though they're actually very simple once explained with real numbers. This chapter is short but important — it's the foundation that makes the Risk Management chapter (Chapter 6) much easier to understand." /></p>

          <div className="sechead"><span className="n">01</span><h2><T th="Pip กับ Lot — ขยับเท่านี้ คือเงินเท่าไหร่" en="Pip and Lot — How Much Money Is This Move Worth" /></h2></div>
          <p><T th={<><b>Pip (หรือ point)</b> คือหน่วยเล็ก ๆ ที่แพลตฟอร์มใช้นับการขยับของราคา สำหรับทอง โบรกแต่ละเจ้านับไม่เหมือนกันเป๊ะ (บางเจ้านับ $1 = 100 points) — แต่คุณ <b>ยังไม่ต้องจำนิยามให้เป๊ะ</b> สิ่งที่สำคัญกว่าคือคำถามว่า "ราคาขยับ แล้วเป็นเงินเท่าไหร่" ซึ่งคำตอบขึ้นอยู่กับ <b>Lot</b></>} en={<><b>A pip (or point)</b> is the small unit a platform uses to count price movement. For gold, brokers don't all count it exactly the same way (some count $1 = 100 points) — but you <b>don't need to memorize the exact definition yet</b>. What matters more is the question "the price moved, so how much money is that", and the answer depends on <b>Lot</b>.</>} /></p>
          <p><T th={<><b>Lot</b> คือขนาดของไม้ที่คุณเปิด มาตรฐานคือ <b>1.00 lot ของทอง = 100 ออนซ์</b> แปลว่าถ้าราคาทองขยับ $1 คุณจะได้/เสีย $100 ต่อ 1 lot จากตรงนี้คำนวณง่าย ๆ:</>} en={<><b>Lot</b> is the size of the position you open. The standard is <b>1.00 lot of gold = 100 ounces</b>, meaning that if gold's price moves $1, you gain/lose $100 per lot. From here, the math is simple:</>} /></p>

          <table className="dtable">
            <thead><tr><th><T th="ขนาดไม้ (lot)" en="Position Size (lot)" /></th><th><T th="ทองขยับ $1" en="Gold Moves $1" /></th><th><T th="ทองขยับ $10" en="Gold Moves $10" /></th></tr></thead>
            <tbody>
              <tr><td className="mono">0.01 <span style={{ color: "var(--muted)" }}>(<T th="เล็กสุด" en="smallest" />)</span></td><td className="mono">$1</td><td className="mono">$10</td></tr>
              <tr><td className="mono">0.10</td><td className="mono">$10</td><td className="mono">$100</td></tr>
              <tr><td className="mono">1.00</td><td className="mono">$100</td><td className="mono">$1,000</td></tr>
            </tbody>
          </table>
          <div className="pull"><T th="ยิ่ง lot ใหญ่ ทุกการขยับเล็ก ๆ ยิ่งเป็นเงินก้อนใหญ่ — นี่คือเหตุผลที่มือใหม่ควรเริ่มที่ 0.01 lot เสมอ" en="The bigger the lot, the bigger every small move becomes in real money — this is why beginners should always start at 0.01 lot." /></div>

          <div className="sechead"><span className="n">02</span><h2><T th="Spread — ต้นทุนที่มองไม่เห็น" en="Spread — The Invisible Cost" /></h2></div>
          <p><T th={<>ราคาในตลาดมีสองค่าเสมอ: ราคาที่คุณ <b>ขายได้</b> (Bid) และราคาที่คุณ <b>ซื้อได้</b> (Ask) ส่วนต่างของสองค่านี้เรียกว่า <b>Spread</b> และมันคือต้นทุนของคุณ:</>} en={<>The market always has two prices: the price you can <b>sell</b> at (Bid) and the price you can <b>buy</b> at (Ask). The difference between them is called the <b>Spread</b>, and it's your cost:</>} /></p>

          <div className="quotebox">
            <div className="qc sell"><div className="ql">SELL (Bid)</div><div className="qp">3,419.80</div></div>
            <div className="qmid"><div className="ql">SPREAD</div><div className="qp">0.30</div></div>
            <div className="qc buy"><div className="ql">BUY (Ask)</div><div className="qp">3,420.10</div></div>
          </div>
          <p><T th={<>พอคุณเปิดออเดอร์ คุณจะ <b>ติดลบค่าสเปรดทันที</b> นิดหน่อย (ในตัวอย่างคือ 0.30) นี่ไม่ใช่ความผิดพลาด — มันคือค่าผ่านทางของการเข้าตลาด ยิ่งสเปรดแคบ ต้นทุนยิ่งถูก (นี่คือเหตุผลที่เราเลือกโบรกสเปรดทองแคบในบทที่แล้ว)</>} en={<>The moment you open an order, you're <b>immediately down the spread</b> by a small amount (0.30 in the example). This isn't a mistake — it's the toll for entering the market. The tighter the spread, the cheaper the cost (this is why we chose a broker with tight gold spreads in the last chapter).</>} /></p>

          <div className="sechead"><span className="n">03</span><h2><T th="Leverage — ดาบสองคมที่ทุกคนเข้าใจผิด" en="Leverage — The Double-Edged Sword Everyone Misunderstands" /></h2></div>
          <p><T th={<><b>Leverage (เลเวอเรจ)</b> คือการที่โบรก "ให้ยืม" เพื่อให้คุณคุมสัญญาขนาดใหญ่ด้วยทุนน้อย เช่น leverage 1:100 หมายความว่า ทุก $1 ของคุณ คุมมูลค่าได้เหมือน $100:</>} en={<><b>Leverage</b> is the broker "lending" you the ability to control a large contract with little capital. For example, leverage 1:100 means every $1 of yours controls value equivalent to $100:</>} /></p>

          <div className="specs">
            <div className="spec"><div className="sv">$100</div><div className="sl"><T th="เงินทุนของคุณ" en="Your Capital" /></div></div>
            <div className="spec"><div className="sv">1 : 100</div><div className="sl"><T th="เลเวอเรจ" en="Leverage" /></div></div>
            <div className="spec"><div className="sv">≈ $10,000</div><div className="sl"><T th="มูลค่าที่คุมได้" en="Value Controlled" /></div></div>
            <div className="spec"><div className="sv">×100</div><div className="sl"><T th={<>ขยายทั้งกำไร <b>และ</b> ขาดทุน</>} en={<>Amplifies both profit <b>and</b> loss</>} /></div></div>
          </div>

          <p><T th="คนส่วนใหญ่มองว่า leverage สูง = โอกาสรวยเร็ว นั่นคือกับดักที่ทำให้คนล้างพอร์ต ความจริงคือ:" en="Most people see high leverage = a chance to get rich fast. That's the trap that blows up accounts. The truth is:" /></p>
          <div className="pull"><T th={<>Leverage ไม่ได้ทำให้คุณรวยเร็ว — มันทำให้คุณ "เจ๊งเร็ว" ถ้าไม่มีวินัยคุมความเสี่ยง</>} en={<>Leverage doesn't make you rich fast — it makes you "broke fast" if you lack the discipline to manage risk.</>} /></div>
          <p><T th={<>ข่าวดีคือ leverage ที่สูงไม่ได้แปลว่าคุณต้องเสี่ยงมาก สิ่งที่กำหนดความเสี่ยงจริง ๆ ไม่ใช่ leverage แต่คือ <b>ขนาด lot ที่คุณเลือก</b> และ <b>จุด Stop Loss</b> ที่คุณตั้ง — เราจะคุมมันให้เป็นระบบในบทที่ 6</>} en={<>The good news is that high leverage doesn't mean you must take on high risk. What actually determines your real risk isn't leverage — it's the <b>lot size you choose</b> and the <b>Stop Loss</b> you set. We'll turn this into a system in Chapter 6.</>} /></p>

          <div className="note">
            <div className="nlabel">CERFINITS NOTE — <T th="บันทึกจากกัน" en="A note from Kan" /></div>
            <p><T th={<>ตอนเริ่มต้น ผมเคยหลงคิดว่า leverage สูง ๆ คือเครื่องเร่งความรวย — จนมันเร่งให้ผมล้างพอร์ตในเวลาไม่กี่วัน บทเรียนคือ leverage เป็นแค่เครื่องมือ ไม่ใช่กลยุทธ์ <b>คนที่อยู่รอด ไม่ได้คุม leverage ให้ต่ำ แต่คุม "ขนาดไม้" ให้พอดีกับความเสี่ยงที่รับได้เสมอ</b></>} en={<>When I started, I mistakenly thought high leverage was a wealth accelerator — until it accelerated me straight into blowing up my account within a few days. The lesson: leverage is just a tool, not a strategy. <b>Survivors don't keep leverage low — they always keep "position size" matched to the risk they can actually bear.</b></>} /></p>
          </div>

          <div className="summary">
            <div className="slabel"><T th="สรุปให้จำง่าย" en="Easy-Recall Summary" /></div>
            <ul>
              <li><T th="1.00 lot ทอง = 100 ออนซ์ → ราคาขยับ $1 = $100 ต่อ lot" en="1.00 lot of gold = 100 ounces → a $1 price move = $100 per lot" /></li>
              <li><T th="มือใหม่เริ่มที่ 0.01 lot เสมอ (ขยับ $1 = $1)" en="Beginners always start at 0.01 lot (a $1 move = $1)" /></li>
              <li><T th="Spread = ส่วนต่าง Bid/Ask = ต้นทุนที่ติดลบทันทีตอนเปิดไม้" en="Spread = the Bid/Ask difference = a cost you're down the moment you open a trade" /></li>
              <li><T th="Leverage = ยืมเพื่อคุมของใหญ่ ขยายทั้งกำไรและขาดทุน" en="Leverage = borrowing to control something bigger, amplifying both profit and loss" /></li>
              <li><T th={<>ความเสี่ยงจริงมาจาก "ขนาด lot + จุด SL" ไม่ใช่ตัวเลข leverage</>} en={<>Real risk comes from "lot size + SL point", not the leverage number</>} /></li>
            </ul>
          </div>

          <div className="checklist">
            <div className="clabel"><T th="เช็กลิสต์ท้ายบท — ติ๊กให้ครบก่อนไปบทต่อไป" en="End-of-Chapter Checklist — Check all before moving on" /></div>
            <ul>
              <li><T th="ผมรู้แล้วว่า lot กำหนดว่าราคาขยับ = เงินเท่าไหร่" en="I now know that lot determines how much a price move is worth" /></li>
              <li><T th="ผมจะเริ่มเทรดที่ 0.01 lot" en="I will start trading at 0.01 lot" /></li>
              <li><T th="ผมเข้าใจว่า spread คือต้นทุนการเข้าออเดอร์" en="I understand that spread is the cost of entering an order" /></li>
              <li><T th="ผมเข้าใจว่า leverage ขยายทั้งสองทาง และความเสี่ยงจริงมาจากขนาดไม้" en="I understand that leverage amplifies both directions, and real risk comes from position size" /></li>
            </ul>
          </div>

          <div className="next">
            <div className="nx"><T th="บทต่อไป — บทที่ 05" en="Next Chapter — Chapter 05" /></div>
            <p><T th={<>จบภาค "รู้จักสนามรบ" แล้ว ต่อไปคือภาคที่สนุกที่สุด: <b>อ่านกราฟให้เป็น</b> ด้วยสายตาแบบ Cerfinits — แท่งเทียน เทรนด์ แนวรับแนวต้าน และจุดเริ่มต้นของการมองตลาดแบบมีบริบท</>} en={<>Part "Know the Battlefield" is done. Next is the most fun part: <b>learning to read charts</b> with the Cerfinits eye — candlesticks, trends, support/resistance, and the beginning of viewing the market with context.</>} /></p>
          </div>

        </div>

        <div className="wrap bookfoot">
          <span>CERFINITS — GOLD START</span>
          <span><T th="บทที่ 04 · ภาษาของเทรดเดอร์" en="Chapter 04 · The Trader's Language" /></span>
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
