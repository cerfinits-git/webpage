import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 8 · Prop Trading Firms — โครงสร้างธุรกิจ เกณฑ์การสอบ และการเตรียมตัว · Cerfinits Grade",
  description:
    "Premium: prop firm คืออะไร, โครงสร้างรายได้ที่แท้จริงของธุรกิจนี้, เหตุใดผู้สอบส่วนใหญ่ไม่ผ่าน, การบริหารความเสี่ยงเฉพาะสำหรับ challenge, เกณฑ์คัดเลือกบริษัท และเงื่อนไขที่ควรมีก่อนสมัครสอบ",
  alternates: { canonical: "/grade/prop-firms" },
};

const SVG_MODEL = `<svg viewBox="0 0 660 240" role="img" aria-label="โครงสร้าง prop firm แบบ funded account">
  <rect class="chip-n" x="30" y="30" width="170" height="60" rx="3"/>
  <text class="t-md" x="115" y="56" text-anchor="middle">ผู้สมัครสอบ</text>
  <text class="t-xs" x="115" y="78" text-anchor="middle">ชำระค่าธรรมเนียม challenge</text>
  <path d="M205,60 L245,60 M236,53 L248,60 L236,67" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-gold" x="253" y="30" width="170" height="60" rx="3" stroke-width="2"/>
  <text class="t-md t-gold" x="338" y="56" text-anchor="middle">การสอบ (Challenge)</text>
  <text class="t-xs" x="338" y="78" text-anchor="middle">เป้ากำไร + ลิมิตขาดทุน</text>
  <path d="M428,60 L468,60 M459,53 L471,60 L459,67" fill="none" stroke="var(--up)" stroke-width="2"/>
  <rect class="chip-ok" x="476" y="30" width="154" height="60" rx="3"/>
  <text class="t-md t-up" x="553" y="56" text-anchor="middle">ผ่าน</text>
  <text class="t-xs" x="553" y="78" text-anchor="middle">บัญชีทุน + ส่วนแบ่งกำไร</text>
  <path d="M338,96 L338,126 M331,116 L338,128 L345,116" fill="none" stroke="var(--down)" stroke-width="2"/>
  <rect class="chip-bad" x="253" y="132" width="170" height="60" rx="3"/>
  <text class="t-md t-down" x="338" y="158" text-anchor="middle">ไม่ผ่าน (ส่วนใหญ่)</text>
  <text class="t-xs" x="338" y="180" text-anchor="middle">ค่าธรรมเนียมเป็นรายได้บริษัท</text>
  <text class="t-xs" x="330" y="222" text-anchor="middle">ทำความเข้าใจทั้งสองเส้นทางก่อนตัดสินใจ — เส้นทางล่างคือกรณีที่เกิดบ่อยกว่า</text>
</svg>`;

const SVG_FUNNEL = `<svg viewBox="0 0 660 210" role="img" aria-label="สัดส่วนผู้ผ่านการสอบเชิงแนวคิด">
  <text class="t-sm" x="8" y="20">สัดส่วนเชิงแนวคิด (ตัวเลขจริงต่างกันตามบริษัทและเงื่อนไข)</text>
  <rect class="bar-n" x="140" y="40" width="480" height="30"/>
  <text class="t-md" x="8" y="60">ผู้สมัคร</text>
  <rect class="bar-gold" x="140" y="90" width="140" height="30"/>
  <text class="t-md" x="8" y="110">ผ่านการสอบ</text>
  <text class="t-xs" x="290" y="110">ส่วนน้อยของผู้สมัคร</text>
  <rect class="bar-up" x="140" y="140" width="60" height="30"/>
  <text class="t-md" x="8" y="160">ได้รับส่วนแบ่งจริง</text>
  <text class="t-xs" x="210" y="160">น้อยลงอีก — ต้องรักษาบัญชีให้ผ่านเงื่อนไขต่อเนื่อง</text>
  <text class="t-xs t-down" x="330" y="196" text-anchor="middle">การผ่านสอบไม่ใช่จุดสิ้นสุด — บัญชีทุนมีเงื่อนไขต่อเนื่องที่ทำให้ถูกยุติได้</text>
</svg>`;

