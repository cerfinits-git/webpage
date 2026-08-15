import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 1 · ศัพท์และกลไกการเทรด — pip, lot, spread · Cerfinits Grade",
  description:
    "Pip, lot, spread, bid/ask, ประเภทคำสั่ง และ long/short — ศัพท์พื้นฐานและต้นทุนที่มองไม่เห็น เล่าเป็นภาพ",
  alternates: { canonical: "/grade/trading-terms" },
};

const SVG_PIP = `<svg viewBox="0 0 660 190" role="img" aria-label="pip คือทศนิยมตำแหน่งที่ 4">
  <text x="252" y="72" style="font-family:var(--mono);font-size:34px;font-weight:700;fill:var(--ink)">1.0853</text>
  <text x="380" y="60" style="font-family:var(--mono);font-size:19px;font-weight:700;fill:var(--muted)">5</text>
  <rect x="353" y="42" width="23" height="40" rx="3" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <text class="t-sm t-gold" x="364" y="108" text-anchor="middle">pip</text>
  <text class="t-xs" x="364" y="126" text-anchor="middle">ตำแหน่งที่ 4 = 0.0001</text>
  <text class="t-xs" x="386" y="150" text-anchor="middle">pipette (เศษ pip)</text>
  <text class="t-sm" x="180" y="170">คู่เงินส่วนใหญ่: 1 pip = ทศนิยมตำแหน่งที่ 4</text>
</svg>`;

const SVG_LOT = `<svg viewBox="0 0 660 160" role="img" aria-label="ขนาดลอต Standard Mini Micro">
  <rect class="chip-n" x="30" y="30" width="180" height="100" rx="3"/>
  <text class="t-md" x="120" y="66" text-anchor="middle">Standard 1.00</text>
  <text class="t-sm" x="120" y="90" text-anchor="middle">100,000 หน่วย</text>
  <text class="t-sm" x="120" y="108" text-anchor="middle">ทอง 100 oz</text>
  <rect class="chip-n" x="240" y="30" width="180" height="100" rx="3"/>
  <text class="t-md" x="330" y="66" text-anchor="middle">Mini 0.10</text>
  <text class="t-sm" x="330" y="90" text-anchor="middle">10,000 หน่วย</text>
  <text class="t-sm" x="330" y="108" text-anchor="middle">ทอง 10 oz</text>
  <rect class="chip-gold" x="450" y="30" width="180" height="100" rx="3" stroke-width="2.5"/>
  <text class="t-md t-gold" x="540" y="66" text-anchor="middle">Micro 0.01</text>
  <text class="t-sm" x="540" y="90" text-anchor="middle">1,000 หน่วย · ทอง 1 oz</text>
  <text class="t-sm" x="540" y="108" text-anchor="middle">มือใหม่เริ่มที่นี่</text>
</svg>`;

const SVG_BIDASK = `<svg viewBox="0 0 660 190" role="img" aria-label="bid ask และ spread">
  <rect class="chip-bad" x="40" y="34" width="200" height="76" rx="3"/>
  <text class="t-sm t-down" x="140" y="62" text-anchor="middle">SELL · Bid</text>
  <text x="140" y="94" text-anchor="middle" style="font-family:var(--mono);font-size:24px;font-weight:700;fill:var(--fig-down)">2649.80</text>
  <rect x="250" y="52" width="160" height="40" rx="3" fill="var(--gold-tint)" stroke="var(--gold)" stroke-width="1.5"/>
  <text class="t-sm t-gold" x="330" y="77" text-anchor="middle">Spread 0.20</text>
  <rect class="chip-ok" x="420" y="34" width="200" height="76" rx="3"/>
  <text class="t-sm t-up" x="520" y="62" text-anchor="middle">BUY · Ask</text>
  <text x="520" y="94" text-anchor="middle" style="font-family:var(--mono);font-size:24px;font-weight:700;fill:var(--fig-up)">2650.00</text>
  <text class="t-sm" x="330" y="150" text-anchor="middle">เปิด Buy ที่ 2650.00 แต่ปิดได้ที่ 2649.80</text>
  <text class="t-sm t-down" x="330" y="170" text-anchor="middle">→ ติดลบ 0.20 ทันทีตั้งแต่วินาทีแรก (นี่คือ spread)</text>
</svg>`;

