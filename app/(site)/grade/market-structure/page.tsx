import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 5 · Market Structure — อ่านโครงสร้างตลาดจากราคาเปล่า · Cerfinits Grade",
  description:
    "Premium: swing ที่มีนัย, HH-HL/LH-LL, Break of Structure, กฎกลาง range, Supply & Demand zones (fresh vs tested) และ checklist แยก retracement/reversal",
  alternates: { canonical: "/grade/market-structure" },
};

const SVG_WHY = `<svg viewBox="0 0 660 190" role="img" aria-label="อินดิเคเตอร์ทุกตัวแปลงมาจากราคา">
  <text class="t-sm" x="150" y="26" text-anchor="middle">ต้นฉบับ: ราคา</text>
  <line x1="80" y1="60" x2="80" y2="120" stroke="var(--up)" stroke-width="1.5"/><rect x="72" y="76" width="16" height="30" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="120" y1="52" x2="120" y2="112" stroke="var(--down)" stroke-width="1.5"/><rect x="112" y="66" width="16" height="28" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.5"/>
  <line x1="160" y1="58" x2="160" y2="124" stroke="var(--up)" stroke-width="1.5"/><rect x="152" y="72" width="16" height="34" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="200" y1="44" x2="200" y2="108" stroke="var(--up)" stroke-width="1.5"/><rect x="192" y="56" width="16" height="34" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <path d="M255,90 L305,90 M295,82 L308,90 L295,98" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <text class="t-xs t-gold" x="281" y="74" text-anchor="middle">คำนวณ</text>
  <text class="t-sm" x="480" y="26" text-anchor="middle">อนุพันธ์: อินดิเคเตอร์</text>
  <polyline points="340,80 400,96 460,72 520,102 600,84" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <text class="t-xs" x="480" y="120" text-anchor="middle">MA · RSI · MACD ล้วนแปลงจากราคา</text>
  <text class="t-xs t-gold" x="480" y="150" text-anchor="middle">Price action = ข้ามตัวกลาง อ่านต้นฉบับตรง ๆ</text>
</svg>`;

const SVG_SWINGS = `<svg viewBox="0 0 660 230" role="img" aria-label="HH HL ขาขึ้น และ LH LL ขาลง">
  <text class="t-sm t-up" x="165" y="22" text-anchor="middle">ขาขึ้น: HH + HL</text>
  <polyline points="40,190 100,120 140,155 210,80 250,118 310,50" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <circle cx="100" cy="120" r="5" fill="var(--up)"/><text class="t-xs t-up" x="100" y="106" text-anchor="middle">H</text>
  <circle cx="140" cy="155" r="5" fill="var(--gold)"/><text class="t-xs t-gold" x="140" y="176" text-anchor="middle">HL</text>
  <circle cx="210" cy="80" r="5" fill="var(--up)"/><text class="t-xs t-up" x="210" y="66" text-anchor="middle">HH</text>
  <circle cx="250" cy="118" r="5" fill="var(--gold)"/><text class="t-xs t-gold" x="250" y="140" text-anchor="middle">HL</text>
  <circle cx="310" cy="50" r="5" fill="var(--up)"/><text class="t-xs t-up" x="310" y="36" text-anchor="middle">HH</text>
  <line x1="345" y1="26" x2="345" y2="204" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-down" x="500" y="22" text-anchor="middle">ขาลง: LH + LL</text>
  <polyline points="380,60 440,130 480,96 545,175 585,140 635,205" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <circle cx="440" cy="130" r="5" fill="var(--down)"/><text class="t-xs t-down" x="440" y="152" text-anchor="middle">L</text>
  <circle cx="480" cy="96" r="5" fill="var(--gold)"/><text class="t-xs t-gold" x="480" y="82" text-anchor="middle">LH</text>
  <circle cx="545" cy="175" r="5" fill="var(--down)"/><text class="t-xs t-down" x="545" y="196" text-anchor="middle">LL</text>
  <circle cx="585" cy="140" r="5" fill="var(--gold)"/><text class="t-xs t-gold" x="585" y="126" text-anchor="middle">LH</text>
</svg>`;