const SVG_CONFLICT = `<svg viewBox="0 0 660 200" role="img" aria-label="ความขัดแย้งเชิงโครงสร้างของเกณฑ์สอบ">
  <rect class="chip-n" x="230" y="72" width="200" height="56" rx="3"/>
  <text class="t-md" x="330" y="104" text-anchor="middle">ผู้เข้าสอบ</text>
  <rect class="chip-gold" x="30" y="30" width="170" height="52" rx="3"/>
  <text class="t-sm t-gold" x="115" y="52" text-anchor="middle">เป้ากำไร + เวลาจำกัด</text>
  <text class="t-xs" x="115" y="72" text-anchor="middle">กดดันให้เพิ่มความเสี่ยง</text>
  <path d="M205,80 L245,92" stroke="var(--gold)" stroke-width="1.5"/>
  <rect class="chip-bad" x="30" y="120" width="170" height="52" rx="3"/>
  <text class="t-sm t-down" x="115" y="142" text-anchor="middle">ลิมิตขาดทุนรายวัน/รวม</text>
  <text class="t-xs" x="115" y="162" text-anchor="middle">ลงโทษความเสี่ยงทันที</text>
  <path d="M205,140 L245,116" stroke="var(--down)" stroke-width="1.5"/>
  <text class="t-sm" x="520" y="90" text-anchor="middle">แรงกดสองทิศทาง</text>
  <text class="t-xs" x="520" y="114" text-anchor="middle">ผู้ที่ไม่มีแผนความเสี่ยง</text>
  <text class="t-xs" x="520" y="132" text-anchor="middle">มักแพ้ให้โครงสร้างนี้เอง</text>
</svg>`;

const SVG_DAILY = `<svg viewBox="0 0 660 170" role="img" aria-label="งบขาดทุนรายวันแบ่งเป็นจำนวนไม้">
  <text class="t-sm" x="8" y="24">ตัวอย่าง: ลิมิตขาดทุนรายวัน 5% · เสี่ยง 0.5% ต่อไม้</text>
  <rect class="bar-n" x="40" y="44" width="580" height="44"/>
  <line x1="98" y1="44" x2="98" y2="88" stroke="var(--panel)" stroke-width="2"/>
  <line x1="156" y1="44" x2="156" y2="88" stroke="var(--panel)" stroke-width="2"/>
  <line x1="214" y1="44" x2="214" y2="88" stroke="var(--panel)" stroke-width="2"/>
  <line x1="272" y1="44" x2="272" y2="88" stroke="var(--panel)" stroke-width="2"/>
  <line x1="330" y1="44" x2="330" y2="88" stroke="var(--panel)" stroke-width="2"/>
  <line x1="388" y1="44" x2="388" y2="88" stroke="var(--panel)" stroke-width="2"/>
  <line x1="446" y1="44" x2="446" y2="88" stroke="var(--panel)" stroke-width="2"/>
  <line x1="504" y1="44" x2="504" y2="88" stroke="var(--panel)" stroke-width="2"/>
  <line x1="562" y1="44" x2="562" y2="88" stroke="var(--panel)" stroke-width="2"/>
  <text class="t-xs" x="330" y="70" text-anchor="middle">รองรับไม้แพ้ได้ 10 ไม้ต่อวัน</text>
  <text class="t-xs t-gold" x="40" y="116">กฎที่แนะนำ: หยุดก่อนถึงลิมิต — แพ้ครบ 4–5 ไม้ในวันเดียว ให้ยุติการเทรดวันนั้น</text>
  <text class="t-xs" x="40" y="140">เหลือระยะกันชนไว้เสมอ เพราะ slippage อาจทำให้ขาดทุนจริงเกินแผน</text>
</svg>`;