const SVG_COSTS = `<svg viewBox="0 0 660 160" role="img" aria-label="ต้นทุนที่มองไม่เห็น spread commission swap">
  <rect class="chip-n" x="30" y="30" width="185" height="100" rx="3"/>
  <text class="t-md" x="122" y="64" text-anchor="middle">Spread</text>
  <text class="t-sm" x="122" y="88" text-anchor="middle">ส่วนต่าง bid–ask</text>
  <text class="t-sm" x="122" y="106" text-anchor="middle">จ่ายทุกไม้</text>
  <rect class="chip-n" x="237" y="30" width="185" height="100" rx="3"/>
  <text class="t-md" x="329" y="64" text-anchor="middle">Commission</text>
  <text class="t-sm" x="329" y="88" text-anchor="middle">ค่าคอมต่อลอต</text>
  <text class="t-sm" x="329" y="106" text-anchor="middle">บางโบรก</text>
  <rect class="chip-gold" x="444" y="30" width="185" height="100" rx="3" stroke-width="2.5"/>
  <text class="t-md t-gold" x="536" y="64" text-anchor="middle">Swap</text>
  <text class="t-sm" x="536" y="88" text-anchor="middle">ค่าถือค้างคืน (+/−)</text>
  <text class="t-sm" x="536" y="106" text-anchor="middle">เซอร์ไพรส์มือใหม่</text>
</svg>`;

const SVG_ORDERS = `<svg viewBox="0 0 660 230" role="img" aria-label="ประเภทคำสั่ง market limit stop">
  <line x1="330" y1="24" x2="330" y2="206" stroke="var(--hair-2)" stroke-width="1.5"/>
  <line x1="250" y1="52" x2="410" y2="52" stroke="var(--up)" stroke-width="2"/>
  <text class="t-sm t-up" x="420" y="50">Buy Stop — รอทะลุขึ้นค่อยเข้า</text>
  <text class="t-xs" x="240" y="56" text-anchor="end">ราคาสูงขึ้น ↑</text>
  <circle cx="330" cy="115" r="7" fill="var(--gold)"/>
  <text class="t-md t-gold" x="420" y="112" text-anchor="start">Market</text>
  <text class="t-sm" x="420" y="130" text-anchor="start">= เข้าเลยราคาปัจจุบัน</text>
  <text class="t-sm" x="240" y="119" text-anchor="end">ราคาปัจจุบัน</text>
  <line x1="250" y1="178" x2="410" y2="178" stroke="var(--down)" stroke-width="2"/>
  <text class="t-sm t-down" x="420" y="176">Buy Limit — รอย่อลงค่อยเข้า</text>
  <text class="t-xs" x="240" y="182" text-anchor="end">ราคาต่ำลง ↓</text>
</svg>`;

