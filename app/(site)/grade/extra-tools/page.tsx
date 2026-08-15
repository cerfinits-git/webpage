import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 3 · เครื่องมือเสริม — Fibonacci, Pivot, Divergence · Cerfinits Grade",
  description:
    "Fibonacci Retracement/Extension, Pivot Points, Divergence และแนวคิด 'confluence ที่ถูกต้อง — ไม่ใช่การใช้เครื่องมือซ้ำซ้อน' — เล่าเป็นภาพ",
  alternates: { canonical: "/grade/extra-tools" },
};

const SVG_FIB = `<svg viewBox="0 0 660 200" role="img" aria-label="fibonacci retracement">
  <polyline points="60,175 300,45" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="300" y1="45" x2="620" y2="45" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 3"/>
  <text class="t-xs" x="624" y="49" text-anchor="end">0%</text>
  <line x1="300" y1="95" x2="620" y2="95" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 3"/>
  <text class="t-xs" x="624" y="99" text-anchor="end">0.382</text>
  <rect x="300" y="112" width="320" height="28" fill="var(--gold-tint)"/>
  <line x1="300" y1="112" x2="620" y2="112" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text class="t-xs t-gold" x="624" y="116" text-anchor="end">0.5</text>
  <line x1="300" y1="140" x2="620" y2="140" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text class="t-xs t-gold" x="624" y="144" text-anchor="end">0.618</text>
  <line x1="300" y1="175" x2="620" y2="175" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 3"/>
  <text class="t-xs" x="624" y="179" text-anchor="end">100%</text>
  <polyline points="300,45 350,86 400,120 450,134 510,96 600,52" fill="none" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs t-gold" x="330" y="132">โซนทอง (0.5–0.618)</text>
</svg>`;

const SVG_FIBEXT = `<svg viewBox="0 0 660 180" role="img" aria-label="fibonacci extension เป้าทำกำไร">
  <polyline points="50,140 150,60 230,100 320,45" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="50" y1="100" x2="620" y2="100" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 3"/>
  <text class="t-xs" x="56" y="94">จุดย่อ</text>
  <polyline points="320,45 400,80 480,50 560,28" fill="none" stroke="var(--up)" stroke-width="2"/>
  <line x1="320" y1="30" x2="620" y2="30" stroke="var(--up)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-up" x="624" y="34" text-anchor="end">1.618 = เป้า TP</text>
  <text class="t-xs" x="120" y="30">Extension = ฉายเป้าเลยจุดเดิม</text>
</svg>`;

const SVG_PIVOT = `<svg viewBox="0 0 660 190" role="img" aria-label="pivot points">
  <line x1="120" y1="34" x2="620" y2="34" stroke="var(--down)" stroke-width="1.2" stroke-dasharray="4 3"/><text class="t-xs t-down" x="112" y="38" text-anchor="end">R2</text>
  <line x1="120" y1="66" x2="620" y2="66" stroke="var(--down)" stroke-width="1.2" stroke-dasharray="4 3"/><text class="t-xs t-down" x="112" y="70" text-anchor="end">R1</text>
  <line x1="120" y1="98" x2="620" y2="98" stroke="var(--gold)" stroke-width="2"/><text class="t-xs t-gold" x="112" y="102" text-anchor="end">Pivot</text>
  <line x1="120" y1="130" x2="620" y2="130" stroke="var(--up)" stroke-width="1.2" stroke-dasharray="4 3"/><text class="t-xs t-up" x="112" y="134" text-anchor="end">S1</text>
  <line x1="120" y1="162" x2="620" y2="162" stroke="var(--up)" stroke-width="1.2" stroke-dasharray="4 3"/><text class="t-xs t-up" x="112" y="166" text-anchor="end">S2</text>
  <polyline points="150,110 220,70 290,104 360,64 430,100 500,132 570,96" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
</svg>`;

const SVG_DIVERGENCE = `<svg viewBox="0 0 660 210" role="img" aria-label="bearish divergence">
  <text class="t-xs" x="46" y="18">ราคา</text>
  <polyline points="40,90 150,54 250,84 380,40 460,86" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="150" y1="54" x2="380" y2="40" stroke="var(--down)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text class="t-xs t-down" x="265" y="34" text-anchor="middle">ยอดสูงขึ้น ↑</text>
  <line x1="40" y1="108" x2="620" y2="108" stroke="var(--hair-2)" stroke-width="1"/>
  <text class="t-xs" x="46" y="128">RSI</text>
  <polyline points="40,170 150,138 250,166 380,152 460,178" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <line x1="150" y1="138" x2="380" y2="152" stroke="var(--down)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text class="t-xs t-down" x="265" y="200" text-anchor="middle">ยอดต่ำลง ↓ = โมเมนตัมอ่อน</text>
</svg>`;

