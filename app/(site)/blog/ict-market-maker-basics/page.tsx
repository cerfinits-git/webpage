import ArticleShell, { articleMetadata } from "@/components/site/ArticleShell";
import { getPost } from "@/lib/posts";
import { T } from "@/components/site/LangContext";

const post = getPost("ict-market-maker-basics")!;

export const metadata = articleMetadata(post);

export default function Page() {
  return (
    <ArticleShell
      post={post}
      cta={{
        title: (
          <>
            Full ICT &amp; MMM Guide
          </>
        ),
        text: <T th="สรุปแก่นวิชา ICT + Market Maker Model แบบครบ — อ่านร่องรอย Smart Money แล้วเข้าเทรดในจุดที่ได้เปรียบที่สุด หรือสมัครรับบทความใหม่ฟรีทางอีเมลด้านล่าง" en="Complete core summary of ICT + Market Maker Model — read the footprints of Smart Money and enter trades at the most advantageous points, or subscribe below for free new articles via email." />,
        related: (
          <>
            📘{" "}
            <a href="https://narabodin.gumroad.com/l/cerfinits" target="_blank" rel="noopener">
              <T th="ดูอีบุ๊ก “Full ICT & MMM Guide” บน Gumroad ($59)" en="View the e-book 'Full ICT & MMM Guide' on Gumroad ($59)" />
            </a>
          </>
        ),
      }}
    >
      <p>
        <T 
          th={<>ICT (Inner Circle Trader) และแนวคิด Market Maker Model มองตลาดต่างจากอินดิเคเตอร์ทั่วไป — แทนที่จะถามว่า “เส้นตัดกันหรือยัง” มันถามว่า <strong>“เงินก้อนใหญ่ต้องการ liquidity จากตรงไหน”</strong> บทความนี้ปูพื้น 3 แนวคิดหลักที่ทำให้คุณเริ่มมองกราฟแบบ Smart Money ได้</>} 
          en={<>ICT (Inner Circle Trader) and the Market Maker Model concept view the market differently from traditional indicators. Instead of asking 'Have the lines crossed yet?', it asks <strong>'Where does big money need liquidity from?'</strong> This article lays the foundation of 3 core concepts that will start you looking at charts like Smart Money.</>} 
        />
      </p>

      <h2><T th="แนวคิดแกนกลาง: ตลาดวิ่งหา Liquidity" en="Core Concept: The Market Seeks Liquidity" /></h2>
      <p>
        <T th={<>รายใหญ่ต้องเทรดด้วยปริมาณมหาศาล พวกเขาจึงต้องการ “คู่สัญญา” — ก็คือ stop loss และ pending order ของรายย่อยที่กระจุกอยู่เป็นโซน ICT เรียกบริเวณเหล่านี้ว่า <strong>Liquidity</strong> และมองว่าราคามักถูกผลักไปแตะโซนเหล่านี้ก่อนจะกลับทิศจริง</>} en={<>Large players must trade with massive volume, therefore they need a 'counterparty' — which is the retail stop losses and pending orders clustered in zones. ICT calls these areas <strong>Liquidity</strong> and considers that price is often pushed to hit these zones before truly reversing.</>} />
      </p>
      <ul>
        <li>
          <T th={<><strong>Buy-side liquidity</strong> — เหนือ swing high (ที่ stop ของฝั่ง short และ buy stop กองอยู่)</>} en={<><strong>Buy-side liquidity</strong> — Above swing highs (where short stops and buy stops are clustered).</>} />
        </li>
        <li>
          <T th={<><strong>Sell-side liquidity</strong> — ใต้ swing low (ที่ stop ของฝั่ง long กองอยู่)</>} en={<><strong>Sell-side liquidity</strong> — Below swing lows (where long stops are clustered).</>} />
        </li>
      </ul>
      <p>
        <T th="เวลาเห็นราคา “ไส้เทียนยาว” ทะลุ high/low เดิมแล้วเด้งกลับ — นั่นคือภาพคลาสสิกของการกวาด liquidity (liquidity sweep)" en="When you see a 'long wick' pierce through an old high/low and immediately bounce back — that is the classic picture of a liquidity sweep." />
      </p>

      <h2><T th="1. Order Block (OB)" en="1. Order Block (OB)" /></h2>
      <p>
        <T th="Order Block คือแท่งเทียนสำคัญแท่งสุดท้ายก่อนที่ราคาจะเคลื่อนแรง (มักเป็นแท่งฝั่งตรงข้ามกับทิศที่กำลังจะไป) แนวคิดคือบริเวณนั้นมีคำสั่งของรายใหญ่ค้างอยู่ เมื่อราคาย้อนกลับมาทดสอบ OB จึงมีโอกาสเกิดปฏิกิริยา" en="An Order Block is the last significant candlestick before a strong price move (usually the candle opposite the upcoming direction). The concept is that large institutional orders are left pending in that area, so when price returns to test the OB, there is a high probability of a reaction." />
      </p>

      <h2><T th="2. Fair Value Gap (FVG)" en="2. Fair Value Gap (FVG)" /></h2>
      <p>
        <T th="FVG หรือ imbalance คือช่องว่างที่เกิดเมื่อราคาวิ่งเร็วจนเกิด “ช่องไม่สมดุล” ระหว่าง 3 แท่งเทียน (ไส้แท่งที่ 1 กับแท่งที่ 3 ไม่ทับกัน) ตลาดมักมีแนวโน้มย้อนกลับมา “เติมเต็ม” ช่องว่างนี้บางส่วน ทำให้ FVG กลายเป็นโซนหาจังหวะเข้าได้" en="FVG, or imbalance, is a gap created when the price moves so fast it creates an 'imbalance gap' between 3 consecutive candles (the wick of candle 1 and candle 3 do not overlap). The market tends to return and 'fill' this gap partially, making FVGs prime zones to look for entry opportunities." />
      </p>

      <h2><T th="3. Market Structure (BOS / CHoCH)" en="3. Market Structure (BOS / CHoCH)" /></h2>
      <p><T th="ก่อนเข้าเทรดต้องอ่านโครงสร้างตลาดให้ออกว่ายังเป็นเทรนด์เดิมหรือกำลังเปลี่ยน:" en="Before trading, you must be able to read market structure to see if the trend is continuing or changing:" /></p>
      <ul>
        <li>
          <T th={<><strong>BOS (Break of Structure)</strong> — ราคาทำ high/low ใหม่ตามทิศเทรนด์ = เทรนด์ยังไปต่อ</>} en={<><strong>BOS (Break of Structure)</strong> — Price makes a new high/low in the direction of the trend = The trend continues.</>} />
        </li>
        <li>
          <T th={<><strong>CHoCH (Change of Character)</strong> — ราคาเบรกโครงสร้างสวนทาง = สัญญาณแรกว่าเทรนด์อาจกลับ</>} en={<><strong>CHoCH (Change of Character)</strong> — Price breaks structure in the opposite direction = The first signal that the trend might be reversing.</>} />
        </li>
      </ul>

      <h2><T th="ร้อยเรียงเป็น Market Maker Model" en="Tying it Together into the Market Maker Model" /></h2>
      <p><T th="เมื่อรวมทุกชิ้น ภาพที่ ICT มองคือลำดับเหตุการณ์ซ้ำๆ:" en="When putting all the pieces together, the picture ICT looks for is a sequence of repeating events:" /></p>
      <ol>
        <li><T th="ราคากวาด liquidity (เก็บ stop รายย่อย)" en="Price sweeps liquidity (collecting retail stops)." /></li>
        <li><T th="เกิด CHoCH ยืนยันการเปลี่ยนทิศ" en="A CHoCH occurs, confirming the shift in direction." /></li>
        <li><T th="ราคาย้อนกลับมาที่ Order Block / FVG" en="Price retraces back into an Order Block / FVG." /></li>
        <li><T th="เข้าเทรดตามทิศใหม่ โดยตั้ง SL หลังโซน liquidity ที่เพิ่งถูกกวาด" en="Enter trade in the new direction, placing SL behind the recently swept liquidity zone." /></li>
      </ol>

      <blockquote><T th="“อย่าไล่ราคา — รอให้ราคามาหาโซนที่คุณวางแผนไว้”" en="'Don't chase the price — wait for the price to come to your planned zone.'" /></blockquote>

      <h2><T th="ข้อควรระวังสำหรับมือใหม่" en="Cautions for Beginners" /></h2>
      <ul>
        <li>
          <T th="ICT มีศัพท์เยอะ อย่าเพิ่งใช้ทุกเครื่องมือพร้อมกัน เริ่มจาก liquidity + market structure ให้แม่นก่อน" en="ICT has a lot of jargon. Don't use every tool at once. Start by getting highly accurate with liquidity + market structure first." />
        </li>
        <li><T th="ทุกแนวคิดคือ “ความน่าจะเป็น” ไม่ใช่ของแน่นอน — ต้องมี risk management เสมอ" en="Every concept is a 'probability', not a certainty — you must always have risk management." /></li>
        <li><T th="ฝึกอ่านบน timeframe ใหญ่ก่อน (H4/H1) แล้วค่อยลงไป entry บน timeframe เล็ก" en="Practice reading on higher timeframes first (H4/H1) before dropping down to enter on lower timeframes." /></li>
      </ul>

      <div className="callout">
        <h3><T th="สรุปสั้น" en="TL;DR" /></h3>
        <ul>
          <li><T th="หัวใจ ICT คือ “ตลาดวิ่งหา liquidity” เหนือ high / ใต้ low" en="The heart of ICT is 'The market seeks liquidity' above highs / below lows." /></li>
          <li><T th="3 เครื่องมือพื้นฐาน: Order Block, Fair Value Gap, Market Structure (BOS/CHoCH)" en="3 Basic Tools: Order Block, Fair Value Gap, Market Structure (BOS/CHoCH)." /></li>
          <li><T th="โมเดล: กวาด liquidity → CHoCH → ย่อมาที่ OB/FVG → เข้าเทรด" en="Model: Sweep liquidity → CHoCH → Retrace to OB/FVG → Enter trade." /></li>
          <li><T th="เริ่มจากน้อยแต่แม่น + มี risk management ทุกไม้" en="Start small but accurate + Use risk management on every trade." /></li>
        </ul>
      </div>
    </ArticleShell>
  );
}
