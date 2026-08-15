import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ซัมเมอร์ S2 · Elliott Wave & Harmonic Patterns — โครงสร้างคลื่นและสัดส่วน · Cerfinits Grade",
  description:
    "Premium: โครงสร้างคลื่น 5-3, กฎสามข้อของ Elliott, ข้อจำกัดเชิงปฏิบัติ (ความเป็นอัตวิสัยของการนับ), ABCD และ Gartley พร้อมสัดส่วน Fibonacci และแนวทางการใช้อย่างมีเงื่อนไข",
  alternates: { canonical: "/grade/elliott-harmonics" },
};

const SVG_WAVES = `<svg viewBox="0 0 660 260" role="img" aria-label="โครงสร้างคลื่น 5-3 ของ Elliott">
  <polyline points="40,220 120,140 160,175 250,80 300,120 380,50" fill="none" stroke="var(--up)" stroke-width="2"/>
  <polyline points="380,50 430,110 470,85 530,150" fill="none" stroke="var(--down)" stroke-width="2"/>
  <text class="t-md t-up" x="120" y="128" text-anchor="middle">1</text>
  <text class="t-md t-up" x="160" y="196" text-anchor="middle">2</text>
  <text class="t-md t-up" x="250" y="68" text-anchor="middle">3</text>
  <text class="t-md t-up" x="300" y="140" text-anchor="middle">4</text>
  <text class="t-md t-up" x="380" y="38" text-anchor="middle">5</text>
  <text class="t-md t-down" x="430" y="130" text-anchor="middle">A</text>
  <text class="t-md t-down" x="470" y="72" text-anchor="middle">B</text>
  <text class="t-md t-down" x="530" y="170" text-anchor="middle">C</text>
  <text class="t-xs t-up" x="180" y="240" text-anchor="middle">ชุดขับเคลื่อน (impulse) 5 คลื่น</text>
  <text class="t-xs t-down" x="480" y="200" text-anchor="middle">ชุดปรับฐาน (corrective) 3 คลื่น</text>
</svg>`;

const SVG_RULES = `<svg viewBox="0 0 660 250" role="img" aria-label="กฎสามข้อของ Elliott Wave">
  <polyline points="40,210 115,135 152,168 240,75 288,112 365,45" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <text class="t-xs" x="115" y="124" text-anchor="middle">1</text>
  <text class="t-xs" x="152" y="188" text-anchor="middle">2</text>
  <text class="t-xs" x="240" y="63" text-anchor="middle">3</text>
  <text class="t-xs" x="288" y="132" text-anchor="middle">4</text>
  <text class="t-xs" x="365" y="33" text-anchor="middle">5</text>
  <line x1="40" y1="210" x2="200" y2="210" stroke="var(--down)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text class="t-xs t-down" x="44" y="230" text-anchor="start">กฎ 1: คลื่น 2 ห้ามต่ำกว่าจุดเริ่มคลื่น 1</text>
  <line x1="115" y1="135" x2="330" y2="135" stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text class="t-xs t-gold" x="334" y="139" text-anchor="start">กฎ 3: คลื่น 4 ห้ามทับพื้นที่คลื่น 1</text>
  <rect class="chip-n" x="420" y="70" width="216" height="96" rx="3"/>
  <text class="t-sm" x="528" y="98" text-anchor="middle">กฎ 2: คลื่น 3 ต้องไม่ใช่</text>
  <text class="t-sm" x="528" y="120" text-anchor="middle">คลื่นที่สั้นที่สุด</text>
  <text class="t-xs" x="528" y="146" text-anchor="middle">ในบรรดาคลื่น 1 · 3 · 5</text>
</svg>`;

