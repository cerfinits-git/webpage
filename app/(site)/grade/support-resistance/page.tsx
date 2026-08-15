import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 2 · แนวรับแนวต้าน — หา 'ที่' ที่มีความหมาย · Cerfinits Grade",
  description:
    "แนวรับแนวต้าน, เส้นเทรนด์, โซนไม่ใช่เส้น, role reversal, เลขกลม และสองวิธีเทรด (เด้ง/ทะลุ) — เล่าเป็นภาพ",
  alternates: { canonical: "/grade/support-resistance" },
};

const SVG_SR = `<svg viewBox="0 0 660 220" role="img" aria-label="แนวรับแนวต้าน">
  <line x1="40" y1="52" x2="620" y2="52" stroke="var(--down)" stroke-width="2" stroke-dasharray="6 3"/>
  <text class="t-sm t-down" x="44" y="42">แนวต้าน (Resistance) — เพดานที่ราคาถูกตีกลับ</text>
  <line x1="40" y1="176" x2="620" y2="176" stroke="var(--up)" stroke-width="2" stroke-dasharray="6 3"/>
  <text class="t-sm t-up" x="44" y="200">แนวรับ (Support) — พื้นที่ราคาถูกดันขึ้น</text>
  <polyline points="40,168 130,60 220,168 320,58 420,170 520,56 610,120" fill="none" stroke="var(--ink)" stroke-width="2"/>
</svg>`;

const SVG_TREND = `<svg viewBox="0 0 660 200" role="img" aria-label="เส้นเทรนด์และช่องเทรนด์">
  <line x1="50" y1="178" x2="610" y2="70" stroke="var(--up)" stroke-width="2"/>
  <text class="t-sm t-up" x="120" y="185">เส้นเทรนด์ขาขึ้น (ลากใต้จุดต่ำที่สูงขึ้นเรื่อย ๆ)</text>
  <line x1="50" y1="120" x2="610" y2="12" stroke="var(--hair-2)" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text class="t-xs" x="470" y="30">ช่องเทรนด์ (channel)</text>
  <polyline points="60,168 130,120 200,150 280,100 360,132 440,84 520,110 600,64" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
</svg>`;

const SVG_ZONE = `<svg viewBox="0 0 660 190" role="img" aria-label="แนวรับเป็นโซนไม่ใช่เส้น">
  <rect x="40" y="96" width="580" height="34" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1"/>
  <text class="t-sm t-up" x="46" y="152">โซน — ราคาแตะเข้ามาแล้วเด้ง ไม่ต้องเป๊ะทีเดียว</text>
  <polyline points="40,60 120,124 200,66 300,128 400,70 500,122 600,60" fill="none" stroke="var(--ink)" stroke-width="2"/>
</svg>`;

const SVG_REVERSAL = `<svg viewBox="0 0 660 200" role="img" aria-label="role reversal แนวต้านกลายเป็นแนวรับ">
  <line x1="40" y1="100" x2="620" y2="100" stroke="var(--gold)" stroke-width="2"/>
  <polyline points="40,150 110,104 180,150 250,106 320,60 400,104 470,60 540,102 600,70" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <line x1="300" y1="30" x2="300" y2="170" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-xs t-down" x="160" y="40" text-anchor="middle">เคยเป็นแนวต้าน (ตีกลับ)</text>
  <text class="t-xs t-up" x="470" y="40" text-anchor="middle">ทะลุแล้วกลายเป็นแนวรับ</text>
  <text class="t-xs t-gold" x="300" y="190" text-anchor="middle">จุดทะลุ</text>
</svg>`;

const SVG_PSYCH = `<svg viewBox="0 0 660 190" role="img" aria-label="เลขกลม psychological levels">
  <line x1="40" y1="44" x2="620" y2="44" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-gold" x="624" y="48" text-anchor="end">2700</text>
  <line x1="40" y1="96" x2="620" y2="96" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-gold" x="624" y="100" text-anchor="end">2650</text>
  <line x1="40" y1="148" x2="620" y2="148" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-gold" x="624" y="152" text-anchor="end">2600</text>
  <polyline points="40,140 120,100 200,150 300,98 380,50 460,98 540,144 600,100" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <text class="t-sm" x="46" y="180">ราคามักเคารพ &quot;เลขกลม&quot; เพราะคนทั้งตลาดจับตาเลขเดียวกัน</text>
</svg>`;

