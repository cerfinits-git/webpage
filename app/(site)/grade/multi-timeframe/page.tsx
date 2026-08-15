import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ระดับ 5 · Multiple Time Frame — ประกอบทุกอย่างเป็นระบบเดียว · Cerfinits Grade",
  description:
    "Premium: ชุด 3 TF (ทิศ/โซน/จังหวะ), routine top-down ทีละขั้น, ทำไม entry TF เล็กให้ R ดีกว่า, worked example ทองเต็มวงจร และข้อผิดพลาด MTF",
  alternates: { canonical: "/grade/multi-timeframe" },
};

const SVG_CONFLICT = `<svg viewBox="0 0 660 230" role="img" aria-label="H1 ขาขึ้นที่จริงคือการย่อใน D1 ขาลง">
  <text class="t-sm t-up" x="165" y="22" text-anchor="middle">สิ่งที่เห็นบน H1: &quot;ขาขึ้นสวย&quot;</text>
  <polyline points="50,170 100,140 140,152 190,116 230,130 290,88" fill="none" stroke="var(--up)" stroke-width="2.5"/>
  <text class="t-xs t-up" x="170" y="196" text-anchor="middle">HH-HL ชัดเจน น่า long</text>
  <line x1="335" y1="26" x2="335" y2="204" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-down" x="500" y="22" text-anchor="middle">ความจริงบน D1: แค่ย่อในขาลง</text>
  <polyline points="370,50 420,110 460,86 520,160 552,128 575,118 640,196" fill="none" stroke="var(--ink)" stroke-width="2"/>
  <rect x="540" y="112" width="44" height="24" fill="none" stroke="var(--up)" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text class="t-xs t-up" x="562" y="104" text-anchor="middle">↑ กรอบที่ H1 เห็น</text>
  <text class="t-xs t-down" x="500" y="220" text-anchor="middle">&quot;ขาขึ้น&quot; นั้นคือ pullback เข้าโซน LH — จุด short ชั้นดี</text>
</svg>`;

const SVG_STACK = `<svg viewBox="0 0 660 240" role="img" aria-label="ชุด 3 TF ทิศ โซน จังหวะ">
  <rect class="chip-n" x="60" y="24" width="540" height="56" rx="3"/>
  <text class="t-md" x="90" y="48" text-anchor="start">D1 — ทิศ (Bias)</text>
  <text class="t-xs" x="90" y="68" text-anchor="start">เทรนด์อะไร · เทรดฝั่งไหนเท่านั้น · ห้ามเถียง TF นี้</text>
  <path d="M330,80 L330,96 M323,88 L330,98 L337,88" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-n" x="60" y="100" width="540" height="56" rx="3"/>
  <text class="t-md" x="90" y="124" text-anchor="start">H4 — โซน (Where)</text>
  <text class="t-xs" x="90" y="144" text-anchor="start">S&amp;D zone / แนวสำคัญ ที่จะรอให้ราคามาหา</text>
  <path d="M330,156 L330,172 M323,164 L330,174 L337,164" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect class="chip-gold" x="60" y="176" width="540" height="56" rx="3" stroke-width="2.5"/>
  <text class="t-md t-gold" x="90" y="200" text-anchor="start">M15 — จังหวะ (Trigger)</text>
  <text class="t-xs" x="90" y="220" text-anchor="start">รอสัญญาณยืนยันในโซน (SFP / engulfing / retest) แล้วค่อยเข้า</text>
</svg>`;

const SVG_SLBENEFIT = `<svg viewBox="0 0 660 210" role="img" aria-label="เข้า TF เล็ก SL สั้นลง R ดีขึ้น">
  <text class="t-sm" x="8" y="22">โซนเดียวกัน เป้าเดียวกัน — ต่างแค่ TF ที่ใช้เข้า</text>
  <text class="t-md" x="8" y="66">เข้าบน H4</text>
  <rect class="bar-down" x="140" y="48" width="200" height="26"/>
  <text class="t-xs t-down" x="348" y="66">SL $20 → 0.005 lot</text>
  <text class="t-md" x="8" y="126">เข้าบน M15</text>
  <rect class="bar-down" x="140" y="108" width="70" height="26"/>
  <text class="t-xs t-up" x="220" y="126">SL $7 → 0.014 lot (เสี่ยง $10 เท่ากัน)</text>
  <text class="t-sm t-gold" x="8" y="180">เป้าเดียวกัน +$60: H4 ได้ 1:3 · M15 ได้ 1:8.5 — ต่างกันเกือบ 3 เท่า</text>
</svg>`;

