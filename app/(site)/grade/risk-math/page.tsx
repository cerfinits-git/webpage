import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 4 · คณิตศาสตร์ของการขาดทุน — drawdown, expectancy · Cerfinits Grade",
  description:
    "ทำไมขาดทุน 50% ต้องกำไร 100%, ความเสี่ยงต่อไม้, คิดเป็น R, expectancy (เหตุใด win rate สูงจึงยังขาดทุนได้) และ risk of ruin",
  alternates: { canonical: "/grade/risk-math" },
};

const SVG_DRAWDOWN = `<svg viewBox="0 0 660 200" role="img" aria-label="ขาดทุนกับกำไรที่ต้องใช้คืนทุน">
  <text class="t-sm" x="8" y="20">ขาดทุนแล้ว ต้องกำไรกี่ % ถึงคืนทุน</text>
  <text class="t-md" x="8" y="62">−20%</text>
  <rect class="bar-n" x="150" y="44" width="31" height="26"/>
  <text class="t-sm" x="190" y="63">ต้อง +25%</text>
  <text class="t-md" x="8" y="112">−50%</text>
  <rect class="bar-gold" x="150" y="94" width="125" height="26"/>
  <text class="t-sm t-gold" x="284" y="113">ต้อง +100%</text>
  <text class="t-md" x="8" y="162">−80%</text>
  <rect class="bar-down" x="150" y="144" width="500" height="26"/>
  <text class="t-white" x="640" y="161" text-anchor="end" style="font-size:12px;font-weight:700">ต้อง +400%</text>
</svg>`;

const SVG_RISKPT = `<svg viewBox="0 0 660 150" role="img" aria-label="ความเสี่ยงต่อไม้ 1 เปอร์เซ็นต์">
  <text class="t-sm" x="8" y="24">บัญชี $1,000 · เสี่ยง 1% ต่อไม้ = $10</text>
  <rect class="bar-n" x="40" y="44" width="580" height="46"/>
  <rect class="bar-down" x="40" y="44" width="6" height="46"/>
  <text class="t-xs t-down" x="52" y="72">$10</text>
  <text class="t-xs" x="330" y="72" text-anchor="middle">เงินที่เหลือ = กันชน</text>
  <text class="t-xs t-up" x="40" y="118">เสี่ยง 1% = แพ้ติดกัน 10 ไม้ยังเสียแค่ ~10% (ยังกลับมาได้)</text>
</svg>`;

const SVG_RMULT = `<svg viewBox="0 0 660 150" role="img" aria-label="คิดเป็น R multiple">
  <line x1="40" y1="80" x2="620" y2="80" stroke="var(--hair-2)" stroke-width="1.5"/>
  <line x1="160" y1="70" x2="160" y2="90" stroke="var(--down)" stroke-width="2"/><text class="t-xs t-down" x="160" y="108" text-anchor="middle">−1R (SL)</text>
  <line x1="280" y1="70" x2="280" y2="90" stroke="var(--muted)" stroke-width="2"/><text class="t-xs" x="280" y="108" text-anchor="middle">0 (เข้า)</text>
  <line x1="400" y1="70" x2="400" y2="90" stroke="var(--up)" stroke-width="2"/><text class="t-xs t-up" x="400" y="108" text-anchor="middle">+1R</text>
  <line x1="520" y1="70" x2="520" y2="90" stroke="var(--up)" stroke-width="2"/><text class="t-xs t-up" x="520" y="108" text-anchor="middle">+2R (TP)</text>
  <text class="t-sm" x="330" y="36" text-anchor="middle">1R = เงินที่ยอมเสียต่อไม้ · วัดกำไร/ขาดทุนเป็นเท่าของ R</text>
</svg>`;

