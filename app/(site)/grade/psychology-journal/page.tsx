import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 7 · จิตวิทยา วินัย และ Trading Journal · Cerfinits Grade",
  description:
    "Premium: loss aversion และเหตุผลที่สมองเทรดสวน expectancy, วงจร tilt, journal 3 ชั้นพร้อม template, ตาราง process vs outcome, เลือกสไตล์ให้เข้ากับชีวิต และ discipline loop",
  alternates: { canonical: "/grade/psychology-journal" },
};

const SVG_ASYM = `<svg viewBox="0 0 660 220" role="img" aria-label="ความเจ็บจากขาดทุนแรงกว่าความสุขจากกำไร">
  <line x1="330" y1="40" x2="330" y2="180" stroke="var(--hair-2)" stroke-width="1"/>
  <text class="t-sm t-up" x="180" y="36" text-anchor="middle">กำไร $1,000</text>
  <rect class="bar-up" x="130" y="90" width="100" height="40"/>
  <text class="t-xs t-up" x="180" y="150" text-anchor="middle">ความสุข ≈ 1 หน่วย</text>
  <text class="t-sm t-down" x="480" y="36" text-anchor="middle">ขาดทุน $1,000 (เท่ากัน)</text>
  <rect class="bar-down" x="430" y="70" width="100" height="80"/>
  <text class="t-xs t-down" x="480" y="170" text-anchor="middle">ความเจ็บ ≈ 2 หน่วย</text>
  <text class="t-xs" x="330" y="204" text-anchor="middle">สมองให้น้ำหนักการเสียหนักกว่าการได้ราว 2 เท่า (loss aversion — Kahneman &amp; Tversky)</text>
</svg>`;

const SVG_TILT = `<svg viewBox="0 0 660 240" role="img" aria-label="วงจร tilt และ circuit breaker">
  <rect class="chip-n" x="30" y="24" width="150" height="46" rx="3"/><text class="t-sm" x="105" y="52" text-anchor="middle">แพ้ 1 ไม้ (ปกติ)</text>
  <path d="M185,47 L215,47 M207,40 L219,47 L207,54" fill="none" stroke="var(--down)" stroke-width="1.5"/>
  <rect class="chip-n" x="223" y="24" width="180" height="46" rx="3"/><text class="t-sm" x="313" y="52" text-anchor="middle">&quot;ต้องทำกำไรคืนทันที&quot;</text>
  <path d="M408,47 L438,47 M430,40 L442,47 L430,54" fill="none" stroke="var(--down)" stroke-width="1.5"/>
  <rect class="chip-bad" x="446" y="24" width="184" height="46" rx="3"/><text class="t-sm t-down" x="538" y="52" text-anchor="middle">ไม้ใหญ่ขึ้น นอกระบบ</text>
  <path d="M538,74 L538,100 M531,90 L538,102 L545,90" fill="none" stroke="var(--down)" stroke-width="1.5"/>
  <rect class="chip-bad" x="446" y="106" width="184" height="46" rx="3"/><text class="t-sm t-down" x="538" y="134" text-anchor="middle">แพ้หนักกว่าเดิม</text>
  <path d="M441,129 L330,129 M342,122 L328,129 L342,136" fill="none" stroke="var(--down)" stroke-width="1.5"/>
  <rect class="chip-bad" x="140" y="106" width="185" height="46" rx="3"/><text class="t-sm t-down" x="232" y="134" text-anchor="middle">อารมณ์คุมเต็มตัว (tilt)</text>
  <line x1="60" y1="186 " x2="620" y2="186" stroke="var(--gold)" stroke-width="2.5"/>
  <text class="t-sm t-gold" x="330" y="212" text-anchor="middle">Circuit breaker (4.3): แพ้ 2 ไม้ติด = ปิดจอ — ตัดวงจรตั้งแต่ลูกศรแรก</text>
</svg>`;

