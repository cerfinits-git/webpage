import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 8 · บทส่งท้าย — 90 วันแรก และตำแหน่งของการเทรดในแผนการเงิน · Cerfinits Grade",
  description:
    "Premium: แผนปฏิบัติ 90 วันแรกหลังจบหลักสูตร, เกณฑ์วัดความก้าวหน้าที่ถูกต้อง, การเทรดในภาพใหญ่ของการเงินส่วนบุคคล และบทส่งท้ายของหลักสูตร",
  alternates: { canonical: "/grade/final-chapter" },
};

const SVG_90DAYS = `<svg viewBox="0 0 660 230" role="img" aria-label="แผน 90 วันแรก">
  <rect class="chip-n" x="30" y="36" width="190" height="120" rx="3"/>
  <text class="t-md" x="125" y="66" text-anchor="middle">เดือนที่ 1</text>
  <text class="t-xs" x="125" y="92" text-anchor="middle">Demo + journal ครบทุกไม้</text>
  <text class="t-xs" x="125" y="112" text-anchor="middle">เป้า: ทำตามแผน ≥90%</text>
  <text class="t-xs" x="125" y="132" text-anchor="middle">ยังไม่วัดกำไร</text>
  <path d="M225,96 L255,96 M246,89 L258,96 L246,103" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="263" y="36" width="190" height="120" rx="3"/>
  <text class="t-md" x="358" y="66" text-anchor="middle">เดือนที่ 2</text>
  <text class="t-xs" x="358" y="92" text-anchor="middle">เงินจริงขนาดเล็ก</text>
  <text class="t-xs" x="358" y="112" text-anchor="middle">เสี่ยง 0.25–0.5% ต่อไม้</text>
  <text class="t-xs" x="358" y="132" text-anchor="middle">เป้า: execute เท่ากับ demo</text>
  <path d="M458,96 L488,96 M479,89 L491,96 L479,103" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-gold" x="496" y="36" width="134" height="120" rx="3" stroke-width="2"/>
  <text class="t-md t-gold" x="563" y="66" text-anchor="middle">เดือนที่ 3</text>
  <text class="t-xs" x="563" y="92" text-anchor="middle">ประเมินด้วยสถิติ</text>
  <text class="t-xs" x="563" y="112" text-anchor="middle">เทียบ kill criteria</text>
  <text class="t-xs" x="563" y="132" text-anchor="middle">ตัดสินใจ: ต่อ/ปรับ/พัก</text>
  <text class="t-xs" x="330" y="196" text-anchor="middle">เป้าหมายของ 90 วันแรกคือกระบวนการที่เชื่อถือได้ — ไม่ใช่ผลกำไร</text>
</svg>`;

const SVG_METRICS = `<svg viewBox="0 0 660 210" role="img" aria-label="เกณฑ์วัดความก้าวหน้า">
  <text class="t-sm" x="8" y="24">เกณฑ์วัดที่ถูกต้องสำหรับผู้เริ่มต้น (เรียงตามลำดับความสำคัญ)</text>
  <text class="t-md" x="8" y="66">1 · อัตราทำตามแผน</text>
  <rect class="bar-up" x="250" y="50" width="330" height="24"/>
  <text class="t-xs t-up" x="590" y="66">เป้า ≥90%</text>
  <text class="t-md" x="8" y="114">2 · expectancy จริง</text>
  <rect class="bar-gold" x="250" y="98" width="240" height="24"/>
  <text class="t-xs t-gold" x="500" y="114">เข้าใกล้ค่า backtest</text>
  <text class="t-md" x="8" y="162">3 · กำไร/ขาดทุน</text>
  <rect class="bar-n" x="250" y="146" width="120" height="24"/>
  <text class="t-xs" x="380" y="162">ผลพลอยได้ของสองข้อแรก — วัดท้ายสุด</text>
  <text class="t-xs" x="330" y="196" text-anchor="middle">การวัดกำไรก่อนกระบวนการ ให้ข้อสรุปที่เชื่อถือไม่ได้ — 30 ไม้แรกกำไรหรือขาดทุนได้จากความแปรปรวนล้วน ๆ</text>
</svg>`;

