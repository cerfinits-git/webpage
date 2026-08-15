import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 6 · Macro Fundamentals — ดอกเบี้ย ธนาคารกลาง และทองคำ · Cerfinits Grade",
  description:
    "Premium: ดอกเบี้ยในฐานะแรงขับหลักของค่าเงิน, วัฏจักรธนาคารกลาง, อ่าน CPI/NFP แบบเทรดเดอร์ (surprise ไม่ใช่ตัวเลข), ทองกับ real yields/DXY, priced in และ playbook วันข่าว",
  alternates: { canonical: "/grade/macro-fundamentals" },
};

const SVG_GRAVITY = `<svg viewBox="0 0 660 210" role="img" aria-label="เงินไหลหาดอกเบี้ยสูง">
  <rect class="chip-ok" x="60" y="50" width="200" height="90" rx="3"/>
  <text class="t-md t-up" x="160" y="84" text-anchor="middle">USD · ดอกเบี้ย 5.5%</text>
  <text class="t-xs" x="160" y="110" text-anchor="middle">ถือแล้วได้ผลตอบแทน</text>
  <rect class="chip-n" x="400" y="50" width="200" height="90" rx="3"/>
  <text class="t-md" x="500" y="84" text-anchor="middle">JPY · ดอกเบี้ย 0.1%</text>
  <text class="t-xs" x="500" y="110" text-anchor="middle">ถือแล้วแทบไม่ได้อะไร</text>
  <path d="M395,95 L275,95 M287,87 L272,95 L287,103" fill="none" stroke="var(--gold)" stroke-width="2.5"/>
  <text class="t-sm t-gold" x="330" y="80" text-anchor="middle">เงินไหล</text>
  <text class="t-sm" x="330" y="180" text-anchor="middle">เงินทุนโลกไหลหาผลตอบแทนสูงกว่า → สกุลดอกสูงแข็งค่า (อื่น ๆ เท่ากัน)</text>
</svg>`;

const SVG_CYCLE = `<svg viewBox="0 0 660 250" role="img" aria-label="วัฏจักรนโยบายธนาคารกลาง">
  <rect class="chip-bad" x="230" y="16" width="200" height="46" rx="3"/>
  <text class="t-sm t-down" x="330" y="44" text-anchor="middle">เศรษฐกิจร้อน · เงินเฟ้อสูง</text>
  <path d="M436,40 C520,50 560,90 555,130 M549,116 L556,132 L540,126" fill="none" stroke="var(--hair-2)" stroke-width="1.5"/>
  <rect class="chip-n" x="440" y="134" width="190" height="46" rx="3"/>
  <text class="t-sm" x="535" y="162" text-anchor="middle">ขึ้นดอกเบี้ย (hawkish)</text>
  <path d="M440,182 C400,215 260,215 220,182 M232,192 L216,180 L230,172" fill="none" stroke="var(--hair-2)" stroke-width="1.5"/>
  <rect class="chip-n" x="30" y="134" width="190" height="46" rx="3"/>
  <text class="t-sm" x="125" y="162" text-anchor="middle">เศรษฐกิจชะลอ · เงินเฟ้อลง</text>
  <path d="M110,130 C90,80 140,52 224,42 M210,36 L228,42 L212,52" fill="none" stroke="var(--hair-2)" stroke-width="1.5"/>
  <text class="t-xs t-gold" x="330" y="120" text-anchor="middle">ลดดอกเบี้ย (dovish) → กระตุ้น → วนใหม่</text>
  <text class="t-xs" x="330" y="238" text-anchor="middle">ตลาดไม่รอให้ครบวง — มัน &quot;เก็งล่วงหน้า&quot; ว่ากำลังจะหมุนไปเฟสไหน</text>
</svg>`;

