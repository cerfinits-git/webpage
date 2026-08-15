import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 8 · กลโกงและข้อผิดพลาดที่พบบ่อย — เกราะป้องกันขั้นสุดท้าย · Cerfinits Grade",
  description:
    "Premium: โครงสร้างร่วมของการฉ้อโกงด้านการลงทุน, การตรวจสอบผู้ขาย signal/ระบบ/EA, ตารางข้อผิดพลาดอันดับต้นพร้อมบทที่ใช้แก้ และหลักป้องกันตนเอง 3 ข้อ",
  alternates: { canonical: "/grade/scams-mistakes" },
};

const SVG_ANATOMY = `<svg viewBox="0 0 660 250" role="img" aria-label="องค์ประกอบร่วมของการฉ้อโกงการลงทุน">
  <circle cx="255" cy="105" r="82" fill="var(--down)" fill-opacity="0.12" stroke="var(--down)" stroke-width="1.5"/>
  <circle cx="405" cy="105" r="82" fill="var(--down)" fill-opacity="0.12" stroke="var(--down)" stroke-width="1.5"/>
  <circle cx="330" cy="175" r="82" fill="var(--down)" fill-opacity="0.12" stroke="var(--down)" stroke-width="1.5"/>
  <text class="t-sm t-down" x="195" y="66" text-anchor="middle">การันตีผลตอบแทน</text>
  <text class="t-sm t-down" x="470" y="66" text-anchor="middle">ให้โอนเงินไปบริหาร</text>
  <text class="t-sm t-down" x="330" y="242" text-anchor="middle">ผลตอบแทนจากการชวนคนเพิ่ม</text>
  <circle cx="330" cy="128" r="7" fill="var(--down)"/>
  <text class="t-xs t-down" x="330" y="115" text-anchor="middle">ครบทั้งสาม = โครงสร้างแชร์ลูกโซ่</text>
</svg>`;

const SVG_TRACK = `<svg viewBox="0 0 660 200" role="img" aria-label="หลักฐานผลงานที่ตรวจสอบได้กับที่ตรวจสอบไม่ได้">
  <text class="t-sm t-up" x="165" y="24" text-anchor="middle">ตรวจสอบได้</text>
  <rect class="chip-ok" x="30" y="36" width="270" height="52" rx="3"/>
  <text class="t-xs" x="165" y="58" text-anchor="middle">บัญชีจริงเชื่อมระบบติดตามอิสระ</text>
  <text class="t-xs" x="165" y="76" text-anchor="middle">ประวัติยาว · เห็น drawdown จริง</text>
  <rect class="chip-ok" x="30" y="96" width="270" height="52" rx="3"/>
  <text class="t-xs" x="165" y="118" text-anchor="middle">statement ฉบับเต็มจากโบรกเกอร์</text>
  <text class="t-xs" x="165" y="136" text-anchor="middle">ครบทุกไม้ ไม่ตัดช่วงเวลา</text>
  <text class="t-sm t-down" x="495" y="24" text-anchor="middle">ตรวจสอบไม่ได้</text>
  <rect class="chip-bad" x="360" y="36" width="270" height="52" rx="3"/>
  <text class="t-xs" x="495" y="58" text-anchor="middle">ภาพหน้าจอกำไร (แก้ไข/คัดเลือกได้)</text>
  <text class="t-xs" x="495" y="76" text-anchor="middle">บัญชี demo ที่แสดงเป็นบัญชีจริง</text>
  <rect class="chip-bad" x="360" y="96" width="270" height="52" rx="3"/>
  <text class="t-xs" x="495" y="118" text-anchor="middle">ภาพการใช้ชีวิตหรูหรา</text>
  <text class="t-xs" x="495" y="136" text-anchor="middle">ไม่ใช่หลักฐานการเทรดใด ๆ</text>
  <text class="t-xs" x="330" y="182" text-anchor="middle">หลักการเดียวกับระดับ 7: ข้อกล่าวอ้างที่ตรวจสอบไม่ได้ มีน้ำหนักเท่ากับไม่มีหลักฐาน</text>
</svg>`;