const SVG_CHECK = `<svg viewBox="0 0 660 230" role="img" aria-label="เกณฑ์ตรวจสอบบริษัท">
  <text class="t-sm t-up" x="165" y="24" text-anchor="middle">สิ่งที่ควรตรวจสอบให้พบ</text>
  <rect class="chip-ok" x="30" y="36" width="270" height="40" rx="3"/><text class="t-xs" x="165" y="60" text-anchor="middle">ประวัติการจ่ายเงินจริงที่ตรวจสอบได้</text>
  <rect class="chip-ok" x="30" y="84" width="270" height="40" rx="3"/><text class="t-xs" x="165" y="108" text-anchor="middle">กฎการเทรดครบถ้วน เขียนชัดเจน เปิดเผย</text>
  <rect class="chip-ok" x="30" y="132" width="270" height="40" rx="3"/><text class="t-xs" x="165" y="156" text-anchor="middle">ดำเนินธุรกิจต่อเนื่องหลายปี · นิติบุคคลชัดเจน</text>
  <text class="t-sm t-down" x="495" y="24" text-anchor="middle">สัญญาณเตือน</text>
  <rect class="chip-bad" x="360" y="36" width="270" height="40" rx="3"/><text class="t-xs" x="495" y="60" text-anchor="middle">กฎคลุมเครือ / เพิ่มกฎย้อนหลังหลังผ่านสอบ</text>
  <rect class="chip-bad" x="360" y="84" width="270" height="40" rx="3"/><text class="t-xs" x="495" y="108" text-anchor="middle">รายงานการจ่ายล่าช้า / ปฏิเสธจ่ายด้วยเหตุผลกว้าง</text>
  <rect class="chip-bad" x="360" y="132" width="270" height="40" rx="3"/><text class="t-xs" x="495" y="156" text-anchor="middle">เน้นโปรโมชันลดราคาสอบถี่ผิดปกติ</text>
  <text class="t-xs" x="330" y="206" text-anchor="middle">ค้นหารีวิวการจ่ายเงินจากผู้ใช้จริงหลายแหล่งก่อนชำระเงินทุกครั้ง</text>
</svg>`;

