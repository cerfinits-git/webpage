import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 1 · Forex และตลาดเงิน — ตลาดที่ใหญ่ที่สุดในโลก · Cerfinits Grade",
  description:
    "Forex คืออะไร ซื้อขายอะไรกัน คู่เงินทำงานยังไง ใครอยู่ในตลาด และเซสชันเทรดตามเวลาไทย — เล่าเป็นภาพ บนหลักฐาน",
  alternates: { canonical: "/grade/forex-basics" },
};

const SVG_VOLUME = `<svg viewBox="0 0 660 200" role="img" aria-label="เปรียบเทียบปริมาณซื้อขายต่อวัน">
  <text class="t-sm" x="8" y="20">ปริมาณซื้อขายต่อวัน (โดยประมาณ)</text>
  <text class="t-md" x="8" y="60">Forex</text>
  <rect class="bar-gold" x="120" y="42" width="500" height="30"/>
  <text class="t-white" x="608" y="62" text-anchor="end" style="font-size:13px;font-weight:700">~$7.5 ล้านล้าน</text>
  <text class="t-md" x="8" y="115">หุ้นทั้งโลก</text>
  <rect class="bar-n" x="120" y="97" width="40" height="30"/>
  <text class="t-sm" x="170" y="116">~$0.6 ล้านล้าน</text>
  <text class="t-md" x="8" y="170">คริปโต</text>
  <rect class="bar-n" x="120" y="152" width="10" height="30"/>
  <text class="t-sm" x="140" y="171">~$0.13 ล้านล้าน</text>
</svg>`;

const SVG_TRADE = `<svg viewBox="0 0 660 160" role="img" aria-label="สิ่งที่ซื้อขายในตลาด">
  <rect class="chip-n" x="30" y="30" width="180" height="100" rx="3"/>
  <text class="t-md" x="120" y="68" text-anchor="middle">คู่เงิน</text>
  <text class="t-sm" x="120" y="92" text-anchor="middle">EUR/USD · GBP/USD</text>
  <text class="t-sm" x="120" y="110" text-anchor="middle">USD/JPY</text>
  <rect class="chip-gold" x="240" y="30" width="180" height="100" rx="3" stroke-width="2.5"/>
  <text class="t-md t-gold" x="330" y="68" text-anchor="middle">ทองคำ · XAUUSD</text>
  <text class="t-sm" x="330" y="92" text-anchor="middle">โฟกัสหลักของเรา</text>
  <rect class="chip-n" x="450" y="30" width="180" height="100" rx="3"/>
  <text class="t-md" x="540" y="68" text-anchor="middle">ดัชนี</text>
  <text class="t-sm" x="540" y="92" text-anchor="middle">US30 · NAS100</text>
  <text class="t-sm" x="540" y="110" text-anchor="middle">US500</text>
</svg>`;

const SVG_PAIR = `<svg viewBox="0 0 660 190" role="img" aria-label="กายวิภาคคู่เงิน EUR/USD">
  <text x="330" y="66" text-anchor="middle" style="font-size:32px;font-weight:800;fill:var(--ink)">EUR / USD = 1.0850</text>
  <text class="t-sm t-gold" x="210" y="98" text-anchor="middle">▲ ฐาน (base)</text>
  <text class="t-sm t-gold" x="322" y="98" text-anchor="middle">▲ อ้างอิง (quote)</text>
  <text class="t-md" x="330" y="138" text-anchor="middle">เงิน 1 EUR แลกได้ 1.0850 USD</text>
  <text class="t-xs" x="330" y="172" text-anchor="middle">Majors (มี USD) · Minors (ไม่มี USD) · Crosses (คู่ไขว้)</text>
</svg>`;

