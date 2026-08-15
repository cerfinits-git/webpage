import ArticleShell, { articleMetadata } from "@/components/site/ArticleShell";
import { getPost } from "@/lib/posts";
import { T } from "@/components/site/LangContext";

const post = getPost("trading-psychology-discipline")!;

export const metadata = articleMetadata(post);

export default function Page() {
  return (
    <ArticleShell
      post={post}
      cta={{
        title: "The Lion's Heart — Psychology of Trader",
        text: <T th="จิตวิทยาการเทรดที่ตกตะกอนจากความเจ็บปวดจริงในตลาด 4 ภาค 15 บท — หรือสมัครรับบทความใหม่ฟรีทางอีเมลด้านล่าง" en="Trading psychology crystalized from real pain in the market, 4 parts, 15 chapters — or subscribe below for new free articles." />,
        related: (
          <>
            📘{" "}
            <a href="https://narabodin.gumroad.com/l/ttxhcq" target="_blank" rel="noopener">
              <T th="ดูอีบุ๊ก “The Lion's Heart” บน Gumroad ($5)" en="View the e-book 'The Lion's Heart' on Gumroad ($5)" />
            </a>
          </>
        ),
      }}
    >
      <p>
        <T 
          th={<>เทรดเดอร์ส่วนใหญ่ไม่ได้แพ้เพราะระบบไม่ดี แต่แพ้เพราะ <strong>ทำตามระบบตัวเองไม่ได้</strong> ภายใต้แรงกดดัน นี่คือเหตุผลที่บอกกันว่า “ระบบคือ 20% แต่จิตใจคือ 80%” บทความนี้รวม 5 กับดักทางใจที่เจอบ่อยที่สุด พร้อมวิธีรับมือที่ทำได้จริง</>} 
          en={<>Most traders don't fail because of a bad system, but because they <strong>cannot follow their own system</strong> under pressure. This is why it's said that "System is 20%, Mindset is 80%". This article compiles the 5 most common psychological traps along with actionable ways to handle them.</>} 
        />
      </p>

      <h2><T th="1. FOMO — กลัวตกรถ" en="1. FOMO — Fear of Missing Out" /></h2>
      <p>
        <T th="เห็นราคาวิ่งแรงแล้วกระโดดเข้าไม่ดูแผน สุดท้ายเข้าที่ยอดดอย กับดักนี้เกิดจากการมองว่า “โอกาสมีจำกัด” ทั้งที่จริงตลาดเปิดทุกวัน" en="Seeing the price surge and jumping in without checking the plan, only to enter at the very peak. This trap stems from thinking 'opportunities are scarce,' even though the market opens every day." />
      </p>
      <p>
        <T th={<><strong>วิธีแก้:</strong> เขียนเงื่อนไขเข้าออเดอร์ไว้ล่วงหน้า ถ้าราคาวิ่งไปแล้วไม่ตรงเงื่อนไข = ปล่อยไป ไม้ที่ดีที่สุดคือไม้ที่คุณ “รอ” ได้</>} en={<><strong>Solution:</strong> Write down your entry conditions in advance. If the price runs but doesn't meet the conditions = let it go. The best trade is the one you can 'wait' for.</>} />
      </p>

      <h2><T th="2. Revenge Trade — เทรดเอาคืน" en="2. Revenge Trade — Getting Even" /></h2>
      <p>
        <T th="หลังขาดทุน สมองเข้าโหมด “ต้องได้คืนเดี๋ยวนี้” เลยเปิดไม้ใหญ่ขึ้น เร็วขึ้น และมักเจ็บหนักกว่าเดิม นี่คือกับดักที่ทำพอร์ตแตกเร็วที่สุด" en="After a loss, the brain goes into 'must get it back now' mode, leading to opening larger, faster trades, and usually getting hurt worse. This is the trap that blows accounts the fastest." />
      </p>
      <p>
        <T th={<><strong>วิธีแก้:</strong> ตั้งกฎ “หยุดเมื่อแพ้ติดกัน X ไม้ หรือขาดทุนถึง Y% ต่อวัน” แล้วปิดจอ การไม่เทรดก็เป็นการตัดสินใจที่ดีได้</>} en={<><strong>Solution:</strong> Set a rule to "Stop after losing X trades in a row, or reaching Y% loss per day" and turn off the screen. Not trading can also be a great decision.</>} />
      </p>

      <h2><T th="3. Overtrading — เทรดมากเกินไป" en="3. Overtrading — Trading Too Much" /></h2>
      <p>
        <T th="ความเบื่อหรือความอยากรู้สึก “กำลังทำอะไรอยู่” ทำให้เปิดไม้ที่ไม่มี edge จริง ยิ่งเทรดถี่ ยิ่งจ่ายค่าสเปรด/ค่าธรรมเนียมและยิ่งเปิดโอกาสให้อารมณ์เข้ามา" en="Boredom or the desire to feel like you're 'doing something' leads to opening trades with no real edge. The more frequently you trade, the more spread/fees you pay, and the more you allow emotions to enter." />
      </p>
      <p>
        <T th={<><strong>วิธีแก้:</strong> จำกัดจำนวนไม้ต่อวัน (เช่น สูงสุด 3 ไม้) คุณภาพสำคัญกว่าปริมาณเสมอ</>} en={<><strong>Solution:</strong> Limit your number of trades per day (e.g., max 3 trades). Quality is always more important than quantity.</>} />
      </p>

      <h2><T th="4. ขยับ Stop Loss / ถอด SL" en="4. Moving Stop Loss / Removing SL" /></h2>
      <p>
        <T th="เมื่อราคาเข้าใกล้ SL ใจเริ่มต่อรอง “ขออีกนิด เดี๋ยวมันกลับ” การถอดหรือเลื่อน SL หนีคือการเปลี่ยนการขาดทุนเล็กให้กลายเป็นหายนะ" en="When the price approaches the SL, the mind starts bargaining: 'Just a bit more, it will reverse.' Removing or moving the SL away turns a small loss into a disaster." />
      </p>
      <p>
        <T th={<><strong>วิธีแก้:</strong> มองว่า SL = ค่าใช้จ่ายในการทำธุรกิจ ตั้งแล้ว <em>ห้ามแตะ</em> ถ้าตั้ง SL แล้วเสียวเกินไป แปลว่าไม้ใหญ่เกินตัว — ลดขนาดไม้</>} en={<><strong>Solution:</strong> View the SL as a business expense. Once set, <em>do not touch it.</em> If setting the SL makes you too anxious, it means your position is too large — reduce the size.</>} />
      </p>

      <h2><T th="5. ยึดติดกับไม้เดียว (Attachment)" en="5. Attachment to a Single Trade" /></h2>
      <p>
        <T th="เผลอผูกอีโก้กับการ “ถูก” มากกว่าการ “ทำกำไร” เลยถือไม้ที่ผิดทางไว้นานเกินไป เพราะไม่อยากยอมรับว่าคิดพลาด" en="Accidentally tying your ego to being 'right' rather than being 'profitable', so you hold onto a losing trade too long because you don't want to admit you were wrong." />
      </p>
      <p>
        <T th={<><strong>วิธีแก้:</strong> ทุกไม้คือความน่าจะเป็น ไม่ใช่คำพิพากษาว่าคุณเก่งหรือไม่ ยอมผิดเร็ว = อยู่รอดนาน</>} en={<><strong>Solution:</strong> Every trade is a probability, not a judgment of your skill. Admitting you're wrong quickly = surviving longer.</>} />
      </p>

      <blockquote><T th="“ตลาดไม่ได้จ่ายเงินให้คนที่ถูก แต่จ่ายให้คนที่มีวินัย”" en="'The market doesn't pay people who are right; it pays people who are disciplined.'" /></blockquote>

      <h2><T th="สร้างวินัยให้เป็นระบบ ไม่ใช่ใช้ใจล้วน" en="Build Discipline as a System, Not Just Willpower" /></h2>
      <p><T th="วินัยไม่ใช่การ “พยายามให้มากขึ้น” แต่คือการออกแบบสภาพแวดล้อมให้ทำผิดได้ยาก:" en="Discipline isn't about 'trying harder', it's about designing an environment where making mistakes is difficult:" /></p>
      <ul>
        <li>
          <T th={<><strong>มี trading plan เป็นลายลักษณ์อักษร</strong> — เงื่อนไขเข้า/ออก/ความเสี่ยงต่อไม้ ชัดเจนก่อนตลาดเปิด</>} en={<><strong>Have a written trading plan</strong> — Entry/exit conditions and risk per trade must be clear before the market opens.</>} />
        </li>
        <li>
          <T th={<><strong>จด trading journal</strong> — บันทึกเหตุผลและอารมณ์ทุกไม้ เพื่อเห็นแพทเทิร์นของตัวเอง</>} en={<><strong>Keep a trading journal</strong> — Record the reasons and emotions for every trade to spot your own patterns.</>} />
        </li>
        <li>
          <T th={<><strong>ให้กฎบังคับแทนใจ</strong> — เช่น ใช้ EA หรือ checklist ที่ตัดอารมณ์ออกจากสมการ</>} en={<><strong>Let rules enforce behavior instead of feelings</strong> — e.g., use an EA or a checklist to remove emotions from the equation.</>} />
        </li>
        <li>
          <T th={<><strong>fix risk ต่อไม้</strong> — เสี่ยงเท่ากันทุกไม้ (เช่น 1%) เพื่อไม่ให้ไม้เดียวล้มทั้งพอร์ต</>} en={<><strong>Fix risk per trade</strong> — Risk the exact same amount every trade (e.g., 1%) so one trade doesn't blow the account.</>} />
        </li>
      </ul>

      <div className="callout">
        <h3><T th="สรุปสั้น" en="TL;DR" /></h3>
        <ul>
          <li><T th="5 กับดัก: FOMO, Revenge trade, Overtrading, ขยับ SL, ยึดติดไม้เดียว" en="5 Traps: FOMO, Revenge Trade, Overtrading, Moving SL, Attachment" /></li>
          <li><T th="วินัยมาจากระบบและสภาพแวดล้อม ไม่ใช่ความตั้งใจล้วน" en="Discipline comes from systems and environments, not pure willpower." /></li>
          <li><T th="เครื่องมือสำคัญ: trading plan, journal, fixed risk, กฎที่บังคับแทนใจ" en="Key tools: trading plan, journal, fixed risk, rules enforcing behavior." /></li>
        </ul>
      </div>
    </ArticleShell>
  );
}
