export type Sec = { n: string; t: string; href?: string; star?: boolean };
export type Grade = { title: string; sub: string; tier: "free" | "prem"; secs: Sec[] };

export const CURRICULUM: Grade[] = [
  {
    title: "ระดับ 1", sub: "รู้จักตลาดและกลไกพื้นฐาน", tier: "free",
    secs: [
      { n: "1.1", t: "Forex และตลาดเงิน", href: "/grade/forex-basics" },
      { n: "1.2", t: "ศัพท์และกลไกการเทรด", href: "/grade/trading-terms" },
      { n: "1.3", t: "Margin & Leverage 101", href: "/grade/margin-leverage" },
      { n: "1.4", t: "โบรกเกอร์ — รู้ก่อนฝากเงิน", href: "/grade/choosing-broker" },
      { n: "1.5", t: "Reality Check — ความจริงก่อนเริ่ม", href: "/grade/reality-check", star: true },
    ],
  },
  {
    title: "ระดับ 2", sub: "อ่านกราฟให้ออก", tier: "free",
    secs: [
      { n: "2.1", t: "กราฟและแท่งเทียน", href: "/grade/charts-candles" },
      { n: "2.2", t: "แนวรับแนวต้าน", href: "/grade/support-resistance" },
      { n: "2.3", t: "สามสายการวิเคราะห์", href: "/grade/three-analyses" },
    ],
  },
  {
    title: "ระดับ 3", sub: "กล่องเครื่องมือ Technical", tier: "free",
    secs: [
      { n: "3.1", t: "อินดิเคเตอร์หลัก (MA, RSI, MACD, ATR)", href: "/grade/indicators" },
      { n: "3.2", t: "Chart Patterns", href: "/grade/chart-patterns" },
      { n: "3.3", t: "เครื่องมือเสริม: Fibonacci / Pivot / Divergence", href: "/grade/extra-tools" },
    ],
  },
  {
    title: "ระดับ 4", sub: "รอดก่อนรวย · การบริหารความเสี่ยง", tier: "free",
    secs: [
      { n: "4.1", t: "คณิตศาสตร์ของการขาดทุน (drawdown, expectancy)", href: "/grade/risk-math" },
      { n: "4.2", t: "Position Sizing & Stop Loss", href: "/grade/position-sizing" },
      { n: "4.3", t: "Leverage ในชีวิตจริง", href: "/grade/leverage-reality" },
    ],
  },
  {
    title: "ระดับ 5", sub: "Price Action & โครงสร้างตลาด", tier: "prem",
    secs: [
      { n: "5.1", t: "Market Structure", href: "/grade/market-structure" },
      { n: "5.2", t: "Breakout & Fakeout", href: "/grade/breakout-fakeout" },
      { n: "5.3", t: "Multiple Time Frame", href: "/grade/multi-timeframe" },
    ],
  },
  {
    title: "ระดับ 6", sub: "Macro & Sentiment", tier: "prem",
    secs: [
      { n: "6.1", t: "Macro Fundamentals (ดอกเบี้ย / ธนาคารกลาง / ทองคำ)", href: "/grade/macro-fundamentals" },
      { n: "6.2", t: "Sentiment & Intermarket (COT, DXY, risk-on/off)", href: "/grade/sentiment-intermarket" },
    ],
  },
  {
    title: "ระดับ 7", sub: "สร้างระบบของตัวเอง", tier: "prem",
    secs: [
      { n: "7.1", t: "ระบบและการทดสอบ (backtest, overfitting, kill criteria)", href: "/grade/build-your-system" },
      { n: "7.2", t: "จิตวิทยาและวินัย + Trading Journal", href: "/grade/psychology-journal" },
    ],
  },
  {
    title: "ระดับ 8", sub: "โลกจริงหลังห้องเรียน", tier: "prem",
    secs: [
      { n: "8.1", t: "Prop Trading Firms", href: "/grade/prop-firms" },
      { n: "8.2", t: "ภาษีและกฎหมายไทย", href: "/grade/thai-tax-legal" },
      { n: "8.3", t: "กลโกงและข้อผิดพลาดที่พบบ่อย", href: "/grade/scams-mistakes" },
      { n: "8.4", t: "บทส่งท้าย → เชื่อมสู่การวางแผนการเงิน", href: "/grade/final-chapter" },
    ],
  },
  {
    title: "วิชาเลือก (ฟรี)", sub: "E-Book", tier: "free",
    secs: [
      { n: "S1", t: "ทองคำเจาะลึก (Gold Start)", href: "/gold-start" },
    ],
  },
  {
    title: "วิชาเลือก (Premium)", sub: "เรียนเมื่อใดก็ได้", tier: "prem",
    secs: [
      { n: "S2", t: "Elliott Wave & Harmonic Patterns", href: "/grade/elliott-harmonics" },
      { n: "S3", t: "Divergence เจาะลึก", href: "/grade/divergence-deep" },
      { n: "S4", t: "จาก Manual สู่ Systematic (Algo)", href: "/grade/manual-to-systematic" },
    ],
  },
];

export function getFlatChapters() {
  const flat: Sec[] = [];
  CURRICULUM.forEach((grade) => {
    grade.secs.forEach((sec) => {
      if (sec.href) flat.push(sec);
    });
  });
  return flat;
}

export function getAdjacentChapters(currentHref: string) {
  const flat = getFlatChapters();
  const currentIndex = flat.findIndex((sec) => sec.href === currentHref);
  
  if (currentIndex === -1) return { prev: null, next: null };
  
  return {
    prev: currentIndex > 0 ? flat[currentIndex - 1] : null,
    next: currentIndex < flat.length - 1 ? flat[currentIndex + 1] : null,
  };
}
