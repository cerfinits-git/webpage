import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 2 · กราฟและแท่งเทียน — อ่านแท่งเทียนให้ออก · Cerfinits Grade",
  description:
    "กราฟ 3 แบบ, กายวิภาคแท่งเทียน, timeframe, แท่งเดี่ยว/คู่/สาม และกับดักการท่องจำแพทเทิร์นโดยไม่ดูบริบท — เล่าเป็นภาพ",
  alternates: { canonical: "/grade/charts-candles" },
};

const SVG_CHARTTYPES = `<svg viewBox="0 0 660 170" role="img" aria-label="กราฟ 3 แบบ line bar candlestick">
  <rect class="chip-n" x="30" y="26" width="185" height="120" rx="3"/>
  <text class="t-md" x="122" y="120" text-anchor="middle">Line</text>
  <polyline points="55,90 85,70 115,82 145,55 175,66 190,48" fill="none" stroke="var(--muted)" stroke-width="2"/>
  <rect class="chip-n" x="237" y="26" width="185" height="120" rx="3"/>
  <text class="t-md" x="329" y="120" text-anchor="middle">Bar (OHLC)</text>
  <line x1="300" y1="46" x2="300" y2="96" stroke="var(--muted)" stroke-width="2"/><line x1="290" y1="56" x2="300" y2="56" stroke="var(--muted)" stroke-width="2"/><line x1="300" y1="86" x2="312" y2="86" stroke="var(--muted)" stroke-width="2"/>
  <line x1="350" y1="52" x2="350" y2="100" stroke="var(--muted)" stroke-width="2"/><line x1="340" y1="66" x2="350" y2="66" stroke="var(--muted)" stroke-width="2"/><line x1="350" y1="92" x2="362" y2="92" stroke="var(--muted)" stroke-width="2"/>
  <rect class="chip-gold" x="444" y="26" width="185" height="120" rx="3" stroke-width="2.5"/>
  <text class="t-md t-gold" x="536" y="120" text-anchor="middle">Candlestick</text>
  <line x1="510" y1="42" x2="510" y2="98" stroke="var(--up)" stroke-width="1.5"/><rect x="500" y="56" width="20" height="30" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="558" y1="46" x2="558" y2="102" stroke="var(--down)" stroke-width="1.5"/><rect x="548" y="60" width="20" height="30" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.5"/>
  <text class="t-xs t-gold" x="536" y="137" text-anchor="middle">← ที่เราใช้</text>
</svg>`;

const SVG_ANATOMY = `<svg viewBox="0 0 660 250" role="img" aria-label="กายวิภาคแท่งเทียน">
  <line x1="215" y1="34" x2="215" y2="78" stroke="var(--up)" stroke-width="2"/>
  <rect x="192" y="78" width="46" height="86" fill="var(--up-tint)" stroke="var(--up)" stroke-width="2"/>
  <line x1="215" y1="164" x2="215" y2="206" stroke="var(--up)" stroke-width="2"/>
  <text class="t-xs" x="248" y="52">ไส้บน = จุดสูงสุด</text>
  <text class="t-xs t-up" x="248" y="92">ปิด (close)</text>
  <text class="t-xs" x="248" y="128">ตัวเทียน (body)</text>
  <text class="t-xs t-up" x="248" y="158">เปิด (open)</text>
  <text class="t-xs" x="248" y="192">ไส้ล่าง = จุดต่ำสุด</text>
  <text class="t-md t-up" x="215" y="230" text-anchor="middle">แท่งขึ้น</text>
  <line x1="470" y1="34" x2="470" y2="78" stroke="var(--down)" stroke-width="2"/>
  <rect x="447" y="78" width="46" height="86" fill="var(--down-tint)" stroke="var(--down)" stroke-width="2"/>
  <line x1="470" y1="164" x2="470" y2="206" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs t-down" x="503" y="92">เปิด (open)</text>
  <text class="t-xs t-down" x="503" y="158">ปิด (close)</text>
  <text class="t-md t-down" x="470" y="230" text-anchor="middle">แท่งลง</text>
</svg>`;

