import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 1 · โบรกเกอร์ รู้ก่อนฝากเงิน — A-Book/B-Book, Regulation · Cerfinits Grade",
  description:
    "โบรกเกอร์ทำงานยังไง เอากำไรจากไหน ดู regulation ยังไง เทรดในไทยถูกกฎหมายไหม บทเรียนจาก Forex-3D และการใช้ demo — บนหลักฐาน",
  alternates: { canonical: "/grade/choosing-broker" },
};

const SVG_ABBOOK = `<svg viewBox="0 0 660 250" role="img" aria-label="A-Book กับ B-Book">
  <rect class="chip-n" x="265" y="20" width="130" height="40" rx="3"/>
  <text class="t-md" x="330" y="45" text-anchor="middle">คำสั่งของคุณ</text>
  <path d="M300,60 L175,124" stroke="var(--up)" stroke-width="1.5"/>
  <path d="M360,60 L485,124" stroke="var(--down)" stroke-width="1.5"/>
  <rect class="chip-ok" x="40" y="128" width="250" height="104" rx="3"/>
  <text class="t-md t-up" x="165" y="156" text-anchor="middle">A-Book</text>
  <text class="t-sm" x="165" y="180" text-anchor="middle">ส่งเข้าตลาดจริง</text>
  <text class="t-sm" x="165" y="200" text-anchor="middle">ได้ spread/commission</text>
  <text class="t-sm t-up" x="165" y="220" text-anchor="middle">ไม่ขัดผลประโยชน์</text>
  <rect class="chip-bad" x="370" y="128" width="250" height="104" rx="3"/>
  <text class="t-md t-down" x="495" y="156" text-anchor="middle">B-Book</text>
  <text class="t-sm" x="495" y="180" text-anchor="middle">โบรกรับไม้ตรงข้ามเอง</text>
  <text class="t-sm" x="495" y="200" text-anchor="middle">คุณเสีย = โบรกได้</text>
  <text class="t-sm t-down" x="495" y="220" text-anchor="middle">ขัดผลประโยชน์</text>
</svg>`;

const SVG_REV = `<svg viewBox="0 0 660 130" role="img" aria-label="โบรกเกอร์ทำเงินจากอะไร">
  <rect class="chip-n" x="24" y="24" width="140" height="86" rx="3"/>
  <text class="t-sm" x="94" y="60" text-anchor="middle">Spread</text>
  <text class="t-xs" x="94" y="82" text-anchor="middle">ทุกไม้</text>
  <rect class="chip-n" x="180" y="24" width="140" height="86" rx="3"/>
  <text class="t-sm" x="250" y="60" text-anchor="middle">Commission</text>
  <text class="t-xs" x="250" y="82" text-anchor="middle">ต่อลอต</text>
  <rect class="chip-n" x="336" y="24" width="140" height="86" rx="3"/>
  <text class="t-sm" x="406" y="60" text-anchor="middle">Swap</text>
  <text class="t-xs" x="406" y="82" text-anchor="middle">ค้างคืน</text>
  <rect class="chip-bad" x="492" y="24" width="144" height="86" rx="3"/>
  <text class="t-sm t-down" x="564" y="56" text-anchor="middle">ขาดทุนลูกค้า</text>
  <text class="t-xs" x="564" y="78" text-anchor="middle">(เฉพาะ B-Book)</text>
  <text class="t-xs t-down" x="564" y="96" text-anchor="middle">จุดขัดแย้ง</text>
</svg>`;

const SVG_REG = `<svg viewBox="0 0 660 210" role="img" aria-label="ระดับความเข้มงวดของ regulator">
  <rect class="bar-up" x="60" y="22" width="540" height="52" rx="3"/>
  <text class="t-md t-up" x="80" y="44" text-anchor="start">Tier 1 · เข้มงวดสุด</text>
  <text class="t-sm" x="80" y="64" text-anchor="start">FCA (UK) · ASIC (AU) · NFA (US) — คุ้มครองสูง เงินลูกค้าแยกบัญชี</text>
  <rect class="bar-gold" x="60" y="82" width="540" height="52" rx="3"/>
  <text class="t-md t-gold" x="80" y="104" text-anchor="start">Tier 2 · กลาง</text>
  <text class="t-sm" x="80" y="124" text-anchor="start">CySEC (ไซปรัส) · หน่วยงาน EU อื่น ๆ</text>
  <rect class="bar-down" x="60" y="142" width="540" height="52" rx="3"/>
  <text class="t-md t-down" x="80" y="164" text-anchor="start">Offshore · ใบอนุญาตกระดาษ</text>
  <text class="t-sm" x="80" y="184" text-anchor="start">เกาะเล็ก ๆ — กำกับหลวม คุ้มครองต่ำ (โบรกที่คนไทยใช้ส่วนใหญ่อยู่ชั้นนี้)</text>
</svg>`;