const SVG_JOURNAL = `<svg viewBox="0 0 660 250" role="img" aria-label="journal สามชั้น">
  <rect class="chip-n" x="40" y="20" width="580" height="62" rx="3"/>
  <text class="t-md" x="64" y="46" text-anchor="start">① ก่อนเทรด — แผน</text>
  <text class="t-xs" x="64" y="68" text-anchor="start">setup อะไร · อ้างอิงอะไร (ทิศ/โซน/trigger) · เข้า-SL-TP · R คาด · เสี่ยงกี่ %</text>
  <path d="M330,86 L330,100 M323,92 L330,102 L337,92" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="40" y="106" width="580" height="62" rx="3"/>
  <text class="t-md" x="64" y="132" text-anchor="start">② หลังเทรด — ผล + วินัย</text>
  <text class="t-xs" x="64" y="154" text-anchor="start">ผลเป็น R · ทำตามแผนไหม (ใช่/ไม่) · ถ้าไม่ตาม — เพราะอะไร · อารมณ์ตอนถือไม้</text>
  <path d="M330,172 L330,186 M323,178 L330,188 L337,178" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-gold" x="40" y="192" width="580" height="52" rx="3" stroke-width="2"/>
  <text class="t-md t-gold" x="64" y="214" text-anchor="start">③ รายสัปดาห์ — สถิติ</text>
  <text class="t-xs" x="64" y="234" text-anchor="start">expectancy จริง · % ทำตามแผน · แพทเทิร์นความผิดพลาดซ้ำ · เทียบ kill criteria</text>
</svg>`;

const SVG_QUAD = `<svg viewBox="0 0 660 260" role="img" aria-label="ตาราง process กับ outcome">
  <text class="t-sm" x="380" y="22" text-anchor="middle">ผลลัพธ์ →</text>
  <text class="t-xs t-up" x="250" y="44" text-anchor="middle">ชนะ</text>
  <text class="t-xs t-down" x="510" y="44" text-anchor="middle">แพ้</text>
  <text class="t-xs" x="60" y="110" text-anchor="middle">ทำตาม</text>
  <text class="t-xs" x="60" y="126" text-anchor="middle">แผน ✓</text>
  <text class="t-xs" x="60" y="200" text-anchor="middle">นอก</text>
  <text class="t-xs" x="60" y="216" text-anchor="middle">แผน ✕</text>
  <rect class="chip-ok" x="120" y="56" width="260" height="90" rx="3"/>
  <text class="t-sm t-up" x="250" y="94" text-anchor="middle">เทรดที่ดี + ชนะ</text>
  <text class="t-xs" x="250" y="118" text-anchor="middle">ทำซ้ำ — นี่คือธุรกิจ</text>
  <rect class="chip-ok" x="390" y="56" width="240" height="90" rx="3"/>
  <text class="t-sm t-up" x="510" y="94" text-anchor="middle">เทรดที่ดี + แพ้</text>
  <text class="t-xs" x="510" y="118" text-anchor="middle">ต้นทุนธุรกิจ — ยอมรับ ไม่แก้กฎ</text>
  <rect class="chip-bad" x="120" y="152" width="260" height="90" rx="3" stroke-width="2.5"/>
  <text class="t-sm t-down" x="250" y="186" text-anchor="middle">นอกแผน + ชนะ ⚠</text>
  <text class="t-xs t-down" x="250" y="210" text-anchor="middle">อันตรายที่สุด — เสริมแรงพฤติกรรมที่ผิด</text>
  <rect class="chip-bad" x="390" y="152" width="240" height="90" rx="3"/>
  <text class="t-sm t-down" x="510" y="186" text-anchor="middle">นอกแผน + แพ้</text>
  <text class="t-xs" x="510" y="210" text-anchor="middle">บทเรียนต้นทุนต่ำ — บันทึกแล้วเลิกทำ</text>
</svg>`;

