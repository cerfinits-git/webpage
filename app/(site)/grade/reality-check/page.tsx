import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 1 · Reality Check — 5 ภาพก่อนเสียเงินบาทแรก · Cerfinits Grade",
  description:
    "ความจริงที่วัดได้ก่อนเริ่มเทรด: 8 ใน 10 ขาดทุน, เหตุใดผู้เทรดส่วนใหญ่จึงขาดทุน, รวยเร็วคือคำโกหก, เงินที่เทรดได้, และแผนที่ 8 ระดับ — เล่าเป็นภาพ บนหลักฐาน",
  alternates: { canonical: "/grade/reality-check" },
};

const SVG_PEOPLE = `<svg viewBox="0 0 660 250" role="img" aria-label="ภาพคน 10 คน 8 คนขาดทุน 2 คนรอด">
  <g class="p-lose"><g transform="translate(70,60)"><circle cx="0" cy="-18" r="12"/><path d="M-17,22 C-17,3 -10,-3 0,-3 C10,-3 17,3 17,22 Z"/></g></g>
  <g class="p-lose"><g transform="translate(195,60)"><circle cx="0" cy="-18" r="12"/><path d="M-17,22 C-17,3 -10,-3 0,-3 C10,-3 17,3 17,22 Z"/></g></g>
  <g class="p-lose"><g transform="translate(320,60)"><circle cx="0" cy="-18" r="12"/><path d="M-17,22 C-17,3 -10,-3 0,-3 C10,-3 17,3 17,22 Z"/></g></g>
  <g class="p-lose"><g transform="translate(445,60)"><circle cx="0" cy="-18" r="12"/><path d="M-17,22 C-17,3 -10,-3 0,-3 C10,-3 17,3 17,22 Z"/></g></g>
  <g class="p-lose"><g transform="translate(570,60)"><circle cx="0" cy="-18" r="12"/><path d="M-17,22 C-17,3 -10,-3 0,-3 C10,-3 17,3 17,22 Z"/></g></g>
  <g class="p-lose"><g transform="translate(70,160)"><circle cx="0" cy="-18" r="12"/><path d="M-17,22 C-17,3 -10,-3 0,-3 C10,-3 17,3 17,22 Z"/></g></g>
  <g class="p-lose"><g transform="translate(195,160)"><circle cx="0" cy="-18" r="12"/><path d="M-17,22 C-17,3 -10,-3 0,-3 C10,-3 17,3 17,22 Z"/></g></g>
  <g class="p-lose"><g transform="translate(320,160)"><circle cx="0" cy="-18" r="12"/><path d="M-17,22 C-17,3 -10,-3 0,-3 C10,-3 17,3 17,22 Z"/></g></g>
  <g class="p-win"><g transform="translate(445,160)"><circle cx="0" cy="-18" r="12"/><path d="M-17,22 C-17,3 -10,-3 0,-3 C10,-3 17,3 17,22 Z"/></g></g>
  <g class="p-win"><g transform="translate(570,160)"><circle cx="0" cy="-18" r="12"/><path d="M-17,22 C-17,3 -10,-3 0,-3 C10,-3 17,3 17,22 Z"/></g></g>
  <text class="t-sm t-down" x="70" y="212" text-anchor="middle">ขาดทุน ✕8</text>
  <text class="t-sm t-up" x="507" y="212" text-anchor="middle">รอด ✓2</text>
  <line x1="390" y1="30" x2="390" y2="190" stroke="var(--hair-2)" stroke-width="1.5" stroke-dasharray="4 4"/>
</svg>`;

