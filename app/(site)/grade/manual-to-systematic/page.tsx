import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ซัมเมอร์ S4 · จาก Manual สู่ Systematic — เส้นทางสู่ระบบอัตโนมัติ · Cerfinits Grade",
  description:
    "Premium: ระดับขั้นของการเทรดเชิงระบบ, สิ่งที่ automation แก้ได้และแก้ไม่ได้, เส้นทางเชิงปฏิบัติจากกฎสู่โค้ด, กระบวนการวิจัยระบบจริง และแผนการเรียนรู้สาย systematic",
  alternates: { canonical: "/grade/manual-to-systematic" },
};

const SVG_SPECTRUM = `<svg viewBox="0 0 660 210" role="img" aria-label="ระดับขั้นจาก manual สู่ automated">
  <rect class="chip-n" x="24" y="40" width="146" height="80" rx="3"/>
  <text class="t-sm" x="97" y="70" text-anchor="middle">Manual</text>
  <text class="t-xs" x="97" y="94" text-anchor="middle">ตัดสินใจตามดุลยพินิจ</text>
  <path d="M175,80 L192,80 M186,74 L196,80 L186,86" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-gold" x="200" y="40" width="146" height="80" rx="3" stroke-width="2.5"/>
  <text class="t-sm t-gold" x="273" y="70" text-anchor="middle">Rule-based</text>
  <text class="t-xs" x="273" y="94" text-anchor="middle">กฎชัด คนกดเอง</text>
  <path d="M351,80 L368,80 M362,74 L372,80 L362,86" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="376" y="40" width="128" height="80" rx="3"/>
  <text class="t-sm" x="440" y="70" text-anchor="middle">Semi-auto</text>
  <text class="t-xs" x="440" y="94" text-anchor="middle">Alert เตือน คนยืนยัน</text>
  <path d="M509,80 L526,80 M520,74 L530,80 L520,86" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="534" y="40" width="102" height="80" rx="3"/>
  <text class="t-sm" x="585" y="70" text-anchor="middle">Automated</text>
  <text class="t-xs" x="585" y="94" text-anchor="middle">ระบบทำทั้งหมด</text>
  <polygon points="273,146 265,160 281,160" fill="var(--ink)"/>
  <text class="t-xs" x="273" y="180" text-anchor="middle">ผู้ที่จบระดับ 7 อยู่ที่ขั้นนี้แล้ว — เหลือการเดินไปทางขวาทีละขั้น</text>
</svg>`;

const SVG_FIXES = `<svg viewBox="0 0 660 230" role="img" aria-label="automation แก้อะไรได้และไม่ได้">
  <text class="t-sm t-up" x="165" y="24" text-anchor="middle">Automation แก้ได้</text>
  <rect class="chip-ok" x="30" y="36" width="270" height="44" rx="3"/><text class="t-xs" x="165" y="62" text-anchor="middle">ความผิดพลาดของการ execute · ลืมตั้ง SL</text>
  <rect class="chip-ok" x="30" y="88" width="270" height="44" rx="3"/><text class="t-xs" x="165" y="114" text-anchor="middle">การตัดสินใจภายใต้อารมณ์ (tilt — 7.2)</text>
  <rect class="chip-ok" x="30" y="140" width="270" height="44" rx="3"/><text class="t-xs" x="165" y="166" text-anchor="middle">ข้อจำกัดเวลา — ระบบทำงานขณะคุณหลับ</text>
  <text class="t-sm t-down" x="495" y="24" text-anchor="middle">Automation แก้ไม่ได้</text>
  <rect class="chip-bad" x="360" y="36" width="270" height="44" rx="3"/><text class="t-xs" x="495" y="62" text-anchor="middle">ระบบที่ไม่มี edge — ขาดทุนเร็วขึ้นและสม่ำเสมอขึ้น</text>
  <rect class="chip-bad" x="360" y="88" width="270" height="44" rx="3"/><text class="t-xs" x="495" y="114" text-anchor="middle">Overfitting — ยิ่งจูนง่าย ยิ่งเสี่ยงสูงขึ้น</text>
  <rect class="chip-bad" x="360" y="140" width="270" height="44" rx="3"/><text class="t-xs" x="495" y="166" text-anchor="middle">การเปลี่ยน regime ของตลาด — ต้องมี kill criteria</text>
  <text class="t-xs" x="330" y="210" text-anchor="middle">automation ขยายคุณภาพของระบบที่มีอยู่ — ทั้งด้านดีและด้านเสีย</text>
</svg>`;