const SVG_WORKED = `<svg viewBox="0 0 660 260" role="img" aria-label="worked example ทอง D1 H4 M15">
  <rect class="chip-n" x="30" y="20" width="600" height="50" rx="3"/>
  <text class="t-sm" x="52" y="40" text-anchor="start">① D1: HH-HL ต่อเนื่อง ราคาเหนือโซน demand ใหญ่</text>
  <text class="t-xs t-up" x="52" y="58" text-anchor="start">Bias = LONG เท่านั้น (ห้าม short จนกว่า D1 จะ BOS)</text>
  <rect class="chip-n" x="30" y="82" width="600" height="50" rx="3"/>
  <text class="t-sm" x="52" y="102" text-anchor="start">② H4: fresh demand zone 2618–2626 (ฐานสั้น หนีแรง)</text>
  <text class="t-xs" x="52" y="120" text-anchor="start">ตั้ง alert ที่ขอบโซน แล้วปิดหน้าจอรอ</text>
  <rect class="chip-gold" x="30" y="144" width="600" height="50" rx="3" stroke-width="2"/>
  <text class="t-sm t-gold" x="52" y="164" text-anchor="start">③ M15: ราคาลงถึงโซน → sweep low ย่อย → engulfing ขึ้น</text>
  <text class="t-xs t-gold" x="52" y="182" text-anchor="start">Trigger ครบ → เข้า 2626</text>
  <rect class="chip-ok" x="30" y="206" width="600" height="42" rx="3"/>
  <text class="t-sm t-up" x="52" y="232" text-anchor="start">④ SL 2616 (ใต้โซน+ATR) · เสี่ยง $10 → 0.01 lot · TP1 2646 (+2R) · TP2 2666 (+4R)</text>
</svg>`;

const SVG_HOPPING = `<svg viewBox="0 0 660 200" role="img" aria-label="TF hopping กับ 3TF คงที่">
  <text class="t-sm t-down" x="165" y="24" text-anchor="middle">TF Hopping ✕</text>
  <text class="t-md" x="70" y="70">M5</text><text class="t-md" x="150" y="100">H1</text><text class="t-md" x="90" y="140">M30</text><text class="t-md" x="200" y="60">D1</text><text class="t-md" x="230" y="130">M1</text>
  <path d="M85,75 L140,95 M160,105 L105,132 M110,128 L195,68 M215,70 L235,120" stroke="var(--down)" stroke-width="1.2" fill="none"/>
  <text class="t-xs t-down" x="165" y="176" text-anchor="middle">เลื่อนหา TF ที่ &quot;เห็นด้วยกับใจ&quot; = confirmation bias</text>
  <line x1="335" y1="30" x2="335" y2="180" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="t-sm t-up" x="495" y="24" text-anchor="middle">ชุดคงที่ ✓</text>
  <rect class="chip-ok" x="400" y="48" width="190" height="34" rx="3"/><text class="t-sm" x="495" y="70" text-anchor="middle">D1 = ทิศ</text>
  <rect class="chip-ok" x="400" y="92" width="190" height="34" rx="3"/><text class="t-sm" x="495" y="114" text-anchor="middle">H4 = โซน</text>
  <rect class="chip-ok" x="400" y="136" width="190" height="34" rx="3"/><text class="t-sm" x="495" y="158" text-anchor="middle">M15 = จังหวะ</text>
</svg>`;