const SVG_LONGSHORT = `<svg viewBox="0 0 660 180" role="img" aria-label="long และ short">
  <rect class="chip-ok" x="40" y="30" width="260" height="120" rx="3"/>
  <text class="t-md t-up" x="170" y="60" text-anchor="middle">LONG (Buy)</text>
  <path d="M170,106 L170,78 M158,90 L170,76 L182,90" fill="none" stroke="var(--up)" stroke-width="2.5"/>
  <text class="t-sm" x="170" y="130" text-anchor="middle">ซื้อถูก–ขายแพง · กำไรเมื่อราคาขึ้น</text>
  <rect class="chip-bad" x="360" y="30" width="260" height="120" rx="3"/>
  <text class="t-md t-down" x="490" y="60" text-anchor="middle">SHORT (Sell)</text>
  <path d="M490,76 L490,104 M478,90 L490,106 L502,90" fill="none" stroke="var(--down)" stroke-width="2.5"/>
  <text class="t-sm" x="490" y="130" text-anchor="middle">ขายแพง–ซื้อคืนถูก · กำไรเมื่อราคาลง</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 1 · หมวด 1.2</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">ศัพท์และกลไกการเทรด</span>
        <h1>ภาษาของเทรดเดอร์ — และต้นทุนที่มองไม่เห็น</h1>
        <p className="lead">
          ศัพท์พื้นฐานไม่กี่คำที่ต้องแม่นก่อนกดออเดอร์แรก: <b>pip, lot, spread, bid/ask,
          ประเภทคำสั่ง</b> และ <b>long/short</b> — โดยเฉพาะ &quot;ต้นทุน&quot; ที่กินกำไรเงียบ ๆ
          ถ้าไม่เข้าใจ มันคือเหตุผลที่หลายคนเทรดถูกทางแต่ยังขาดทุน
        </p>
      </div>

      <div className="wrap">
        {/* L1 pip */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>Pip — หน่วยวัดการขยับของราคา</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_PIP }} />
            <div className="figcap"><b>Pip</b> = การขยับที่เล็กที่สุดแบบมาตรฐาน · ตัวเลขที่ 5 (pipette) คือเศษของ pip</div>
          </div>
          <div className="body-txt">
            <p>Pip คือหน่วยที่เราใช้พูดถึง &quot;ราคาขยับไปเท่าไหร่&quot; แทนที่จะพูดว่า &quot;ขึ้น 0.0010&quot; เราพูดว่า &quot;ขึ้น 10 pips&quot; สั้นกว่า สำหรับคู่เงินส่วนใหญ่ 1 pip = ทศนิยมตำแหน่งที่ 4 (0.0001)</p>
            <div className="note">
              <span className="nl">ทองคำ (XAUUSD) นับไม่เหมือนกัน</span>
              <p>โบรกแต่ละเจ้านิยาม &quot;pip/point&quot; ของทองต่างกัน — บางเจ้า 1 pip = 0.10 บางเจ้า = 0.01 ฉะนั้น<b>อย่าเชื่อคำว่า pip ลอย ๆ ให้ดูที่โบรกของคุณเอง</b>ว่านับยังไง นี่คือเหตุผลที่เราจะคิดกำไร/ขาดทุนเป็น &quot;ดอลลาร์ต่อการขยับ&quot; มากกว่าเป็น pip</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>pip = หน่วยพูดถึงการขยับ · แต่ทองแต่ละโบรกนับไม่เท่ากัน — เช็คเอง</p></div>
        </div>

        {/* L2 lot */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>Lot — ขนาดไม้ที่คุณเปิด</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_LOT }} />
            <div className="figcap">Lot คือขนาดสัญญา — ยิ่งลอตใหญ่ ทุก 1 pip ยิ่งมีค่าเป็นเงินมากขึ้น</div>
          </div>
          <div className="body-txt">
            <p>Lot บอกว่าคุณกำลังคุมของมูลค่าเท่าไหร่ ยิ่งลอตใหญ่ กำไร/ขาดทุนต่อการขยับ 1 pip ยิ่งมาก มือใหม่ควรเริ่มที่ <b>0.01 (micro)</b> เสมอ</p>
            <p><b>กับดักที่ต้องระวัง:</b> คำว่า &quot;0.01 มันเล็กนิดเดียว&quot; หลอกได้ — เพราะด้วยเลเวอเรจ 0.01 lot ทองก็ยังคุมของมูลค่าราว $2,650 อยู่ดี &quot;เล็ก&quot; ที่นี่หมายถึงเล็กเมื่อเทียบพอร์ต ไม่ใช่เล็กจนเสียเท่าไหร่ก็ได้ — เรื่องนี้เจาะลึกในหมวด 1.3 (Margin &amp; Leverage)</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เริ่มที่ 0.01 เสมอ · ลอตใหญ่ = ทุก pip มีค่าเป็นเงินมากขึ้น (ทั้งขึ้นและลง)</p></div>
        </div>

        {/* L3 bid/ask spread */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>Bid / Ask — ทำไมเปิดออเดอร์ปุ๊บติดลบปั๊บ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_BIDASK }} />
            <div className="figcap">ตลาดมี 2 ราคาเสมอ — คุณ &quot;ซื้อที่ Ask&quot; แต่ &quot;ขายที่ Bid&quot; ส่วนต่างคือ spread</div>
          </div>
          <div className="body-txt">
            <p>ทุกอย่างในตลาดมี 2 ราคาเสมอ: <b>Bid</b> (ราคาที่คุณขายได้) กับ <b>Ask</b> (ราคาที่คุณซื้อได้) ส่วนต่างระหว่างสองอันนี้คือ <b>spread</b> — และมันคือต้นทุนแรกที่คุณจ่ายทุกไม้</p>
            <p>นี่คือคำตอบของ &quot;ทำไมเปิดออเดอร์ปุ๊บติดลบเลย&quot;: คุณเปิด Buy ที่ Ask (สูงกว่า) แต่ถ้าจะปิดทันทีต้องขายที่ Bid (ต่ำกว่า) — ราคาจึงต้องวิ่ง<b>ไปในทางคุณเกินระยะ spread ก่อน</b>ถึงจะเริ่มกำไรจริง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ซื้อที่ Ask ขายที่ Bid — spread คือต้นทุนที่คุณจ่ายก่อนราคาจะขยับด้วยซ้ำ</p></div>
        </div>

        {/* L4 costs */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>ต้นทุนที่มองไม่เห็น 3 ตัว</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_COSTS }} />
            <div className="figcap">Spread + Commission + Swap — ยิ่งเทรดถี่ ยิ่งจ่ายเยอะ (เหตุผลที่ overtrading ทำลายพอร์ต)</div>
          </div>
          <div className="body-txt">
            <p>นอกจาก spread ยังมีอีก 2 ต้นทุน: <b>Commission</b> (ค่าคอมต่อลอต บางโบรกคิดแทน/เพิ่มจาก spread) และ <b>Swap</b> (ค่าถือออเดอร์ข้ามคืน — บวกหรือลบก็ได้ตามส่วนต่างดอกเบี้ย) Swap คือตัวที่มือใหม่มักไม่รู้ตัว แล้วงงว่าทำไมถือยาว ๆ แล้วยอดหด</p>
            <p><b>ทำไมสำคัญ:</b> ต้นทุนพวกนี้ดูเล็กต่อไม้ แต่มันคูณด้วยจำนวนไม้ — เทรด 20 ไม้/วันคือจ่าย spread 20 รอบ นี่คือเหตุผลเชิงคณิตศาสตร์ว่าทำไม &quot;เทรดเยอะ&quot; ถึงเป็นศัตรู ไม่ใช่เพื่อน</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ต้นทุน × จำนวนไม้ = เหตุผลที่เทรดถี่แล้วขาดทุน แม้จะเข้าถูกทางบ่อยครั้ง</p></div>
        </div>

        {/* L5 order types */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>ประเภทคำสั่ง + SL / TP</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_ORDERS }} />
            <div className="figcap">Market = เข้าเลย · Limit = รอราคาย้อนมา · Stop = รอราคาทะลุไป</div>
          </div>
          <div className="body-txt">
            <p>คำสั่งหลักมี 3 แบบ: <b>Market</b> (เข้าที่ราคาปัจจุบันทันที), <b>Limit</b> (ตั้งรอให้ราคาย้อนมาหาเราค่อยเข้า — ได้ราคาดีกว่า), <b>Stop</b> (ตั้งรอให้ราคาทะลุไปทางที่คาดค่อยเข้า — ยืนยันทิศก่อน)</p>
            <p>และสองอย่างที่<b>ห้ามขาด</b>ทุกไม้: <b>Stop Loss (SL)</b> — จุดตัดขาดทุนอัตโนมัติ, <b>Take Profit (TP)</b> — จุดปิดกำไรอัตโนมัติ SL คือสิ่งที่กันไม้เล็กไม่ให้กลายเป็นหายนะ เราจะลงลึกเรื่องการวาง SL ในระดับ 4 (การบริหารความเสี่ยง)</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ทุกไม้ต้องมี SL ก่อนเสมอ — ไม่มี SL = ไม่ใช่การเทรด แต่คือการเดา</p></div>
        </div>

        {/* L6 long/short */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>Long / Short — กำไรได้สองทาง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_LONGSHORT }} />
            <div className="figcap">ต่างจากซื้อหุ้นเก็บ — ที่นี่คุณทำกำไรจากราคาที่ &quot;ลง&quot; ได้ด้วย</div>
          </div>
          <div className="body-txt">
            <p>ในตลาดนี้คุณเลือกได้ 2 ทาง: <b>Long (Buy)</b> เดิมพันว่าราคาจะขึ้น, <b>Short (Sell)</b> เดิมพันว่าราคาจะลง — ใช่ คุณ &quot;ขาย&quot; สิ่งที่ยังไม่มีได้ แล้วซื้อคืนตอนราคาถูกลงเพื่อเก็บส่วนต่าง</p>
            <p>ข้อดีคือมีโอกาสทั้งตลาดขึ้นและลง แต่<b>ดาบสองคม</b>: มันแปลว่าคุณเจ็บได้ทั้งสองทางเหมือนกัน อย่าคิดว่า short คือ &quot;ของสูง&quot; — มันแค่กลับด้าน ความเสี่ยงเท่าเดิม</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>รู้ศัพท์แล้ว หมวด <b><a href="/grade/margin-leverage">1.3 Margin &amp; Leverage 101</a></b> จะอธิบายว่าทำไม &quot;0.01 lot&quot; ถึงไม่เล็กอย่างที่คิด และเลเวอเรจทำงาน (และทำลายพอร์ต) อย่างไร</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>กำไรได้ทั้งขาขึ้นขาลง — แต่ short ไม่ได้ปลอดภัยกว่า long มันแค่กลับด้าน</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · ตัวเลขเป็นตัวอย่างสมมติ ค่าจริงต่างกันตามโบรก · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 1 หมวด 1.2
      </div>
    </>
  );
}