const SVG_PIPELINE = `<svg viewBox="0 0 660 220" role="img" aria-label="เส้นทางจากกฎสู่ระบบอัตโนมัติ">
  <rect class="chip-n" x="24" y="30" width="140" height="56" rx="3"/><text class="t-sm" x="94" y="54" text-anchor="middle">1 กฎจากระดับ 7</text><text class="t-xs" x="94" y="74" text-anchor="middle">ผ่าน two-readers test</text>
  <path d="M169,58 L192,58 M186,51 L196,58 L186,65" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="200" y="30" width="140" height="56" rx="3"/><text class="t-sm" x="270" y="54" text-anchor="middle">2 Pseudocode</text><text class="t-xs" x="270" y="74" text-anchor="middle">แปลกฎเป็นตรรกะ if-then</text>
  <path d="M345,58 L368,58 M362,51 L372,58 L362,65" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="376" y="30" width="140" height="56" rx="3"/><text class="t-sm" x="446" y="54" text-anchor="middle">3 โค้ด + backtest</text><text class="t-xs" x="446" y="74" text-anchor="middle">หักต้นทุนครบ (7.1)</text>
  <path d="M521,58 L544,58 M538,51 L548,58 L538,65" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-gold" x="552" y="30" width="84" height="56" rx="3" stroke-width="2"/><text class="t-sm t-gold" x="594" y="54" text-anchor="middle">4 OOS</text><text class="t-xs" x="594" y="74" text-anchor="middle">ครั้งเดียว</text>
  <path d="M594,92 L594,116 M587,106 L594,118 L601,106" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="510" y="122" width="126" height="56" rx="3"/><text class="t-sm" x="573" y="146" text-anchor="middle">5 Demo run</text><text class="t-xs" x="573" y="166" text-anchor="middle">เทียบผลกับ backtest</text>
  <path d="M505,150 L482,150 M488,143 L478,150 L488,157" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-ok" x="336" y="122" width="140" height="56" rx="3"/><text class="t-sm t-up" x="406" y="146" text-anchor="middle">6 Live ขนาดเล็ก</text><text class="t-xs" x="406" y="166" text-anchor="middle">kill criteria คุมตลอด</text>
  <text class="t-xs" x="170" y="155" text-anchor="middle">ขั้นตอนเดียวกับ lifecycle ระดับ 7</text>
  <text class="t-xs" x="170" y="173" text-anchor="middle">เพิ่มเพียงขั้นแปลกฎเป็นโค้ด</text>
</svg>`;

const SVG_RESEARCH = `<svg viewBox="0 0 660 230" role="img" aria-label="กระบวนการวิจัยระบบจริง">
  <rect class="chip-n" x="30" y="30" width="180" height="52" rx="3"/><text class="t-sm" x="120" y="52" text-anchor="middle">ตั้งสมมติฐานชัดเจน</text><text class="t-xs" x="120" y="72" text-anchor="middle">&quot;breakout ทองมี edge หรือไม่&quot;</text>
  <path d="M215,56 L245,56 M238,49 L250,56 L238,63" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="253" y="30" width="170" height="52" rx="3"/><text class="t-sm" x="338" y="52" text-anchor="middle">ข้อมูลคุณภาพสูง</text><text class="t-xs" x="338" y="72" text-anchor="middle">tick data หลายปี</text>
  <path d="M428,56 L458,56 M451,49 L461,56 L451,63" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="466" y="30" width="164" height="52" rx="3"/><text class="t-sm" x="548" y="52" text-anchor="middle">ทดสอบหลังหักต้นทุน</text><text class="t-xs" x="548" y="72" text-anchor="middle">spread · commission · slippage</text>
  <path d="M548,88 L548,112 M541,102 L548,114 L555,102" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-bad" x="360" y="118" width="270" height="56" rx="3"/>
  <text class="t-sm t-down" x="495" y="142" text-anchor="middle">ผลส่วนใหญ่: ไม่มี edge ที่มีนัย</text>
  <text class="t-xs" x="495" y="162" text-anchor="middle">→ ยุติแนวคิด บันทึกผล เริ่มสมมติฐานใหม่</text>
  <rect class="chip-ok" x="30" y="118" width="300" height="56" rx="3"/>
  <text class="t-sm t-up" x="180" y="142" text-anchor="middle">ผลส่วนน้อย: ผ่านทุกด่าน</text>
  <text class="t-xs" x="180" y="162" text-anchor="middle">→ OOS → demo → live ขนาดเล็ก</text>
  <text class="t-xs" x="330" y="210" text-anchor="middle">ผลลัพธ์ &quot;ไม่มี edge&quot; ที่ได้จากกระบวนการที่ถูกต้อง มีคุณค่า — มันปิดเส้นทางที่จะสูญเสียเงินจริง</text>
</svg>`;

