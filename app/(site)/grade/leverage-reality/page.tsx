import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 4 · Leverage ในชีวิตจริง — effective leverage, portfolio heat · Cerfinits Grade",
  description:
    "เลเวอเรจที่ใช้จริง (effective) vs ที่โบรกให้, ทำไม 1:500 ไม่ใช่เหตุผลต้องใช้, portfolio heat, correlation และการเขียนกฎ risk ของตัวเอง",
  alternates: { canonical: "/grade/leverage-reality" },
};

const SVG_EFFLEV = `<svg viewBox="0 0 660 175" role="img" aria-label="effective leverage ตามขนาดไม้">
  <text class="t-sm" x="8" y="20">บัญชี $1,000 · เลเวอเรจ &quot;ที่ใช้จริง&quot; ตามขนาดไม้ (ทอง)</text>
  <text class="t-sm" x="8" y="58">0.02 lot</text>
  <rect class="bar-up" x="140" y="42" width="20" height="24"/>
  <text class="t-xs t-up" x="168" y="59">5.3×</text>
  <text class="t-sm" x="8" y="98">0.10 lot</text>
  <rect class="bar-gold" x="140" y="82" width="100" height="24"/>
  <text class="t-xs t-gold" x="248" y="99">26.5×</text>
  <text class="t-sm" x="8" y="138">1.00 lot</text>
  <rect class="bar-down" x="140" y="122" width="480" height="24"/>
  <text class="t-white" x="612" y="138" text-anchor="end" style="font-size:12px;font-weight:700">265× ⚠</text>
</svg>`;

const SVG_DIAL = `<svg viewBox="0 0 660 150" role="img" aria-label="เพดานเลเวอเรจไม่ใช่เป้า">
  <rect x="40" y="60" width="70" height="32" fill="var(--up-tint)" stroke="var(--up)" stroke-width="1"/>
  <rect x="110" y="60" width="120" height="32" fill="var(--gold-tint)" stroke="var(--gold)" stroke-width="1"/>
  <rect x="230" y="60" width="390" height="32" fill="var(--down-tint)" stroke="var(--down)" stroke-width="1"/>
  <text class="t-xs t-up" x="75" y="80" text-anchor="middle">0–30×</text>
  <text class="t-xs t-gold" x="170" y="80" text-anchor="middle">30–100×</text>
  <text class="t-xs t-down" x="420" y="80" text-anchor="middle">100–500× (โบรกให้ถึงตรงนี้)</text>
  <polygon points="90,44 82,58 98,58" fill="var(--ink)"/>
  <text class="t-xs" x="90" y="38" text-anchor="middle">คุณควรอยู่แถวนี้</text>
  <text class="t-sm" x="330" y="122" text-anchor="middle">เพดานที่โบรกให้ ≠ ระดับที่คุณควรใช้</text>
</svg>`;

const SVG_HEAT = `<svg viewBox="0 0 660 160" role="img" aria-label="portfolio heat ความเสี่ยงรวม">
  <text class="t-sm" x="8" y="22">เปิด 5 ไม้ ไม้ละเสี่ยง 2% = เสี่ยงพร้อมกัน 10%</text>
  <rect class="bar-n" x="40" y="44" width="580" height="40"/>
  <rect class="bar-down" x="40" y="44" width="290" height="40" fill-opacity="0.5"/>
  <line x1="40" y1="44" x2="40" y2="84" stroke="var(--panel)" stroke-width="2"/>
  <line x1="98" y1="44" x2="98" y2="84" stroke="var(--panel)" stroke-width="2"/>
  <line x1="156" y1="44" x2="156" y2="84" stroke="var(--panel)" stroke-width="2"/>
  <line x1="214" y1="44" x2="214" y2="84" stroke="var(--panel)" stroke-width="2"/>
  <line x1="272" y1="44" x2="272" y2="84" stroke="var(--panel)" stroke-width="2"/>
  <text class="t-sm t-down" x="185" y="70" text-anchor="middle">10% ที่เสี่ยงรวม</text>
  <text class="t-xs" x="470" y="70" text-anchor="middle">กันชนที่เหลือ</text>
  <text class="t-xs t-gold" x="40" y="112">กฎ: จำกัดความเสี่ยงรวมทั้งพอร์ต (portfolio heat) ไม่ใช่แค่ต่อไม้</text>
</svg>`;

