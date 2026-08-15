import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 7 · สร้างและทดสอบระบบ — backtest, OOS, kill criteria · Cerfinits Grade",
  description:
    "Premium เรือธง: แปลงความรู้เป็นกฎที่ทดสอบได้, backtest ให้ถูกวิธี, กับดัก overfitting/ต้นทุน, out-of-sample, kill criteria และวงจรชีวิตระบบ — สอนจากงานวิจัยจริง",
  alternates: { canonical: "/grade/build-your-system" },
};

const SVG_PLANSYS = `<svg viewBox="0 0 660 240" role="img" aria-label="trading plan ครอบ trading system">
  <rect x="40" y="24" width="580" height="192" rx="4" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <text class="t-md t-gold" x="64" y="54" text-anchor="start">Trading Plan — กรอบการเทรดทั้งหมด</text>
  <text class="t-xs" x="64" y="80" text-anchor="start">กฎความเสี่ยง (ระดับ 4) · ตลาด/เวลาที่เทรด · เป้าหมาย · กฎหยุดพัก</text>
  <rect x="64" y="100" width="532" height="92" rx="3" fill="var(--card)" stroke="var(--hair-2)" stroke-width="1.5"/>
  <text class="t-md" x="88" y="130" text-anchor="start">Trading System — ชุดกฎภายใน</text>
  <text class="t-xs" x="88" y="156" text-anchor="start">เงื่อนไขเข้า (setup + trigger) · SL/TP · ขนาดไม้ · เงื่อนไข &quot;ไม่เทรด&quot;</text>
  <text class="t-xs t-gold" x="88" y="178" text-anchor="start">เกณฑ์วัด: คนสองคนอ่านกฎแล้วต้องเทรดออกมาเหมือนกัน</text>
</svg>`;

const SVG_STATS = `<svg viewBox="0 0 660 230" role="img" aria-label="equity curve จาก backtest พร้อม max drawdown">
  <line x1="40" y1="190" x2="620" y2="190" stroke="var(--hair-2)" stroke-width="1"/>
  <polyline points="40,180 90,168 130,174 180,150 230,158 280,130 320,148 370,152 420,120 470,128 520,96 570,104 620,72" fill="none" stroke="var(--up)" stroke-width="2"/>
  <rect x="300" y="128" width="76" height="28" fill="var(--down-tint)" opacity="0.7"/>
  <text class="t-xs t-down" x="338" y="176" text-anchor="middle">Max DD −12R</text>
  <text class="t-xs" x="46" y="30">ผล backtest 100 ไม้ (คิดเป็น R ล้วน ไม่ใช่เงิน)</text>
  <text class="t-xs t-up" x="614" y="60" text-anchor="end">+30R</text>
</svg>`;

const SVG_OVERFIT = `<svg viewBox="0 0 660 230" role="img" aria-label="in-sample สวย live พัง">
  <line x1="330" y1="30" x2="330" y2="200" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-gold" x="330" y="22" text-anchor="middle">เริ่มเทรดจริง</text>
  <text class="t-sm t-up" x="180" y="46" text-anchor="middle">Backtest (จูนจนสวย)</text>
  <polyline points="40,180 90,160 140,140 190,116 240,92 290,68 330,52" fill="none" stroke="var(--up)" stroke-width="2"/>
  <text class="t-sm t-down" x="480" y="46" text-anchor="middle">ตลาดจริง</text>
  <polyline points="330,52 380,84 430,110 480,144 530,132 580,168 620,186" fill="none" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs t-down" x="480" y="210" text-anchor="middle">กฎที่ &quot;จำอดีต&quot; ไม่ได้ &quot;เข้าใจตลาด&quot; — เจอข้อมูลใหม่แล้วพัง</text>
</svg>`;