const SVG_PATH = `<svg viewBox="0 0 660 190" role="img" aria-label="แผนการเรียนรู้สาย systematic">
  <rect class="chip-n" x="24" y="40" width="146" height="90" rx="3"/>
  <text class="t-sm" x="97" y="70" text-anchor="middle">ขั้นที่ 1</text>
  <text class="t-xs" x="97" y="94" text-anchor="middle">สถิติพื้นฐาน</text>
  <text class="t-xs" x="97" y="112" text-anchor="middle">(แจกแจง · sample size)</text>
  <rect class="chip-n" x="186" y="40" width="146" height="90" rx="3"/>
  <text class="t-sm" x="259" y="70" text-anchor="middle">ขั้นที่ 2</text>
  <text class="t-xs" x="259" y="94" text-anchor="middle">เครื่องมือหนึ่งตัว</text>
  <text class="t-xs" x="259" y="112" text-anchor="middle">Pine / MQL / Python</text>
  <rect class="chip-n" x="348" y="40" width="146" height="90" rx="3"/>
  <text class="t-sm" x="421" y="70" text-anchor="middle">ขั้นที่ 3</text>
  <text class="t-xs" x="421" y="94" text-anchor="middle">ทำระบบเดิมให้เป็นโค้ด</text>
  <text class="t-xs" x="421" y="112" text-anchor="middle">ก่อนคิดระบบใหม่</text>
  <rect class="chip-gold" x="510" y="40" width="126" height="90" rx="3" stroke-width="2"/>
  <text class="t-sm t-gold" x="573" y="70" text-anchor="middle">ขั้นที่ 4</text>
  <text class="t-xs" x="573" y="94" text-anchor="middle">วงจรวิจัยซ้ำ</text>
  <text class="t-xs" x="573" y="112" text-anchor="middle">สมมติฐาน → ทดสอบ → สรุป</text>
  <text class="t-xs" x="330" y="166" text-anchor="middle">ลำดับสำคัญ: ความเข้าใจเชิงสถิติมาก่อนเครื่องมือ — โค้ดที่เขียนเก่งไม่ช่วยระบบที่ตีความสถิติผิด</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>คอร์สซัมเมอร์ · S4 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">จาก Manual สู่ Systematic</span>
        <h1>เส้นทางสู่ระบบอัตโนมัติ — สำหรับผู้ที่มีระบบแล้ว</h1>
        <p className="lead">
          วิชาสุดท้ายของหลักสูตรว่าด้วยคำถามที่เทรดเดอร์สายระบบทุกคนถามในที่สุด:
          หากกฎชัดเจนพอที่คนทำตามได้ เหตุใดจึงไม่ให้คอมพิวเตอร์ทำแทน —
          คำตอบคือทำได้และมีข้อดีจริง แต่<b>ลำดับและเงื่อนไขสำคัญกว่าเทคโนโลยี</b>
          หมวดนี้อธิบายเส้นทางทั้งหมดจากประสบการณ์การวิจัยระบบจริงของเรา
        </p>
      </div>

      <div className="wrap">
        {/* L1 spectrum */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>ระดับขั้นของการเทรดเชิงระบบ — และคุณอยู่ตรงไหน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SPECTRUM }} />
            <div className="figcap">สี่ระดับขั้น — ผู้ที่ผ่านระดับ 7 มาแล้วอยู่ที่ rule-based ซึ่งเป็นจุดตั้งต้นที่ถูกต้อง</div>
          </div>
          <div className="body-txt">
            <p>การเทรดเชิงระบบมีสี่ระดับขั้น: <b>Manual</b> — ตัดสินใจตามดุลยพินิจรายครั้ง (จุดที่ผู้เริ่มต้นส่วนใหญ่อยู่และเป็นจุดที่วัดผลไม่ได้) · <b>Rule-based</b> — กฎเขียนชัดเจน มนุษย์เป็นผู้กดคำสั่ง (จุดที่คุณอยู่หลังจบระดับ 7) · <b>Semi-automated</b> — ระบบเฝ้าตลาดและแจ้งเตือนเมื่อเงื่อนไขครบ มนุษย์ตรวจสอบและยืนยัน · <b>Fully automated</b> — ระบบตัดสินใจและส่งคำสั่งเองทั้งหมด</p>
            <p>ประเด็นที่ต้องเข้าใจก่อนสิ่งอื่น: <b>ระดับขั้นเหล่านี้ต้องเดินตามลำดับ</b> — automation คือการมอบอำนาจการตัดสินใจให้โค้ด ซึ่งทำได้อย่างปลอดภัยเฉพาะเมื่อกฎที่มอบให้นั้นผ่านการพิสูจน์แล้ว ผู้ที่กระโดดจาก manual ไป automated โดยข้ามการสร้างและทดสอบกฎ (เช่น ซื้อ EA สำเร็จรูปตามหมวด 8.3) ไม่ได้ข้ามขั้นตอน — เขาเพียงมอบเงินให้กฎที่ตนเองไม่รู้จัก</p>
            <p>ข่าวดีสำหรับผู้เรียนหลักสูตรนี้: งานที่ยากที่สุดของเส้นทางนี้คือการสร้างกฎที่ชัดและกระบวนการทดสอบ — ซึ่งคุณทำเสร็จแล้วในระดับ 7 ส่วนที่เหลือคืองานแปลรูปแบบ ไม่ใช่งานคิดใหม่</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>สี่ขั้น: manual → rule-based → semi-auto → automated — เดินตามลำดับ และคุณผ่านขั้นที่ยากที่สุดมาแล้ว</p></div>
        </div>

        {/* L2 what automation fixes */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>★ สิ่งที่ Automation แก้ได้ — และแก้ไม่ได้</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_FIXES }} />
            <div className="figcap">automation ขยายคุณสมบัติของระบบที่มีอยู่ — ระบบดีจะดีขึ้น ระบบเสียจะเสียหายเร็วขึ้น</div>
          </div>
          <div className="body-txt">
            <p>สิ่งที่ automation แก้ได้จริงและมีมูลค่าสูง: (1) <b>ความผิดพลาดของการ execute</b> — คำนวณขนาดไม้ผิด ลืมตั้ง SL กดผิดฝั่ง หายไปทั้งหมด (2) <b>การตัดสินใจภายใต้อารมณ์</b> — โค้ดไม่มี tilt ไม่มี revenge trading ไม่เหนื่อยล้า ปัญหาทั้งหมวด 7.2 หายไปที่ระดับการ execute (3) <b>ข้อจำกัดเวลา</b> — ระบบเฝ้าตลาดต่อเนื่องได้โดยไม่ต้องอยู่หน้าจอ ซึ่งมีความหมายมากสำหรับผู้มีงานประจำ</p>
            <p>สิ่งที่ automation แก้ไม่ได้และต้องกล่าวอย่างตรงไปตรงมา: (1) <b>ระบบที่ไม่มี edge</b> — automation ทำให้ระบบที่ขาดทุนขาดทุนเร็วขึ้นและสม่ำเสมอขึ้น เพราะ execute อย่างมีวินัยทุกไม้ (2) <b>Overfitting</b> — เมื่อการปรับพารามิเตอร์กลายเป็นการแก้ตัวเลขในโค้ด การจูนจนพอดีอดีตยิ่งทำได้ง่ายและเร็ว ความเสี่ยงจากหมวด 7.1 จึงทวีขึ้น ไม่ลดลง (3) <b>การเปลี่ยน regime ของตลาด</b> — ระบบอัตโนมัติไม่รู้ตัวว่าโลกเปลี่ยน kill criteria และการเฝ้าดูผลรายสัปดาห์จึงยังจำเป็นเสมอ</p>
            <p>สรุปเป็นหลักการเดียว: <b>automation คือตัวขยายคุณภาพ ไม่ใช่แหล่งกำเนิดคุณภาพ</b> — คำถามที่ถูกต้องไม่ใช่ &quot;ควร automate หรือไม่&quot; แต่คือ &quot;ระบบนี้พิสูจน์แล้วพอที่จะคู่ควรกับการ automate หรือยัง&quot;</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>automation แก้การ execute อารมณ์ และเวลา — แต่ขยายทั้ง edge และความบกพร่องของระบบเดิมเท่า ๆ กัน</p></div>
        </div>

        {/* L3 practical path */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>เส้นทางเชิงปฏิบัติ: จากกฎสู่โค้ด</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_PIPELINE }} />
            <div className="figcap">วงจรเดียวกับ lifecycle ของระดับ 7 — เพิ่มเพียงขั้นแปลกฎเป็นตรรกะที่คอมพิวเตอร์อ่านได้</div>
          </div>
          <div className="body-txt">
            <p>ขั้นแรกที่แนะนำและมักถูกมองข้าม: <b>semi-automation ก่อน full automation</b> — ตั้งระบบแจ้งเตือน (alert) ตามเงื่อนไขโซนและ trigger ของคุณ (ซึ่ง routine ระดับ 5.3 ทำอยู่แล้วในรูปแบบพื้นฐาน) ให้ระบบเฝ้าตลาดแทน แต่มนุษย์ยังเป็นผู้ตรวจสอบและยืนยันคำสั่ง — ขั้นนี้ได้ประโยชน์ส่วนใหญ่ของ automation (เวลา ความสม่ำเสมอของการเฝ้า) โดยยังไม่มอบอำนาจการตัดสินใจให้โค้ด</p>
            <p>เมื่อพร้อมไปขั้น full: (1) แปลกฎเป็น <b>pseudocode</b> — เขียนตรรกะ if-then เป็นภาษาธรรมดาให้ครบทุกกรณี รวมกรณีขอบ เช่น ข่าวแดง สภาพ spread กว้าง คำสั่งไม่ถูก fill — ขั้นนี้จะเผยให้เห็นความคลุมเครือที่หลงเหลือในกฎเสมอ (คอมพิวเตอร์คือผู้อ่านที่เข้มงวดที่สุดของ two-readers test) (2) เลือกเครื่องมือ — Pine Script (TradingView) เริ่มง่ายที่สุดสำหรับ alert และ backtest เบื้องต้น, MQL (MetaTrader) หรือ C# (cTrader) สำหรับ EA เต็มรูปแบบ, Python สำหรับงานวิจัยที่ยืดหยุ่นที่สุด (3) เข้าสู่วงจรทดสอบเดิมของระดับ 7 ทุกขั้น — backtest หลังต้นทุน, OOS ครั้งเดียว, demo run เทียบผลกับ backtest, แล้วจึง live ขนาดเล็กภายใต้ kill criteria</p>
            <p>หมายเหตุเรื่องทักษะ: การเขียนโปรแกรมระดับที่ใช้งานนี้ได้ <b>เรียนรู้ได้ภายในไม่กี่เดือน</b> และเครื่องมือช่วยเขียนโค้ดในปัจจุบันลดกำแพงลงมาก — สิ่งที่ทดแทนไม่ได้คือความชัดของกฎและความเข้าใจกระบวนการทดสอบ ซึ่งเป็นเหตุผลที่หลักสูตรนี้สอนระดับ 7 ก่อนวิชานี้</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เริ่มที่ semi-auto (alert) · แปลกฎเป็น pseudocode ให้ครบกรณีขอบ · แล้วเข้าวงจรทดสอบระดับ 7 ตามปกติ</p></div>
        </div>

        {/* L4 real research */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>★ กระบวนการวิจัยระบบจริง — จากงานของเราเอง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_RESEARCH }} />
            <div className="figcap">วงจรวิจัยที่ใช้จริง — ผลลัพธ์ส่วนใหญ่คือการยุติแนวคิด และนั่นคือกระบวนการที่ทำงานถูกต้อง</div>
          </div>
          <div className="body-txt">
            <p>เพื่อให้เห็นภาพว่างานสาย systematic หน้าตาเป็นอย่างไรจริง เราเปิดกระบวนการของตัวเอง (งานวิจัยเบื้องหลังหน้า <a href="/algo">/algo</a> ของ Cerfinits): เริ่มจาก<b>สมมติฐานที่เจาะจง</b> — เช่น &quot;กลยุทธ์ breakout บนทองคำมี edge หลังหักต้นทุนหรือไม่&quot; — ทดสอบบน<b>ข้อมูล tick หลายปี</b> (ความละเอียดของข้อมูลสำคัญมากสำหรับกลยุทธ์ที่อ่อนไหวต่อ spread และ slippage) หักต้นทุนครบทุกรายการ แล้วให้ตัวเลขตอบ</p>
            <p>ผลลัพธ์ที่เกิดขึ้นจริงและเป็นบทเรียนสำคัญที่สุดของวิชานี้: <b>สมมติฐานส่วนใหญ่จบที่ &quot;ไม่มี edge ที่มีนัย&quot;</b> — รวมถึงกรณี breakout ทองที่กล่าวถึงในระดับ 7.1 ซึ่งเรายุติหลังการทดสอบเต็มรูปแบบ ผู้ที่มองผลเช่นนี้เป็นความล้มเหลวจะทนงานวิจัยไม่ได้ ผู้ที่เข้าใจว่า<b>ทุกแนวคิดที่ถูกยุติบนข้อมูลคือการปิดเส้นทางที่จะสูญเสียเงินจริง</b> คือผู้ที่เหมาะกับเส้นทางนี้</p>
            <p>ความคาดหวังที่ถูกต้องต่อสาย systematic: มันไม่ใช่ทางลัดสู่กำไร — มันคือการย้ายน้ำหนักงานจากหน้าจอเทรดไปสู่กระบวนการวิจัย ผู้ที่ชอบการทดลอง การเขียนโค้ด และการให้ข้อมูลชี้ขาด จะพบว่างานนี้ตรงกับนิสัย ผู้ที่ต้องการความตื่นเต้นรายวันจะไม่พบมันที่นี่</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>งานวิจัยจริง: สมมติฐานเจาะจง → ข้อมูลคุณภาพสูง → หักต้นทุนครบ → ให้ตัวเลขชี้ขาด — และผลส่วนใหญ่คือการยุติแนวคิด</p></div>
        </div>

        {/* L5 learning path + close */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>Playbook: แผนการเรียนรู้สาย Systematic</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_PATH }} />
            <div className="figcap">ลำดับที่แนะนำ — ความเข้าใจเชิงสถิติมาก่อนเครื่องมือเสมอ</div>
          </div>
          <div className="body-txt">
            <p>สำหรับผู้ที่ตัดสินใจเดินเส้นทางนี้ต่อ ลำดับการเรียนรู้ที่แนะนำ: (1) <b>สถิติพื้นฐาน</b> — การแจกแจง ขนาดตัวอย่าง ความแตกต่างระหว่างนัยสำคัญกับความบังเอิญ — เพราะกับดักทั้งหมดของหมวด 7.1 เป็นกับดักเชิงสถิติ (2) <b>เครื่องมือหนึ่งตัวให้คล่อง</b> — เริ่มจาก Pine Script หากต้องการเร็ว หรือ Python หากตั้งใจจริงจังระยะยาว (3) <b>แปลระบบที่มีอยู่ของตัวเองเป็นโค้ดก่อนคิดระบบใหม่</b> — งานแปลจะสอนความชัดของกฎมากกว่าตำราใดและได้ระบบที่คุณเข้าใจลึกอยู่แล้ว (4) เข้าสู่<b>วงจรวิจัยซ้ำ</b>: สมมติฐาน → ทดสอบ → สรุป → บันทึก — เช่นเดียวกับ journal ของการเทรด งานวิจัยต้องมีบันทึกของมันเอง</p>
            <p><b>ปิดคอร์สซัมเมอร์และเนื้อหาทั้งหลักสูตร:</b> จากบทแรกของระดับ 1 ถึงบรรทัดนี้ หลักการที่ไม่เคยเปลี่ยนคือหลักเดียว — <b>ให้หลักฐานเป็นผู้ตัดสิน ไม่ใช่ความรู้สึก ไม่ใช่คำบอกเล่า และไม่ใช่ความหวัง</b> เส้นทาง systematic คือรูปแบบที่เข้มข้นที่สุดของหลักการนั้น และไม่ว่าคุณจะหยุดที่ rule-based หรือเดินจนถึง automated ขอให้กระบวนการของคุณซื่อสัตย์ต่อข้อมูลเสมอ</p>
          </div>
          <div className="bridge">
            <span className="bi">✓</span>
            <div>
              <span className="bl">จบคอร์สซัมเมอร์ — เนื้อหาหลักสูตรครบสมบูรณ์</span>
              <p>ทบทวนหมวดใดก็ได้ที่ <b><a href="/grade">แผนที่หลักสูตร</a></b> · ศึกษาทองคำเชิงลึกที่ <b><a href="/gold-start">S1 Gold Start</a></b> · ติดตามงานวิจัยระบบของเราที่ <b><a href="/algo">/algo</a></b> — และติดตามพอร์ตลงทุนที่ <b><a href="/plan/portfolio">/plan/portfolio</a></b></p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>สถิติก่อนเครื่องมือ · แปลระบบเดิมก่อนคิดใหม่ · และให้หลักฐานเป็นผู้ตัดสินเสมอ — หลักการเดียวของทั้งหลักสูตร</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · คอร์สซัมเมอร์ S4 (Premium)
      </div>
    </>
  );
}