const SVG_TIMEFRAME = `<svg viewBox="0 0 660 200" role="img" aria-label="timeframe แท่ง D1 เท่ากับ H4 หลายแท่ง">
  <text class="t-sm" x="130" y="26" text-anchor="middle">D1 · หนึ่งแท่ง</text>
  <line x1="130" y1="44" x2="130" y2="150" stroke="var(--up)" stroke-width="2"/>
  <rect x="108" y="66" width="44" height="70" fill="var(--up-tint)" stroke="var(--up)" stroke-width="2"/>
  <path d="M215,100 L275,100 M263,92 L277,100 L263,108" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <text class="t-sm t-gold" x="245" y="88" text-anchor="middle">ซูมเข้า</text>
  <text class="t-sm" x="470" y="26" text-anchor="middle">H4 · หลายแท่งรวมกัน</text>
  <line x1="360" y1="60" x2="360" y2="120" stroke="var(--up)" stroke-width="1.5"/><rect x="350" y="78" width="20" height="30" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="410" y1="70" x2="410" y2="130" stroke="var(--down)" stroke-width="1.5"/><rect x="400" y="90" width="20" height="26" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.5"/>
  <line x1="460" y1="56" x2="460" y2="118" stroke="var(--up)" stroke-width="1.5"/><rect x="450" y="72" width="20" height="34" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="510" y1="48" x2="510" y2="110" stroke="var(--up)" stroke-width="1.5"/><rect x="500" y="62" width="20" height="34" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="560" y1="44" x2="560" y2="104" stroke="var(--up)" stroke-width="1.5"/><rect x="550" y="58" width="20" height="30" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <text class="t-xs" x="470" y="164" text-anchor="middle">แท่งเดียวกัน เล่าคนละความละเอียด</text>
</svg>`;

const SVG_SINGLES = `<svg viewBox="0 0 660 190" role="img" aria-label="แท่งเดี่ยว doji hammer marubozu spinning top">
  <line x1="90" y1="40" x2="90" y2="120" stroke="var(--muted)" stroke-width="1.5"/><rect x="76" y="78" width="28" height="4" fill="var(--card)" stroke="var(--muted)" stroke-width="1.5"/>
  <text class="t-sm" x="90" y="150" text-anchor="middle">Doji</text>
  <text class="t-xs" x="90" y="168" text-anchor="middle">ลังเล</text>
  <line x1="245" y1="52" x2="245" y2="70" stroke="var(--up)" stroke-width="1.5"/><rect x="231" y="70" width="28" height="20" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/><line x1="245" y1="90" x2="245" y2="135" stroke="var(--up)" stroke-width="1.5"/>
  <text class="t-sm" x="245" y="150" text-anchor="middle">Hammer</text>
  <text class="t-xs" x="245" y="168" text-anchor="middle">อาจกลับขึ้น</text>
  <rect x="386" y="52" width="28" height="80" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <text class="t-sm" x="400" y="150" text-anchor="middle">Marubozu</text>
  <text class="t-xs" x="400" y="168" text-anchor="middle">แรงเต็มตัว</text>
  <line x1="555" y1="44" x2="555" y2="74" stroke="var(--muted)" stroke-width="1.5"/><rect x="541" y="74" width="28" height="20" fill="var(--card)" stroke="var(--muted)" stroke-width="1.5"/><line x1="555" y1="94" x2="555" y2="124" stroke="var(--muted)" stroke-width="1.5"/>
  <text class="t-sm" x="555" y="150" text-anchor="middle">Spinning Top</text>
  <text class="t-xs" x="555" y="168" text-anchor="middle">ไม่มีทิศ</text>
</svg>`;

