import type { Metadata } from "next";
import { T } from "@/components/site/LangContext";

// Generated from gold-start-glossary.html by scripts/convert-gold-start.mjs — edit freely,
// but re-running the script will overwrite this file.
export const metadata: Metadata = {
  title: "GOLD START — อภิธานศัพท์ · Cerfinits",
  description: "รวมศัพท์อังกฤษที่คุณจะเจอบนแพลตฟอร์มจริง พร้อมความหมายภาษาไทยแบบเข้าใจง่าย ไว้เปิดดูยามต้องการ",
  alternates: { canonical: "/gold-start/glossary" },
};

export default function Page() {
  return (
    <>
      <div className="book">

        <div className="wrap runhead">
          <span className="brand"><span className="dot"></span> Cerfinits</span>
          <span>GOLD START · GLOSSARY</span>
        </div>

        <div className="wrap opener" style={{ padding: "64px 0 40px" }}>
          <span className="kicker"><T th="ภาคผนวก · อภิธานศัพท์" en="Appendix · Glossary" /></span>
          <h1><T th="คำศัพท์เทรด" en="Every Trading Term" /><br /><T th="ทั้งหมดในเล่ม" en="in This Book" /></h1>
          <p className="lead"><T th="รวมศัพท์อังกฤษที่คุณจะเจอบนแพลตฟอร์มจริง พร้อมความหมายภาษาไทยแบบเข้าใจง่าย ไว้เปิดดูยามต้องการ" en="Every English term you'll encounter on the real platform, with an easy-to-understand explanation, ready whenever you need it." /></p>
        </div>

        <div className="wrap content">

          <div className="sechead"><span className="n">A</span><h2><T th="คำศัพท์พื้นฐาน" en="Basic Terms" /></h2></div>
          <table className="dtable">
            <tbody>
              <tr><td>XAUUSD</td><td><T th="ราคาทองคำ 1 ออนซ์ เทียบกับดอลลาร์สหรัฐ" en="The price of 1 ounce of gold against the US Dollar" /></td></tr>
              <tr><td>CFD</td><td><T th="สัญญาทำกำไร/ขาดทุนจากส่วนต่างราคา โดยไม่ต้องถือสินทรัพย์จริง" en="A contract for profiting/losing on a price difference, without holding the actual asset" /></td></tr>
              <tr><td>Pip / Point</td><td><T th="หน่วยเล็กที่สุดที่ใช้นับการขยับของราคา" en="The smallest unit used to count price movement" /></td></tr>
              <tr><td>Lot</td><td><T th="ขนาดของไม้ที่เปิด (1.00 lot ทอง = 100 ออนซ์ → ขยับ $1 = $100)" en="The size of a position (1.00 lot of gold = 100 ounces → a $1 move = $100)" /></td></tr>
              <tr><td>Spread</td><td><T th="ส่วนต่างราคา Bid/Ask = ต้นทุนการเข้าออเดอร์" en="The Bid/Ask price difference = the cost of entering an order" /></td></tr>
              <tr><td>Bid / Ask</td><td><T th="ราคาที่คุณขายได้ / ราคาที่คุณซื้อได้" en="The price you can sell at / the price you can buy at" /></td></tr>
              <tr><td>Leverage</td><td><T th="การที่โบรกให้ยืม เพื่อคุมสัญญาใหญ่ด้วยทุนน้อย (ขยายทั้งสองทาง)" en="A broker lending you the ability to control a large contract with little capital (amplifies both directions)" /></td></tr>
              <tr><td>Margin</td><td><T th="เงินค้ำที่ใช้ในการเปิดออเดอร์" en="The collateral money used to open an order" /></td></tr>
              <tr><td>Buy / Sell</td><td><T th="เปิดสถานะคาดราคาขึ้น / คาดราคาลง" en="Opening a position expecting price to rise / expecting price to fall" /></td></tr>
              <tr><td>Entry</td><td><T th="จุดเข้าเทรด" en="The trade entry point" /></td></tr>
              <tr><td>Stop Loss (SL)</td><td><T th="จุดตัดขาดทุนอัตโนมัติ — เกราะป้องกันพอร์ต" en="The automatic loss-cutting point — your account's armor" /></td></tr>
              <tr><td>Take Profit (TP)</td><td><T th="จุดปิดทำกำไรอัตโนมัติ" en="The automatic profit-closing point" /></td></tr>
              <tr><td>R:R (Risk:Reward)</td><td><T th="อัตราส่วนความเสี่ยงต่อผลตอบแทน (เป้าหมายมือใหม่ ≥ 1:2)" en="The ratio of risk to reward (beginner target ≥ 1:2)" /></td></tr>
              <tr><td>Drawdown</td><td><T th="การลดลงของพอร์ตจากจุดสูงสุด" en="The decline of an account from its peak" /></td></tr>
              <tr><td>Demo Account</td><td><T th="บัญชีเงินจำลองไว้ฝึก — กราฟจริง ราคาจริง เงินไม่จริง" en="A simulated-money account for practice — real charts, real prices, fake money" /></td></tr>
              <tr><td>Market / Pending Order</td><td><T th="คำสั่งเข้าทันที / คำสั่งตั้งรอให้ราคามาถึงจุดที่กำหนด" en="An order that enters immediately / an order set to trigger once price reaches a specified level" /></td></tr>
            </tbody>
          </table>

          <div className="sechead"><span className="n">B</span><h2><T th="การอ่านกราฟ" en="Reading Charts" /></h2></div>
          <table className="dtable">
            <tbody>
              <tr><td>Candlestick</td><td><T th="แท่งเทียน บอก Open/High/Low/Close ในช่วงเวลาหนึ่ง" en="A candlestick, showing Open/High/Low/Close over a period" /></td></tr>
              <tr><td><T th="Wick (ไส้เทียน)" en="Wick" /></td><td><T th="ส่วนเส้นบาง = ร่องรอยการปฏิเสธราคา" en="The thin line part = a trace of price rejection" /></td></tr>
              <tr><td>Trend</td><td><T th="ทิศทางหลักของราคา (ขาขึ้น / ขาลง / ออกข้าง)" en="The main direction of price (up / down / sideways)" /></td></tr>
              <tr><td>HH / HL</td><td><T th="Higher High / Higher Low = ยอดและฐานที่สูงขึ้น (สัญญาณขาขึ้น)" en="Higher High / Higher Low = a rising peak and base (an uptrend signal)" /></td></tr>
              <tr><td>Support / Resistance</td><td><T th="แนวรับ / แนวต้าน — โซนที่ราคาเคยกลับตัว" en="Support / Resistance — zones where price has reversed before" /></td></tr>
              <tr><td>Key Level</td><td><T th="โซนราคาสำคัญที่ราคาเคารพซ้ำ ๆ" en="An important price zone that price respects repeatedly" /></td></tr>
              <tr><td>HTF / LTF</td><td><T th="Timeframe ใหญ่ (ภาพรวม) / Timeframe เล็ก (จุดเข้า)" en="Higher timeframe (big picture) / lower timeframe (entry point)" /></td></tr>
              <tr><td>Timeframe Alignment</td><td><T th="การจับภาพใหญ่กับจุดเข้าให้สอดคล้องกัน" en="Matching the big picture with the entry point" /></td></tr>
            </tbody>
          </table>

          <div className="sechead"><span className="n">C</span><h2><T th="ขั้นต่อไป — Smart Money / ICT (เรียนลึกใน Discord)" en="The Next Step — Smart Money / ICT (Go Deeper in Discord)" /></h2></div>
          <table className="dtable">
            <tbody>
              <tr><td>Liquidity</td><td><T th="สภาพคล่อง — บริเวณที่มีคำสั่งซื้อขายกองอยู่" en="An area where a pile of buy/sell orders sits" /></td></tr>
              <tr><td>Liquidity Sweep</td><td><T th={<>การที่ราคาวิ่งไป "กวาด" คำสั่งก่อนกลับตัว</>} en={<>Price running to "sweep" orders before reversing</>} /></td></tr>
              <tr><td>FVG (Fair Value Gap)</td><td><T th="ช่องว่างราคาที่มักถูกวิ่งกลับมาเติมภายหลัง" en="A price gap that price often runs back to fill later" /></td></tr>
              <tr><td>POI (Point of Interest)</td><td><T th="โซนที่ได้เปรียบที่สุดในการเข้าเทรด" en="The most advantageous zone for entering a trade" /></td></tr>
              <tr><td>BOS (Break of Structure)</td><td><T th="การทะลุโครงสร้าง ที่บอกการเปลี่ยนเทรนด์" en="A structural break that signals a trend change" /></td></tr>
              <tr><td>Market Structure</td><td><T th="โครงสร้างการขึ้น-ลงของราคา" en="The structure of price's ups and downs" /></td></tr>
              <tr><td>Smart Money / ICT</td><td><T th={<>แนวคิดการอ่าน "รอยเท้า" ของเงินรายใหญ่บนกราฟ</>} en={<>The concept of reading big money's "footprints" on the chart</>} /></td></tr>
            </tbody>
          </table>

          <div className="loop">
            <div className="llabel"><T th="ก้าวต่อไป — ลงลึกใน DISCORD" en="Next Step — Go Deeper in Discord" /></div>
            <p><T th={<>กลุ่มคำศัพท์ชุด C คือหัวใจของเมธอดที่ผมเทรดจริง — เราเจาะลึกและฝึกใช้มันแบบลงมือจริงกันในคอมมูนิตี้ · <b>discord.gg/jANDuDvn</b></>} en={<>The Group C terms are the heart of the method I actually trade — we go deep and practice using it hands-on in the community · <b>discord.gg/jANDuDvn</b></>} /></p>
          </div>

        </div>

        <div className="wrap bookfoot">
          <span>CERFINITS — GOLD START</span>
          <span><T th="อภิธานศัพท์" en="Glossary" /></span>
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
