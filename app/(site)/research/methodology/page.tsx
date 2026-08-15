import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/site/LangContext";
import {
  VALUATION_BANDS,
  GROWTH_BAND,
  LEVERAGE_THRESHOLDS,
  CASH_FLOW_SLUMP,
} from "@/lib/research/dashboard";

export const metadata: Metadata = {
  title: "วิธีคำนวณและเกณฑ์ที่ใช้ | Cerfinits",
  description:
    "มูลค่าประมาณคำนวณอย่างไร ไฟสถานะสุขภาพการเงินตัดสินจากเกณฑ์อะไร และข้อมูลมาจากไหน — เปิดเผยทั้งหมด",
  alternates: { canonical: "/research/methodology" },
};

const pctOf = (v: number) => `${Math.round(Math.abs(v) * 100)}%`;

export default function MethodologyPage() {
  return (
    <div className="sd sd-doc">
      <section className="sd-hero">
        <Link href="/research" className="back-link">
          ← <T th="หุ้นทั้งหมด" en="All stocks" />
        </Link>
        <div className="sd-id">
          <h1>
            <T th="วิธีคำนวณ" en="Methodology" />
          </h1>
          <p>
            <T
              th="ทุกตัวเลขบนหน้าหุ้นมาจากไหน และตัดสินด้วยเกณฑ์อะไร"
              en="Where every figure on a stock page comes from, and the rules behind it."
            />
          </p>
        </div>
      </section>

      <section className="sd-mod">
        <header className="sd-mod-head">
          <span className="sd-mod-n">01</span>
          <div>
            <h2>
              <T th="ข้อมูลมาจากไหน" en="Where the data comes from" />
            </h2>
          </div>
        </header>
        <ul className="sd-doc-list">
          <li>
            <T
              th="งบการเงินย้อนหลัง 5 ปี — จากแบบรายงานที่บริษัทยื่นต่อ ก.ล.ต. สหรัฐ (SEC EDGAR) เท่านั้น ไม่มีตัวเลขประมาณการปนในกราฟย้อนหลัง"
              en="Five years of financials — taken only from filings submitted to the SEC (EDGAR). No estimated figures are mixed into historical charts."
            />
          </li>
          <li>
            <T
              th="ราคา — อัปเดตรายวันจากผู้ให้บริการข้อมูลราคา อาจล่าช้าจากราคาจริงในตลาด"
              en="Prices — refreshed daily from a market-data provider and may lag the live market."
            />
          </li>
          <li>
            <T
              th="มูลค่าตลาด — คำนวณจากราคาปัจจุบันคูณจำนวนหุ้นเฉลี่ยของปีล่าสุดที่แจ้งไว้ในงบ จึงแสดงเป็นค่าประมาณ (≈) เพราะบริษัทที่ซื้อหุ้นคืนจะมีหุ้นน้อยกว่านั้นในวันนี้"
              en="Market cap — the current price times the latest annual average share count from the filings, so it is shown as an approximation (≈): a company buying back stock has fewer shares today than that average."
            />
          </li>
          <li>
            <T
              th="คำอธิบายและความเสี่ยง — เรียบเรียงจากบทวิเคราะห์ที่จัดทำและตรวจทานโดยผู้จัดทำก่อนเผยแพร่ทุกฉบับ"
              en="Narrative and risks — rewritten from an analysis that a human reviews before publication."
            />
          </li>
        </ul>
      </section>

      <section className="sd-mod">
        <header className="sd-mod-head">
          <span className="sd-mod-n">02</span>
          <div>
            <h2>
              <T th="ดาว = คุณภาพธุรกิจ" en="Stars = business quality" />
            </h2>
          </div>
        </header>
        <p className="sd-doc-p">
          <T
            th="ดาวสะท้อนคุณภาพของตัวธุรกิจอย่างเดียว เช่น ความสามารถในการทำกำไรเทียบกับเงินทุนที่ใช้ ความสม่ำเสมอ และความแข็งแรงของงบดุล — ไม่เกี่ยวกับราคาหุ้น"
            en="Stars reflect the business itself — returns on the capital it uses, consistency, and balance-sheet strength. They say nothing about the share price."
          />
        </p>
        <div className="sd-doc-table">
          <div><span>90–100</span><b>★★★★★</b></div>
          <div><span>80–89</span><b>★★★★☆</b></div>
          <div><span>70–79</span><b>★★★☆☆</b></div>
          <div><span>60–69</span><b>★★☆☆☆</b></div>
          <div><span>&lt; 60</span><b>★☆☆☆☆</b></div>
        </div>
        <p className="sd-doc-p sd-doc-note">
          <T
            th="เหตุผลที่แยกดาวออกจากราคา: บริษัทที่ดีที่สุดก็ขาดทุนได้ถ้าซื้อแพงเกินไป การรวมสองอย่างเป็นคะแนนเดียวจะซ่อนความจริงข้อนี้"
            en="Why the two are separate: even the best company can lose you money if bought too expensively. Merging them into one score would hide that."
          />
        </p>
      </section>

      <section className="sd-mod">
        <header className="sd-mod-head">
          <span className="sd-mod-n">03</span>
          <div>
            <h2>
              <T th="มูลค่าประมาณ" en="Estimated value" />
            </h2>
          </div>
        </header>
        <p className="sd-doc-p">
          <T
            th="มูลค่าประมาณคือค่าถ่วงน้ำหนักความน่าจะเป็นจากสามฉากทัศน์ (แย่ / ฐาน / ดี) ของแบบจำลองกระแสเงินสด แต่ละฉากทัศน์มีสมมติฐานการเติบโตและอัตรากำไรของตัวเอง ตัวเลขนี้ไม่ใช่ราคาเป้าหมาย และไม่ใช่การพยากรณ์ราคา — เป็นเพียงผลลัพธ์ของสมมติฐานชุดหนึ่งที่เปิดเผยไว้ในบทวิเคราะห์ฉบับเต็ม"
            en="The estimate is the probability-weighted result of three cash-flow scenarios (bear / base / bull), each with its own growth and margin assumptions. It is not a price target and not a price forecast — only the output of a stated set of assumptions, published in full in the detailed report."
          />
        </p>
        <div className="sd-doc-table">
          <div>
            <span><T th="ถูกกว่ามูลค่าประมาณ" en="Below estimate" /></span>
            <b>≥ {pctOf(VALUATION_BANDS.cheap)}</b>
          </div>
          <div>
            <span><T th="ใกล้เคียงมูลค่าประมาณ" en="Near estimate" /></span>
            <b>−{pctOf(VALUATION_BANDS.expensive)} … +{pctOf(VALUATION_BANDS.cheap)}</b>
          </div>
          <div>
            <span><T th="แพงกว่ามูลค่าประมาณ" en="Above estimate" /></span>
            <b>≥ {pctOf(VALUATION_BANDS.expensive)}</b>
          </div>
        </div>
      </section>

      <section className="sd-mod">
        <header className="sd-mod-head">
          <span className="sd-mod-n">04</span>
          <div>
            <h2>
              <T th="เกณฑ์ไฟสถานะการเงิน" en="Financial health rules" />
            </h2>
          </div>
        </header>
        <ul className="sd-doc-list">
          <li>
            <b><T th="รายได้ / กำไรสุทธิ" en="Revenue / net profit" /></b> —{" "}
            <T
              th={`ดูการเปลี่ยนแปลงรายปี 3 ปีล่าสุด ถ้าเพิ่มเกิน ${pctOf(GROWTH_BAND)} เกินครึ่งของปีที่ดูได้ = ดี ถ้าลดเกินครึ่ง = น่ากังวล นอกนั้น = เฝ้าระวัง`}
              en={`Year-on-year change across the last three years. Rising by more than ${pctOf(GROWTH_BAND)} in a majority of them is good, falling in a majority is concerning, anything else is watch.`}
            />
          </li>
          <li>
            <b><T th="กระแสเงินสด" en="Cash flow" /></b> —{" "}
            <T
              th={`กระแสเงินสดอิสระเป็นบวกทุกปีใน 3 ปีล่าสุด = ดี ติดลบเกินครึ่ง = น่ากังวล ติดลบบางปี = เฝ้าระวัง · และถึงจะเป็นบวกทุกปี ถ้าปีล่าสุดลดลงเกิน ${Math.round(CASH_FLOW_SLUMP * 100)}% จากปีก่อน จะนับเป็นเฝ้าระวัง เพราะการหดตัวแรงคือการเปลี่ยนสถานะ ไม่ใช่แค่ตัวเลขแกว่ง`}
              en={`Free cash flow positive in all of the last three years is good, negative in a majority is concerning, negative in some is watch. Even when every year is positive, a fall of more than ${Math.round(CASH_FLOW_SLUMP * 100)}% in the latest year counts as watch — a drop that steep is a change of state, not noise.`}
            />
          </li>
          <li>
            <b><T th="หนี้สิน" en="Debt" /></b> —{" "}
            <T
              th={`หนี้สุทธิ (หนี้ลบเงินสด) หารด้วยกระแสเงินสดจากการดำเนินงานหนึ่งปี = จำนวนปีที่ต้องใช้เงินสดไปใช้หนี้ ต่ำกว่า ${LEVERAGE_THRESHOLDS.good} ปี = ดี ไม่เกิน ${LEVERAGE_THRESHOLDS.watch} ปี = เฝ้าระวัง มากกว่านั้น = น่ากังวล · ถ้ามีเงินสดมากกว่าหนี้ = ดี`}
              en={`Net debt (debt minus cash) divided by one year of operating cash flow — the years of cash generation needed to clear it. Below ${LEVERAGE_THRESHOLDS.good} years is good, up to ${LEVERAGE_THRESHOLDS.watch} is watch, above that is concerning. More cash than debt is good.`}
            />
          </li>
        </ul>
        <p className="sd-doc-p sd-doc-note">
          <T
            th="ทุกไฟสถานะกดดูได้ว่าคำนวณจากตัวเลขปีไหนบ้าง ถ้าข้อมูลไม่พอที่จะตัดสินตามเกณฑ์ ระบบจะไม่แสดงไฟ แทนที่จะเดา"
            en="Every indicator can be expanded to show the years it read. Where there is not enough data to apply a rule, no indicator is shown rather than a guess."
          />
        </p>
      </section>

      <section className="sd-mod">
        <header className="sd-mod-head">
          <span className="sd-mod-n">05</span>
          <div>
            <h2>
              <T th="ข้อจำกัดที่ควรรู้" en="Limits you should know" />
            </h2>
          </div>
        </header>
        <ul className="sd-doc-list">
          <li>
            <T
              th="บทวิเคราะห์อัปเดตทุกไตรมาสหลังงบออก ไม่ใช่รายวัน — ระบบนี้ไม่ทันข่าว และไม่ได้ออกแบบมาให้ทัน"
              en="Analyses refresh quarterly after filings, not daily. This is not a news product and is not designed to be one."
            />
          </li>
          <li>
            <T
              th="ครอบคลุมเฉพาะหุ้นที่วิเคราะห์แล้วเท่านั้น ไม่ได้ครอบคลุมทั้งตลาด"
              en="Coverage is limited to stocks that have been analysed — not the whole market."
            />
          </li>
          <li>
            <T
              th="มูลค่าประมาณเปลี่ยนได้ทันทีถ้าสมมติฐานเปลี่ยน และสมมติฐานอาจผิด"
              en="An estimate moves the moment its assumptions move, and assumptions can be wrong."
            />
          </li>
        </ul>
        <p className="sd-disclaimer">
          <T
            th="เพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน · Cerfinits ไม่ใช่ที่ปรึกษาการลงทุนที่ได้รับใบอนุญาต และไม่รับประกันผลตอบแทนใด ๆ"
            en="For education only, not investment advice · Cerfinits is not a licensed investment adviser and guarantees no returns."
          />
        </p>
      </section>
    </div>
  );
}
