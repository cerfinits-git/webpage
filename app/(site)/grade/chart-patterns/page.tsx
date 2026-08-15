import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 3 · Chart Patterns — รูปแบบราคาที่เกิดซ้ำ · Cerfinits Grade",
  description:
    "3 กลุ่มแพทเทิร์น (กลับตัว/ไปต่อ/สองทาง), Double Top, Head & Shoulders, Flag, Triangle, วิธีเทรด และความจริงเรื่องอัตราสำเร็จ",
  alternates: { canonical: "/grade/chart-patterns" },
};

const SVG_GROUPS = `<svg viewBox="0 0 660 180" role="img" aria-label="3 กลุ่มแพทเทิร์น">
  <rect class="chip-n" x="30" y="30" width="185" height="120" rx="3"/>
  <text class="t-md" x="122" y="62" text-anchor="middle">กลับตัว</text>
  <polyline points="60,120 85,90 105,110 130,88 155,118 185,116" fill="none" stroke="var(--down)" stroke-width="1.8"/>
  <text class="t-xs" x="122" y="140" text-anchor="middle">จบเทรนด์เดิม</text>
  <rect class="chip-n" x="237" y="30" width="185" height="120" rx="3"/>
  <text class="t-md" x="329" y="62" text-anchor="middle">ไปต่อ</text>
  <polyline points="265,120 300,80 300,100 340,92 392,72" fill="none" stroke="var(--up)" stroke-width="1.8"/>
  <text class="t-xs" x="329" y="140" text-anchor="middle">พักแล้วไปทางเดิม</text>
  <rect class="chip-gold" x="444" y="30" width="185" height="120" rx="3" stroke-width="2.5"/>
  <text class="t-md t-gold" x="536" y="62" text-anchor="middle">สองทาง</text>
  <polyline points="470,80 500,116 470,110 530,92 470,100" fill="none" stroke="var(--gold)" stroke-width="1.8"/>
  <text class="t-xs" x="536" y="140" text-anchor="middle">รอ break ค่อยตัดสิน</text>
</svg>`;

const SVG_REVERSAL = `<svg viewBox="0 0 660 200" role="img" aria-label="double top และ head and shoulders">
  <text class="t-sm" x="165" y="24" text-anchor="middle">Double Top</text>
  <polyline points="50,150 100,70 150,110 200,70 260,150" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="60" y1="112" x2="255" y2="112" stroke="var(--down)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-down" x="60" y="128">neckline</text>
  <line x1="330" y1="30" x2="330" y2="180" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm" x="495" y="24" text-anchor="middle">Head &amp; Shoulders</text>
  <polyline points="390,140 425,100 460,120 500,60 540,120 575,100 610,150" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="400" y1="128" x2="605" y2="128" stroke="var(--down)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs" x="500" y="52" text-anchor="middle">head</text>
</svg>`;

const SVG_CONT = `<svg viewBox="0 0 660 200" role="img" aria-label="flag และ triangle">
  <text class="t-sm" x="165" y="24" text-anchor="middle">Flag (ธง)</text>
  <polyline points="60,160 90,60" fill="none" stroke="var(--up)" stroke-width="2.5"/>
  <text class="t-xs" x="66" y="120" text-anchor="start">เสาธง</text>
  <polyline points="90,60 130,80 170,66 210,86" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
  <line x1="90" y1="56" x2="215" y2="76" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="90" y1="86" x2="215" y2="106" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 3"/>
  <polyline points="210,86 250,40" fill="none" stroke="var(--up)" stroke-width="2"/>
  <line x1="330" y1="30" x2="330" y2="180" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm" x="495" y="24" text-anchor="middle">Triangle (สามเหลี่ยม)</text>
  <line x1="400" y1="50" x2="600" y2="100" stroke="var(--hair-2)" stroke-width="1.5"/>
  <line x1="400" y1="150" x2="600" y2="100" stroke="var(--hair-2)" stroke-width="1.5"/>
  <polyline points="400,100 440,60 470,130 510,80 540,112 575,96 600,100" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
  <text class="t-xs" x="495" y="176" text-anchor="middle">บีบตัวแคบลงก่อน break</text>
</svg>`;

