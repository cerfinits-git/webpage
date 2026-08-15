import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 2 · สามสายการวิเคราะห์ — Technical / Fundamental / Sentiment · Cerfinits Grade",
  description:
    "สามสายการวิเคราะห์และทำไม 'สายไหนดีที่สุด' เป็นคำถามที่ผิด — เล่าเป็นภาพ พร้อมแผนการเรียนของ Cerfinits Grade",
  alternates: { canonical: "/grade/three-analyses" },
};

const SVG_3PILLARS = `<svg viewBox="0 0 660 190" role="img" aria-label="สามสายการวิเคราะห์">
  <rect class="chip-n" x="30" y="30" width="185" height="120" rx="3"/>
  <text class="t-md" x="122" y="66" text-anchor="middle">Technical</text>
  <text class="t-sm" x="122" y="94" text-anchor="middle">&quot;ราคาบอกอะไร&quot;</text>
  <text class="t-xs" x="122" y="120" text-anchor="middle">กราฟ · แนวรับต้าน</text>
  <rect class="chip-n" x="237" y="30" width="185" height="120" rx="3"/>
  <text class="t-md" x="329" y="66" text-anchor="middle">Fundamental</text>
  <text class="t-sm" x="329" y="94" text-anchor="middle">&quot;ทำไมราคาขยับ&quot;</text>
  <text class="t-xs" x="329" y="120" text-anchor="middle">ดอกเบี้ย · ข่าว</text>
  <rect class="chip-n" x="444" y="30" width="185" height="120" rx="3"/>
  <text class="t-md" x="536" y="66" text-anchor="middle">Sentiment</text>
  <text class="t-sm" x="536" y="94" text-anchor="middle">&quot;คนอื่นคิดยังไง&quot;</text>
  <text class="t-xs" x="536" y="120" text-anchor="middle">อารมณ์ตลาด · ฝูงชน</text>
</svg>`;

const SVG_CONFLUENCE = `<svg viewBox="0 0 660 240" role="img" aria-label="สามสายเสริมกันไม่ใช่แข่งกัน">
  <circle cx="285" cy="105" r="78" fill="var(--up)" fill-opacity="0.16" stroke="var(--up)" stroke-width="1.5"/>
  <circle cx="375" cy="105" r="78" fill="var(--gold)" fill-opacity="0.16" stroke="var(--gold)" stroke-width="1.5"/>
  <circle cx="330" cy="170" r="78" fill="var(--down)" fill-opacity="0.16" stroke="var(--down)" stroke-width="1.5"/>
  <text class="t-sm t-up" x="235" y="70" text-anchor="middle">Technical</text>
  <text class="t-sm t-gold" x="425" y="70" text-anchor="middle">Fundamental</text>
  <text class="t-sm t-down" x="330" y="220" text-anchor="middle">Sentiment</text>
  <circle cx="330" cy="128" r="7" fill="var(--ink)"/>
  <text class="t-xs" x="330" y="118" text-anchor="middle">ชนกันทั้ง 3</text>
</svg>`;

