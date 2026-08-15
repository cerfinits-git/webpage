import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 5 · Breakout & Fakeout — ทะลุจริง กับดัก และวิธีเทรดทั้งคู่ · Cerfinits Grade",
  description:
    "Premium: กายวิภาค breakout คุณภาพ, แท่ง conviction, break-and-retest พร้อม worked example ตัวเลขจริง, liquidity sweep, SFP และ decision tree",
  alternates: { canonical: "/grade/breakout-fakeout" },
};

const SVG_BUILDUP = `<svg viewBox="0 0 660 230" role="img" aria-label="breakout ที่มีการบีบตัวก่อน กับ spike ลอย ๆ">
  <text class="t-sm t-up" x="165" y="22" text-anchor="middle">มี &quot;บีบตัว&quot; ก่อนแนว ✓</text>
  <line x1="40" y1="70" x2="300" y2="70" stroke="var(--down)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <polyline points="40,180 90,110 130,150 170,96 205,126 235,86 260,102 285,74 300,66 315,40" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <text class="t-xs t-up" x="200" y="200" text-anchor="middle">ยอดยกสูงขึ้นเรื่อย ๆ ชนแนว = แรงสะสม</text>
  <line x1="345" y1="26" x2="345" y2="204" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-down" x="500" y="22" text-anchor="middle">Spike ลอย ๆ จากที่ไกล ✕</text>
  <line x1="380" y1="70" x2="640" y2="70" stroke="var(--down)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <polyline points="380,190 440,170 500,185 545,60 585,120 625,150" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <text class="t-xs t-down" x="510" y="200" text-anchor="middle">พุ่งครั้งเดียวจากไกล ๆ = หมดแรงเร็ว</text>
</svg>`;

const SVG_CONVICTION = `<svg viewBox="0 0 660 230" role="img" aria-label="แท่งทะลุแบบ conviction กับ noise">
  <line x1="40" y1="120" x2="620" y2="120" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="6 3"/>
  <text class="t-xs t-gold" x="44" y="112">แนวต้าน</text>
  <text class="t-sm t-up" x="170" y="30" text-anchor="middle">Conviction ✓</text>
  <line x1="170" y1="150" x2="170" y2="52" stroke="var(--up)" stroke-width="2"/>
  <rect x="156" y="60" width="28" height="80" fill="var(--up-tint)" stroke="var(--up)" stroke-width="2"/>
  <text class="t-xs t-up" x="210" y="66" text-anchor="start">body ใหญ่ (&gt;1×ATR)</text>
  <text class="t-xs t-up" x="210" y="84" text-anchor="start">ปิด &quot;พ้นแนว&quot; ชัด</text>
  <text class="t-sm t-down" x="490" y="30" text-anchor="middle">Noise ✕</text>
  <line x1="490" y1="150" x2="490" y2="76" stroke="var(--down)" stroke-width="2"/>
  <rect x="476" y="126" width="28" height="18" fill="var(--down-tint)" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs t-down" x="530" y="90" text-anchor="start">แค่ไส้แหย่พ้น</text>
  <text class="t-xs t-down" x="530" y="108" text-anchor="start">ปิดกลับใต้แนว = ยังไม่ทะลุ</text>
</svg>`;

const SVG_RETEST = `<svg viewBox="0 0 660 250" role="img" aria-label="break and retest พร้อมจุดเข้า SL TP">
  <line x1="40" y1="150" x2="620" y2="150" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="6 3"/>
  <text class="t-xs t-gold" x="44" y="168">แนวต้าน 2650 → กลายเป็นแนวรับ</text>
  <polyline points="50,210 110,164 160,190 220,142 270,108 320,146 355,152 390,142" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <circle cx="355" cy="152" r="6" fill="var(--up)"/>
  <text class="t-xs t-up" x="355" y="184" text-anchor="middle">retest + แท่งกลับตัว</text>
  <circle cx="390" cy="142" r="5" fill="var(--gold)"/>
  <text class="t-xs t-gold" x="412" y="138" text-anchor="start">เข้า 2652</text>
  <line x1="390" y1="196" x2="620" y2="196" stroke="var(--down)" stroke-width="1.5"/>
  <text class="t-xs t-down" x="616" y="212" text-anchor="end">SL 2644 (ใต้โซน+เผื่อ ATR) = −1R</text>
  <polyline points="390,142 450,110 510,84 570,56" fill="none" stroke="var(--up)" stroke-width="2"/>
  <line x1="390" y1="46 " x2="620" y2="46" stroke="var(--up)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-up" x="616" y="38" text-anchor="end">TP 2676 (แนวถัดไป) = +3R</text>
</svg>`;