const SVG_THLEGAL = `<svg viewBox="0 0 660 210" role="img" aria-label="สถานะกฎหมายการเทรดในไทย">
  <text class="t-sm" x="330" y="20" text-anchor="middle">สถานะทั่วไป ณ ปัจจุบัน · ไม่ใช่คำแนะนำทางกฎหมาย</text>
  <rect class="chip-gold" x="30" y="34" width="290" height="150" rx="3"/>
  <text class="t-md t-gold" x="175" y="64" text-anchor="middle">เทรดเอง ด้วยเงินตัวเอง</text>
  <text class="t-sm" x="175" y="92" text-anchor="middle">ผ่านโบรกต่างประเทศ</text>
  <text class="t-sm" x="175" y="116" text-anchor="middle">= พื้นที่สีเทา</text>
  <text class="t-xs" x="175" y="144" text-anchor="middle">ไม่มีใบอนุญาต onshore</text>
  <text class="t-xs" x="175" y="162" text-anchor="middle">ไม่มีการคุ้มครองตามกฎหมายไทย</text>
  <rect class="chip-bad" x="340" y="34" width="290" height="150" rx="3"/>
  <text class="t-md t-down" x="485" y="64" text-anchor="middle">ยุ่งกับเงินคนอื่น</text>
  <text class="t-sm" x="485" y="92" text-anchor="middle">ชักชวน / รับฝากเทรด</text>
  <text class="t-sm" x="485" y="116" text-anchor="middle">ระดมทุน โดยไม่มีใบอนุญาต</text>
  <text class="t-xs t-down" x="485" y="150" text-anchor="middle">ผิดกฎหมายชัดเจน</text>
  <text class="t-xs t-down" x="485" y="168" text-anchor="middle">(ฉ้อโกง / พ.ร.ก.กู้ยืมเงินฯ)</text>
</svg>`;

const SVG_FOREX3D = `<svg viewBox="0 0 660 190" role="img" aria-label="เทรดเองกับฝากเทรด">
  <rect class="chip-ok" x="30" y="26" width="290" height="140" rx="3"/>
  <text class="t-md t-up" x="175" y="58" text-anchor="middle">เทรดเอง</text>
  <text class="t-sm" x="175" y="88" text-anchor="middle">เงินอยู่ในบัญชีของคุณ</text>
  <text class="t-sm" x="175" y="110" text-anchor="middle">คุณกดออเดอร์เอง</text>
  <text class="t-sm" x="175" y="132" text-anchor="middle">ถอนเองได้ตลอด</text>
  <rect class="chip-bad" x="340" y="26" width="290" height="140" rx="3"/>
  <text class="t-md t-down" x="485" y="58" text-anchor="middle">ฝากเทรด / การันตีกำไร</text>
  <text class="t-sm" x="485" y="88" text-anchor="middle">เงินอยู่กับคนอื่น</text>
  <text class="t-sm t-down" x="485" y="112" text-anchor="middle">🚩 รูปแบบเดียวกับ Forex-3D</text>
  <text class="t-sm" x="485" y="134" text-anchor="middle">การันตี % = สัญญาณหลอก</text>
</svg>`;