const SVG_EACURVE = `<svg viewBox="0 0 660 220" role="img" aria-label="กราฟกำไรเรียบผิดปกติกับระบบจริง">
  <text class="t-sm t-down" x="165" y="24" text-anchor="middle">น่าสงสัย: เรียบผิดปกติ</text>
  <polyline points="40,170 90,158 140,146 190,134 240,122 290,110" fill="none" stroke="var(--down)" stroke-width="2"/>
  <text class="t-xs t-down" x="165" y="196" text-anchor="middle">มัก = ซ่อนความเสี่ยงสะสม (martingale/grid)</text>
  <text class="t-xs t-down" x="165" y="214" text-anchor="middle">เรียบจนวันที่ระเบิดครั้งเดียวหมดบัญชี</text>
  <line x1="330" y1="30" x2="330" y2="190" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-up" x="495" y="24" text-anchor="middle">ระบบจริง: มี drawdown ให้เห็น</text>
  <polyline points="370,170 410,150 440,162 480,138 510,150 550,122 580,132 620,108" fill="none" stroke="var(--up)" stroke-width="2"/>
  <text class="t-xs t-up" x="495" y="196" text-anchor="middle">ขึ้นสลับย่อ ตามธรรมชาติของ expectancy</text>
</svg>`;

const SVG_SHIELD = `<svg viewBox="0 0 660 190" role="img" aria-label="หลักป้องกันตนเองสามข้อ">
  <rect class="chip-gold" x="30" y="40" width="190" height="100" rx="3" stroke-width="2"/>
  <text class="t-sm t-gold" x="125" y="76" text-anchor="middle">ข้อ 1</text>
  <text class="t-xs" x="125" y="100" text-anchor="middle">ไม่มอบเงินให้ผู้อื่นบริหาร</text>
  <text class="t-xs" x="125" y="118" text-anchor="middle">หากไม่มีใบอนุญาตที่ตรวจสอบได้</text>
  <rect class="chip-gold" x="235" y="40" width="190" height="100" rx="3" stroke-width="2"/>
  <text class="t-sm t-gold" x="330" y="76" text-anchor="middle">ข้อ 2</text>
  <text class="t-xs" x="330" y="100" text-anchor="middle">ไม่เชื่อผลตอบแทนการันตี</text>
  <text class="t-xs" x="330" y="118" text-anchor="middle">ในตลาดที่มีความเสี่ยง — ทุกกรณี</text>
  <rect class="chip-gold" x="440" y="40" width="190" height="100" rx="3" stroke-width="2"/>
  <text class="t-sm t-gold" x="535" y="76" text-anchor="middle">ข้อ 3</text>
  <text class="t-xs" x="535" y="100" text-anchor="middle">ทุกข้อกล่าวอ้างเชิงสถิติ</text>
  <text class="t-xs" x="535" y="118" text-anchor="middle">ต้องมีหลักฐานที่ตรวจสอบได้</text>
  <text class="t-xs" x="330" y="172" text-anchor="middle">สามข้อนี้คัดกรองการฉ้อโกงด้านการเทรดได้เกือบทั้งหมด โดยไม่ต้องรู้จักรูปแบบใหม่ล่วงหน้า</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 8 · หมวด 8.3 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">กลโกงและข้อผิดพลาดที่พบบ่อย</span>
        <h1>เกราะป้องกันขั้นสุดท้าย: รู้จักภัย และรู้จักตัวเอง</h1>
        <p className="lead">
          ความเสียหายใหญ่ที่สุดของคนไทยในแวดวงนี้ ไม่ได้เกิดจากการเทรดผิดทาง แต่เกิดจาก<b>การฉ้อโกง</b>
          และ<b>ข้อผิดพลาดซ้ำแบบเดิม</b>ที่ป้องกันได้ หมวดนี้สรุปโครงสร้างของทั้งสองอย่าง
          พร้อมเครื่องมือคัดกรองที่ใช้ได้กับรูปแบบใหม่ที่ยังไม่เกิดขึ้น
        </p>
      </div>


      <div className="wrap">
        {/* L1 anatomy */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>โครงสร้างร่วมของการฉ้อโกงด้านการลงทุน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_ANATOMY }} />
            <div className="figcap">รูปแบบเปลี่ยนไปตามยุค แต่องค์ประกอบสามส่วนนี้ปรากฏซ้ำในเกือบทุกกรณีใหญ่</div>
          </div>
          <div className="body-txt">
            <p>การฉ้อโกงด้านการลงทุนเปลี่ยนบรรจุภัณฑ์ตลอดเวลา — ยุคหนึ่งใช้คำว่า forex ยุคถัดมาใช้สินทรัพย์ดิจิทัล ยุคต่อไปจะใช้คำใหม่ — แต่<b>โครงสร้างภายในแทบไม่เคยเปลี่ยน</b> องค์ประกอบสามส่วนที่ปรากฏซ้ำ: (1) <b>การันตีผลตอบแทน</b> เป็นตัวเลขแน่นอนต่อเดือนหรือต่อปี (2) <b>ให้ผู้เสียหายโอนเงินไปให้ผู้อื่นบริหาร</b> โดยตนเองไม่ได้ควบคุมบัญชี (3) <b>ผลตอบแทนจากการชักชวนสมาชิกใหม่</b> — เมื่อครบทั้งสาม นั่นคือโครงสร้างแชร์ลูกโซ่ ซึ่ง &quot;ผลตอบแทน&quot; ที่จ่ายช่วงแรกมาจากเงินสมาชิกใหม่ ไม่ใช่จากการเทรดจริง</p>
            <p>กรณี Forex-3D ที่กล่าวถึงในหมวด 1.4 มีครบทั้งสามองค์ประกอบ — และประเด็นที่ควรทบทวน: <b>ผู้เสียหายส่วนใหญ่ไม่เคยเทรดเอง</b> ความรู้ที่คุณสะสมมาทั้งหลักสูตรจึงเป็นเกราะโดยตัวมันเอง เพราะผู้ที่เข้าใจว่าผลตอบแทนจริงในตลาดหน้าตาเป็นอย่างไร (มี drawdown มีช่วงขาดทุน ไม่มีการันตี) จะเห็นความผิดปกติของข้อเสนอเหล่านี้ทันที</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>สามองค์ประกอบ: การันตี + โอนเงินให้บริหาร + ค่าชวนคน — ครบเมื่อใด ถอยทันที ไม่ว่าจะใช้ชื่อสินทรัพย์ใด</p></div>
        </div>

        {/* L2 sellers */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>Signal · รับฝากเทรด · คอร์ส — ตรวจสอบผู้ขายอย่างไร</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_TRACK }} />
            <div className="figcap">คำถามเดียวที่ต้องถาม: หลักฐานผลงานนี้ &quot;ตรวจสอบโดยบุคคลที่สาม&quot; ได้หรือไม่</div>
          </div>
          <div className="body-txt">
            <p>ถัดจากแชร์ลูกโซ่คือพื้นที่สีเทาที่ใหญ่กว่ามาก: ผู้ขาย signal ผู้รับฝากเทรด และผู้ขายคอร์ส — บางส่วนสุจริต บางส่วนไม่ วิธีแยกไม่ใช่การเดาเจตนา แต่คือการตรวจสอบ<b>โครงสร้างแรงจูงใจ</b>และ<b>หลักฐาน</b>: ถามว่ารายได้หลักของผู้ขายมาจากการเทรดของเขาเอง หรือมาจากการขายให้คุณ — และขอหลักฐานผลงานที่<b>ตรวจสอบโดยอิสระได้</b>: บัญชีจริงที่เชื่อมระบบติดตามภายนอก หรือ statement ฉบับเต็มไม่ตัดช่วง ภาพหน้าจอกำไรและภาพการใช้ชีวิตหรูหราไม่ใช่หลักฐาน</p>
            <p>เพื่อความเป็นธรรม: <b>การขายความรู้หรือเครื่องมือไม่ใช่ความผิดโดยตัวมันเอง</b> (หลักสูตรนี้เองก็มีส่วน Premium) — เส้นแบ่งอยู่ที่การอ้างผลงาน: ผู้ขายที่สุจริตแสดงหลักฐานที่ตรวจสอบได้ ระบุความเสี่ยงชัดเจน และไม่การันตีผล ส่วนคำอธิบายว่า &quot;สอนเพราะอยากช่วย ไม่สะดวกแสดงพอร์ต&quot; นั้น ผู้ฟังมีสิทธิ์เต็มที่ที่จะไม่เชื่อจนกว่าจะเห็นหลักฐาน — หลักการเดียวกับที่หลักสูตรนี้ใช้กับทุกเทคนิคมาตลอด และย้ำอีกครั้งจากหมวด 8.2: การ<b>รับ</b>ฝากเทรดโดยไม่มีใบอนุญาต ผิดกฎหมายฝั่งผู้รับเสมอ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ตรวจสองอย่าง: รายได้หลักของผู้ขายมาจากไหน + หลักฐานตรวจสอบโดยอิสระได้หรือไม่ — ภาพหน้าจอไม่นับ</p></div>
        </div>

        {/* L3 EA */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>EA และระบบอัตโนมัติ — ใช้ความรู้ระดับ 7 เป็นเครื่องตรวจ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_EACURVE }} />
            <div className="figcap">กราฟกำไรที่เรียบเกินธรรมชาติ มักหมายถึงความเสี่ยงสะสมที่ซ่อนอยู่ ไม่ใช่ความสามารถพิเศษ</div>
          </div>
          <div className="body-txt">
            <p>ตลาด EA (Expert Advisor — ระบบเทรดอัตโนมัติ) เต็มไปด้วยข้อกล่าวอ้างที่ทดสอบได้ยาก แต่คุณมีข้อได้เปรียบ: <b>ความรู้จากระดับ 7 ทำให้คุณตรวจข้อกล่าวอ้างเหล่านี้ได้อย่างเป็นระบบ</b> คำถามชุดตรวจสอบ: มีผล out-of-sample หรือ forward test บนบัญชีจริงหรือไม่ (backtest อย่างเดียว = ยังพิสูจน์อะไรไม่ได้), แสดง max drawdown และช่วงแพ้ต่อเนื่องหรือไม่, ผลรวมต้นทุน spread/commission แล้วหรือไม่, และพารามิเตอร์ทนต่อการเปลี่ยนแปลงหรือถูกปรับจนพอดีกับอดีต</p>
            <p>สัญญาณเตือนเฉพาะทางที่พบบ่อย: <b>กราฟกำไรที่เรียบขึ้นสม่ำเสมอผิดธรรมชาติ</b> — มักเกิดจากกลยุทธ์แบบ martingale หรือ grid ที่เพิ่มขนาดสถานะเมื่อขาดทุน ทำให้กราฟดูเรียบเพราะการขาดทุนถูกเลื่อนออกไปสะสมไว้ จนถึงวันที่ตลาดเคลื่อนที่ทางเดียวแรง ๆ แล้วบัญชีเสียหายทั้งหมดในครั้งเดียว ระบบจริงที่มี expectancy บวก<b>ต้องมี drawdown ให้เห็น</b> — เส้นทุนที่ไม่มีการย่อเลยคือสิ่งที่ควรตั้งคำถาม ไม่ใช่สิ่งที่ควรตื่นเต้น</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ตรวจ EA ด้วยเกณฑ์ระดับ 7: OOS/forward test · max DD · ต้นทุนครบ — กราฟเรียบไร้การย่อ = สัญญาณเตือน ไม่ใช่จุดขาย</p></div>
        </div>

        {/* L4 mistakes table */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>★ ข้อผิดพลาดอันดับต้น — และบทที่ใช้แก้</h2></div>
          <div className="body-txt">
            <p>ข้อผิดพลาดของผู้เริ่มต้นเกือบทั้งหมดถูกกล่าวถึงแล้วในหลักสูตรนี้ — ตารางนี้รวบรวมไว้เป็นรายการอ้างอิง เรียงตามความเสียหายโดยประมาณ พร้อมหมวดที่ใช้ทบทวน:</p>
            <div className="calc c3">
              <div className="crow head"><span>ข้อผิดพลาด</span><span>ผลที่ตามมา</span><span className="v">ทบทวนที่</span></div>
              <div className="crow stop"><span className="k">เปิดไม้ใหญ่เกินแผน / ไม่มีแผนขนาดไม้</span><span>เงินทุนหมดเร็วที่สุด</span><span className="v">4.2</span></div>
              <div className="crow"><span className="k">ไม่ตั้ง SL หรือถอน SL ระหว่างถือ</span><span>ขาดทุนเล็กกลายเป็นความเสียหายใหญ่</span><span className="v">1.2 · 4.2</span></div>
              <div className="crow"><span className="k">เทรดสวนทิศ timeframe ใหญ่</span><span>ชนะเป็นครั้งคราว แพ้เป็นระบบ</span><span className="v">5.3</span></div>
              <div className="crow"><span className="k">เปิดไม้ใหม่ทันทีหลังขาดทุน (revenge)</span><span>ความเสียหายทวีคูณจากภาวะ tilt</span><span className="v">7.2</span></div>
              <div className="crow"><span className="k">เทรดช่วงข่าวสำคัญโดยไม่มีแผน</span><span>slippage และความผันผวนเกินระบบรองรับ</span><span className="v">6.1</span></div>
              <div className="crow"><span className="k">เปลี่ยนระบบทุกครั้งที่แพ้ติดกัน</span><span>ไม่มีสถิติพอประเมินสิ่งใดได้เลย</span><span className="v">7.1</span></div>
              <div className="crow"><span className="k">ไม่บันทึก journal</span><span>ทำผิดซ้ำโดยไม่รู้ตัว วัดผลไม่ได้</span><span className="v">7.2</span></div>
              <div className="crow"><span className="k">ใช้เงินที่เสียไม่ได้มาเทรด</span><span>ตัดสินใจภายใต้ความกดดันทุกไม้</span><span className="v">1.5</span></div>
            </div>
            <p>ข้อสังเกตสำคัญ: <b>ไม่มีข้อใดในตารางเกี่ยวกับการวิเคราะห์กราฟผิด</b> — ความเสียหายใหญ่ของผู้เริ่มต้นมาจากการบริหารความเสี่ยงและวินัยทั้งสิ้น ซึ่งสอดคล้องกับการจัดลำดับของหลักสูตรนี้ที่วางเรื่องการอยู่รอดไว้ก่อนเทคนิคทำกำไร</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ความเสียหายใหญ่ทั้งหมดมาจากความเสี่ยงและวินัย ไม่ใช่การอ่านกราฟ — ตารางนี้คือรายการทบทวนเมื่อผลงานเริ่มผิดปกติ</p></div>
        </div>

        {/* L5 shield */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>Playbook: หลักป้องกันตนเอง 3 ข้อ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SHIELD }} />
            <div className="figcap">หลักทั่วไปสามข้อ ใช้ได้กับกลโกงทุกยุค รวมถึงรูปแบบที่ยังไม่เกิดขึ้น</div>
          </div>
          <div className="body-txt">
            <p>รูปแบบการฉ้อโกงใหม่จะเกิดขึ้นเสมอ การจดจำรายกรณีจึงไม่เพียงพอ — สิ่งที่ใช้ได้ตลอดคือหลักทั่วไปสามข้อ: (1) <b>ไม่มอบเงินให้ผู้อื่นบริหาร</b> เว้นแต่ผู้นั้นมีใบอนุญาตประกอบธุรกิจที่ตรวจสอบได้กับหน่วยงานกำกับ (2) <b>ไม่เชื่อการการันตีผลตอบแทน</b>ในตลาดที่มีความเสี่ยง ไม่มีข้อยกเว้น — ผู้ที่ทำได้จริงไม่มีเหตุผลทางเศรษฐศาสตร์ที่ต้องระดมเงินรายย่อยพร้อมการันตี (3) <b>ทุกข้อกล่าวอ้างเชิงสถิติต้องมีหลักฐานที่ตรวจสอบได้</b> — หลักการเดียวกับที่ใช้ประเมินระบบเทรดของตัวเอง</p>
            <p>ข้อเสนอที่ผ่านทั้งสามข้อไม่ได้แปลว่าดีเสมอไป — แต่ข้อเสนอที่<b>ไม่ผ่านข้อใดข้อหนึ่ง</b> สมควรถูกปฏิเสธทันทีโดยไม่ต้องพิจารณาต่อ การปฏิเสธเร็วคือทักษะป้องกันตัวที่สำคัญที่สุดในแวดวงนี้ และเป็นทักษะเดียวที่ปกป้องทั้งตัวคุณและคนรอบตัวที่มาขอคำปรึกษา</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>ครบเครื่องมือป้องกันแล้ว เหลือเพียงหมวดสุดท้ายของหลักสูตร — <b><a href="/grade/final-chapter">8.4 บทส่งท้าย</a></b>: แผน 90 วันแรก เกณฑ์วัดความก้าวหน้าที่ถูกต้อง และตำแหน่งของการเทรดในแผนการเงินทั้งชีวิต</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>สามข้อคัดกรองทุกยุค: ไม่มอบเงิน · ไม่เชื่อการันตี · ทุกสถิติต้องตรวจสอบได้ — ไม่ผ่านข้อเดียว = ปฏิเสธทันที</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุนหรือคำแนะนำทางกฎหมาย · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 8 หมวด 8.3 (Premium)
      </div>
    </>
  );
}
