import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 1 · Margin & Leverage 101 — เลเวอเรจฉบับเห็นภาพ · Cerfinits Grade",
  description:
    "เลเวอเรจกับมาร์จินฉบับเห็นภาพ: กริด 1:100, บาร์เหวี่ยงสองทาง, Margin Level, และเทรดทองด้วย $100 จริง — ทุกสูตรกลายเป็นภาพ",
  alternates: { canonical: "/grade/margin-leverage" },
};

const SVG_LEV = `<svg viewBox="0 0 660 290" role="img" aria-label="ราคาขยับ 1% ผลต่อพอร์ตที่เลเวอเรจต่างกัน">
  <text class="t-sm" x="330" y="16" text-anchor="middle">ราคาขยับแค่ 1% → ผลต่อพอร์ต (ขาดทุน ◄ | ► กำไร)</text>
  <line x1="330" y1="28" x2="330" y2="256" stroke="var(--ink)" stroke-width="1.5"/>
  <text class="t-md" x="8" y="58">1:10</text>
  <rect class="bar-down" x="305" y="42" width="25" height="26"/><rect class="bar-up" x="330" y="42" width="25" height="26"/>
  <text class="t-xs t-up" x="362" y="59">±10%</text>
  <text class="t-md" x="8" y="106">1:50</text>
  <rect class="bar-down" x="205" y="90" width="125" height="26"/><rect class="bar-up" x="330" y="90" width="125" height="26"/>
  <text class="t-xs t-up" x="462" y="107">±50%</text>
  <text class="t-md" x="8" y="154">1:100</text>
  <rect class="bar-down" x="80" y="138" width="250" height="26"/><rect class="bar-up" x="330" y="138" width="250" height="26"/>
  <text class="t-xs t-down" x="588" y="155">±100%</text>
  <text class="t-md" x="8" y="210">1:500</text>
  <rect class="bar-down" x="80" y="194" width="250" height="26"/><rect class="bar-up" x="330" y="194" width="250" height="26"/>
  <text class="t-xs t-down" x="592" y="211">500%↯</text>
  <text class="t-sm t-down" x="330" y="248" text-anchor="middle">ที่ 1:500 ราคาขยับสวนแค่ 0.2% พอร์ตก็ = 0</text>
</svg>`;

const SVG_EQUITY = `<svg viewBox="0 0 660 180" role="img" aria-label="แถบ Equity แบ่งเป็น Used Margin และ Free Margin">
  <text class="t-sm" x="40" y="34">Equity (มูลค่าพอร์ตจริงตอนนี้) = $95</text>
  <rect class="bar-gold" x="40" y="46" width="70" height="54"/>
  <text class="t-md t-gold" x="75" y="70" text-anchor="middle">Used</text><text class="t-xs" x="75" y="86" text-anchor="middle">$5.30</text>
  <rect class="bar-up" x="110" y="46" width="510" height="54"/>
  <text class="t-md t-up" x="365" y="70" text-anchor="middle">Free Margin</text><text class="t-xs" x="365" y="86" text-anchor="middle">$89.70</text>
  <text class="t-sm" x="40" y="130">◄ ล็อกไว้กับไม้ที่เปิด</text>
  <text class="t-sm" x="620" y="130" text-anchor="end">กันชน + เปิดไม้เพิ่มได้ ►</text>
</svg>`;

