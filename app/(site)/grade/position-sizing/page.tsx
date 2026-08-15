import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 4 · Position Sizing & Stop Loss — คำนวณขนาดไม้ · Cerfinits Grade",
  description:
    "คำนวณ lot size จาก % risk, วาง SL จากโครงสร้างราคา, ATR-based stop, ทำไม SL โดนกวาด และ R:R ที่ต้องเข้าใจจริง",
  alternates: { canonical: "/grade/position-sizing" },
};

const SVG_FLOW = `<svg viewBox="0 0 660 180" role="img" aria-label="ขั้นตอนคำนวณขนาดไม้">
  <rect class="chip-n" x="20" y="56" width="130" height="60" rx="3"/>
  <text class="t-sm" x="85" y="82" text-anchor="middle">บัญชี $1,000</text>
  <text class="t-sm" x="85" y="102" text-anchor="middle">× เสี่ยง 1%</text>
  <path d="M155,86 L185,86 M176,79 L188,86 L176,93" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="bar-down" x="192" y="56" width="120" height="60" rx="3"/>
  <text class="t-sm t-down" x="252" y="82" text-anchor="middle">= เสี่ยง</text>
  <text class="t-md t-down" x="252" y="104" text-anchor="middle">$10</text>
  <path d="M318,86 L348,86 M339,79 L351,86 L339,93" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="355" y="56" width="150" height="60" rx="3"/>
  <text class="t-sm" x="430" y="80" text-anchor="middle">÷ (SL $5</text>
  <text class="t-sm" x="430" y="100" text-anchor="middle">× $100/lot)</text>
  <path d="M511,86 L541,86 M532,79 L544,86 L532,93" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="bar-gold" x="548" y="56" width="100" height="60" rx="3"/>
  <text class="t-sm t-gold" x="598" y="82" text-anchor="middle">ขนาดไม้</text>
  <text class="t-md t-gold" x="598" y="104" text-anchor="middle">0.02</text>
  <text class="t-xs" x="330" y="150" text-anchor="middle">ทองคำ: 1.00 lot ขยับ $1 = $100 · ฉะนั้น SL $5 บน 0.02 lot = ขาดทุน $10 พอดี</text>
</svg>`;

const SVG_SL_STRUCT = `<svg viewBox="0 0 660 200" role="img" aria-label="วาง SL จากโครงสร้างกับจากเงิน">
  <text class="t-sm t-up" x="165" y="22" text-anchor="middle">SL ใต้โครงสร้าง ✓</text>
  <polyline points="40,60 90,110 150,140 210,90 270,60" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="40" y1="150" x2="290" y2="150" stroke="var(--up)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-up" x="44" y="168">SL ใต้ swing low — เผื่อ noise</text>
  <line x1="330" y1="30" x2="330" y2="180" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-down" x="495" y="22" text-anchor="middle">SL ตามเงินที่ยอมเสีย ✕</text>
  <polyline points="380,60 430,108 470,120 460,120 520,88 600,58" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="380" y1="112" x2="630" y2="112" stroke="var(--down)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <circle cx="470" cy="112" r="5" fill="var(--down)"/>
  <text class="t-xs t-down" x="384" y="132">SL กลางอากาศ — โดน noise เขี่ยออก</text>
</svg>`;

const SVG_STOPHUNT = `<svg viewBox="0 0 660 180" role="img" aria-label="stop hunt วาง SL ใต้โซน">
  <line x1="40" y1="120" x2="620" y2="120" stroke="var(--up)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-up" x="44" y="114">โซนแนวรับ (SL คนส่วนใหญ่กองที่ขอบ)</text>
  <polyline points="60,70 140,116 200,150 240,118 320,80 420,60" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <circle cx="200" cy="150" r="5" fill="var(--down)"/>
  <text class="t-xs t-down" x="200" y="170" text-anchor="middle">ราคาแทงต่ำกวาด SL แล้วเด้งกลับ</text>
  <line x1="440" y1="150" x2="620" y2="150" stroke="var(--gold)" stroke-width="1.5"/>
  <text class="t-xs t-gold" x="616" y="144" text-anchor="end">วาง SL ใต้โซน ไม่ใช่ที่ขอบพอดี</text>
</svg>`;