const SVG_ROADMAP = `<svg viewBox="0 0 660 150" role="img" aria-label="แผนการเรียน">
  <rect class="bar-up" x="30" y="46" width="170" height="58" rx="3"/>
  <text class="t-sm" x="115" y="72" text-anchor="middle">ระดับ 3–4</text>
  <text class="t-xs" x="115" y="90" text-anchor="middle">Technical + Risk</text>
  <path d="M205,75 L240,75 M230,68 L242,75 L230,82" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="bar-gold" x="245" y="46" width="170" height="58" rx="3"/>
  <text class="t-sm" x="330" y="72" text-anchor="middle">ระดับ 6</text>
  <text class="t-xs" x="330" y="90" text-anchor="middle">Macro + Sentiment</text>
  <path d="M420,75 L455,75 M445,68 L457,75 L445,82" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="460" y="46" width="170" height="58" rx="3"/>
  <text class="t-sm" x="545" y="72" text-anchor="middle">รวมเป็น</text>
  <text class="t-xs" x="545" y="90" text-anchor="middle">confluence</text>
  <text class="t-xs" x="330" y="132" text-anchor="middle">เริ่มที่ technical — แต่ไม่จบแค่นั้น</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 2 · หมวด 2.3</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">สามสายการวิเคราะห์</span>
        <h1>3 วิธีมองตลาด — และคำถามที่ทุกคนถามผิด</h1>
        <p className="lead">
          มี 3 สายการวิเคราะห์ที่คนใช้มองตลาด แต่ละสายตอบคนละคำถาม
          หมวดนี้ปูให้เห็นภาพรวมทั้งสาม และเคลียร์ความเข้าใจผิดใหญ่ที่สุด:
          <b>&quot;สายไหนดีที่สุด&quot; คือคำถามที่ผิดตั้งแต่ต้น</b>
        </p>
      </div>

      <div className="wrap">
        {/* L1 */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>สามสาย: Technical / Fundamental / Sentiment</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_3PILLARS }} />
            <div className="figcap">แต่ละสายตอบคนละคำถาม — ไม่ได้ขัดกัน แต่มองคนละมุมของเรื่องเดียวกัน</div>
          </div>
          <div className="body-txt">
            <p>คนมองตลาดด้วย 3 เลนส์: <b>Technical</b> อ่านจากราคาและกราฟ (&quot;ราคากำลังบอกอะไร&quot;) · <b>Fundamental</b> อ่านจากเศรษฐกิจ (&quot;ทำไมราคาถึงขยับ&quot;) · <b>Sentiment</b> อ่านจากอารมณ์ฝูงชน (&quot;ตอนนี้คนส่วนใหญ่คิด/รู้สึกยังไง&quot;)</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>3 สาย = 3 คำถามคนละมุม: ราคาบอกอะไร / ทำไมขยับ / คนคิดยังไง</p></div>
        </div>

        {/* L2 detail */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>เจาะแต่ละสายว่ามองอะไร</h2></div>
          <div className="calc c3">
            <div className="crow head"><span>สาย</span><span>ถามคำถามว่า</span><span>ดูอะไร</span></div>
            <div className="crow"><span className="k">Technical</span><span>ราคาบอกอะไร</span><span>แนวรับต้าน · แพทเทิร์น · อินดิเคเตอร์</span></div>
            <div className="crow"><span className="k">Fundamental</span><span>ทำไมราคาขยับ</span><span>ดอกเบี้ย · เงินเฟ้อ · ข่าว · ธนาคารกลาง</span></div>
            <div className="crow"><span className="k">Sentiment</span><span>คนอื่นคิดยังไง</span><span>COT · ความกลัว/โลภ · ฝูงชนรายย่อย</span></div>
          </div>
          <div className="body-txt">
            <p><b>Technical</b> เชื่อว่า &quot;ทุกอย่างสะท้อนอยู่ในราคาแล้ว&quot; จึงอ่านจากกราฟ — เหมาะกับการหา<b>จังหวะเข้า-ออก</b> · <b>Fundamental</b> อธิบาย<b>ทิศทางระยะยาว</b>ว่าทำไมทองถึงขึ้น (เช่น ดอกเบี้ยลด เงินเฟ้อสูง) · <b>Sentiment</b> เตือนเมื่อฝูงชนสุดขั้ว (เช่น ทุกคนโลภเกินไป มักใกล้จุดกลับตัว)</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Technical = จังหวะ · Fundamental = ทิศทาง · Sentiment = สุดขั้วเมื่อไหร่</p></div>
        </div>

        {/* L3 wrong question */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>&quot;สายไหนดีที่สุด&quot; — คำถามที่ผิด</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CONFLUENCE }} />
            <div className="figcap">ทั้ง 3 ไม่ได้แข่งกัน — จุดที่มันชนกันคือสัญญาณที่แข็งแรงที่สุด (confluence)</div>
          </div>
          <div className="body-txt">
            <p>มือใหม่ชอบถาม &quot;เรียนสายไหนดี technical หรือ fundamental?&quot; — เหมือนถามว่า &quot;หมอควรดูอาการ หรือดูผลแล็บ?&quot; คำตอบคือ<b>ดูทั้งคู่</b> มันตอบคนละคำถาม ไม่ได้แข่งกัน</p>
            <p className="pull">พลังไม่ได้อยู่ที่เลือกสายเดียว — แต่อยู่ตรง &quot;จุดที่ทั้งสามชนกัน&quot;</p>
            <p>เช่น: fundamental บอกทองน่าจะขึ้น (ดอกเบี้ยกำลังลด) + technical เจอราคาที่แนวรับสำคัญ + sentiment บอกฝูงชนเพิ่งขายแพนิก — สามเหตุผลชนกันที่จุดเดียว นั่นคือ <b>confluence</b> ที่แข็งแรงกว่าใช้สายใดสายเดียว</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>อย่าเลือกสายเดียว — หา &quot;จุดที่หลายสายชนกัน&quot; นั่นคือของจริง</p></div>
        </div>

        {/* L4 our plan */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>แผนการเรียนของเรา</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_ROADMAP }} />
            <div className="figcap">เราเริ่มที่ technical เพราะจับต้องได้ก่อน — แต่ไม่หยุดแค่นั้น</div>
          </div>
          <div className="body-txt">
            <p>หลักสูตรนี้เริ่มที่ <b>Technical</b> (ระดับ 3) เพราะมันจับต้องได้และฝึกได้เร็วที่สุด ตามด้วย <b>Risk Management</b> (ระดับ 4) เพื่อให้รอดก่อน แล้วค่อยเปิด <b>Fundamental และ Sentiment</b> (ระดับ 6) เมื่อคุณพร้อมมองภาพใหญ่ — สุดท้ายคือรวมทั้งสามเป็น confluence</p>
            <p>เหตุผลที่ไม่สอน fundamental ก่อน: มันเข้าใจง่ายแต่<b>เอาไปใช้จริงยากถ้ายังอ่านกราฟไม่เป็น</b> — รู้ว่าทองน่าจะขึ้น แต่ไม่รู้จะเข้าตรงไหน ก็ยังขาดทุนได้</p>
          </div>
          <div className="bridge">
            <span className="bi">✓</span>
            <div>
              <span className="bl">จบระดับ 2 แล้ว</span>
              <p>คุณอ่านกราฟและเข้าใจภาพรวมการวิเคราะห์แล้ว — ต่อไปคือ <b>ระดับ 3: กล่องเครื่องมือ Technical</b> (กำลังจัดทำ) กลับไปดู <b><a href="/grade">แผนที่หลักสูตรทั้งหมด</a></b> ได้ที่หน้าหลัก</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เริ่ม technical → รอดด้วย risk → ค่อยเปิดภาพใหญ่ (macro/sentiment)</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 2 หมวด 2.3
      </div>
    </>
  );
}