const SVG_PYRAMID = `<svg viewBox="0 0 660 260" role="img" aria-label="ตำแหน่งของเงินเทรดในแผนการเงิน">
  <rect class="bar-up" x="70" y="196" width="520" height="48" rx="3"/>
  <text class="t-lab" x="330" y="220" text-anchor="middle">กองทุนฉุกเฉิน 3–6 เดือน + ประกันที่จำเป็น</text>
  <text class="t-xs t-up" x="330" y="238" text-anchor="middle">ฐานที่ต้องมีก่อนทุกอย่าง</text>
  <rect class="chip-n" x="130" y="136" width="400" height="52" rx="3"/>
  <text class="t-lab" x="330" y="160" text-anchor="middle">ปิดหนี้ดอกเบี้ยสูง + การลงทุนระยะยาว</text>
  <text class="t-xs" x="330" y="180" text-anchor="middle">เส้นทางหลักของความมั่งคั่ง</text>
  <rect class="bar-gold" x="220" y="80" width="220" height="48" rx="3"/>
  <text class="t-md t-gold" x="330" y="102" text-anchor="middle">เงินเทรด (risk capital)</text>
  <text class="t-xs" x="330" y="120" text-anchor="middle">ส่วนน้อยที่เสียได้ทั้งหมด</text>
  <line x1="610" y1="220" x2="610" y2="96" stroke="var(--gold)" stroke-width="2"/>
  <path d="M610,84 L604,98 L616,98 Z" fill="var(--gold)"/>
  <text class="t-xs t-gold" x="604" y="66" text-anchor="middle">ลำดับ</text>
  <text class="t-xs" x="330" y="40" text-anchor="middle">โครงเดียวกับหมวด 1.5 — จุดเริ่มและจุดจบของหลักสูตรคือหลักการเดียวกัน</text>
</svg>`;