const SVG_COUNTS = `<svg viewBox="0 0 660 240" role="img" aria-label="ราคาเดียวกัน นับคลื่นได้สองแบบ">
  <text class="t-sm" x="165" y="24" text-anchor="middle">นักวิเคราะห์ A</text>
  <polyline points="40,190 90,140 120,160 180,90 220,120 290,60" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
  <text class="t-xs t-up" x="90" y="130" text-anchor="middle">1</text>
  <text class="t-xs t-up" x="120" y="178" text-anchor="middle">2</text>
  <text class="t-xs t-up" x="180" y="78" text-anchor="middle">3</text>
  <text class="t-xs t-up" x="220" y="140" text-anchor="middle">4</text>
  <text class="t-xs t-up" x="290" y="48" text-anchor="middle">5 · &quot;ใกล้จบรอบ&quot;</text>
  <line x1="330" y1="30" x2="330" y2="210" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm" x="495" y="24" text-anchor="middle">นักวิเคราะห์ B — ราคาเดียวกัน</text>
  <polyline points="370,190 420,140 450,160 510,90 550,120 620,60" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
  <text class="t-xs t-gold" x="420" y="130" text-anchor="middle">(i)</text>
  <text class="t-xs t-gold" x="450" y="178" text-anchor="middle">(ii)</text>
  <text class="t-xs t-gold" x="510" y="78" text-anchor="middle">(iii) ของคลื่น 1 ใหญ่</text>
  <text class="t-xs t-gold" x="595" y="48" text-anchor="middle">&quot;เพิ่งเริ่มรอบ&quot;</text>
  <text class="t-xs t-down" x="330" y="232" text-anchor="middle">ทั้งสองการนับถูกต้องตามกฎ — แต่นำไปสู่ข้อสรุปตรงข้ามกัน</text>
</svg>`;

const SVG_GARTLEY = `<svg viewBox="0 0 660 260" role="img" aria-label="โครงสร้าง Gartley XABCD">
  <polyline points="60,210 200,60 290,150 380,90 500,190" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <text class="t-md" x="60" y="232" text-anchor="middle">X</text>
  <text class="t-md" x="200" y="48" text-anchor="middle">A</text>
  <text class="t-md" x="290" y="172" text-anchor="middle">B</text>
  <text class="t-md" x="380" y="78" text-anchor="middle">C</text>
  <text class="t-md t-gold" x="500" y="212" text-anchor="middle">D</text>
  <line x1="60" y1="210" x2="200" y2="60" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 3"/>
  <text class="t-xs" x="240" y="118" text-anchor="middle">B ≈ 0.618 ของ XA</text>
  <rect x="450" y="170" width="120" height="40" fill="var(--gold-tint)" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-gold" x="510" y="236" text-anchor="middle">D ≈ 0.786 ของ XA = โซนกลับตัวที่คาด (PRZ)</text>
  <polyline points="500,190 550,150 600,120" fill="none" stroke="var(--up)" stroke-width="2" stroke-dasharray="6 3"/>
</svg>`;