const SVG_BOS = `<svg viewBox="0 0 660 220" role="img" aria-label="break of structure">
  <polyline points="40,180 110,110 150,145 220,70 260,112 330,88 400,168" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <circle cx="260" cy="112" r="5" fill="var(--gold)"/>
  <text class="t-xs t-gold" x="260" y="98" text-anchor="middle">HL ล่าสุด</text>
  <line x1="260" y1="112" x2="470" y2="112" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <circle cx="400" cy="168" r="6" fill="var(--down)"/>
  <text class="t-sm t-down" x="420" y="150" text-anchor="start">ปิดหลุด HL = BOS</text>
  <text class="t-xs t-down" x="420" y="170" text-anchor="start">โครงสร้างขาขึ้นพังอย่างเป็นทางการ</text>
  <polyline points="400,168 450,140 520,196 570,175 620,205" fill="none" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs" x="46" y="30">ขาขึ้นยังอยู่ ตราบใดที่ HL ล่าสุดไม่ถูก &quot;ปิด&quot; หลุด</text>
</svg>`;

const SVG_RANGE = `<svg viewBox="0 0 660 220" role="img" aria-label="กฎกลาง range">
  <rect x="40" y="42" width="580" height="26" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1"/>
  <text class="t-xs t-down" x="46" y="36">ขอบบน — โซนหา short / รอ break</text>
  <rect x="40" y="158" width="580" height="26" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1"/>
  <text class="t-xs t-up" x="46" y="202">ขอบล่าง — โซนหา long / รอ break</text>
  <rect x="40" y="82" width="580" height="62" fill="var(--hair)" opacity="0.35"/>
  <text class="t-sm" x="330" y="117" text-anchor="middle">กลาง range = พื้นที่ห้ามเทรด (no-trade zone)</text>
  <polyline points="60,60 120,170 190,58 260,168 330,64 400,172 470,55 540,166 610,70" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
</svg>`;

const SVG_SD = `<svg viewBox="0 0 660 230" role="img" aria-label="supply demand zone จาก base candles">
  <rect x="130" y="128" width="150" height="44" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-up" x="205" y="192" text-anchor="middle">Demand zone = ครอบ &quot;ฐานสะสม&quot; ทั้งก้อน</text>
  <line x1="150" y1="132" x2="150" y2="168" stroke="var(--up)" stroke-width="1.2"/><rect x="143" y="142" width="14" height="16" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.2"/>
  <line x1="180" y1="134" x2="180" y2="170" stroke="var(--down)" stroke-width="1.2"/><rect x="173" y="144" width="14" height="16" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.2"/>
  <line x1="210" y1="130" x2="210" y2="166" stroke="var(--up)" stroke-width="1.2"/><rect x="203" y="140" width="14" height="16" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.2"/>
  <line x1="245" y1="120" x2="245" y2="162" stroke="var(--up)" stroke-width="1.5"/><rect x="236" y="126" width="18" height="26" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="285" y1="70" x2="285" y2="140" stroke="var(--up)" stroke-width="1.5"/><rect x="276" y="78" width="18" height="48" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="325" y1="40" x2="325" y2="96" stroke="var(--up)" stroke-width="1.5"/><rect x="316" y="46" width="18" height="38" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <text class="t-xs t-up" x="316" y="30" text-anchor="start">หนีแรง = โซนมีของจริง</text>
  <polyline points="360,60 420,96 470,132 520,150" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
  <circle cx="520" cy="150" r="5" fill="var(--gold)"/>
  <text class="t-xs t-gold" x="540" y="146" text-anchor="start">กลับมาแตะครั้งแรก</text>
  <text class="t-xs t-gold" x="540" y="164" text-anchor="start">(fresh zone) = น่าสนใจสุด</text>
</svg>`;