const SVG_SURPRISE = `<svg viewBox="0 0 660 220" role="img" aria-label="surprise สำคัญกว่าตัวเลข">
  <text class="t-sm" x="165" y="26" text-anchor="middle">CPI ออก 3.4%</text>
  <text class="t-md" x="60" y="70">คาด 3.0%</text>
  <rect class="bar-n" x="60" y="82" width="150" height="24"/>
  <text class="t-md t-down" x="60" y="140">จริง 3.4%</text>
  <rect class="bar-down" x="60" y="152" width="190" height="24"/>
  <text class="t-xs t-down" x="165" y="200" text-anchor="middle">ร้อนกว่าคาด = hawkish surprise → ทองลง</text>
  <line x1="330" y1="30" x2="330" y2="196" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm" x="495" y="26" text-anchor="middle">CPI ออก 3.4% (เหมือนกัน!)</text>
  <text class="t-md" x="400" y="70">คาด 3.8%</text>
  <rect class="bar-n" x="400" y="82" width="210" height="24"/>
  <text class="t-md t-up" x="400" y="140">จริง 3.4%</text>
  <rect class="bar-up" x="400" y="152" width="190" height="24"/>
  <text class="t-xs t-up" x="495" y="200" text-anchor="middle">เย็นกว่าคาด = dovish surprise → ทองขึ้น</text>
</svg>`;

const SVG_REALYIELD = `<svg viewBox="0 0 660 230" role="img" aria-label="real yield กับทองสวนทางกัน">
  <text class="t-xs" x="46" y="24">Real yield (ดอกเบี้ยจริงหลังหักเงินเฟ้อคาดการณ์)</text>
  <polyline points="40,90 130,80 220,60 310,52 400,66 490,84 600,100" fill="none" stroke="var(--down)" stroke-width="2"/>
  <line x1="40" y1="118" x2="620" y2="118" stroke="var(--hair-2)" stroke-width="1"/>
  <text class="t-xs t-gold" x="46" y="140">ทองคำ</text>
  <polyline points="40,160 130,168 220,190 310,198 400,182 490,164 600,148" fill="none" stroke="var(--gold)" stroke-width="2.5"/>
  <text class="t-sm" x="330" y="222" text-anchor="middle">ทองไม่จ่ายดอกเบี้ย — ค่าเสียโอกาสของการถือทอง = real yield</text>
</svg>`;

const SVG_PRICEDIN = `<svg viewBox="0 0 660 220" role="img" aria-label="buy the rumor sell the fact">
  <line x1="440" y1="40" x2="440" y2="180" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text class="t-xs t-gold" x="440" y="30" text-anchor="middle">วันประกาศจริง</text>
  <polyline points="40,170 120,150 200,128 280,100 360,76 440,60 480,84 540,96 610,88" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <text class="t-xs t-up" x="230" y="176" text-anchor="middle">ตลาด &quot;ซื้อข่าวลือ&quot; — ราคาขึ้นรับเหตุการณ์ล่วงหน้าหลายสัปดาห์</text>
  <text class="t-xs t-down" x="520" y="130" text-anchor="middle">ประกาศตามคาด →</text>
  <text class="t-xs t-down" x="520" y="148" text-anchor="middle">&quot;ขายข้อเท็จจริง&quot;</text>
</svg>`;