const SVG_OOS = `<svg viewBox="0 0 660 190" role="img" aria-label="แบ่งข้อมูล in-sample และ out-of-sample">
  <rect class="bar-n" x="40" y="60" width="380" height="54"/>
  <text class="t-md" x="230" y="83" text-anchor="middle">In-sample · 2021–2023</text>
  <text class="t-xs" x="230" y="104" text-anchor="middle">พัฒนา/จูนกฎได้เต็มที่</text>
  <rect class="bar-gold" x="424" y="60" width="196" height="54"/>
  <text class="t-md t-gold" x="522" y="83" text-anchor="middle">Out-of-sample · 2024</text>
  <text class="t-xs" x="522" y="104" text-anchor="middle">ห้ามแตะจนกฎล็อก</text>
  <text class="t-sm" x="330" y="150" text-anchor="middle">ล็อกกฎก่อน แล้วค่อยเปิดกล่อง OOS — และเปิดได้ &quot;ครั้งเดียว&quot;</text>
  <text class="t-xs t-down" x="330" y="172" text-anchor="middle">ทดสอบ OOS ซ้ำ ๆ แล้วแก้กฎ = OOS กลายเป็น in-sample โดยไม่รู้ตัว</text>
</svg>`;

const SVG_KILL = `<svg viewBox="0 0 660 230" role="img" aria-label="kill line บน equity curve">
  <line x1="40" y1="60" x2="620" y2="60" stroke="var(--hair-2)" stroke-width="1"/>
  <text class="t-xs" x="46" y="50">ทุนเริ่มต้น</text>
  <line x1="40" y1="170" x2="620" y2="170" stroke="var(--down)" stroke-width="2" stroke-dasharray="7 4"/>
  <text class="t-xs t-down" x="614" y="190" text-anchor="end">Kill line −18R (ตั้งไว้ &quot;ก่อน&quot; เริ่มเทรด)</text>
  <polyline points="40,60 100,84 150,70 210,110 270,88 330,126 390,102 450,140 510,158 560,170" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <circle cx="560" cy="170" r="6" fill="var(--down)"/>
  <text class="t-xs t-down" x="560" y="150" text-anchor="middle">แตะเส้น = หยุด ไม่มีข้อแม้</text>
  <text class="t-xs" x="250" y="210" text-anchor="middle">DD ระหว่างทางคือเรื่องปกติ (backtest เคยเห็น −12R) — เกณฑ์ยุติอยู่ลึกกว่านั้นอย่างมีเหตุผล</text>
</svg>`;