const SVG_MEASURED = `<svg viewBox="0 0 660 210" role="img" aria-label="measured move และ break retest">
  <polyline points="40,60 90,60 90,140 150,140" fill="none" stroke="var(--gold)" stroke-width="1.5"/>
  <text class="t-xs t-gold" x="100" y="105" text-anchor="start">ความสูง H</text>
  <line x1="40" y1="140" x2="620" y2="140" stroke="var(--down)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-down" x="44" y="134">neckline</text>
  <polyline points="150,80 200,120 250,90 300,138 340,150 380,138" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <circle cx="340" cy="150" r="5" fill="var(--down)"/>
  <text class="t-xs" x="340" y="172" text-anchor="middle">ทะลุ + ย้อนทดสอบ = จุดเข้า</text>
  <polyline points="380,138 440,160 500,180 560,200" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="560" y1="140" x2="560" y2="220" stroke="var(--up)" stroke-width="1.5"/>
  <text class="t-xs t-up" x="576" y="185" text-anchor="start">เป้า = H</text>
</svg>`;

const SVG_SUCCESS = `<svg viewBox="0 0 660 170" role="img" aria-label="อัตราสำเร็จที่เล่าต่อกับที่วัดจริง">
  <text class="t-sm" x="8" y="20">อัตราสำเร็จของแพทเทิร์น</text>
  <text class="t-md" x="8" y="66">ที่เล่าต่อ ๆ กัน</text>
  <rect class="bar-gold" x="220" y="48" width="360" height="28"/>
  <text class="t-white" x="570" y="66" text-anchor="end" style="font-size:12px;font-weight:700">&quot;80–90%!&quot;</text>
  <text class="t-md" x="8" y="120">ที่วัดได้จริง</text>
  <rect class="bar-n" x="220" y="102" width="200" height="28"/>
  <text class="t-sm" x="430" y="121">แล้วแต่บริบท/TF/ตลาด</text>
  <text class="t-xs t-down" x="8" y="152">ตัวเลขเป๊ะ ๆ ที่โฆษณา = การตลาด ไม่ใช่ข้อเท็จจริง</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 3 · หมวด 3.2</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Chart Patterns</span>
        <h1>รูปแบบราคาที่เกิดซ้ำ — และความจริงเรื่องอัตราสำเร็จ</h1>
        <p className="lead">
          แพทเทิร์นคือรูปทรงราคาที่คนทั้งตลาดจำได้และตอบสนองคล้าย ๆ กัน หมวดนี้สอน 3 กลุ่มหลัก
          วิธีเทรด และปิดท้ายด้วยความจริงที่คอร์สอื่นไม่ค่อยพูด: <b>อัตราสำเร็จที่วัดได้ ต่างจากที่เล่าต่อกันมา</b>
        </p>
      </div>

      <div className="wrap">
        {/* L1 */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>3 กลุ่มแพทเทิร์นที่ต้องแยกให้ออก</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_GROUPS }} />
            <div className="figcap">รู้ว่าแพทเทิร์นอยู่กลุ่มไหน = รู้ว่ามันกำลังบอก &quot;กลับตัว&quot; หรือ &quot;ไปต่อ&quot;</div>
          </div>
          <div className="body-txt">
            <p>แพทเทิร์นแบ่งเป็น 3 กลุ่มตามสิ่งที่มันบอก: <b>กลับตัว (reversal)</b> = เทรนด์เดิมกำลังจบ · <b>ไปต่อ (continuation)</b> = แค่พักก่อนไปทางเดิม · <b>สองทาง (bilateral)</b> = ยังไม่ตัดสิน ต้องรอ break</p>
            <p>ทำไมต้องแยก? เพราะแพทเทิร์นหน้าตาคล้ายกันแต่คนละกลุ่ม จะทำให้เทรดผิดทางเลย — และเหมือนบทก่อน ๆ: แพทเทิร์นมีค่าเฉพาะเมื่อเกิด<b>ถูกที่</b> (ที่แนวสำคัญ) ไม่ใช่ทุกที่</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>แยกกลุ่มก่อน: กลับตัว / ไปต่อ / สองทาง — ไม่งั้นอ่านสัญญาณกลับด้าน</p></div>
        </div>

        {/* L2 reversal */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>กลุ่มกลับตัว: Double Top &amp; Head and Shoulders</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_REVERSAL }} />
            <div className="figcap">ทั้งคู่บอก &quot;ผู้ซื้อหมดแรงดันขึ้นต่อ&quot; — ยืนยันเมื่อราคาหลุด neckline</div>
          </div>
          <div className="body-txt">
            <p><b>Double Top</b> คือราคาชนเพดานเดิมสองครั้งแล้วลง (รูป M) = แรงซื้อหมด ส่วน <b>Head &amp; Shoulders</b> มีสามยอด ยอดกลางสูงสุด = โมเมนตัมค่อย ๆ อ่อนลง ทั้งคู่<b>ยืนยันจริงเมื่อราคาหลุด &quot;neckline&quot;</b> ลงมา ไม่ใช่แค่เห็นรูป</p>
            <p>มีเวอร์ชันกลับหัวสำหรับก้นตลาด: Double Bottom (รูป W) และ Inverse Head &amp; Shoulders บอกการกลับตัวขึ้น</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เห็นรูปยังไม่พอ — รอราคาหลุด neckline ถึงนับว่ายืนยัน</p></div>
        </div>

        {/* L3 continuation */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>กลุ่มไปต่อ: Flag &amp; Triangle</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CONT }} />
            <div className="figcap">ราคาวิ่งแรงแล้วพักตัวในกรอบเล็ก ๆ ก่อนไปต่อทางเดิม</div>
          </div>
          <div className="body-txt">
            <p><b>Flag / Pennant</b> เกิดหลังราคาวิ่งแรง (เสาธง) แล้วพักตัวในกรอบเล็ก ๆ ก่อนไปต่อ · <b>Triangle</b> คือราคาบีบตัวแคบลงเรื่อย ๆ (แรงซื้อ-ขายสมดุลชั่วคราว) แล้วมัก break ไปทางเทรนด์เดิม</p>
            <p>จุดสำคัญ: กลุ่มนี้เทรด<b>ตามเทรนด์เดิม</b> — อย่าเดาว่าจะกลับตัว รอ break ออกจากกรอบไปทางที่เทรนด์พาไป</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>พักตัว = โอกาสเข้าตามเทรนด์เดิม รอ break ออกจากกรอบ</p></div>
        </div>

        {/* L4 how to trade */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>วิธีเทรดแพทเทิร์น: เข้าตรงไหน เป้าเท่าไหร่</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_MEASURED }} />
            <div className="figcap">Measured move: วัดความสูงของแพทเทิร์น แล้วฉายเป็นเป้า</div>
          </div>
          <div className="body-txt">
            <p>แพทเทิร์นส่วนใหญ่ให้ &quot;เป้าโดยประมาณ&quot; ด้วย <b>measured move</b> — วัดความสูงของแพทเทิร์น (H) แล้วฉายจากจุด break ออกไปเท่ากัน · ส่วน<b>จุดเข้า</b>ที่ดีคือ &quot;break แล้วย้อนกลับมาทดสอบ&quot; (retest) เพราะยืนยันว่าแนวเปลี่ยนมือจริง — เหมือน role reversal ในหมวด 2.2</p>
            <p><b>SL</b> วางอีกฝั่งของแพทเทิร์น (เช่น เหนือ neckline สำหรับ short) เสมอ — ไม่มีแพทเทิร์นไหนเทรดโดยไม่มี SL</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เข้าตอน break-retest · เป้า = ความสูงแพทเทิร์น · SL อีกฝั่งเสมอ</p></div>
        </div>

        {/* L5 success rate */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>★ อัตราสำเร็จ: ที่วัดได้ vs ที่เล่าต่อกันมา</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SUCCESS }} />
            <div className="figcap">&quot;แพทเทิร์นนี้แม่น 85%!&quot; — ตัวเลขเป๊ะแบบนั้นคือธงแดง ไม่ใช่หลักฐาน</div>
          </div>
          <div className="body-txt">
            <p>คุณจะเจอคนอ้าง &quot;Head &amp; Shoulders แม่น 83%&quot; ตลอด — ความจริงคืออัตราสำเร็จของแพทเทิร์น<b>ต่างกันมหาศาลตามแหล่งข้อมูล ตลาด timeframe และนิยามคำว่า &quot;สำเร็จ&quot;</b> งานที่วัดจริง (เช่นของ Bulkowski) จัดอันดับได้แต่ก็ย้ำว่าผลจริงขึ้นกับบริบทและการ execute</p>
            <p>จุดยืนของเรา: แพทเทิร์น<b>เอียงความน่าจะเป็นเล็กน้อยเมื่ออยู่ถูกที่</b> — ไม่ใช่การรับประกัน ใครโฆษณาตัวเลขเป๊ะ ๆ ให้ถือว่าเป็นการตลาด และคุณควรพิสูจน์ด้วยการทดสอบเอง (ซึ่งเราจะสอนในระดับ 7)</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>ปิดกล่องเครื่องมือด้วย <b><a href="/grade/extra-tools">3.3 เครื่องมือเสริม</a></b> — Fibonacci, Pivot, Divergence และแนวคิดสำคัญ &quot;confluence ที่ถูกต้อง — ไม่ใช่การใช้เครื่องมือซ้ำซ้อน&quot;</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>แพทเทิร์นเอียงโอกาสเล็กน้อยเมื่อถูกที่ — ไม่การันตี · ตัวเลขเป๊ะ = การตลาด</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 3 หมวด 3.2
      </div>
    </>
  );
}