const SVG_STYLES = `<svg viewBox="0 0 660 240" role="img" aria-label="สไตล์เทรดกับเวลาที่ต้องใช้">
  <text class="t-sm" x="8" y="22">เวลาหน้าจอที่ต้องใช้ต่อวัน</text>
  <text class="t-md" x="8" y="62">Scalp</text>
  <rect class="bar-down" x="120" y="46" width="440" height="22"/>
  <text class="t-xs t-down" x="570" y="62">ทั้งวัน + เร็วมาก</text>
  <text class="t-md" x="8" y="106">Day</text>
  <rect class="bar-n" x="120" y="90" width="260" height="22"/>
  <text class="t-xs" x="390" y="106">หลายชั่วโมง/วัน</text>
  <text class="t-md" x="8" y="150">Swing</text>
  <rect class="bar-gold" x="120" y="134" width="110" height="22"/>
  <text class="t-xs t-gold" x="240" y="150">~30–60 นาที/วัน ← คนมีงานประจำ</text>
  <text class="t-md" x="8" y="194">Position</text>
  <rect class="bar-up" x="120" y="178" width="60" height="22"/>
  <text class="t-xs t-up" x="190" y="194">ชั่วโมง/สัปดาห์</text>
  <text class="t-xs" x="330" y="226" text-anchor="middle">TF เล็กลง = เวลา+ความเร็ว+ต้นทุนรวมสูงขึ้น — สไตล์ต้องเลือกจากชีวิตจริง ไม่ใช่จากความตื่นเต้น</text>
</svg>`;