const SVG_JOURNEY = `<svg viewBox="0 0 660 210" role="img" aria-label="เส้นทางหลังจบหลักสูตร">
  <rect class="chip-ok" x="30" y="30" width="130" height="56" rx="3"/>
  <text class="t-sm t-up" x="95" y="54" text-anchor="middle">ระดับ 1–4</text>
  <text class="t-xs" x="95" y="74" text-anchor="middle">พื้นฐาน + การอยู่รอด</text>
  <path d="M165,58 L190,58 M182,51 L194,58 L182,65" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-gold" x="198" y="30" width="130" height="56" rx="3"/>
  <text class="t-sm t-gold" x="263" y="54" text-anchor="middle">ระดับ 5–7</text>
  <text class="t-xs" x="263" y="74" text-anchor="middle">ระบบ + วินัย</text>
  <path d="M333,58 L358,58 M350,51 L362,58 L350,65" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-gold" x="366" y="30" width="130" height="56" rx="3"/>
  <text class="t-sm t-gold" x="431" y="54" text-anchor="middle">ระดับ 8</text>
  <text class="t-xs" x="431" y="74" text-anchor="middle">โลกจริง</text>
  <path d="M501,58 L526,58 M518,51 L530,58 L518,65" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="534" y="30" width="96" height="56" rx="3"/>
  <text class="t-sm" x="582" y="62" text-anchor="middle">จากนี้</text>
  <rect class="chip-n" x="120" y="128" width="160" height="52" rx="3"/>
  <text class="t-xs" x="200" y="150" text-anchor="middle">คอร์สซัมเมอร์</text>
  <text class="t-xs" x="200" y="168" text-anchor="middle">วิชาเลือกเฉพาะทาง</text>
  <rect class="chip-n" x="300" y="128" width="160" height="52" rx="3"/>
  <text class="t-xs" x="380" y="150" text-anchor="middle">Journal ของคุณเอง</text>
  <text class="t-xs" x="380" y="168" text-anchor="middle">แหล่งเรียนรู้ที่ดีที่สุดจากนี้ไป</text>
  <rect class="chip-n" x="480" y="128" width="150" height="52" rx="3"/>
  <text class="t-xs" x="555" y="150" text-anchor="middle">/plan</text>
  <text class="t-xs" x="555" y="168" text-anchor="middle">พอร์ตลงทุนระยะยาว</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 8 · หมวด 8.4 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">บทส่งท้าย</span>
        <h1>จบหลักสูตร — และจุดเริ่มต้นของงานจริง</h1>
        <p className="lead">
          หมวดสุดท้ายของ Cerfinits Grade ไม่มีเทคนิคใหม่ — มีเพียงสามสิ่งที่สำคัญกว่า:
          <b>แผนปฏิบัติ 90 วันแรก</b> เกณฑ์วัดความก้าวหน้าที่ถูกต้อง
          และคำตอบของคำถามที่หลักสูตรนี้ตั้งไว้ตั้งแต่บทแรก — การเทรดควรอยู่ตรงไหนในชีวิตการเงินของคุณ
        </p>
      </div>

      <div className="wrap">
        {/* L1 90 days */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>★ แผนปฏิบัติ 90 วันแรก</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_90DAYS }} />
            <div className="figcap">สามเดือน สามเป้าหมาย — วินัยก่อน แล้วจึงความเสถียร แล้วจึงการประเมิน</div>
          </div>
          <div className="body-txt">
            <p><b>เดือนที่ 1 — Demo อย่างจริงจัง:</b> เทรดตามระบบที่เขียนไว้ (ระดับ 7.1) บนบัญชี demo พร้อม journal ครบทุกไม้ เป้าหมายเดียวคืออัตราการทำตามแผน ≥90% และห้ามวัดกำไรในเดือนนี้ — demo มีไว้พิสูจน์ว่ากระบวนการทำงานได้จริง ไม่ใช่พิสูจน์ว่าระบบทำเงิน เพราะจำนวนไม้ยังน้อยเกินกว่าจะสรุปเชิงสถิติได้</p>
            <p><b>เดือนที่ 2 — เงินจริงขนาดเล็ก:</b> หากเดือนแรกผ่านเกณฑ์วินัย เริ่มบัญชีจริงด้วยความเสี่ยง 0.25–0.5% ต่อไม้ — ครึ่งหนึ่งของค่ามาตรฐาน เหตุผลตามหมวด 7.2: การตอบสนองต่อเงินจริงต่างจาก demo และเดือนนี้มีไว้ฝึกรับมือกับความต่างนั้นในขนาดที่ปลอดภัย เป้าหมายคือคุณภาพการ execute เท่ากับช่วง demo</p>
            <p><b>เดือนที่ 3 — ประเมินด้วยสถิติ:</b> รวมข้อมูลสองเดือน เทียบ expectancy จริงกับค่า backtest และเทียบกับ kill criteria ที่กำหนดไว้ แล้วเลือกหนึ่งจากสามทาง: ดำเนินต่อ (ผลสอดคล้อง) · ปรับ (พบจุดอ่อนเฉพาะที่มีหลักฐานรองรับ) · หรือพัก (ผลต่ำกว่าเกณฑ์ — กลับสู่ขั้น demo โดยความเสียหายจำกัด) — ทุกทางเลือกคือผลลัพธ์ที่ยอมรับได้ของกระบวนการที่ถูกต้อง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เดือน 1 วินัยบน demo · เดือน 2 เงินจริงครึ่งขนาด · เดือน 3 ตัดสินด้วยสถิติ — ไม่มีขั้นใดวัดด้วยกำไร</p></div>
        </div>

        {/* L2 metrics */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>เกณฑ์วัดความก้าวหน้าที่ถูกต้อง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_METRICS }} />
            <div className="figcap">ลำดับการวัด: วินัย → ความสอดคล้องกับระบบ → กำไร (ท้ายสุดเสมอ)</div>
          </div>
          <div className="body-txt">
            <p>คำถามที่ผู้เริ่มต้นทุกคนถามคือ &quot;เมื่อไรจะทราบว่าตนเองมาถูกทาง&quot; — คำตอบที่ถูกต้องไม่ใช่ยอดกำไร เพราะในช่วง 30–50 ไม้แรก <b>กำไรหรือขาดทุนเกิดจากความแปรปรวนได้ทั้งคู่</b> (ระบบ win rate 42% อาจแพ้ 9 ไม้ติดต่อกันโดยไม่มีสิ่งใดผิดปกติ — ค่านี้อยู่ในผล backtest ของคุณเองแล้ว) การวัดด้วยกำไรเร็วเกินไปทำให้ผู้ใช้เลิกใช้ระบบที่ดี และมั่นใจเกินเหตุกับระบบที่บกพร่อง</p>
            <p>เกณฑ์ที่ถูกต้องเรียงตามลำดับ: (1) <b>อัตราการทำตามแผน</b> — ตัวแปรเดียวที่ควบคุมได้เต็มที่ และควรถึง ≥90% ก่อนสิ่งอื่นใด (2) <b>expectancy จริงเข้าใกล้ค่า backtest</b> — บ่งชี้ว่าระบบทำงานตามที่ทดสอบไว้ (3) <b>กำไร</b> — ผลพลอยได้ของสองข้อแรกเมื่อจำนวนไม้มากพอ ผู้ที่ทำสองข้อแรกได้ต่อเนื่อง กำไรเป็นเรื่องของเวลา ส่วนผู้ที่ข้ามไปวัดข้อสามก่อน มักไม่เหลือเงินทุนอยู่จนถึงวันที่ระบบพิสูจน์ตัวเอง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>วัดตามลำดับ: วินัย ≥90% → expectancy เข้าใกล้ backtest → กำไร (ผลพลอยได้เมื่อไม้มากพอ)</p></div>
        </div>

        {/* L3 big picture */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>★ ตำแหน่งของการเทรดในแผนการเงินทั้งชีวิต</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_PYRAMID }} />
            <div className="figcap">โครงสร้างเดียวกับที่หลักสูตรเริ่มต้นไว้ในหมวด 1.5 — เพราะเป็นหลักการที่สำคัญที่สุดของทั้งหลักสูตร</div>
          </div>
          <div className="body-txt">
            <p>หลักสูตรนี้เปิดด้วยคำถามในหมวด 1.5: &quot;เงินก้อนนี้ ถ้าหายไปทั้งหมด ชีวิตคุณเปลี่ยนหรือไม่&quot; — และปิดด้วยหลักการเดียวกันในรูปสมบูรณ์: <b>การเทรดคือส่วนประกอบหนึ่งของแผนการเงิน ไม่ใช่ตัวแผน</b> ลำดับที่ถูกต้องไม่เคยเปลี่ยน: กองทุนฉุกเฉินและประกันที่จำเป็นมาก่อน ถัดมาคือการปิดหนี้ดอกเบี้ยสูงและการลงทุนระยะยาวซึ่งเป็นเส้นทางหลักของความมั่งคั่งสำหรับคนส่วนใหญ่ — เงินเทรดคือส่วนน้อยบนยอดที่เสียได้ทั้งหมดโดยแผนใหญ่ไม่กระทบ</p>
            <p>เหตุผลที่ลำดับนี้คงเดิมแม้ความสามารถของคุณจะเพิ่มขึ้น: (1) รายได้จากการเทรดผันผวนสูง ไม่ควรเป็นฐานของภาระผูกพันระยะยาว (2) ฐานการเงินที่มั่นคงคือสิ่งที่ทำให้วินัยการเทรดเป็นไปได้จริง — ผู้ที่จำเป็นต้องทำกำไรภายในเดือนนี้เพื่อค่าใช้จ่าย จะละเมิดแผนความเสี่ยงเมื่อถูกกดดันเสมอ (3) หากวันหนึ่งข้อมูลบ่งชี้ว่าการเทรดไม่ใช่เส้นทางที่เหมาะกับคุณ การถอยออกจากยอดพีระมิดไม่กระทบฐาน — นั่นคือความหมายของการตัดสินใจที่ย้อนกลับได้</p>
            <p>เครื่องมือ <b><a href="/plan/portfolio">/plan</a></b> ของ Cerfinits เก็บส่วนพอร์ตลงทุนระยะยาวของภาพนี้ไว้ให้เห็นชัด: หุ้น/ETF คริปโต และทองคำในที่เดียว — การเทรดที่ดีที่สุดคือการเทรดที่เกิดบนฐานการเงินที่จัดระเบียบแล้ว</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ฐานมั่นคง → ลงทุนระยะยาว → เงินเทรดส่วนน้อยบนยอด — ฐานที่ดีคือสิ่งที่ทำให้วินัยการเทรดเป็นไปได้จริง</p></div>
        </div>

        {/* L4 closing */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>บทส่งท้ายของหลักสูตร</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_JOURNEY }} />
            <div className="figcap">เส้นทางที่ผ่านมา และแหล่งเรียนรู้จากนี้ไป — journal ของคุณเองคือแหล่งเรียนรู้ที่สำคัญที่สุดนับจากวันนี้</div>
          </div>
          <div className="body-txt">
            <p>สิ่งที่หลักสูตรนี้มอบให้ได้: กรอบการอ่านตลาด (ระดับ 2, 3, 5, 6) เครื่องมือบริหารความเสี่ยงที่คำนวณได้ (ระดับ 4) กระบวนการสร้างและพิสูจน์ระบบ (ระดับ 7) และความเข้าใจโลกจริงของอุตสาหกรรมนี้ (ระดับ 1, 8) — สิ่งที่หลักสูตรนี้มอบให้ไม่ได้และไม่มีหลักสูตรใดมอบได้: <b>การรับประกันผลกำไร</b> ความสำเร็จในการเทรดเป็นผลของกระบวนการที่ถูกต้อง ทำซ้ำอย่างมีวินัย เป็นระยะเวลานานพอ — สององค์ประกอบหลังอยู่ในมือคุณเท่านั้น</p>
            <p>เส้นทางการเรียนรู้จากนี้: <b>คอร์สซัมเมอร์</b>สำหรับหัวข้อเฉพาะทาง (เริ่มจากทองคำเจาะลึกซึ่งเปิดให้เรียนแล้ว) · <b>journal ของคุณเอง</b> ซึ่งนับจากวันนี้จะเป็นแหล่งความรู้ที่ตรงกับตัวคุณที่สุด เพราะบันทึกข้อผิดพลาดของคุณจริง ไม่ใช่ของคนทั่วไป · และเมื่อพร้อมขยายจากการเทรดสู่การลงทุนระยะยาว — <b><a href="/research">บทวิเคราะห์หุ้น</a></b> และ <b><a href="/plan/portfolio">เครื่องมือวางแผนการเงิน</a></b> ของ Cerfinits พร้อมต่อภาพนั้นให้สมบูรณ์</p>
            <p>ขอบคุณที่เรียนจนถึงบรรทัดนี้ หลักสูตรนี้เขียนขึ้นบนหลักการเดียวกับที่เราใช้ในงานของตัวเอง: <b>ตัดสินทุกอย่างด้วยหลักฐาน เคารพความเสี่ยง และไม่สัญญาในสิ่งที่ตลาดไม่เคยสัญญากับผู้ใด</b> — ขอให้เส้นทางของคุณยาวพอที่ความสามารถจะได้แสดงผล</p>
          </div>
          <div className="bridge">
            <span className="bi">✓</span>
            <div>
              <span className="bl">จบหลักสูตร Cerfinits Grade ทั้ง 8 ระดับ</span>
              <p>กลับไปที่ <b><a href="/grade">แผนที่หลักสูตร</a></b> เพื่อทบทวนหมวดใดก็ได้ หรือไปต่อที่ <b><a href="/gold-start">คอร์สซัมเมอร์: ทองคำเจาะลึก</a></b> — และเมื่อพร้อมจัดระเบียบภาพการเงินทั้งหมด: <b><a href="/plan/portfolio">เริ่มที่ /plan</a></b></p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>หลักสูตรให้กรอบและเครื่องมือ — วินัยและเวลาเป็นของคุณ · journal ของคุณคือแหล่งเรียนรู้ถัดไป</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 8 หมวด 8.4 (Premium)
      </div>
    </>
  );
}
