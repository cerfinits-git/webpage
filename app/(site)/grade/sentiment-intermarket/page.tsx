import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 6 · Sentiment & Intermarket — COT, retail positioning, risk-on/off · Cerfinits Grade",
  description:
    "Premium: หลัก contrarian, อ่าน COT (commercials vs specs + ข้อจำกัด lag), retail positioning, ห่วงโซ่ yields→DXY→ทอง, risk-on/off และ case ทองมีนาคม 2020",
  alternates: { canonical: "/grade/sentiment-intermarket" },
};

const SVG_CROWD = `<svg viewBox="0 0 660 220" role="img" aria-label="ฝูงชนสุดขั้วตรงจุดกลับตัว">
  <polyline points="40,170 130,150 220,120 310,84 400,56 470,42 520,60 580,96 620,120" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <circle cx="470" cy="42" r="6" fill="var(--down)"/>
  <text class="t-xs t-down" x="470" y="28" text-anchor="middle">จุดสูงสุด</text>
  <rect class="chip-bad" x="360" y="120" width="220" height="58" rx="3"/>
  <text class="t-sm t-down" x="470" y="144" text-anchor="middle">ตรงนี้ 90% ของฝูงชน &quot;มั่นใจว่าขึ้นต่อ&quot;</text>
  <text class="t-xs" x="470" y="166" text-anchor="middle">ทุกคนที่อยากซื้อ ซื้อไปแล้ว — เหลือแต่คนจะขาย</text>
</svg>`;

const SVG_COT = `<svg viewBox="0 0 660 240" role="img" aria-label="COT commercials สวนราคาที่จุดสุดขั้ว">
  <text class="t-xs" x="46" y="22">ราคาทอง</text>
  <polyline points="40,80 130,64 220,46 310,38 400,52 490,74 600,92" fill="none" stroke="var(--gold)" stroke-width="2.5"/>
  <line x1="40" y1="118" x2="620" y2="118" stroke="var(--hair-2)" stroke-width="1"/>
  <text class="t-xs" x="46" y="140">Net position</text>
  <polyline points="40,180 130,190 220,205 310,212 400,200 490,182 600,168" fill="none" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs t-down" x="310" y="230" text-anchor="middle">Commercials (ผู้ผลิต/ผู้ใช้จริง) — short หนักสุดตรงยอดพอดี</text>
  <polyline points="40,160 130,152 220,144 310,140 400,150 490,162 600,172" fill="none" stroke="var(--up)" stroke-width="2"/>
  <text class="t-xs t-up" x="150" y="152" text-anchor="middle">Large specs — long หนักสุดตรงยอด</text>
</svg>`;

const SVG_RETAIL = `<svg viewBox="0 0 660 210" role="img" aria-label="retail เพิ่ม long สวนราคาที่กำลังลง">
  <text class="t-xs" x="46" y="22">ราคา (ขาลง)</text>
  <polyline points="40,50 130,66 220,90 310,110 400,134 490,152 600,172" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <text class="t-xs t-down" x="46" y="196">% รายย่อยที่ถือ long</text>
  <polyline points="40,160 130,150 220,136 310,120 400,104 490,92 600,80" fill="none" stroke="var(--down)" stroke-width="2" stroke-dasharray="6 3"/>
  <text class="t-sm t-down" x="440" y="60" text-anchor="middle">ยิ่งลง ยิ่งถัวเฉลี่ย ยิ่ง long เพิ่ม</text>
  <text class="t-xs" x="440" y="82" text-anchor="middle">= เชื้อเพลิงของขาลงต่อ (ต้องโดนบังคับขายก่อนถึงจะจบ)</text>
</svg>`;