const SVG_USAGE = `<svg viewBox="0 0 660 210" role="img" aria-label="ใช้เป็นน้ำหนักเสริมที่โซนที่มีเหตุผลอยู่แล้ว">
  <line x1="60" y1="130" x2="600" y2="130" stroke="var(--up)" stroke-width="2" stroke-dasharray="6 3"/>
  <text class="t-xs t-up" x="64" y="150">Demand zone (ระดับ 5.1)</text>
  <rect x="330" y="112" width="150" height="36" fill="var(--gold-tint)" stroke="var(--gold)" stroke-width="1.5"/>
  <text class="t-xs t-gold" x="405" y="104" text-anchor="middle">จุด D ของ harmonic มาบรรจบ</text>
  <circle cx="405" cy="130" r="6" fill="var(--gold)"/>
  <text class="t-xs" x="405" y="176" text-anchor="middle">+ เลขกลม + trigger ตามระบบ → จึงพิจารณาเข้า</text>
  <text class="t-sm" x="330" y="36" text-anchor="middle">หลักฐานหลายชั้นที่อิสระต่อกัน มาบรรจบที่บริเวณเดียว (confluence — ระดับ 3.3)</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>คอร์สซัมเมอร์ · S2 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Elliott Wave &amp; Harmonic Patterns</span>
        <h1>โครงสร้างคลื่นและสัดส่วน — พร้อมข้อจำกัดที่ต้องทราบก่อนใช้</h1>
        <p className="lead">
          สองแนวคิดนี้ได้รับความนิยมสูงและมีผู้ใช้จำนวนมากทั่วโลก หมวดนี้สอนโครงสร้างหลักให้ครบถ้วน
          พร้อมสิ่งที่หลักสูตรอื่นมักไม่กล่าวถึง: <b>ข้อจำกัดเชิงการทดสอบ</b>ของเครื่องมือทั้งสอง
          และเงื่อนไขการใช้ที่เหมาะสมภายใต้กรอบ evidence-first ของหลักสูตรนี้
        </p>
      </div>

      <div className="wrap">
        {/* L1 structure */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>Elliott Wave: โครงสร้างคลื่น 5-3</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_WAVES }} />
            <div className="figcap">แนวคิดหลัก: ตลาดเคลื่อนที่เป็นชุดขับเคลื่อน 5 คลื่นตามแนวโน้ม สลับกับชุดปรับฐาน 3 คลื่น</div>
          </div>
          <div className="body-txt">
            <p>ทฤษฎีของ Ralph Nelson Elliott (ทศวรรษ 1930) เสนอว่าการเคลื่อนที่ของตลาดมีโครงสร้างซ้ำ: <b>ชุดขับเคลื่อน (impulse)</b> ประกอบด้วย 5 คลื่นตามทิศแนวโน้ม — คลื่น 1, 3, 5 เคลื่อนตามทิศ คั่นด้วยคลื่นปรับ 2 และ 4 — ตามด้วย<b>ชุดปรับฐาน (corrective)</b> 3 คลื่นสวนทิศ เรียก A-B-C</p>
            <p>คุณสมบัติสำคัญของทฤษฎีคือความเป็น fractal: แต่ละคลื่นประกอบด้วยคลื่นย่อยที่มีโครงสร้างเดียวกันใน timeframe ที่เล็กลง — คลื่น 1 ในกราฟรายวัน ประกอบด้วยชุด 5 คลื่นย่อยในกราฟรายชั่วโมง ซ้อนกันเป็นชั้น แนวคิดนี้สอดคล้องกับหลัก multiple timeframe ของระดับ 5.3 ในแง่ที่โครงสร้างเล็กประกอบกันเป็นโครงสร้างใหญ่</p>
            <p>คุณค่าเชิงกรอบคิดที่ยอมรับได้โดยไม่ต้องเชื่อทฤษฎีทั้งหมด: แนวโน้มไม่เคลื่อนที่เป็นเส้นตรง — มันเดินหน้าแล้วพักสลับกัน ซึ่งตรงกับพฤติกรรม retracement ที่คุณศึกษาจากข้อมูลจริงมาแล้วในระดับ 5</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>โครงสร้าง 5-3: ขับเคลื่อน 5 คลื่น สลับปรับฐาน 3 คลื่น และซ้อนกันเป็นชั้นแบบ fractal</p></div>
        </div>

        {/* L2 rules */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>กฎสามข้อ — ส่วนที่เป็นกติกาแน่นอนของทฤษฎี</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RULES }} />
            <div className="figcap">การนับที่ละเมิดข้อใดข้อหนึ่ง ถือว่าผิดทันทีตามทฤษฎี — นี่คือจุด invalidation ที่ชัดเจน</div>
          </div>
          <div className="body-txt">
            <p>ทฤษฎีมีส่วนที่เป็นกฎแน่นอนเพียงสามข้อ: (1) <b>คลื่น 2 ต้องไม่ย่อลงต่ำกว่าจุดเริ่มต้นของคลื่น 1</b> (2) <b>คลื่น 3 ต้องไม่ใช่คลื่นที่สั้นที่สุด</b>ในบรรดาคลื่นขับเคลื่อน 1, 3, 5 — ในทางปฏิบัติคลื่น 3 มักยาวที่สุด (3) <b>คลื่น 4 ต้องไม่ทับซ้อนเขตราคาของคลื่น 1</b> (ในตลาดส่วนใหญ่)</p>
            <p>นอกเหนือจากสามข้อนี้ ส่วนที่เหลือของทฤษฎีเป็น &quot;แนวโน้มที่พบบ่อย&quot; (guidelines) เช่น สัดส่วน Fibonacci ระหว่างคลื่น หรือการสลับรูปแบบของคลื่นปรับ — ไม่ใช่กติกาบังคับ ความแตกต่างนี้สำคัญ: <b>กฎใช้ตัดการนับที่ผิดออกได้ แต่ guidelines ยืนยันการนับที่ถูกไม่ได้</b></p>
            <p>ประโยชน์เชิงปฏิบัติที่จับต้องได้ที่สุดของกฎสามข้อ: มันสร้าง<b>จุด invalidation ที่ชัดเจน</b> — หากเข้าสถานะบนสมมติฐานว่ากำลังอยู่ในคลื่น 3 แล้วราคาเคลื่อนจนละเมิดกฎ สมมติฐานนั้นผิดอย่างเป็นทางการ ตำแหน่ง SL จึงมีเหตุผลรองรับ สอดคล้องกับหลักการวาง SL จากโครงสร้างของระดับ 4.2</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>กฎจริงมีสามข้อ ที่เหลือคือแนวโน้มที่พบบ่อย — คุณค่าหลักของกฎคือจุด invalidation ที่ชัดเจนสำหรับวาง SL</p></div>
        </div>

        {/* L3 limitations */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>★ ข้อจำกัดเชิงปฏิบัติ: ความเป็นอัตวิสัยของการนับ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_COUNTS }} />
            <div className="figcap">ราคาชุดเดียวกัน นับได้สองแบบที่ถูกกฎทั้งคู่ — แต่ให้ข้อสรุปตรงข้ามกัน</div>
          </div>
          <div className="body-txt">
            <p>นี่คือบทที่ทำให้หมวดนี้แตกต่างจากคอร์ส Elliott ทั่วไป และจำเป็นต้องกล่าวอย่างตรงไปตรงมา: <b>ปัญหาหลักของ Elliott Wave ในทางปฏิบัติคือความเป็นอัตวิสัยของการนับคลื่น</b> — เนื่องจากกฎบังคับมีเพียงสามข้อ ราคาชุดเดียวกันจึงมักรองรับการนับหลายแบบที่ถูกกฎพร้อมกัน โดยแต่ละแบบนำไปสู่การพยากรณ์ที่ต่างกันหรือตรงข้ามกัน และผู้นับมักทราบว่าการนับใดถูกต้อง<b>หลังจาก</b>เหตุการณ์จบลงแล้ว</p>
            <p>ในภาษาของระดับ 7: การนับคลื่น<b>ไม่ผ่านเกณฑ์ two-readers test</b> — ผู้วิเคราะห์สองคนที่ใช้กฎเดียวกันบนกราฟเดียวกัน ได้ข้อสรุปต่างกันได้โดยไม่มีผู้ใดผิดกติกา คุณสมบัตินี้ทำให้การ backtest อย่างเป็นกลางทำได้ยากมาก และเป็นเหตุผลที่หลักฐานเชิงประจักษ์ของทฤษฎีนี้ยังไม่มีข้อสรุป — ไม่ใช่เพราะมีผู้พิสูจน์ว่าผิด แต่เพราะ<b>นิยามที่ไม่ชัดพอจะพิสูจน์ได้ทั้งสองทาง</b></p>
            <p>ข้อสรุปของหลักสูตรนี้จึงไม่ใช่การห้ามใช้ แต่คือการจัดตำแหน่งให้ถูกต้อง: Elliott เหมาะเป็น<b>กรอบอ่านบริบท</b> (ตลาดน่าจะอยู่ช่วงต้นหรือปลายของรอบ ควรรุกหรือควรระวัง) — ไม่เหมาะเป็นระบบเข้าไม้หลัก ระบบหลักของคุณควรยังคงเป็นโครงสร้าง + โซน + trigger จากระดับ 5 ที่นิยามได้ชัดและทดสอบได้</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>การนับคลื่นไม่ผ่าน two-readers test — ใช้เป็นกรอบอ่านบริบทได้ แต่ไม่ควรใช้เป็นระบบเข้าไม้หลัก</p></div>
        </div>

        {/* L4 harmonics */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>Harmonic Patterns: ABCD และ Gartley</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_GARTLEY }} />
            <div className="figcap">Gartley: โครงสร้าง XABCD ที่แต่ละขาสัมพันธ์กันด้วยสัดส่วน Fibonacci — จุด D คือโซนกลับตัวที่คาด (PRZ)</div>
          </div>
          <div className="body-txt">
            <p>Harmonic patterns คือรูปแบบราคาที่นิยามด้วย<b>สัดส่วน Fibonacci ระหว่างขา</b> (ต่อยอดจากระดับ 3.3): รูปแบบพื้นฐานคือ <b>ABCD</b> — ขา CD สัมพันธ์กับขา AB ตามสัดส่วนที่กำหนด — และรูปแบบที่รู้จักกว้างขวางที่สุดคือ <b>Gartley (XABCD)</b>: จุด B ย่อประมาณ 0.618 ของขา XA และจุด D สิ้นสุดประมาณ 0.786 ของ XA บริเวณที่สัดส่วนหลายค่ามาบรรจบใกล้จุด D เรียกว่า <b>PRZ (Potential Reversal Zone)</b> — โซนที่คาดว่าราคาจะกลับตัว</p>
            <p>จุดแข็งของ harmonic เมื่อเทียบกับ Elliott: <b>นิยามเป็นตัวเลขที่วัดได้มากกว่า</b> — สัดส่วนระบุชัด จึงเขียนเป็นกฎที่ใกล้เคียงความเป็นกลางได้ และให้จุด invalidation ตามธรรมชาติ: หากราคาผ่านจุด D เกินระยะที่กำหนด รูปแบบล้มเหลวอย่างชัดเจน SL จึงวางได้สั้นและมีเหตุผล · จุดอ่อนที่ยังคงอยู่: การเลือกจุด swing เริ่มต้น (X, A) ยังมีความเป็นอัตวิสัยบางส่วน และอัตราความสำเร็จที่อ้างกันทั่วไปส่วนใหญ่ไม่ได้มาจากการทดสอบที่ตรวจสอบได้ (หลักการเดียวกับหมวด 3.2)</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Harmonic นิยามด้วยสัดส่วนที่วัดได้ จึงทดสอบได้ดีกว่า Elliott — จุดแข็งจริงคือ SL สั้นที่จุด invalidation ชัดเจน</p></div>
        </div>

        {/* L5 usage playbook */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>Playbook: เงื่อนไขการใช้ภายใต้กรอบของหลักสูตร</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_USAGE }} />
            <div className="figcap">ตำแหน่งที่เหมาะสม: เป็นหลักฐานเสริมที่โซนซึ่งมีเหตุผลจากระบบหลักอยู่แล้ว</div>
          </div>
          <div className="body-txt">
            <p>สรุปแนวทางการใช้ทั้งสองเครื่องมือให้สอดคล้องกับระบบที่คุณสร้างจากระดับ 5–7:</p>
            <div className="calc c3">
              <div className="crow head"><span>เครื่องมือ</span><span>ใช้เป็น</span><span className="v">ไม่ควรใช้เป็น</span></div>
              <div className="crow"><span className="k">Elliott Wave</span><span>กรอบอ่านบริบทของรอบตลาด · จุด invalidation จากกฎ 3 ข้อ</span><span className="v neg">ระบบเข้าไม้หลัก · เหตุผลเดียวของการตัดสินใจ</span></div>
              <div className="crow"><span className="k">Harmonic (PRZ)</span><span>หลักฐานเสริมเมื่อ D บรรจบกับโซนของระบบหลัก · กรอบวาง SL สั้น</span><span className="v neg">สัญญาณเข้าโดยลำพัง โดยไม่มี trigger</span></div>
              <div className="crow hl"><span className="k">ทั้งสอง</span><span>น้ำหนักเพิ่มใน confluence (3.3)</span><span className="v">ทุกไม้ยังต้องผ่านเกณฑ์ความเสี่ยงระดับ 4</span></div>
            </div>
            <p>หลักการปิดหมวด: เครื่องมือที่นิยามไม่ชัดพอจะทดสอบ ไม่ได้ไร้ค่าเสมอไป — แต่<b>น้ำหนักที่ให้กับเครื่องมือใด ต้องสอดคล้องกับหลักฐานที่เครื่องมือนั้นมี</b> ใช้เป็นข้อมูลประกอบได้ ใช้เป็นรากฐานของการตัดสินใจไม่ได้ และหากพบว่าตนเองอธิบายการเข้าไม้ด้วยการนับคลื่นเพียงอย่างเดียว นั่นคือสัญญาณให้กลับไปทบทวนระบบหลักจากระดับ 7</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">วิชาถัดไป</span>
              <p>เครื่องมือเสริมตัวถัดไปมีหลักฐานเชิงกลไกที่ชัดกว่า — <b><a href="/grade/divergence-deep">S3 Divergence เจาะลึก</a></b>: การอ่านความขัดแย้งระหว่างราคากับโมเมนตัมอย่างเป็นระบบ</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ใช้เป็นน้ำหนักเสริมใน confluence เท่านั้น — น้ำหนักของเครื่องมือต้องสอดคล้องกับหลักฐานที่เครื่องมือนั้นมี</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · คอร์สซัมเมอร์ S2 (Premium)
      </div>
    </>
  );
}