const SVG_MULTI = `<svg viewBox="0 0 660 200" role="img" aria-label="แท่งคู่และแท่งสาม">
  <text class="t-sm" x="165" y="24" text-anchor="middle">Bullish Engulfing (คู่)</text>
  <line x1="120" y1="70" x2="120" y2="130" stroke="var(--down)" stroke-width="1.5"/><rect x="108" y="86" width="24" height="28" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.5"/>
  <line x1="180" y1="56" x2="180" y2="140" stroke="var(--up)" stroke-width="1.5"/><rect x="166" y="66" width="28" height="62" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <text class="t-xs" x="165" y="172" text-anchor="middle">แท่งขึ้น &quot;กลืน&quot; แท่งลงก่อนหน้า</text>
  <line x1="330" y1="30" x2="330" y2="170" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm" x="495" y="24" text-anchor="middle">Morning Star (สาม)</text>
  <line x1="430" y1="50" x2="430" y2="120" stroke="var(--down)" stroke-width="1.5"/><rect x="418" y="58" width="24" height="52" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.5"/>
  <line x1="490" y1="118" x2="490" y2="146" stroke="var(--muted)" stroke-width="1.5"/><rect x="480" y="128" width="20" height="8" fill="var(--card)" stroke="var(--muted)" stroke-width="1.5"/>
  <line x1="555" y1="44" x2="555" y2="118" stroke="var(--up)" stroke-width="1.5"/><rect x="543" y="56" width="24" height="52" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <text class="t-xs" x="495" y="172" text-anchor="middle">ลง → ลังเล → ขึ้น = สัญญาณกลับตัว</text>
</svg>`;

