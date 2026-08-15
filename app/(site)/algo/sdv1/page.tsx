import type { Metadata } from "next";
import EquityCurve from "@/components/site/EquityCurve";
import "../algo.css";
import { T } from "@/components/site/LangContext";

export const metadata: Metadata = {
  title: "Cerfinits Algo SDV.1 — ระบบเทรดทองอัตโนมัติ XAUUSD | เช่ารายเดือน 990฿",
  description:
    "Cerfinits Algo SDV.1 — EA เทรดทอง XAUUSD M15 สาย Trend-Following ทดสอบ Real Ticks 100% ระยะ 2.4 ปี เช่ารายเดือนเพียง 990 บาท",
  // Must point at this page. Pointing canonical (and og:url) at /algo told
  // search engines the index was the real version of this one, so the product
  // page was excluded from search in favour of a far thinner page.
  alternates: { canonical: "/algo/sdv1" },
  openGraph: {
    title: "Cerfinits Algo SDV.1",
    description: "ระบบเทรดทองอัตโนมัติที่ไม่ขายฝัน — ขายข้อมูล",
    type: "website",
    url: "/algo/sdv1",
  },
};

export default function AlgoPage() {
  return (
    <>
        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <span className="tag reveal">XAUUSD · M15 · MetaTrader 5 · Real Ticks 100%</span>
            <h1 className="reveal">
              Cerfinits Algo SDV.1<br />
              <span className="thin"><T th={<>ระบบเทรดทองอัตโนมัติ<br />ที่ไม่ขายฝัน — ขายข้อมูล</>} en={<>A Gold Trading System<br />That Sells Data, Not Dreams</>} /></span>
            </h1>
            <p className="lead reveal">
              <T th={<>EA สาย Trend-Following สำหรับ XAUUSD ผ่านการทดสอบด้วย Tick จริง 100% ต่อเนื่อง <b>2 ปี 5 เดือน</b> (ม.ค. 2024 – มิ.ย. 2026) เราโชว์ทุกตัวเลข — ทั้งด้านที่ชนะ และด้านที่เจ็บ</>} en={<>A Trend-Following EA for XAUUSD tested with 100% real ticks for <b>2.4 years</b> (Jan 2024 – Jun 2026). We show every number — both the wins and the pain.</>} />
            </p>
            <div className="hero-cta reveal">
              <a href="https://discord.gg/jANDuDvn" target="_blank" rel="noopener" className="btn">
                <T th="เช่าใช้งาน — 990฿/เดือน" en="Subscribe — ฿990/month" />
              </a>
              <a href="#results" className="btn ghost"><T th="ดูผลทดสอบเต็ม ↓" en="View full backtest ↓" /></a>
            </div>
            <div className="stat-strip reveal">
              <div><div className="v">+268%</div><div className="k"><T th="กำไรสุทธิ (Backtest 2.4 ปี)" en="Net Profit (2.4y Backtest)" /></div></div>
              <div><div className="v">1.35</div><div className="k">Profit Factor</div></div>
              <div><div className="v">14.0%</div><div className="k">Max Equity Drawdown</div></div>
              <div><div className="v">4.91</div><div className="k">Sharpe Ratio</div></div>
            </div>
            <div className="chart-card reveal">
              <div className="chart-head">
                <span className="t"><T th="BALANCE CURVE — ทุนเริ่มต้น $10,000 → $36,829" en="BALANCE CURVE — Initial Deposit $10,000 → $36,829" /></span>
                <span className="r"><T th="606 เทรด · 2024.01 – 2026.06 · LR Correlation 0.97" en="606 Trades · 2024.01 – 2026.06 · LR Correlation 0.97" /></span>
              </div>
              <EquityCurve />
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section id="results">
          <div className="wrap">
            <span className="eyebrow reveal"><T th="BACKTEST REPORT — ฉบับไม่ตัดต่อ" en="BACKTEST REPORT — Uncut Edition" /></span>
            <h2 className="section-title reveal">
              <T th={<>ตัวเลขทั้งหมด<br />จากรายงาน MT5 Strategy Tester</>} en={<>All Numbers<br />from MT5 Strategy Tester</>} />
            </h2>
            <p className="section-sub reveal">
              <T th="ทดสอบบนข้อมูล Tick จริง 100% บนสภาพแวดล้อม (สเปรด/Swap) ของโบรกเกอร์พาร์ทเนอร์ตัวจริงที่ใช้รันพอร์ต ไม่ใช่ข้อมูลสังเคราะห์" en="Tested on 100% real tick data with actual broker environments (Spread/Swap) used in live accounts, not synthetic data." />
            </p>

            <div className="stats-grid">
              <div className="stat reveal"><div className="v">$26,829.54</div><div className="k"><T th="กำไรสุทธิ จากทุน $10,000" en="Net Profit from $10,000" /></div></div>
              <div className="stat reveal"><div className="v">606</div><div className="k"><T th="จำนวนเทรดทั้งหมด" en="Total Trades" /></div></div>
              <div className="stat reveal"><div className="v">35.64%</div><div className="k"><T th="Win Rate (216 ชนะ / 390 แพ้)" en="Win Rate (216 Win / 390 Loss)" /></div></div>
              <div className="stat reveal"><div className="v">2.44 : 1</div><div className="k"><T th="กำไรเฉลี่ย $475.63 ต่อขาดทุนเฉลี่ย $194.63" en="Avg Profit $475.63 : Avg Loss $194.63" /></div></div>
              <div className="stat reveal"><div className="v">$44.27</div><div className="k"><T th="Expected Payoff ต่อไม้" en="Expected Payoff per Trade" /></div></div>
              <div className="stat reveal"><div className="v">7.43</div><div className="k">Recovery Factor</div></div>
              <div className="stat reveal"><div className="v red">-$3,608 (14%)</div><div className="k">Max Equity Drawdown</div></div>
              <div className="stat reveal"><div className="v red"><T th="10 ไม้" en="10 Trades" /></div><div className="k"><T th="แพ้ติดกันสูงสุด (-$1,236)" en="Max Consecutive Losses (-$1,236)" /></div></div>
              <div className="stat reveal"><div className="v green"><T th="6 ไม้" en="6 Trades" /></div><div className="k"><T th="ชนะติดกันสูงสุด (+$1,870)" en="Max Consecutive Wins (+$1,870)" /></div></div>
              <div className="stat reveal"><div className="v"><T th="5 ชม. 07 น." en="5h 07m" /></div><div className="k"><T th="ระยะถือออเดอร์เฉลี่ย" en="Avg Hold Time" /></div></div>
              <div className="stat reveal"><div className="v">$946.80</div><div className="k"><T th="ไม้กำไรสูงสุด" en="Max Profit Trade" /></div></div>
              <div className="stat reveal"><div className="v red">-$382.50</div><div className="k"><T th="ไม้ขาดทุนหนักสุด (จำกัดความเสี่ยงต่อไม้)" en="Max Loss Trade (Risk per trade limited)" /></div></div>
            </div>

            <div className="nobs reveal">
              <h3><T th="⚠ สิ่งที่ต้องรู้ก่อนเช่า — No-BS Zone" en="⚠ What you must know before subscribing — No-BS Zone" /></h3>
              <ul>
                <li><T th={<><b>Win Rate แค่ ~36%</b> — ใช่ คุณอ่านไม่ผิด ระบบนี้แพ้บ่อยกว่าชนะ แต่ไม้ชนะใหญ่กว่าไม้แพ้ 2.4 เท่า นี่คือธรรมชาติของระบบ Trend-Following</>} en={<><b>Win Rate is only ~36%</b> — Yes, you read that right. It loses more often than it wins, but winning trades are 2.4x larger than losing ones. This is the nature of Trend-Following.</>} /></li>
                <li><T th={<><b>เคยแพ้ติดกันสูงสุด 10 ไม้</b> — ช่วงนั้นพอร์ตจะถอยและคุณจะอยากปิดระบบ ถ้าทนตรงนี้ไม่ได้ ระบบนี้ไม่เหมาะกับคุณ</>} en={<><b>Max consecutive losses is 10 trades</b> — During this period, the portfolio will dip and you'll want to turn it off. If you can't endure this, this system isn't for you.</>} /></li>
                <li><T th={<><b>Drawdown จริงแตะ 14–20%</b> — เงิน $10,000 เคยเห็นพอร์ตถอยกว่า $3,600 ก่อนทำจุดสูงสุดใหม่</>} en={<><b>Real Drawdown hit 14–20%</b> — A $10,000 account saw a dip of over $3,600 before reaching a new all-time high.</>} /></li>
                <li><T th={<><b>ผล Backtest ไม่ใช่คำสัญญา</b> — ตลาดอนาคตไม่มีใครการันตีได้ เราให้ข้อมูลครบเพื่อให้คุณตัดสินใจเอง</>} en={<><b>Backtests are not promises</b> — No one can guarantee the future market. We provide full data so you can decide for yourself.</>} /></li>
              </ul>
              <div className="why">
                <T th={<>ทำไมเราโชว์ด้านลบ? เพราะ <b>Edge + Discipline = Success</b> — ลูกค้าที่เข้าใจ Drawdown ก่อนเริ่ม คือลูกค้าที่อยู่รอดจนระบบทำงานให้เห็นผล</>} en={<>Why do we show the negatives? Because <b>Edge + Discipline = Success</b> — Clients who understand drawdown before starting are the ones who survive long enough to see the system work.</>} />
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM */}
        <section id="system">
          <div className="wrap">
            <span className="eyebrow reveal">THE SYSTEM</span>
            <h2 className="section-title reveal"><T th="ระบบทำงานอย่างไร" en="How the System Works" /></h2>
            <p className="section-sub reveal"><T th="หลักการเรียบง่าย ตรวจสอบได้ ไม่มี Black Box ที่อธิบายไม่ได้" en="Simple, verifiable principles. No unexplainable Black Boxes." /></p>
            <div className="how-grid">
              <div className="how reveal">
                <span className="num-label">01</span>
                <h3><T th="Trend-Following บนโครงสร้าง EMA" en="Trend-Following on EMA Structure" /></h3>
                <p><T th="เข้าเทรดตามทิศทางแนวโน้มหลักของทอง บนกรอบเวลา M15 พร้อมเงื่อนไขกรองสัญญาณก่อนเข้าทุกไม้ — ตัดอารมณ์ออกจากสมการ 100%" en="Enters trades in the direction of Gold's main trend on the M15 timeframe, with signal filters before every entry — removing emotions from the equation 100%." /></p>
              </div>
              <div className="how reveal">
                <span className="num-label">02</span>
                <h3><T th="ความเสี่ยงถูกจำกัดทุกไม้" en="Risk is limited on every trade" /></h3>
                <p><T th="ทุกออเดอร์มี Stop Loss เสมอ ขาดทุนหนักสุดต่อไม้ตลอด 2.4 ปีคือ -$382 บนทุน $10,000 — ไม่ใช้ Martingale, ไม่ใช้ Grid, ไม่ถัวเฉลี่ยขาดทุน" en="Every order has a Stop Loss. The max loss per trade over 2.4 years was -$382 on a $10,000 capital — No Martingale, no Grid, no averaging down." /></p>
              </div>
              <div className="how reveal">
                <span className="num-label">03</span>
                <h3><T th="วินัยที่โค้ดบังคับใช้" en="Discipline enforced by code" /></h3>
                <p><T th="เทรดสูงสุด 3 ไม้/วัน ถือเฉลี่ย ~5 ชั่วโมง หยุดเสาร์–อาทิตย์ ไม่ overtrade ไม่แก้แค้นตลาด — สิ่งที่มนุษย์ทำได้ยาก แต่โค้ดทำได้ทุกวัน" en="Max 3 trades/day, average hold ~5 hours, pauses on weekends. No overtrading, no revenge trading — things hard for humans, but easy for code." /></p>
              </div>
            </div>
            <div className="spec-row reveal">
              <span className="spec"><T th={<>คู่เงิน <b>XAUUSD</b></>} en={<>Pair <b>XAUUSD</b></>} /></span>
              <span className="spec"><T th={<>Timeframe <b>M15</b></>} en={<>Timeframe <b>M15</b></>} /></span>
              <span className="spec"><T th={<>แพลตฟอร์ม <b>MT5</b></>} en={<>Platform <b>MT5</b></>} /></span>
              <span className="spec"><T th={<>สูงสุด <b>3 ไม้/วัน</b></>} en={<>Max <b>3 trades/day</b></>} /></span>
              <span className="spec"><T th={<>SL <b>ทุกไม้</b></>} en={<>SL <b>Every trade</b></>} /></span>
              <span className="spec"><T th={<>Martingale/Grid <b>ไม่ใช้</b></>} en={<>Martingale/Grid <b>None</b></>} /></span>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing">
          <div className="wrap">
            <span className="eyebrow reveal">PACKAGE</span>
            <h2 className="section-title reveal"><T th="แพ็กเกจเดียว ตรงไปตรงมา" en="One Straightforward Package" /></h2>
            <p className="section-sub reveal"><T th="ไม่มี tier ซ่อนเงื่อนไข ไม่มีค่าธรรมเนียมแฝง — จ่ายรายเดือน หยุดได้ทุกเมื่อ" en="No hidden tiers, no hidden fees — pay monthly, cancel anytime." /></p>

            <div className="price-wrap">
              <div className="price-card reveal">
                <div className="plan">CERFINITS ALGO SDV.1 — MONTHLY LICENSE</div>
                <div className="price-big"><span className="n">990</span><span className="u"><T th="บาท / เดือน" en="THB / month" /></span></div>
                <div className="note"><T th="ยกเลิกได้ทุกเดือน · ไม่มีสัญญาผูกมัดระยะยาว" en="Cancel anytime · No long-term contracts" /></div>
                <ul className="inc">
                  <li><span><T th={<><b>License เต็มรูปแบบ</b> สำหรับบัญชีเทรดจริง 1 บัญชี</>} en={<><b>Full License</b> for 1 live trading account</>} /></span></li>
                  <li><span><T th={<><b>อัปเดตเวอร์ชันฟรี</b> ตลอดอายุการเช่า</>} en={<><b>Free updates</b> for the duration of subscription</>} /></span></li>
                  <li><span><T th={<><b>Setfile + คู่มือติดตั้ง</b> ค่าเดียวกับที่ใช้ทดสอบจริง</>} en={<><b>Setfile + Guide</b> identical to the real test</>} /></span></li>
                  <li><span><T th={<><b>ซัพพอร์ตติดตั้งตัวต่อตัว</b> ผ่าน Discord จนระบบรันได้</>} en={<><b>1-on-1 Setup Support</b> via Discord until it runs</>} /></span></li>
                  <li><span><T th={<><b>แจ้งเตือนอัปเดตระบบ</b> เมื่อมีการปรับปรุงเวอร์ชัน</>} en={<><b>Update Notifications</b> whenever new versions are released</>} /></span></li>
                </ul>
                <a className="btn-invert" href="https://discord.gg/jANDuDvn" target="_blank" rel="noopener">
                  <T th="เริ่มใช้งาน — ทัก Discord เลย" en="Start Now — DM on Discord" />
                </a>
              </div>

              <div className="cond-card reveal">
                <h3><T th="เงื่อนไขการเช่าใช้งาน" en="Subscription Terms" /></h3>
                <ul className="cond">
                  <li><span><T th={<><b>เปิดบัญชีใหม่ผ่านลิงก์พาร์ทเนอร์ (IB)</b> กับโบรกเกอร์ที่เรากำหนดเท่านั้น — โบรกเกอร์เดียวกับที่ใช้ทดสอบและรันพอร์ตจริง (แจ้งรายละเอียดหลังติดต่อ)</>} en={<><b>Open a new account via our IB link</b> with our designated broker only — the same broker used for testing and live accounts (details provided upon contact).</>} /></span></li>
                  <li><span><T th={<>ทุนขั้นต่ำ <b>$1,000</b> · ทุนแนะนำ <b>$3,000 ขึ้นไป</b> เพื่อรองรับ Drawdown ตามสถิติ</>} en={<>Minimum deposit <b>$1,000</b> · Recommended <b>$3,000+</b> to absorb statistical drawdown.</>} /></span></li>
                  <li><span><T th={<>ใช้งานกับบัญชี <b>Micro</b> หรือบัญชี <b>Cent</b> ได้ — ทุนขั้นต่ำ <b>10,000 USC</b> (≈ $100)</>} en={<>Can be used with <b>Micro</b> or <b>Cent</b> accounts — minimum deposit <b>10,000 USC</b> (≈ $100).</>} /></span></li>
                  <li><span><T th={<>License <b>ล็อกกับเลขบัญชีเทรด</b> — ใช้ได้ 1 บัญชีต่อ 1 license</>} en={<>License is <b>locked to trading account number</b> — 1 account per license.</>} /></span></li>
                  <li><span><T th={<>แนะนำรันบน <b>VPS</b> เพื่อให้ระบบทำงาน 24/5 ไม่สะดุด (แนะนำผู้ให้บริการให้ได้)</>} en={<>Recommended to run on a <b>VPS</b> for uninterrupted 24/5 uptime (we can recommend providers).</>} /></span></li>
                  <li><span><T th={<>ชำระล่วงหน้ารายเดือน — <b>ไม่ต่ออายุ ระบบหยุดทำงานอัตโนมัติ</b> ไม่มีค่าปรับ</>} en={<>Prepaid monthly — <b>System stops automatically if not renewed</b>, no penalties.</>} /></span></li>
                </ul>
              </div>
            </div>

            <div className="steps">
              <div className="step reveal"><h3><T th="ทัก Discord" en="DM on Discord" /></h3><p><T th="สอบถาม–ยืนยันเงื่อนไข รับลิงก์เปิดบัญชีพาร์ทเนอร์" en="Ask questions, confirm terms, get IB link." /></p></div>
              <div className="step reveal"><h3><T th="เปิดบัญชี + ฝากทุน" en="Open Account + Deposit" /></h3><p><T th="เปิดบัญชีผ่านลิงก์ IB ที่กำหนด ฝากขั้นต่ำ $1,000 (บัญชี Micro/Cent ขั้นต่ำ 10,000 USC)" en="Open via given IB link, deposit min $1,000 (or 10,000 USC for Cent)." /></p></div>
              <div className="step reveal"><h3><T th="ชำระค่าเช่า" en="Pay Subscription" /></h3><p><T th="โอน 990฿ พร้อมแจ้งเลขบัญชีเทรดเพื่อออก license" en="Transfer ฿990 and provide your account number for the license." /></p></div>
              <div className="step reveal"><h3><T th="ติดตั้ง + รัน" en="Setup + Run" /></h3><p><T th="รับไฟล์ EA + setfile ทีมงานช่วยติดตั้งจนรันได้จริง" en="Receive EA + setfile, our team helps setup until it runs." /></p></div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <div className="wrap">
            <span className="eyebrow reveal">FAQ</span>
            <h2 className="section-title reveal"><T th="คำถามที่พบบ่อย" en="Frequently Asked Questions" /></h2>
            <div className="faq-list reveal">
              <details className="faq-item">
                <summary><T th="ทำไมต้องเปิดบัญชีผ่านลิงก์ IB ของ Cerfinits?" en="Why must I open an account via Cerfinits' IB link?" /><span className="plus">+</span></summary>
                <div className="ans"><T th="สองเหตุผล: (1) ผล Backtest และพอร์ตจริงของเรารันบนสเปรดและเงื่อนไขของโบรกเกอร์นี้ — ใช้โบรกเกอร์อื่น ผลลัพธ์อาจคลาดเคลื่อนจากสถิติที่โชว์ (2) ส่วนแบ่งพาร์ทเนอร์จากโบรกเกอร์คือเหตุผลที่เราคิดค่าเช่าแค่ 990฿/เดือนได้ — ผลประโยชน์ตรงกัน: คุณเทรดได้ดี เราอยู่ได้ ไม่ต้องขายฝันเกินจริง" en="Two reasons: (1) Our Backtests and live accounts run on this broker's spread and conditions — using another broker may yield results that deviate from our stats. (2) Broker partner commissions are the reason we can charge only ฿990/month. Our interests are aligned: you trade well, we sustain the business, no overselling dreams." /></div>
              </details>
              <details className="faq-item">
                <summary><T th="ใช้บัญชีโบรกเกอร์เดิมที่มีอยู่แล้วได้ไหม?" en="Can I use my existing broker account?" /><span className="plus">+</span></summary>
                <div className="ans"><T th="ไม่ได้ครับ — license ออกให้เฉพาะบัญชีที่เปิดใหม่ผ่านลิงก์พาร์ทเนอร์ที่กำหนดเท่านั้น เพื่อให้สภาพแวดล้อมการเทรดตรงกับที่ระบบถูกทดสอบมา" en="No — licenses are only issued for new accounts opened via the specified partner link to ensure the trading environment matches our tests." /></div>
              </details>
              <details className="faq-item">
                <summary><T th="การันตีกำไรไหม? เดือนแรกจะได้เท่าไหร่?" en="Do you guarantee profit? How much will I make in the first month?" /><span className="plus">+</span></summary>
                <div className="ans"><T th="ไม่การันตีครับ และใครการันตีให้คุณวิ่งหนี — สถิติ Backtest 2.4 ปีให้ค่าเฉลี่ยกำไร ~4.5%/เดือนแบบทบต้น แต่มีบางเดือนขาดทุน และเคยมีช่วงแพ้ติดกัน 10 ไม้ ตัวเลขทั้งหมดอยู่บนหน้านี้ ตัดสินใจจากข้อมูล ไม่ใช่คำโฆษณา" en="No guarantees, and if anyone guarantees profit, run away. The 2.4-year backtest stats average ~4.5% compound monthly return, but some months are losses, and we've hit 10 consecutive losses. All numbers are on this page. Decide based on data, not ads." /></div>
              </details>
              <details className="faq-item">
                <summary><T th="ต้องเปิดคอมทิ้งไว้ตลอดไหม?" en="Do I need to leave my computer on all the time?" /><span className="plus">+</span></summary>
                <div className="ans"><T th="EA ต้องรันบน MT5 ที่เปิดอยู่ตลอดช่วงตลาดเปิด (จันทร์–ศุกร์) เราแนะนำใช้ VPS ราคาเริ่มต้นหลักร้อยบาท/เดือน ทีมงานแนะนำผู้ให้บริการและช่วยตั้งค่าให้ได้" en="The EA must run on MT5 while the market is open (Mon-Fri). We recommend using a VPS starting at a few dollars/month. Our team can recommend providers and help you set it up." /></div>
              </details>
              <details className="faq-item">
                <summary><T th="ยกเลิกยังไง? มีค่าปรับไหม?" en="How do I cancel? Are there penalty fees?" /><span className="plus">+</span></summary>
                <div className="ans"><T th="ไม่ต่ออายุเดือนถัดไป license หมดอายุอัตโนมัติ ไม่มีค่าปรับ ไม่มีคำถาม บัญชีเทรดและเงินของคุณอยู่กับโบรกเกอร์ — เราไม่เคยแตะเงินคุณ" en="Just don't renew next month. The license expires automatically. No penalties, no questions asked. Your trading account and funds remain with the broker — we never touch your money." /></div>
              </details>
              <details className="faq-item">
                <summary><T th="เงินทุนของผมปลอดภัยแค่ไหน?" en="How safe are my funds?" /><span className="plus">+</span></summary>
                <div className="ans"><T th="เงินอยู่ในบัญชีเทรดชื่อคุณที่โบรกเกอร์ 100% — Cerfinits ไม่มีสิทธิ์ถอนหรือเข้าถึงเงินของคุณ เราขายเครื่องมือ (EA) ไม่ใช่รับฝากเงิน ความเสี่ยงที่แท้จริงคือความเสี่ยงจากการเทรด ซึ่งระบุไว้ชัดในหน้านี้แล้ว" en="Your money is 100% in a trading account under your name at the broker — Cerfinits has no right to withdraw or access your funds. We sell a tool (EA), we don't take deposits. The real risk is trading risk, which is clearly stated on this page." /></div>
              </details>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section>
          <div className="wrap final reveal">
            <span className="eyebrow">START NOW</span>
            <h2>
              <T th={<>ข้อมูลครบแล้ว —<br /><span style={{ color: "var(--muted)" }}>ที่เหลือคือการตัดสินใจ</span></>} en={<>You have the data —<br /><span style={{ color: "var(--muted)" }}>the rest is your decision.</span></>} />
            </h2>
            <p><T th="990 บาท/เดือน สำหรับระบบที่ผ่านการทดสอบ 2.4 ปี 606 เทรด บนข้อมูล Tick จริง พร้อมซัพพอร์ตจนรันได้จริง" en="฿990/month for a system tested over 2.4 years, 606 trades, on real tick data, with full support until it runs." /></p>
            <a className="btn" href="https://discord.gg/jANDuDvn" target="_blank" rel="noopener">
              <T th="ทัก Discord — เริ่มใช้ Cerfinits Algo SDV.1" en="DM on Discord — Start using Cerfinits Algo SDV.1" />
            </a>
          </div>
        </section>
      <div className="algo-footer" style={{ marginTop: '40px', padding: '40px 0', borderTop: '1px solid var(--line-soft)' }}>
        <div className="wrap">
          <div className="disc" style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '20px' }}>
            <T 
              th={<><b>คำเตือนความเสี่ยง (Risk Disclaimer):</b> การเทรด Forex / ทองคำ / CFD มีความเสี่ยงสูง อาจสูญเสียเงินลงทุนทั้งหมด ผลการทดสอบย้อนหลัง (Backtest) ที่แสดงบนหน้านี้มาจากรายงาน MT5 Strategy Tester บนข้อมูล Tick จริง 100% ช่วง 01.2024 – 06.2026 และ <b>ไม่ใช่เครื่องยืนยันผลตอบแทนในอนาคต</b> ผลการเทรดจริงอาจแตกต่างจากผลทดสอบจากปัจจัยด้านสเปรด, slippage, สภาพตลาด และช่วงเวลาเริ่มต้น ผู้เช่าใช้งานควรลงทุนด้วยเงินที่พร้อมรับความเสี่ยงได้เท่านั้น Cerfinits เป็นผู้พัฒนาและให้เช่าซอฟต์แวร์ ไม่ใช่ผู้รับฝากเงิน ไม่ใช่ที่ปรึกษาการลงทุน และไม่มีบริการรับประกันผลตอบแทนในทุกกรณี</>} 
              en={<><b>Risk Disclaimer:</b> Trading Forex / Gold / CFDs carries high risk and may result in the loss of your entire investment. The backtest results shown on this page are from MT5 Strategy Tester reports using 100% real tick data for the period Jan 2024 - Jun 2026, and <b>are not a guarantee of future returns</b>. Real trading results may differ due to spread, slippage, market conditions, and starting period. Subscribers should only invest money they can afford to lose. Cerfinits is a software developer and provider, not a deposit-taker, not an investment advisor, and does not offer any return guarantees under any circumstances.</>}
            />
          </div>
          <div className="foot-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
            <span>
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> CERFINITS — Edge +
              Discipline = Success
            </span>
            <span>Cerfinits Algo SDV.1 · XAUUSD · MT5</span>
          </div>
        </div>
      </div>
    </>
  );
}
