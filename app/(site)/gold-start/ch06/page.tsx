import type { Metadata } from "next";
import { T } from "@/components/site/LangContext";

// Generated from gold-start-ch06.html by scripts/convert-gold-start.mjs — edit freely,
// but re-running the script will overwrite this file.
export const metadata: Metadata = {
  title: "GOLD START — บทที่ 06 · Risk Management บทที่สำคัญที่สุด · Cerfinits",
  description: "ถ้าคุณอ่านทั้งเล่มแล้วจำได้แค่บทเดียว ขอให้เป็นบทนี้ เพราะนี่คือวิชาที่ทำให้คุณ “อยู่รอด” ในตลาดได้นานพอที่จะเก่งขึ้น — และมันคือหัวใจของคำสัญญา “ไม่ล้างพอร์ต”",
  alternates: { canonical: "/gold-start/ch06" },
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
          <span className="kicker"><T th="ภาค 3 — อ่านเกมให้เป็น" en="Part 3 — Learning to Read the Game" /></span>
          <div className="chno"><T th="บทที่ / 06" en="Chapter / 06" /></div>
          <h1>Risk Management<br /><T th="บทที่สำคัญที่สุด" en="the Most Important Chapter" /></h1>
          <p className="lead"><T th={<>ถ้าคุณอ่านทั้งเล่มแล้วจำได้แค่บทเดียว ขอให้เป็นบทนี้ เพราะนี่คือวิชาที่ทำให้คุณ "อยู่รอด" ในตลาดได้นานพอที่จะเก่งขึ้น — และมันคือหัวใจของคำสัญญา "ไม่ล้างพอร์ต"</>} en={<>If you read this whole book and remember only one chapter, let it be this one. This is the subject that lets you "survive" in the market long enough to get good — and it's the heart of the promise of "never blowing up your account."</>} /></p>
        </div>

        <div className="wrap content">

          <p className="intro"><T th={<>มือใหม่ถามว่า "เข้าตรงไหนดี" เทรดเดอร์มืออาชีพถามว่า "ถ้าผิดจะเสียเท่าไหร่" — ความแตกต่างเล็ก ๆ นี้ คือเส้นแบ่งระหว่างคนที่อยู่รอดกับคนที่หายไปจากตลาด</>} en={<>Beginners ask "where's a good entry?" Professional traders ask "if I'm wrong, how much do I lose?" This small difference is the line between those who survive and those who disappear from the market.</>} /></p>

          <div className="sechead"><span className="n">01</span><h2><T th="ทำไม Risk ต้องมาก่อน Entry" en="Why Risk Must Come Before Entry" /></h2></div>
          <p><T th={<>เพราะคุณควบคุมกำไรไม่ได้ แต่คุณควบคุม "ขาดทุน" ได้ ตลาดจะให้กำไรเท่าไหร่ไม่มีใครรู้ แต่คุณเลือกได้เองว่าแต่ละไม้จะเสี่ยงเท่าไหร่ นั่นคือสิ่งเดียวบนกราฟที่อยู่ในมือคุณ 100%</>} en={<>Because you can't control profit, but you can control "loss". Nobody knows how much profit the market will give, but you get to choose how much you risk on each trade — that's the one thing on the chart that's 100% in your hands.</>} /></p>
          <div className="pull"><T th={<>เป้าหมายแรกของเทรดเดอร์ไม่ใช่ "ทำกำไร" แต่คือ "ไม่ตาย" — เพราะตราบใดที่พอร์ตยังอยู่ คุณยังมีโอกาสเสมอ</>} en={<>A trader's first goal isn't "making profit" — it's "not dying". Because as long as your account is still alive, you always still have a chance.</>} /></div>

          <div className="sechead"><span className="n">02</span><h2><T th="เสี่ยงกี่ % ต่อไม้ + คำนวณ Lot" en="How Much % to Risk Per Trade + Calculating Lot" /></h2></div>
          <p><T th={<>กฎเหล็กของมือใหม่: <b>เสี่ยงไม่เกิน 1–2% ของพอร์ตต่อหนึ่งไม้</b> เท่านั้น ฟังดูน้อย แต่นี่แหละคือเกราะที่ทำให้คุณทนทานต่อการขาดทุนติดกันได้ มาดูวิธีแปลง "2%" เป็น "ขนาด lot" จริง ๆ กัน:</>} en={<>The iron rule for beginners: <b>risk no more than 1–2% of your account per trade</b>, period. Sounds small, but this is the armor that lets you withstand a losing streak. Let's see how to convert "2%" into an actual "lot size":</>} /></p>

          <div className="steps">
            <div className="step"><div className="snum">1</div><div><div className="sb-title"><T th="หาเงินที่ยอมเสี่ยงต่อไม้" en="Find the money you're willing to risk per trade" /></div><div className="sb-text"><T th={<>ทุน $1,000 × 2% = <b>$20</b> ต่อไม้ (เกินกว่านี้ไม่ได้)</>} en={<>$1,000 capital × 2% = <b>$20</b> per trade (never more than this)</>} /></div></div></div>
            <div className="step"><div className="snum">2</div><div><div className="sb-title"><T th="วัดระยะ Stop Loss" en="Measure the Stop Loss distance" /></div><div className="sb-text"><T th={<>เข้าที่ 3,420 ตั้ง SL ที่ 3,415 → ระยะ SL = <b>$5</b></>} en={<>Enter at 3,420, set SL at 3,415 → SL distance = <b>$5</b></>} /></div></div></div>
            <div className="step"><div className="snum">3</div><div><div className="sb-title"><T th="คำนวณ lot" en="Calculate the lot" /></div><div className="sb-text"><T th="0.01 lot เสีย $1 ทุกการขยับ $1 → โดน SL $5 = เสีย $5 ต่อ 0.01 lot" en="0.01 lot loses $1 for every $1 move → hitting a $5 SL = losing $5 per 0.01 lot" /></div></div></div>
            <div className="step"><div className="snum">4</div><div><div className="sb-title"><T th="ได้ขนาดไม้ที่ปลอดภัย" en="Get the safe position size" /></div><div className="sb-text"><T th={<>$20 ÷ $5 = <b>0.04 lot</b> → ถ้าโดน SL เสีย $20 พอดี (2% ตามแผน ไม่มากกว่านั้น)</>} en={<>$20 ÷ $5 = <b>0.04 lot</b> → if SL is hit, you lose exactly $20 (2% as planned, no more)</>} /></div></div></div>
          </div>
          <p><T th="เห็นไหมว่าเราไม่ได้ “เดา” ขนาดไม้ เราคำนวณมันจากความเสี่ยงที่ยอมรับได้ก่อนเสมอ นี่คือความแตกต่างระหว่างการลงทุนอย่างมีระบบ กับการพนัน" en="Notice we didn't 'guess' the position size — we always calculate it from the acceptable risk first. This is the difference between systematic investing and gambling." /></p>

          <div className="sechead"><span className="n">03</span><h2><T th="เลขคณิตของการอยู่รอด" en="The Arithmetic of Survival" /></h2></div>
          <p><T th={<>ทำไม 2% ถึงสำคัญขนาดนั้น? ดูสิ่งที่เกิดขึ้นเมื่อคุณ "ขาดทุนติดกัน" (ซึ่งเกิดขึ้นกับทุกคน แม้แต่มือโปร) เทียบระหว่างคนเสี่ยง 2% กับคนเสี่ยง 10% ต่อไม้ จากทุนเริ่มต้น $1,000:</>} en={<>Why does 2% matter so much? Watch what happens when you hit a "losing streak" (which happens to everyone, even pros). Compare someone risking 2% vs. someone risking 10% per trade, starting from $1,000:</>} /></p>

          <table className="dtable">
            <thead><tr><th><T th="ขาดทุนติดกัน" en="Consecutive Losses" /></th><th><T th="เสี่ยง 2%/ไม้ · พอร์ตเหลือ" en="Risk 2%/trade · Balance Left" /></th><th><T th="เสี่ยง 10%/ไม้ · พอร์ตเหลือ" en="Risk 10%/trade · Balance Left" /></th></tr></thead>
            <tbody>
              <tr><td><T th="1 ไม้" en="1 trade" /></td><td className="good mono">$980</td><td className="mono">$900</td></tr>
              <tr><td><T th="3 ไม้" en="3 trades" /></td><td className="good mono">$941</td><td className="mono">$729</td></tr>
              <tr><td><T th="5 ไม้" en="5 trades" /></td><td className="good mono">$904</td><td className="bad mono">$590</td></tr>
              <tr><td><T th="10 ไม้" en="10 trades" /></td><td className="good mono">$817</td><td className="bad mono">$349</td></tr>
            </tbody>
          </table>
          <p><T th="คนเสี่ยง 2% เจอขาดทุน 10 ไม้ติด ยังเหลือ $817 — ยังเล่นต่อได้สบาย ส่วนคนเสี่ยง 10% เหลือแค่ $349 และที่แย่กว่านั้นคือ ยิ่งพอร์ตหด การกู้คืนยิ่งยากแบบทวีคูณ:" en="Someone risking 2% who hits 10 losses in a row still has $817 left — plenty to keep playing. Someone risking 10% is down to just $349. And what's worse: the more a balance shrinks, the exponentially harder it is to recover:" /></p>

          <table className="dtable">
            <thead><tr><th><T th="พอร์ตขาดทุนไป" en="Balance Lost" /></th><th><T th="ต้องทำกำไรกลับเท่าไหร่ถึงเท่าทุนเดิม" en="Profit Needed to Break Even" /></th></tr></thead>
            <tbody>
              <tr><td className="mono">−10%</td><td className="mono">+11%</td></tr>
              <tr><td className="mono">−25%</td><td className="mono">+33%</td></tr>
              <tr><td className="bad mono">−50%</td><td className="bad mono">+100%</td></tr>
              <tr><td className="bad mono">−90%</td><td className="bad mono">+900%</td></tr>
            </tbody>
          </table>
          <div className="pull"><T th="เสียครึ่งพอร์ต ไม่ได้แปลว่าทำกำไร 50% แล้วกลับมาเท่าทุน — คุณต้องทำกำไรถึง 100% นี่คือเหตุผลที่ “การไม่ขาดทุนหนัก” สำคัญกว่า “การทำกำไรเก่ง”" en="Losing half your account doesn't mean making 50% profit gets you back to even — you need 100% profit. This is why 'not taking a heavy loss' matters more than 'being great at making profit'." /></div>

          <div className="sechead"><span className="n">04</span><h2><T th="R:R — เสี่ยงน้อย เพื่อได้มาก" en="R:R — Risk Little to Gain a Lot" /></h2></div>
          <p><T th={<><b>Risk:Reward (R:R)</b> คืออัตราส่วนระหว่าง "สิ่งที่เสี่ยง" กับ "สิ่งที่จะได้" มือใหม่ควรมองหาไม้ที่ R:R อย่างน้อย <b>1:2</b> — เสี่ยง 1 ส่วน เพื่อโอกาสได้ 2 ส่วน:</>} en={<><b>Risk:Reward (R:R)</b> is the ratio between "what you risk" and "what you stand to gain." Beginners should look for trades with R:R of at least <b>1:2</b> — risk 1 part for a chance at 2 parts:</>} /></p>

          <div className="figure">
            <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" fontFamily="Geist Mono, monospace">
              <line x1="20" y1="60" x2="430" y2="60" stroke="#5a7d5a" strokeWidth="1.5" strokeDasharray="6 5"/>
              <line x1="20" y1="140" x2="430" y2="140" stroke="#272727" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="20" y1="180" x2="430" y2="180" stroke="#9d5a4f" strokeWidth="1.5" strokeDasharray="6 5"/>
              <polyline points="40,140 130,150 210,110 300,90 400,60" fill="none" stroke="#272727" strokeWidth="2"/>
              <text x="438" y="64" fontSize="12" fill="#5a7d5a">Take Profit — <T th="ได้ 2 ส่วน (2R)" en="gain 2 parts (2R)" /></text>
              <text x="438" y="144" fontSize="12" fill="#272727"><T th="จุดเข้า (Entry)" en="Entry Point" /></text>
              <text x="438" y="184" fontSize="12" fill="#9d5a4f">Stop Loss — <T th="เสี่ยง 1 ส่วน (1R)" en="risk 1 part (1R)" /></text>
              <text x="40" y="216" fontSize="12" fill="#6f6d66"><T th="อัตราส่วน R:R = 1 : 2" en="R:R ratio = 1 : 2" /></text>
            </svg>
            <div className="figcap"><T th="เสี่ยง $5 เพื่อโอกาสได้ $10 — นั่นคือ R:R 1:2" en="Risk $5 for a chance at $10 — that's R:R 1:2" /></div>
          </div>

          <p><T th={<>ความมหัศจรรย์ของ R:R ดี ๆ คือ <b>คุณถูกน้อยกว่าครึ่ง ก็ยังกำไรได้</b> ลองคิดดู: เทรด 10 ไม้ ถูกแค่ 4 ผิด 6 ที่ R:R 1:2 → ฝั่งได้ = 4 × 2R = +8R, ฝั่งเสีย = 6 × 1R = −6R สุทธิ <b>+2R</b> ทั้งที่ถูกแค่ 40%</>} en={<>The magic of a good R:R is that <b>you can be right less than half the time and still profit</b>. Consider: 10 trades, only 4 right and 6 wrong, at R:R 1:2 → wins = 4 × 2R = +8R, losses = 6 × 1R = −6R, net <b>+2R</b> despite being right only 40% of the time.</>} /></p>

          <div className="note">
            <div className="nlabel">CERFINITS NOTE — <T th="บันทึกจากกัน" en="A note from Kan" /></div>
            <p><T th={<>ปีแรก ๆ ผมโฟกัสผิดจุด — เอาแต่หา "ระบบที่ชนะบ่อยที่สุด" จนลืมไปว่าตัวเองเสี่ยงหนักทุกไม้ พอเจอขาดทุนรัว ๆ แค่ไม่กี่ครั้งก็หมดตัว วันที่ผมเปลี่ยนมาคุมความเสี่ยงให้คงที่ทุกไม้ ผลลัพธ์เปลี่ยนทันที <b>ผมหยุดพยายามไม่ขาดทุน แล้วหันมาควบคุมว่า "ถ้าขาดทุน จะเสียแค่ไหน" แทน</b></>} en={<>In my first years I focused on the wrong thing — hunting for the "system that wins most often" while forgetting I was risking heavily on every trade. A handful of losses in a row wiped me out. The day I switched to keeping risk constant on every trade, results changed immediately. <b>I stopped trying not to lose, and instead started controlling "if I lose, how much do I lose" instead.</b></>} /></p>
          </div>

          <div className="summary">
            <div className="slabel"><T th="สรุปให้จำง่าย" en="Easy-Recall Summary" /></div>
            <ul>
              <li><T th="คุมขาดทุนได้ แต่คุมกำไรไม่ได้ — Risk จึงต้องมาก่อน Entry" en="You can control loss but not profit — so Risk must come before Entry" /></li>
              <li><T th="เสี่ยงไม่เกิน 1–2% ต่อไม้ แล้วคำนวณ lot จากระยะ SL" en="Risk no more than 1–2% per trade, and calculate lot from the SL distance" /></li>
              <li><T th="เสี่ยงน้อยต่อไม้ = ทนขาดทุนติดกันได้นานกว่ามาก" en="Less risk per trade = surviving a losing streak for much longer" /></li>
              <li><T th="ขาดทุนหนักกู้คืนยากแบบทวีคูณ (เสีย 50% ต้องทำ +100%)" en="A heavy loss is exponentially hard to recover from (losing 50% needs +100% to recover)" /></li>
              <li><T th="R:R อย่างน้อย 1:2 → ถูกแค่ 40% ก็ยังกำไรได้" en="R:R of at least 1:2 → being right just 40% of the time still profits" /></li>
            </ul>
          </div>

          <div className="checklist">
            <div className="clabel"><T th="เช็กลิสต์ท้ายบท — ติ๊กให้ครบก่อนไปบทต่อไป" en="End-of-Chapter Checklist — Check all before moving on" /></div>
            <ul>
              <li><T th="ผมจะเสี่ยงไม่เกิน 1–2% ของพอร์ตต่อหนึ่งไม้" en="I will risk no more than 1–2% of my account per trade" /></li>
              <li><T th="ผมคำนวณขนาด lot จากระยะ SL ได้แล้ว" en="I can calculate lot size from the SL distance" /></li>
              <li><T th="ผมเข้าใจว่าการขาดทุนหนักกู้คืนยากแค่ไหน" en="I understand how hard a heavy loss is to recover from" /></li>
              <li><T th="ผมจะมองหาไม้ที่ R:R อย่างน้อย 1:2" en="I will look for trades with R:R of at least 1:2" /></li>
            </ul>
          </div>

          <div className="next">
            <div className="nx"><T th="บทต่อไป — บทที่ 07" en="Next Chapter — Chapter 07" /></div>
            <p><T th={<>ถึงเวลาประกอบทุกอย่างเข้าด้วยกัน: <b>กายวิภาคของออเดอร์ + เซ็ตอัพล้อจักรยาน</b> รูทีนง่าย ๆ ที่ปลอดภัยสำหรับลงไม้แรก พร้อมเช็กลิสต์ก่อนกดทุกครั้ง</>} en={<>Time to put it all together: <b>order anatomy + the training-wheels setup</b> — a simple, safe routine for your first trade, with a checklist before every press.</>} /></p>
          </div>

        </div>

        <div className="wrap bookfoot">
          <span>CERFINITS — GOLD START</span>
          <span><T th="บทที่ 06 · Risk Management" en="Chapter 06 · Risk Management" /></span>
        </div>

        <div className="wrap disclaimer">
          <T
            th="เอกสารนี้จัดทำขึ้นเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · การเทรดมีความเสี่ยงสูง ผู้ลงทุนอาจสูญเสียเงินทุนทั้งหมด · โปรดตัดสินใจบนความเข้าใจและความเสี่ยงที่คุณรับได้"
            en="This document is prepared for educational purposes only, not investment advice · Trading carries high risk and investors may lose their entire capital · Please decide based on your understanding and the risk you can bear"
          />
        </div>

      </div>
    </>
  );
}