const SVG_PYRAMID = `<svg viewBox="0 0 660 250" role="img" aria-label="ห่วงโซ่ผู้เล่นในตลาด รายย่อยอยู่ล่างสุด">
  <rect class="bar-n" x="50" y="20" width="560" height="38" rx="2"/><text class="t-md" x="330" y="44" text-anchor="middle">ธนาคารกลาง + ธนาคารใหญ่ (interbank)</text>
  <rect class="bar-n" x="110" y="66" width="440" height="38" rx="2"/><text class="t-md" x="330" y="90" text-anchor="middle">กองทุน / สถาบันการเงิน</text>
  <rect class="bar-n" x="170" y="112" width="320" height="38" rx="2"/><text class="t-md" x="330" y="136" text-anchor="middle">บริษัท / ผู้ค้ารายใหญ่</text>
  <rect class="bar-n" x="220" y="158" width="220" height="38" rx="2"/><text class="t-md" x="330" y="182" text-anchor="middle">โบรกเกอร์ค้าปลีก</text>
  <rect class="bar-down" x="255" y="204" width="150" height="38" rx="2"/><text class="t-md t-down" x="330" y="228" text-anchor="middle">รายย่อย (เรา)</text>
</svg>`;

const SVG_SESSIONS = `<svg viewBox="0 0 660 210" role="img" aria-label="เซสชันเทรด 3 แห่งตามเวลาไทย">
  <rect x="501" y="40" width="95" height="108" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text class="t-xs t-gold" x="548" y="34" text-anchor="middle">คึกคักสุด</text>
  <rect class="bar-n" x="193" y="44" width="213" height="28" rx="2"/><text class="t-sm" x="300" y="62" text-anchor="middle">โตเกียว 06:00–15:00</text>
  <rect class="bar-gold" x="383" y="80" width="213" height="28" rx="2"/><text class="t-sm" x="490" y="98" text-anchor="middle">ลอนดอน 14:00–23:00</text>
  <rect class="bar-down" x="501" y="116" width="119" height="28" rx="2"/><text class="t-sm" x="560" y="134" text-anchor="middle">นิวยอร์ก 19:00→</text>
  <line x1="50" y1="165" x2="620" y2="165" stroke="var(--hair-2)" stroke-width="1.5"/>
  <text class="t-xs" x="50" y="185" text-anchor="middle">00:00</text>
  <text class="t-xs" x="193" y="185" text-anchor="middle">06:00</text>
  <text class="t-xs" x="335" y="185" text-anchor="middle">12:00</text>
  <text class="t-xs" x="478" y="185" text-anchor="middle">18:00</text>
  <text class="t-xs" x="620" y="185" text-anchor="middle">24:00</text>
</svg>`;