const SVG_SWEEP = `<svg viewBox="0 0 660 240" role="img" aria-label="liquidity sweep กวาด stop เหนือแนวแล้วกลับ">
  <line x1="40" y1="90" x2="620" y2="90" stroke="var(--down)" stroke-width="1.5" stroke-dasharray="6 3"/>
  <text class="t-xs t-down" x="44" y="82">แนวต้าน — เหนือแนวคือ buy stops ของคน short + คนรอ breakout</text>
  <polyline points="60,200 130,130 190,160 260,100 320,94" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="350" y1="150" x2="350" y2="52" stroke="var(--down)" stroke-width="2"/>
  <rect x="336" y="96" width="28" height="46" fill="var(--down-tint)" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs" x="382" y="58" text-anchor="start">ไส้แทงเหนือแนว &quot;เก็บ&quot; stops</text>
  <text class="t-xs t-down" x="382" y="76" text-anchor="start">แล้วปิดกลับใต้แนว = sweep</text>
  <polyline points="364,120 430,160 500,196 570,214" fill="none" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs t-down" x="500" y="234" text-anchor="middle">เชื้อเพลิงหมด → วิ่งสวนแรง</text>
</svg>`;

const SVG_SFP = `<svg viewBox="0 0 660 240" role="img" aria-label="swing failure pattern เงื่อนไขเข้า">
  <circle cx="200" cy="70" r="5" fill="var(--muted)"/>
  <text class="t-xs" x="200" y="56" text-anchor="middle">High เดิม 2668</text>
  <line x1="200" y1="70" x2="470" y2="70" stroke="var(--hair-2)" stroke-width="1.2" stroke-dasharray="5 3"/>
  <polyline points="60,190 130,110 200,70 250,120 310,96" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="350" y1="140" x2="350" y2="40" stroke="var(--down)" stroke-width="2"/>
  <rect x="336" y="92" width="28" height="40" fill="var(--down-tint)" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs t-down" x="384" y="46" text-anchor="start">① ไส้ทำ high ใหม่ 2671</text>
  <text class="t-xs t-down" x="384" y="64" text-anchor="start">② แต่ &quot;ปิด&quot; ต่ำกว่า high เดิม</text>
  <circle cx="392" cy="128" r="5" fill="var(--gold)"/>
  <text class="t-xs t-gold" x="412" y="126" text-anchor="start">③ เข้า short เมื่อหลุด low ของแท่ง sweep</text>
  <polyline points="364,118 420,150 480,186 540,206" fill="none" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs t-down" x="560" y="200" text-anchor="start">SL เหนือไส้</text>
</svg>`;