const SVG_ATRSTOP = `<svg viewBox="0 0 660 175" role="img" aria-label="ATR กำหนดระยะ SL">
  <text class="t-sm t-up" x="165" y="22" text-anchor="middle">ATR ต่ำ (เงียบ) → SL แคบ</text>
  <line x1="120" y1="70" x2="120" y2="106" stroke="var(--up)" stroke-width="1.5"/><rect x="112" y="80" width="16" height="16" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="160" y1="74" x2="160" y2="110" stroke="var(--up)" stroke-width="1.5"/><rect x="152" y="84" width="16" height="16" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="200" y1="72" x2="200" y2="108" stroke="var(--up)" stroke-width="1.5"/><rect x="192" y="82" width="16" height="16" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="250" y1="96" x2="250" y2="130" stroke="var(--gold)" stroke-width="2"/><text class="t-xs t-gold" x="266" y="118">SL</text>
  <line x1="330" y1="34" x2="330" y2="158" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-down" x="495" y="22" text-anchor="middle">ATR สูง (ผันผวน) → SL กว้าง</text>
  <line x1="430" y1="44" x2="430" y2="120" stroke="var(--down)" stroke-width="1.5"/><rect x="422" y="60" width="16" height="40" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.5"/>
  <line x1="480" y1="52" x2="480" y2="128" stroke="var(--down)" stroke-width="1.5"/><rect x="472" y="70" width="16" height="42" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.5"/>
  <line x1="530" y1="46" x2="530" y2="122" stroke="var(--down)" stroke-width="1.5"/><rect x="522" y="62" width="16" height="40" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.5"/>
  <line x1="580" y1="70" x2="580" y2="150" stroke="var(--gold)" stroke-width="2"/><text class="t-xs t-gold" x="596" y="114">SL</text>
</svg>`;

