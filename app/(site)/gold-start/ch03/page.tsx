import type { Metadata } from "next";
import { T } from "@/components/site/LangContext";

// Generated from gold-start-ch03.html by scripts/convert-gold-start.mjs — edit freely,
// but re-running the script will overwrite this file.
export const metadata: Metadata = {
  title: "GOLD START — บทที่ 03 · เปิดบัญชีเดโม + ทัวร์แพลตฟอร์ม · Cerfinits",
  description: "ถึงเวลาลงมือจริงเป็นครั้งแรก — แต่ยังไม่เสี่ยงเงินจริงแม้แต่บาทเดียว เราจะเปิด “บัญชีเดโม” และทำความรู้จักหน้าจอที่คุณจะใช้ทุกวัน ให้คุ้นมือก่อนแตะออเดอร์แรก",
  alternates: { canonical: "/gold-start/ch03" },
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
          <div className="chno"><T th="บทที่ / 03" en="Chapter / 03" /></div>
          <h1><T th="เปิดบัญชีเดโม" en="Open a Demo Account" /><br /><T th="และทัวร์หน้าจอ" en="and Tour the Platform" /></h1>
          <p className="lead"><T th="ถึงเวลาลงมือจริงเป็นครั้งแรก — แต่ยังไม่เสี่ยงเงินจริงแม้แต่บาทเดียว เราจะเปิด “บัญชีเดโม” และทำความรู้จักหน้าจอที่คุณจะใช้ทุกวัน ให้คุ้นมือก่อนแตะออเดอร์แรก" en="Time for your first hands-on step — but without risking a single real baht. We'll open a 'demo account' and get familiar with the screen you'll use every day, so it's comfortable before you touch your first order." /></p>
        </div>

        <div className="wrap content">

          <p className="intro"><T th={<>ก่อนจะเทรดได้ คุณต้องมี 2 อย่าง: <b>โบรกเกอร์</b> (ประตูเข้าสู่ตลาด) และ <b>แพลตฟอร์ม</b> (หน้าจอที่ใช้ดูกราฟและส่งคำสั่ง) บทนี้เราจะจัดการให้ครบ และทำทุกอย่างบน "เงินจำลอง" ก่อน</>} en={<>Before you can trade, you need 2 things: a <b>broker</b> (the gateway to the market) and a <b>platform</b> (the screen for viewing charts and placing orders). This chapter sorts out both, and we'll do everything on "simulated money" first.</>} /></p>

          <div className="sechead"><span className="n">01</span><h2><T th="โบรกเกอร์คืออะไร และเลือกยังไง" en="What Is a Broker, and How to Choose One" /></h2></div>
          <p><T th="โบรกเกอร์ (Broker) คือตัวกลางที่ให้คุณเข้าถึงตลาดทอง/ฟอเร็กซ์ คุณส่งคำสั่งซื้อ-ขายผ่านเขา มือใหม่มักเลือกโบรกจาก “โฆษณาที่เห็นบ่อยที่สุด” — ซึ่งเป็นวิธีที่ผิด ให้ดู 5 เกณฑ์นี้แทน:" en="A broker is the intermediary that gives you access to the gold/forex market — you send your buy-sell orders through them. Beginners often pick a broker based on 'whichever ad they see most often', which is the wrong approach. Look at these 5 criteria instead:" /></p>
          <ul className="clean">
            <li><T th={<><b>การกำกับดูแล (Regulation)</b> — มีหน่วยงานกำกับที่น่าเชื่อถือ (เช่น ASIC, FCA, CySEC)</>} en={<><b>Regulation</b> — Overseen by a credible regulator (e.g. ASIC, FCA, CySEC)</>} /></li>
            <li><T th={<><b>สเปรดทองแคบ</b> — ทองคือสนามของเรา สเปรดยิ่งแคบ ต้นทุนต่อไม้ยิ่งถูก</>} en={<><b>Tight Gold Spreads</b> — Gold is our field; the tighter the spread, the cheaper the cost per trade</>} /></li>
            <li><T th={<><b>ฝาก-ถอนสะดวกและตรงเวลา</b> — รีวิวจากผู้ใช้จริงสำคัญกว่าคำโฆษณา</>} en={<><b>Fast, Reliable Deposits/Withdrawals</b> — Real user reviews matter more than ads</>} /></li>
            <li><T th={<><b>มีบัญชีเดโมที่ดี</b> — ให้คุณฝึกได้เหมือนจริง</>} en={<><b>A Good Demo Account</b> — Lets you practice as close to real conditions as possible</>} /></li>
            <li><T th={<><b>แพลตฟอร์มมาตรฐาน</b> — รองรับ MT4 / MT5 หรือ TradingView</>} en={<><b>A Standard Platform</b> — Supports MT4 / MT5 or TradingView</>} /></li>
          </ul>
          <p><T th="โบรกที่ผมใช้และไว้ใจสำหรับเทรดทอง มี 3 เจ้านี้:" en="These are the 3 brokers I personally use and trust for trading gold:" /></p>

          <div className="bcards">
            <div className="bcard">
              <div className="brank">01</div>
              <div>
                <div className="bname">FP Markets</div>
                <div className="bwhy"><T th="สเปรดทองแคบแบบ raw/ECN เหมาะกับการเทรดทองโดยตรง รองรับ MT4/MT5 อยู่ภายใต้การกำกับสาย ASIC/CySEC" en="Tight raw/ECN gold spreads, well suited to trading gold directly. Supports MT4/MT5, regulated under ASIC/CySEC." /></div>
                <a className="blink" href="https://portal.fpmarkets.com/register?fpm-affiliate-utm-source=IB&fpm-affiliate-agt=63240" target="_blank" rel="sponsored noopener"><T th="เปิดบัญชีกับ FP Markets →" en="Open an account with FP Markets →" /></a>
              </div>
            </div>
            <div className="bcard">
              <div className="brank">02</div>
              <div>
                <div className="bname">IC Markets</div>
                <div className="bwhy"><T th="สภาพคล่องสูง สเปรดทองแคบ เป็นที่นิยมมากในไทย รองรับ MT4/MT5/cTrader เหมาะกับคนที่อยากได้ความเสถียร" en="High liquidity, tight gold spreads, very popular in Thailand. Supports MT4/MT5/cTrader — good for those who want stability." /></div>
                <a className="blink" href="https://icmarkets.com/?camp=66996" target="_blank" rel="sponsored noopener"><T th="เปิดบัญชีกับ IC Markets →" en="Open an account with IC Markets →" /></a>
              </div>
            </div>
            <div className="bcard">
              <div className="brank">03</div>
              <div>
                <div className="bname">ZFX (Zeal Capital Market)</div>
                <div className="bwhy"><T th="เปิดบัญชีง่าย เป็นมิตรกับมือใหม่ ขั้นตอนไม่ซับซ้อน เป็นตัวเลือกตั้งต้นที่ดีถ้าคุณอยากเริ่มเร็ว" en="Easy account opening, beginner-friendly, uncomplicated steps — a good starting choice if you want to get going quickly." /></div>
                <a className="blink" href="https://my.zfx.com/reg?agentnumber=Z934514" target="_blank" rel="sponsored noopener"><T th="เปิดบัญชีกับ ZFX →" en="Open an account with ZFX →" /></a>
              </div>
            </div>
          </div>
          <p style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}><T th="* ลิงก์สมัครในเล่ม/คอมมูนิตี้เป็นลิงก์พาร์ตเนอร์ ผมอาจได้รับค่าตอบแทนหากคุณสมัคร — แต่ผมแนะนำเพราะใช้งานจริง และคุณจะเริ่มที่ “เดโม” ก่อนเสมอ" en="* The signup links in this book/community are partner links — I may earn a commission if you sign up. But I recommend them because I actually use them, and you'll always start on a 'demo' first." /></p>

          <div className="warn">
            <div className="wlabel">⚠ <T th="ข้อควรรู้ก่อนไปต่อ — เรื่องกฎหมายไทย" en="What You Should Know Before Continuing — Thai Law" /></div>
            <p><T th={<>โบรกที่ยกตัวอย่างเป็น <b>โบรกต่างประเทศ (offshore)</b> ไม่ได้อยู่ภายใต้ใบอนุญาตของ ก.ล.ต. ไทย การเทรดฟอเร็กซ์/CFD ทองกับโบรกเหล่านี้ในไทยถือเป็น <b>"พื้นที่สีเทา"</b> — แม้ผู้เทรดรายย่อยทั่วไปจะทำกัน แต่ก็ <b>ไม่มีหน่วยงานไทยคุ้มครอง</b> หากเกิดปัญหากับโบรก ผมเลือกบอกความจริงข้อนี้ตรง ๆ เพื่อให้คุณตัดสินใจบนข้อมูลครบ ไม่ใช่ปิดบัง — โปรดศึกษาเพิ่มเติมและรับความเสี่ยงเท่าที่คุณรับไหว</>} en={<>The brokers listed above are <b>offshore (foreign) brokers</b> — not licensed by the Thai SEC. Trading forex/gold CFDs with these brokers in Thailand sits in a <b>"grey area"</b>: while many retail traders do it, there is <b>no Thai regulator protecting you</b> if something goes wrong with the broker. I choose to tell you this plainly so you can decide with full information, not a hidden one — please research further and only take on the risk you can bear.</>} /></p>
          </div>

          <div className="sechead"><span className="n">02</span><h2><T th="เปิดบัญชีเดโมทีละขั้น" en="Opening a Demo Account, Step by Step" /></h2></div>
          <p><T th="บัญชีเดโม (Demo) คือบัญชีเงินจำลอง — กราฟจริง ราคาจริง แต่เงินไม่จริง คุณฝึกได้ไม่จำกัด เจ๊งกี่รอบก็ไม่เสียเงินจริง นี่คือสนามซ้อมของเรา ขั้นตอนเปิดมีแค่นี้:" en="A demo account is a simulated-money account — real charts, real prices, but fake money. You can practice endlessly; blowing it up costs nothing real. This is our training ground. Here are the steps to open one:" /></p>

          <div className="steps">
            <div className="step"><div className="snum">1</div><div><div className="sb-title"><T th="สมัครบัญชีกับโบรก" en="Sign up with a broker" /></div><div className="sb-text"><T th="กรอกชื่อ อีเมล เบอร์โทร — ใช้เวลาไม่กี่นาที" en="Fill in your name, email, phone number — takes just a few minutes" /></div></div></div>
            <div className="step"><div className="snum">2</div><div><div className="sb-title"><T th={<>เลือกประเภทบัญชีเป็น "Demo / ทดลอง"</>} en={<>Choose account type: "Demo / Practice"</>} /></div><div className="sb-text"><T th="ระวังให้ดี — ต้องเป็น Demo ไม่ใช่ Real/Live เด็ดขาดในตอนนี้" en="Be careful — it must be Demo, definitely not Real/Live at this stage" /></div></div></div>
            <div className="step"><div className="snum">3</div><div><div className="sb-title"><T th="ตั้งทุนจำลองให้สมจริง" en="Set a realistic simulated balance" /></div><div className="sb-text"><T th="แนะนำตั้งใกล้เคียงทุนจริงที่คุณตั้งใจจะใช้ เช่น $500–$1,000 — ไม่ใช่ $100,000 เล่น ๆ" en="Set it close to the real capital you intend to use, e.g. $500–$1,000 — not a playful $100,000" /></div></div></div>
            <div className="step"><div className="snum">4</div><div><div className="sb-title"><T th="ดาวน์โหลดแพลตฟอร์มแล้วล็อกอิน" en="Download the platform and log in" /></div><div className="sb-text"><T th="MT4/MT5 หรือ TradingView แล้วล็อกอินด้วยบัญชีเดโมที่เพิ่งเปิด" en="MT4/MT5 or TradingView, then log in with the demo account you just opened" /></div></div></div>
          </div>

          <div className="window">
            <div className="winbar"><i></i><i></i><i></i><span className="wt"><T th="เปิดบัญชีทดลอง — Demo Account" en="Open Practice Account — Demo Account" /></span></div>
            <div className="winbody">
              <div className="fields">
                <div className="field"><div className="flabel"><T th="ชื่อ - นามสกุล" en="First - Last Name" /></div><div className="fbox ph">e.g. Kan Trader</div></div>
                <div className="field"><div className="flabel"><T th="อีเมล" en="Email" /></div><div className="fbox ph">you@email.com</div></div>
                <div className="field"><div className="flabel"><T th="ประเภทบัญชี" en="Account Type" /></div><div className="fbox"><T th="Demo (บัญชีทดลอง) ✓" en="Demo (Practice Account) ✓" /></div></div>
                <div className="field"><div className="flabel"><T th="ทุนจำลอง (USD)" en="Simulated Balance (USD)" /></div><div className="fbox">1,000</div></div>
                <span className="fbtn"><T th="เปิดบัญชีเดโม" en="Open Demo Account" /></span>
              </div>
            </div>
          </div>

          <div className="sechead"><span className="n">03</span><h2><T th="ทัวร์หน้าจอแพลตฟอร์ม" en="Platform Screen Tour" /></h2></div>
          <p><T th="หน้าจอแพลตฟอร์มดูรกตาตอนแรก แต่จริง ๆ มีแค่ไม่กี่ส่วนที่คุณต้องสนใจ ดูภาพนี้ให้คุ้นก่อน เดี๋ยวเราจะลงมือกดจริงในบทที่ 9:" en="The platform screen looks cluttered at first, but there are really only a few parts you need to care about. Get familiar with this picture first — we'll press real buttons in Chapter 9:" /></p>

          <div className="figure">
            <svg viewBox="0 0 600 330" xmlns="http://www.w3.org/2000/svg" fontFamily="Geist Mono, monospace">
              <text x="8" y="18" fontSize="12" fill="#272727">① <T th="ชาร์ตราคา" en="Price Chart" /> — XAUUSD · M15</text>
              <rect x="8" y="26" width="392" height="296" fill="#cfcec9" stroke="rgba(39,39,39,.18)"/>
              <line x1="8" y1="120" x2="400" y2="120" stroke="rgba(39,39,39,.08)"/>
              <line x1="8" y1="200" x2="400" y2="200" stroke="rgba(39,39,39,.08)"/>

              <g strokeWidth="2">
                <line x1="60" y1="70" x2="60" y2="180" stroke="#9d5a4f"/><rect x="52" y="95" width="16" height="60" fill="#9d5a4f"/>
                <line x1="120" y1="90" x2="120" y2="210" stroke="#5a7d5a"/><rect x="112" y="120" width="16" height="70" fill="#5a7d5a"/>
                <line x1="180" y1="60" x2="180" y2="150" stroke="#9d5a4f"/><rect x="172" y="78" width="16" height="50" fill="#9d5a4f"/>
                <line x1="240" y1="95" x2="240" y2="220" stroke="#5a7d5a"/><rect x="232" y="130" width="16" height="70" fill="#5a7d5a"/>
                <line x1="300" y1="80" x2="300" y2="175" stroke="#5a7d5a"/><rect x="292" y="100" width="16" height="60" fill="#5a7d5a"/>
                <line x1="360" y1="110" x2="360" y2="240" stroke="#9d5a4f"/><rect x="352" y="135" width="16" height="80" fill="#9d5a4f"/>
              </g>

              <text x="410" y="18" fontSize="12" fill="#272727">② <T th="ปุ่ม Sell / Buy" en="Sell / Buy Buttons" /></text>
              <rect x="410" y="26" width="182" height="296" fill="#e2e1db" stroke="rgba(39,39,39,.18)"/>
              <rect x="424" y="40" width="74" height="46" fill="#9d5a4f"/><text x="461" y="62" fontSize="13" fill="#fff" textAnchor="middle">SELL</text><text x="461" y="76" fontSize="9" fill="#f0e6e3" textAnchor="middle">3,419.80</text>
              <rect x="504" y="40" width="74" height="46" fill="#5a7d5a"/><text x="541" y="62" fontSize="13" fill="#fff" textAnchor="middle">BUY</text><text x="541" y="76" fontSize="9" fill="#e9f0e6" textAnchor="middle">3,420.10</text>
              <text x="424" y="116" fontSize="11" fill="#6f6d66">③ Volume (lot)</text>
              <rect x="424" y="122" width="154" height="30" fill="#dcdbd5" stroke="rgba(39,39,39,.18)"/><text x="436" y="142" fontSize="12" fill="#272727">0.01</text>
              <text x="424" y="176" fontSize="11" fill="#6f6d66">④ Stop Loss / Take Profit</text>
              <rect x="424" y="182" width="74" height="30" fill="#dcdbd5" stroke="rgba(39,39,39,.18)"/><text x="432" y="202" fontSize="11" fill="#9d5a4f">S/L</text>
              <rect x="504" y="182" width="74" height="30" fill="#dcdbd5" stroke="rgba(39,39,39,.18)"/><text x="512" y="202" fontSize="11" fill="#5a7d5a">T/P</text>
              <rect x="424" y="244" width="154" height="40" fill="#1f1f1f"/><text x="501" y="269" fontSize="12" fill="#e9e8e2" textAnchor="middle"><T th="ส่งคำสั่ง" en="Place Order" /></text>
            </svg>
            <div className="figcap"><T th="หน้าจอเทรดมาตรฐาน (MT5) — โฟกัสแค่ 4 ส่วนนี้ก่อน" en="Standard trading screen (MT5) — focus on just these 4 parts for now" /></div>
          </div>

          <ul className="clean">
            <li><T th={<><b>① ชาร์ตราคา</b> — หัวใจของทุกอย่าง คุณจะอ่านมันเป็นในบทที่ 5</>} en={<><b>① Price Chart</b> — the heart of everything; you'll learn to read it in Chapter 5</>} /></li>
            <li><T th={<><b>② ปุ่ม Sell / Buy</b> — Buy เมื่อคิดว่าทองจะขึ้น, Sell เมื่อคิดว่าจะลง</>} en={<><b>② Sell / Buy Buttons</b> — Buy when you think gold will rise, Sell when you think it will fall</>} /></li>
            <li><T th={<><b>③ Volume (lot)</b> — ขนาดไม้ ตัวกำหนดว่าแต่ละจุดที่ราคาขยับ = เงินกี่บาท (บทที่ 4 + 6)</>} en={<><b>③ Volume (lot)</b> — position size; determines how much money each price tick is worth (Chapters 4 + 6)</>} /></li>
            <li><T th={<><b>④ SL / TP</b> — จุดตัดขาดทุน (Stop Loss) และจุดทำกำไร (Take Profit) — เกราะป้องกันพอร์ตของคุณ</>} en={<><b>④ SL / TP</b> — Stop Loss and Take Profit points — your portfolio's armor</>} /></li>
          </ul>

          <div className="note">
            <div className="nlabel">CERFINITS NOTE — <T th="บันทึกจากกัน" en="A note from Kan" /></div>
            <p><T th={<>อย่าตั้งทุนเดโมเป็น $100,000 เพื่อความสะใจ ถ้าเดโมเป็น "เงินเล่น ๆ" นิสัยที่คุณฝึกได้ก็จะเป็น "นิสัยเล่น ๆ" ตั้งทุนเดโมให้ใกล้เคียงเงินจริงที่คุณจะใช้ แล้วปฏิบัติกับมันเหมือนเงินจริงทุกบาท — <b>คุณซ้อมยังไง คุณก็จะเล่นจริงแบบนั้น</b></>} en={<>Don't set your demo balance to $100,000 for kicks. If the demo is "play money", the habits you build will be "play habits" too. Set the demo balance close to the real money you'll actually use, and treat every baht of it like it's real — <b>however you practice is how you'll play for real.</b></>} /></p>
          </div>

          <div className="summary">
            <div className="slabel"><T th="สรุปให้จำง่าย" en="Easy-Recall Summary" /></div>
            <ul>
              <li><T th="เลือกโบรกจาก 5 เกณฑ์ (กำกับ/สเปรดทอง/ฝาก-ถอน/เดโม/แพลตฟอร์ม) ไม่ใช่จากโฆษณา" en="Choose a broker on 5 criteria (regulation/gold spread/deposit-withdrawal/demo/platform), not from ads" /></li>
              <li><T th="โบรกที่แนะนำ: FP Markets · IC Markets · ZFX — เริ่มที่เดโมก่อนเสมอ" en="Recommended brokers: FP Markets · IC Markets · ZFX — always start on demo" /></li>
              <li><T th="โบรก offshore ไม่ได้อยู่ใต้ ก.ล.ต. ไทย เป็นพื้นที่สีเทา — รับความเสี่ยงเท่าที่ไหว" en="Offshore brokers are not under the Thai SEC — a grey area. Only take on the risk you can bear" /></li>
              <li><T th="เปิดบัญชี Demo (ไม่ใช่ Real) ตั้งทุนจำลองให้สมจริง" en="Open a Demo account (not Real); set a realistic simulated balance" /></li>
              <li><T th="หน้าจอเทรดโฟกัสแค่ 4 ส่วน: ชาร์ต · Sell/Buy · Volume · SL/TP" en="Focus on just 4 parts of the trading screen: Chart · Sell/Buy · Volume · SL/TP" /></li>
            </ul>
          </div>

          <div className="checklist">
            <div className="clabel"><T th="เช็กลิสต์ท้ายบท — ติ๊กให้ครบก่อนไปบทต่อไป" en="End-of-Chapter Checklist — Check all before moving on" /></div>
            <ul>
              <li><T th="ผมเลือกโบรกจากเกณฑ์ ไม่ใช่จากโฆษณา" en="I chose a broker based on criteria, not ads" /></li>
              <li><T th={<>ผมเปิด "บัญชีเดโม" เรียบร้อย และตั้งทุนจำลองให้สมจริง</>} en={<>I've opened a "demo account" and set a realistic simulated balance</>} /></li>
              <li><T th="ผมเข้าใจความเสี่ยงเรื่องโบรก offshore และกฎหมายไทยแล้ว" en="I understand the risk around offshore brokers and Thai law" /></li>
              <li><T th="ผมรู้จัก 4 ส่วนหลักบนหน้าจอเทรดแล้ว" en="I know the 4 main parts of the trading screen" /></li>
            </ul>
          </div>

          <div className="next">
            <div className="nx"><T th="บทต่อไป — บทที่ 04" en="Next Chapter — Chapter 04" /></div>
            <p><T th={<>เราจะเรียน <b>"ภาษาของเทรดเดอร์"</b> — pip, lot, spread และ leverage คืออะไร พร้อมตัวอย่างเป็นตัวเลขจริงกับทอง เพื่อให้คุณรู้ว่าแต่ละไม้ที่กด มันหมายถึงเงินเท่าไหร่กันแน่</>} en={<>We'll learn the <b>"trader's language"</b> — what pip, lot, spread and leverage mean, with real gold-price examples, so you know exactly how much money each trade you press really represents.</>} /></p>
          </div>

        </div>

        <div className="wrap bookfoot">
          <span>CERFINITS — GOLD START</span>
          <span><T th="บทที่ 03 · เปิดบัญชีเดโม + ทัวร์แพลตฟอร์ม" en="Chapter 03 · Open a Demo Account + Platform Tour" /></span>
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
