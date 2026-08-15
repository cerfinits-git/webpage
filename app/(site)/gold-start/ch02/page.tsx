import type { Metadata } from "next";
import { T } from "@/components/site/LangContext";

// Generated from gold-start-ch02.html by scripts/convert-gold-start.mjs — edit freely,
// but re-running the script will overwrite this file.
export const metadata: Metadata = {
  title: "GOLD START · ทองคำ (XAUUSD) สนามที่เราเลือกเล่น · Cerfinits",
  description: "ก่อนจะเรียนวิธีเทรด เราต้องรู้จัก “สิ่งที่จะเทรด” ให้ลึกพอ — ทองคำไม่ได้วิ่งมั่ว มันมีเหตุผลอยู่เบื้องหลังทุกการเคลื่อนไหว และพอคุณเข้าใจเหตุผลนั้น กราฟจะเริ่มมีความหมาย",
  alternates: { canonical: "/gold-start/ch02" },
};

export default function Page() {
  return (
    <>
      <div className="book">

        <div className="wrap runhead">
          <span className="brand"><span className="dot"></span> Cerfinits</span>
          <span>GOLD START · EDGE + DISCIPLINE = SUCCESS</span>
        </div>

        <div className="wrap opener">
          <span className="kicker"><T th="ภาค 2 — รู้จักสนามรบ" en="Part 2 — Know the Battlefield" /></span>
          <div className="chno"><T th="บทที่ / 02" en="Chapter / 02" /></div>
          <h1><T th="ทองคำ (XAUUSD)" en="Gold (XAUUSD)" /><br /><T th="สนามที่เราเลือกเล่น" en="The Battlefield We Chose" /></h1>
          <p className="lead"><T th="ก่อนจะเรียนวิธีเทรด เราต้องรู้จัก “สิ่งที่จะเทรด” ให้ลึกพอ — ทองคำไม่ได้วิ่งมั่ว มันมีเหตุผลอยู่เบื้องหลังทุกการเคลื่อนไหว และพอคุณเข้าใจเหตุผลนั้น กราฟจะเริ่มมีความหมาย" en="Before learning how to trade, we must know 'what we trade' deeply enough. Gold doesn't move randomly; there is a reason behind every movement, and once you understand that reason, the chart will start making sense." /></p>
        </div>

        <div className="wrap content">

          <p className="intro"><T th="ในบทที่แล้ว เราตกลงกันเรื่องวิธีคิด — การเทรดคือทักษะ และเราจะเริ่มอย่างมีวินัย บทนี้เราจะมารู้จัก “สนามรบ” ที่เราเลือก นั่นคือ <b>ทองคำ</b> หรือที่บนแพลตฟอร์มเขียนว่า <b>XAUUSD</b> เพราะก่อนจะลงไปเล่น คุณต้องรู้ก่อนว่าสนามนี้หน้าตาเป็นยังไง และอะไรที่ทำให้มันขยับ" en="In the previous chapter, we agreed on our mindset — trading is a skill, and we will start with discipline. In this chapter, we will get to know our chosen 'battlefield', which is <b>Gold</b>, or as it's written on the platform: <b>XAUUSD</b>. Because before you step in to play, you must know what this field looks like and what makes it move." /></p>

          <div className="sechead"><span className="n">01</span><h2><T th="XAUUSD คืออะไร" en="What is XAUUSD?" /></h2></div>
          <p><T th={<>มันอ่านง่ายกว่าที่คิด แยกออกเป็นสองส่วน: <b>XAU</b> คือสัญลักษณ์ของทองคำ ส่วน <b>USD</b> คือดอลลาร์สหรัฐ รวมกันแล้ว XAUUSD ก็คือ “ราคาทองคำ 1 ออนซ์ คิดเป็นกี่ดอลลาร์” เท่านั้นเอง</>} en={<>It's easier to read than you think. Break it into two parts: <b>XAU</b> is the symbol for Gold, and <b>USD</b> is the US Dollar. Together, XAUUSD simply means 'the price of 1 ounce of gold in dollars.'</>} /></p>
          <p><T th={<>แต่มีจุดสำคัญที่มือใหม่มักเข้าใจผิด: เวลาคุณเทรด XAUUSD คุณ <b>ไม่ได้</b> ซื้อทองแท่งมาเก็บไว้ที่บ้าน คุณกำลังเทรด “ส่วนต่างของราคา” ผ่านสิ่งที่เรียกว่า <b>CFD</b> (Contract for Difference) — สัญญาที่ให้คุณได้กำไรหรือขาดทุนจากการขึ้น-ลงของราคา โดยไม่ต้องถือทองจริง</>} en={<>But there is a key point beginners often misunderstand: when you trade XAUUSD, you are <b>not</b> buying physical gold bars to keep at home. You are trading 'price differences' through something called <b>CFD</b> (Contract for Difference) — a contract that allows you to profit or lose from the price's rise or fall without actually holding the physical gold.</>} /></p>
          <div className="pull"><T th="ข้อดีของมันคือ คุณทำเงินได้ทั้งตอนทองขึ้นและทองลง — ทองขึ้นคุณกำไรถ้าเปิด Buy, ทองลงคุณกำไรถ้าเปิด Sell" en="The advantage is that you can make money both when gold goes up and when it goes down — if gold goes up, you profit by opening a Buy; if gold goes down, you profit by opening a Sell." /></div>
          <p><T th={<><b>ข้อต้องระวัง:</b> เพราะมันเป็น CFD และมากับสิ่งที่เรียกว่า leverage (เราจะเรียนละเอียดในบทที่ 4) มันจึงขยายทั้งกำไร <b>และ</b> ขาดทุนให้ใหญ่ขึ้น — นี่คือเหตุผลที่เราจะเริ่มต้นกันบนบัญชีเดโมเสมอ</>} en={<><b>Caution:</b> Because it is a CFD and comes with something called leverage (we will study this in detail in Chapter 4), it magnifies both profits <b>and</b> losses. This is why we will always start on a demo account.</>} /></p>

          <div className="sechead"><span className="n">02</span><h2><T th="ทำไมต้องเป็นทอง" en="Why Gold?" /></h2></div>
          <p><T th="ในตลาดมีของให้เทรดเป็นร้อยเป็นพัน ทำไมผมถึงเลือกโฟกัสที่ทองคำ และทำไมผมแนะนำให้คุณเริ่มที่นี่? มีเหตุผลไม่กี่ข้อ แต่หนักแน่น:" en="There are thousands of things to trade in the market. Why do I choose to focus on Gold, and why do I recommend you start here? There are a few reasons, but they are solid:" /></p>
          <ul className="clean">
            <li><T th={<><b>สภาพคล่องสูงมาก</b> — ทองเป็นสินทรัพย์ที่คนทั้งโลกรู้จักและให้คุณค่ามานับพันปี มีคนซื้อขายตลอดเวลา เข้า-ออกออเดอร์ได้ลื่น</>} en={<><b>Extremely High Liquidity</b> — Gold is an asset known and valued by the whole world for millennia. People buy and sell it all the time, making entries and exits very smooth.</>} /></li>
            <li><T th={<><b>มันมี “คาแรกเตอร์”</b> — ทองเคลื่อนไหวเป็นรอบ มีจังหวะ มีพฤติกรรมที่พอจะอ่านได้ ทำให้เป็นสนามฝึก “อ่านพฤติกรรมราคา” ที่ดี</>} en={<><b>It Has 'Character'</b> — Gold moves in cycles, has rhythm, and readable behavior, making it a great training ground for 'reading price action'.</>} /></li>
            <li><T th={<><b>ผันผวนพอให้มีโอกาส</b> — แต่ความผันผวนคือดาบสองคม มันเหมาะกับคนที่มีวินัย ไม่เหมาะกับคนใจร้อน</>} en={<><b>Volatile Enough for Opportunities</b> — But volatility is a double-edged sword. It suits disciplined people, not the impatient.</>} /></li>
          </ul>
          <p><T th={<>และเหตุผลส่วนตัวของผม: <b>รู้ลึกหนึ่งสนาม ดีกว่ารู้ตื้นสิบสนาม</b> การโฟกัสที่ทองอย่างเดียว ทำให้ผมเข้าใจมันลึกจนรู้ว่าเมื่อไหร่ควรเข้า เมื่อไหร่ควรอยู่เฉย ๆ — และนั่นคือสิ่งที่ผมอยากให้คุณได้เช่นกัน</>} en={<>And my personal reason: <b>Knowing one field deeply is better than knowing ten fields shallowly.</b> Focusing solely on Gold gave me deep enough understanding to know when to enter and when to do nothing — and that is what I want for you as well.</>} /></p>

          <div className="sechead"><span className="n">03</span><h2><T th="อะไรขับราคาทองให้วิ่ง" en="What Drives Gold Prices?" /></h2></div>
          <p><T th="ทองไม่ได้ขึ้นลงเพราะดวง มันตอบสนองต่อแรงในโลกจริง สำหรับมือใหม่ ขอให้จำ 3 แรงหลักนี้ก่อน:" en="Gold doesn't go up and down by chance. It responds to forces in the real world. For beginners, please remember these 3 main forces first:" /></p>

          <div className="drivers">
            <div className="driver">
              <div className="dk"><T th="01 · USD — ค่าเงินดอลลาร์" en="01 · USD — US Dollar" /></div>
              <div className="dv"><T th={<>ดอลลาร์แข็งค่า <span className="up">↑</span>&nbsp; มักทำให้ &nbsp;ทอง <span className="down">↓</span></>} en={<>Dollar Strengthens <span className="up">↑</span>&nbsp; Often makes &nbsp;Gold <span className="down">↓</span></>} /></div>
              <div className="dnote"><T th="ความสัมพันธ์แบบผกผัน (เพราะทองตั้งราคาเป็นดอลลาร์)" en="Inverse relationship (because Gold is priced in Dollars)" /></div>
            </div>
            <div className="driver">
              <div className="dk"><T th="02 · RATES — อัตราดอกเบี้ย" en="02 · RATES — Interest Rates" /></div>
              <div className="dv"><T th={<>ดอกเบี้ยปรับขึ้น <span className="up">↑</span>&nbsp; มักกดดัน &nbsp;ทอง <span className="down">↓</span></>} en={<>Rates Go Up <span className="up">↑</span>&nbsp; Often pressures &nbsp;Gold <span className="down">↓</span></>} /></div>
              <div className="dnote"><T th="เพราะทองไม่มีดอกเบี้ย พอที่อื่นให้ผลตอบแทนสูง ทองจึงน่าถือน้อยลง" en="Because Gold yields no interest. When other things offer high yields, Gold becomes less attractive." /></div>
            </div>
            <div className="driver">
              <div className="dk"><T th="03 · FEAR — ความกลัว / safe-haven" en="03 · FEAR — Safe-haven Demand" /></div>
              <div className="dv"><T th={<>โลกยิ่งไม่แน่นอน <span className="up">↑</span>&nbsp; ทองยิ่งน่าถือ &nbsp;<span className="up">↑</span></>} en={<>World is Uncertain <span className="up">↑</span>&nbsp; Gold is more attractive &nbsp;<span className="up">↑</span></>} /></div>
              <div className="dnote"><T th="ยามวิกฤต-สงคราม-เศรษฐกิจสั่นคลอน คนวิ่งเข้าหาทองเป็น “ที่หลบภัย”" en="During crises, wars, economic instability, people flock to Gold as a 'safe haven'." /></div>
            </div>
          </div>

          <p><T th={<><b>ข้อต้องระวังที่สำคัญที่สุดของบทนี้:</b> ความสัมพันธ์ทั้ง 3 นี้เป็น “แนวโน้มทั่วไป” ไม่ใช่กฎตายตัว 100% บางครั้งมันสวนทางกันได้ อย่าเทรดจากเหตุผลมาโครเพียงอย่างเดียวเด็ดขาด</>} en={<><b>The most important caution of this chapter:</b> These 3 relationships are 'general tendencies', not 100% hard rules. Sometimes they diverge. Never trade solely based on macro reasons.</>} /></p>
          <div className="pull"><T th="เราใช้ปัจจัยพวกนี้เป็น “บริบท” เพื่อรู้ว่าตลาดมีแนวโน้มเอนไปทางไหน — ไม่ใช่ใช้เป็นสัญญาณเข้าเทรด" en="We use these factors as 'context' to know which way the market is leaning — not as an entry signal." /></div>

          <div className="sechead"><span className="n">04</span><h2><T th="เวลาตลาด — ทองตื่นตอนไหน" en="Market Hours — When Does Gold Wake Up?" /></h2></div>
          <p><T th={<>ตลาดทอง/ฟอเร็กซ์เปิดเกือบ 24 ชั่วโมง วันจันทร์ถึงศุกร์ แต่ความจริงที่มือใหม่ต้องรู้คือ <b>ไม่ใช่ทุกชั่วโมงเท่ากัน</b> บางช่วงเงียบจนแทบไม่ขยับ บางช่วงวิ่งแรงจนน่าตกใจ แบ่งคร่าว ๆ เป็น 3 ช่วง (เวลาไทยโดยประมาณ):</>} en={<>The Gold/Forex market is open almost 24 hours from Monday to Friday. But the truth beginners must know is that <b>not all hours are equal.</b> Some hours are dead silent, while others move shockingly fast. Roughly divided into 3 sessions (estimated Thai time):</>} /></p>

          <div className="sessions">
            <div className="ses">
              <div className="sk">Asian</div>
              <div>
                <div className="strack"><span className="sfill" style={{ width: "34%", background: "#b8b6ae" }}></span></div>
                <div className="st"><T th="06:00–15:00 น. · เงียบ เคลื่อนไหวน้อย" en="06:00–15:00 · Quiet, little movement" /></div>
              </div>
            </div>
            <div className="ses">
              <div className="sk">London</div>
              <div>
                <div className="strack"><span className="sfill" style={{ width: "70%", background: "#6f6d66" }}></span></div>
                <div className="st"><T th="14:00–23:00 น. · เริ่มมีพลัง วอลุ่มเข้า" en="14:00–23:00 · Gaining energy, volume enters" /></div>
              </div>
            </div>
            <div className="ses">
              <div className="sk">New York</div>
              <div>
                <div className="strack"><span className="sfill" style={{ width: "92%", background: "#272727" }}></span></div>
                <div className="st"><T th="19:00–04:00 น. · แรงที่สุด + ข่าวสหรัฐออก" en="19:00–04:00 · Strongest + US News release" /></div>
              </div>
            </div>
          </div>

          <div className="ses-note"><T th={<>ช่วงที่ <b>London กับ New York ทับกัน</b> (ราว 19:00–23:00 น. เวลาไทย) คือเวลาที่ทองเคลื่อนไหวแรงและมีโอกาสดีที่สุด — ถ้าคุณมีเวลาจำกัด ให้โฟกัสช่วงนี้</>} en={<>The period when <b>London and New York overlap</b> (around 19:00–23:00 Thai time) is when Gold moves the strongest and offers the best opportunities. If you have limited time, focus on this window.</>} /></div>

          <p><T th={<><b>ข้อต้องระวัง:</b> ข่าวเศรษฐกิจแรง ๆ ของสหรัฐ (เช่น ตัวเลขการจ้างงาน หรือการประกาศดอกเบี้ยของ Fed) ทำให้ทองวิ่งเร็วและกระชากแรงผิดปกติ ตอนเป็นมือใหม่ ผมแนะนำให้ <b>หลีกเลี่ยงการเทรดช่วงข่าว</b> ไปก่อน จนกว่าคุณจะมีประสบการณ์มากพอ</>} en={<><b>Caution:</b> Major US economic news (like employment data or Fed interest rate announcements) causes Gold to move unusually fast and violently. As a beginner, I recommend you <b>avoid trading during news</b> until you have gained enough experience.</>} /></p>

          <div className="note">
            <div className="nlabel"><T th="CERFINITS NOTE — บันทึกจากกัน" en="CERFINITS NOTE — A Word from Us" /></div>
            <p><T th={<>ตอนผมเริ่มใหม่ ๆ ผมเทรดทุกเวลาที่ว่าง ไม่สนว่าตลาดจะตื่นหรือหลับ ผลคือผมไปเจอช่วงที่ทองนิ่ง ๆ แล้วเบื่อจนเผลอเข้าไม้มั่ว เสียเงินไปกับความเบื่อล้วน ๆ — พอผมเลือกเทรดเฉพาะช่วงที่ตลาดมีพลังจริง ๆ ทุกอย่างก็ง่ายขึ้นเยอะ <b>เลือกเวลาที่ใช่ สำคัญพอ ๆ กับเลือกจุดที่ใช่</b></>} en={<>When I first started, I traded whenever I had free time, regardless of whether the market was awake or asleep. As a result, I traded during dead hours, got bored, and mistakenly entered random trades. I lost money purely from boredom. Once I chose to trade only when the market actually had energy, everything became much easier. <b>Choosing the right time is just as important as choosing the right entry point.</b></>} /></p>
          </div>

          <div className="summary">
            <div className="slabel"><T th="สรุปให้จำง่าย" en="Summary" /></div>
            <ul>
              <li><T th="XAUUSD = ราคาทอง 1 ออนซ์เป็นดอลลาร์ เทรดผ่าน CFD ทำเงินได้ทั้งขาขึ้น-ขาลง" en="XAUUSD = Price of 1 oz of gold in dollars. Traded via CFD, you can profit both up and down." /></li>
              <li><T th="เลือกทองเพราะสภาพคล่องสูง มีคาแรกเตอร์ และเหมาะกับคนมีวินัย — รู้ลึกหนึ่งสนามดีกว่ารู้ตื้นสิบสนาม" en="Choose gold because of high liquidity, clear character, and it suits disciplined people. Deep knowledge of one field > shallow knowledge of ten." /></li>
              <li><T th="3 แรงขับหลัก: ดอลลาร์ (ผกผัน), ดอกเบี้ย (ผกผัน), ความกลัว/safe-haven (หนุน)" en="3 main drivers: Dollar (Inverse), Rates (Inverse), Fear/Safe-haven (Supportive)." /></li>
              <li><T th="ใช้ปัจจัยมาโครเป็น “บริบท” ไม่ใช่สัญญาณเข้าเทรด" en="Use macro factors as 'context', not as entry signals." /></li>
              <li><T th="ทองแรงสุดช่วง London–NY (เย็น-ค่ำเวลาไทย) · เลี่ยงเทรดช่วงข่าวตอนเป็นมือใหม่" en="Gold is strongest during London-NY (Evening Thai time). Avoid news trading as a beginner." /></li>
            </ul>
          </div>

          <div className="checklist">
            <div className="clabel"><T th="เช็กลิสต์ท้ายบท — ติ๊กให้ครบก่อนไปบทต่อไป" en="End of Chapter Checklist — Check all before proceeding" /></div>
            <ul>
              <li><T th="ผมเข้าใจว่า XAUUSD คืออะไร และเทรดได้ทั้งขาขึ้น-ขาลง" en="I understand what XAUUSD is and that it can be traded in both directions." /></li>
              <li><T th="ผมรู้แล้วว่า 3 แรงหลักที่ขับราคาทองคืออะไร" en="I know the 3 main forces driving Gold prices." /></li>
              <li><T th="ผมจะใช้ปัจจัยมาโครเป็น “บริบท” ไม่ใช่สัญญาณเข้าเทรด" en="I will use macro factors as 'context', not entry signals." /></li>
              <li><T th="ผมรู้ว่าช่วงเวลาไหนที่ทองแรง และจะเลี่ยงช่วงข่าวตอนเป็นมือใหม่" en="I know when Gold is strongest and will avoid news trading as a beginner." /></li>
            </ul>
          </div>

          <div className="next">
            <div className="nx"><T th="บทต่อไป — บทที่ 03" en="Next Chapter — Chapter 03" /></div>
            <p><T th={<>เราจะลงมือจริงเป็นครั้งแรก: เปิด <b>“บัญชีเดโม”</b> กับโบรกเกอร์ทีละขั้น และพาทัวร์หน้าจอแพลตฟอร์ม เพื่อให้คุณพร้อมก่อนแตะออเดอร์แรกของชีวิต — โดยยังไม่เสี่ยงเงินจริงแม้แต่บาทเดียว</>} en={<>We will take real action for the first time: Opening a <b>"Demo Account"</b> with a broker step-by-step, and taking a tour of the platform interface. This will get you ready before touching your life's first order — without risking a single real dime yet.</>} /></p>
          </div>

        </div>

        <div className="wrap bookfoot">
          <span>CERFINITS — GOLD START</span>
          <span><T th="บทที่ 02 · ทองคำ (XAUUSD)" en="Chapter 02 · Gold (XAUUSD)" /></span>
        </div>

        <div className="wrap disclaimer">
          <T th="เอกสารนี้จัดทำขึ้นเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง ผู้ลงทุนอาจสูญเสียเงินทุนทั้งหมด · โปรดตัดสินใจบนความเข้าใจและความเสี่ยงที่คุณรับได้" en="This document is for educational purposes only, not investment advice. Trading carries high risk; investors may lose all capital. Please make decisions based on your understanding and risk tolerance." />
        </div>

      </div>
    </>
  );
}
