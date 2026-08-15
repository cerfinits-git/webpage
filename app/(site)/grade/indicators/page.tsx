import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 3 · อินดิเคเตอร์หลัก — MA, RSI, MACD, ATR · Cerfinits Grade",
  description:
    "Moving Averages, RSI, MACD, Bollinger Bands และ ATR — พร้อมคำเตือนกำกับทุกตัว: อินดิเคเตอร์คือคณิตศาสตร์ของราคาย้อนหลัง ไม่ใช่เครื่องมือพยากรณ์อนาคต",
  alternates: { canonical: "/grade/indicators" },
};

const SVG_LAG = `<svg viewBox="0 0 660 170" role="img" aria-label="อินดิเคเตอร์ตามหลังราคา">
  <polyline points="40,120 100,58 160,112 230,48 300,104 370,44 440,98 510,54 580,92 620,66" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <polyline points="40,132 110,104 180,96 260,82 340,86 420,74 500,78 580,74 620,74" fill="none" stroke="var(--gold)" stroke-width="2.5"/>
  <text class="t-sm" x="46" y="24">เส้นดำ = ราคา · เส้นทอง = อินดิเคเตอร์ (ตามหลัง)</text>
  <text class="t-xs t-gold" x="614" y="90" text-anchor="end">ช้ากว่าราคาเสมอ</text>
</svg>`;

const SVG_MA = `<svg viewBox="0 0 660 190" role="img" aria-label="moving average เป็นแนวรับเคลื่อนที่">
  <line x1="40" y1="158" x2="620" y2="64" stroke="var(--gold)" stroke-width="2.5"/>
  <text class="t-sm t-gold" x="300" y="150">เส้น MA — แนวรับเคลื่อนที่ในเทรนด์ขึ้น</text>
  <polyline points="40,150 110,112 170,140 250,92 320,118 400,74 480,100 560,56 620,74" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
  <circle cx="170" cy="140" r="4" fill="var(--up)"/><circle cx="320" cy="118" r="4" fill="var(--up)"/><circle cx="480" cy="100" r="4" fill="var(--up)"/>
</svg>`;

const SVG_RSI = `<svg viewBox="0 0 660 220" role="img" aria-label="RSI ค้าง overbought ในเทรนด์แรง">
  <text class="t-xs" x="46" y="20">ราคา (เทรนด์ขึ้นแรง)</text>
  <polyline points="40,92 140,78 240,64 340,52 440,42 540,34 620,30" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="40" y1="108" x2="620" y2="108" stroke="var(--hair-2)" stroke-width="1"/>
  <rect x="40" y="120" width="580" height="86" fill="none" stroke="var(--hair-2)" stroke-width="1"/>
  <line x1="40" y1="140" x2="620" y2="140" stroke="var(--down)" stroke-width="1" stroke-dasharray="5 3"/>
  <text class="t-xs t-down" x="34" y="144" text-anchor="end">70</text>
  <line x1="40" y1="186" x2="620" y2="186" stroke="var(--up)" stroke-width="1" stroke-dasharray="5 3"/>
  <text class="t-xs t-up" x="34" y="190" text-anchor="end">30</text>
  <polyline points="40,150 140,134 240,130 340,128 440,127 540,126 620,126" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <text class="t-xs t-gold" x="614" y="120" text-anchor="end">RSI ค้างเหนือ 70</text>
</svg>`;

const SVG_MACD = `<svg viewBox="0 0 660 190" role="img" aria-label="MACD line signal histogram">
  <line x1="40" y1="110" x2="620" y2="110" stroke="var(--hair-2)" stroke-width="1"/>
  <rect x="70" y="110" width="16" height="26" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1"/>
  <rect x="110" y="110" width="16" height="34" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1"/>
  <rect x="150" y="110" width="16" height="20" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1"/>
  <rect x="330" y="86" width="16" height="24" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1"/>
  <rect x="370" y="72" width="16" height="38" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1"/>
  <rect x="410" y="80" width="16" height="30" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1"/>
  <rect x="450" y="94" width="16" height="16" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1"/>
  <polyline points="60,140 160,132 260,120 300,104 360,80 460,86 560,96" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <polyline points="60,128 160,126 260,122 360,110 460,98 560,94" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <circle cx="288" cy="112" r="5" fill="var(--up)"/>
  <text class="t-xs t-up" x="288" y="60" text-anchor="middle">ตัดขึ้น = สัญญาณ</text>
</svg>`;