const SVG_TREE = `<svg viewBox="0 0 660 250" role="img" aria-label="decision tree breakout fakeout">
  <rect class="chip-n" x="230" y="16" width="200" height="44" rx="3"/>
  <text class="t-md" x="330" y="43" text-anchor="middle">ราคาถึงแนว/โซนสำคัญ</text>
  <path d="M280,60 L165,96" stroke="var(--up)" stroke-width="1.5"/>
  <path d="M330,60 L330,96" stroke="var(--hair-2)" stroke-width="1.5"/>
  <path d="M380,60 L495,96" stroke="var(--down)" stroke-width="1.5"/>
  <rect class="chip-ok" x="55" y="100" width="220" height="64" rx="3"/>
  <text class="t-sm t-up" x="165" y="124" text-anchor="middle">ปิดพ้นแนว body ใหญ่</text>
  <text class="t-xs" x="165" y="146" text-anchor="middle">→ รอ retest แล้วเทรดตามทะลุ</text>
  <rect class="chip-n" x="290" y="100" width="80" height="64" rx="3"/>
  <text class="t-sm" x="330" y="128" text-anchor="middle">ก้ำกึ่ง</text>
  <text class="t-xs" x="330" y="148" text-anchor="middle">ไม่เทรด</text>
  <rect class="chip-bad" x="385" y="100" width="220" height="64" rx="3"/>
  <text class="t-sm t-down" x="495" y="124" text-anchor="middle">ไส้แหย่พ้นแต่ปิดกลับใน</text>
  <text class="t-xs" x="495" y="146" text-anchor="middle">→ sweep: หาจังหวะเทรดสวน (SFP)</text>
  <text class="t-xs" x="330" y="204" text-anchor="middle">ทั้งสองฝั่งของ tree จบที่คำถามเดียวกัน: R:R ≥ 1:2 และเสี่ยง ≤1% ไหม — ไม่ผ่านก็ไม่เทรด</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 5 · หมวด 5.2 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Breakout &amp; Fakeout</span>
        <h1>ทะลุจริง กับดัก — และวิธีทำเงินจากทั้งสองอย่าง</h1>
        <p className="lead">
          จุดที่ราคาชนแนวสำคัญคือช่วงเวลาที่เงินเปลี่ยนมือมากที่สุด — และที่ที่มือใหม่โดนหลอกมากที่สุด
          หมวดนี้แจกแจงกายวิภาคของ breakout คุณภาพ, กลไกเบื้องหลัง fakeout (มันไม่ใช่ความซวย มันคือระบบ)
          และปิดด้วย <b>decision tree + worked example ตัวเลขจริง</b>ที่ผูกกับสูตรระดับ 4
        </p>
      </div>

      <div className="wrap">
        {/* L1 buildup */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>Breakout คุณภาพเริ่มก่อนการทะลุ: ดูที่ &quot;การบีบตัว&quot;</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_BUILDUP }} />
            <div className="figcap">การบีบตัวหน้าแนว (buildup) = แรงถูกอัดรอปล่อย · spike จากที่ไกลมักหมดแรงตรงแนวพอดี</div>
          </div>
          <div className="body-txt">
            <p>มือใหม่ตัดสิน breakout จาก &quot;แท่งที่ทะลุ&quot; — มือโปรตัดสินจาก<b>สิ่งที่เกิดก่อนทะลุ</b> สัญญาณคุณภาพอันดับหนึ่งคือ <b>buildup</b>: ราคาบีบตัวแคบลงชิดแนว ยอดต่ำยกสูงขึ้นเรื่อย ๆ (ฝั่งซื้อดันเข้าใกล้เพดานทีละนิดโดยไม่ถอย) — นั่นคือแรงที่ถูกอัดไว้ และแนวที่โดนทดสอบถี่ ๆ ระยะสั้นแบบนี้กำลัง &quot;บาง&quot; ลง</p>
            <p>ตรงข้ามกับ spike ที่พุ่งมาจากที่ไกล ๆ ครั้งเดียวชนแนว: แรงซื้อถูกใช้ไปหมดกับทางวิ่ง พอถึงแนวคือหมดพลังพอดี — สถิติส่วนตัวที่คุณควรไปเก็บเองใน journal (ระดับ 7): เทียบ win rate ของ breakout ที่มี buildup กับไม่มี แล้วคุณจะเลิกไล่ spike ตลอดกาล</p>
            <p>เช็คอีก 2 อย่างประกอบ: <b>บริบทเทรนด์</b> — breakout ตามทิศเทรนด์ใหญ่ (จาก 5.1) ชนะบ่อยกว่าสวนเทรนด์อย่างมีนัย และ<b>ความสด</b>ของแนว — แนวที่เพิ่งเกิดครั้งแรกทะลุยากกว่าแนวที่โดนตีจนบางแล้ว</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>อ่าน breakout จากสิ่งที่เกิด &quot;ก่อน&quot; ทะลุ — buildup ชิดแนว = ของจริงบ่อยกว่า spike ไกล ๆ</p></div>
        </div>

        {/* L2 conviction */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>แท่งทะลุ: Conviction vs Noise — เกณฑ์วัดจริง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CONVICTION }} />
            <div className="figcap">เกณฑ์ 3 ข้อ: ปิดพ้นแนว · body ≥ ราว 1×ATR · ไส้ฝั่งสวนสั้น — ขาดข้อใดข้อหนึ่ง = ยังไม่นับ</div>
          </div>
          <div className="body-txt">
            <p>เมื่อการทะลุเกิดขึ้น ใช้เกณฑ์วัดได้ 3 ข้อตัดสินว่าเป็น &quot;conviction&quot; (มีเจตนาจริง) หรือแค่ noise: (1) <b>ราคาปิดพ้นแนว</b> — ไม่ใช่ไส้ (กฎเดียวกับ BOS ใน 5.1) (2) <b>ขนาด body</b> — แท่งทะลุควรใหญ่เทียบ ATR ของ TF นั้น (raว ≥1×ATR) แท่งขนาดเล็กที่ขยับผ่านแนวเพียงเล็กน้อย ยังไม่ถือเป็นการยืนยันเจตนา (3) <b>ไส้ฝั่งตรงข้ามสั้น</b> — ปิดใกล้ปลายแท่ง แปลว่าไม่มีแรงต้านดันกลับระหว่างทาง</p>
            <p>ถ้าอยากได้หลักฐานเพิ่มอีกชั้น: ดู<b>แท่งถัดไป</b> — breakout จริงมักมี follow-through (แท่งต่อไปไปทางเดียวกัน) ส่วน fakeout มักโชว์ตัวทันทีด้วยแท่งกลืนกลับ การรอ 1 แท่งแลกกับการเข้าแพงขึ้นเล็กน้อย แต่กรองกับดักได้มาก — trade-off ที่มือใหม่ควรยอมจ่าย</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Conviction = ปิดพ้นแนว + body ≥1×ATR + ไส้สวนสั้น — ต่ำกว่านี้คือ noise</p></div>
        </div>

        {/* L3 retest worked example */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>★ Break-and-Retest: จุดเข้าหลัก + Worked Example</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RETEST }} />
            <div className="figcap">ทะลุ → ย้อนทดสอบแนวเดิม (ที่กลายเป็นแนวรับ) → เข้าเมื่อมีแท่งยืนยัน — จุดเข้าที่ให้ R:R ดีที่สุดของการเทรด breakout</div>
          </div>
          <div className="body-txt">
            <p>ทำไม retest คือจุดเข้าหลักของเรา ไม่ใช่การเข้าทันทีที่แท่งทะลุ: (1) SL สั้นกว่ามาก (วางใต้โซนที่เพิ่งยืนยัน ไม่ใช่ไล่ราคาที่วิ่งไปแล้ว) → R:R ดีกว่า (2) การย้อนกลับมา &quot;ยืน&quot; บนแนวเดิมคือการยืนยัน role reversal ว่าแนวเปลี่ยนมือจริง (3) จิตวิทยาดีกว่า — เข้าตอนราคาสงบ ไม่ใช่ตอน FOMO สูงสุด · ราคาที่ต้องจ่าย: บางครั้งราคาทะลุแล้ววิ่งเลยไม่กลับมา retest — <b>ยอมพลาดไม้นั้น</b> ตลาดมี setup ใหม่เสมอ แต่พอร์ตที่เสียไปกับ fakeout ไม่กลับมาเอง</p>
            <p><b>Worked example เต็มวงจร (ทอง, ตัวเลขสมมติเพื่อสอนวิธีคิด):</b> บัญชี $1,000 เสี่ยง 1% = $10 ต่อไม้</p>
            <div className="calc c2">
              <div className="crow head"><span>ขั้นตอน</span><span className="v">ค่า</span></div>
              <div className="crow"><span className="k">แนวต้าน (มี buildup ก่อนทะลุ)</span><span className="v">2650</span></div>
              <div className="crow"><span className="k">แท่งทะลุปิด 2658 (conviction ✓) → รอ retest</span><span className="v">รอ</span></div>
              <div className="crow"><span className="k">ราคาย้อนแตะ 2650–2652 + แท่งกลับตัว → เข้า</span><span className="v">2652</span></div>
              <div className="crow"><span className="k">SL ใต้โซน + เผื่อ ATR (จาก 4.2)</span><span className="v neg">2644 · ระยะ $8</span></div>
              <div className="crow"><span className="k">ขนาดไม้ = 10 ÷ (8 × 100) = 0.0125 → ปัดลง</span><span className="v">0.01 lot</span></div>
              <div className="crow hl"><span className="k">TP แนวถัดไป 2676 · ระยะ $24</span><span className="v pos">R:R = 1:3</span></div>
            </div>
            <p>สังเกตกฎเล็กแต่สำคัญ: ขนาดไม้<b>ปัดลงเสมอ</b> (0.0125 → 0.01) — ปัดขึ้นคือแอบเสี่ยงเกินแผน และ TP อยู่ที่<b>แนวถัดไปที่มีเหตุผล</b> ไม่ใช่ยืดให้สวย</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Retest = SL สั้น + ยืนยัน role reversal · พลาดไม้ที่ไม่กลับมา ดีกว่าติดกับ fakeout</p></div>
        </div>

        {/* L4 sweep anatomy */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>★ กายวิภาค Fakeout: มันไม่ใช่ความซวย มันคือกลไก</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SWEEP }} />
            <div className="figcap">เหนือแนวต้านคือ &quot;กอง order&quot; (stop ของคน short + buy stop ของคนรอทะลุ) — สภาพคล่องที่เงินใหญ่ต้องการ</div>
          </div>
          <div className="body-txt">
            <p>ทำไม fakeout ถึงเกิดซ้ำ ๆ ตรงแนวชัด ๆ? เพราะ<b>เหนือแนวต้านทุกแนวมี order กองอยู่จริง</b>: stop loss ของคน short + buy stop ของคนรอเทรด breakout เมื่อราคาแทงพ้นแนว order ทั้งก้อนถูก trigger เป็นแรงซื้อมหาศาลชั่ววูบ — และนั่นคือ<b>สภาพคล่องจำนวนมากที่เปิดให้ผู้เล่นรายใหญ่เข้าขาย</b> โดยราคาไม่ขยับหนี</p>
            <p>ผลคือแพทเทิร์นที่พบได้บ่อยอย่างมีนัย: ไส้แทงพ้นแนว → เก็บ order เกลี้ยง → ปิดกลับเข้าใน → วิ่งสวนแรง เพราะฝั่งที่เพิ่งโดนเก็บ (คนเข้า breakout) กลายเป็นเชื้อเพลิงขับราคาสวน — ภาษา ICT เรียก <b>liquidity sweep / stop hunt</b> (ต่อยอดจาก blog ICT ของเราได้)</p>
            <p>ความหมายเชิงปฏิบัติ 2 ข้อ: (1) นี่คือเหตุผลของกฎ &quot;ปิดพ้นแนวเท่านั้นถึงนับ&quot; ใน 5.1/บทที่ 2 (2) sweep ไม่ใช่แค่กับดักให้หลบ — มันคือ <b>setup ในตัวเอง</b> เพราะหลัง sweep ทิศทางมักชัดเจนขึ้นกว่าปกติ (บทถัดไป)</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Fakeout = การเก็บสภาพคล่องอย่างเป็นระบบ — เข้าใจกลไกแล้ว มันเปลี่ยนจากกับดักเป็นโอกาส</p></div>
        </div>

        {/* L5 SFP */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>เทรด Fakeout: Swing Failure Pattern (SFP)</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SFP }} />
            <div className="figcap">เงื่อนไข 3 ข้อ: ไส้ทำ high ใหม่ · ปิดกลับต่ำกว่า high เดิม · เข้าเมื่อหลุด low แท่ง sweep</div>
          </div>
          <div className="body-txt">
            <p>Setup มาตรฐานสำหรับเทรดสวน sweep คือ <b>SFP (Swing Failure Pattern)</b> — เงื่อนไขต้องครบ 3 ข้อ ห้ามหย่อน: (1) ไส้แทง<b>ทำ high ใหม่</b>เหนือ swing high เดิม (กวาด stop สำเร็จ) (2) แท่งนั้น<b>ปิดกลับต่ำกว่า high เดิม</b> (ผู้ซื้อรับของไม่อยู่จริง) (3) เข้า short เมื่อราคา<b>หลุด low ของแท่ง sweep</b> — ไม่ใช่เดาเข้าเลยทันทีที่เห็นไส้</p>
            <p>การจัดการไม้: SL เหนือปลายไส้ sweep (จุดที่ถ้าราคากลับขึ้นไปได้ แปลว่าไม่ใช่ sweep แต่คือ breakout จริง — เราคิดผิด ออก) · TP แรกที่ mid-range หรือแนวรับฝั่งตรงข้าม · ข้อดีของ SFP คือ SL สั้นมากโดยธรรมชาติ (แค่ปลายไส้) ทำให้ R:R มักสวย</p>
            <p><b>คำเตือนที่ต้องพูด:</b> SFP เป็น setup สวนโมเมนตัมระยะสั้น — ความน่าจะเป็นดีที่สุดเมื่อเทรด<b>สวน sweep แต่ตามเทรนด์ใหญ่</b> (เช่น sweep ขึ้นในขาลง → short ตามเทรนด์) การใช้ SFP สู้เทรนด์ใหญ่คือการเอา setup ดีไปเทรดในบริบทแย่</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>SFP: ไส้ทำ high ใหม่ + ปิดต่ำกว่า high เดิม + เข้าเมื่อหลุด low แท่ง — SL สั้นตามธรรมชาติ</p></div>
        </div>

        {/* L6 decision tree */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>★ Playbook: Decision Tree ที่แนวสำคัญ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_TREE }} />
            <div className="figcap">เหตุการณ์ที่แนวมี 3 ทาง — แต่ละทางมีแผนล่วงหน้า ไม่มีการตัดสินใจสดหน้างาน</div>
          </div>
          <div className="body-txt">
            <p>รวมทั้งหมวดเป็นแผนเดียว — เมื่อราคาเข้าใกล้แนว/โซนสำคัญ (ที่ mark ไว้จาก 5.1) คุณมีคำตอบล่วงหน้าครบทุกทาง:</p>
            <div className="calc c3">
              <div className="crow head"><span>สิ่งที่เห็น</span><span>อ่านว่า</span><span className="v">แผน</span></div>
              <div className="crow"><span className="k">Buildup + ปิดพ้นแนว body ใหญ่</span><span>Breakout จริง</span><span className="v pos">รอ retest → เข้า</span></div>
              <div className="crow"><span className="k">ไส้แหย่พ้น + ปิดกลับใน</span><span>Sweep</span><span className="v warn">รอ SFP ครบเงื่อนไข → สวน</span></div>
              <div className="crow"><span className="k">แท่งเล็กเคลื่อนผ่าน / ก้ำกึ่ง</span><span>ไม่ชัด</span><span className="v">ไม่เทรด — รอความชัดเจน</span></div>
              <div className="crow stop"><span className="k">ทุกทาง: R:R &lt; 1:2 หรือเสี่ยง &gt; 1%</span><span>ไม่ผ่านเกณฑ์</span><span className="v neg">ไม่เทรด เสมอ</span></div>
            </div>
            <p>บรรทัดสุดท้ายของตารางคือหัวใจ: <b>setup ที่ดีที่สุดก็ยังต้องผ่านด่านความเสี่ยงของระดับ 4</b> — decision tree ไม่ได้มีไว้หา &quot;เหตุผลให้ได้เทรด&quot; แต่มีไว้ให้คุณทำสิ่งเดียวกันทุกครั้งจนวัดผลได้</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>เครื่องมือครบมือแล้ว — หมวดสุดท้ายของระดับ 5 <b><a href="/grade/multi-timeframe">5.3 Multiple Time Frame</a></b> จะประกอบทุกอย่างเป็นระบบเดียว: ทิศจาก TF ใหญ่ โซนจาก TF กลาง จังหวะจาก TF เล็ก พร้อม routine ที่ทำตามได้ทุกวัน</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>มีแผนล่วงหน้าครบ 3 ทาง (ทะลุ/sweep/ไม่ชัด) — และทุกทางต้องผ่านด่าน R:R + 1% ก่อนเสมอ</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · ตัวเลขเป็นตัวอย่างสมมติเพื่อสอนวิธีคิด ตรวจสเปกสัญญากับโบรกของคุณก่อนคำนวณจริง · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 5 หมวด 5.2 (Premium)
      </div>
    </>
  );
}