const SVG_RVR = `<svg viewBox="0 0 660 230" role="img" aria-label="retracement กับ reversal">
  <text class="t-sm t-up" x="165" y="22" text-anchor="middle">Retracement — โครงสร้างยังอยู่</text>
  <polyline points="40,190 100,120 140,150 200,80 240,124 300,55" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="140" y1="150" x2="300" y2="150" stroke="var(--up)" stroke-width="1.2" stroke-dasharray="5 3"/>
  <circle cx="240" cy="124" r="5" fill="var(--up)"/>
  <text class="t-xs t-up" x="240" y="176" text-anchor="middle">ย่อไม่หลุด HL เดิม → ขึ้นต่อ</text>
  <line x1="335" y1="26" x2="335" y2="204" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-down" x="500" y="22" text-anchor="middle">Reversal — โครงสร้างพัง</text>
  <polyline points="370,190 430,120 470,150 530,80 570,166 620,140 640,200" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="470" y1="150" x2="600" y2="150" stroke="var(--down)" stroke-width="1.2" stroke-dasharray="5 3"/>
  <circle cx="570" cy="166" r="5" fill="var(--down)"/>
  <text class="t-xs t-down" x="545" y="192" text-anchor="middle">หลุด HL (BOS) + เด้งไม่ผ่าน = กลับเทรนด์</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 5 · หมวด 5.1 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Market Structure — โครงสร้างตลาด</span>
        <h1>อ่านตลาดจากราคาเปล่า — แม่นกว่าอินดิเคเตอร์ทุกตัว</h1>
        <p className="lead">
          ยินดีต้อนรับสู่โซน Premium — จากนี้เนื้อหาจะลึกและ &quot;ใช้งานจริง&quot; ขึ้น ทุกหมวดจบด้วย playbook
          ที่เอาไปทำตามได้ทันที เริ่มจากทักษะที่เป็นฐานของทุกอย่าง: <b>อ่านโครงสร้างตลาดจากราคาล้วน ๆ</b>
          ว่าฝ่ายใดควบคุมตลาด เทรนด์ยังอยู่หรือกำลังเปลี่ยน และบริเวณใดมีร่องรอยของแรงซื้อขายขนาดใหญ่
        </p>
      </div>

      <div className="wrap">
        {/* L1 why price action */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>ทำไม Price Action มาก่อนอินดิเคเตอร์</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_WHY }} />
            <div className="figcap">อินดิเคเตอร์ทุกตัวคือ &quot;อนุพันธ์&quot; ของราคา — price action คือการอ่านต้นฉบับโดยไม่ผ่านตัวกลาง</div>
          </div>
          <div className="body-txt">
            <p>ในระดับ 3 เราเรียนอินดิเคเตอร์พร้อมคำเตือนว่า &quot;มันตามหลังราคาเสมอ&quot; — ระดับนี้เราตัดตัวกลางออก: <b>อ่านราคาตรง ๆ</b> เพราะทุกอย่างที่ MA/RSI/MACD พยายามบอก มันเขียนอยู่ในราคาแล้ว แค่ต้องอ่านให้เป็น</p>
            <p>ข้อได้เปรียบเชิงปฏิบัติมี 3 ข้อ: (1) <b>เร็วกว่า</b> — ไม่ต้องรอเส้นตัด คุณเห็นโครงสร้างเปลี่ยนตั้งแต่แท่งที่มันเปลี่ยน (2) <b>ใช้ได้ทุกตลาดทุก TF</b> — โครงสร้างคือพฤติกรรมมนุษย์ ไม่ใช่พารามิเตอร์ที่ต้องจูน (3) <b>ให้จุด SL ที่มีเหตุผล</b> — SL อิงโครงสร้าง (ระดับ 4.2) เริ่มจากการเห็นโครงสร้างก่อน</p>
            <p><b>แต่พูดตรง ๆ แบบ evidence-first:</b> price action ไม่ใช่เวทมนตร์และไม่ได้ &quot;แม่นกว่า&quot; โดยอัตโนมัติ — มันคือ<b>กรอบการอ่าน</b>ที่ทำให้การตัดสินใจของคุณมีโครงสร้างและวัดผลได้ ความได้เปรียบจริงยังต้องมาจากการทดสอบ (ระดับ 7) เหมือนเดิม</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>อินดิเคเตอร์คืออนุพันธ์ของราคา — อ่านต้นฉบับได้ ก็ไม่ต้องรอตัวกลาง</p></div>
        </div>

        {/* L2 swings */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>Swing ที่ &quot;มีนัย&quot; และภาษา HH-HL / LH-LL</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SWINGS }} />
            <div className="figcap">ขาขึ้น = ยอดใหม่สูงกว่าเดิม (HH) และย่อแล้วไม่หลุดต่ำเดิม (HL) · ขาลงคือภาพกลับด้าน</div>
          </div>
          <div className="body-txt">
            <p>นิยามเทรนด์แบบวัดได้: <b>ขาขึ้น = ราคาทำ Higher High (HH) และ Higher Low (HL) ต่อเนื่อง</b> · ขาลง = Lower High (LH) + Lower Low (LL) — แค่นี้คุณตอบคำถาม &quot;ตอนนี้เทรนด์อะไร&quot; ได้โดยไม่ต้องพึ่งเส้นใด ๆ</p>
            <p>ปัญหาจริงของมือใหม่คือ <b>&quot;swing ไหนนับ swing ไหนไม่นับ&quot;</b> — ถ้านับทุก wiggle เล็ก ๆ โครงสร้างจะเปลี่ยนทุกชั่วโมงจนใช้ไม่ได้ กฎที่ใช้ได้จริง: swing ที่มีนัยต้อง (1) มีแท่ง &quot;ถอยออก&quot; จากจุดกลับตัวอย่างน้อย 2-3 แท่งทั้งสองฝั่ง (2) ระยะการย่อ/เด้งใหญ่พอเทียบ ATR (เช่น &gt; 1×ATR ของ TF นั้น) — เล็กกว่านั้นถือเป็น noise ภายใน swing เดิม</p>
            <p>เคล็ดที่ช่วยได้มาก: <b>ทำเครื่องหมาย swing บน TF ที่สูงกว่าที่คุณเทรด 1 ชั้น</b> (เทรด M15 → mark swing บน H1) จะเห็นเฉพาะโครงสร้างที่มีน้ำหนักจริง แล้วค่อยลงมาหา entry ใน TF เล็ก — เรื่องนี้จะกลายเป็นระบบเต็ม ๆ ในหมวด 5.3</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เทรนด์ = ลำดับ HH-HL (หรือ LH-LL) · swing ต้อง &quot;มีนัย&quot; — กรอง noise ด้วย ATR และ TF ที่สูงขึ้น</p></div>
        </div>

        {/* L3 BOS */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>Break of Structure — จุดที่เทรนด์ &quot;พังอย่างเป็นทางการ&quot;</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_BOS }} />
            <div className="figcap">ขาขึ้นตายเมื่อ HL ล่าสุดถูก &quot;ปิด&quot; หลุด — ไม่ใช่เมื่อคุณรู้สึกว่ามันแพงไป</div>
          </div>
          <div className="body-txt">
            <p>คำถามที่แพงที่สุดในการเทรด: &quot;เทรนด์จบหรือยัง?&quot; โครงสร้างให้คำตอบที่วัดได้: <b>ขาขึ้นยังไม่จบ ตราบใดที่ HL ล่าสุดยังไม่ถูกปิดหลุด</b> เมื่อไหร่ที่แท่ง &quot;ปิด&quot; ต่ำกว่า HL ล่าสุด = Break of Structure (BOS) — สัญญาณแรกว่าฝั่งซื้อเสียการควบคุม</p>
            <p>รายละเอียดที่มือโปรใช้แต่มือใหม่พลาด: ต้องเป็น<b>ราคาปิด</b> ไม่ใช่แค่ไส้แทงหลุด — ไส้ที่แทงหลุดแล้วปิดกลับขึ้นมา มักเป็นการ &quot;กวาด stop&quot; (liquidity sweep) ซึ่งเป็นคนละเรื่องกับโครงสร้างพัง และบ่อยครั้ง<b>ตรงข้ามเลย</b>: กวาดเสร็จแล้ววิ่งต่อทางเดิมแรงกว่าเก่า — เราจะเจาะเรื่องนี้เต็ม ๆ ในหมวด 5.2</p>
            <p>และอย่าลืม: BOS หนึ่งครั้ง = เทรนด์เดิม &quot;หมดสภาพ&quot; แต่ยัง<b>ไม่ใช่</b>ขาลงทันที — ต้องรอราคาเริ่มทำ LH-LL จริงก่อน ระหว่างนั้นตลาดมักกลายเป็น range (บทถัดไป) การรีบ short ทันทีที่เห็น BOS แรกคือการเทรดในช่วงที่ตลาดยังไม่เลือกทาง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>BOS = ปิดหลุด HL/LH ล่าสุด (ไส้ไม่นับ) · หลัง BOS คือ &quot;ไม่มีเทรนด์&quot; ไม่ใช่เทรนด์ใหม่ทันที</p></div>
        </div>

        {/* L4 range */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>Range และกฎเหล็ก: ห้ามเทรดกลาง Range</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RANGE }} />
            <div className="figcap">ใน range ราคา &quot;ยุติธรรม&quot; อยู่ตรงกลาง — ขอบเท่านั้นที่ให้ R:R คุ้ม</div>
          </div>
          <div className="body-txt">
            <p>ตลาดส่วนใหญ่ของเวลาไม่ได้เทรนด์ — มันแกว่งในกรอบ (range) และนี่คือช่วงที่ระบบเทรนด์ทุกตัวโดนหลอกซ้ำ ๆ วิธีอ่าน: หลัง BOS หรือหลังวิ่งแรง ราคาเริ่มตีกรอบ สร้างขอบบน (แนวขาย) กับขอบล่าง (แนวซื้อ) ที่แตะแล้วเด้งซ้ำ</p>
            <p>กฎที่สำคัญที่สุดของ range คือเรื่อง<b>ตำแหน่ง</b>: เทรดได้เฉพาะ &quot;ที่ขอบ&quot; — long ที่ขอบล่าง (SL ใต้กรอบ) หรือ short ที่ขอบบน (SL เหนือกรอบ) เพราะขอบให้ SL สั้นและเป้าไกล (ฝั่งตรงข้ามของกรอบ) = R:R ดี ส่วน<b>กลาง range คือจุดที่แย่ที่สุดในตลาด</b>: ระยะถึงขอบทั้งสองฝั่งพอ ๆ กัน ไม่มีความได้เปรียบเชิงตำแหน่งเลย — ยืนดูเฉย ๆ คือ position ที่ถูกต้อง</p>
            <p>เชื่อมกับ R:R ของระดับ 4: setup เดียวกันเป๊ะ แต่เข้า &quot;กลางกรอบ&quot; แทน &quot;ขอบกรอบ&quot; อาจเปลี่ยน R:R จาก 1:3 เหลือ 1:0.8 — <b>ตำแหน่งเข้าคือตัวแปรที่คุณคุมได้ 100%</b> อย่าสละมันเพราะรอไม่เป็น</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Range เทรดได้เฉพาะขอบ — กลางกรอบไม่มี edge เชิงตำแหน่ง ยืนดูคือคำตอบ</p></div>
        </div>

        {/* L5 S&D */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>Supply &amp; Demand Zones — ร่องรอยของแรงซื้อขายขนาดใหญ่</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SD }} />
            <div className="figcap">โซนที่ดี = ฐานสะสมสั้น ๆ + หนีออกแรง · แตะครั้งแรก (fresh) น่าเชื่อถือกว่าโซนที่ถูกใช้แล้ว</div>
          </div>
          <div className="body-txt">
            <p>ยกระดับจาก &quot;เส้น S/R&quot; (ระดับ 2) สู่ &quot;โซนที่มีเหตุผลเบื้องหลัง&quot;: <b>Demand zone</b> คือบริเวณที่เคยมีแรงซื้อมหาศาลจนราคาพุ่งหนีขึ้นไป — order ที่ยังค้างอยู่แถวนั้นคือเหตุผลที่ราคากลับมาแล้วมักเด้ง (Supply zone = ภาพกลับด้าน)</p>
            <p>วิธีวาดที่ทำตามได้: (1) หา<b>การวิ่งแรง ๆ</b> (แท่ง body ใหญ่ต่อเนื่อง) (2) ถอยกลับไปดู<b>&quot;ฐาน&quot;</b>ก่อนวิ่ง — กลุ่มแท่งเล็ก ๆ ที่สะสมตัว (3) ตีกรอบครอบฐานนั้นทั้งก้อน (สูงสุด-ต่ำสุดของฐาน) = โซนของคุณ · เกณฑ์คุณภาพ: ฐานยิ่ง<b>สั้น</b>และการหนียิ่ง<b>แรง</b> โซนยิ่งน่าเชื่อถือ เพราะแปลว่า order imbalance รุนแรงจริง</p>
            <p>แนวคิด <b>fresh vs tested</b>: โซนที่ราคายังไม่เคยกลับมาแตะ (fresh) มีน้ำหนักสุด เพราะ order ยังไม่ถูกใช้ — ทุกครั้งที่ถูกแตะ order จะถูก &quot;กิน&quot; ไปเรื่อย ๆ โซนที่โดนทดสอบ 3-4 รอบแล้วคือโซนใกล้หมดสภาพ ไม่ใช่โซนที่ &quot;แข็งแรงเพราะรับมาหลายครั้ง&quot; (ความเชื่อผิดยอดฮิต) — <b>หมายเหตุ evidence-first:</b> นี่คือกรอบการอ่านที่สมเหตุผลเชิงกลไก order flow แต่การพิสูจน์ว่าโซนแบบไหน &quot;ชนะจริง&quot; ในตลาด/TF ของคุณ ยังต้องผ่าน backtest เช่นเคย</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>โซน = ฐานสะสม + หนีแรง · fresh zone มีน้ำหนักสุด · โดนแตะบ่อย = ใกล้หมด ไม่ใช่แข็งขึ้น</p></div>
        </div>

        {/* L6 R vs R + playbook */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>★ Retracement หรือ Reversal — Checklist ตัดสิน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RVR }} />
            <div className="figcap">คำถามเดียวกัน คำตอบต่างกัน = กลยุทธ์คนละขั้ว · ใช้โครงสร้างตอบ ไม่ใช้ความรู้สึก</div>
          </div>
          <div className="body-txt">
            <p>ทุกครั้งที่ราคาย่อ คำถามคือ &quot;แค่พัก (ซื้อเพิ่มได้) หรือกลับเทรนด์ (ต้องหนี)&quot; — ตอบด้วย checklist ที่วัดได้ ไล่จากน้ำหนักมากไปน้อย:</p>
            <ul className="reasons">
              <li><b>โครงสร้าง:</b> HL/LH ล่าสุดถูก &quot;ปิด&quot; หลุดหรือยัง? ยังไม่หลุด = น้ำหนักไปทาง retracement · หลุดแล้ว (BOS) = เตือน reversal</li>
              <li><b>ความลึก:</b> ย่อตื้น (โซน 0.382–0.618 ของขาที่วิ่งมา — Fib จากระดับ 3) = ปกติของ retracement · ย่อลึกทะลุ 0.786 จนถึงฐานขาเดิม = ผิดวิสัยการพัก</li>
              <li><b>โมเมนตัม:</b> ขาย่อแท่งเล็ก แรงอ่อน = พักตัว · ขาย่อแท่ง body ใหญ่ แรงพอ ๆ กับขาหลัก = มีเจ้ามือฝั่งตรงข้ามจริง</li>
              <li><b>พฤติกรรมที่โซน:</b> ย่อมาถึง demand แล้วเด้งทันที = retracement จบสวย · ทะลุ demand ที่ควรรับ = ธงแดงใหญ่</li>
            </ul>
            <p><b>Playbook สรุปหมวด 5.1</b> — สิ่งที่ต้องทำก่อนเปิดกราฟหา setup ทุกครั้ง:</p>
            <div className="calc c2">
              <div className="crow head"><span>ขั้นตอน</span><span className="v">ผลลัพธ์</span></div>
              <div className="crow"><span className="k">1. Mark swing ที่มีนัย → อ่าน HH-HL/LH-LL</span><span className="v">เทรนด์ / range</span></div>
              <div className="crow"><span className="k">2. หา HL/LH ล่าสุด = ระดับชี้ขาดของเทรนด์</span><span className="v">จุด BOS ที่ต้องจับตา</span></div>
              <div className="crow"><span className="k">3. วาด S&amp;D zone (fresh ก่อน) + ขอบ range</span><span className="v">แผนที่ &quot;ที่&quot; ที่เทรดได้</span></div>
              <div className="crow hl"><span className="k">4. ราคาอยู่ตรงไหนเทียบโซน?</span><span className="v">ขอบ = รอ setup · กลาง = ยืนดู</span></div>
            </div>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>รู้จัก &quot;ที่&quot; แล้ว — หมวด <b><a href="/grade/breakout-fakeout">5.2 Breakout &amp; Fakeout</a></b> จะสอนอ่าน &quot;เหตุการณ์&quot; ที่เกิดตรงโซนพวกนั้น: ทะลุจริงหน้าตาแบบไหน กับดักหน้าตาแบบไหน และเทรดทั้งสองอย่างยังไง</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ย่อหรือกลับเทรนด์ ตอบด้วย 4 ข้อ: โครงสร้าง · ความลึก · โมเมนตัม · พฤติกรรมที่โซน</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 5 หมวด 5.1 (Premium)
      </div>
    </>
  );
}