const SVG_DEMO = `<svg viewBox="0 0 660 170" role="img" aria-label="demo กับ live">
  <rect class="chip-n" x="40" y="30" width="250" height="110" rx="3"/>
  <text class="t-md" x="165" y="60" text-anchor="middle">Demo · เงินจำลอง</text>
  <text class="t-sm t-up" x="165" y="88" text-anchor="middle">สอนได้: กลไก + แพลตฟอร์ม</text>
  <text class="t-sm t-down" x="165" y="110" text-anchor="middle">สอนไม่ได้: อารมณ์เงินจริง</text>
  <path d="M300,85 L360,85 M350,77 L362,85 L350,93" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-gold" x="370" y="30" width="250" height="110" rx="3"/>
  <text class="t-md t-gold" x="495" y="60" text-anchor="middle">Live · เงินจริง</text>
  <text class="t-sm" x="495" y="88" text-anchor="middle">อารมณ์จริงเข้ามาเต็ม ๆ</text>
  <text class="t-sm" x="495" y="110" text-anchor="middle">เริ่มก้อนเล็กที่เสียได้</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 1 · หมวด 1.4</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">โบรกเกอร์ — รู้ก่อนฝากเงิน</span>
        <h1>ก่อนโอนเงินเข้าโบรก คุณควรรู้อะไรบ้าง</h1>
        <p className="lead">
          โบรกเกอร์คือ &quot;ประตู&quot; เข้าตลาด และเป็นที่ที่<b>เงินจริงของคุณไปอยู่</b> —
          หมวดนี้เปิดกลไกให้เห็นว่าโบรกทำงานและทำเงินยังไง, ดูใบอนุญาตยังไง,
          สถานะกฎหมายในไทยเป็นแบบไหน และบทเรียนราคาแพงจากคดี Forex-3D
        </p>
      </div>

      <div className="wrap">
        {/* L1 A/B book */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>โบรกทำงานยังไง: A-Book vs B-Book</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_ABBOOK }} />
            <div className="figcap">B-Book = โบรกได้กำไรเมื่อคุณขาดทุน — นี่คือจุดขัดแย้งผลประโยชน์ที่ต้องรู้</div>
          </div>
          <div className="body-txt">
            <p>เมื่อคุณกดออเดอร์ โบรกจัดการมันได้ 2 แบบ: <b>A-Book</b> คือส่งคำสั่งออกไปตลาดจริง โบรกได้เงินจาก spread/commission — ไม่ว่าคุณกำไรหรือขาดทุน โบรกได้เท่ากัน (ไม่ขัดแย้ง) ส่วน <b>B-Book</b> คือโบรกรับไม้ตรงข้ามคุณเอง แปลว่า<b>คุณขาดทุน = โบรกได้กำไร</b>โดยตรง</p>
            <p>B-Book ไม่ได้ผิดกฎหมายและโบรกใหญ่หลายเจ้าก็ทำ (เพราะรายย่อยส่วนใหญ่ขาดทุนอยู่แล้ว) แต่คุณ<b>ควรรู้ว่ามันมีจุดขัดแย้ง</b> — และเป็นเหตุผลว่าทำไมเรื่องถัดไป (regulation) ถึงสำคัญ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>B-Book = โบรกได้เมื่อคุณเสีย — ไม่ผิด แต่ต้องรู้ว่ามีจุดขัดแย้ง</p></div>
        </div>

        {/* L2 how brokers make money */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>โบรกเอากำไรจากไหน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_REV }} />
            <div className="figcap">&quot;คอมมิชชัน 0&quot; ไม่ได้แปลว่าฟรี — เขาแค่ไปเก็บที่ spread แทน</div>
          </div>
          <div className="body-txt">
            <p>โบรกได้เงินจาก spread, commission, swap และ (ถ้าเป็น B-Book) จากผลขาดทุนของลูกค้า จำไว้ว่า<b>โบรกไม่มีทางให้บริการฟรี</b> — โฆษณา &quot;สเปรด 0&quot; หรือ &quot;ไม่มีคอมมิชชัน&quot; แปลว่าเขาไปเก็บต้นทุนที่ช่องอื่นแทน</p>
            <p>ประเด็นสำหรับคุณ: อย่าเลือกโบรกจาก &quot;โบนัส&quot; หรือ &quot;เลเวอเรจสูง ๆ&quot; ที่เขาใช้ล่อ — สิ่งที่ควรดูคือ<b>ต้นทุนรวมจริง</b> (spread + commission) และความน่าเชื่อถือ ต่างหาก</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ไม่มีโบรกฟรี — ดูต้นทุนรวมจริง อย่าหลงโบนัส/เลเวอเรจสูง</p></div>
        </div>

        {/* L3 regulation */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>Regulation — ดูใบอนุญาตให้เป็น</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_REG }} />
            <div className="figcap">&quot;มีใบอนุญาต&quot; ไม่เท่ากันหมด — ใบอนุญาตเกาะเล็ก ๆ คุ้มครองคุณได้น้อยมาก</div>
          </div>
          <div className="body-txt">
            <p>คำว่า &quot;โบรกในกำกับ&quot; หลอกได้ เพราะใบอนุญาตมีหลายระดับ Tier 1 (FCA, ASIC, NFA) เข้มงวดจริง บังคับแยกเงินลูกค้าออกจากเงินบริษัท มีกองทุนชดเชย ส่วนใบอนุญาตจากเกาะเล็ก ๆ มักเป็น &quot;กระดาษ&quot; ที่คุ้มครองคุณแทบไม่ได้</p>
            <p><b>ความจริงที่ต้องยอมรับ:</b> โบรกที่คนไทยใช้กันเยอะส่วนใหญ่ให้บริการผ่าน entity ที่จดทะเบียน offshore (เพื่อเสนอเลเวอเรจสูงที่ Tier 1 ห้าม) — ไม่ได้แปลว่าใช้ไม่ได้ แต่แปลว่า<b>ถ้ามีปัญหา คุณแทบไม่มีใครให้ร้อง</b> ต้องชั่งน้ำหนักเอง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เช็ก tier ของใบอนุญาต — เลเวอเรจสูงมักมาคู่กับการคุ้มครองต่ำ</p></div>
        </div>

        {/* L4 Thai legal */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>★ เทรด Forex ในไทยถูกกฎหมายไหม</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_THLEGAL }} />
            <div className="figcap">เส้นแบ่งอยู่ที่ &quot;เงินของใคร&quot; — เทรดเงินตัวเอง ต่างจากไปยุ่งกับเงินคนอื่น</div>
          </div>
          <div className="body-txt">
            <p>คำตอบตรง ๆ แบบไม่ขายฝัน: การซื้อขายเงินตรา/CFD แบบมีเลเวอเรจสำหรับรายย่อย <b>ยังไม่มีผู้ให้บริการที่ได้รับใบอนุญาตในไทยโดยตรง</b> คนไทยส่วนใหญ่จึงเทรดผ่านโบรกต่างประเทศ ซึ่งเป็น &quot;พื้นที่สีเทา&quot; — ตัวการเทรดด้วยเงินตัวเองไม่ใช่ความผิดหลัก แต่<b>คุณจะไม่ได้รับการคุ้มครองตามกฎหมายไทย</b>ถ้าโบรกโกงหรือปิดหนี</p>
            <p>เส้นที่<b>ผิดกฎหมายชัดเจน</b>คือการไป &quot;ยุ่งกับเงินคนอื่น&quot; — ชักชวนประชาชน รับฝากเทรด หรือระดมทุนโดยไม่มีใบอนุญาต อันนี้เข้าข่ายฉ้อโกง/พ.ร.ก.กู้ยืมเงินฯ</p>
            <div className="note">
              <span className="nl">ข้อจำกัดของบทนี้</span>
              <p>นี่คือความเข้าใจสถานะทั่วไป ณ ปัจจุบัน <b>ไม่ใช่คำแนะนำทางกฎหมาย</b> และกฎเกณฑ์ (รวมถึงเรื่องภาษีเงินได้ต่างประเทศ) เปลี่ยนได้ — ถ้าจะลงเงินก้อนใหญ่หรือทำเป็นอาชีพ ควรปรึกษาผู้เชี่ยวชาญด้านกฎหมาย/ภาษีก่อน</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เทรดเงินตัวเอง = สีเทา (ไม่มีคุ้มครอง) · ยุ่งเงินคนอื่น = ผิดชัดเจน</p></div>
        </div>

        {/* L5 Forex-3D */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>★ บทเรียนจาก Forex-3D</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_FOREX3D }} />
            <div className="figcap">คดีนี้ไม่ใช่ &quot;เทรดแล้วขาดทุน&quot; แต่คือ &quot;มอบเงินให้ผู้อื่นบริหารแล้วถูกฉ้อโกง&quot;</div>
          </div>
          <div className="body-txt">
            <p>Forex-3D เป็นคดีฉ้อโกงประชาชนครั้งใหญ่ในไทย — อ้างว่าเอาเงินไป &quot;เทรด forex&quot; ให้ การันตีผลตอบแทนสูง มีคนดังช่วยโปรโมต สุดท้ายเป็น<b>แชร์ลูกโซ่</b> เหยื่อหลายหมื่นราย ความเสียหายหลายพันล้านบาท</p>
            <p>บทเรียนไม่ใช่ &quot;forex มันหลอกลวง&quot; — เพราะเหยื่อส่วนใหญ่<b>ไม่เคยเทรดเองเลย</b> พวกเขาแค่ &quot;ฝากเงินให้คนอื่นเทรด&quot; เส้นแบ่งจึงชัด: เมื่อไหร่ที่มีคน <b>การันตีกำไร + ให้คุณโอนเงินไปให้เขาจัดการ</b> — นั่นคือแพทเทิร์นของการโกง ไม่ว่าจะแปะป้าย forex, คริปโต หรืออะไรก็ตาม</p>
            <div className="banned">
              <span className="bl">สัญญาณหลอกที่ต้องหนี</span>
              <span className="x">การันตี % ต่อเดือน</span>
              <span className="x">โอนเงินให้เขาเทรดแทน</span>
              <span className="x">ชวนต่อได้ค่าแนะนำ</span>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>การันตีกำไร + ให้โอนเงินไปให้จัดการ = โกง เสมอ ไม่มีข้อยกเว้น</p></div>
        </div>

        {/* L6 demo */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>Demo Account — ใช้ให้ได้ประโยชน์จริง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_DEMO }} />
            <div className="figcap">Demo สอน &quot;กลไก&quot; ได้ แต่สอน &quot;อารมณ์ตอนเงินจริงหาย&quot; ไม่ได้</div>
          </div>
          <div className="body-txt">
            <p>บัญชี demo คือสนามซ้อมด้วยเงินจำลอง ฟรีและไม่มีความเสี่ยง — ใช้มันให้คุ้มด้วยการฝึก<b>กลไก</b>ให้คล่อง: เปิด/ปิดออเดอร์ ตั้ง SL/TP อ่านหน้าจอ ทดสอบระบบ โดยยังไม่เสียเงินจริงสักบาท</p>
            <p>แต่รู้ข้อจำกัดของมันด้วย: demo <b>สอนอารมณ์ไม่ได้</b> — ความกลัวตอนเห็นเงินจริงหาย ความโลภตอนกำไร มันมาตอนใช้เงินจริงเท่านั้น ฉะนั้น &quot;เก่งใน demo&quot; ไม่เท่ากับ &quot;พร้อมเงินจริง&quot; ทางที่ถูกคือ: ฝึก demo จนกลไกคล่อง → เริ่มเงินจริง<b>ก้อนเล็กที่เสียได้</b> → ค่อยขยายเมื่อพิสูจน์ตัวเองแล้ว</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">ปิดท้ายระดับ 1</span>
              <p>รู้จักสนาม ศัพท์ เลเวอเรจ และโบรกครบแล้ว ก่อนไปเรียนเทคนิค แวะอ่าน <b><a href="/grade/reality-check">1.5 Reality Check</a></b> — ความจริงเรื่องสถิติคนขาดทุนและ mindset ที่ถูกต้องก่อนเริ่มจริง</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>demo ฝึกกลไกได้ แต่พร้อมจริงต้องผ่าน &quot;เงินจริงก้อนเล็ก&quot; — เก่ง demo ≠ พร้อม</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุนหรือคำแนะนำทางกฎหมาย · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · สถานะกฎหมายอาจเปลี่ยนแปลง โปรดตรวจสอบล่าสุดและปรึกษาผู้เชี่ยวชาญ · Cerfinits Grade · ระดับ 1 หมวด 1.4
      </div>
    </>
  );
}