const SVG_CHAIN = `<svg viewBox="0 0 660 170" role="img" aria-label="ห่วงโซ่ yields DXY ทอง">
  <rect class="chip-n" x="30" y="52" width="170" height="66" rx="3"/>
  <text class="t-md" x="115" y="80" text-anchor="middle">10Y Real Yield ↑</text>
  <text class="t-xs" x="115" y="102" text-anchor="middle">พันธบัตรน่าถือขึ้น</text>
  <path d="M205,85 L240,85 M231,78 L243,85 L231,92" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="248" y="52" width="160" height="66" rx="3"/>
  <text class="t-md" x="328" y="80" text-anchor="middle">DXY ↑</text>
  <text class="t-xs" x="328" y="102" text-anchor="middle">เงินไหลเข้า USD</text>
  <path d="M413,85 L448,85 M439,78 L451,85 L439,92" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-bad" x="456" y="52" width="174" height="66" rx="3"/>
  <text class="t-md t-down" x="543" y="80" text-anchor="middle">ทอง ↓</text>
  <text class="t-xs" x="543" y="102" text-anchor="middle">โดนกดสองแรงพร้อมกัน</text>
  <text class="t-xs" x="330" y="150" text-anchor="middle">ห่วงโซ่เชิงสถิติ — แน่นในภาวะปกติ แต่ &quot;ขาด&quot; ได้ในภาวะตื่นตระหนก (ดูบทถัดไป)</text>
</svg>`;

const SVG_RISKONOFF = `<svg viewBox="0 0 660 230" role="img" aria-label="risk on กับ risk off">
  <rect class="chip-ok" x="40" y="30" width="280" height="170" rx="3"/>
  <text class="t-md t-up" x="180" y="60" text-anchor="middle">RISK-ON (โลกกล้าเสี่ยง)</text>
  <text class="t-sm" x="70" y="94" text-anchor="start">หุ้นขึ้น · yields ขึ้น</text>
  <text class="t-sm" x="70" y="122" text-anchor="start">JPY/CHF อ่อน (คนทิ้ง safe haven)</text>
  <text class="t-sm" x="70" y="150" text-anchor="start">AUD/NZD แข็ง (สาย commodity)</text>
  <text class="t-sm t-gold" x="70" y="178" text-anchor="start">ทอง: มักโดนเมิน/ย่อ</text>
  <rect class="chip-bad" x="340" y="30" width="280" height="170" rx="3"/>
  <text class="t-md t-down" x="480" y="60" text-anchor="middle">RISK-OFF (โลกกลัว)</text>
  <text class="t-sm" x="370" y="94" text-anchor="start">หุ้นลง · yields ลง</text>
  <text class="t-sm" x="370" y="122" text-anchor="start">JPY/CHF แข็ง (วิ่งเข้า haven)</text>
  <text class="t-sm" x="370" y="150" text-anchor="start">AUD/NZD อ่อน</text>
  <text class="t-sm t-gold" x="370" y="178" text-anchor="start">ทอง: มักได้แรงซื้อ haven</text>
</svg>`;