const SVG_RR = `<svg viewBox="0 0 660 190" role="img" aria-label="reward to risk 1 ต่อ 2">
  <rect x="150" y="40" width="360" height="40" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <text class="t-sm t-up" x="330" y="65" text-anchor="middle">กำไรเป้า (TP) = +2R</text>
  <line x1="150" y1="90" x2="510" y2="90" stroke="var(--ink)" stroke-width="2"/>
  <text class="t-xs" x="142" y="94" text-anchor="end">จุดเข้า</text>
  <rect x="150" y="100" width="180" height="30" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.5"/>
  <text class="t-sm t-down" x="240" y="121" text-anchor="middle">ขาดทุน (SL) = −1R</text>
  <text class="t-sm" x="330" y="165" text-anchor="middle">R:R 1:2 = เสี่ยง 1 หน่วยเพื่อผลตอบแทน 2 หน่วย · ชนะแค่ 40% ก็ยังกำไรได้</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 4 · หมวด 4.2</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Position Sizing &amp; Stop Loss</span>
        <h1>คำนวณขนาดไม้ และวาง SL ให้เสี่ยงเท่าที่ตั้งใจ</h1>
        <p className="lead">
          หมวดก่อนบอก &quot;ทำไม&quot; หมวดนี้คือ &quot;ทำยังไง&quot; — <b>สูตรเดียวที่ทำให้คุณเสี่ยงเท่ากันทุกไม้</b>
          ไม่ว่าจะเทรดทองหรือคู่เงินไหน และวิธีวาง SL ที่ไม่โดนกวาดออกง่าย ๆ
        </p>
      </div>

      <div className="wrap">
        {/* L1 lot sizing */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>★ สูตรคำนวณขนาดไม้จาก % ความเสี่ยง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_FLOW }} />
            <div className="figcap">กำหนดว่าจะเสี่ยงกี่ % ก่อน แล้วให้ &quot;ระยะ SL&quot; เป็นตัวกำหนดขนาดไม้ — ไม่ใช่กลับกัน</div>
          </div>
          <div className="formula">
            <span className="eq">ขนาดไม้ = (บัญชี × %เสี่ยง) ÷ (ระยะ SL เป็น $ × มูลค่าต่อ 1 lot ต่อการขยับ $1)</span>
            <span className="fnote">ทองคำ $ ต่อ 1.00 lot ต่อการขยับ $1 = $100 · ตัวอย่าง: (1,000 × 1%) ÷ (5 × 100) = 10 ÷ 500 = <b>0.02 lot</b></span>
          </div>
          <div className="body-txt">
            <p>นี่คือสูตรที่สำคัญที่สุดในหลักสูตร มันพลิกลำดับความคิดของมือใหม่: <b>คุณไม่ได้เลือกขนาดไม้ก่อนแล้วหวังว่ามันจะไม่เจ็บ</b> — คุณกำหนดว่าจะเสี่ยงกี่ % และวาง SL ตรงไหน (จากโครงสร้าง) แล้ว<b>คำนวณย้อนกลับ</b>ว่าต้องเปิดกี่ lot</p>
            <p>ผลคือคุณเสี่ยง 1% เท่ากันทุกไม้เป๊ะ ไม่ว่า SL จะห่างหรือชิด — SL ห่างก็เปิดไม้เล็กลง, SL ชิดก็เปิดไม้ใหญ่ขึ้น ความเสี่ยงคงที่เสมอ นี่คือสิ่งที่แยก &quot;เทรดเดอร์&quot; ออกจาก &quot;คนกดสุ่ม lot&quot;</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>กำหนด %เสี่ยง + ระยะ SL ก่อน → คำนวณ lot ย้อนกลับ · เสี่ยงเท่ากันทุกไม้</p></div>
        </div>

        {/* L2 SL from structure */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>วาง SL จากโครงสร้างราคา ไม่ใช่จากเงินที่ยอมเสีย</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SL_STRUCT }} />
            <div className="figcap">SL ควรอยู่ตรงจุดที่ &quot;ถ้าถึงตรงนี้ แปลว่าเราคิดผิด&quot; — ไม่ใช่ตรงที่เงินหมดพอดี</div>
          </div>
          <div className="body-txt">
            <p>ข้อผิดพลาดคลาสสิก: &quot;ผมยอมเสีย $10 เลยตั้ง SL ห่าง 10 จุด&quot; — นี่คือการวาง SL จากกระเป๋าเงิน ไม่ใช่จากตลาด SL ที่ถูกต้องต้องอยู่ตรงจุดที่ <b>&quot;ถ้าราคาถึงตรงนี้ แปลว่าไอเดียเราผิดแล้ว&quot;</b> เช่น ใต้ swing low หรือใต้โซนแนวรับ</p>
            <p>ลำดับที่ถูก: หาจุด SL จากโครงสร้างก่อน → วัดระยะ → เอาไปเข้าสูตรข้อ 1 เพื่อหา lot ถ้าระยะนั้นทำให้เสี่ยงเกินที่รับได้ คำตอบคือ<b>เปิดไม้เล็กลง ไม่ใช่ขยับ SL เข้ามา</b></p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>SL = จุดที่ &quot;เราคิดผิด&quot; (โครงสร้าง) · เสี่ยงเกิน = ลดไม้ ไม่ใช่ขยับ SL</p></div>
        </div>

        {/* L3 ATR stop */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>ATR-based Stop — ให้ความผันผวนกำหนดระยะ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_ATRSTOP }} />
            <div className="figcap">ตลาดผันผวนสูง (ATR สูง) ต้องเผื่อระยะ SL มากขึ้น ไม่งั้นโดน noise เขี่ย</div>
          </div>
          <div className="body-txt">
            <p>จำ ATR จากหมวด 3.1 ได้ไหม? นี่คือที่มันใช้จริง — แทนที่จะเดาว่า SL ควรห่างเท่าไหร่ ใช้ <b>ATR × ตัวคูณ</b> (เช่น 1.5 เท่าของ ATR) เป็นระยะ SL วิธีนี้ทำให้ SL <b>ปรับตามความผันผวนของตลาดโดยอัตโนมัติ</b> — ตลาดเงียบ SL ชิด, ตลาดผันผวน SL เผื่อกว้าง</p>
            <p>ข้อดี: คุณไม่โดนเขี่ยออกเพราะ &quot;การแกว่งปกติ&quot; ของตลาด และเมื่อ SL กว้างขึ้น สูตรข้อ 1 จะลดขนาดไม้ให้เอง — ความเสี่ยงยังคงที่</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ใช้ ATR ตั้งระยะ SL — ผันผวนสูงเผื่อกว้าง แล้วให้สูตรลดไม้ให้เอง</p></div>
        </div>

        {/* L4 stop hunt */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>ทำไม SL ถึงโดนกวาดบ่อย — และแก้ยังไง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_STOPHUNT }} />
            <div className="figcap">อย่าวาง SL ตรงขอบแนวที่ &quot;ชัดเกินไป&quot; เพราะที่นั่นคือที่ SL ของทุกคนกองอยู่</div>
          </div>
          <div className="body-txt">
            <p>เคยไหม — ตั้ง SL ใต้แนวรับพอดี ราคาแทงลงมาโดน SL แล้วเด้งกลับขึ้นทันที? นั่นไม่ใช่เรื่องบังเอิญ ที่ &quot;ขอบแนวที่ชัดเจน&quot; คือที่ที่ SL ของรายย่อยทั้งตลาดกองรวมกัน — และราคามักถูกดันไปแตะโซนนั้นเพื่อ &quot;เก็บสภาพคล่อง&quot; ก่อนไปทางจริง</p>
            <p>ทางแก้: วาง SL <b>ใต้โซนทั้งโซน</b> (เผื่อระยะด้วย ATR) ไม่ใช่ชิดขอบเป๊ะ — ยอมเสี่ยงกว้างขึ้นนิดหน่อย (แล้วลดไม้ตามสูตร) แลกกับการไม่โดนกวาดออกทั้งที่คิดถูก</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>SL ที่ขอบแนวชัด ๆ = เป้าให้โดนกวาด · วางใต้ทั้งโซน เผื่อ ATR</p></div>
        </div>

        {/* L5 R:R */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>Take Profit &amp; R:R — และความจริงเรื่อง &quot;1:2&quot;</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RR }} />
            <div className="figcap">R:R 1:2 = เสี่ยง 1 หน่วยเพื่อผลตอบแทน 2 หน่วย — ทำให้ชนะแค่ 40% ก็ยังกำไรได้</div>
          </div>
          <div className="body-txt">
            <p><b>Reward-to-Risk (R:R)</b> คือสัดส่วนกำไรเป้าต่อความเสี่ยง — 1:2 แปลว่าเสี่ยง 1R เพื่อผลตอบแทน 2R เชื่อมกับ expectancy ในหมวด 4.1: R:R สูงทำให้คุณ<b>ชนะน้อยครั้งก็ยังกำไร</b> (ระบบ B นั่นเอง)</p>
            <p><b>ข้อควรระวัง:</b> &quot;R:R ต้องเกิน 1:2 เสมอ&quot; ไม่ใช่กฎตายตัว — TP ต้องวางที่จุดที่<b>มีเหตุผลทางเทคนิครองรับ</b> (แนวต้านจริง, Fib extension) ไม่ใช่ยืดไปให้ครบ 1:2 ทั้งที่ไม่มีอะไรรองรับ R:R ที่ดีต้องมาคู่กับ TP ที่ราคามีโอกาสไปถึงจริง</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>คุมความเสี่ยงต่อไม้ได้แล้ว หมวดสุดท้าย <b><a href="/grade/leverage-reality">4.3 Leverage ในชีวิตจริง</a></b> จะดูภาพรวม: เลเวอเรจจริงที่คุณใช้, ความเสี่ยงรวมทั้งพอร์ต และการเขียนกฎ risk ของตัวเอง</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>R:R สูง = ชนะน้อยก็กำไร · แต่ TP ต้องมีเหตุผล ไม่ใช่ยืดให้ครบ 1:2</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · ตัวเลขเป็นตัวอย่าง ค่าจริงต่างกันตามโบรกและสเปกสัญญา — ตรวจสอบมูลค่าต่อลอตของโบรกคุณก่อนคำนวณจริง · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 4 หมวด 4.2
      </div>
    </>
  );
}