const SVG_GAUGE = `<svg viewBox="0 0 660 200" role="img" aria-label="เกจ Margin Level ตกจากปลอดภัยสู่ Stop Out">
  <rect x="60" y="70" width="93" height="34" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1"/>
  <rect x="153" y="70" width="94" height="34" fill="var(--gold-tint)" stroke="var(--gold)" stroke-width="1"/>
  <rect x="247" y="70" width="373" height="34" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1"/>
  <text class="t-xs t-down" x="106" y="92" text-anchor="middle">Stop Out</text>
  <text class="t-xs t-up" x="430" y="92" text-anchor="middle">โซนปลอดภัย</text>
  <line x1="153" y1="64" x2="153" y2="110" stroke="var(--down)" stroke-width="1.5"/>
  <text class="t-sm t-down" x="153" y="128" text-anchor="middle">50%</text><text class="t-xs t-down" x="153" y="143" text-anchor="middle">โบรกปิดไม้</text>
  <line x1="247" y1="64" x2="247" y2="110" stroke="var(--gold)" stroke-width="1.5"/>
  <text class="t-sm t-gold" x="247" y="128" text-anchor="middle">100%</text><text class="t-xs t-gold" x="247" y="143" text-anchor="middle">Margin Call</text>
  <polygon points="330,50 322,64 338,64" fill="var(--ink)"/>
  <text class="t-xs" x="330" y="44" text-anchor="middle">ตอนนี้</text>
  <line x1="300" y1="176" x2="120" y2="176" stroke="var(--down)" stroke-width="1.5"/>
  <polygon points="112,176 124,170 124,182" fill="var(--down)"/>
  <text class="t-xs t-down" x="330" y="180">ยิ่งขาดทุน เข็มยิ่งเลื่อนซ้าย</text>
</svg>`;