const SVG_WEEKLY = `<svg viewBox="0 0 660 190" role="img" aria-label="weekly sentiment routine">
  <rect class="chip-n" x="30" y="40" width="180" height="100" rx="3"/>
  <text class="t-sm" x="120" y="70" text-anchor="middle">ศุกร์เย็น / เสาร์</text>
  <text class="t-xs" x="120" y="96" text-anchor="middle">อ่าน COT ใหม่</text>
  <text class="t-xs" x="120" y="116" text-anchor="middle">positioning สุดขั้วไหม?</text>
  <path d="M215,90 L245,90 M236,83 L248,90 L236,97" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="253" y="40" width="180" height="100" rx="3"/>
  <text class="t-sm" x="343" y="70" text-anchor="middle">อาทิตย์ / จันทร์เช้า</text>
  <text class="t-xs" x="343" y="96" text-anchor="middle">ปฏิทินข่าวแดงทั้งสัปดาห์</text>
  <text class="t-xs" x="343" y="116" text-anchor="middle">+ ทิศ yields / DXY</text>
  <path d="M438,90 L468,90 M459,83 L471,90 L459,97" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-gold" x="476" y="40" width="154" height="100" rx="3" stroke-width="2"/>
  <text class="t-sm t-gold" x="553" y="70" text-anchor="middle">ทุกวัน</text>
  <text class="t-xs" x="553" y="96" text-anchor="middle">routine 15 นาที</text>
  <text class="t-xs" x="553" y="116" text-anchor="middle">ของระดับ 5.3</text>
  <text class="t-xs" x="330" y="170" text-anchor="middle">Macro/sentiment ทำหน้าที่ &quot;ถ่วงน้ำหนัก bias&quot; — ไม่เคยแทน trigger ทางเทคนิค</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 6 · หมวด 6.2 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Sentiment &amp; Intermarket</span>
        <h1>ฝูงชนกำลังทำอะไร — และตลาดอื่นกระซิบอะไรเรื่องทอง</h1>
        <p className="lead">
          เลนส์สุดท้ายของการวิเคราะห์: <b>ตำแหน่งของผู้เล่น</b> (ใครถืออะไร หนักแค่ไหน) และ<b>สัญญาณข้ามตลาด</b>
          (yields, DXY, หุ้น) — เพราะบางครั้งคำตอบว่าทองจะไปไหน ไม่ได้อยู่ในกราฟทอง
          แต่อยู่ในกระเป๋าของคนที่ถือมันอยู่
        </p>
      </div>

      <div className="wrap">
        {/* L1 contrarian */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>หลัก Contrarian: ทำไมฝูงชน &quot;ผิดตรงจุดกลับตัว&quot; เสมอ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CROWD }} />
            <div className="figcap">ที่จุดสูงสุด ทุกคนที่อยากซื้อได้ซื้อไปแล้ว — ไม่เหลือแรงซื้อใหม่ = เหลือทางลงทางเดียว</div>
          </div>
          <div className="body-txt">
            <p>หลัก contrarian ไม่ใช่เรื่องลึกลับ มันคือ<b>กลไกล้วน ๆ</b>: ราคาขึ้นได้เพราะมีแรงซื้อใหม่เข้ามาเรื่อย ๆ — เมื่อไหร่ที่ &quot;ทุกคนมั่นใจและถือ long กันหมดแล้ว&quot; นั่นแปลว่า<b>แรงซื้อใหม่หมดลง</b> คนที่จะซื้อได้ซื้อไปแล้ว เหลือแต่คนพร้อมขาย — ตลาดจึงกลับตัวตรงจุดที่ความมั่นใจสูงสุดพอดี ไม่ใช่เพราะตลาดใจร้าย แต่เพราะเชื้อเพลิงหมด</p>
            <p><b>ข้อควรระวังที่สำคัญมาก:</b> sentiment เป็นเครื่องมือ<b>วัดจุดสุดขั้ว ไม่ใช่จับเวลา</b> — ฝูงชน &quot;มั่นใจเกิน&quot; ได้นานหลายเดือนก่อนตลาดกลับจริง การ short ทันทีที่เห็นตลาด bullish สุดขั้ว คือการเทรดสวนแนวโน้มที่ยังแข็งแรง ซึ่งมีความเสี่ยงสูงมาก กฎคือ: sentiment สุดขั้ว = <b>ยกระดับความระวัง + รอสัญญาณโครงสร้าง (BOS จาก 5.1) ยืนยัน</b> — ไม่ใช่สัญญาณเข้าเอง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ฝูงชนผิดตรงจุดกลับตัวเพราะ &quot;แรงซื้อใหม่หมด&quot; — แต่ sentiment บอกจุดสุดขั้ว ไม่บอกเวลา</p></div>
        </div>

        {/* L2 COT */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>★ COT Report — ข้อมูลสถานะผู้เล่นรายใหญ่รายสัปดาห์</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_COT }} />
            <div className="figcap">Commercials (เฮดจ์ของจริง) มัก short หนักสุดที่ยอด · Large specs (กองทุนเก็งกำไร) มัก long หนักสุดที่ยอด</div>
          </div>
          <div className="body-txt">
            <p><b>COT (Commitments of Traders)</b> คือรายงานที่ CFTC บังคับเปิดเผยทุกสัปดาห์ ว่าใครถือ futures อะไรหนักแค่ไหน — กลุ่มที่เราสนใจ: <b>Commercials</b> (ผู้ผลิต/ผู้ใช้จริง เช่น เหมืองทอง — พวกเขาเฮดจ์ จึงมักขายเข้าเมื่อราคาปรับขึ้นแรง และถูกมองเป็น smart money ที่จุดสุดขั้ว) กับ <b>Large Speculators</b> (กองทุนเก็งกำไร — เทรดตามเทรนด์ จึงมักถือหนักสุดตรงจุดสูงสุด/ต่ำสุดพอดี)</p>
            <p>วิธีใช้ที่ถูก: ไม่ใช่ดูว่าใคร long/short — แต่ดูว่า positioning <b>&quot;สุดขั้วเทียบประวัติตัวเอง&quot;</b> หรือยัง (เช่น specs ถือ long ทองหนักสุดในรอบ 3 ปี) จุดสุดขั้วแบบนั้นแปลว่าเชื้อเพลิงฝั่งนั้นใกล้หมด — เหมือนบทที่ 1 แต่มีตัวเลขจริงรองรับ</p>
            <p><b>ข้อจำกัดที่ต้องรู้ (evidence-first):</b> (1) ข้อมูล COT คือสถานะ ณ วันอังคาร แต่ประกาศเย็นวันศุกร์ — <b>lag 3 วัน</b> ใช้จับ swing รายสัปดาห์ได้ ใช้จับ intraday ไม่ได้เลย (2) มันคือ futures ไม่ใช่ spot ทั้งหมดของตลาด (3) &quot;สุดขั้ว&quot; อยู่ได้นาน — เหมือน sentiment ทุกตัว มันคือบริบท ไม่ใช่ trigger · เราเคยเขียนพื้นฐาน COT ทองไว้ใน <a href="/blog/cot-gold-basics">blog</a> — หมวดนี้คือเวอร์ชันปฏิบัติ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>COT ดู &quot;สุดขั้วเทียบประวัติ&quot; ไม่ใช่ดูฝั่ง · lag 3 วัน = เครื่องมือรายสัปดาห์ ไม่ใช่ intraday</p></div>
        </div>

        {/* L3 retail */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>Retail Positioning — ฝูงชนตัวจริงในบัญชีโบรก</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RETAIL }} />
            <div className="figcap">แพทเทิร์นคลาสสิก: ราคายิ่งลง รายย่อยยิ่งถัวเฉลี่ย long เพิ่ม — จนกว่าจะโดนบังคับขาย ขาลงถึงจบ</div>
          </div>
          <div className="body-txt">
            <p>โบรกและแพลตฟอร์มหลายเจ้าเปิดเผยสัดส่วน long/short ของลูกค้ารายย่อยแบบเรียลไทม์ — และแพทเทิร์นที่เห็นซ้ำจนเป็นตำนานคือ: <b>รายย่อยชอบสวนเทรนด์</b> ราคายิ่งลงยิ่งซื้อถัว (&quot;มันถูกแล้ว&quot;) ราคายิ่งขึ้นยิ่ง short (&quot;มันแพงไป&quot;) ผลคือฝั่งรายย่อยมักถือหนักสวนทิศทางที่ตลาดกำลังไป</p>
            <p>วิธีใช้แบบมีวุฒิภาวะ (ไม่ใช่ล้อเลียนรายย่อย — เราก็คือรายย่อย): ใช้เป็น<b>เครื่องเตือนตัวเอง</b> — ถ้าคุณกำลังจะเปิดไม้แล้วพบว่า 85% ของรายย่อยถือฝั่งเดียวกับคุณ ให้หยุดถามตัวเองว่า &quot;ผมเห็นอะไรที่ต่างจากฝูงชน หรือผมแค่รู้สึกเหมือนฝูงชน?&quot; ถ้าตอบไม่ได้ด้วยโครงสร้าง/โซน/trigger ที่ชัด นั่นอาจเป็นไม้อารมณ์</p>
            <p>จำสถิติจากระดับ 1 ได้ไหม — รายย่อย 74–89% ขาดทุน การอยู่ฝั่งเดียวกับเสียงส่วนใหญ่ของกลุ่มที่ขาดทุนอย่างเป็นระบบ ไม่ใช่ข้อได้เปรียบแต่อย่างใด</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>รายย่อยหนักฝั่งไหน = คำถามให้ตัวเอง &quot;ผมเห็นต่างจากฝูงชนด้วยเหตุผลอะไร&quot; — ตอบไม่ได้ อย่าเข้า</p></div>
        </div>

        {/* L4 intermarket chain */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>ห่วงโซ่ Intermarket: Yields → DXY → ทอง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CHAIN }} />
            <div className="figcap">ทองโดนขับด้วยสองแรงต้นน้ำ — เช็คต้นน้ำก่อนอ่านปลายน้ำทุกครั้ง</div>
          </div>
          <div className="body-txt">
            <p>ต่อยอด 6.1 ให้เป็นระบบ: ทองคือ<b>ปลายน้ำ</b>ของห่วงโซ่ — ต้นน้ำคือ real yields (นโยบาย Fed + เงินเฟ้อคาดการณ์) ไหลผ่าน DXY มากดหรือหนุนทอง การดูเฉพาะกราฟทองโดยไม่ตรวจสอบปัจจัยต้นทาง คือการมองข้ามแรงขับหลักของราคา</p>
            <p>สัญญาณ divergence ข้ามตลาดที่มีค่า: <b>เมื่อปลายน้ำไม่ยอมไปตามต้นน้ำ</b> — เช่น real yields พุ่งแรงแต่ทอง &quot;ไม่ลง&quot; แถมยืนแข็ง นั่นบ่งบอกแรงซื้อเชิงโครงสร้างมหาศาลที่กำลังกลืนแรงกดทั้งหมด (เช่นธนาคารกลางสะสมทอง) — ทองที่ไม่ลงทั้งที่ &quot;ควรลง&quot; คือทองที่แข็งแกร่งผิดปกติ และมักตามด้วยขาขึ้นแรงเมื่อแรงกดหมด</p>
            <p>สรุปเป็นเช็ค 3 ช่องก่อนเทรดทองทุกวัน (ต่อจาก routine 5.3): <b>yields ไปไหน · DXY ไปไหน · ทองตอบสนอง &quot;สมเหตุผล&quot; กับสองตัวนั้นไหม</b> — ช่องที่สามคือช่องที่บอกอะไรมากที่สุด</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เช็คต้นน้ำ (yields, DXY) ก่อนปลายน้ำ (ทอง) — และทองที่ &quot;ไม่ลงทั้งที่ควรลง&quot; คือสัญญาณแข็งแกร่งที่สุด</p></div>
        </div>

        {/* L5 risk on/off */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>★ Risk-On / Risk-Off — และวันที่ Safe Haven &quot;พัง&quot;</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RISKONOFF }} />
            <div className="figcap">โหมดอารมณ์ของโลกการเงิน — เช็คว่าวันนี้โลกอยู่โหมดไหนก่อนตีความสัญญาณใด ๆ</div>
          </div>
          <div className="body-txt">
            <p>ตลาดโลกสลับระหว่างสองโหมด: <b>Risk-On</b> (กล้าเสี่ยง — หุ้นขึ้น เงินไหลออกจาก haven) กับ <b>Risk-Off</b> (กลัว — หุ้นลง เงินวิ่งเข้า JPY/CHF/ทอง/พันธบัตร) การรู้ว่าวันนี้โลกอยู่โหมดไหนช่วยตีความทุกอย่างถูกขึ้น — ทองย่อในวัน risk-on จัด ๆ ไม่ใช่สัญญาณอ่อนแอ มันแค่โดนเมินชั่วคราว</p>
            <p><b>และนี่คือบทเรียน evidence-first ที่แพงที่สุดของหมวดนี้ — มีนาคม 2020:</b> ตลาดหุ้นถล่มจากโควิด ตาม &quot;ตำรา&quot; ทอง (safe haven) ต้องพุ่ง... ความจริงคือ<b>ทองร่วงแรงราว 12% ภายในสองสัปดาห์ พร้อมหุ้น</b> — เพราะในภาวะตื่นตระหนกสุดขีด กองทุนโดน margin call ต้อง<b>ขายทุกอย่างที่ขายได้</b>เพื่อหาเงินสด รวมถึงทอง (ขายสินทรัพย์ที่ยังมีสภาพคล่องเพื่อชดเชยส่วนที่เสียหาย) ทองค่อยกลับมาพุ่งทำจุดสูงใหม่หลังจากนั้นไม่กี่เดือนเมื่อ Fed อัดสภาพคล่อง</p>
            <p>บทเรียน: <b>ทุกความสัมพันธ์ intermarket ขาดได้ในภาวะ liquidity crisis</b> — &quot;ตำรา&quot; ใช้ได้ 95% ของเวลา แต่ 5% ที่เหลือคือตอนที่ขนาดไม้และ SL ของคุณ (ระดับ 4) คือสิ่งเดียวที่ปกป้องคุณจริง ไม่ใช่ความรู้ macro</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>รู้โหมดโลกก่อนตีความ · และจำมีนา 2020: ตอนตลาดตื่นตระหนกสุดขีด ทุกความสัมพันธ์ขาดได้ — risk management เท่านั้นที่อยู่</p></div>
        </div>

        {/* L6 weekly routine */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>Playbook: ประกอบ Macro + Sentiment เข้ากับระบบเทรด</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_WEEKLY }} />
            <div className="figcap">จังหวะของแต่ละเครื่องมือ: COT รายสัปดาห์ · ปฏิทิน+ทิศต้นน้ำ รายสัปดาห์/วัน · เทคนิค ทุกวัน</div>
          </div>
          <div className="body-txt">
            <p>กฎการประกอบที่สำคัญที่สุด: <b>macro/sentiment ปรับ &quot;น้ำหนัก&quot; — เทคนิคให้ &quot;จังหวะ&quot;</b> ห้ามสลับหน้าที่กันเด็ดขาด (เข้าไม้เพราะ &quot;COT สุดขั้ว&quot; โดยไม่มี trigger = เดา) วิธีใช้จริงคือระบบถ่วงน้ำหนักง่าย ๆ:</p>
            <div className="calc c3">
              <div className="crow head"><span>สภาพ</span><span>ตัวอย่าง</span><span className="v">การกระทำ</span></div>
              <div className="crow"><span className="k">ทุกเลนส์ชี้ทางเดียว</span><span>โครงสร้างขึ้น + yields ลง + COT ไม่สุดขั้ว</span><span className="v pos">เทรดตามระบบ ขนาดไม้ปกติ</span></div>
              <div className="crow"><span className="k">เลนส์ขัดกันบ้าง</span><span>เทคนิคขึ้น แต่ yields พุ่งสวน</span><span className="v warn">เทรดได้ แต่ลดขนาดไม้ / เป้าสั้นลง</span></div>
              <div className="crow"><span className="k">ขัดกันแรง / sentiment สุดขั้ว</span><span>ทุกคน long + specs สูงสุดรอบ 3 ปี</span><span className="v">งดเพิ่มไม้ฝั่งฝูงชน · เฝ้าหา BOS</span></div>
              <div className="crow stop"><span className="k">สัปดาห์ FOMC / วิกฤต</span><span>ปฏิทินแดงแน่น ตลาดตื่นตระหนก</span><span className="v neg">โหมดเอาตัวรอด: ไม้เล็ก หรือพัก</span></div>
            </div>
            <p>สังเกตว่า<b>ไม่มีแถวไหนบอกให้ &quot;เข้าเพราะ macro&quot;</b> — จุดเข้ายังมาจากโซน + trigger ของระดับ 5 เสมอ macro แค่หมุนปุ่มความเสี่ยงขึ้นลง นี่คือความต่างระหว่างเทรดเดอร์ที่ใช้ข้อมูลทุกชั้น กับคนที่อ่านข่าวแล้วเดา</p>
          </div>
          <div className="bridge">
            <span className="bi">✓</span>
            <div>
              <span className="bl">จบระดับ 6</span>
              <p>คุณมีครบทุกเลนส์แล้ว: เทคนิค โครงสร้าง macro sentiment — ระดับถัดไปคือหัวใจที่สุดของหลักสูตรนี้: <b>ระดับ 7 สร้างระบบของตัวเอง</b> (กำลังจัดทำ) — แปลงทั้งหมดเป็นระบบที่ทดสอบได้ วัดผลได้ และรู้ว่าเมื่อใดควรยุติ กลับไปดู <b><a href="/grade">แผนที่หลักสูตร</a></b></p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Macro/sentiment = ปุ่มหมุนขนาดไม้ · เทคนิค = จังหวะเข้า — ห้ามสลับหน้าที่กัน</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · เหตุการณ์ในอดีต (เช่น มี.ค. 2020) เป็นกรณีศึกษา ไม่รับประกันว่าจะซ้ำ · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 6 หมวด 6.2 (Premium)
      </div>
    </>
  );
}