const SVG_BOUNCE_BREAK = `<svg viewBox="0 0 660 200" role="img" aria-label="เด้งกับทะลุ">
  <text class="t-sm t-up" x="165" y="24" text-anchor="middle">เด้ง (Bounce)</text>
  <line x1="40" y1="60" x2="290" y2="60" stroke="var(--down)" stroke-width="2" stroke-dasharray="5 3"/>
  <polyline points="60,150 120,74 165,64 210,110 270,150" fill="none" stroke="var(--up)" stroke-width="2"/>
  <path d="M210,110 L206,96 M210,110 L222,104" fill="none" stroke="var(--up)" stroke-width="2"/>
  <text class="t-xs" x="165" y="176" text-anchor="middle">เข้าตอนราคาถูกตีกลับที่แนว</text>
  <line x1="330" y1="30" x2="330" y2="180" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-down" x="495" y="24" text-anchor="middle">ทะลุ (Break)</text>
  <line x1="380" y1="90" x2="630" y2="90" stroke="var(--down)" stroke-width="2" stroke-dasharray="5 3"/>
  <polyline points="400,150 460,110 505,92 545,64 600,44" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <text class="t-xs" x="500" y="176" text-anchor="middle">เข้าตอนราคาทะลุแนวไปต่อ</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 2 · หมวด 2.2</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">แนวรับแนวต้าน</span>
        <h1>หา &quot;ที่&quot; ที่มีความหมายบนกราฟ</h1>
        <p className="lead">
          แนวรับแนวต้านคือแนวคิดที่สำคัญที่สุดในการอ่านกราฟ — มันคือ &quot;ที่&quot; ที่ทำให้แพทเทิร์นในหมวดก่อนมีความหมาย
          หมวดนี้สอนวาดมันให้ไม่มั่ว มองเป็นโซน และแยกสองสถานการณ์: ราคา<b>เด้ง</b>กับราคา<b>ทะลุ</b>
        </p>
      </div>

      <div className="wrap">
        {/* L1 */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>แนวรับ / แนวต้าน คืออะไร</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SR }} />
            <div className="figcap">พื้นกับเพดานของราคา — จุดที่คนในตลาดเคยตัดสินใจซื้อ/ขายซ้ำ ๆ</div>
          </div>
          <div className="body-txt">
            <p><b>แนวรับ (Support)</b> คือระดับที่ราคาเคยลงไปแล้วมีแรงซื้อดันกลับขึ้น เหมือน &quot;พื้น&quot; · <b>แนวต้าน (Resistance)</b> คือระดับที่ราคาขึ้นไปแล้วมีแรงขายตีกลับลง เหมือน &quot;เพดาน&quot;</p>
            <p>ทำไมมันเกิดซ้ำ? เพราะคนทั้งตลาด<b>จำระดับเดิมได้</b>และตัดสินใจคล้าย ๆ กันเมื่อราคากลับมา — มันจึงกลายเป็น &quot;ความทรงจำร่วม&quot; ที่ทำให้ราคามีจุดอ้างอิง ไม่ได้วิ่งมั่ว</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>S = พื้น (แรงซื้อ), R = เพดาน (แรงขาย) — เกิดซ้ำเพราะคนจำระดับเดิมได้</p></div>
        </div>

        {/* L2 trend line */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>เส้นเทรนด์และช่องเทรนด์</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_TREND }} />
            <div className="figcap">แนวรับ/ต้านไม่จำเป็นต้องแนวนอน — ในเทรนด์ มันเอียงตามทิศ</div>
          </div>
          <div className="body-txt">
            <p>เมื่อตลาดเป็นเทรนด์ แนวรับแนวต้านจะเอียงตาม — ลากเส้นใต้ &quot;จุดต่ำที่สูงขึ้นเรื่อย ๆ&quot; ได้<b>เส้นเทรนด์ขาขึ้น</b> (ทำหน้าที่เป็นแนวรับเคลื่อนที่) ลากเส้นขนานด้านบนได้ &quot;ช่องเทรนด์ (channel)&quot; ที่ราคามักวิ่งอยู่ในกรอบ</p>
            <p><b>ข้อควรระวัง:</b> เส้นเทรนด์ที่ดีควรมีจุดสัมผัสอย่างน้อย 2-3 จุด อย่าลากเส้นให้เข้ากับสิ่งที่อยากเห็น — นั่นคือการหลอกตัวเอง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ในเทรนด์ แนวรับ/ต้านเอียงตามทิศ — ต้องมีจุดสัมผัสจริง ไม่ใช่ลากตามใจ</p></div>
        </div>

        {/* L3 zone */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>โซน ไม่ใช่เส้น</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_ZONE }} />
            <div className="figcap">แนวที่ดีคือ &quot;บริเวณ&quot; — ราคาไม่เคยกลับตัวที่จุดเดิมเป๊ะทุกครั้ง</div>
          </div>
          <div className="body-txt">
            <p>ข้อผิดพลาดของมือใหม่คือวาดแนวเป็น &quot;เส้นบางเป๊ะ&quot; แล้วหงุดหงิดเมื่อราคาทะลุนิดหน่อยแล้วเด้ง ความจริงคือแนวรับแนวต้านเป็น <b>โซน (บริเวณ)</b> เพราะคนในตลาดตัดสินใจที่ &quot;แถว ๆ&quot; ระดับนั้น ไม่ใช่ตัวเลขเดียว</p>
            <p>มองเป็นโซนช่วยสองอย่าง: ไม่ตกใจเมื่อราคาแทงไส้เกินแนวเล็กน้อย และวาง SL ได้สมเหตุผลขึ้น (เผื่อระยะโซน ไม่ใช่ชิดเส้นจนโดนกวาดง่าย)</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>คิดเป็นโซน ไม่ใช่เส้น — ราคาแทงเกินนิดหน่อยเป็นเรื่องปกติ</p></div>
        </div>

        {/* L4 role reversal */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>Role Reversal — แนวต้านที่แตกกลายเป็นแนวรับ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_REVERSAL }} />
            <div className="figcap">พอราคาทะลุแนวต้านขึ้นไป แนวเดิมมักกลับมาทำหน้าที่เป็นแนวรับ</div>
          </div>
          <div className="body-txt">
            <p>เมื่อราคา<b>ทะลุ</b>แนวต้านขึ้นไปได้จริง แนวเดิมมักเปลี่ยนบทบาทเป็น &quot;แนวรับ&quot; เมื่อราคาย้อนกลับมาทดสอบ (และกลับกันสำหรับแนวรับที่ถูกทะลุลง) — นี่คือหนึ่งในจังหวะเข้าที่คลาสสิกที่สุด เพราะเป็นการยืนยันว่าแนวนั้นเปลี่ยนมือแล้วจริง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ทะลุแล้วย้อนมาทดสอบ = จังหวะที่ดี เพราะยืนยันการเปลี่ยนมือ</p></div>
        </div>

        {/* L5 psychological */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>เลขกลม — แนวที่มองไม่เห็นแต่ทุกคนจับตา</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_PSYCH }} />
            <div className="figcap">ทองคำมักเคารพเลขกลม (2600, 2650, 2700) เพราะคนทั้งตลาดตั้งออเดอร์ที่ระดับเดียวกัน</div>
          </div>
          <div className="body-txt">
            <p>ระดับราคาที่เป็น &quot;เลขกลม&quot; (เช่น ทอง 2650, 2700) มักทำหน้าที่เป็นแนวรับแนวต้านทั้งที่ไม่มีอะไรพิเศษทางเทคนิค — เพราะมัน<b>เป็นจุดที่คนทั้งตลาดจับตาและตั้งออเดอร์ไว้พร้อมกัน</b> (SL, TP, เป้าหมายทางจิตวิทยา)</p>
            <p>ประโยชน์: เอาเลขกลมมาซ้อนกับแนวเทคนิคอื่น ยิ่งหลายเหตุผลชนกันที่ระดับเดียว แนวนั้นยิ่งน่าเชื่อถือ (เรื่อง &quot;ซ้อนหลักฐาน&quot; นี้จะลงลึกในระดับสูงขึ้น)</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เลขกลมคือแนวจิตวิทยา — ทองเคารพมันบ่อย เพราะทุกคนดูเลขเดียวกัน</p></div>
        </div>

        {/* L6 bounce vs break */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>สองวิธีเทรดกับแนว: เด้ง vs ทะลุ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_BOUNCE_BREAK }} />
            <div className="figcap">ทุกครั้งที่ราคาเจอแนว มันทำได้ 2 อย่าง — เด้งกลับ หรือ ทะลุไป</div>
          </div>
          <div className="body-txt">
            <p>เมื่อราคาเข้าหาแนว มันจบได้ 2 ทาง: <b>เด้ง (Bounce)</b> — ถูกตีกลับ เราเทรดตามการกลับตัว หรือ <b>ทะลุ (Break)</b> — ผ่านไปได้ เราเทรดตามการไปต่อ ปัญหาคือ<b>เราไม่รู้ล่วงหน้าว่าจะเป็นแบบไหน</b></p>
            <p>นี่คือเหตุผลที่เราไม่ &quot;เดา&quot; แต่<b>รอการยืนยัน</b> — เช่น รอแท่งปิดเลยแนว (สำหรับ break) หรือรอแท่งกลับตัวที่แนว (สำหรับ bounce) การรอยืนยันแลกด้วยการเข้าช้าลงนิดหน่อย แต่ลดการโดนหลอกได้มาก</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>อ่านกราฟด้วยเทคนิคเป็นแล้ว หมวด <b><a href="/grade/three-analyses">2.3 สามสายการวิเคราะห์</a></b> จะถอยมามองภาพใหญ่ว่า technical เป็นแค่ 1 ใน 3 สาย — และสายไหน &quot;ดีที่สุด&quot; คือคำถามที่ผิด</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เจอแนว = เด้งหรือทะลุ · เราไม่เดา — รอยืนยันก่อนเข้าเสมอ</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 2 หมวด 2.2
      </div>
    </>
  );
}