const SVG_SURVIVAL = `<svg viewBox="0 0 660 240" role="img" aria-label="เทียบกันชนของ 0.01 lot กับ 0.10 lot">
  <text class="t-sm" x="40" y="24">ระยะที่ “ทองขยับสวนได้” ก่อนโดน Stop Out (บัญชี $100 · 1:500)</text>
  <text class="t-md" x="40" y="66">0.01 lot</text>
  <rect class="bar-up" x="40" y="76" width="545" height="40"/>
  <text class="t-md t-up" x="312" y="101" text-anchor="middle">ทองขยับได้ ~$97 (3.7%)</text>
  <text class="t-md" x="40" y="150">0.10 lot</text>
  <text class="t-xs t-down" x="40" y="166">(ใหญ่ขึ้น 10 เท่า)</text>
  <rect class="bar-down" x="40" y="176" width="41" height="40"/>
  <text class="t-md t-down" x="95" y="201" text-anchor="start">~$7 (0.28%)</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 1 · หมวด 1.3</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Margin &amp; Leverage 101 — คณิตศาสตร์ของดาบสองคม</span>
        <h1>เลเวอเรจ กับ มาร์จิน ฉบับเห็นภาพ</h1>
        <p className="lead">
          หมวดนี้มี “ตัวเลข” — แต่ผมจะไม่ทิ้งสูตรให้คุณท่อง ผมจะทำให้ทุกสูตร<b>กลายเป็นภาพ</b>
          เพราะสิ่งที่ทำให้มือใหม่พอร์ตแตกไม่ใช่กราฟ แต่คือการไม่เข้าใจว่าเลเวอเรจทำงานยังไง — และมันคมทั้งสองด้าน
        </p>
      </div>

      <div className="wrap">
        {/* LESSON 1 — the 1:100 grid (JSX, exactly 100 cells) */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>Margin คืออะไร — คุมของใหญ่ด้วยเงินก้อนเล็ก</h2></div>
          <div className="fig">
            <svg viewBox="0 0 660 300" role="img" aria-label="กริด 100 ช่อง 1 ช่องคือเงินคุณ 99 ช่องคือเลเวอเรจ">
              <rect className="cell-gold" x={20} y={40} width={14} height={14} rx={2} />
              <text className="t-sm" x={42} y={52}>= เงินที่คุณวางเอง (margin) · 1 ช่อง</text>
              <rect className="cell" x={20} y={66} width={14} height={14} rx={2} />
              <text className="t-sm" x={42} y={78}>= พลังที่ยืมมา (leverage) · 99 ช่อง</text>
              <text className="t-lab t-gold" x={112} y={150} textAnchor="middle">1 : 100</text>
              {Array.from({ length: 100 }).map((_, i) => {
                const col = i % 10;
                const row = Math.floor(i / 10);
                return (
                  <rect
                    key={i}
                    className={i === 0 ? "cell-gold" : "cell"}
                    x={256 + col * 26}
                    y={20 + row * 26}
                    width={24}
                    height={24}
                    rx={2}
                  />
                );
              })}
            </svg>
            <div className="figcap">ตาราง 100 ช่อง = ที่เลเวอเรจ 1:100 คุณวางเงินเอง <b>1 ช่อง</b> อีก 99 ช่องคือพลังที่ยืมมา</div>
          </div>
          <div className="body-txt">
            <p>Margin ไม่ใช่ “ค่าธรรมเนียม” และไม่ใช่ “เงินที่เสียไป” — มันคือ<b>เงินมัดจำ</b>ที่โบรกล็อกไว้ เพื่อให้คุณเปิดสถานะที่ใหญ่กว่าเงินในบัญชีได้ พูดง่าย ๆ: เลเวอเรจคือการ “ยืมพลังซื้อ” มาคุมของที่ใหญ่กว่าเงินตัวเอง</p>
            <div className="formula">
              <span className="eq">Margin ที่ต้องใช้ = มูลค่าสถานะ ÷ Leverage</span>
              <span className="fnote">เช่น คุมทองมูลค่า $10,000 ที่ 1:100 → วางจริงแค่ $100 · ที่ 1:500 → วางแค่ $20</span>
            </div>
            <p>ยิ่งเลเวอเรจสูง เงินมัดจำยิ่งน้อย ฟังดูดี — แต่นี่แหละคือกับดัก เพราะการวางเงินน้อยลงไม่ได้แปลว่าความเสี่ยงน้อยลง มันแปลว่าคุณกำลังคุมของที่ใหญ่ขึ้นเมื่อเทียบกับเงินตัวเอง บทต่อไปจะเห็นว่ามันอันตรายยังไง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Margin = เงินมัดจำที่ถูกล็อก · Leverage = พลังที่ยืมมาคุมของใหญ่</p></div>
        </div>

        {/* LESSON 2 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>Leverage: ดาบที่คมทั้งสองด้าน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_LEV }} />
            <div className="figcap">เลเวอเรจไม่ได้เพิ่มแค่กำไร — มันเพิ่ม<b>ขาดทุน</b>เท่ากันเป๊ะทั้งสองด้าน</div>
          </div>
          <div className="body-txt">
            <p>นี่คือความจริงที่โฆษณาไม่เคยบอก: เลเวอเรจ<b>ไม่ได้</b>เพิ่มโอกาสชนะ มันแค่ขยายผลลัพธ์ — ทั้งกำไรและขาดทุน — ด้วยตัวคูณเดียวกัน ที่ 1:100 ราคาขยับ 1% เท่ากับพอร์ตขยับ 100% ที่ 1:500 แค่ 0.2% เงินทุนก็หมด</p>
            <p className="pull">เลเวอเรจสูงไม่ได้ทำให้คุณเก่งขึ้น มันแค่ทำให้คุณ “ผิดพลาดได้สั้นลง”</p>
            <p>โบรกให้ 1:500 หรือ 1:1000 ไม่ใช่เพราะใจดี แต่เพราะยิ่งคุณใช้เลเวอเรจสูง คุณยิ่งเปิดไม้ใหญ่ จ่ายสเปรดมากขึ้น และมีโอกาสสูญเสียเงินทุนทั้งหมดเร็วขึ้น — “เลเวอเรจที่ให้” กับ “เลเวอเรจที่ควรใช้” คนละเรื่องกันโดยสิ้นเชิง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เลเวอเรจขยายทั้งสองทางเท่ากัน — มันคือตัวคูณความเสี่ยง ไม่ใช่ตัวคูณกำไร</p></div>
        </div>

        {/* LESSON 3 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>อ่านหน้าจอให้ออก: 4 คำที่คนสับสนที่สุด</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_EQUITY }} />
            <div className="figcap"><b>Free Margin</b> คือกันชน — เหลือมาก = ทนขาดทุนได้มาก / เหลือน้อย = ใกล้อันตราย</div>
          </div>
          <div className="formula">
            <span className="eq">Equity = Balance + กำไร/ขาดทุนลอยตัว</span>
            <span className="fnote">Free Margin = Equity − Used Margin · Margin Level = (Equity ÷ Used Margin) × 100%</span>
          </div>
          <div className="calc c2">
            <div className="crow head"><span>ตัวอย่าง: บัญชี $100 · เปิดทอง 0.01 lot</span><span className="v">ค่า</span></div>
            <div className="crow"><span className="k">Balance (เงินต้นในบัญชี)</span><span className="v">$100.00</span></div>
            <div className="crow"><span className="k">กำไร/ขาดทุนลอยตัว (ทองลง $5)</span><span className="v neg">−$5.00</span></div>
            <div className="crow"><span className="k">Equity (มูลค่าจริงตอนนี้)</span><span className="v">$95.00</span></div>
            <div className="crow"><span className="k">Used Margin (มัดจำที่ล็อก)</span><span className="v">$5.30</span></div>
            <div className="crow"><span className="k">Free Margin (กันชนที่เหลือ)</span><span className="v">$89.70</span></div>
            <div className="crow hl"><span className="k">Margin Level</span><span className="v">1,792%</span></div>
          </div>
          <div className="body-txt">
            <p>ทั้ง 4 ค่านี้คือแผงแสดงสถานะบัญชีของคุณ — <b>Balance</b> คือเงินต้น, <b>Equity</b> คือมูลค่าจริงเมื่อรวมกำไร/ขาดทุนที่ยังไม่ปิด, <b>Used Margin</b> คือมัดจำที่ถูกล็อก, <b>Free Margin</b> คือส่วนที่เหลือไว้ทนขาดทุนและเปิดไม้เพิ่ม ตัวที่ต้องจับตาที่สุดคือตัวถัดไป: Margin Level</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Equity คือความจริง (Balance โกหกได้ถ้ายังไม่ปิดไม้) — ดู Equity กับ Free Margin เป็นหลัก</p></div>
        </div>

        {/* LESSON 4 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>Margin Call &amp; Stop Out — วันที่โบรกปิดไม้ให้เอง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_GAUGE }} />
            <div className="figcap">Margin Level = หน้าปัดเตือนภัย · แตะ 100% = เตือน · แตะ 50% = โบรกปิดออเดอร์ให้อัตโนมัติ</div>
          </div>
          <div className="body-txt">
            <p><b>Margin Call</b> ไม่ใช่จุดที่เงินทุนหมด — แต่คือสัญญาณเตือน ว่า Equity เริ่มใกล้เท่ากับมัดจำที่ล็อกไว้ (Margin Level แตะ ~100%) ส่วน <b>Stop Out</b> คือตอนที่โบรก<b>ปิดออเดอร์ให้คุณเอง</b>โดยไม่ถาม เพื่อกันไม่ให้พอร์ตติดลบ (มักที่ ~50%) ดูตัวเลขจริงตอนขาดทุน — นี่คือบัญชี $100 ที่เปิดทองใหญ่ไป <b>0.10 lot</b>:</p>
            <div className="calc c4">
              <div className="crow head"><span>ทองขยับสวน</span><span>Equity</span><span>Margin Level</span><span>สถานะ</span></div>
              <div className="crow"><span className="k">$0</span><span className="v">$100</span><span className="v">189%</span><span className="v pos">ปกติ</span></div>
              <div className="crow"><span className="k">−$2.0</span><span className="v">$80</span><span className="v">151%</span><span className="v">เริ่มมีความเสี่ยง</span></div>
              <div className="crow hl"><span className="k warn">−$4.7</span><span className="v">$53</span><span className="v warn">100%</span><span className="v warn">⚠ Margin Call</span></div>
              <div className="crow stop"><span className="k neg">−$7.35</span><span className="v neg">$26.50</span><span className="v neg">50%</span><span className="v neg">✕ Stop Out</span></div>
            </div>
            <p>สังเกตไหมว่าทองขยับแค่ <b>$7.35</b> (จาก ~$2,650 = 0.28%) พอร์ตก็ถูกปิดหมดแล้ว — ทองขยับเท่านี้ใช้เวลาไม่กี่นาที นี่คือสิ่งที่เกิดขึ้นเมื่อเปิดไม้ใหญ่เกินตัว บทถัดไปจะเทียบให้เห็นชัด ๆ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Stop Out ไม่ใช่กลไกป้องกันบัญชีของคุณ — แต่เป็นจุดที่โบรกปิดสถานะเพื่อป้องกันความเสี่ยงของตนเอง ควรออกจากสถานะก่อนถึงจุดนี้เสมอ</p></div>
        </div>

        {/* LESSON 5 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>★ ตัวอย่างจริง: บัญชีทองคำ $100 ทนความผันผวนได้นานเท่าใด</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SURVIVAL }} />
            <div className="figcap">บัญชี &amp; เลเวอเรจ<b>เท่ากันเป๊ะ</b> — เปลี่ยนแค่ขนาดไม้ 10 เท่า กันชนหายไป 13 เท่า</div>
          </div>
          <div className="note">
            <span className="nl">สมมติฐานตัวเลข (ตัวอย่างเพื่อการเรียน)</span>
            <p>ทองคำ = $2,650/oz · เลเวอเรจ 1:500 · บัญชี $100 · 1 lot = 100 oz · Stop Out ที่ Margin Level 50% · ตัวเลขจริงต่างกันตามโบรกและราคาทองขณะนั้น</p>
          </div>
          <div className="calc c3">
            <div className="crow head"><span>รายการ</span><span className="v">0.01 lot</span><span className="v">0.10 lot</span></div>
            <div className="crow"><span className="k">ทองที่คุมจริง</span><span className="v">1 oz</span><span className="v">10 oz</span></div>
            <div className="crow"><span className="k">มูลค่าสถานะ (Notional)</span><span className="v">$2,650</span><span className="v">$26,500</span></div>
            <div className="crow"><span className="k">Margin ที่ใช้</span><span className="v">$5.30</span><span className="v">$53.00</span></div>
            <div className="crow"><span className="k">ทองขยับ $1 = กำไร/ขาดทุน</span><span className="v">$1</span><span className="v">$10</span></div>
            <div className="crow stop"><span className="k">ทองขยับสวนได้ก่อนเงินทุนหมด</span><span className="v pos">$97.35</span><span className="v neg">$7.35</span></div>
          </div>
          <div className="body-txt">
            <p>นี่คือบทเรียนที่สำคัญที่สุดของหมวดนี้ และมันขัดกับสิ่งที่มือใหม่เชื่อ: <b>ตัวที่ทำลายพอร์ตไม่ใช่เลเวอเรจเพียงอย่างเดียว แต่คือ “ขนาดไม้”</b> ทั้งสองเคสใช้เลเวอเรจ 1:500 เท่ากัน บัญชี $100 เท่ากัน — แต่เคสที่เปิด 0.01 lot ทนทองขยับได้เกือบ $100 (มีระยะรองรับ) ส่วนเคส 0.10 lot ทนได้แค่ $7 (เงินทุนหมดภายในไม่กี่นาที)</p>
            <p className="pull">เลเวอเรจเป็นเพียงเพดาน — “ขนาดไม้” ต่างหากที่ผู้เทรดเลือกเอง และเป็นปัจจัยที่ตัดสินว่าจะอยู่รอดหรือสูญเสียเงินทุนทั้งหมด</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">ต่อยอดที่ ระดับ 4</span>
              <p>ถ้าขนาดไม้สำคัญขนาดนี้ แล้วจะคำนวณ “ขนาดที่พอดี” ยังไง? นั่นคือหัวใจของ <b>ระดับ 4 · การบริหารความเสี่ยง</b> — สูตร position sizing ที่ทำให้คุณเสี่ยงเท่ากันทุกไม้ ไม่ว่าจะเทรดทองหรือคู่เงินไหน</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เลเวอเรจ 1:500 ไม่ได้แปลว่าต้องเปิดไม้ใหญ่ — เปิด 0.01 บนบัญชี $100 คือคนละความเสี่ยงกับ 0.10 โดยสิ้นเชิง</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · ตัวเลขเป็นตัวอย่างสมมติเพื่ออธิบายกลไก ค่าจริงต่างกันตามโบรกและสภาวะตลาด · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 1 หมวด 1.3
      </div>
    </>
  );
}