const SVG_CONTEXT = `<svg viewBox="0 0 660 200" role="img" aria-label="แพทเทิร์นต้องดูบริบท">
  <text class="t-sm t-up" x="165" y="24" text-anchor="middle">Hammer ที่แนวรับ ✓</text>
  <line x1="60" y1="150" x2="270" y2="150" stroke="var(--up)" stroke-width="2" stroke-dasharray="6 3"/>
  <text class="t-xs t-up" x="60" y="168" text-anchor="start">โซนแนวรับ</text>
  <line x1="165" y1="108" x2="165" y2="126" stroke="var(--up)" stroke-width="1.5"/><rect x="151" y="126" width="28" height="18" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/><line x1="165" y1="144" x2="165" y2="150" stroke="var(--up)" stroke-width="1.5"/>
  <text class="t-xs" x="165" y="192" text-anchor="middle">มีความหมาย: มีเหตุให้กลับ</text>
  <line x1="330" y1="30" x2="330" y2="180" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-down" x="495" y="24" text-anchor="middle">Hammer กลางอากาศ ✕</text>
  <line x1="495" y1="88" x2="495" y2="106" stroke="var(--muted)" stroke-width="1.5"/><rect x="481" y="106" width="28" height="18" fill="var(--card)" stroke="var(--muted)" stroke-width="1.5"/><line x1="495" y1="124" x2="495" y2="150" stroke="var(--muted)" stroke-width="1.5"/>
  <text class="t-xs" x="495" y="192" text-anchor="middle">ไม่มีความหมาย: ไม่มีเหตุ</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 2 · หมวด 2.1</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">กราฟและแท่งเทียน</span>
        <h1>อ่านแท่งเทียนให้ออก — ก่อนอ่านตลาดให้เป็น</h1>
        <p className="lead">
          แท่งเทียนคือ &quot;ภาษา&quot; พื้นฐานที่สุดของกราฟ หมวดนี้สอนให้อ่านมันออกจริง ๆ:
          กายวิภาคของแท่ง, timeframe, และแพทเทิร์นที่พบบ่อย — พร้อมกับดักสำคัญที่สุดของมือใหม่
          คือ<b>ท่องจำแพทเทิร์นโดยไม่ดูบริบท</b>
        </p>
      </div>

      <div className="wrap">
        {/* L1 */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>กราฟ 3 แบบ — และทำไมเราใช้แท่งเทียน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CHARTTYPES }} />
            <div className="figcap">แท่งเทียนบอกข้อมูลมากที่สุดในพื้นที่เท่ากัน — เปิด/ปิด/สูง/ต่ำ ครบในแท่งเดียว</div>
          </div>
          <div className="body-txt">
            <p><b>Line</b> ลากเส้นเชื่อมราคาปิด — เห็นเทรนด์ง่ายแต่ข้อมูลน้อย <b>Bar</b> และ <b>Candlestick</b> บอกครบทั้ง 4 ค่า (เปิด/สูง/ต่ำ/ปิด) แต่แท่งเทียนอ่านง่ายกว่าเพราะ &quot;ตัวเทียน&quot; ทำให้เห็นทันทีว่าแท่งนั้นขึ้นหรือลง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เราใช้ candlestick เพราะเห็นครบและอ่านทิศได้ในพริบตา</p></div>
        </div>

        {/* L2 anatomy */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>กายวิภาคแท่งเทียน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_ANATOMY }} />
            <div className="figcap">เขียว = ปิดสูงกว่าเปิด (ขาขึ้น) · แดง = ปิดต่ำกว่าเปิด (ขาลง)</div>
          </div>
          <div className="body-txt">
            <p>แต่ละแท่งบอก 4 ค่าในช่วงเวลาหนึ่ง: <b>เปิด, ปิด, สูงสุด, ต่ำสุด</b> — &quot;ตัวเทียน (body)&quot; คือระยะระหว่างเปิดกับปิด ส่วน &quot;ไส้ (wick)&quot; คือจุดที่ราคาเคยไปแตะแล้วถูกตีกลับ</p>
            <p><b>สิ่งที่สำคัญที่สุดคือ &quot;ราคาปิด&quot;</b> — เพราะมันคือข้อสรุปว่าใครชนะในช่วงนั้น (ผู้ซื้อหรือผู้ขาย) ไส้ยาว ๆ บอกว่ามีการต่อสู้และฝ่ายหนึ่งถูกปฏิเสธ — อ่านไส้เป็น จะเห็นเรื่องราวมากกว่าตัวเลข</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>body = ใครชนะ · wick = ราคาเคยไปแตะแล้วโดนตีกลับ · ปิดสำคัญสุด</p></div>
        </div>

        {/* L3 timeframe */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>Timeframe — แท่งเดียวกัน เล่าคนละเรื่อง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_TIMEFRAME }} />
            <div className="figcap">D1 หนึ่งแท่ง = H4 หลายแท่งรวมกัน — เลือก TF ผิด ก็เห็นเรื่องผิด</div>
          </div>
          <div className="body-txt">
            <p>Timeframe คือ &quot;ความละเอียด&quot; ของแต่ละแท่ง — แท่ง D1 (รายวัน) หนึ่งแท่งคือ H4 หกแท่งรวมกัน สิ่งที่ดู &quot;ขาขึ้น&quot; ใน H4 อาจเป็นแค่การเด้งเล็ก ๆ ในขาลงใหญ่ของ D1</p>
            <p>มือใหม่มักติดกับ TF เล็ก (M1, M5) เพราะ &quot;เห็นเยอะ รู้สึกตื่นเต้น&quot; แต่ TF ยิ่งเล็ก สัญญาณรบกวนยิ่งมาก เราจะสอนให้ดูจากภาพใหญ่ลงเล็ก (top-down) ในระดับสูงขึ้น</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>TF = ความละเอียด · เล็กไป = noise เยอะ · ดูภาพใหญ่ก่อนเสมอ</p></div>
        </div>

        {/* L4 single candles */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>แท่งเดี่ยวที่ต้องรู้จัก</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SINGLES }} />
            <div className="figcap">รูปร่างของแท่งเล่าเรื่อง &quot;ใครกำลังชนะ&quot; ในช่วงนั้น</div>
          </div>
          <div className="body-txt">
            <p><b>Doji</b> เปิด-ปิดเกือบเท่ากัน = ลังเล ไม่มีใครชนะ · <b>Hammer</b> ไส้ล่างยาว = ราคาถูกดันลงแล้วถูกซื้อกลับ อาจกลับขึ้น · <b>Marubozu</b> ตัวเต็มไม่มีไส้ = ฝ่ายหนึ่งคุมเต็ม · <b>Spinning Top</b> ตัวเล็กไส้สองข้าง = ไม่มีทิศชัด</p>
            <p>แต่ย้ำไว้ก่อน (จะเน้นในบทสุดท้าย): แท่งพวกนี้<b>ไม่ใช่สัญญาณซื้อขายด้วยตัวมันเอง</b> มันคือ &quot;เบาะแส&quot; ที่ต้องอ่านคู่กับตำแหน่งที่มันเกิด</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>รูปแท่งบอกอารมณ์การต่อสู้ — แต่เป็นเบาะแส ไม่ใช่คำสั่งซื้อขาย</p></div>
        </div>

        {/* L5 multi */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>แพทเทิร์นแท่งคู่และแท่งสาม</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_MULTI }} />
            <div className="figcap">หลายแท่งต่อกันเล่าเรื่องได้ชัดกว่าแท่งเดียว — โดยเฉพาะจุดกลับตัว</div>
          </div>
          <div className="body-txt">
            <p><b>Bullish Engulfing</b> คือแท่งขึ้นที่ตัวใหญ่จน &quot;กลืน&quot; แท่งลงก่อนหน้าทั้งแท่ง = ผู้ซื้อกลับมาคุมแรง · <b>Morning Star</b> (สามแท่ง) เล่าเรื่อง ลง → ลังเล → ขึ้น = โมเมนตัมกำลังพลิก มี Evening Star เป็นเวอร์ชันกลับตัวลง</p>
            <p>แพทเทิร์นหลายแท่งน่าเชื่อถือกว่าแท่งเดี่ยว เพราะมันแสดง &quot;การเปลี่ยนมือ&quot; ที่ชัดขึ้น — แต่กฎเดิมยังใช้: ดูว่ามันเกิดตรงไหนด้วย</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>หลายแท่ง = เห็นการเปลี่ยนมือชัดกว่า — Engulfing / Star คือตัวคลาสสิก</p></div>
        </div>

        {/* L6 context */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>กับดักที่สำคัญที่สุด: ท่องจำโดยไม่ดูบริบท</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CONTEXT }} />
            <div className="figcap">แท่งเดียวกันเป๊ะ — แต่ &quot;ที่แนวรับ&quot; กับ &quot;กลางอากาศ&quot; ความหมายต่างกันสิ้นเชิง</div>
          </div>
          <div className="body-txt">
            <p>นี่คือข้อผิดพลาดที่ทำให้มือใหม่เจ็บซ้ำ ๆ: <b>ท่องจำว่า &quot;เห็น Hammer = ซื้อ&quot;</b> แล้วเข้าทุกครั้งที่เจอ Hammer จริง ๆ แล้ว Hammer ที่เกิด<b>ตรงแนวรับสำคัญ</b> มีความหมาย (มีเหตุให้ราคากลับ) ส่วน Hammer ที่โผล่กลางที่ว่าง ๆ แทบไม่มีความหมายเลย</p>
            <p className="pull">แพทเทิร์นไม่ใช่สัญญาณ — มันคือเบาะแสที่มีค่าเฉพาะเมื่ออยู่ &quot;ถูกที่&quot;</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>ในเมื่อ &quot;ถูกที่&quot; สำคัญขนาดนี้ หมวด <b><a href="/grade/support-resistance">2.2 แนวรับแนวต้าน</a></b> จะสอนหา &quot;ที่&quot; ที่มีความหมายเหล่านั้น</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>อย่าเทรดแพทเทิร์นลอย ๆ — ถามเสมอว่า &quot;มันเกิดตรงไหน&quot;</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 2 หมวด 2.1
      </div>
    </>
  );
}