const SVG_LOOP = `<svg viewBox="0 0 660 230" role="img" aria-label="discipline loop รายวันรายสัปดาห์">
  <rect class="chip-n" x="40" y="30" width="170" height="52" rx="3"/><text class="t-sm" x="125" y="52" text-anchor="middle">Routine เช้า</text><text class="t-xs" x="125" y="70" text-anchor="middle">15 นาที (5.3) + ข่าว (6.1)</text>
  <path d="M215,56 L245,56 M237,49 L249,56 L237,63" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="253" y="30" width="170" height="52" rx="3"/><text class="t-sm" x="338" y="52" text-anchor="middle">เทรดตามระบบ</text><text class="t-xs" x="338" y="70" text-anchor="middle">journal ชั้น ① ก่อนกดเสมอ</text>
  <path d="M428,56 L458,56 M450,49 L462,56 L450,63" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="466" y="30" width="164" height="52" rx="3"/><text class="t-sm" x="548" y="52" text-anchor="middle">ปิดไม้ → ชั้น ②</text><text class="t-xs" x="548" y="70" text-anchor="middle">ผล + ทำตามแผนไหม</text>
  <path d="M548,86 L548,116 M541,106 L548,118 L555,106" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-gold" x="466" y="122" width="164" height="52" rx="3" stroke-width="2"/><text class="t-sm t-gold" x="548" y="144" text-anchor="middle">ศุกร์: ชั้น ③</text><text class="t-xs" x="548" y="162" text-anchor="middle">สถิติ + เทียบ kill criteria</text>
  <path d="M461,148 L290,148 M302,141 L288,148 L302,155" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="110" y="122" width="175" height="52" rx="3"/><text class="t-sm" x="197" y="144" text-anchor="middle">ปรับ (ถ้ามีหลักฐาน)</text><text class="t-xs" x="197" y="162" text-anchor="middle">แล้ววนกลับวันจันทร์</text>
  <text class="t-xs" x="330" y="210" text-anchor="middle">วินัยไม่ใช่ความพยายามรายวัน — มันคือ loop ที่ออกแบบให้ทำผิดยาก</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 7 · หมวด 7.2 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">จิตวิทยา วินัย และ Trading Journal</span>
        <h1>ตัวแปรสุดท้ายของระบบ: ตัวคุณเอง</h1>
        <p className="lead">
          หมวด 7.1 ว่าด้วยตัวระบบ — หมวดนี้ว่าด้วย<b>ผู้ใช้ระบบ</b> ระบบที่มี expectancy เป็นบวกล้มเหลวได้
          จากการตัดสินใจของผู้ใช้เอง และไม่ใช่เพราะคุณอ่อนแอ: สมองมนุษย์มีแนวโน้มตัดสินใจผิดทางในเรื่องความเสี่ยงโดยธรรมชาติ
          ทางแก้ไม่ใช่ &quot;พยายามมากขึ้น&quot; แต่คือ<b>ระบบบันทึกและสภาพแวดล้อมที่ทำผิดได้ยาก</b>
        </p>
      </div>

      <div className="wrap">
        {/* L1 loss aversion */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>★ ทำไมรู้ทั้งรู้แต่ทำไม่ได้ — สมองใต้ความเสี่ยง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_ASYM }} />
            <div className="figcap">เงินเท่ากัน แต่สมองรู้สึกไม่เท่ากัน — ความไม่สมมาตรนี้คือรากของพฤติกรรมการเทรดที่ผิดพลาดเกือบทั้งหมด</div>
          </div>
          <div className="body-txt">
            <p>งานวิจัยพฤติกรรมศาสตร์ (Kahneman &amp; Tversky — prospect theory) พบข้อเท็จจริงที่อธิบายพฤติกรรมการเทรดที่ผิดพลาดได้เกือบทั้งหมด: <b>ความเจ็บจากการเสียเงินหนักกว่าความสุขจากการได้เงินจำนวนเท่ากัน ราว 2 เท่า</b> (loss aversion) — เป็นกลไกตามธรรมชาติของสมองมนุษย์ทุกคน รวมถึงคุณ</p>
            <p>ผลที่ตามมาตรงข้ามกับสิ่งที่ expectancy ต้องการเป๊ะ: เพราะเกลียดการ &quot;ยืนยันว่าขาดทุน&quot; เราจึง<b>ถือไม้แพ้ไว้นาน</b> (เผื่อมันกลับ — จะได้ไม่ต้องเจ็บ) และเพราะกลัวกำไรที่เห็นอยู่หายไป เราจึง<b>รีบปิดไม้ชนะเร็ว</b> — สรุป: ไม้แพ้ใหญ่ ไม้ชนะเล็ก = ระบบ A จากหมวด 4.1 ที่ชนะบ่อยแต่ขาดทุน ทั้งที่ในบทเรียนคุณเห็นแล้วว่าไม่ถูกต้อง</p>
            <p>ข้อสรุปที่สำคัญ: นี่ไม่ใช่ปัญหาความรู้ (คุณรู้แล้ว) และไม่ใช่ปัญหานิสัย (มันคือ default ของสมองทุกคน) — มันแก้ได้ทางเดียว: <b>ย้ายการตัดสินใจออกจากช่วงเวลาที่อารมณ์ทำงาน</b> — SL/TP ตั้งไว้ก่อนเข้า (ตัดสินใจขณะอารมณ์ปกติ), ขนาดไม้มาจากสูตร, และ journal ที่บังคับให้เขียนแผนก่อนกด — นั่นคือเหตุผลที่หมวดนี้จบที่ระบบบันทึก ไม่ใช่คำคมปลุกใจ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>สมองเจ็บจากการเสีย ~2 เท่าของการได้ → ถือแพ้นาน/ปิดชนะเร็วโดยธรรมชาติ — แก้ด้วยการตัดสินใจล่วงหน้า ไม่ใช่ willpower</p></div>
        </div>

        {/* L2 tilt */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>วงจร Tilt: สามพฤติกรรมอันตรายทำงานร่วมกันอย่างไร</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_TILT }} />
            <div className="figcap">Tilt ไม่ได้เกิดทันที — มันคือบันไดที่ไล่ลงทีละขั้น และตัดได้ที่ขั้นแรกเท่านั้น</div>
          </div>
          <div className="body-txt">
            <p>สามพฤติกรรมอันตรายจากหมวดจิตวิทยาที่คุณอาจเคยอ่าน (<a href="/blog/trading-psychology-discipline">blog เรามีสรุป</a>) — <b>revenge trading, FOMO, overtrading</b> — ไม่ได้มาแยกกัน มันคือขั้นบันไดของวงจรเดียว: แพ้ 1 ไม้ (ปกติมาก ระบบ 42% win rate แพ้บ่อยกว่าชนะ) → เกิดความรู้สึกว่าต้องทำกำไรคืนทันที → เปิดไม้ใหม่ทันทีโดยไม่มี setup, ใหญ่กว่าเดิม → แพ้หนักขึ้น → ตอนนี้อารมณ์คุมเต็มตัว (tilt) — หนึ่งชั่วโมงของ tilt ลบผลงานทั้งเดือนได้</p>
            <p>จุดสำคัญที่คนพลาด: <b>วงจรนี้ตัดได้ที่ลูกศรแรกเท่านั้น</b> — พอถึงขั้น &quot;ไม้ใหญ่นอกระบบ&quot; เหตุผลจะเข้าไม่ถึงคุณแล้ว นี่คือหน้าที่ของ circuit breaker จาก 4.3 (แพ้ 2 ไม้ติด = ปิดจอ): มันไม่ได้ถูกออกแบบมาเพื่อป้องกันเงินเท่านั้น แต่เพื่อ<b>ป้องกันการตัดสินใจในภาวะที่ขาดการควบคุม</b> — และต้องเป็นกฎอัตโนมัติ เพราะในภาวะ tilt การประเมินสภาพของตนเองย่อมเชื่อถือไม่ได้อีกต่อไป</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Tilt คือบันไดไล่ลง ตัดได้แค่ขั้นแรก — circuit breaker ต้องอัตโนมัติ เพราะตอน tilt คุณตัดสินใจเองไม่ได้แล้ว</p></div>
        </div>

        {/* L3 journal */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>★ Trading Journal 3 ชั้น — เครื่องมือที่ ROI สูงสุดในการเทรด</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_JOURNAL }} />
            <div className="figcap">ชั้น ① คือหัวใจ: บันทึก &quot;ก่อน&quot; เข้าออเดอร์ — แผนที่บันทึกภายหลังย่อมถูกความจำบิดเบือน</div>
          </div>
          <div className="body-txt">
            <p>ถ้าต้องเลือกเครื่องมือเดียวจากทั้งหลักสูตร เราเลือก journal — เพราะมันคือ<b>แหล่งข้อมูล</b>ที่ทำให้ทุกอย่างในระดับ 7.1 เป็นไปได้ (จะรู้ expectancy จริง / เทียบ kill criteria ได้ยังไง ถ้าไม่มีบันทึก?) โครงสร้าง 3 ชั้น:</p>
            <div className="calc c2">
              <div className="crow head"><span>ชั้น · เมื่อไหร่</span><span className="v">ฟิลด์บังคับ</span></div>
              <div className="crow hl"><span className="k">① ก่อนกดออเดอร์ (สำคัญสุด)</span><span className="v">setup อะไร · อ้างอิง (ทิศ/โซน/trigger) · เข้า-SL-TP · R คาด · %เสี่ยง</span></div>
              <div className="crow"><span className="k">② หลังปิดไม้</span><span className="v">ผลเป็น R · ทำตามแผน? (ใช่/ไม่+เหตุผล) · อารมณ์ระหว่างถือ</span></div>
              <div className="crow"><span className="k">③ ศุกร์เย็น รายสัปดาห์</span><span className="v">expectancy จริง · %ทำตามแผน · ความผิดพลาดซ้ำ · เทียบ kill criteria</span></div>
            </div>
            <p>ทำไมชั้น ① ต้องเขียน<b>ก่อน</b>กด: (1) มันบังคับให้ไม้ทุกไม้ผ่านการคิดเป็นลายลักษณ์ (คำสั่งที่มาจากอารมณ์ส่วนใหญ่ถูกคัดออกในขั้นนี้ — เมื่อต้องเขียนว่า &quot;อ้างอิงอะไร&quot; แล้วเขียนไม่ได้ ก็รู้ตัว) (2) ทำให้ field &quot;ทำตามแผนไหม&quot; ในชั้น ② มีความหมาย — ถ้าไม่มีแผนเขียนไว้ก่อน คำว่าทำตามแผนคือการหลอกตัวเอง · รูปแบบไม่สำคัญ (สมุด, Excel, Notion) — <b>ความครบทุกไม้สำคัญกว่าเครื่องมือ</b></p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Journal 3 ชั้น: แผนก่อนกด / ผล+วินัยหลังปิด / สถิติทุกศุกร์ — ชั้นแรกคัดคำสั่งที่มาจากอารมณ์ออกก่อนเกิดขึ้นจริง</p></div>
        </div>

        {/* L4 process vs outcome */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>★ Process vs Outcome — ช่องที่อันตรายที่สุดคือช่องที่คุณชนะ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_QUAD }} />
            <div className="figcap">ให้คะแนนไม้จาก &quot;กระบวนการ&quot; ไม่ใช่ &quot;ผลลัพธ์&quot; — สองแกนนี้คนละเรื่องกันโดยสิ้นเชิง</div>
          </div>
          <div className="body-txt">
            <p>ไม้เทรดหนึ่งไม้ถูกตัดสินได้สองแกน: <b>ทำตามแผนไหม (process)</b> กับ <b>ชนะหรือแพ้ (outcome)</b> — สี่ช่องที่ได้มีความหมายต่างกันมาก: &quot;เทรดดี+ชนะ&quot; = ธุรกิจปกติ ทำซ้ำ · &quot;เทรดดี+แพ้&quot; = <b>ต้นทุนธุรกิจ</b> ระบบ 42% แพ้บ่อยกว่าชนะโดยออกแบบ — ห้ามแก้กฎเพราะไม้เดียว · &quot;นอกแผน+แพ้&quot; = บทเรียนต้นทุนต่ำ บันทึกแล้วเลิกทำ</p>
            <p>แต่ช่องที่สร้างความเสียหายมากที่สุดคือ <b>&quot;นอกแผน+ชนะ&quot;</b> — เพราะมันคือ<b>การเสริมแรงพฤติกรรมที่ผิด</b>: สมองเรียนรู้ว่าไม่ทำตามแผนก็ได้เงิน ครั้งต่อไปจึงทำซ้ำและใหญ่ขึ้น จนถึงวันที่ความเสียหายสะสมแสดงผลพร้อมกันทั้งหมด กำไรจากไม้นอกแผนจึงไม่ใช่กำไรที่แท้จริง — มันคือ<b>ความเสียหายในอนาคตที่ยังไม่แสดงผล</b></p>
            <p>วิธีใช้จริงใน journal: ให้คะแนนทุกไม้ที่ช่อง ไม่ใช่ที่เงิน — เป้ารายสัปดาห์ของมือใหม่ควรเป็น <b>&quot;% ทำตามแผน ≥ 90%&quot;</b> ไม่ใช่ &quot;กำไรกี่บาท&quot; เพราะ 3 เดือนแรกของคุณ (จำ Reality Check ได้ไหม) เป้าคือสร้างกระบวนการที่เชื่อถือได้ ไม่ใช่เร่งผลกำไร</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>&quot;เทรดนอกแผนแล้วชนะ&quot; อันตรายกว่า &quot;เทรดตามแผนแล้วแพ้&quot; เสมอ — วัดตัวเองที่ %ทำตามแผน ไม่ใช่กำไร</p></div>
        </div>

        {/* L5 styles */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>เลือกสไตล์ให้เข้ากับชีวิต — ไม่ใช่ความตื่นเต้น</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_STYLES }} />
            <div className="figcap">สไตล์กำหนดเวลา ความเร็วการตัดสินใจ และต้นทุนรวม — เลือกไม่ตรงกับชีวิต = รักษาวินัยไม่ได้ตั้งแต่ต้น</div>
          </div>
          <div className="body-txt">
            <p>สไตล์เทรดต่างกันที่ &quot;อายุของไม้&quot;: <b>Scalp</b> (นาที — ต้องเร็ว จ่าย spread ถี่สุด เฝ้าจอทั้งวัน), <b>Day</b> (จบในวัน — หลายชั่วโมง/วัน), <b>Swing</b> (วัน–สัปดาห์ — ดูวันละ 30–60 นาที), <b>Position</b> (สัปดาห์–เดือน) — ยิ่งสั้น ยิ่งกินเวลา+จิตใจ+ต้นทุนรวม (จำ 1.2: ต้นทุน × จำนวนไม้)</p>
            <p>สำหรับคนไทยมีงานประจำ คำตอบเชิงโครงสร้างชัดมาก: <b>swing บนชุด D1/H4/H1</b> (routine เช้า + จัดการหัวค่ำ) หรือ <b>intraday เฉพาะหัวค่ำ</b> (H4/H1/M15 ช่วง London–NY overlap 19:00–23:00) — สิ่งที่ห้ามทำคือ scalp ตอนดึกหลังทำงานมา 9 ชั่วโมง: การตัดสินใจเร็วบนความเหนื่อยล้าคือเงื่อนไขที่นำไปสู่ tilt ได้ง่ายที่สุด</p>
            <p>และกฎเดิมจาก 5.3: เลือกแล้ว<b>คงที่อย่างน้อยจนครบ 50–100 ไม้</b> — สลับสไตล์ทุกสองสัปดาห์ = ไม่มีวันมีสถิติเพียงพอที่จะรู้ว่าวิธีใดได้ผล</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เลือกสไตล์จากตารางชีวิต ไม่ใช่ความตื่นเต้น — คนทำงาน: swing หรือ intraday หัวค่ำ · เลือกแล้วอยู่ให้ครบ 100 ไม้</p></div>
        </div>

        {/* L6 loop */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>Playbook ปิดระดับ 7: Discipline Loop</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_LOOP }} />
            <div className="figcap">วินัยที่ยั่งยืน = loop ที่ออกแบบไว้ล่วงหน้า ไม่ใช่ความตั้งใจรายวัน</div>
          </div>
          <div className="body-txt">
            <p>ประกอบทุกอย่างเป็น loop เดียวที่หมุนทุกสัปดาห์: <b>เช้า</b> — routine 15 นาที (5.3) + เช็คปฏิทินข่าว (6.1) · <b>ระหว่างวัน/หัวค่ำ</b> — เทรดเฉพาะ setup ตามระบบ, journal ชั้น ① ก่อนกดทุกไม้, circuit breaker คุมอยู่ · <b>ปิดไม้</b> — ชั้น ② ทันที · <b>ศุกร์เย็น</b> — ชั้น ③: expectancy จริง, % ทำตามแผน, เทียบ kill criteria (7.1) · <b>ปรับ</b> — เฉพาะเมื่อมีหลักฐานพอ (ไม่ใช่เพราะสัปดาห์เดียวแย่) แล้ววนใหม่</p>
            <p>สังเกตว่าใน loop นี้<b>ไม่มีขั้นไหนพึ่ง &quot;ความรู้สึกอยากมีวินัย&quot;</b> — ทุกจุดตัดสินใจถูกย้ายไปอยู่ในเอกสารที่จัดทำไว้ล่วงหน้าขณะอารมณ์ปกติ: ระบบ (7.1), กฎความเสี่ยง (4.3), journal template (7.2) คุณเพียงปฏิบัติตามโครงสร้างที่ตัวเองสร้าง — และนั่นคือความหมายที่แท้จริงของคำว่า &quot;วินัย&quot; ในการเทรด</p>
          </div>
          <div className="bridge">
            <span className="bi">✓</span>
            <div>
              <span className="bl">จบระดับ 7 — หัวใจของหลักสูตรครบแล้ว</span>
              <p>คุณมีระบบที่ทดสอบได้ + เครื่องมือคุมตัวเองครบ — เหลือด่านสุดท้าย: <b>ระดับ 8 โลกจริงหลังห้องเรียน</b> (กำลังจัดทำ): prop firms, ภาษี/กฎหมายไทย, กลโกง และ 90 วันแรกของการเทรดจริง กลับไปดู <b><a href="/grade">แผนที่หลักสูตร</a></b></p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>วินัย = โครงสร้างที่ออกแบบไว้ล่วงหน้าขณะอารมณ์ปกติ และปฏิบัติตามภายใต้แรงกดดัน — ไม่มีส่วนใดของ loop ที่พึ่งกำลังใจ</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 7 หมวด 7.2 (Premium)
      </div>
    </>
  );
}