export default function Page() {
  return (
    <>
      <div className="wrap runhead">
        <span className="brand"><span className="dot" /> Cerfinits Grade</span>
        <span>ระดับ 5 · หมวด 5.3 · PREMIUM</span>
      </div>

      <div className="wrap opener">
        <span className="kicker">Multiple Time Frame</span>
        <h1>ประกอบทุกอย่างเป็นระบบเดียว: ทิศ → โซน → จังหวะ</h1>
        <p className="lead">
          หมวดปิดท้ายระดับ 5 — เอาโครงสร้าง (5.1) และเหตุการณ์ที่แนว (5.2) มาประกอบเป็น
          <b>ระบบวิเคราะห์สามชั้น</b>ที่ตอบครบ: เทรดฝั่งไหน รอที่ไหน เข้าเมื่อไหร่
          พร้อม routine ที่คนมีงานประจำทำตามได้จริงทุกวัน และ worked example เต็มวงจรตั้งแต่ bias จนถึงขนาดไม้
        </p>
      </div>

      <div className="wrap">
        {/* L1 conflict */}
        <div className="lesson first">
          <div className="lhead"><span className="lno">01</span><h2>ทำไม TF เดียวหลอกตา — ตัวอย่างเดียวจบ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_CONFLICT }} />
            <div className="figcap">&quot;ขาขึ้นสวย&quot; บน H1 อาจเป็นแค่ pullback เข้าโซน LH บน D1 — การ long ตรงนั้นคือการเข้าเทรดตรงจุดที่มีแรงขายรออยู่</div>
          </div>
          <div className="body-txt">
            <p>ภาพเดียวนี้อธิบายว่าทำไมมือใหม่ &quot;เห็นสัญญาณครบทุกอย่างแล้วก็ยังแพ้&quot;: บน H1 คุณเห็น HH-HL สวยงามน่า long — แต่พอถอยไป D1 การขึ้นนั้นคือ<b>การย่อ (pullback) เข้าหาโซน LH ของขาลงใหญ่</b> พอดีเป๊ะ จุดที่ H1 บอกให้ซื้อ คือจุดที่ D1 บอกว่าผู้ขายรออยู่</p>
            <p>ผลเชิงสถิติที่ตามมา: การเทรด &quot;ตามเทรนด์ TF เล็ก แต่สวนเทรนด์ TF ใหญ่&quot; คือการเทรดสวนกระแสเงินก้อนใหญ่กว่า — ชนะได้เป็นครั้งคราว แต่ expectancy ระยะยาวแย่กว่าเทรดตามน้ำอย่างมีนัย และไม้ที่แพ้มักแพ้เร็วและแรง เพราะโมเมนตัมใหญ่กลับมาทำงานตรงโซนพอดี</p>
            <p>ข้อสรุปที่เป็นกฎ: <b>TF ใหญ่ชนะเสมอเมื่อขัดแย้งกัน</b> — TF เล็กมีหน้าที่หา &quot;จังหวะ&quot; ภายใต้ทิศของ TF ใหญ่ ไม่ใช่มีสิทธิ์โหวตเรื่องทิศ</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>เมื่อ TF ขัดกัน — TF ใหญ่ชนะเสมอ · TF เล็กหาจังหวะ ไม่ได้มีสิทธิ์เลือกทิศ</p></div>
        </div>

        {/* L2 stack */}
        <div className="lesson">
          <div className="lhead"><span className="lno">02</span><h2>ชุด 3 TF: ทิศ / โซน / จังหวะ — และการเลือกชุดให้เข้ากับชีวิต</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_STACK }} />
            <div className="figcap">แต่ละ TF มีหน้าที่เดียว ไม่ก้าวก่ายกัน — ห่างกันราว 4–6 เท่าต่อชั้น</div>
          </div>
          <div className="body-txt">
            <p>ระบบมาตรฐานใช้ 3 ชั้น แต่ละชั้นตอบคำถามเดียว: <b>TF ใหญ่ (ทิศ)</b> — เทรนด์อะไร เทรดฝั่งไหนเท่านั้น · <b>TF กลาง (โซน)</b> — จะรอราคาที่ &quot;ที่&quot; ไหน · <b>TF เล็ก (จังหวะ)</b> — สัญญาณยืนยันอะไรถึงเข้า · กฎการเลือก: แต่ละชั้นห่างกันราว <b>4–6 เท่า</b> (D1→H4 = 6x, H4→H1 = 4x, H1→M15 = 4x) ใกล้กันไปจะเห็นภาพซ้ำ ไกลไปจะหลุดความเชื่อมโยง</p>
            <p>ชุดที่แนะนำตามชีวิตจริง (จากหมวด 1.1 เรารู้แล้วว่าหัวค่ำไทยคือช่วงทอง): <b>คนมีงานประจำ → D1 / H4 / H1</b>: อ่านทิศกับโซนวันละครั้งตอนเช้าหรือเที่ยง ตั้ง alert แล้วรอ trigger ช่วงหัวค่ำ — จำนวน setup น้อยกว่าแต่คุณภาพสูงและไม่ต้องเฝ้าจอ · <b>คนมีเวลาเต็มช่วงหัวค่ำ → H4 / H1 / M15</b>: setup ถี่ขึ้น แลกกับต้องเฝ้าจอ 2–3 ชม.</p>
            <p>สิ่งที่ห้ามทำ: เลือกชุดแล้ว<b>เปลี่ยนไปมา</b>ตามอารมณ์ — ชุด TF คือส่วนหนึ่งของระบบที่ต้องคงที่เพื่อให้สถิติใน journal ของคุณ (ระดับ 7) แปลผลได้</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>3 ชั้น × หน้าที่เดียว: ทิศ/โซน/จังหวะ · ห่าง 4–6 เท่า · เลือกชุดตามชีวิตแล้วคงที่</p></div>
        </div>

        {/* L3 routine */}
        <div className="lesson">
          <div className="lhead"><span className="lno">03</span><h2>★ Top-down Routine — ลำดับที่ทำเหมือนเดิมทุกวัน</h2></div>
          <div className="body-txt">
            <p>ความได้เปรียบของมือโปรไม่ใช่การเห็นอะไรที่คุณไม่เห็น — คือการ<b>ทำสิ่งเดิมซ้ำทุกวันจนเปรียบเทียบได้</b> นี่คือ routine เต็ม ใช้เวลาราว 15 นาทีต่อวัน:</p>
            <div className="calc c3">
              <div className="crow head"><span>ขั้น</span><span>ทำอะไร</span><span className="v">ผลที่ต้องได้</span></div>
              <div className="crow"><span className="k">1 · D1 (2 นาที)</span><span>อ่านโครงสร้าง HH-HL/LH-LL + BOS ล่าสุด</span><span className="v">Bias: Long / Short / งดเทรด</span></div>
              <div className="crow"><span className="k">2 · D1 (2 นาที)</span><span>ราคาอยู่ไหนเทียบโซนใหญ่ (กลาง range?)</span><span className="v">เทรดวันนี้คุ้มไหม</span></div>
              <div className="crow"><span className="k">3 · H4 (5 นาที)</span><span>วาด/อัปเดต S&amp;D zones ฝั่งตาม bias</span><span className="v">โซนรอ 1–2 โซน + ตั้ง alert</span></div>
              <div className="crow"><span className="k">4 · รอ alert</span><span>ปิดจอ ทำกิจวัตรอื่น — ไม่ต้องเฝ้าจอ</span><span className="v">ไม่สิ้นเปลืองสมาธิ</span></div>
              <div className="crow hl"><span className="k">5 · M15/H1 (เมื่อ alert ดัง)</span><span>รอ trigger ในโซน (retest / SFP / engulfing)</span><span className="v">เข้า หรือ ปล่อยผ่าน</span></div>
              <div className="crow"><span className="k">6 · ก่อนกด (1 นาที)</span><span>คำนวณไม้จากสูตร 4.2 + เช็ค R:R ≥ 1:2</span><span className="v">ผ่านทุกด่านค่อยเข้า</span></div>
            </div>
            <p>ขั้นที่ 4 คือขั้นที่มือใหม่ทำไม่ได้และมันแพงที่สุด: <b>การเฝ้าจอโดยไม่มีโซนให้รอ ทำให้คุณ &quot;เห็น setup&quot; ที่ไม่มีอยู่จริง</b> — alert ที่ขอบโซนคือเครื่องมือวินัยที่ถูกที่สุดในตลาด</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>Routine 15 นาที: ทิศ → คุ้มไหม → โซน+alert → ปิดจอ → รอ trigger → ผ่านด่านความเสี่ยงค่อยเข้า</p></div>
        </div>

        {/* L4 SL benefit */}
        <div className="lesson">
          <div className="lhead"><span className="lno">04</span><h2>ทำไมเข้า TF เล็ก = R ดีขึ้น (แบบวัดได้)</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_SLBENEFIT }} />
            <div className="figcap">โซนเดียวกัน เป้าเดียวกัน เสี่ยง $10 เท่ากัน — ต่างแค่ TF ของ trigger</div>
          </div>
          <div className="body-txt">
            <p>นี่คือเหตุผลเชิงคณิตศาสตร์ที่ MTF ไม่ใช่แค่ &quot;ดูเผื่อ&quot; แต่<b>เพิ่มผลตอบแทนต่อความเสี่ยงโดยตรง</b>: สมมติ H4 demand zone เดียวกัน เป้า +$60 เท่ากัน — ถ้าเข้าด้วยแท่งยืนยันบน H4 คุณต้องวาง SL ใต้โครงสร้าง H4 (กว้าง เช่น $20) ได้ R:R = 1:3 แต่ถ้ารอ trigger บน M15 ในโซนเดียวกัน SL วางใต้โครงสร้าง M15 (แคบ เช่น $7) — <b>R:R กระโดดเป็น 1:8.5</b> ด้วยไอเดียเดียวกันเป๊ะ</p>
            <p>และจากสูตรระดับ 4.2: SL แคบลง = เปิดไม้ใหญ่ขึ้นได้ที่ความเสี่ยงเท่าเดิม ($10 ÷ ($7×100) = 0.014 lot vs 0.005 lot) — กำไรเมื่อถูกจึงมากขึ้นเกือบ 3 เท่า โดย<b>ความเสี่ยงขาลงไม่เปลี่ยนเลย</b></p>
            <p><b>ราคาที่ต้องจ่าย (ต้องพูดให้ครบ):</b> trigger TF เล็กแม่นน้อยกว่า — โดน sweep/noise บ่อยกว่า H4 ดังนั้น win rate จะต่ำลงบ้าง แลกกับ R ต่อไม้ที่สูงขึ้นมาก โดยรวม expectancy มักดีขึ้น แต่<b>ต้องรับความถี่ของไม้แพ้ที่สูงขึ้นให้ได้</b> — หากรับไม่ไหว ใช้ H1 trigger เป็นทางสายกลาง</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>โซนใหญ่ + trigger เล็ก = SL สั้น, R พุ่ง — แลกกับแพ้ถี่ขึ้น เลือกชั้น trigger ตามใจที่ทนได้</p></div>
        </div>

        {/* L5 worked example */}
        <div className="lesson">
          <div className="lhead"><span className="lno">05</span><h2>★ Worked Example เต็มวงจร: ทองหนึ่งไม้ ตั้งแต่ต้นจนจบ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_WORKED }} />
            <div className="figcap">D1 ทิศ → H4 โซน → M15 จังหวะ → สูตรระดับ 4 — ทุกการตัดสินใจมีที่มา ไม่มีอารมณ์สักขั้น</div>
          </div>
          <div className="body-txt">
            <p>ไล่ทีละขั้นด้วยตัวเลขจริง (สมมติเพื่อสอนวิธีคิด — บัญชี $1,000 เสี่ยง 1%): <b>① D1</b> โครงสร้าง HH-HL ต่อเนื่อง ไม่มี BOS → bias = long เท่านั้น <b>② H4</b> พบ fresh demand 2618–2626 (ฐานสั้น 4 แท่ง หนีขึ้นแรง) → ตั้ง alert 2628 แล้วปิดจอ <b>③ M15</b> (สองวันถัดมา alert ดัง) ราคาเข้าโซน กวาด low ย่อยครั้งหนึ่ง แล้วมี bullish engulfing body ใหญ่ → trigger ครบ เข้า 2626 <b>④ ความเสี่ยง</b> SL 2616 (ใต้โซน + เผื่อ ATR) ระยะ $10 → ขนาดไม้ = $10 ÷ ($10×100) = <b>0.01 lot พอดี</b> · TP1 = 2646 (+2R, ปิดครึ่งไม้) · TP2 = 2666 (LH ถัดไปบน H4, +4R)</p>
            <p>จุดที่อยากให้เห็นที่สุด: <b>ไม่มีขั้นไหนใช้ความรู้สึกเลย</b> — ทิศมาจากโครงสร้าง D1, ที่มาจากโซน H4, จังหวะมาจาก trigger ที่นิยามไว้ก่อน, ขนาดไม้มาจากสูตร ทุกไม้ที่เทรดแบบนี้คือ &quot;ข้อมูล 1 จุด&quot; ที่เอาไปวัดผลต่อได้ในระดับ 7 — ต่างจากไม้อารมณ์ที่ต่อให้กำไรก็สอนอะไรคุณไม่ได้</p>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ไม้ที่ดี = ทุกขั้นอ้างอิงได้ (ทิศ/โซน/จังหวะ/ขนาด) — ไม้แบบนี้เท่านั้นที่สร้างสถิติให้เรียนรู้ได้</p></div>
        </div>

        {/* L6 mistakes */}
        <div className="lesson">
          <div className="lhead"><span className="lno">06</span><h2>ข้อผิดพลาด MTF ที่พบบ่อย + Playbook ปิดระดับ</h2></div>
          <div className="fig">
            <div dangerouslySetInnerHTML={{ __html: SVG_HOPPING }} />
            <div className="figcap">TF hopping = เลื่อนหา TF ที่ &quot;เห็นด้วยกับใจ&quot; — ระบบที่ดีคือชุดคงที่ที่เถียงคุณได้</div>
          </div>
          <div className="body-txt">
            <p>สามกับดักที่ทำลายระบบ MTF: (1) <b>TF hopping</b> — อยาก long แล้วไล่เปิดทีละ TF จนเจอตัวที่ &quot;ยืนยัน&quot; ความอยาก นั่นคือ confirmation bias ที่แต่งตัวเป็นการวิเคราะห์ ชุด TF ต้องล็อกไว้ก่อนดูกราฟ (2) <b>ให้ TF เล็กโหวตเรื่องทิศ</b> — M15 สวยแค่ไหนก็ไม่มีสิทธิ์ล้ม bias ของ D1 (3) <b>วิเคราะห์แล้วไม่รอ</b> — ทำ top-down ครบ แต่พอราคายังไม่ถึงโซนก็ทนไม่ไหวเข้าก่อน เท่ากับโยนขั้นที่ 2-3 ทิ้งทั้งหมด</p>
            <p><b>Playbook ปิดระดับ 5 ทั้งระดับ</b> — สามหมวดรวมเป็นประโยคเดียว: <b>อ่านโครงสร้างเพื่อรู้ทิศ (5.1) → รอเหตุการณ์ที่โซน (5.2) → ประกอบด้วยชุด 3 TF และ routine (5.3)</b> — และทุกไม้ผ่านด่านความเสี่ยงของระดับ 4 ก่อนเสมอ นี่คือโครงระบบเทรดที่สมบูรณ์ชุดแรกของคุณ</p>
          </div>
          <div className="bridge">
            <span className="bi">✓</span>
            <div>
              <span className="bl">จบระดับ 5 — Premium ระดับแรก</span>
              <p>คุณมี &quot;โครงระบบเทรด&quot; ครบแล้ว: ทิศ โซน จังหวะ ความเสี่ยง — ระดับถัดไปเพิ่มมิติใหม่: <b>ระดับ 6 Macro &amp; Sentiment</b> (กำลังจัดทำ) ว่าด้วยแรงขับเบื้องหลังราคา: ดอกเบี้ย ธนาคารกลาง และทองคำ กลับไปดู <b><a href="/grade">แผนที่หลักสูตร</a></b></p>
            </div>
          </div>
          <div className="take"><span className="tl">จำข้อเดียว</span><p>ชุด TF ล็อกก่อนดูกราฟ · TF เล็กไม่มีสิทธิ์โหวตทิศ · วิเคราะห์แล้วต้องรอให้ราคามาหา</p></div>
        </div>
      </div>

      <div className="disc">
        เอกสารนี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · ตัวเลขเป็นตัวอย่างสมมติเพื่อสอนวิธีคิด · การเทรดมีความเสี่ยงสูง อาจสูญเสียเงินทุนทั้งหมด · Cerfinits Grade · ระดับ 5 หมวด 5.3 (Premium)
      </div>
    </>
  );
}