const SVG_NEWSDAY = `<svg viewBox="0 0 660 230" role="img" aria-label="โครงสร้างวันข่าวใหญ่">
  <rect x="200" y="36" width="140" height="150" fill="var(--down-tint)" opacity="0.6"/>
  <text class="t-xs t-down" x="270" y="28" text-anchor="middle">โซนห้ามเทรด (ก่อน-หลังข่าว)</text>
  <line x1="270" y1="36" x2="270" y2="186" stroke="var(--down)" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text class="t-xs t-down" x="270" y="204" text-anchor="middle">19:30 ข่าวออก</text>
  <polyline points="40,110 120,106 200,112 250,108" fill="none" stroke="var(--ink)" stroke-width="1.8"/>
  <line x1="270" y1="52 " x2="270" y2="170" stroke="var(--ink)" stroke-width="2.5"/>
  <polyline points="290,140 340,120 400,96 470,80 540,66 610,58" fill="none" stroke="var(--up)" stroke-width="2"/>
  <text class="t-xs" x="150" y="90" text-anchor="middle">ก่อนข่าว: เงียบ, spread ปกติ</text>
  <text class="t-xs t-down" x="330" y="176" text-anchor="middle">วินาทีข่าว: spike สองทาง + spread ถ่าง</text>
  <text class="t-xs t-up" x="500" y="120" text-anchor="middle">หลังแท่งแรกจบ: ทิศเริ่มชัด — ค่อยทำงาน</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 6 · หมวด 6.1 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Macro Fundamentals</span>
        <h1>แรงขับเบื้องหลังราคา: ดอกเบี้ย ธนาคารกลาง และทองคำ</h1>
        <p className="lead">
          ระดับ 5 สอนอ่าน &quot;พฤติกรรม&quot; ของราคา — ระดับนี้สอนอ่าน <b>&quot;เหตุผล&quot;</b> ที่อยู่เบื้องหลังมัน
          สำหรับเทรดเดอร์ FX/ทอง macro ไม่ใช่วิชาเศรษฐศาสตร์ มันคือการเข้าใจว่า<b>เงินก้อนใหญ่ของโลกกำลังไหลไปทางไหน
          และทำไม</b> — เพื่อให้ระบบ technical ของคุณเทรด &quot;ตามน้ำ&quot; แทนที่จะสวนมันโดยไม่รู้ตัว
        </p>
      </div>

      <div className="wrap">
        {/* L1 interest rates */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>ดอกเบี้ย — แรงขับหลักของค่าเงิน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_GRAVITY }} />
            <div className="figcap">เงินทุนโลกไหลหาผลตอบแทนสูงกว่าเสมอ — ส่วนต่างดอกเบี้ย (rate differential) คือแรงขับพื้นฐานที่สุดของ FX</div>
          </div>
          <div className="body-txt">
            <p>ถ้าต้องเลือกรู้ macro แค่เรื่องเดียว ให้เป็นเรื่องนี้: <b>เงินทุนไหลหาดอกเบี้ยสูง</b> — ฝากเงินใน USD ได้ 5.5% ฝากใน JPY ได้ 0.1% เงินก้อนใหญ่ของโลกย่อมไหลเข้า USD → ดอลลาร์แข็ง เพราะฉะนั้นสิ่งที่ขับ FX ระยะกลาง-ยาวไม่ใช่ตัวดอกเบี้ยวันนี้ แต่คือ<b>ทิศทางของ &quot;ส่วนต่าง&quot; ดอกเบี้ยระหว่างสองสกุล</b> (rate differential) ว่ากำลังกว้างขึ้นหรือแคบลง</p>
            <p>ประเด็นที่ลึกกว่าที่มือใหม่คิด: ตลาดไม่ได้รอให้ดอกเบี้ยขึ้นจริง — มันขยับตาม<b>&quot;ความคาดหวัง&quot;</b> ว่าดอกเบี้ยจะไปทางไหน เครื่องมืออย่าง Fed funds futures บอกเป็นตัวเลขเลยว่าตลาดให้ความน่าจะเป็นการขึ้น/ลดดอกเบี้ยครั้งหน้ากี่ % — เมื่อความคาดหวังเปลี่ยน ราคาขยับ<b>ทันที</b>โดยไม่ต้องรอการประชุมจริง</p>
            <p>สำหรับทองคำ ดอกเบี้ยยิ่งสำคัญเป็นสองเท่า เพราะ<b>ทองไม่จ่ายดอกเบี้ย</b> — ทุกครั้งที่ดอกเบี้ยขึ้น ต้นทุนค่าเสียโอกาสของการถือทองก็สูงขึ้น (เอาเงินไปฝากได้ผลตอบแทนแทน) — เดี๋ยวบทที่ 4 จะทำเรื่องนี้ให้คมด้วย real yields</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>FX ขับด้วย &quot;ส่วนต่างดอกเบี้ย + ความคาดหวัง&quot; · ทองเสียเปรียบในช่วงดอกเบี้ยขาขึ้นเพราะไม่จ่ายดอกเบี้ย</p></div>
        </div>

        {/* L2 central banks */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>ธนาคารกลาง: เข้าใจวัฏจักร ไม่ใช่จำชื่อ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CYCLE }} />
            <div className="figcap">นโยบายหมุนเป็นวง: ร้อน → ขึ้นดอก → ชะลอ → ลดดอก → กระตุ้น — ตลาดเก็งล่วงหน้าเสมอว่ากำลังหมุนไปไหน</div>
          </div>
          <div className="body-txt">
            <p>ธนาคารกลาง (Fed ของสหรัฐคือตัวที่ขยับตลาดโลกมากสุด) มีงานหลักคือคุมเงินเฟ้อกับการจ้างงาน เครื่องมือหลักคือดอกเบี้ย — และพฤติกรรมของมันหมุนเป็น<b>วัฏจักร</b>ที่คาดเดาโครงได้: เศรษฐกิจร้อน/เงินเฟ้อสูง → ขึ้นดอกเบี้ยกด (hawkish) → เศรษฐกิจชะลอ → ลดดอกเบี้ยกระตุ้น (dovish) → วนใหม่</p>
            <p>ศัพท์ที่ต้องอ่านให้ขาด: <b>Hawkish</b> = โทนเข้มงวด เอียงขึ้นดอกเบี้ย (ดี USD, ร้าย ทอง) · <b>Dovish</b> = โทนผ่อนคลาย เอียงลดดอกเบี้ย (ร้าย USD, ดี ทอง) — และสิ่งที่ตลาดฟังจริง ๆ ในการประชุมไม่ใช่ &quot;มติดอกเบี้ย&quot; (ซึ่งมักถูก priced in แล้ว) แต่คือ<b>ถ้อยแถลงและ forward guidance</b>: คำใบ้ว่าครั้งหน้าจะเอายังไง การขึ้นดอกเบี้ยพร้อมส่งสัญญาณ &quot;ครั้งสุดท้ายแล้ว&quot; อาจทำให้ USD <b>อ่อน</b>ลงด้วยซ้ำ (dovish hike)</p>
            <p>เชิงปฏิบัติสำหรับเรา: ไม่ต้องพยากรณ์เก่งกว่านักเศรษฐศาสตร์ — แค่รู้ว่า<b>ตอนนี้อยู่เฟสไหนของวง และตลาดคาดอะไรอยู่</b> ก็พอให้ตั้ง bias ทองรายสัปดาห์–รายเดือนอย่างมีเหตุผลแล้ว</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>อ่านวัฏจักร + forward guidance ไม่ใช่มติดอกเบี้ย — dovish hike / hawkish cut มีจริงและกลับทิศราคาได้</p></div>
        </div>

        {/* L3 data */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>★ อ่านตัวเลขเศรษฐกิจแบบเทรดเดอร์: Surprise คือทุกอย่าง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SURPRISE }} />
            <div className="figcap">CPI 3.4% เท่ากันเป๊ะ — แต่ปฏิกิริยาตรงข้ามกัน เพราะสิ่งที่ตลาดเทรดคือ &quot;ระยะห่างจากที่คาด&quot;</div>
          </div>
          <div className="body-txt">
            <p>นี่คือจุดที่มือใหม่งงที่สุด: &quot;ตัวเลขออกมาดี ทำไมราคาลง?&quot; — เพราะตลาด<b>ไม่ได้เทรดตัวเลข มันเทรด &quot;ตัวเลขเทียบกับที่คาด&quot; (surprise)</b> ตัวเลขตามคาดเป๊ะ = แทบไม่มีอะไรเกิดขึ้น (priced in ไปแล้ว) ตัวเลขต่างจากคาดมาก = ตลาดต้อง re-price ความคาดหวังดอกเบี้ยใหม่ทันที → ราคาวิ่งแรง</p>
            <p>ตัวเลขหลักที่ขยับทอง เรียงตามแรง: <b>CPI</b> (เงินเฟ้อผู้บริโภค — ร้อนกว่าคาด = hawkish = ทองลง), <b>NFP</b> (จ้างงานนอกภาคเกษตร — แข็งกว่าคาด = เศรษฐกิจแกร่ง = ดอกเบี้ยสูงนาน = ทองลง), <b>PCE</b> (เงินเฟ้อตัวที่ Fed ใช้จริง), และถ้อยแถลง <b>FOMC</b> — จำ mapping ง่าย ๆ: <b>ข้อมูลแข็งแกร่ง/เงินเฟ้อร้อน = ร้ายต่อทอง · ข้อมูลอ่อน/เงินเฟ้อเย็น = ดีต่อทอง</b> (ผ่านกลไกดอกเบี้ยเสมอ)</p>
            <p>อย่าลืมตัวแปรซ่อน: <b>ตัวเลขเดือนก่อนถูก revise</b> ย้อนหลังได้และตลาดสนใจ revision ไม่แพ้ตัวเลขใหม่ + ปฏิกิริยาแรกในนาทีแรกมัก overshoot แล้วย้อน — เดี๋ยวบทสุดท้ายจะให้กฎรับมือ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ตลาดเทรด surprise ไม่ใช่ตัวเลข — จำ mapping: ข้อมูลแข็ง/เงินเฟ้อร้อน = ทองลง (ผ่านดอกเบี้ย)</p></div>
        </div>

        {/* L4 gold + real yields */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>★ ทองคำกับ Real Yields และ DXY — คู่ที่ต้องดูทุกวัน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_REALYIELD }} />
            <div className="figcap">Real yield ขึ้น → ค่าเสียโอกาสถือทองแพง → ทองลง (และกลับกัน) — ความสัมพันธ์หลักของทองยุคใหม่</div>
          </div>
          <div className="body-txt">
            <p>ยกระดับจากบทที่ 1: ตัวที่ทองแคร์จริงไม่ใช่ดอกเบี้ยดิบ ๆ แต่คือ <b>real yield = ดอกเบี้ยพันธบัตร − เงินเฟ้อคาดการณ์</b> (ดูได้จาก US 10Y TIPS yield) เพราะนั่นคือ &quot;ผลตอบแทนจริง&quot; ที่คุณเสียไปจากการถือทองแทนพันธบัตร — real yield ติดลบ/ต่ำ = ถือทองแทบไม่เสียอะไร = ทองน่าถือ · real yield พุ่ง = ทองโดนกดดัน</p>
            <p>ตัวที่สอง: <b>DXY (ดัชนีดอลลาร์)</b> — ทองตั้งราคาเป็น USD ดอลลาร์แข็งทำให้ทองแพงขึ้นสำหรับผู้ซื้อสกุลอื่น = กดราคา โดยทั่วไปทองกับ DXY สวนทางกัน · <b>แต่นี่คือจุดที่ evidence-first ต้องเตือน:</b> ความสัมพันธ์พวกนี้เป็น<b>เชิงสถิติ ไม่ใช่กฎฟิสิกส์</b> — มีช่วงที่ทองขึ้นพร้อมดอลลาร์ (เช่นช่วงกลัวสงคราม/วิกฤต ที่คนซื้อทั้งคู่เป็น safe haven) ใช้มันเป็น &quot;บริบท&quot; ไม่ใช่ &quot;สัญญาณเข้า&quot;</p>
            <p>Routine ประจำวันที่แนะนำ (ต่อจาก routine 15 นาทีของ 5.3): ก่อนเปิดกราฟทอง เหลือบดู 2 อย่าง — <b>10Y yield/TIPS วันนี้ไปทางไหน + DXY ไปทางไหน</b> ถ้าทั้งคู่ชี้ทางเดียวกับ bias ทางเทคนิคของคุณ = น้ำหนักเพิ่ม ถ้าสวนกันแรง = ลดขนาดไม้หรือรอ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ทอง = สวนทาง real yields + DXY (เชิงสถิติ ไม่ใช่กฎ) — ใช้เป็นบริบทเช็คก่อนเทรดทุกวัน</p></div>
        </div>

        {/* L5 priced in */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>&quot;Priced In&quot; — ทำไมข่าวดีแล้วราคาลง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_PRICEDIN }} />
            <div className="figcap">ราคาวิ่งรับเหตุการณ์ &quot;ล่วงหน้า&quot; หลายสัปดาห์ — พอเกิดจริงตามคาด คนที่ซื้อดักขายทำกำไร = ราคาลง</div>
          </div>
          <div className="body-txt">
            <p>ปรากฏการณ์ &quot;buy the rumor, sell the fact&quot;: ตลาดคือเครื่องจักรเก็งอนาคต — ถ้าทุกคนเชื่อว่า Fed จะลดดอกเบี้ยเดือนหน้า ราคาทอง<b>ขึ้นรับตั้งแต่วันนี้</b> พอวันประชุมจริง Fed ลดตามคาดเป๊ะ... ไม่มีข้อมูลใหม่เหลือให้ซื้อเพิ่ม มีแต่คนที่ดักซื้อไว้แล้วรอขายทำกำไร → ทองลงทั้งที่ &quot;ข่าวดี&quot;</p>
            <p>คำถามที่ต้องถามก่อนเทรดข่าวทุกครั้งจึงไม่ใช่ &quot;ข่าวนี้ดีหรือร้าย&quot; แต่คือ <b>&quot;ตลาดคาดอะไรไว้แล้ว และความจริงต่างจากนั้นแค่ไหน&quot;</b> — เช็คได้จาก economic calendar (ค่า forecast), Fed funds futures (ความน่าจะเป็นดอกเบี้ย), และพฤติกรรมราคาก่อนข่าว (วิ่งรับล่วงหน้ามาเยอะหรือยัง)</p>
            <p>กฎหัวแม่มือที่ใช้ได้จริง: เหตุการณ์ที่ถูกพูดถึงมานาน + ราคาวิ่งรับมาไกล = เกิดจริงตามคาดมักจบด้วย &quot;ขายข้อเท็จจริง&quot; · เหตุการณ์ที่ตลาดแตกความเห็น 50/50 = วันนั้นจะผันผวนจริง เพราะครึ่งตลาดต้องรีบกลับด้าน</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ก่อนเทรดข่าวถาม: &quot;ตลาดคาดอะไรแล้ว?&quot; — เหตุการณ์ตามคาดที่ราคาวิ่งรับไปแล้ว มักจบตรงข้ามสัญชาตญาณ</p></div>
        </div>

        {/* L6 news day playbook */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>★ Playbook วันข่าวใหญ่ — กฎที่รักษาพอร์ตคุณ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_NEWSDAY }} />
            <div className="figcap">วินาทีข่าวออก: spike สองทาง + spread ถ่าง + SL ลื่น (slippage) — ช่วงเวลาที่ระบบอัตโนมัติได้เปรียบอย่างชัดเจน</div>
          </div>
          <div className="body-txt">
            <p>ความจริงที่ต้องยอมรับ: วินาทีที่ข่าวใหญ่ออก คุณกำลังแข่งกับ algorithm ที่อ่านและยิงออเดอร์ในเสี้ยววินาที บนสนามที่ <b>spread ถ่างกว้าง, ราคากระโดดข้ามระดับ (gap), และ SL อาจถูก fill เลยจุดที่ตั้ง (slippage)</b> — การคาดเดาทิศทางแล้ววางออเดอร์ดักหน้าข่าว คือการเก็งกำไรที่ต้นทุนสูงที่สุดในตลาด</p>
            <p><b>Playbook วันข่าว (ทำตามได้ทันที):</b></p>
            <div className="calc c2">
              <div className="crow head"><span>สถานการณ์</span><span className="v">กฎ</span></div>
              <div className="crow"><span className="k">เช้าวันเทรด</span><span className="v">เช็คปฏิทินข่าวแดง (CPI/NFP/FOMC) ก่อนเสมอ</span></div>
              <div className="crow"><span className="k">มีไม้เปิดอยู่ + ข่าวแดงใกล้เข้ามา</span><span className="v">ลดขนาด/ปิดไม้ หรือยอมรับความเสี่ยง gap อย่างรู้ตัว</span></div>
              <div className="crow stop"><span className="k">15 นาทีก่อน – 15 นาทีหลังข่าวแดง</span><span className="v neg">ห้ามเปิดไม้ใหม่ เด็ดขาด</span></div>
              <div className="crow"><span className="k">หลังแท่ง M15 แรกปิด</span><span className="v">ทิศเริ่มชัด spread กลับปกติ — กลับไปใช้ระบบระดับ 5 ได้</span></div>
              <div className="crow hl"><span className="k">ทางเลือกที่ดีที่สุดของมือใหม่</span><span className="v">ไม่เทรดวันข่าวแดงเลย — ไม่มีใครจนเพราะยืนดู</span></div>
            </div>
            <p>มุมที่คนไม่ค่อยพูด: ข่าวใหญ่คือ<b>โอกาสหลังจากมันจบ</b> — การ re-price ครั้งใหญ่มักสร้างเทรนด์ intraday ที่สะอาดในช่วง 1–3 ชั่วโมงถัดมา (ตรงหัวค่ำไทยพอดีสำหรับข่าวสหรัฐ) รอให้ตลาดแสดงทิศทางหลังข่าว แล้วเทรดตามระบบ ดีกว่าพยายามคาดเดาล่วงหน้า</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>รู้แรงขับ &quot;เชิงเหตุผล&quot; แล้ว — หมวด <b><a href="/grade/sentiment-intermarket">6.2 Sentiment &amp; Intermarket</a></b> จะเพิ่มเลนส์สุดท้าย: ฝูงชนกำลังทำอะไร (COT, retail positioning) และตลาดอื่นกำลังกระซิบอะไรเกี่ยวกับทอง</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>±15 นาทีรอบข่าวแดง = ห้ามเข้าไม้ใหม่ · รอตลาดแสดงทิศหลังข่าว แล้วค่อยเทรดตามระบบ</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · ตัวเลขในภาพเป็นตัวอย่างสมมติ · ความสัมพันธ์เชิง macro เป็นแนวโน้มเชิงสถิติ ไม่ใช่กฎตายตัว · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 6 หมวด 6.1 (Premium)
      </div>
    </>
  );
}
