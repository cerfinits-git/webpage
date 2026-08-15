import ArticleShell, { articleMetadata } from "@/components/site/ArticleShell";
import { getPost } from "@/lib/posts";
import { T } from "@/components/site/LangContext";

const post = getPost("cot-gold-basics")!;

export const metadata = articleMetadata(post);

export default function Page() {
  return (
    <ArticleShell
      post={post}
      cta={{
        title: "อ่าน COT ให้เป็น แล้วใช้เทรดทองคำ",
        text: <T th="อยากลงลึกกว่านี้? อีบุ๊ก 58 หน้า 18 บท + 10 ภาคผนวก พาคุณจาก “ไม่เคยแตะ COT” สู่การวางระบบเทรดทองได้จริง — หรือสมัครรับบทความใหม่ฟรีทางอีเมลด้านล่าง" en="Want to dive deeper? A 58-page, 18-chapter e-book + 10 appendixes takes you from 'never touched COT' to building a real gold trading system — or subscribe below for new free articles via email." />,
        related: (
          <>
            📘{" "}
            <a href="https://narabodin.gumroad.com/l/COT" target="_blank" rel="noopener">
              <T th="ดูอีบุ๊ก “อ่าน COT ให้เป็น” บน Gumroad ($10)" en="View the e-book 'How to Read COT' on Gumroad ($10)" />
            </a>
          </>
        ),
      }}
    >
      <p>
        <T 
          th={<>ถ้าคุณเทรดทอง (XAUUSD) แล้วรู้สึกว่ากำลัง “เดา” ทิศทางอยู่ตลอด — <strong>COT report</strong> คือเครื่องมือที่ช่วยให้คุณเห็นว่าเงินรายใหญ่ในตลาดจริงกำลังวางเดิมพันฝั่งไหน บทความนี้สรุปให้เข้าใจตั้งแต่ศูนย์ ว่า COT คืออะไร อ่านยังไง และเอาไปใช้กับทองได้จริงแค่ไหน</>} 
          en={<>If you trade Gold (XAUUSD) and feel like you are constantly 'guessing' the direction — the <strong>COT report</strong> is the tool that helps you see which side the big money in the real market is betting on. This article summarizes from zero what COT is, how to read it, and how practically you can use it with Gold.</>} 
        />
      </p>

      <h2><T th="COT report คืออะไร" en="What is the COT report?" /></h2>
      <p>
        <T th={<>COT ย่อมาจาก <strong>Commitment of Traders</strong> เป็นรายงานที่ CFTC (หน่วยงานกำกับตลาดอนุพันธ์ของสหรัฐฯ) เผยแพร่ทุกวันศุกร์ โดยสรุปสถานะการถือสัญญา futures ของผู้เล่นกลุ่มต่างๆ ในตลาด เช่น ทองคำบน COMEX ข้อมูลเป็นของวันอังคารสัปดาห์นั้น (มี lag ประมาณ 3 วัน)</>} en={<>COT stands for <strong>Commitment of Traders</strong>. It is a report published every Friday by the CFTC (US Commodity Futures Trading Commission), summarizing the futures contract holdings of different market participants, such as Gold on COMEX. The data is as of Tuesday of that week (about a 3-day lag).</>} />
      </p>
      <p>
        <T th={<>หัวใจของมันคือ: รายใหญ่ที่มีสัญญาเกินเกณฑ์ที่กำหนด <em>ต้องรายงานสถานะ</em> ของตัวเองต่อ CFTC เราจึงได้เห็น “ความตั้งใจ” ของเงินก้อนใหญ่ ซึ่งเป็นข้อมูลที่รายย่อยทั่วไปไม่มีทางเห็นจากกราฟราคาเพียงอย่างเดียว</>} en={<>The core of it is: Large players holding contracts above a certain threshold <em>must report their positions</em> to the CFTC. Therefore, we get to see the 'intent' of big money — data that ordinary retail traders have no way of seeing from price charts alone.</>} />
      </p>

      <h2><T th="3 กลุ่มผู้เล่นที่ต้องรู้จัก" en="3 Types of Players You Must Know" /></h2>
      <p><T th="ใน COT แบบ Legacy ผู้เล่นถูกแบ่งเป็น 3 กลุ่มหลัก:" en="In the Legacy COT report, players are divided into 3 main groups:" /></p>
      <ul>
        <li>
          <T th={<><strong>Commercials (รายใหญ่เชิงพาณิชย์)</strong> — เช่น เหมืองทอง ผู้ผลิต ผู้ใช้ทองจริง พวกนี้เทรดเพื่อ <em>ป้องกันความเสี่ยง (hedge)</em> ไม่ใช่เก็งกำไร มักสวนทางราคา และเป็น “smart money” ที่ถูกบ่อยในจุดกลับตัว</>} en={<><strong>Commercials</strong> — e.g., gold mines, producers, actual gold users. They trade to <em>hedge risk</em>, not to speculate. They often trade against the price trend and are the 'smart money' that is frequently right at turning points.</>} />
        </li>
        <li>
          <T th={<><strong>Non-Commercials / Large Speculators (กองทุน รายใหญ่เก็งกำไร)</strong> — เฮดจ์ฟันด์และ managed money ที่เทรดตามเทรนด์ พวกนี้คือแรงผลักให้ราคาวิ่ง</>} en={<><strong>Non-Commercials / Large Speculators</strong> — Hedge funds and managed money that trade with the trend. These are the pushing force that makes prices run.</>} />
        </li>
        <li>
          <T th={<><strong>Non-Reportable (รายย่อย)</strong> — เทรดเดอร์รายเล็กที่สัญญาไม่ถึงเกณฑ์รายงาน มักเป็นฝ่ายที่ “ผิด” ตอนตลาดสุดขั้ว</>} en={<><strong>Non-Reportable (Retail)</strong> — Small traders whose contracts do not meet the reporting threshold. They are usually the side that is 'wrong' during market extremes.</>} />
        </li>
      </ul>

      <h2><T th="อ่าน COT ยังไงให้เป็น" en="How to Read the COT Properly" /></h2>
      <p>
        <T th={<>สิ่งที่ดูไม่ใช่ตัวเลขดิบ แต่คือ <strong>Net Position</strong> (Long ลบ Short) ของแต่ละกลุ่ม และที่สำคัญกว่าคือ <strong>การเปลี่ยนแปลง</strong> เทียบกับสัปดาห์ก่อนและกับช่วง 6–12 เดือน:</>} en={<>What you look at is not the raw numbers, but the <strong>Net Position</strong> (Long minus Short) of each group. And more importantly, the <strong>change</strong> compared to the previous week and over a 6-12 month period:</>} />
      </p>
      <ul>
        <li><T th="เมื่อ Large Speculators เพิ่ม net long ทองต่อเนื่อง = แรงซื้อตามเทรนด์กำลังก่อตัว" en="When Large Speculators continuously increase net long in Gold = Trend-following buying pressure is building up." /></li>
        <li>
          <T th={<>เมื่อ net long ของกองทุนพุ่งไป <em>สุดขั้ว</em> (extreme) เทียบกับอดีต = ตลาดอาจ “แออัด” เสี่ยงกลับตัว</>} en={<>When fund net longs spike to an <em>extreme</em> compared to history = The market may be 'crowded' and at risk of a reversal.</>} />
        </li>
        <li>
          <T th="เมื่อ Commercials เริ่มลด short / เพิ่ม long สวนทางราคาที่ร่วง = สัญญาณว่า smart money มองว่าถูกแล้ว" en="When Commercials start reducing shorts / increasing longs against a falling price = A signal that smart money thinks it's cheap enough." />
        </li>
      </ul>
      <blockquote>
        <T th="“COT ไม่ใช่สัญญาณเข้าออเดอร์ — มันคือบริบท (context) ที่บอกว่าใครกำลังถือฝั่งไหน”" en="'COT is not an entry signal — it is the context telling you who is holding which side.'" />
      </blockquote>

      <h2><T th="เอาไปใช้กับทองคำจริงยังไง" en="How to Actually Use It with Gold" /></h2>
      <p>
        <T th={<>วิธีที่ปลอดภัยที่สุดสำหรับมือใหม่คือใช้ COT เป็น <strong>ตัวกรองทิศทาง (bias filter)</strong> ไม่ใช่ตัวจับจังหวะ:</>} en={<>The safest method for beginners is to use COT as a <strong>bias filter</strong>, not a timing tool:</>} />
      </p>
      <ol>
        <li><T th="ดู COT รายสัปดาห์เพื่อตั้ง bias ว่าสัปดาห์นี้ควรเน้นมองหา Buy หรือ Sell" en="Look at the weekly COT to set your bias on whether you should focus on looking for Buys or Sells this week." /></li>
        <li><T th="ลงไปหาจังหวะเข้าจริงด้วยระบบของคุณบนกราฟ (price action / โครงสร้างตลาด)" en="Drop down to find actual entries using your system on the chart (price action / market structure)." /></li>
        <li>
          <T th="หลีกเลี่ยงการสวน extreme — เมื่อรายย่อย long สุดขั้วและกองทุนเริ่มถอย ให้ระวังการกลับตัว" en="Avoid fighting the extremes — when retail is extremely long and funds start retreating, watch out for a reversal." />
        </li>
      </ol>

      <h2><T th="ข้อผิดพลาดที่พบบ่อย" en="Common Mistakes" /></h2>
      <ul>
        <li><T th="ใช้ COT เป็นสัญญาณ buy/sell ทันที — มันมี lag ใช้ดูบริบท ไม่ใช่ timing" en="Using COT as an immediate buy/sell signal — it has a lag. Use it for context, not timing." /></li>
        <li><T th="ดูตัวเลขดิบแทนที่จะดูแนวโน้มและจุดสุดขั้ว" en="Looking at raw numbers instead of trends and extremes." /></li>
        <li>
          <T th="ลืมว่า XAUUSD spot กับ Gold futures บน COMEX ไม่ใช่สิ่งเดียวกัน แต่เคลื่อนไหวสัมพันธ์กันสูง" en="Forgetting that Spot XAUUSD and Gold futures on COMEX are not the same thing, though they are highly correlated." />
        </li>
      </ul>

      <div className="callout">
        <h3><T th="สรุปสั้น" en="TL;DR" /></h3>
        <ul>
          <li><T th="COT = รายงานสถานะรายใหญ่ ออกทุกศุกร์ (ข้อมูลของวันอังคาร)" en="COT = Large player position report, out every Friday (Tuesday's data)." /></li>
          <li><T th="โฟกัส 3 กลุ่ม: Commercials (hedge/smart money), Large Specs (ตามเทรนด์), รายย่อย" en="Focus on 3 groups: Commercials (hedge/smart money), Large Specs (trend followers), Retail." /></li>
          <li><T th="ดู net position + การเปลี่ยนแปลง + จุดสุดขั้ว — ไม่ใช่ตัวเลขดิบ" en="Look at net position + changes + extremes — not raw numbers." /></li>
          <li><T th="ใช้เป็นตัวกรอง bias แล้วหาจังหวะเข้าด้วยระบบบนกราฟ" en="Use as a bias filter, then find entries using your system on the chart." /></li>
        </ul>
      </div>
    </ArticleShell>
  );
}