const SVG_WHEN = `<svg viewBox="0 0 660 190" role="img" aria-label="เงื่อนไขก่อนสมัครสอบ">
  <rect class="chip-n" x="30" y="40" width="180" height="90" rx="3"/>
  <text class="t-sm" x="120" y="70" text-anchor="middle">ระบบผ่านการทดสอบ</text>
  <text class="t-xs" x="120" y="94" text-anchor="middle">backtest + journal</text>
  <text class="t-xs" x="120" y="112" text-anchor="middle">≥100 ไม้ · expectancy บวก</text>
  <rect class="chip-n" x="240" y="40" width="180" height="90" rx="3"/>
  <text class="t-sm" x="330" y="70" text-anchor="middle">วินัยที่วัดได้</text>
  <text class="t-xs" x="330" y="94" text-anchor="middle">ทำตามแผน ≥90%</text>
  <text class="t-xs" x="330" y="112" text-anchor="middle">ต่อเนื่องอย่างน้อย 1 เดือน</text>
  <rect class="chip-gold" x="450" y="40" width="180" height="90" rx="3" stroke-width="2"/>
  <text class="t-sm t-gold" x="540" y="70" text-anchor="middle">จึงพิจารณาสอบ</text>
  <text class="t-xs" x="540" y="94" text-anchor="middle">ค่าสอบ = ต้นทุนธุรกิจ</text>
  <text class="t-xs" x="540" y="112" text-anchor="middle">ไม่ใช่ค่าลุ้นรางวัล</text>
  <text class="t-xs t-down" x="330" y="166" text-anchor="middle">การสอบโดยไม่มีสองข้อแรก คือการชำระค่าธรรมเนียมให้ความไม่พร้อมของตนเอง</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 8 · หมวด 8.1 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Prop Trading Firms</span>
        <h1>บัญชีทุนจากบริษัท: โอกาสจริง เงื่อนไขจริง</h1>
        <p className="lead">
          Prop firm เป็นเส้นทางที่ได้รับความนิยมสูงในหมู่เทรดเดอร์รายย่อย เพราะเสนอสิ่งที่ทุกคนต้องการ —
          เงินทุนขนาดใหญ่โดยไม่ต้องใช้เงินตัวเอง หมวดนี้อธิบาย<b>โครงสร้างธุรกิจตามความเป็นจริง</b>
          ทั้งด้านโอกาสและด้านที่ผู้สมัครส่วนใหญ่มองข้าม เพื่อให้ตัดสินใจบนข้อมูลครบถ้วน
        </p>
      </div>

      <div className="wrap">
        {/* L1 what is */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>Prop Firm คืออะไร — และแบบที่รายย่อยเข้าถึงคือแบบใด</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_MODEL }} />
            <div className="figcap">โครงสร้างมาตรฐานของ retail prop firm: ชำระค่าสอบ → ผ่านเกณฑ์ → ได้บัญชีทุนพร้อมส่วนแบ่งกำไร</div>
          </div>
          <div className="body-txt">
            <p>คำว่า proprietary trading firm ดั้งเดิมหมายถึงบริษัทที่จ้างเทรดเดอร์มืออาชีพเทรดด้วยเงินทุนของบริษัทเอง — แต่รูปแบบที่รายย่อยทั่วโลกเข้าถึงในปัจจุบันคือ <b>&quot;funded account model&quot;</b>: ผู้สมัครชำระค่าธรรมเนียมเพื่อเข้ารับการทดสอบ (challenge) หากทำกำไรถึงเป้าโดยไม่ผิดเงื่อนไขความเสี่ยง จะได้รับสิทธิ์เทรดบนบัญชีทุนของบริษัท และรับส่วนแบ่งกำไร (โดยทั่วไปราวร้อยละ 70–90)</p>
            <p>ข้อเสนอเชิงบวกมีจริง: ผู้ที่มีระบบและวินัยแต่มีเงินทุนจำกัด สามารถเข้าถึงขนาดบัญชีที่ใหญ่กว่าเงินตัวเองหลายเท่า ด้วยความเสี่ยงด้านเงินทุนที่จำกัดอยู่ที่ค่าธรรมเนียมสอบ — <b>ความเสี่ยงขาลงถูกกำหนดไว้ล่วงหน้า ชัดเจน</b> ซึ่งเป็นคุณสมบัติที่ดีในเชิงการบริหารความเสี่ยง</p>
            <p>อย่างไรก็ตาม การประเมินข้อเสนอนี้อย่างถูกต้อง จำเป็นต้องเข้าใจว่ารายได้ของบริษัทเหล่านี้มาจากที่ใด — ซึ่งเป็นเนื้อหาของบทถัดไป</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Funded account = จ่ายค่าสอบ แลกสิทธิ์เทรดทุนบริษัท + ส่วนแบ่งกำไร · ความเสี่ยงจำกัดที่ค่าสอบ</p></div>
        </div>

        {/* L2 business model */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>★ โครงสร้างรายได้ที่แท้จริงของธุรกิจนี้</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_FUNNEL }} />
            <div className="figcap">ภาพเชิงแนวคิด — ผู้สมัครส่วนใหญ่ไม่ผ่านการสอบ และค่าธรรมเนียมของผู้ไม่ผ่านคือรายได้หลักของหลายบริษัท</div>
          </div>
          <div className="body-txt">
            <p>ข้อเท็จจริงที่ผู้สมัครควรทราบก่อนชำระเงิน: สำหรับบริษัทจำนวนมากในอุตสาหกรรมนี้ <b>รายได้หลักมาจากค่าธรรมเนียมการสอบของผู้ที่ไม่ผ่าน</b> ไม่ใช่จากส่วนแบ่งกำไรที่เทรดเดอร์ทำได้ในตลาดจริง — ผู้สมัครส่วนใหญ่ไม่ผ่านเกณฑ์ (สัดส่วนแตกต่างกันตามบริษัทและเงื่อนไข แต่แนวโน้มตรงกันทั้งอุตสาหกรรม) และบางบริษัทไม่ได้นำคำสั่งของบัญชีทุนเข้าตลาดจริงทั้งหมด</p>
            <p>ข้อสังเกตนี้ไม่ได้แปลว่าธุรกิจนี้เป็นการฉ้อโกง — บริษัทที่ดำเนินการโปร่งใสและจ่ายเงินจริงมีอยู่จริง — แต่มันแปลว่า<b>โครงสร้างแรงจูงใจของบริษัทไม่ได้ผูกกับความสำเร็จของผู้สมัครเสมอไป</b> เกณฑ์การสอบบางแห่งจึงถูกออกแบบให้ &quot;ผ่านได้ แต่ยาก&quot; ในระดับที่สร้างรายได้จากการสอบซ้ำ</p>
            <p>บทสรุปเชิงปฏิบัติ: มอง challenge เป็น<b>ธุรกรรมที่ต้องอ่านเงื่อนไขอย่างละเอียดเท่าสัญญาทางการเงินฉบับหนึ่ง</b> ไม่ใช่ตั๋วเข้าร่วมกิจกรรม — และเลือกบริษัทด้วยเกณฑ์ในบทที่ 5</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>รายได้หลักของหลายบริษัทคือค่าสอบของผู้ไม่ผ่าน — เข้าใจแรงจูงใจนี้ก่อน แล้วอ่านเงื่อนไขแบบสัญญาการเงิน</p></div>
        </div>

        {/* L3 why most fail */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>เหตุใดผู้สอบส่วนใหญ่จึงไม่ผ่าน — ความขัดแย้งเชิงโครงสร้าง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CONFLICT }} />
            <div className="figcap">เป้ากำไรภายในเวลาจำกัดกดดันให้เพิ่มความเสี่ยง ขณะที่ลิมิตขาดทุนลงโทษความเสี่ยงทันที</div>
          </div>
          <div className="body-txt">
            <p>เกณฑ์การสอบมาตรฐานประกอบด้วยสามส่วน: <b>เป้ากำไร</b> (เช่น 8–10% ของบัญชี), <b>ลิมิตขาดทุนรายวัน</b> (เช่น 5%), และ<b>ลิมิตขาดทุนรวม</b> (เช่น 10%) — บางแห่งมีกรอบเวลาจำกัดด้วย โครงสร้างนี้สร้างแรงกดสองทิศทางพร้อมกัน: เป้ากำไรเชิญชวนให้เปิดไม้ใหญ่เพื่อถึงเป้าเร็ว ขณะที่ลิมิตขาดทุนพร้อมยุติการสอบทันทีที่ความเสี่ยงนั้นย้อนกลับ</p>
            <p>ผู้สอบส่วนใหญ่แพ้ให้โครงสร้างนี้ ไม่ใช่ให้ตลาด: เร่งทำกำไรช่วงต้น → เปิดไม้ใหญ่ → แตะลิมิตรายวัน → สอบใหม่ด้วยแนวทางเดิม ข้อสรุปที่ขัดกับสัญชาตญาณแต่ถูกต้องคือ <b>การสอบผ่านต้องใช้การบริหารความเสี่ยงที่เข้มงวดกว่าการเทรดปกติ ไม่ใช่หละหลวมกว่า</b> — ผู้ที่ผ่านมักเป็นผู้ที่ปฏิบัติต่อ challenge เหมือนบัญชีจริงที่มีกฎเพิ่มขึ้น</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ผู้สอบส่วนใหญ่แพ้ให้โครงสร้างเกณฑ์ ไม่ใช่ตลาด — ผ่านได้ด้วยความเสี่ยงที่เข้มงวดขึ้น ไม่ใช่การเร่งทำเป้า</p></div>
        </div>

        {/* L4 risk plan for challenge */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>★ แผนความเสี่ยงเฉพาะสำหรับ Challenge</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_DAILY }} />
            <div className="figcap">วางแผนจาก &quot;จำนวนไม้แพ้ที่รองรับได้&quot; ไม่ใช่จากเป้ากำไร</div>
          </div>
          <div className="body-txt">
            <p>หลักการสำคัญ: <b>ออกแบบแผนจากลิมิตขาดทุน ไม่ใช่จากเป้ากำไร</b> — ตัวอย่างการคำนวณ (ลิมิตรายวัน 5%, ลิมิตรวม 10%):</p>
            <div className="calc c2">
              <div className="crow head"><span>พารามิเตอร์</span><span className="v">ค่าที่แนะนำ</span></div>
              <div className="crow"><span className="k">ความเสี่ยงต่อไม้ (เข้มกว่าปกติจาก 1%)</span><span className="v">0.5%</span></div>
              <div className="crow"><span className="k">ไม้แพ้ที่ลิมิตรายวันรองรับ (5 ÷ 0.5)</span><span className="v">10 ไม้</span></div>
              <div className="crow hl"><span className="k">กฎหยุดรายวันที่ตั้งเอง (ก่อนถึงลิมิตจริง)</span><span className="v warn">แพ้ 4 ไม้ = ยุติวันนั้น</span></div>
              <div className="crow"><span className="k">ไม้แพ้สะสมที่ลิมิตรวมรองรับ (10 ÷ 0.5)</span><span className="v">20 ไม้</span></div>
              <div className="crow"><span className="k">เป้ากำไร 8% ที่ระบบ +0.30R ต่อไม้ (ระดับ 7)</span><span className="v">ต้องใช้เวลา — วางแผนเป็นสัปดาห์ ไม่ใช่วัน</span></div>
            </div>
            <p>เหตุผลของกฎหยุดก่อนลิมิตจริง: (1) slippage และ spread ช่วงผันผวนอาจทำให้ขาดทุนจริงเกินแผน — ลิมิตของบริษัทไม่มีการผ่อนผัน (2) การแพ้ต่อเนื่อง 4–5 ไม้ในวันเดียวเป็นสัญญาณของสภาพตลาดที่ไม่เหมาะกับระบบ หรือสภาพจิตใจที่เริ่มเสี่ยงต่อ tilt (ระดับ 7.2) — การหยุดคือการรักษาโอกาสสอบไว้สำหรับวันถัดไป</p>
            <p>ประเด็นสุดท้ายที่มักถูกมองข้าม: <b>เป้ากำไร 8–10% ด้วยความเสี่ยง 0.5% ต่อไม้ ต้องใช้จำนวนไม้ชนะสะสมมาก</b> — ระบบ expectancy +0.30R ต่อไม้ ต้องการราว 50–60 ไม้ ผู้ที่วางแผนสอบให้จบในหนึ่งสัปดาห์กำลังบังคับตัวเองให้ละเมิดแผนความเสี่ยงตั้งแต่ต้น เลือกบริษัทที่ไม่มีกรอบเวลา หรือให้เวลาเพียงพอกับความเร็วของระบบคุณ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เสี่ยง 0.5%/ไม้ · หยุดเองก่อนถึงลิมิต · ให้เวลาเป็นสัปดาห์ — เป้ากำไรคือผลของจำนวนไม้ที่มีคุณภาพ ไม่ใช่ขนาดไม้</p></div>
        </div>

        {/* L5 selecting */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>เกณฑ์คัดเลือกบริษัท — ตรวจสอบก่อนชำระเงิน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CHECK }} />
            <div className="figcap">รายการตรวจสอบขั้นต่ำ — ใช้เวลาศึกษาหนึ่งวัน คุ้มกว่าค่าสอบที่เสียเปล่า</div>
          </div>
          <div className="body-txt">
            <p>สิ่งที่ต้องตรวจสอบให้ครบก่อนตัดสินใจ: (1) <b>ประวัติการจ่ายเงินจริง</b> — หลักฐานการจ่ายจากผู้ใช้หลายราย หลายช่วงเวลา จากแหล่งอิสระ ไม่ใช่เฉพาะที่บริษัทเผยแพร่เอง (2) <b>กฎการเทรดฉบับเต็ม</b> — โดยเฉพาะกฎที่มักไม่แสดงในหน้าโฆษณา: ข้อจำกัดการเทรดช่วงข่าว การถือสถานะข้ามสุดสัปดาห์ กฎความสม่ำเสมอของกำไร (consistency rule) เพดานการถอน (3) <b>อายุการดำเนินธุรกิจและตัวตนนิติบุคคล</b> — บริษัทที่ดำเนินการต่อเนื่องหลายปีผ่านช่วงตลาดหลายแบบ น่าเชื่อถือกว่าบริษัทใหม่ที่เน้นโปรโมชัน</p>
            <p>สัญญาณเตือนที่ควรถอยทันที: กฎที่เขียนคลุมเครือจนตีความได้หลายทาง, ประวัติการเพิ่มหรือเปลี่ยนกฎย้อนหลังกับผู้ที่ผ่านสอบแล้ว, รายงานการปฏิเสธจ่ายด้วยเหตุผลกว้าง เช่น &quot;ผิดเงื่อนไขการใช้งาน&quot; โดยไม่ระบุข้อ, และการลดราคาค่าสอบถี่ผิดปกติ — ข้อสุดท้ายบ่งชี้ว่ารายได้ของบริษัทพึ่งพาปริมาณผู้สอบใหม่มากเพียงใด</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ตรวจ 3 ข้อ: หลักฐานการจ่ายจากแหล่งอิสระ · กฎฉบับเต็มรวมข้อที่ไม่โฆษณา · อายุและตัวตนของนิติบุคคล</p></div>
        </div>

        {/* L6 when */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>Playbook: ควรสอบเมื่อใด — เงื่อนไขที่ต้องมีก่อน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_WHEN }} />
            <div className="figcap">ลำดับที่ถูกต้อง: พิสูจน์ระบบและวินัยกับตัวเองก่อน แล้วจึงใช้เงินซื้อโอกาสขยายขนาด</div>
          </div>
          <div className="body-txt">
            <p>Prop firm ไม่ใช่ทางลัดข้ามการเรียนรู้ — มันคือ<b>ตัวคูณขนาด</b>สำหรับผู้ที่มีระบบที่ทำงานได้แล้ว เงื่อนไขที่ควรครบก่อนพิจารณาสมัคร: (1) ระบบผ่านกระบวนการระดับ 7 ครบ — backtest, OOS, และ journal บัญชีจริงหรือ demo อย่างน้อย 100 ไม้ที่ expectancy เป็นบวก (2) อัตราการทำตามแผน ≥90% ต่อเนื่องอย่างน้อยหนึ่งเดือน (3) เข้าใจเงื่อนไขบริษัทที่เลือกครบถ้วนตามบทที่ 5</p>
            <p>เมื่อครบเงื่อนไข ให้ปฏิบัติต่อค่าสอบเป็น<b>ต้นทุนธุรกิจที่วางแผนได้</b>: กำหนดงบสอบล่วงหน้า (เช่น ไม่เกินจำนวนครั้งที่กำหนดต่อไตรมาส) และบันทึกผลการสอบใน journal เช่นเดียวกับการเทรดปกติ — หากไม่ผ่านสองครั้งด้วยสาเหตุเดียวกัน นั่นคือข้อมูลว่าปัญหาอยู่ที่ระบบหรือวินัย ไม่ใช่โชค และควรกลับไปแก้ที่ต้นเหตุก่อนชำระค่าสอบครั้งถัดไป</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>เมื่อเริ่มมีรายได้จากการเทรด คำถามที่ตามมาคือภาระทางภาษีและสถานะทางกฎหมาย — หมวด <b><a href="/grade/thai-tax-legal">8.2 ภาษีและกฎหมายไทย</a></b> วางกรอบหลักการและรายการที่ต้องตรวจสอบ</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>สอบเมื่อระบบ+วินัยพิสูจน์แล้วเท่านั้น · งบสอบมีเพดาน · ไม่ผ่านซ้ำด้วยสาเหตุเดิม = แก้ต้นเหตุ ไม่ใช่จ่ายเพิ่ม</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · เงื่อนไขของแต่ละบริษัทแตกต่างกันและเปลี่ยนแปลงได้ โปรดตรวจสอบจากบริษัทโดยตรง · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 8 หมวด 8.1 (Premium)
      </div>
    </>
  );
}