const SVG_MULT = `<svg viewBox="0 0 660 260" role="img" aria-label="สมการ Leverage คูณ Edge คูณ วินัย">
  <text class="t-sm" x="0" y="30">มีครบ 3 →</text>
  <rect class="chip-ok" x="70" y="15" width="120" height="52" rx="4"/><text class="t-md" x="130" y="46" text-anchor="middle">Leverage ✓</text>
  <text class="t-op" x="205" y="48" text-anchor="middle" style="font-size:23px;font-weight:800;fill:var(--muted)">×</text>
  <rect class="chip-ok" x="220" y="15" width="110" height="52" rx="4"/><text class="t-md" x="275" y="46" text-anchor="middle">Edge ✓</text>
  <text x="345" y="48" text-anchor="middle" style="font-size:23px;font-weight:800;fill:var(--muted)">×</text>
  <rect class="chip-ok" x="360" y="15" width="110" height="52" rx="4"/><text class="t-md" x="415" y="46" text-anchor="middle">วินัย ✓</text>
  <text x="485" y="48" text-anchor="middle" style="font-size:23px;font-weight:800;fill:var(--muted)">=</text>
  <rect class="chip-ok" x="510" y="15" width="140" height="52" rx="4"/><text class="t-md t-up" x="580" y="46" text-anchor="middle">อยู่รอด</text>
  <line x1="0" y1="105" x2="660" y2="105" stroke="var(--hair)" stroke-width="1"/>
  <text class="t-sm" x="0" y="160">ขาดตัวเดียว →</text>
  <rect class="chip-ok" x="70" y="145" width="120" height="52" rx="4"/><text class="t-md" x="130" y="176" text-anchor="middle">Leverage ✓</text>
  <text x="205" y="178" text-anchor="middle" style="font-size:23px;font-weight:800;fill:var(--muted)">×</text>
  <rect class="chip-bad" x="220" y="145" width="110" height="52" rx="4"/><text class="t-md t-down" x="275" y="170" text-anchor="middle">Edge ✕</text><text class="t-sm t-down" x="275" y="188" text-anchor="middle">= 0</text>
  <text x="345" y="178" text-anchor="middle" style="font-size:23px;font-weight:800;fill:var(--muted)">×</text>
  <rect class="chip-ok" x="360" y="145" width="110" height="52" rx="4"/><text class="t-md" x="415" y="176" text-anchor="middle">วินัย ✓</text>
  <text x="485" y="178" text-anchor="middle" style="font-size:23px;font-weight:800;fill:var(--muted)">=</text>
  <rect class="chip-bad" x="510" y="145" width="140" height="52" rx="4"/><text class="t-md t-down" x="580" y="176" text-anchor="middle">พอร์ต = 0</text>
  <text class="t-sm" x="330" y="238" text-anchor="middle">เป็นการ “คูณ” ไม่ใช่ “บวก” — พังจุดเดียว พังทั้งสมการ</text>
</svg>`;

const SVG_ICEBERG = `<svg viewBox="0 0 660 300" role="img" aria-label="ภูเขาน้ำแข็ง พอร์ตที่อวดกับพอร์ตที่แตก">
  <rect x="0" y="118" width="660" height="182" fill="var(--paper-2)"/>
  <line x1="0" y1="118" x2="660" y2="118" stroke="var(--hair-2)" stroke-width="1.5" stroke-dasharray="6 5"/>
  <path d="M255,118 L215,210 L285,278 L430,272 L520,205 L470,118 Z" fill="var(--hair-2)" opacity="0.5" stroke="var(--hair-2)" stroke-width="1"/>
  <text class="t-sm" x="365" y="200" text-anchor="middle">พอร์ตที่แตก</text>
  <text class="t-sm" x="365" y="220" text-anchor="middle">— ไม่มีใครโพสต์</text>
  <text class="t-lab t-down" x="365" y="252" text-anchor="middle">~98%</text>
  <path d="M300,118 L360,52 L420,118 Z" fill="var(--gold-tint)" stroke="var(--gold)" stroke-width="1.5"/>
  <text class="t-md t-gold" x="360" y="100" text-anchor="middle">อวด</text>
  <text class="t-sm" x="360" y="40" text-anchor="middle">พอร์ตที่คุณเห็นใน feed · ~2%</text>
</svg>`;