const SVG_WORKER = `<svg viewBox="0 0 660 175" role="img" aria-label="ช่วงเวลาที่เหมาะกับคนมีงานประจำ">
  <rect class="bar-n" x="264" y="44" width="190" height="42" rx="2"/><text class="t-sm" x="359" y="70" text-anchor="middle">เวลางาน 09:00–17:00</text>
  <rect class="bar-gold" x="501" y="44" width="119" height="42" rx="2"/><text class="t-sm t-gold" x="560" y="70" text-anchor="middle">19:00–24:00</text>
  <path d="M560,120 L560,90 M553,98 L560,88 L567,98" fill="none" stroke="var(--gold)" stroke-width="1.5"/>
  <text class="t-sm t-gold" x="560" y="138" text-anchor="middle">ช่วงที่คุณเทรดได้</text>
  <text class="t-xs" x="500" y="157" text-anchor="middle">= London–NY overlap หลังเลิกงาน</text>
  <line x1="50" y1="100" x2="620" y2="100" stroke="var(--hair-2)" stroke-width="1"/>
  <text class="t-xs" x="50" y="118" text-anchor="middle">00:00</text>
  <text class="t-xs" x="264" y="30" text-anchor="middle">09:00</text>
  <text class="t-xs" x="454" y="30" text-anchor="middle">17:00</text>
  <text class="t-xs" x="620" y="118" text-anchor="middle">24:00</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 1 · หมวด 1.1</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Forex และตลาดเงิน</span>
        <h1>ตลาดที่ใหญ่ที่สุดในโลก ทำงานยังไง</h1>
        <p className="lead">
          ก่อนจะแตะกราฟ คุณต้องรู้ก่อนว่ากำลังจะเข้าไปเล่นใน<b>สนามแบบไหน</b> —
          Forex คืออะไร ซื้อขายอะไรกัน ใครอยู่ในนั้น และเปิดเวลาไหน (เทียบเวลาไทย)
          หมวดนี้ปูพื้นให้ครบก่อนไปเรื่องต้นทุนและกลไกในหมวดถัดไป
        </p>
      </div>

      <div className="wrap">
        {/* L1 */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>Forex คืออะไร ทำไมถึงใหญ่ที่สุดในโลก</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_VOLUME }} />
            <div className="figcap">ตลาดแลกเปลี่ยนเงินตราซื้อขายราว <b>$7.5 ล้านล้าน/วัน</b> — ใหญ่กว่าตลาดหุ้นทั้งโลกรวมกันหลายเท่า<sup style={{ color: "var(--gold)", fontWeight: 700 }}>1</sup></div>
          </div>
          <div className="body-txt">
            <p><b>Forex (Foreign Exchange)</b> คือตลาดที่คนทั้งโลกแลกเปลี่ยนสกุลเงินกัน — เวลาคุณแลกเงินไปเที่ยว นั่นคือ forex ในชีวิตจริง ส่วนการ “เทรด” forex คือการเก็งกำไรจากการที่ค่าเงิน (และทองคำ) ขยับขึ้นลงเทียบกัน</p>
            <p>ความใหญ่ของมันมีข้อดีจริง: <b>สภาพคล่องสูง</b> (เข้า-ออกออเดอร์ได้เร็ว ราคาไม่กระโดดง่าย) และ<b>ไม่มีใครปั่นตลาดทั้งตลาดได้</b> เพราะมันใหญ่เกินไป — แต่ “ใหญ่และมีสภาพคล่อง” ไม่ได้แปลว่า “ทำกำไรง่าย” คนละเรื่องกัน อย่าเพิ่งสับสนสองอย่างนี้</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Forex = ตลาดแลกเงินที่ใหญ่และลื่นที่สุด — แต่ใหญ่ ≠ ง่าย</p></div>
        </div>

        {/* L2 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>เขาซื้อขายอะไรกันในตลาดนี้</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_TRADE }} />
            <div className="figcap">3 กลุ่มที่รายย่อยเทรดบ่อยผ่านโบรกเกอร์ — ทองคำ (XAUUSD) คือสนามหลักของ Cerfinits</div>
          </div>
          <div className="body-txt">
            <p>แม้ชื่อจะว่า “forex” แต่ผ่านโบรกเกอร์เดียวคุณมักเทรดได้ทั้ง <b>คู่เงิน</b>, <b>โลหะมีค่า</b> (โดยเฉพาะทองคำ XAUUSD), และ<b>ดัชนีหุ้น</b> — เพราะทุกอย่างเทรดในรูปแบบเดียวกัน (ซื้อ/ขายส่วนต่างราคา)</p>
            <p>เราโฟกัสทองเป็นหลัก เพราะมันวิ่งแรง มีจังหวะชัด และมีเรื่องราว (ดอกเบี้ย เงินเฟ้อ ความเสี่ยงโลก) ให้อ่าน — แต่กลไกทุกอย่างที่เรียนในหลักสูตรนี้ใช้ได้กับทั้งคู่เงินและดัชนีเหมือนกัน</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>โบรกเดียวเทรดได้หลายอย่าง — เราเริ่มที่ทอง แต่หลักการใช้ได้หมด</p></div>
        </div>

        {/* L3 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>คู่เงินทำงานยังไง: ฐาน / อ้างอิง</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_PAIR }} />
            <div className="figcap">ทุกราคาในตลาดนี้คือ “ของสองสกุลเทียบกัน” — ตัวหน้าคือฐาน ตัวหลังคือสกุลที่ใช้วัดราคา</div>
          </div>
          <div className="body-txt">
            <p>ราคาในตลาดนี้ไม่มี “ค่าสัมบูรณ์” — มันคือ<b>ของสองสกุลเทียบกันเสมอ</b> EUR/USD = 1.0850 หมายถึงเงิน 1 EUR แลกได้ 1.0850 USD ถ้าเลขนี้ขึ้น = EUR แข็งค่าเทียบ USD, ถ้าลง = EUR อ่อนค่า</p>
            <ul className="reasons">
              <li><b>Majors</b> — คู่ที่มี USD และเทรดเยอะสุด เช่น EUR/USD, GBP/USD, USD/JPY (สเปรดถูก ข้อมูลเยอะ)</li>
              <li><b>Minors</b> — คู่เงินหลักที่ไม่มี USD เช่น EUR/GBP</li>
              <li><b>Crosses</b> — คู่ไขว้อื่น ๆ (สภาพคล่องน้อยกว่า สเปรดกว้างกว่า)</li>
            </ul>
            <p><b>ทองคำ XAUUSD</b> ก็อ่านแบบเดียวกัน: ราคาของทอง 1 ออนซ์ คิดเป็น USD — เลขขึ้นคือทองแพงขึ้นเทียบดอลลาร์</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ราคา = ของสองสกุลเทียบกัน · ตัวหน้าแข็ง เลขขึ้น / ตัวหน้าอ่อน เลขลง</p></div>
        </div>

        {/* L4 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>ใครอยู่ในตลาด — และเราอยู่ตรงไหน</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_PYRAMID }} />
            <div className="figcap">รายย่อยอยู่ปลายสุดของห่วงโซ่ — รู้ว่าเราตัวเล็กแค่ไหน ช่วยให้ไม่ประมาท</div>
          </div>
          <div className="body-txt">
            <p>ตลาดนี้ไม่ได้มีแต่รายย่อย — ด้านบนสุดคือธนาคารกลางและธนาคารใหญ่ที่ซื้อขายกันเองในราคาที่ดีที่สุด ถัดลงมาคือกองทุน บริษัท และสุดท้ายคือ<b>รายย่อยอย่างเรา ที่เข้าผ่านโบรกเกอร์</b></p>
            <p>ทำไมต้องรู้? เพราะมันเตือนความจริง 2 ข้อ: (1) ราคาที่เราเห็นถูกขับเคลื่อนโดยผู้เล่นใหญ่ที่มีข้อมูลและทุนมากกว่าเรามหาศาล (2) เรา<b>แข่งเรื่องความเร็ว/ข้อมูลกับเขาไม่ได้</b> — สิ่งที่เราแข่งได้คือ<b>วินัยและการเลือกจังหวะ</b> ไม่ใช่การเดาว่ามือใหญ่จะทำอะไร</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เราตัวเล็กสุดในห่วงโซ่ — เลิกคิดว่าจะ “เอาชนะ” ตลาด แล้วหันมาเลือกจังหวะที่ดี</p></div>
        </div>

        {/* L5 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>ตลาดเปิด 24 ชม.จริงไหม — เซสชันตามเวลาไทย</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SESSIONS }} />
            <div className="figcap">เวลาไทย (GMT+7) · โดยประมาณ ขยับ ±1 ชม. ตามช่วง Daylight Saving ของยุโรป/สหรัฐ</div>
          </div>
          <div className="body-txt">
            <p>ตลาด forex เปิด <b>24 ชั่วโมง วันจันทร์–ศุกร์</b> เพราะโลกหมุนต่อกันเป็นเซสชัน: โตเกียว → ลอนดอน → นิวยอร์ก แต่ “เปิดตลอด” ไม่ได้แปลว่า “ทุกชั่วโมงเหมือนกัน” — บางช่วงเงียบ ราคาไม่ไปไหน บางช่วงคึกคักมาก</p>
            <p>ช่วงที่ <b>ลอนดอนกับนิวยอร์กเปิดทับกัน (~19:00–23:00 เวลาไทย)</b> คือช่วงที่ปริมาณและความผันผวนสูงสุด — ทองคำก็มักวิ่งแรงที่สุดตอนนี้ เพราะข่าวเศรษฐกิจสหรัฐส่วนใหญ่ออกช่วงหัวค่ำบ้านเรา</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เปิด 24 ชม. แต่ไม่เท่ากันทุกชม. — London–NY overlap คือช่วงคึกคักสุด</p></div>
        </div>

        {/* L6 */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>★ ช่วงไหนเหมาะกับคนไทยที่มีงานประจำ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_WORKER }} />
            <div className="figcap">โชคดีที่ช่วงคึกคักสุดตรงกับ “หลังเลิกงาน” ของคนไทยพอดี</div>
          </div>
          <div className="body-txt">
            <p>นี่คือข้อได้เปรียบที่คนไทยหลายคนมองข้าม: <b>ช่วงที่ตลาดคึกคักที่สุด (~19:00–24:00) ตรงกับหลังเลิกงานพอดี</b> คุณไม่ต้องลาออกจากงาน ไม่ต้องตื่นตี 3 — เทรดช่วงหัวค่ำ 2–3 ชั่วโมงหลังกินข้าวเสร็จก็เจอจังหวะที่ดีที่สุดของวันแล้ว</p>
            <p><b>คำเตือนตรง ๆ:</b> ช่วงคึกคัก = โอกาสเยอะ แต่ก็<b>ผันผวนแรงและอันตราย</b>เท่ากัน โดยเฉพาะช่วงข่าวออก มือใหม่ควรเริ่มจาก “ดู” ก่อน “เทรด” — และห้ามฝืนนั่งเทรดดึกจนอดนอนไปทำงานไม่ไหว วินัยเรื่องเวลาสำคัญพอ ๆ กับวินัยเรื่องเงิน</p>
          </div>
          <div className="bridge">
            <span className="bi">→</span>
            <div>
              <span className="bl">หมวดถัดไป</span>
              <p>รู้จักสนามแล้ว หมวด <b>1.2 ศัพท์และกลไกการเทรด</b> จะพาไปรู้จัก pip, lot, spread และต้นทุนที่มองไม่เห็น — สิ่งที่กินกำไรเงียบ ๆ ถ้าไม่เข้าใจ</p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>หัวค่ำไทย = ช่วงทองของคนมีงานประจำ — แต่คึกคักแปลว่าอันตรายด้วย เริ่มจากดูก่อน</p></div>
        </div>
      </div>

      <div className="sources">
        <div className="wrap">
          <h3>แหล่งอ้างอิง</h3>
          <p className="si">ตัวเลขเป็นค่าประมาณเพื่อให้เห็นภาพสัดส่วน ไม่ใช่ค่าล่าสุดรายวัน</p>
          <ol className="reflist">
            <li><b>BIS Triennial Central Bank Survey 2022</b> — ปริมาณซื้อขาย forex เฉลี่ยราว 7.5 ล้านล้านดอลลาร์/วัน · ตัวเลขหุ้น/คริปโตเป็นค่าประมาณเชิงเปรียบเทียบ ต่างกันตามแหล่งและช่วงเวลา</li>
            <li><b>เวลาเซสชัน</b> — อ้างอิงเวลาไทย (GMT+7) โดยประมาณ; ขอบเวลาลอนดอน/นิวยอร์กขยับ ±1 ชม. ตามช่วง Daylight Saving Time</li>
          </ol>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 1 หมวด 1.1
      </div>
    </>
  );
}