const SVG_BB = `<svg viewBox="0 0 660 180" role="img" aria-label="bollinger bands">
  <polyline points="40,74 200,68 340,46 480,26 620,32" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <polyline points="40,100 200,106 340,128 480,150 620,144" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <polyline points="40,58 130,92 220,70 320,100 420,72 520,110 600,80" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
  <text class="t-xs" x="120" y="150" text-anchor="middle">บีบแคบ = เงียบ</text>
  <text class="t-xs" x="520" y="170" text-anchor="middle">ขยาย = ผันผวนสูง</text>
</svg>`;

const SVG_ATR = `<svg viewBox="0 0 660 190" role="img" aria-label="ATR วัดความผันผวนเป็นระยะ SL">
  <text class="t-sm t-up" x="165" y="24" text-anchor="middle">ตลาดเงียบ (ATR ต่ำ)</text>
  <line x1="110" y1="70" x2="110" y2="110" stroke="var(--up)" stroke-width="1.5"/><rect x="102" y="82" width="16" height="16" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="150" y1="74" x2="150" y2="114" stroke="var(--up)" stroke-width="1.5"/><rect x="142" y="86" width="16" height="18" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="190" y1="72" x2="190" y2="108" stroke="var(--up)" stroke-width="1.5"/><rect x="182" y="82" width="16" height="16" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1.5"/>
  <line x1="240" y1="70" x2="240" y2="112" stroke="var(--gold)" stroke-width="1.5"/><text class="t-xs t-gold" x="256" y="94">SL แคบ</text>
  <line x1="330" y1="30" x2="330" y2="170" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-down" x="495" y="24" text-anchor="middle">ตลาดผันผวน (ATR สูง)</text>
  <line x1="430" y1="44" x2="430" y2="132" stroke="var(--down)" stroke-width="1.5"/><rect x="422" y="62" width="16" height="42" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.5"/>
  <line x1="480" y1="52" x2="480" y2="140" stroke="var(--down)" stroke-width="1.5"/><rect x="472" y="72" width="16" height="44" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.5"/>
  <line x1="530" y1="40" x2="530" y2="128" stroke="var(--down)" stroke-width="1.5"/><rect x="522" y="60" width="16" height="40" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1.5"/>
  <line x1="580" y1="44" x2="580" y2="140" stroke="var(--gold)" stroke-width="1.5"/><text class="t-xs t-gold" x="596" y="96">SL กว้าง</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 3 · หมวด 3.1</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">อินดิเคเตอร์หลัก</span>
        <h1>เครื่องมือวัดราคา — และคำเตือนที่มากับทุกตัว</h1>
        <p className="lead">
          อินดิเคเตอร์คือ<b>คณิตศาสตร์ของราคาย้อนหลัง</b> ไม่ใช่เครื่องมือพยากรณ์อนาคต หมวดนี้สอนตัวหลักที่ควรรู้จัก
          (MA, RSI, MACD, Bollinger, ATR) พร้อมกำกับตรง ๆ ว่าแต่ละตัว<b>บอกอะไรได้และบอกอะไรไม่ได้</b>
        </p>
      </div>

      <div className="wrap">
        {/* L1 */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>อินดิเคเตอร์คืออะไร — และข้อจำกัดที่ต้องรู้</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_LAG }} />
            <div className="figcap">ทุกอินดิเคเตอร์คำนวณจากราคาที่ผ่านไปแล้ว — จึง &quot;ตามหลัง&quot; เสมอ</div>
          </div>
          <div className="body-txt">
            <p>อินดิเคเตอร์คือสูตรที่เอา &quot;ราคาในอดีต&quot; มาคำนวณเป็นเส้นหรือค่าที่อ่านง่ายขึ้น — มันช่วย<b>สรุปภาพ</b>ได้ดี แต่เพราะมันมาจากอดีต มันจึง<b>ตามหลังราคาเสมอ</b> (lagging) ไม่มีตัวไหนทำนายอนาคตได้จริง</p>
            <p><b>กฎการใช้ของเรา:</b> อินดิเคเตอร์เป็นตัว &quot;ยืนยัน&quot; สิ่งที่เห็นจากราคา/แนวรับต้าน ไม่ใช่ตัว &quot;สั่ง&quot; ให้เข้าเทรด และยิ่งใส่เยอะยิ่งขัดกันเอง — เลือกไม่กี่ตัวที่เข้าใจจริงดีกว่ากองเป็นสิบ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>อินดิเคเตอร์ = สรุปอดีต ใช้ยืนยัน ไม่ใช่ทำนาย · น้อยแต่เข้าใจ ดีกว่าเยอะแต่มั่ว</p></div>
        </div>

        {/* L2 MA */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>Moving Averages — หาเทรนด์และแนวรับเคลื่อนที่</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_MA }} />
            <div className="figcap">ในเทรนด์ ราคามักเคารพเส้น MA เหมือนแนวรับ/ต้านที่เลื่อนตาม</div>
          </div>
          <div className="body-txt">
            <p><b>Moving Average</b> คือค่าเฉลี่ยราคาย้อนหลัง N แท่ง ทำให้เห็นทิศชัดขึ้นโดยกรอง noise — <b>SMA</b> เฉลี่ยแบบเท่ากันทุกแท่ง, <b>EMA</b> ให้น้ำหนักแท่งล่าสุดมากกว่า (ไวกว่า) ในเทรนด์ ราคามักใช้ MA เป็นแนวรับ/ต้านเคลื่อนที่</p>
            <p>เมื่อ MA เร็วตัดขึ้นเหนือ MA ช้า เรียก <b>Golden Cross</b> (ตัดลงเรียก Death Cross) — เป็นสัญญาณเทรนด์คลาสสิก แต่<b>ตามหลัง</b>: กว่าจะตัด เทรนด์มักไปไกลแล้ว ใช้เป็นตัวยืนยันทิศ ไม่ใช่จุดเข้าเป๊ะ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>MA = ทิศเทรนด์ + แนวรับเคลื่อนที่ · cross ยืนยันช้า อย่าใช้เป็นจุดเข้าเดียว</p></div>
        </div>

        {/* L3 RSI */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>★ RSI — และความเข้าใจผิดที่ทำคนเจ็บที่สุด</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RSI }} />
            <div className="figcap">RSI &gt; 70 ในเทรนด์แรง = ตลาด &quot;แข็งแรง&quot; ไม่ใช่ &quot;ต้องขาย&quot;</div>
          </div>
          <div className="body-txt">
            <p><b>RSI</b> วัดความแรงของการขึ้น/ลงเป็นค่า 0–100 ตำราบอก &quot;เกิน 70 = overbought (ซื้อมากไป), ต่ำกว่า 30 = oversold&quot; — และนี่คือจุดที่มือใหม่เจ็บหนักที่สุด</p>
            <p className="pull">&quot;Overbought&quot; ไม่ได้แปลว่า &quot;ต้องขาย&quot; — ในเทรนด์แรง RSI ค้างเหนือ 70 ได้เป็นสัปดาห์</p>
            <p>คนที่ &quot;short เพราะ RSI ถึง 70&quot; ในเทรนด์ขาขึ้นแรง คือคนที่สู้กับเทรนด์แล้วโดนลากเจ็บ — RSI มีค่ามากกว่าตอนใช้ดู <b>divergence</b> (ราคาขึ้นแต่ RSI ไม่ขึ้นตาม = โมเมนตัมอ่อน) ซึ่งเราจะลงลึกในหมวด 3.3</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>อย่าสวนเทรนด์เพราะ RSI แตะ 70/30 — มันค้างสุดขั้วได้นานในเทรนด์แรง</p></div>
        </div>

        {/* L4 MACD */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>MACD — วัดโมเมนตัมและการเปลี่ยนทิศ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_MACD }} />
            <div className="figcap">เส้นตัดกันและแท่ง histogram บอก &quot;โมเมนตัมกำลังเปลี่ยนข้าง&quot;</div>
          </div>
          <div className="body-txt">
            <p><b>MACD</b> คือผลต่างของ EMA สองเส้น บอกโมเมนตัม — เมื่อเส้น MACD ตัดเหนือเส้น signal = โมเมนตัมเริ่มเป็นขาขึ้น (และกลับกัน) ส่วนแท่ง histogram ยิ่งยาว = แรงยิ่งมาก, ยิ่งหด = แรงกำลังอ่อน</p>
            <p>เหมือน MA — MACD <b>ตามหลัง</b> ใช้ยืนยันทิศและจับจังหวะโมเมนตัมเปลี่ยน แต่ในตลาด sideways มันให้สัญญาณหลอกเยอะ ต้องดูบริบทว่ากำลังเทรนด์หรือแกว่ง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>MACD = โมเมนตัม · เวิร์คในเทรนด์ หลอกบ่อยตอน sideways</p></div>
        </div>

        {/* L5 BB + ADX */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>Bollinger Bands &amp; ADX — วัดความผันผวนและความแรงเทรนด์</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_BB }} />
            <div className="figcap">Bollinger Bands = ซองรอบราคาที่กว้าง/แคบตามความผันผวน</div>
          </div>
          <div className="body-txt">
            <p><b>Bollinger Bands</b> คือซอง ±ส่วนเบี่ยงเบนรอบเส้น MA — บีบแคบเมื่อตลาดเงียบ (มักตามด้วยการระเบิดออก) และขยายเมื่อผันผวนสูง มันบอก &quot;ความผันผวน&quot; ได้ดี แต่ระวังกับดัก &quot;ราคาแตะขอบบน = ต้องขาย&quot; — ในเทรนด์แรง ราคาเดินตามขอบได้ยาว (เหมือน RSI)</p>
            <p><b>ADX</b> เป็นอีกตัวที่มีประโยชน์: มันวัด &quot;ความแรงของเทรนด์&quot; (ไม่บอกทิศ) — ADX สูง = เทรนด์ชัด ควรเทรดตามเทรนด์, ADX ต่ำ = ตลาดแกว่ง ควรเปลี่ยนกลยุทธ์</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>BB = ความผันผวน · ADX = เทรนด์แรงแค่ไหน · ทั้งคู่บอก &quot;สภาพตลาด&quot; ไม่ใช่จุดเข้า</p></div>
        </div>

        {/* L6 ATR */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>★ ATR — ตัวที่น่าเบื่อที่สุดแต่มีประโยชน์ที่สุด</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_ATR }} />
            <div className="figcap">ATR บอกว่าตลาดขยับวันละกี่ดอลลาร์ — เอาไว้ตั้ง SL ให้พอดีกับความผันผวน</div>
          </div>
          <div className="body-txt">
            <p><b>ATR (Average True Range)</b> ไม่มีสัญญาณซื้อขาย ไม่มีเส้นตัดกัน — มันแค่บอก &quot;โดยเฉลี่ยราคาขยับกี่ดอลลาร์ต่อแท่ง&quot; ฟังดูน่าเบื่อ แต่นี่คือตัวที่มีประโยชน์จริงที่สุดในหมวดนี้</p>
            <p>เพราะมันตอบคำถามที่สำคัญกว่า &quot;เข้าตรงไหน&quot; คือ <b>&quot;ตั้ง SL ห่างเท่าไหร่ถึงจะไม่โดนกวาดเพราะ noise ปกติ&quot;</b> — ตลาดผันผวนสูง (ATR สูง) ต้องตั้ง SL กว้างขึ้น ไม่งั้นโดนเขี่ยออกทั้งที่ยังถูกทาง เรื่องนี้คือหัวใจของ<b>ระดับ 4 (การบริหารความเสี่ยง)</b></p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>รู้จักอินดิเคเตอร์แล้ว หมวด <b><a href="/grade/chart-patterns">3.2 Chart Patterns</a></b> จะดูรูปแบบราคาที่เกิดซ้ำ — พร้อมความจริงเรื่อง &quot;อัตราสำเร็จ&quot; ที่วัดได้ vs ที่เล่าต่อกันมา</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ATR ไม่ให้สัญญาณเข้า แต่บอก &quot;ตั้ง SL กว้างแค่ไหน&quot; — มีค่าที่สุดตอนคุมความเสี่ยง</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 3 หมวด 3.1
      </div>
    </>
  );
}