const SVG_FOUNDATION = `<svg viewBox="0 0 660 300" role="img" aria-label="ลำดับการเงิน กองทุนฉุกเฉิน เคลียร์หนี้ แล้วค่อยเทรด">
  <rect class="bar-up" x="70" y="220" width="520" height="56" rx="3"/>
  <text class="t-lab" x="330" y="248" text-anchor="middle">① กองทุนฉุกเฉิน 3–6 เดือน</text>
  <text class="t-sm t-up" x="330" y="266" text-anchor="middle">มีก่อน — ฐานที่ต้องแข็ง</text>
  <rect class="chip-n" x="140" y="150" width="380" height="56" rx="3"/>
  <text class="t-lab" x="330" y="178" text-anchor="middle">② เคลียร์หนี้ดอกเบี้ยสูง</text>
  <text class="t-sm" x="330" y="196" text-anchor="middle">ปิดหนี้ 20% = ผลตอบแทนชัวร์ 20%</text>
  <rect class="bar-gold" x="225" y="86" width="210" height="50" rx="3"/>
  <text class="t-md t-gold" x="330" y="108" text-anchor="middle">③ เงินที่เทรดได้</text>
  <text class="t-sm" x="330" y="125" text-anchor="middle">risk capital · ส่วนเล็ก ๆ</text>
  <line x1="620" y1="248" x2="620" y2="100" stroke="var(--gold)" stroke-width="2"/>
  <path d="M620,88 L614,102 L626,102 Z" fill="var(--gold)"/>
  <text class="t-sm t-gold" x="612" y="70" text-anchor="middle">ลำดับ</text>
</svg>`;

const SVG_LADDER = `<svg viewBox="0 0 660 300" role="img" aria-label="บันได 8 ระดับ ระดับ 1 ถึง 8 ฟรีและพรีเมียม">
  <rect class="bar-up" x="18" y="232" width="66" height="46" rx="3"/><text class="t-md" x="51" y="260" text-anchor="middle">1</text>
  <rect class="bar-up" x="96" y="210" width="66" height="68" rx="3"/><text class="t-md" x="129" y="238" text-anchor="middle">2</text>
  <rect class="bar-up" x="174" y="188" width="66" height="90" rx="3"/><text class="t-md" x="207" y="216" text-anchor="middle">3</text>
  <rect class="bar-gold" x="252" y="150" width="66" height="128" rx="3" stroke-width="2.5"/>
  <text class="t-md t-gold" x="285" y="176" text-anchor="middle">★ 4</text><text class="t-sm t-gold" x="285" y="194" text-anchor="middle">Risk</text><text class="t-sm t-gold" x="285" y="210" text-anchor="middle">ให้ฟรี</text>
  <rect class="chip-n" x="342" y="144" width="66" height="134" rx="3"/><text class="t-md" x="375" y="172" text-anchor="middle">5</text>
  <rect class="chip-n" x="420" y="122" width="66" height="156" rx="3"/><text class="t-md" x="453" y="150" text-anchor="middle">6</text>
  <rect class="chip-n" x="498" y="100" width="66" height="178" rx="3"/><text class="t-md" x="531" y="128" text-anchor="middle">7</text>
  <rect class="chip-n" x="576" y="78" width="66" height="200" rx="3"/><text class="t-md" x="609" y="106" text-anchor="middle">8</text>
  <text class="t-sm t-up" x="130" y="40" text-anchor="middle">ระดับ 1–4 · ฟรี</text>
  <text class="t-sm t-gold" x="500" y="40" text-anchor="middle">ระดับ 5–8 · Premium</text>
  <line x1="330" y1="50" x2="330" y2="278" stroke="var(--hair-2)" stroke-width="1.5" stroke-dasharray="5 5"/>
</svg>`;