const SVG_CORR = `<svg viewBox="0 0 660 170" role="img" aria-label="correlation เปิดสองไม้ที่เป็นเดิมพันเดียวกัน">
  <rect class="chip-n" x="30" y="40" width="180" height="50" rx="3"/>
  <text class="t-sm" x="120" y="70" text-anchor="middle">ซื้อทอง (XAUUSD)</text>
  <rect class="chip-n" x="30" y="100" width="180" height="50" rx="3"/>
  <text class="t-sm" x="120" y="130" text-anchor="middle">ซื้อ EUR/USD</text>
  <path d="M215,90 L255,90 M246,83 L258,90 L246,97" fill="none" stroke="var(--down)" stroke-width="2"/>
  <rect class="chip-bad" x="265" y="66" width="365" height="58" rx="3"/>
  <text class="t-md t-down" x="447" y="90" text-anchor="middle">จริง ๆ คือเดิมพัน &quot;USD อ่อน&quot; 2 เท่า</text>
  <text class="t-xs" x="447" y="112" text-anchor="middle">เสี่ยง 2% + 2% = เสี่ยง 4% ในเดิมพันเดียว</text>
</svg>`;

const SVG_RISKPLAN = `<svg viewBox="0 0 660 200" role="img" aria-label="กฎ risk ส่วนตัว">
  <rect class="chip-gold" x="40" y="24" width="580" height="152" rx="3"/>
  <text class="t-md t-gold" x="64" y="56">กฎความเสี่ยงของฉัน</text>
  <text class="t-sm" x="64" y="90">◆ ต่อไม้: เสี่ยงไม่เกิน 1% ของพอร์ต</text>
  <text class="t-sm" x="64" y="120">◆ ต่อวัน: ขาดทุนถึง −3% → หยุดเทรดวันนั้น</text>
  <text class="t-sm" x="64" y="150">◆ Circuit breaker: แพ้ติดกัน 2 ไม้ → ปิดจอ พัก</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 4 · หมวด 4.3</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Leverage ในชีวิตจริง</span>
        <h1>เลเวอเรจที่คุณ &quot;ใช้จริง&quot; — และกฎที่ทำให้คุณอยู่รอด</h1>
        <p className="lead">
          ปิดหมวดการบริหารความเสี่ยงด้วยภาพรวมทั้งพอร์ต: เลเวอเรจจริงที่คุณใช้ (ไม่ใช่ที่โบรกโฆษณา),
          ความเสี่ยงรวมเมื่อเปิดหลายไม้ และสิ่งที่สำคัญที่สุด — <b>การเขียนกฎ risk ของตัวเองเป็นลายลักษณ์อักษร</b>
        </p>
      </div>

      <div className="wrap">
        {/* L1 effective leverage */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>★ Effective vs Offered Leverage — เลขที่สำคัญจริง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_EFFLEV }} />
            <div className="figcap">โบรก &quot;ให้&quot; 1:500 แต่เลเวอเรจที่คุณ &quot;ใช้จริง&quot; = มูลค่าสถานะ ÷ เงินในพอร์ต</div>
          </div>
          <div className="calc c3">
            <div className="crow head"><span>ขนาดไม้ (ทอง)</span><span className="v">มูลค่าสถานะ</span><span className="v">เลเวอเรจจริง</span></div>
            <div className="crow"><span className="k">0.02 lot</span><span className="v">$5,300</span><span className="v pos">5.3×</span></div>
            <div className="crow"><span className="k">0.10 lot</span><span className="v">$26,500</span><span className="v warn">26.5×</span></div>
            <div className="crow stop"><span className="k">1.00 lot</span><span className="v">$265,000</span><span className="v neg">265×</span></div>
          </div>
          <div className="body-txt">
            <p>โบรกโฆษณา &quot;เลเวอเรจสูงถึง 1:500&quot; แต่นั่นคือ<b>เพดานสูงสุด</b> ไม่ใช่สิ่งที่คุณใช้ เลเวอเรจที่ใช้จริง (effective) = มูลค่าสถานะที่เปิด ÷ เงินในพอร์ต — และมัน<b>ขึ้นกับขนาดไม้ที่คุณเลือก ไม่ใช่ตัวเลขที่โบรกให้</b></p>
            <p>บัญชี $1,000 เปิดทอง 0.02 lot = ใช้จริงแค่ 5.3× (ปลอดภัย) แต่ถ้าเปิด 1.00 lot = 265× (สูงเกินระดับที่ควบคุมได้) ทั้งที่โบรกให้ 500 เท่ากัน — คุณคือคนกำหนดว่าจะเสี่ยงแค่ไหน ผ่านขนาดไม้</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เลเวอเรจที่ใช้จริง = มูลค่าสถานะ ÷ พอร์ต · คุณคุมมันผ่านขนาดไม้</p></div>
        </div>

        {/* L2 offered != target */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>1:500 ที่โบรกให้ ไม่ใช่เหตุผลที่ต้องใช้ 1:500</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_DIAL }} />
            <div className="figcap">เพดานที่โบรกให้เป็นแค่ &quot;ขีดสูงสุด&quot; — ไม่ใช่ระดับที่แนะนำหรือควรใช้</div>
          </div>
          <div className="body-txt">
            <p>มือใหม่คิดว่า &quot;โบรกให้ 500 ก็ควรใช้ให้คุ้ม&quot; — ผิดถนัด เพดานเลเวอเรจเป็นแค่ขีดจำกัด ไม่ใช่คำแนะนำ เทรดเดอร์ที่อยู่รอดส่วนใหญ่ใช้ effective leverage ต่ำ (มักไม่เกิน 10–30× ในทางปฏิบัติ) เพราะ<b>ยิ่งเลเวอเรจจริงสูง ระยะที่ราคาสวนได้ก่อนเงินทุนหมดยิ่งสั้น</b> (จำหมวด 1.3 Margin ได้ไหม)</p>
            <p>เหตุผลที่โบรกเสนอเลเวอเรจสูง ไม่ได้เป็นไปเพื่อประโยชน์ของผู้เทรด — แต่เพราะทำให้เปิดไม้ใหญ่ขึ้น จ่ายสเปรดมากขึ้น และสูญเสียเงินทุนเร็วขึ้น (ซึ่งเป็นผลดีต่อโบรกแบบ B-Book)</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เพดาน ≠ เป้า · เลเวอเรจจริงต่ำ = ระยะให้พลาดยาวขึ้น = อยู่รอดนานขึ้น</p></div>
        </div>

        {/* L3 portfolio heat */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>Portfolio Heat — ความเสี่ยงรวมทั้งพอร์ต</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_HEAT }} />
            <div className="figcap">เสี่ยง 2% ต่อไม้ดูน้อย — แต่เปิด 5 ไม้พร้อมกันคือเสี่ยง 10% พร้อมกัน</div>
          </div>
          <div className="body-txt">
            <p>คุณอาจเสี่ยงแค่ 2% ต่อไม้อย่างมีวินัย — แต่ถ้าเปิด 5 ไม้พร้อมกัน คุณกำลังเสี่ยง<b>รวม 10%</b> ในเวลาเดียว ถ้าตลาดพลิกแรง (เช่นข่าวออก) ทุกไม้โดน SL พร้อมกันได้ นี่คือ <b>portfolio heat</b> — ความเสี่ยงรวมที่มือใหม่มักลืมนับ</p>
            <p>กฎที่ดี: จำกัดความเสี่ยงรวมทั้งพอร์ต (เช่น ไม่เกิน 5–6% พร้อมกัน) ไม่ใช่แค่คุมต่อไม้ — เพราะไม้ที่เปิดพร้อมกันมักได้รับผลจากเหตุการณ์เดียวกัน</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>นับความเสี่ยง &quot;รวมทั้งพอร์ต&quot; ไม่ใช่แค่ต่อไม้ — หลายไม้โดนพร้อมกันได้</p></div>
        </div>

        {/* L4 correlation */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>Correlation — เปิดหลายไม้ที่จริง ๆ คือเดิมพันเดียว</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CORR }} />
            <div className="figcap">ทอง + EUR/USD ขาขึ้น = เดิมพัน &quot;ดอลลาร์อ่อน&quot; ซ้ำสองครั้ง (ไม่ใช่กระจายความเสี่ยง)</div>
          </div>
          <div className="body-txt">
            <p>เปิดหลายไม้ไม่ได้แปลว่ากระจายความเสี่ยงเสมอ — ถ้าไม้เหล่านั้น<b>สัมพันธ์กัน (correlated)</b> คุณกำลังเดิมพันเรื่องเดียวหลายเท่า เช่น ซื้อทอง + ซื้อ EUR/USD จริง ๆ แล้วทั้งคู่คือการเดิมพัน &quot;ดอลลาร์อ่อน&quot; — ถ้าดอลลาร์แข็งขึ้น คุณเจ็บทั้งสองไม้พร้อมกัน</p>
            <p>ก่อนเปิดไม้ที่ 2 ให้ถามว่า &quot;ไม้นี้เดิมพันเรื่องเดียวกับที่ผมถืออยู่ไหม&quot; — ถ้าใช่ แปลว่าคุณกำลังเพิ่มความเสี่ยง ไม่ใช่กระจายมัน (เรื่อง correlation เจาะลึกในระดับสูงขึ้น)</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ไม้ที่สัมพันธ์กัน = เดิมพันเดียวหลายเท่า ไม่ใช่การกระจายความเสี่ยง</p></div>
        </div>

        {/* L5 risk plan */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>★ เขียนกฎ Risk ของตัวเอง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RISKPLAN }} />
            <div className="figcap">กฎที่เขียนไว้ล่วงหน้า = สิ่งที่ปกป้องคุณตอนอารมณ์เข้าครอบงำ</div>
          </div>
          <div className="body-txt">
            <p>ความรู้ทั้งหมดในหมวดนี้ไร้ค่าถ้าไม่ถูกแปลงเป็น<b>กฎที่เขียนไว้และทำตาม</b> เพราะตอนอยู่หน้าจอที่ขาดทุนติด ๆ กัน สมองจะหาเหตุผลให้ทำผิด — กฎที่เขียนไว้ล่วงหน้าคือสิ่งเดียวที่หยุดคุณได้ อย่างน้อยควรมี 3 ระดับ:</p>
            <ul className="reasons">
              <li><b>ต่อไม้</b> — เสี่ยงไม่เกิน 1% (จากสูตรหมวด 4.2)</li>
              <li><b>ต่อวัน</b> — ขาดทุนถึง −X% แล้วหยุด (กัน revenge trade)</li>
              <li><b>Circuit breaker</b> — แพ้ติดกัน N ไม้ → ปิดจอทันที (กันวันที่ &quot;ไม่ใช่ของเรา&quot;)</li>
            </ul>
            <p>เขียนมันลงกระดาษ ติดไว้ข้างจอ นี่คือสิ่งที่แยกเทรดเดอร์ที่อยู่รอดจากคนที่หายไปในเดือนแรก</p>
          </div>
          <div className="bridge">
            <span className="bi">✓</span>
            <div>
              <span className="bl">จบระดับ 4 — และจบโซนฟรีทั้งหมด!</span>
              <p>คุณผ่าน &quot;การเอาตัวรอด&quot; ครบแล้ว ซึ่งสำคัญกว่ากลยุทธ์ใด ๆ — ต่อจากนี้คือโซน Premium เริ่มที่ <b>ระดับ 5: Price Action</b> (กำลังจัดทำ) กลับไปดู <b><a href="/grade">แผนที่หลักสูตร</a></b> ได้ที่หน้าหลัก</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>แปลงความรู้เป็นกฎที่เขียนไว้ (ต่อไม้/ต่อวัน/circuit breaker) — กฎปกป้องคุณจากตัวเอง</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · ตัวเลขเป็นตัวอย่าง ค่าจริงต่างกันตามโบรก · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 4 หมวด 4.3
      </div>
    </>
  );
}
