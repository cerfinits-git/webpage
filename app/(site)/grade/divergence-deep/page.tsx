import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ซัมเมอร์ S3 · Divergence เจาะลึก — Regular, Hidden และเงื่อนไขการใช้ · Cerfinits Grade",
  description:
    "Premium: กลไกของ divergence, regular divergence (สัญญาณเตือนกลับตัว), hidden divergence (สัญญาณต่อเนื่องของแนวโน้ม), เงื่อนไขการใช้ที่ถูกต้อง และตารางสรุปการใช้งาน",
  alternates: { canonical: "/grade/divergence-deep" },
};

const SVG_MECH = `<svg viewBox="0 0 660 230" role="img" aria-label="กลไกของ divergence แรงขาที่สองอ่อนกว่า">
  <text class="t-xs" x="46" y="22">ราคา — ยอดที่สองสูงกว่า</text>
  <polyline points="40,110 120,60 200,96 300,44" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="120" y1="60" x2="300" y2="44" stroke="var(--down)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <line x1="40" y1="128" x2="620" y2="128" stroke="var(--hair-2)" stroke-width="1"/>
  <text class="t-xs" x="46" y="148">โมเมนตัม (RSI) — ยอดที่สองต่ำกว่า</text>
  <polyline points="40,200 120,160 200,190 300,172" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <line x1="120" y1="160" x2="300" y2="172" stroke="var(--down)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <rect class="chip-n" x="360" y="60" width="270" height="110" rx="3"/>
  <text class="t-sm" x="495" y="92" text-anchor="middle">ความหมายเชิงกลไก:</text>
  <text class="t-xs" x="495" y="116" text-anchor="middle">ราคาไปได้ไกลขึ้น แต่ &quot;อัตราเร่ง&quot; ลดลง</text>
  <text class="t-xs" x="495" y="136" text-anchor="middle">แรงผลักของฝั่งเดิมกำลังอ่อนกำลัง</text>
  <text class="t-xs t-down" x="495" y="156" text-anchor="middle">= คำเตือน ไม่ใช่คำสั่งกลับตัวทันที</text>
</svg>`;

const SVG_REGULAR = `<svg viewBox="0 0 660 240" role="img" aria-label="regular divergence สองด้าน">
  <text class="t-sm t-down" x="165" y="22" text-anchor="middle">Regular Bearish</text>
  <polyline points="40,100 110,56 180,86 260,40" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
  <text class="t-xs" x="150" y="120" text-anchor="middle">ราคา: HH</text>
  <polyline points="40,200 110,164 180,192 260,176" fill="none" stroke="var(--gold)" stroke-width="1.8"/>
  <text class="t-xs t-down" x="150" y="222" text-anchor="middle">RSI: LH → เตือนอ่อนแรงขาขึ้น</text>
  <line x1="330" y1="26" x2="330" y2="214" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-up" x="495" y="22" text-anchor="middle">Regular Bullish</text>
  <polyline points="370,60 440,110 510,84 590,130" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
  <text class="t-xs" x="480" y="150" text-anchor="middle">ราคา: LL</text>
  <polyline points="370,170 440,204 510,186 590,196" fill="none" stroke="var(--gold)" stroke-width="1.8"/>
  <text class="t-xs t-up" x="480" y="228" text-anchor="middle">RSI: HL → เตือนอ่อนแรงขาลง</text>
</svg>`;

const SVG_HIDDEN = `<svg viewBox="0 0 660 230" role="img" aria-label="hidden bullish divergence ในแนวโน้มขาขึ้น">
  <text class="t-xs" x="46" y="22">ราคา (แนวโน้มขาขึ้น) — จุดย่อ &quot;สูงขึ้น&quot; (HL)</text>
  <polyline points="40,150 120,80 200,116 310,50" fill="none" stroke="var(--up)" stroke-width="2"/>
  <line x1="120" y1="116" x2="200" y2="116" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="40" y1="132" x2="620" y2="132" stroke="var(--hair-2)" stroke-width="1"/>
  <text class="t-xs" x="46" y="152">โมเมนตัม — จุดย่อ &quot;ต่ำลง&quot; (LL)</text>
  <polyline points="40,180 120,196 200,214 310,186" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-ok" x="380" y="60" width="250" height="96" rx="3"/>
  <text class="t-sm t-up" x="505" y="90" text-anchor="middle">การตีความ</text>
  <text class="t-xs" x="505" y="114" text-anchor="middle">ราคาย่อตื้น แต่โมเมนตัมคายแรงเต็มรอบ</text>
  <text class="t-xs" x="505" y="134" text-anchor="middle">= แนวโน้มเดิมยังแข็งแรง — สัญญาณต่อเนื่อง</text>
</svg>`;