const SVG_CONTRAST = `<svg viewBox="0 0 660 150" role="img" aria-label="เปรียบเทียบ คอร์สทั่วไปสอน risk ช้า Cerfinits สอนเร็ว">
  <text class="t-sm" x="0" y="46">คอร์สทั่วไป</text>
  <line x1="150" y1="42" x2="640" y2="42" stroke="var(--hair-2)" stroke-width="2"/>
  <circle cx="600" cy="42" r="10" fill="var(--down)"/><text class="t-white" x="600" y="46" text-anchor="middle" style="font-size:11px;font-weight:700">R</text>
  <text class="t-sm t-down" x="600" y="22" text-anchor="middle">Risk มาที่ 10/11</text>
  <text class="t-sm" x="0" y="112">Cerfinits</text>
  <line x1="150" y1="108" x2="640" y2="108" stroke="var(--hair-2)" stroke-width="2"/>
  <circle cx="330" cy="108" r="10" fill="var(--up)"/><text class="t-white" x="330" y="112" text-anchor="middle" style="font-size:11px;font-weight:700">R</text>
  <text class="t-sm t-up" x="330" y="132" text-anchor="middle">Risk มาที่ 4/8</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 1 · หมวด 1.5</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Reality Check — ความจริงก่อนเริ่ม</span>
        <h1>5 ภาพที่ต้องเห็น ก่อนเสียเงินบาทแรก</h1>
        <span className="sig">★ หมวดลายเซ็นของหลักสูตร</span>
        <p className="lead">
          หมวดนี้ไม่มีกราฟเทรด ไม่มีอินดิเคเตอร์ — มีแค่<b>ความจริงที่วัดได้</b> เล่าเป็นภาพให้เห็นชัด ๆ
          ผมจะไม่ขายฝัน และจะไม่ปั่นให้คุณกลัวจนไม่กล้าทำอะไร ผมจะวางตัวเลขจริงพร้อมแหล่งอ้างอิงตรงหน้า
          แล้วให้คุณตัดสินใจเองบนหลักฐาน — นั่นคือวิธีเดียวที่ Cerfinits สอน
        </p>
      </div>

      <div className="wrap">
        {/* LESSON 1 */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>ตัวเลขที่โบรกเกอร์ถูกกฎหมายบังคับให้บอก</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_PEOPLE }} />
            <div className="figcap">≈ <b>8 ใน 10</b> บัญชีรายย่อยขาดทุน — ตัวเลขที่โบรกในกำกับ EU/UK เปิดเผยเอง <span className="src">(อยู่ในช่วง 74–89%)<sup style={{ color: "var(--gold)", fontWeight: 700 }}>1</sup></span></div>
          </div>
          <div className="body-txt">
            <p>ทุกโฆษณาเทรดที่คุณเลื่อนเจอมีบางอย่างที่มันไม่บอก แต่มีคนกลุ่มหนึ่ง<b>ถูกกฎหมายบังคับ</b>ให้บอก — ตั้งแต่ปี 2018 หน่วยงานกำกับตลาดยุโรป (ESMA) บังคับให้โบรกเกอร์ CFD/forex ในกำกับต้องติดประโยคนี้หน้าเว็บตัวเอง และนี่คือตัวเลขจากโบรกที่ควรดูแลลูกค้า<b>ดีกว่า</b>โบรกนอกกำกับด้วยซ้ำ อีกทั้งเป็นตัวเลขที่โบรก<b>รายงานเอง</b> ไม่ใช่คู่แข่งเอามาพูด</p>
            <p>แต่ผมจะอ่านมันให้คุณอย่างซื่อสัตย์ เพราะการใช้หลักฐานที่ดีต้องบอกทั้งสิ่งที่มันพูด และสิ่งที่มันไม่ได้พูด: ตัวเลขนี้<b>ไม่ได้</b>แปลว่า “คุณจะขาดทุนแน่ 80%” มันแปลว่าในบรรดาคนที่เปิดบัญชีจริงทั้งหมด ราว 8 ใน 10 ขาดทุนในรอบเวลาที่วัด และมันมีข้อจำกัด — นับเฉพาะ CFD และวัดเป็นช่วงเวลา</p>
            <p>คนไทยไม่เคยเห็นตัวเลขนี้เพราะโบรกที่เราใช้ส่วนใหญ่จดทะเบียนนอก EU ไม่ต้องแสดง — ไม่ได้แปลว่าเราขาดทุนน้อยกว่า แค่ไม่มีใครบังคับให้เขาบอก เราจึงยืมตัวเลขยุโรปมาเป็น “ค่าประมาณที่ดีที่สุดที่หาได้” และงานวิจัยวิชาการก็ชี้ทางเดียวกัน: ทีมนักวิจัยเคยตามดู day trader ทั้งตลาดหุ้นไต้หวัน 15 ปี<sup style={{ color: "var(--gold)", fontWeight: 700 }}>2</sup> พบว่ามี<b>น้อยกว่า 1%</b> ที่ทำกำไรได้สม่ำเสมอหลังหักต้นทุน — คนละตลาดกับ forex แต่แพทเทิร์นเดียวกันเป๊ะ</p>
            <p className="pull">อย่าถามว่า “ผมจะรวยได้ไหม” — ถามว่า “ผมจะไม่เป็น 8 ใน 10 คนนั้นได้ยังไง”</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>คนที่ควรเข้าข้างคุณที่สุดยังบอกว่า 8 ใน 10 ขาดทุน — เข้าสนามแบบเคารพตัวเลขนั้น</p></div>
        </div>

        {/* LESSON 2 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>เหตุใดผู้เทรดส่วนใหญ่จึงขาดทุน (ไม่ใช่เพราะกราฟ)</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_MULT }} />
            <div className="figcap">ผู้เทรดขาดทุนเพราะสามปัจจัยนี้ ไม่ใช่เพราะ “ยังหาสูตรลับไม่เจอ” (สูตรลับไม่มีอยู่จริง)</div>
          </div>
          <div className="body-txt">
            <p>มือใหม่เกือบทุกคนเชื่อว่าตัวเองขาดทุนเพราะ “ใช้อินดิเคเตอร์ผิดตัว” จึงใช้เวลาเป็นปีค้นหาสูตรและผู้เชี่ยวชาญคนใหม่ไปเรื่อย ๆ ทั้งที่ปัญหาจริงอยู่ที่สามปัจจัยนี้ — และเขียนเป็นการ<b>คูณ</b> เพราะพังจุดเดียวก็ส่งผลต่อทั้งหมด:</p>
            <ul className="reasons">
              <li><b>Leverage เกินตัว</b> — 1:500 แปลว่าราคาสวนแค่ 0.2% เงินทุนก็หมด มันเปลี่ยน “ความผันผวนปกติ” ให้กลายเป็น “จุดสิ้นสุดของพอร์ต” ทั้งที่ตลาดไม่ได้ทำอะไรผิดปกติเลย</li>
              <li><b>ไม่มี edge จริง</b> — ถ้าเหตุผลเข้าเทรดคือ “รู้สึกว่ามันจะขึ้น” ระยะยาวผลลัพธ์ไม่ต่างจากการสุ่มทาย ขณะที่ยังต้องจ่ายค่าสเปรดให้โบรกทุกครั้ง</li>
              <li><b>คุมอารมณ์ไม่ได้</b> — แผนดีแค่ไหน ถ้าทำตามไม่ได้ตอนกดดัน ก็เท่ากับไม่มีแผน</li>
            </ul>
            <div className="note">
              <span className="nl">หลักฐานจากงานของผมเอง<sup> 3</sup></span>
              <p>ผมนั่งทดสอบสมมติฐาน breakout ทองคำ (XAUUSD) ด้วยข้อมูลระดับ tick <b>4 ปี</b> — ระบบที่ผมมั่นใจมากตอนไล่ดูด้วยตา พอวัดจริงหลังหักสเปรดและค่าคอมกลับ<b>ไม่มี edge</b>ที่มีนัย ผมจึงยุติระบบนั้น — น่าเสียดายแต่จำเป็น ประเด็นคือ: ถ้าคนที่นั่งวัดด้วยข้อมูลจริงเป็นเดือนยังพบว่า “ความมั่นใจ” กับ “edge จริง” คนละเรื่องกัน แล้วคนที่เทรดด้วยความรู้สึกล้วน ๆ จะเหลืออะไร?</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>คุณไม่ได้ขาดสูตรลับ คุณขาด 3 อย่างที่วัดได้ — leverage, edge, วินัย</p></div>
        </div>

        {/* LESSON 3 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>“รวยเร็ว” คือคำโกหก — แล้วเรียนไปทำไม</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_ICEBERG }} />
            <div className="figcap">Survivorship bias — คุณเห็นแค่ยอดภูเขาน้ำแข็ง ส่วนที่จมอยู่ใต้น้ำใหญ่กว่ามาก</div>
          </div>
          <div className="body-txt">
            <p>ผมจะพูดตรง ๆ เพราะผมเคารพเวลาของคุณ: ถ้าคุณมาที่นี่เพราะเห็นคนอวดพอร์ตกำไรหลักแสนใน 3 เดือน แล้วอยากได้บ้าง ผมแนะนำให้ปิดหน้านี้ แล้วเอาเวลาไปทำอย่างอื่นที่ให้ผลตอบแทนแน่นอนกว่า ผมพูดจริง และถ้าต้องเสียคุณไปเพราะประโยคนี้ ผมก็ยอม</p>
            <p>เพราะภาพ “รวยเร็ว” ที่คุณเห็น เกือบทั้งหมดมาจากอย่างใดอย่างหนึ่งใน 3 อย่างนี้ — ใช้ leverage สูงจนไม้เดียวเป็นตาย (ชนะเพราะดวง ไม่ใช่ทักษะ), โชว์เฉพาะเดือนที่ชนะ (คุณไม่มีวันเห็นเดือนที่พอร์ตแตก), หรือกำไรจริงมาจากการขายคอร์ส/signal ให้คุณ ไม่ได้มาจากตลาด</p>
            <p>แล้วถ้ามันไม่ได้ทำให้รวยเร็ว จะเรียนไปทำไม? ผมมี 3 คำตอบที่ซื่อสัตย์:</p>
            <ul className="reasons">
              <li><b>เพื่อไม่โดนหลอก</b> — คนที่เข้าใจกลไกจริง หลอกยากที่สุด ในคดีหลอกลงทุนใหญ่ ๆ ของไทย เหยื่อส่วนมากไม่เคยเทรดเองเป็นด้วยซ้ำ</li>
              <li><b>เพื่อ “โอกาส” ที่จะมี edge จริง</b> — ย้ำว่าโอกาส ไม่ใช่คำสัญญา มันเป็นไปได้ แต่ต้องแลกด้วยหลายปีของการฝึกและวัดผล คนที่ไปถึงมีจริง แต่น้อย และไม่มีทางลัด</li>
              <li><b>เพื่อเข้าใจเรื่องเงิน</b> — เข้าใจความเสี่ยง เลเวอเรจ และความน่าจะเป็น ทำให้ทุกการตัดสินใจเรื่องเงินของคุณดีขึ้น แม้สุดท้ายไม่ได้เทรดจริงเลย</li>
            </ul>
            <div className="note">
              <span className="nl">Cerfinits Note — บันทึกจากผม</span>
              <p>ผมทำคอนเทนต์เทรดมาหลายปี สิ่งที่ “ขายดี” ที่สุดคือความหวัง แต่สิ่งที่ “ช่วยคนได้จริง” ที่สุดคือความจริง ผมเลือกอย่างหลังมาตลอด แม้มันขายยากกว่าเยอะ — เพราะผมอยากให้คุณอยู่ในตลาดนี้ได้นาน ไม่ใช่แค่ซื้อของผมรอบเดียวแล้วหายไป</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เรียนเพื่อ “ไม่โดนหลอก” และ “มีโอกาสจริง” — ไม่ใช่เพื่อรวยเร็ว เพราะทางนั้นไม่มีอยู่</p></div>
        </div>

        {/* LESSON 4 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>เงินที่ใช้เทรดต้องเป็นเงินแบบไหน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_FOUNDATION }} />
            <div className="figcap">การเทรดคือ “ยอดเล็ก ๆ” ที่วางบนฐานการเงินที่แข็งแรง ไม่ใช่ทางลัดข้ามมัน</div>
          </div>
          <div className="body-txt">
            <p>มีคำถามหนึ่งที่มือใหม่แทบไม่เคยถาม แต่มันสำคัญกว่าทุกอินดิเคเตอร์รวมกัน:</p>
            <p className="pull">“เงินก้อนนี้ ถ้าหายไปทั้งหมดพรุ่งนี้ — ชีวิตผมเปลี่ยนไหม?”</p>
            <p>ถ้าคำตอบคือ “เปลี่ยน” คุณยัง<b>ไม่ควร</b>เอามันมาเทรด ไม่ใช่เพราะคุณไม่เก่งพอ แต่เพราะเงินที่คุณเสียไม่ได้ จะทำให้คุณตัดสินใจแย่ลงทุกไม้ เงินที่เทรดได้เรียกว่า <b>risk capital</b> — เงินที่เสียได้ทั้งก้อนโดยไม่กระทบค่ากิน ค่าเช่า ค่าเทอม หนี้ หรือครอบครัว และมันมาเป็น<b>ลำดับสุดท้าย</b> ตามภาพด้านบน: มีกองทุนฉุกเฉิน 3–6 เดือนก่อน → เคลียร์หนี้ดอกเบี้ยสูงก่อน (ปิดหนี้บัตร 20% คือผลตอบแทนชัวร์ 20% ที่ไม่มีเทรดไหนการันตีได้) → เงินที่เหลือจริง ๆ ค่อยแบ่งส่วนเล็ก ๆ มาเทรด</p>
            <div className="banned">
              <span className="bl">เส้นห้ามข้ามเด็ดขาด</span>
              <span className="x">กู้มาเทรด</span>
              <span className="x">เงินค่าเทอม</span>
              <span className="x">เงินคนอื่น</span>
            </div>
            <p style={{ marginTop: "16px" }}>คดีหลอกลงทุนที่สร้างความเสียหายมหาศาลในไทย เกือบทั้งหมดเริ่มจากการที่คนเอา “เงินที่เสียไม่ได้” ไปวางในที่ที่เสียได้ — นี่ไม่ใช่เรื่องเทคนิค แต่เป็นเส้นที่กันคุณจากหายนะ</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">เชื่อมกับเครื่องมือ Cerfinits</span>
              <p>นี่คือเหตุผลที่ Cerfinits ไม่ได้เป็นแค่เว็บสอนเทรด — เราเชื่อว่าการเทรดคือ “ส่วนเล็ก ๆ” ของแผนการเงินที่แข็งแรง ก่อนไป ระดับ ต่อไป เปิด <a href="/plan/portfolio">/plan/portfolio</a> ดูภาพรวมเงินลงทุนระยะยาวที่มีอยู่ก่อน แล้วคุณจะรู้เองว่าเงินก้อนที่เหลือ “เทรดได้จริง ๆ” มีเท่าไหร่</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เทรดเดอร์ที่รอด ไม่ใช่คนกล้าเสี่ยงที่สุด แต่เป็นคนที่รู้ว่าตัวเอง “เสียได้เท่าไหร่” ก่อนเริ่ม</p></div>
        </div>

        {/* LESSON 5 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>แผนที่การเดินทาง: ทั้ง 8 ระดับ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_LADDER }} />
            <div className="figcap">โซนฟรี (ระดับ 1–4) จบด้วย <b>Risk Management</b> — ของสำคัญที่สุด เราวางไว้ก่อนและให้ฟรี</div>
          </div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CONTRAST }} />
            <div className="figcap">จุดต่างของหลักสูตร: “สอนการรอดก่อนการรวย” — ไม่ใช่เก็บ risk ไว้ท้าย ๆ</div>
          </div>
          <div className="body-txt">
            <p>ตอนนี้คุณอยู่ที่ ระดับ 1 หมวดสุดท้าย จากนี้คือแผนที่ทั้งเส้นทาง — คอร์สเทรดเกือบทุกที่สอน “การรวย” ก่อน แล้วเก็บ “การรอด” ไว้ท้าย ๆ เราทำกลับกัน ระดับ 4 ทั้งระดับคือการเอาตัวรอด และเรา<b>ให้ฟรี</b> เพราะของที่สำคัญที่สุดไม่ควรอยู่หลังกำแพงเงิน นี่คือจุดยืน ไม่ใช่กลยุทธ์การตลาด</p>
            <ul className="reasons">
              <li><b>ระดับ 1–2 · ฟรี</b> — พื้นฐานตลาด + อ่านกราฟให้ออก (~2–4 สัปดาห์)</li>
              <li><b>ระดับ 3 · ฟรี</b> — กล่องเครื่องมือ technical (~3–4 สัปดาห์)</li>
              <li><b>ระดับ 4 · ฟรี</b> — เอาตัวรอด/Risk Management: ระดับที่สำคัญที่สุด</li>
              <li><b>ระดับ 5–8 · Premium</b> — price action, macro, สร้างระบบ + จิตวิทยา, และโลกจริง</li>
              <li><b>คอร์สซัมเมอร์</b> — วิชาเลือก รวมถึง Gold Start เจาะลึกทองคำ</li>
            </ul>
            <p><b>ผมจะพูดความจริงเรื่องเวลา:</b> จบทั้ง 8 ระดับไม่ได้แปลว่าคุณจะกำไร มันแปลว่าคุณ “พร้อมฝึกจริงอย่างมีเครื่องมือครบมือ” — การเป็นเทรดเดอร์ที่ทำเงินได้เป็นเรื่องของ<b>ปี</b> ไม่ใช่คอร์ส และไม่มีใครลัดมันได้ รวมถึงผมด้วย</p>
          </div>
          <div className="take"><span className="tl">เป้า 3 เดือนแรก</span><p>อยู่รอด + สร้างนิสัย + ฝึกอ่านบริบท — ไม่ใช่กำไร</p></div>
        </div>
      </div>

      <div className="sources">
        <div className="wrap">
          <h3>แหล่งอ้างอิง</h3>
          <p className="si">ตัวเลขทุกตัวเป็น “ค่าประมาณที่ดีที่สุดที่หาได้” ไม่ใช่คำพยากรณ์ผลของคุณ — ตรวจสอบเองได้</p>
          <ol className="reflist">
            <li><b>ESMA product intervention (2018)</b> — บังคับให้โบรกเกอร์ CFD ในกำกับแสดง % บัญชีรายย่อยที่ขาดทุน; FCA (UK) รับมาใช้ถาวรปี 2019 · ตัวเลขที่เปิดเผยมักอยู่ในช่วง ~74–89%</li>
            <li><b>Barber, Lee, Liu &amp; Odean</b> — การศึกษา day trader ตลาดหุ้นไต้หวัน (Journal of Financial Markets, 2014): ส่วนใหญ่ขาดทุน, &lt;~1% กำไรสม่ำเสมอหลังหักต้นทุน · เป็นตลาดหุ้น อ้างเป็นแพทเทิร์นเทียบเคียง</li>
            <li><b>งาน backtest ภายใน Cerfinits</b> — สมมติฐาน breakout ทองคำ (XAUUSD) บน tick data 4 ปี: ไม่พบ edge มีนัยหลังหักต้นทุน สำหรับกรอบที่ทดสอบ</li>
          </ol>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 1 หมวด 1.5
      </div>
    </>
  );
}