const SVG_RUIN = `<svg viewBox="0 0 660 180" role="img" aria-label="risk of ruin สองพอร์ต">
  <line x1="40" y1="150" x2="620" y2="150" stroke="var(--hair-2)" stroke-width="1"/>
  <polyline points="40,60 130,72 220,66 310,84 400,78 500,92 600,86" fill="none" stroke="var(--up)" stroke-width="2"/>
  <text class="t-xs t-up" x="598" y="74" text-anchor="end">เสี่ยง 2%/ไม้ — รอด</text>
  <polyline points="40,60 120,88 200,74 280,110 350,96 420,132 470,150" fill="none" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs t-down" x="474" y="166">เสี่ยง 20%/ไม้ — เงินทุนหมด</text>
  <text class="t-sm" x="46" y="26">แพ้ชุดเดียวกัน · ต่างกันแค่ &quot;เสี่ยงต่อไม้เท่าไหร่&quot;</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 4 · หมวด 4.1</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">คณิตศาสตร์ของการขาดทุน</span>
        <h1>ตัวเลขที่ตัดสินการอยู่รอดของพอร์ต</h1>
        <p className="lead">
          นี่คือจุดเริ่มของ<b>หัวใจหลักสูตร</b> — การเอาตัวรอด ก่อนจะพูดเรื่องทำกำไร คุณต้องเข้าใจคณิตศาสตร์
          ไม่กี่ข้อที่จำเป็นต้องเข้าใจ: <b>ผลกระทบของขาดทุนไม่สมมาตรกับผลกระทบของกำไรในจำนวนเท่ากัน</b> และเหตุใด win rate สูงจึงยังขาดทุนได้
        </p>
      </div>

      <div className="wrap">
        {/* L1 drawdown */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>★ ทำไมขาดทุน 50% ต้องกำไร 100% ถึงคืนทุน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_DRAWDOWN }} />
            <div className="figcap">ยิ่งขาดทุนลึก กำไรที่ต้องใช้คืนทุนยิ่งพุ่งแบบทวีคูณ — นี่คือเหตุผลที่ต้องกันขาดทุนไว้ตื้น ๆ</div>
          </div>
          <div className="calc c2">
            <div className="crow head"><span>ขาดทุน</span><span className="v">ต้องกำไรถึงคืนทุน</span></div>
            <div className="crow"><span className="k">−10%</span><span className="v">+11%</span></div>
            <div className="crow"><span className="k">−25%</span><span className="v">+33%</span></div>
            <div className="crow hl"><span className="k">−50%</span><span className="v">+100%</span></div>
            <div className="crow"><span className="k">−75%</span><span className="v">+300%</span></div>
            <div className="crow stop"><span className="k">−90%</span><span className="v">+900%</span></div>
          </div>
          <div className="body-txt">
            <p>คณิตศาสตร์ง่าย ๆ แต่มือใหม่มองข้าม: เมื่อพอร์ตหายไป 50% เงินที่เหลือครึ่งเดียว<b>ต้องโตเป็นเท่าตัว (+100%)</b> ถึงจะกลับมาเท่าเดิม ยิ่งขาดทุนลึก ตัวเลขนี้ยิ่งพุ่งจนแทบเป็นไปไม่ได้</p>
            <p className="pull">การป้องกันขาดทุนไม่ใช่ความระมัดระวังเกินเหตุ — แต่เป็นข้อกำหนดทางคณิตศาสตร์เพื่อความอยู่รอด</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ขาดทุนลึกฟื้นยากแบบทวีคูณ — กันไว้ตื้น ๆ สำคัญกว่าไล่กำไร</p></div>
        </div>

        {/* L2 risk per trade */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>ความเสี่ยงต่อไม้ — กฎ 1–2% มาจากไหน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RISKPT }} />
            <div className="figcap">เสี่ยงน้อยต่อไม้ = ทนแพ้ติดกันได้หลายไม้โดยพอร์ตยังอยู่</div>
          </div>
          <div className="body-txt">
            <p>กฎ &quot;เสี่ยงไม่เกิน 1–2% ของพอร์ตต่อไม้&quot; ไม่ใช่ตัวเลขสุ่ม — มันมาจากข้อ 1: ถ้าเสี่ยงต่อไม้น้อย แม้แพ้ติดกันหลายไม้ (ซึ่งเกิดขึ้นแน่นอนกับทุกระบบ) พอร์ตก็ยัง<b>อยู่ในโซนที่ฟื้นได้ง่าย</b></p>
            <p>เสี่ยง 1% ต่อไม้ = แพ้ 10 ไม้ติดยังเสียแค่ ~10% (ต้องกำไร ~11% คืนทุน) แต่เสี่ยง 20% ต่อไม้ = แพ้ 5 ไม้ก็เกือบสูญเสียเงินทุนทั้งหมด การอยู่รอดผ่านช่วงขาดทุนต่อเนื่องคือปัจจัยที่แยกผู้ที่ยังเทรดอยู่ออกจากผู้ที่เลิกเทรดไป</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เสี่ยง 1–2%/ไม้ ไม่ใช่ความระมัดระวังเกินเหตุ — แต่เป็นเงื่อนไขที่ทำให้อยู่รอดผ่านช่วงขาดทุนต่อเนื่องได้</p></div>
        </div>

        {/* L3 R-multiple */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>คิดเป็น R ไม่ใช่คิดเป็นบาท</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RMULT }} />
            <div className="figcap">1R = เงินที่ยอมเสียต่อไม้ · วัดทุกผลลัพธ์เป็น &quot;เท่าของ R&quot;</div>
          </div>
          <div className="body-txt">
            <p>เทรดเดอร์มืออาชีพไม่คิดเป็น &quot;กำไร 500 บาท&quot; แต่คิดเป็น <b>R-multiple</b> — 1R คือเงินที่คุณยอมเสียต่อไม้ (ระยะจากจุดเข้าถึง SL) ถ้าไม้นั้นชนะได้กำไรเท่ากับ 2 เท่าของที่เสี่ยง = +2R, ถ้าแพ้ = −1R</p>
            <p>ทำไมดีกว่า? เพราะมันทำให้คุณ<b>เทียบไม้ต่างขนาดได้ยุติธรรม</b> และโฟกัสที่ &quot;กระบวนการ&quot; ไม่ใช่จำนวนเงินที่กระตุ้นอารมณ์ — ระบบที่ได้เฉลี่ย +0.3R ต่อไม้ ชนะในระยะยาว ไม่ว่าพอร์ตเล็กหรือใหญ่</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>วัดเป็น R ไม่ใช่บาท — ตัดอารมณ์ออก เทียบไม้ได้ยุติธรรม</p></div>
        </div>

        {/* L4 expectancy */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>★ Expectancy — เหตุใด win rate 80% ยังขาดทุนได้</h2></div>
          <div className="calc c3">
            <div className="crow head"><span></span><span className="v">ระบบ A</span><span className="v">ระบบ B</span></div>
            <div className="crow"><span className="k">Win rate</span><span className="v">80%</span><span className="v">40%</span></div>
            <div className="crow"><span className="k">กำไรเฉลี่ย/ไม้ชนะ</span><span className="v pos">+$10</span><span className="v pos">+$30</span></div>
            <div className="crow"><span className="k">ขาดทุนเฉลี่ย/ไม้แพ้</span><span className="v neg">−$50</span><span className="v neg">−$10</span></div>
            <div className="crow hl"><span className="k">Expectancy ต่อไม้</span><span className="v neg">−$2</span><span className="v pos">+$6</span></div>
          </div>
          <div className="body-txt">
            <p>นี่คือความจริงที่ทำลายความเชื่อของมือใหม่: <b>Win rate ไม่ได้บอกว่าคุณกำไรหรือขาดทุน</b> สิ่งที่บอกคือ <b>Expectancy</b>:</p>
            <div className="formula">
              <span className="eq">Expectancy = (%ชนะ × กำไรเฉลี่ย) − (%แพ้ × ขาดทุนเฉลี่ย)</span>
              <span className="fnote">ระบบ A: (0.8 × 10) − (0.2 × 50) = 8 − 10 = <b>−$2</b> ต่อไม้ (ชนะบ่อยแต่ขาดทุน!)</span>
            </div>
            <p>ระบบ A ชนะ 80% แต่<b>ขาดทุนระยะยาว</b> เพราะไม้แพ้ใหญ่กว่าไม้ชนะมาก (ชนะเล็ก ๆ 4 ไม้ ก็ยังไม่พอกลบไม้แพ้ 1 ไม้) ส่วนระบบ B ชนะแค่ 40% แต่<b>กำไร</b> เพราะไม้ชนะใหญ่กว่าไม้แพ้ — นี่คือเหตุผลที่ &quot;ปล่อยกำไรวิ่ง ตัดขาดทุนสั้น&quot; ถึงสำคัญ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Win rate หลอกได้ — Expectancy คือตัวจริง · ไม้ชนะต้องใหญ่กว่าไม้แพ้</p></div>
        </div>

        {/* L5 risk of ruin */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>Risk of Ruin — คำนวณโอกาสสูญเสียเงินทุนทั้งหมดได้</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RUIN }} />
            <div className="figcap">สองพอร์ตเจอชุดแพ้เดียวกัน — ต่างกันแค่ &quot;เสี่ยงต่อไม้เท่าไหร่&quot; ผลลัพธ์คนละโลก</div>
          </div>
          <div className="body-txt">
            <p><b>Risk of Ruin</b> คือความน่าจะเป็นที่พอร์ตจะสูญเสียเงินทุนทั้งหมด และไม่ได้ขึ้นกับโชค — แต่ขึ้นกับ 3 ปัจจัย: <b>ระดับความเสี่ยงต่อไม้, win rate, และ reward-to-risk</b> ยิ่งเสี่ยงต่อไม้สูง โอกาสสูญเสียเงินทุนทั้งหมดยิ่งเพิ่มขึ้น แม้ระบบจะมีคุณภาพดีก็ตาม</p>
            <p>บทเรียนรวบยอดของหมวดนี้: <b>คุณคุม 3 ตัวเลขนี้ได้ ก่อนจะคุมว่าตลาดจะไปทางไหน</b> — และการคุมมันคือสิ่งที่ทำให้ &quot;อยู่รอด&quot; ซึ่งเป็นเงื่อนไขเดียวที่ทำให้ &quot;edge&quot; ในระยะยาวมีโอกาสทำงาน</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>เข้าใจ &quot;ทำไม&quot; แล้ว หมวด <b><a href="/grade/position-sizing">4.2 Position Sizing &amp; Stop Loss</a></b> จะสอน &quot;ทำยังไง&quot; — คำนวณขนาดไม้และวาง SL ให้เสี่ยงเท่าที่ตั้งใจเป๊ะ</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>โอกาสสูญเสียเงินทุนทั้งหมดควบคุมได้ด้วย 3 ตัวเลข — เสี่ยงต่อไม้, win rate, R:R</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · ตัวเลขเป็นตัวอย่างเพื่ออธิบายหลักการ · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 4 หมวด 4.1
      </div>
    </>
  );
}