const SVG_CONTEXT = `<svg viewBox="0 0 660 240" role="img" aria-label="divergence ที่โซนกับกลางแนวโน้ม">
  <text class="t-sm t-up" x="165" y="22" text-anchor="middle">ที่โซนสำคัญ + trigger ✓</text>
  <line x1="40" y1="70" x2="290" y2="70" stroke="var(--down)" stroke-width="1.5" stroke-dasharray="6 3"/>
  <text class="t-xs t-down" x="44" y="60">Supply zone (5.1)</text>
  <polyline points="40,180 110,110 170,140 240,76 280,110" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
  <circle cx="240" cy="76" r="5" fill="var(--gold)"/>
  <text class="t-xs t-gold" x="150" y="210" text-anchor="middle">divergence + แท่งกลับตัวที่โซน → มีน้ำหนัก</text>
  <line x1="330" y1="26" x2="330" y2="214" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-down" x="495" y="22" text-anchor="middle">กลางแนวโน้มแรง ✕</text>
  <polyline points="370,190 430,150 480,166 540,110 590,124 630,70" fill="none" stroke="var(--up)" stroke-width="2"/>
  <circle cx="540" cy="110" r="5" fill="var(--down)"/>
  <text class="t-xs t-down" x="500" y="210" text-anchor="middle">divergence กลางเทรนด์แรง — ล้มเหลวซ้ำได้เรื่อย ๆ</text>
  <text class="t-xs" x="500" y="228" text-anchor="middle">(กลไกเดียวกับ RSI ค้างเขต — ระดับ 3.1)</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>คอร์สซัมเมอร์ · S3 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Divergence เจาะลึก</span>
        <h1>ความขัดแย้งระหว่างราคากับโมเมนตัม — อ่านอย่างเป็นระบบ</h1>
        <p className="lead">
          Divergence เป็นเครื่องมือเสริมที่มีกลไกรองรับชัดเจนที่สุดตัวหนึ่ง แต่ก็เป็นตัวที่ถูกใช้ผิดมากที่สุดเช่นกัน
          หมวดนี้ต่อยอดจากพื้นฐานในระดับ 3.3 สู่การใช้งานจริง: แยกชนิดให้ถูก อ่านบริบทให้เป็น
          และเข้าใจว่าเมื่อใดสัญญาณนี้มีน้ำหนัก เมื่อใดไม่มี
        </p>
      </div>

      <div className="wrap">
        {/* L1 mechanism */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>กลไกเบื้องหลัง: ทำไม Divergence จึงมีความหมาย</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_MECH }} />
            <div className="figcap">ราคาทำจุดสูงใหม่ได้ แต่ด้วยอัตราเร่งที่ลดลง — ข้อมูลนี้มาจากโครงสร้างของ oscillator โดยตรง</div>
          </div>
          <div className="body-txt">
            <p>ต่างจากเครื่องมือใน S2 ที่อิงทฤษฎีโครงสร้าง divergence มี<b>กลไกทางคณิตศาสตร์รองรับโดยตรง</b>: oscillator อย่าง RSI หรือ MACD คำนวณจากอัตราการเปลี่ยนแปลงของราคาในช่วงหลัง เมื่อราคาทำจุดสูงใหม่แต่ oscillator ทำจุดสูงที่ต่ำลง ความหมายที่แท้จริงคือ <b>การขึ้นรอบหลังมีอัตราเร่งน้อยกว่ารอบก่อน</b> — แรงผลักดันของฝั่งซื้อกำลังลดลง แม้ราคายังไปต่อได้</p>
            <p>การเปรียบเทียบที่ตรงกับกลไก: วัตถุที่ยังเคลื่อนที่ขึ้นแต่ความเร่งลดลง ยังไปต่อได้อีกระยะหนึ่งก่อนหยุด — divergence จึงเป็น<b>สัญญาณเตือนล่วงหน้า (leading warning)</b> ไม่ใช่สัญญาณกลับตัวทันที ระยะห่างระหว่างคำเตือนกับการกลับตัวจริงไม่แน่นอน และบางครั้งการกลับตัวไม่เกิดขึ้นเลย — ข้อจำกัดนี้กำหนดวิธีใช้ทั้งหมดในบทถัด ๆ ไป</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Divergence = อัตราเร่งของราคาลดลง — เป็นคำเตือนล่วงหน้าที่ไม่ระบุเวลา ไม่ใช่สัญญาณกลับตัวทันที</p></div>
        </div>

        {/* L2 regular */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>Regular Divergence — สัญญาณเตือนการกลับตัว</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_REGULAR }} />
            <div className="figcap">สองด้านของ regular divergence: ราคาทำจุดสุดขั้วใหม่ แต่โมเมนตัมไม่ยืนยัน</div>
          </div>
          <div className="body-txt">
            <p><b>Regular bearish divergence</b>: ราคาทำ Higher High แต่ oscillator ทำ Lower High — การขึ้นรอบล่าสุดอ่อนแรงกว่ารอบก่อน เป็นคำเตือนของขาขึ้น · <b>Regular bullish divergence</b>: ราคาทำ Lower Low แต่ oscillator ทำ Higher Low — การลงรอบล่าสุดอ่อนแรงกว่า เป็นคำเตือนของขาลง</p>
            <p>รายละเอียดการอ่านที่ถูกต้อง: (1) เปรียบเทียบ<b>จุด swing ที่มีนัย</b>ตามนิยามระดับ 5.1 เท่านั้น — ไม่ใช่ยอดเล็ก ๆ ทุกยอด (2) จุด swing ของราคากับของ oscillator ต้อง<b>เป็นคู่เหตุการณ์เดียวกัน</b>ตามแนวเวลา (3) divergence ที่พาดผ่านจุด swing สามจุดขึ้นไป (triple divergence) มีน้ำหนักมากกว่าสองจุด เพราะแสดงการอ่อนแรงต่อเนื่องหลายรอบ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Regular = ราคาทำจุดสุดขั้วใหม่ แต่โมเมนตัมไม่ยืนยัน — เทียบเฉพาะ swing ที่มีนัย และต้องเป็นคู่เหตุการณ์เดียวกัน</p></div>
        </div>

        {/* L3 hidden */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>Hidden Divergence — สัญญาณต่อเนื่องของแนวโน้ม</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_HIDDEN }} />
            <div className="figcap">ราคาย่อตื้น (HL) ขณะโมเมนตัมคายแรงลึก (LL) — แนวโน้มขาขึ้นยังแข็งแรง</div>
          </div>
          <div className="body-txt">
            <p><b>Hidden divergence</b> คือภาพกลับด้านของ regular และให้สัญญาณตรงข้าม: ในแนวโน้มขาขึ้น ราคาย่อลงทำจุดต่ำที่<b>สูงขึ้น</b> (Higher Low — โครงสร้างขาขึ้นยังอยู่) ขณะที่ oscillator ลงไปทำจุดต่ำที่<b>ต่ำลง</b> (Lower Low) — การตีความ: โมเมนตัมถูกคายออกเต็มรอบแล้ว แต่ราคาย่อเพียงตื้น แสดงว่าแรงซื้อเชิงโครงสร้างยังแข็งแรง เป็น<b>สัญญาณต่อเนื่องของแนวโน้มเดิม</b> ไม่ใช่การกลับตัว</p>
            <p>คุณค่าเชิงปฏิบัติ: hidden divergence ทำงาน<b>ร่วมทิศกับแนวโน้ม</b> จึงสอดคล้องกับหลัก &quot;timeframe ใหญ่ชนะเสมอ&quot; ของระดับ 5.3 โดยธรรมชาติ — ใช้เป็นหลักฐานเสริมยืนยันการเข้าตามแนวโน้มที่จุดย่อ (ซึ่งเป็น setup หลักของระบบคุณอยู่แล้ว) ในขณะที่ regular divergence ชวนให้เทรดสวนแนวโน้มซึ่งมีเงื่อนไขเข้มงวดกว่ามาก — สำหรับผู้เริ่มใช้ divergence hidden จึงเป็นชนิดที่ปลอดภัยกว่าในการฝึก</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Hidden = สัญญาณต่อเนื่องของแนวโน้ม ทำงานร่วมทิศกับระบบหลัก — เหมาะฝึกก่อน regular ซึ่งชวนสวนแนวโน้ม</p></div>
        </div>

        {/* L4 context */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>★ เงื่อนไขการใช้: บริบทตัดสินน้ำหนักของสัญญาณ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CONTEXT }} />
            <div className="figcap">สัญญาณเดียวกัน — ที่โซนสำคัญมีน้ำหนัก กลางแนวโน้มแรงล้มเหลวซ้ำได้เรื่อย ๆ</div>
          </div>
          <div className="body-txt">
            <p>ข้อผิดพลาดหลักของผู้ใช้ divergence คือการปฏิบัติต่อมันเป็นสัญญาณเข้าโดยลำพัง — ในแนวโน้มที่แรง divergence <b>ปรากฏแล้วล้มเหลวซ้ำได้ต่อเนื่องหลายรอบ</b> (กลไกเดียวกับ RSI ที่ค้างเขต overbought ในระดับ 3.1): โมเมนตัมชะลอชั่วคราวแล้วเร่งใหม่ ราคาไปต่อ ผู้ที่เข้าสวนเพราะเห็น divergence เพียงอย่างเดียวจึงขาดทุนซ้ำในทิศทางเดียวกัน</p>
            <p>เงื่อนไขที่ทำให้สัญญาณมีน้ำหนักจริง มีสามข้อและควรครบทั้งหมด: (1) <b>ตำแหน่ง</b> — เกิดที่โซนสำคัญจากระบบหลัก (supply/demand, แนวจากระดับ 5.1) ไม่ใช่กลางที่ว่าง (2) <b>Timeframe</b> — สัญญาณบน H4/D1 มีความหมายมากกว่า M15 อย่างมีนัย เพราะ noise น้อยกว่า (3) <b>Trigger โครงสร้าง</b> — รอการยืนยันจากราคาเสมอ: แท่งกลับตัวที่ชัดเจน หรือ BOS ของโครงสร้างย่อย (ระดับ 5.2) — divergence บอกว่า &quot;ควรเฝ้าระวังบริเวณนี้&quot; ราคาเท่านั้นที่บอกว่า &quot;เกิดขึ้นแล้ว&quot;</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>สามเงื่อนไขต้องครบ: ที่โซนสำคัญ · timeframe ใหญ่พอ · มี trigger จากราคา — ขาดข้อใด สัญญาณไม่มีน้ำหนักพอจะเข้า</p></div>
        </div>

        {/* L5 playbook */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>Playbook: ตารางการใช้งานสรุป</h2></div>
          <div className="body-txt">
            <p>สรุปการใช้ divergence ทั้งหมดในตารางเดียว:</p>
            <div className="calc c4">
              <div className="crow head"><span>ชนิด</span><span>รูปแบบ</span><span>ความหมาย</span><span className="v">การใช้</span></div>
              <div className="crow"><span className="k">Regular bearish</span><span>ราคา HH · RSI LH</span><span>ขาขึ้นอ่อนแรง</span><span className="v warn">เตือน — งดเพิ่มไม้ long / เฝ้าหา trigger สวนที่โซน</span></div>
              <div className="crow"><span className="k">Regular bullish</span><span>ราคา LL · RSI HL</span><span>ขาลงอ่อนแรง</span><span className="v warn">เตือน — เฝ้าหา trigger ที่ demand zone</span></div>
              <div className="crow hl"><span className="k">Hidden bullish</span><span>ราคา HL · RSI LL</span><span>ขาขึ้นยังแข็งแรง</span><span className="v pos">ยืนยันการเข้าตามแนวโน้มที่จุดย่อ</span></div>
              <div className="crow"><span className="k">Hidden bearish</span><span>ราคา LH · RSI HH</span><span>ขาลงยังแข็งแรง</span><span className="v pos">ยืนยันการเข้าตามแนวโน้มที่จุดเด้ง</span></div>
              <div className="crow stop"><span className="k">ทุกชนิด</span><span>โดยลำพัง ไม่มีโซน/trigger</span><span>น้ำหนักไม่พอ</span><span className="v neg">ไม่เข้าไม้</span></div>
            </div>
            <p>ตำแหน่งของ divergence ในระบบโดยรวมของคุณ: มันคือ<b>ชั้นข้อมูลยืนยัน (confirmation layer)</b> ที่วางบนโครงสร้างและโซนจากระดับ 5 — ไม่ใช่ระบบใหม่แยกต่างหาก ทุกไม้ที่ใช้ divergence ประกอบ ยังคงผ่านสูตรขนาดไม้และเกณฑ์ R:R ของระดับ 4 ตามปกติ และควรบันทึกใน journal ว่าไม้ใดใช้สัญญาณนี้ประกอบ — เพื่อให้สถิติของคุณเองตอบได้ในอนาคตว่ามันเพิ่ม expectancy จริงหรือไม่</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">วิชาถัดไป</span>
              <p>วิชาสุดท้ายของคอร์สซัมเมอร์เปลี่ยนระดับของเกม — <b><a href="/grade/manual-to-systematic">S4 จาก Manual สู่ Systematic</a></b>: เส้นทางจากการกดออเดอร์เอง สู่ระบบที่ทำงานแทนคุณ</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Divergence คือชั้นยืนยันบนระบบหลัก ไม่ใช่ระบบใหม่ — และให้ journal ของคุณตัดสินว่ามันเพิ่ม expectancy จริงหรือไม่</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · คอร์สซัมเมอร์ S3 (Premium)
      </div>
    </>
  );
}
