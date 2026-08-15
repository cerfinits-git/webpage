export type Sec = { n: string; t: string; en_t: string; href?: string; star?: boolean };
export type Grade = { title: string; en_title: string; sub: string; en_sub: string; tier: "free" | "prem"; secs: Sec[] };

export const CURRICULUM: Grade[] = [
  {
    title: "ระดับ 1", en_title: "Level 1", sub: "รู้จักตลาดและกลไกพื้นฐาน", en_sub: "Market Mechanics", tier: "free",
    secs: [
      { n: "1.1", t: "Forex และตลาดเงิน", en_t: "Forex & Money Markets", href: "/grade/forex-basics" },
      { n: "1.2", t: "ศัพท์และกลไกการเทรด", en_t: "Terminology & Mechanics" },
      { n: "1.3", t: "Margin & Leverage 101", en_t: "Margin & Leverage 101", href: "/grade/margin-leverage" },
      { n: "1.4", t: "โบรกเกอร์ — รู้ก่อนฝากเงิน", en_t: "Brokers — Know Before You Deposit" },
      { n: "1.5", t: "Reality Check — ความจริงก่อนเริ่ม", en_t: "Reality Check — Before You Start", href: "/grade/reality-check", star: true },
    ],
  },
  {
    title: "ระดับ 2", en_title: "Level 2", sub: "อ่านกราฟให้ออก", en_sub: "Reading the Chart", tier: "free",
    secs: [
      { n: "2.1", t: "กราฟและแท่งเทียน", en_t: "Charts & Candlesticks" },
      { n: "2.2", t: "แนวรับแนวต้าน", en_t: "Support & Resistance" },
      { n: "2.3", t: "สามสายการวิเคราะห์", en_t: "The Three Schools of Analysis" },
    ],
  },
  {
    title: "ระดับ 3", en_title: "Level 3", sub: "กล่องเครื่องมือ Technical", en_sub: "Technical Toolbox", tier: "free",
    secs: [
      { n: "3.1", t: "อินดิเคเตอร์หลัก (MA, RSI, MACD, ATR)", en_t: "Core Indicators (MA, RSI, MACD, ATR)" },
      { n: "3.2", t: "Chart Patterns", en_t: "Chart Patterns" },
      { n: "3.3", t: "เครื่องมือเสริม: Fibonacci / Pivot / Divergence", en_t: "Secondary Tools: Fibonacci / Pivot / Divergence" },
    ],
  },
  {
    title: "ระดับ 4", en_title: "Level 4", sub: "รอดก่อนรวย · การบริหารความเสี่ยง", en_sub: "Survive Before You Thrive · Risk Management", tier: "free",
    secs: [
      { n: "4.1", t: "คณิตศาสตร์ของการขาดทุน (drawdown, expectancy)", en_t: "The Math of Losing (Drawdown, Expectancy)" },
      { n: "4.2", t: "Position Sizing & Stop Loss", en_t: "Position Sizing & Stop Loss" },
      { n: "4.3", t: "Leverage ในชีวิตจริง", en_t: "Leverage in Real Life" },
    ],
  },
  {
    title: "ระดับ 5", en_title: "Level 5", sub: "Price Action & โครงสร้างตลาด", en_sub: "Price Action & Market Structure", tier: "prem",
    secs: [
      { n: "5.1", t: "Market Structure", en_t: "Market Structure" },
      { n: "5.2", t: "Breakout & Fakeout", en_t: "Breakout & Fakeout" },
      { n: "5.3", t: "Multiple Time Frame", en_t: "Multiple Time Frame Analysis" },
    ],
  },
  {
    title: "ระดับ 6", en_title: "Level 6", sub: "Macro & Sentiment", en_sub: "Macro & Sentiment", tier: "prem",
    secs: [
      { n: "6.1", t: "Macro Fundamentals (ดอกเบี้ย / ธนาคารกลาง / ทองคำ)", en_t: "Macro Fundamentals (Rates / Central Banks / Gold)" },
      { n: "6.2", t: "Sentiment & Intermarket (COT, DXY, VIX)", en_t: "Sentiment & Intermarket (COT, DXY, VIX)" },
    ],
  },
  {
    title: "ระดับ 7", en_title: "Level 7", sub: "สร้างระบบของตัวเอง", en_sub: "Building Your System", tier: "prem",
    secs: [
      { n: "7.1", t: "ระบบและการทดสอบ (backtest, overfitting, kill criteria)", en_t: "Systems & Testing (Backtest, Overfitting, Kill Criteria)" },
      { n: "7.2", t: "จิตวิทยาและวินัย + Trading Journal", en_t: "Psychology & Discipline + Trading Journal" },
    ],
  },
  {
    title: "ระดับ 8", en_title: "Level 8", sub: "โลกจริงหลังห้องเรียน", en_sub: "The Real World", tier: "prem",
    secs: [
      { n: "8.1", t: "Prop Trading Firms", en_t: "Prop Trading Firms" },
      { n: "8.2", t: "ภาษีและกฎหมายไทย", en_t: "Thai Taxes & Laws" },
      { n: "8.3", t: "กลโกงและข้อผิดพลาดที่พบบ่อย", en_t: "Scams & Common Pitfalls" },
      { n: "8.4", t: "บทส่งท้าย → เชื่อมสู่การวางแผนการเงิน", en_t: "Epilogue → Bridging to Financial Planning" },
    ],
  },
  {
    title: "วิชาเลือก (ฟรี)", en_title: "Electives (Free)", sub: "E-Book", en_sub: "E-Book", tier: "free",
    secs: [
      { n: "S1", t: "ทองคำเจาะลึก (Gold Start)", en_t: "Gold Deep Dive (Gold Start)", href: "/gold-start" },
    ],
  },
  {
    title: "วิชาเลือก (Premium)", en_title: "Electives (Premium)", sub: "เรียนเมื่อใดก็ได้", en_sub: "Learn Anytime", tier: "prem",
    secs: [
      { n: "S2", t: "Elliott Wave & Harmonic Patterns", en_t: "Elliott Wave & Harmonic Patterns" },
      { n: "S3", t: "Divergence เจาะลึก", en_t: "Divergence Deep Dive" },
      { n: "S4", t: "จาก Manual สู่ Systematic (Algo)", en_t: "From Manual to Systematic (Algo)" },
    ],
  },
];

export function isChapterPremium(chapterId: string): boolean {
  for (const grade of CURRICULUM) {
    if (grade.tier === "prem") {
      const match = grade.secs.find((s) => s.n === chapterId);
      if (match) return true;
    }
  }
  return false;
}