const SVG_LIFECYCLE = `<svg viewBox="0 0 660 250" role="img" aria-label="วงจรชีวิตระบบเทรด">
  <rect class="chip-n" x="30" y="30" width="120" height="52" rx="3"/><text class="t-sm" x="90" y="60" text-anchor="middle">1 ไอเดีย</text>
  <path d="M155,56 L180,56 M172,49 L184,56 L172,63" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="188" y="30" width="120" height="52" rx="3"/><text class="t-sm" x="248" y="54" text-anchor="middle">2 เขียนกฎ</text><text class="t-xs" x="248" y="72" text-anchor="middle">ชัดจนทำซ้ำได้</text>
  <path d="M313,56 L338,56 M330,49 L342,56 L330,63" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="346" y="30" width="120" height="52" rx="3"/><text class="t-sm" x="406" y="54" text-anchor="middle">3 Backtest</text><text class="t-xs" x="406" y="72" text-anchor="middle">≥100 ไม้ หลังต้นทุน</text>
  <path d="M471,56 L496,56 M488,49 L500,56 L488,63" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="504" y="30" width="126" height="52" rx="3"/><text class="t-sm" x="567" y="54" text-anchor="middle">4 OOS</text><text class="t-xs" x="567" y="72" text-anchor="middle">เปิดครั้งเดียว</text>
  <path d="M567,86 L567,116 M560,106 L567,118 L574,106" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="504" y="122" width="126" height="52" rx="3"/><text class="t-sm" x="567" y="146" text-anchor="middle">5 Demo/ไม้จิ๋ว</text><text class="t-xs" x="567" y="164" text-anchor="middle">30–50 ไม้จริง</text>
  <path d="M499,148 L474,148 M482,141 L470,148 L482,155" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-gold" x="346" y="122" width="120" height="52" rx="3" stroke-width="2"/><text class="t-sm t-gold" x="406" y="146" text-anchor="middle">6 Live เล็ก</text><text class="t-xs" x="406" y="164" text-anchor="middle">เสี่ยง 0.5%/ไม้</text>
  <path d="M341,148 L316,148 M324,141 L312,148 L324,155" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-ok" x="188" y="122" width="120" height="52" rx="3"/><text class="t-sm t-up" x="248" y="146" text-anchor="middle">7a ขยาย</text><text class="t-xs" x="248" y="164" text-anchor="middle">ผลตรง backtest</text>
  <rect class="chip-bad" x="188" y="188" width="120" height="46" rx="3"/><text class="t-sm t-down" x="248" y="216" text-anchor="middle">7b ยุติ</text>
  <path d="M248,178 L248,186" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs" x="90" y="216" text-anchor="start">ทุกด่านคือประตูคัดออก —</text>
  <text class="t-xs" x="90" y="232" text-anchor="start">ไม่ผ่านด่านใด กลับไปข้อ 1</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 7 · หมวด 7.1 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">สร้างและทดสอบระบบ — หมวดเรือธงของหลักสูตร</span>
        <h1>จากความรู้ สู่ระบบที่พิสูจน์ได้ (และรู้ว่าเมื่อใดควรยุติ)</h1>
        <p className="lead">
          ทุกอย่างที่เรียนมาถึงตอนนี้ยังเป็นแค่ &quot;ความรู้&quot; — หมวดนี้แปลงมันเป็น<b>ระบบ: กฎที่ชัดจนทดสอบได้
          วัดผลได้ และตัดสินได้ว่ามี edge จริงหรือไม่</b> นี่คือหมวดที่แทบไม่มีใครในไทยสอนแบบลงมือจริง
          และเราสอนจากประสบการณ์ตรง: เราเคย backtest ระบบทองด้วยข้อมูล tick 4 ปี — และตัดสินใจยุติระบบนั้นก่อนนำเงินจริงเข้าเสี่ยง
        </p>
      </div>

      <div className="wrap">
        {/* L1 plan vs system */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>Plan vs System — และ 5 คำถามที่ระบบต้องตอบ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_PLANSYS }} />
            <div className="figcap">Plan คือกรอบชีวิตเทรดทั้งหมด · System คือเครื่องจักรข้างใน — เกณฑ์วัดความชัด: สองคนอ่านแล้วเทรดเหมือนกัน</div>
          </div>
          <div className="body-txt">
            <p><b>Trading plan</b> คือกรอบใหญ่: เทรดตลาดไหน เวลาไหน กฎความเสี่ยง 3 ชั้น (ระดับ 4.3) เป้าหมาย และเมื่อไหร่ต้องพัก · <b>Trading system</b> คือชุดกฎภายใน: กฎ entry/exit ที่เจาะจง — และเกณฑ์วัดว่ากฎ &quot;ชัดพอ&quot; หรือยังมีข้อเดียว: <b>ให้คนสองคนอ่านกฎเดียวกันแล้วเทรดกราฟเดียวกัน ผลต้องออกมาเหมือนกัน</b> ถ้ายังต่างกัน แปลว่ากฎยังมีคำว่า &quot;ดูสวย&quot; &quot;แข็งแรง&quot; &quot;น่าจะ&quot; ซ่อนอยู่ — ยังทดสอบไม่ได้</p>
            <p>ระบบที่สมบูรณ์ต้องตอบ 5 คำถามเป็นลายลักษณ์อักษร: (1) <b>ตลาด/TF อะไร</b> — เช่น &quot;ทอง, ชุด D1/H4/M15&quot; (2) <b>เงื่อนไขเข้า</b> — setup + trigger เช่น &quot;D1 เทรนด์ขึ้น + ราคาเข้า H4 fresh demand + M15 เกิด SFP หรือ engulfing&quot; (3) <b>SL/TP</b> — &quot;SL ใต้โซน + 1×ATR(M15), TP1 = 2R ปิดครึ่ง, TP2 = โครงสร้างถัดไป&quot; (4) <b>ขนาดไม้</b> — สูตร 1% จากระดับ 4.2 (5) <b>เงื่อนไขไม่เทรด</b> — &quot;วันข่าวแดง ±15 นาที, กลาง range, แพ้ครบ 2 ไม้ในวัน&quot;</p>
            <p>สังเกตว่าตัวอย่างข้างบนคือ<b>ระบบจากระดับ 5+6 ทั้งชุดที่ถูกเขียนเป็นกฎ</b> — คุณมีวัตถุดิบครบแล้ว หมวดนี้แค่สอนประกอบและพิสูจน์</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>กฎที่ทดสอบได้ = สองคนอ่านแล้วเทรดเหมือนกัน · ระบบสมบูรณ์ = ตอบครบ 5 คำถามบนกระดาษ</p></div>
        </div>

        {/* L2 backtest 101 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>Backtest 101 — นับเป็น R และอ่านสถิติให้เป็น</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_STATS }} />
            <div className="figcap">ผลลัพธ์ backtest ที่ดีไม่ใช่ &quot;กราฟขึ้น&quot; — คือชุดสถิติที่บอกว่าจะเจออะไรตอนเทรดจริง</div>
          </div>
          <div className="body-txt">
            <p>วิธีที่มือใหม่เริ่มได้เลยคือ <b>bar replay</b> (เลื่อนกราฟย้อนหลังทีละแท่ง เทรดตามกฎเสมือนไม่รู้อนาคต) — ช้ากว่าเขียนโปรแกรม แต่ซื่อสัตย์พอถ้าทำถูกวิธี เก็บ<b>อย่างน้อย 100 ไม้</b> (น้อยกว่านั้นสถิติเชื่อไม่ได้) และบันทึกทุกไม้เป็น R ไม่ใช่เงิน</p>
            <p>ตัวอย่างผลที่อ่านเป็น (ตัวเลขสมมติของระบบสมมุติ):</p>
            <div className="calc c2">
              <div className="crow head"><span>สถิติจาก 100 ไม้</span><span className="v">ค่า</span></div>
              <div className="crow"><span className="k">Win rate</span><span className="v">42%</span></div>
              <div className="crow"><span className="k">กำไรเฉลี่ยไม้ชนะ / ขาดทุนเฉลี่ยไม้แพ้</span><span className="v">+2.1R / −1.0R</span></div>
              <div className="crow hl"><span className="k">Expectancy = (0.42×2.1) − (0.58×1.0)</span><span className="v pos">+0.30R ต่อไม้</span></div>
              <div className="crow"><span className="k">แพ้ติดกันยาวสุด</span><span className="v">9 ไม้</span></div>
              <div className="crow"><span className="k">Max drawdown</span><span className="v neg">−12R</span></div>
            </div>
            <p>สองบรรทัดล่างสำคัญไม่แพ้ expectancy: <b>&quot;แพ้ติดกัน 9 ไม้&quot; และ &quot;DD −12R&quot; คือสิ่งที่คุณจะต้องนั่งทนให้ได้ตอนเทรดจริง</b> — ถ้าดูตัวเลขนี้แล้วประเมินว่าเกินระดับที่รับได้ ให้แก้ที่ขนาดความเสี่ยงต่อไม้ (ลด 1% → 0.5%) ไม่ใช่แก้ที่กฎจนสถิติดูน่าพอใจ ซึ่งนำไปสู่กับดักในบทถัดไป</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>≥100 ไม้ นับเป็น R · expectancy บอกว่าคุ้มไหม แต่ max DD กับ losing streak บอกว่าคุณจะ &quot;ทนไหว&quot; ไหม</p></div>
        </div>

        {/* L3 overfitting */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>★ กับดักที่ทำลายระบบมากที่สุด: Overfitting และต้นทุนที่ถูกมองข้าม</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_OVERFIT }} />
            <div className="figcap">ระบบที่ถูกปรับให้พอดีกับข้อมูลอดีต มักล้มเหลวเมื่อพบข้อมูลใหม่ที่ไม่เคยเห็น</div>
          </div>
          <div className="body-txt">
            <p><b>Overfitting</b> คือการปรับกฎ/พารามิเตอร์ซ้ำ ๆ จนระบบ &quot;พอดี&quot; กับข้อมูลอดีตชุดนั้นเป๊ะ — ผล backtest สวยขึ้นทุกครั้งที่จูน แต่สิ่งที่คุณกำลังทำคือสอนระบบให้<b>จำ noise</b> ไม่ใช่จับ pattern จริง สัญญาณเตือน: กฎเยอะขึ้นเรื่อย ๆ (&quot;เข้าเฉพาะวันอังคารที่ RSI 47–63&quot;), ผลดีขึ้นจากการขยับพารามิเตอร์ทีละนิด, และผลไวมากต่อการเปลี่ยนค่าเล็กน้อย — ระบบจริงต้อง<b>ทน (robust)</b>: ขยับพารามิเตอร์ ±20% แล้วผลยังไปทางเดียวกัน</p>
            <p>กับดักที่สอง จากประสบการณ์ตรงของเรา: <b>ลืมต้นทุน</b> — spread, commission, swap และ slippage ระบบที่เทรดถี่บน TF เล็กอาจ &quot;มี edge&quot; ก่อนหักต้นทุน แล้ว<b>ไม่เหลือกำไรอย่างมีนัย</b>หลังหัก ตอนเราทดสอบ breakout ทองด้วยข้อมูล tick 4 ปี ระบบที่ดูมีกำไรด้วยตาเปล่า พอคิดต้นทุนจริงต่อไม้ครบทุกตัว edge ที่เหลือ = ไม่มีนัย — <b>ผลทดสอบที่ไม่หักต้นทุน ไม่สามารถใช้อ้างอิงได้จริง</b></p>
            <p>กับดักย่อยที่ต้องรู้ชื่อ: <b>look-ahead bias</b> — เผลอใช้ข้อมูลที่ ณ เวลานั้นยังไม่เกิด (เช่น ตัดสินใจจากราคาปิดแท่ง ทั้งที่ตอนนั้นแท่งยังไม่ปิด) bar replay ช่วยกันเรื่องนี้ได้ดีถ้าไม่โกงเลื่อนไปดูข้างหน้า</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>จูนจนสวย = จำ noise · ระบบจริงต้องทนต่อการขยับพารามิเตอร์ และต้องรอดหลังหักต้นทุนครบทุกตัว</p></div>
        </div>

        {/* L4 OOS */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>★ Out-of-Sample — ทดสอบด้วยข้อมูลที่ระบบไม่เคยเห็น</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_OOS }} />
            <div className="figcap">กันข้อมูลส่วนหนึ่งไว้เป็นชุดทดสอบขั้นสุดท้าย — ใช้ซ้ำหลายครั้งจะสูญเสียความน่าเชื่อถือ</div>
          </div>
          <div className="body-txt">
            <p>วิธีจับ overfit ที่ตรงที่สุด: <b>แบ่งข้อมูลเป็นสองส่วน</b> — ส่วนแรก (in-sample เช่น 3 ปีแรก) ใช้พัฒนา/จูนกฎได้เต็มที่ ส่วนที่สอง (out-of-sample ปีล่าสุด) <b>ห้ามแตะเด็ดขาด</b>จนกว่ากฎจะล็อกแล้ว — จากนั้นรันกฎที่ล็อกบน OOS หนึ่งครั้ง: ถ้า expectancy ยังไปทางเดียวกัน (ยอมให้ทรุดได้บ้าง เช่น เหลือ 60–70%) = ระบบน่าจะจับอะไรจริง ถ้า<b>ลดลงมากหรือพลิกเป็นลบ = overfit</b> กลับไปเริ่มใหม่</p>
            <p>กฎสำคัญที่ถูกละเมิดมากที่สุด: <b>OOS ใช้ทดสอบได้ครั้งเดียว</b> — ถ้าไม่ผ่านแล้ว &quot;แก้กฎเล็กน้อย&quot; เพื่อทดสอบใหม่ ทำวนซ้ำไปเรื่อย ๆ OOS จะค่อย ๆ กลายเป็น in-sample (เป็นการปรับกฎเข้าหาข้อมูลทางอ้อม) — ไม่ผ่านหมายถึงกลับไปเริ่มแนวคิดใหม่</p>
            <p>ขั้นที่เนี้ยบกว่า (เผื่ออยากไปต่อสาย quant): <b>walk-forward</b> — เลื่อนหน้าต่าง in-sample/OOS ไปข้างหน้าเรื่อย ๆ หลายรอบ เพื่อดูว่าระบบรอดข้ามหลาย regime ของตลาดไหม (ขาขึ้น ขาลง sideways ผันผวนสูง-ต่ำ) ระบบที่ใช้ได้เพียง regime เดียว มีความเสี่ยงสูงที่จะล้มเหลวเมื่อสภาวะตลาดเปลี่ยน</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ล็อกกฎ → ทดสอบ OOS ครั้งเดียว · ไม่ผ่าน = เริ่มแนวคิดใหม่ ไม่ใช่แก้กฎแล้วทดสอบซ้ำ</p></div>
        </div>

        {/* L5 kill criteria */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>★ Kill Criteria — เกณฑ์ยุติระบบที่กำหนดไว้ล่วงหน้า</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_KILL }} />
            <div className="figcap">เกณฑ์ยุติถูกกำหนด &quot;ก่อน&quot; เริ่มเทรด — เพราะขณะขาดทุน เรามักหาเหตุผลให้ไปต่อเสมอ</div>
          </div>
          <div className="body-txt">
            <p>ทุกระบบมีวันเสื่อมสภาพ — ตลาดเปลี่ยน regime, edge ถูกตลาดปรับตัวจนหาย, หรือระบบไม่เคยมี edge จริงตั้งแต่ต้น คำถามไม่ใช่ &quot;ระบบจะเสื่อมหรือไม่&quot; แต่คือ <b>&quot;จะทราบได้อย่างไรว่าระบบเสื่อมสภาพแล้ว โดยไม่ต้องสูญเสียเงินทุนจำนวนมากเพื่อพิสูจน์&quot;</b> — คำตอบคือกำหนดเกณฑ์ยุติไว้ล่วงหน้าตั้งแต่วันที่ยังไม่มีอารมณ์ผูกพัน:</p>
            <div className="calc c2">
              <div className="crow head"><span>Kill criteria (อิงสถิติ backtest ของระบบตัวอย่างบทที่ 2)</span><span className="v">เกณฑ์</span></div>
              <div className="crow"><span className="k">Drawdown เกิน 1.5× ของ max DD ที่ backtest เคยเห็น (−12R)</span><span className="v neg">−18R = หยุด</span></div>
              <div className="crow"><span className="k">แพ้ติดกันเกิน 1.5× ของ streak ยาวสุดใน backtest (9)</span><span className="v neg">14 ไม้ = หยุด</span></div>
              <div className="crow"><span className="k">Expectancy ย้อนหลัง 30 ไม้ล่าสุด</span><span className="v neg">ติดลบ 2 รอบติด = หยุด</span></div>
            </div>
            <p>ทำไมคูณ 1.5 ไม่ใช่เท่ากับ backtest เป๊ะ: เพราะอนาคตย่อมโหดกว่าอดีตที่เราเห็นบ้าง — DD ที่ลึกกว่า backtest เล็กน้อยคือความแปรปรวนปกติ แต่ลึกกว่า 1.5 เท่า = ระบบกำลังเจอสิ่งที่มันไม่เคยเจอ = หยุดก่อนแล้วค่อยสืบสวน · <b>&quot;หยุด&quot; ไม่ได้แปลว่าทิ้งถาวร</b> — แปลว่ากลับไป demo/กระดาษจนกว่าจะเข้าใจว่าเกิดอะไรขึ้น</p>
            <p><b>และนี่คือประเด็นที่เราอยากปลูกฝังที่สุดของทั้งหลักสูตร:</b> เราเคยเชื่อมากว่า breakout ทองมี edge — ทดสอบด้วย tick data 4 ปี ทำทุกขั้นข้างบนอย่างซื่อสัตย์ ผลคือไม่มี edge ที่มีนัยหลังต้นทุน เราจึง<b>ยุติระบบตั้งแต่ขั้นทดสอบ</b> — สูญเสียเพียงเวลา ไม่ใช่เงินทุน <b>การยุติระบบด้วยหลักฐานจากข้อมูลคือความสำเร็จของกระบวนการ ไม่ใช่ความล้มเหลว</b> การยุติระบบในขั้นทดสอบ 10 ระบบ มีต้นทุนต่ำกว่าการปล่อยให้ระบบล้มเหลวด้วยเงินจริงเพียงระบบเดียวเสมอ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>กำหนดเกณฑ์ยุติ (≈1.5× ของสถิติ backtest) ก่อนเทรดจริง · ยุติระบบในขั้นทดสอบ = ความสำเร็จของกระบวนการ</p></div>
        </div>

        {/* L6 lifecycle */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>Playbook: วงจรชีวิตระบบ — 7 ด่านจากไอเดียถึงเงินจริง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_LIFECYCLE }} />
            <div className="figcap">ทุกด่านคือประตูคัดออก — ระบบส่วนใหญ่ควรถูกคัดออกก่อนถึงขั้นเงินจริง นั่นคือกระบวนการคัดกรองที่ทำงานถูกต้อง</div>
          </div>
          <div className="body-txt">
            <p>รวมทั้งหมวดเป็นเส้นทางเดียว: <b>ไอเดีย → เขียนกฎ (5 คำถาม) → backtest ≥100 ไม้หลังต้นทุน → OOS ครั้งเดียว → demo/ไม้จิ๋ว 30–50 ไม้ (วัดว่าคุณ execute ตามกฎได้จริงไหม — คนละเรื่องกับระบบดี) → live เสี่ยง 0.5% → ผ่าน 50 ไม้แล้วผลใกล้ backtest ค่อยขยับเป็น 1%</b> — และ kill criteria คุมอยู่ทุกด่านหลังจากนั้นตลอดชีวิตระบบ</p>
            <p>ความคาดหวังที่ถูกต้อง: แนวคิด 10 แนวคิด อาจผ่านถึง live เพียง 1–2 — <b>นั่นไม่ใช่ความล้มเหลว นั่นคือกระบวนการคัดกรองที่ทำงานได้ผล</b> ผู้ที่ &quot;ทุกแนวคิดใช้ได้หมด&quot; คือผู้ที่กระบวนการทดสอบยังไม่เข้มงวดเพียงพอ</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>ระบบจะดีเพียงใด หากผู้ใช้ไม่สามารถปฏิบัติตามได้ ก็ไม่เกิดผล — หมวดปิดระดับ <b><a href="/grade/psychology-journal">7.2 จิตวิทยา วินัย และ Trading Journal</a></b> ว่าด้วยตัวแปรสุดท้ายที่วัดยากที่สุด: ตัวคุณเอง</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>7 ด่าน: กฎ → backtest → OOS → demo → live เล็ก → ขยาย/ยุติ · ระบบส่วนใหญ่ควรถูกคัดออกระหว่างทาง — นั่นคือกระบวนการที่ถูกต้อง</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · สถิติระบบในหน้านี้เป็นตัวเลขสมมติเพื่อสอนวิธีอ่าน · ผลการทดสอบในอดีตไม่รับประกันผลในอนาคต · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 7 หมวด 7.1 (Premium)
      </div>
    </>
  );
}