const SVG_CONFLUENCE2 = `<svg viewBox="0 0 660 200" role="img" aria-label="confluence ที่ถูกต้อง เทียบกับการใช้เครื่องมือซ้ำซ้อน">
  <text class="t-sm t-up" x="165" y="22" text-anchor="middle">Confluence ✓</text>
  <line x1="60" y1="110" x2="270" y2="110" stroke="var(--gold)" stroke-width="2.5"/>
  <text class="t-xs" x="66" y="70">แนวรับ</text>
  <text class="t-xs" x="66" y="90">Fib 0.618</text>
  <text class="t-xs" x="66" y="150">เลขกลม 2650</text>
  <path d="M120,96 L150,108 M150,132 L120,120" fill="none" stroke="var(--hair-2)" stroke-width="1"/>
  <text class="t-xs t-up" x="165" y="180" text-anchor="middle">หลายเหตุผลชนที่จุดเดียว</text>
  <line x1="330" y1="30" x2="330" y2="180" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-down" x="495" y="22" text-anchor="middle">เครื่องมือซ้ำซ้อน ✕</text>
  <polyline points="380,120 430,60 470,140 520,80 560,150 600,70" fill="none" stroke="var(--muted)" stroke-width="1"/>
  <polyline points="380,80 430,140 480,70 530,150 580,90" fill="none" stroke="var(--muted)" stroke-width="1"/>
  <polyline points="380,150 440,90 490,160 540,100 600,150" fill="none" stroke="var(--muted)" stroke-width="1"/>
  <text class="t-xs t-down" x="495" y="180" text-anchor="middle">อินดิเคเตอร์ 10 ตัวขัดกันเอง</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 3 · หมวด 3.3</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">เครื่องมือเสริม</span>
        <h1>Fibonacci, Pivot, Divergence — และวิธีรวมทุกอย่างให้มีเหตุผล</h1>
        <p className="lead">
          ปิดกล่องเครื่องมือ Technical ด้วยตัวช่วยยอดนิยม — พร้อมแนวคิดที่สำคัญกว่าเครื่องมือใด ๆ:
          การ &quot;ซ้อนหลักฐาน&quot; อย่างมีเหตุผล (confluence) ที่<b>ไม่ใช่การยำอินดิเคเตอร์รวมมิตร</b>
        </p>
      </div>

      <div className="wrap">
        {/* L1 fib retracement */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>Fibonacci Retracement — หาโซนย่อที่น่าเข้า</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_FIB }} />
            <div className="figcap">โซน 0.5–0.618 (&quot;โซนทอง&quot;) คือบริเวณที่ราคามักย่อลงมาแล้วไปต่อ</div>
          </div>
          <div className="body-txt">
            <p><b>Fibonacci Retracement</b> ลากจากจุดต่ำไปจุดสูงของการวิ่ง แล้วดูว่าราคาย่อกลับมากี่ % — ระดับ 0.382, 0.5, 0.618 คือจุดที่ราคามักย่อมาแล้วเด้งไปต่อ โดยเฉพาะ &quot;โซนทอง&quot; 0.5–0.618</p>
            <p><b>ทำไมมันเวิร์ค?</b> ไม่ใช่เพราะเลขวิเศษ — แต่เพราะ<b>คนทั้งตลาดใช้เครื่องมือเดียวกันดูระดับเดียวกัน</b> จึงตั้งออเดอร์ที่ระดับนั้นพร้อมกัน กลายเป็น self-fulfilling เหมือนเลขกลมในหมวด 2.2</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Fib เวิร์คเพราะคนดูเหมือนกัน (self-fulfilling) — โซนทอง 0.5–0.618 คือจุดจับตา</p></div>
        </div>

        {/* L2 fib extension */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>Fibonacci Extension — ฉายเป้าทำกำไร</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_FIBEXT }} />
            <div className="figcap">Retracement บอก &quot;เข้าตรงไหน&quot; · Extension บอก &quot;ออกตรงไหน&quot;</div>
          </div>
          <div className="body-txt">
            <p>ถ้า Retracement ช่วยหาจุดเข้า (ราคาย่อ) <b>Extension</b> ช่วยหาจุดออก (เป้าทำกำไร) โดยฉายระดับ 1.272, 1.618 เลยจุดเดิมออกไป — เป็นเป้า TP ที่มีเหตุผลกว่าการเดา &quot;เอากำไรเมื่อพอใจ&quot;</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Extension = เป้า TP ที่คำนวณได้ (1.272 / 1.618) แทนการเดา</p></div>
        </div>

        {/* L3 pivot */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>Pivot Points — แนวรับต้านที่คำนวณล่วงหน้า</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_PIVOT }} />
            <div className="figcap">Pivot คำนวณจากราคาเมื่อวาน — ให้แนวรับต้านของวันนี้ล่วงหน้า</div>
          </div>
          <div className="body-txt">
            <p><b>Pivot Points</b> คำนวณจากสูง-ต่ำ-ปิดของวันก่อนหน้า ได้จุด Pivot (P) กลาง พร้อมแนวต้าน R1/R2 และแนวรับ S1/S2 — ข้อดีคือมันเป็น<b>ระดับที่คำนวณล่วงหน้าได้และคงที่ทั้งวัน</b> เทรดเดอร์สายอินทราเดย์และบอทจำนวนมากใช้กัน จึงเป็นแนวที่ราคามักตอบสนอง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Pivot = แนวรับต้านคำนวณล่วงหน้า คงที่ทั้งวัน — ดีสำหรับ intraday</p></div>
        </div>

        {/* L4 divergence */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>Divergence — เมื่อราคากับโมเมนตัมไม่ไปด้วยกัน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_DIVERGENCE }} />
            <div className="figcap">ราคาทำยอดสูงขึ้น แต่ RSI ทำยอดต่ำลง = แรงกำลังหมด (สัญญาณเตือน)</div>
          </div>
          <div className="body-txt">
            <p><b>Divergence</b> คือเมื่อราคากับอินดิเคเตอร์ (เช่น RSI/MACD) &quot;ไม่ไปทางเดียวกัน&quot; — ราคาทำยอดสูงขึ้น แต่ RSI ทำยอดต่ำลง แปลว่าการขึ้นครั้งหลัง<b>แรงน้อยกว่า</b> โมเมนตัมกำลังอ่อน อาจใกล้กลับตัว นี่คือการใช้ RSI ที่มีค่ากว่าการดู overbought/oversold เฉย ๆ (ตามที่เตือนในหมวด 3.1)</p>
            <p><b>แต่ระวัง:</b> divergence เป็น &quot;สัญญาณเตือน&quot; ไม่ใช่สัญญาณเข้า — ราคาอาจ diverge ต่อได้อีกนาน ต้องรอการยืนยัน (เช่น หลุดแนว) ก่อนเข้าจริง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Divergence = คำเตือนว่าแรงหมด ไม่ใช่สัญญาณเข้า — รอยืนยันก่อน</p></div>
        </div>

        {/* L5 confluence */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>★ Confluence ที่ถูกต้อง — ไม่ใช่การใช้เครื่องมือซ้ำซ้อน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CONFLUENCE2 }} />
            <div className="figcap">ซ้อนหลักฐานที่ &quot;อิสระต่อกัน&quot; ที่จุดเดียว ≠ กองอินดิเคเตอร์ที่คำนวณจากราคาชุดเดิม</div>
          </div>
          <div className="body-txt">
            <p>เมื่อรู้เครื่องมือครบ มือใหม่มักตกหลุม &quot;ยิ่งเยอะยิ่งแม่น&quot; — เปิดอินดิเคเตอร์ 10 ตัว รอให้มันเห็นตรงกัน ปัญหาคือ<b>อินดิเคเตอร์ส่วนใหญ่คำนวณจากราคาชุดเดียวกัน</b> มันจึงบอกเรื่องเดิมซ้ำ ๆ ไม่ใช่หลักฐานใหม่ นั่นคือการใช้เครื่องมือซ้ำซ้อน</p>
            <p className="pull">Confluence ที่แท้จริง = หลักฐาน &quot;อิสระต่อกัน&quot; ที่ชี้ไปจุดเดียว</p>
            <p>ตัวอย่างที่ดี: แนวรับสำคัญ + Fib 0.618 + เลขกลม มาชนที่ราคาเดียวกัน — สามเหตุผลจากคนละที่มา นั่นแข็งแรงกว่าอินดิเคเตอร์สิบตัวที่บอกเรื่องเดียวกัน จำไว้: <b>คุณภาพของเหตุผล ไม่ใช่จำนวน</b></p>
          </div>
          <div className="bridge">
            <span className="bi">✓</span>
            <div>
              <span className="bl">จบระดับ 3 แล้ว</span>
              <p>กล่องเครื่องมือ Technical ครบแล้ว — ต่อไปคือหัวใจของหลักสูตร <b>ระดับ 4: การบริหารความเสี่ยง</b> (กำลังจัดทำ) ที่ทำให้ทุกเครื่องมือข้างต้นมีความหมาย กลับไป <b><a href="/grade">แผนที่หลักสูตร</a></b> ได้ที่หน้าหลัก</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Confluence = หลักฐานอิสระชนจุดเดียว · ไม่ใช่กองอินดิเคเตอร์ที่พูดเรื่องเดิม</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 3 หมวด 3.3
      </div>
    </>
  );
}
