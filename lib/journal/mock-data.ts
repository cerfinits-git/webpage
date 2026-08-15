import type { JournalTrade } from "./types";

const symbols = ["XAUUSD", "EURUSD", "NAS100", "GBPJPY", "USDJPY"];
const setups = ["Breakout", "Pullback", "Momentum"];
const sessions = ["London", "New York", "Asia"];
const timeframes = ["M15", "M30", "H1"];
const rawWins = [1.8, 0.6, 2.4, 0.9, 1.2, 0.7, 1.5, 0.4, 1.1, 0.8, 1.6, 0.5, 1.3, 0.9, 1.4, 0.6, 1.7, 0.3, 1.2, 0.8, 1.5, 0.4, 1, 1.1];
const rawWinRest = rawWins.slice(1).reduce((sum, value) => sum + value, 0);
const wins = [1.8, ...rawWins.slice(1).map((value) => value * ((29.16 - 1.8) / rawWinRest))];
const losses = [1, 1, 0.8, 1.2, 1.1, 0.9, 1, 1.3, 0.7, 1.4, 1, 0.8, 1.2, 0.9, 1.1, 1.36];

function rSeries() {
  let winIndex = 1;
  let lossIndex = 0;
  return Array.from({ length: 40 }, (_, index) => {
    if (index === 0) return -losses[15];
    if (index === 39) return wins[0];
    if (index % 5 < 3) return wins[winIndex++];
    return -losses[lossIndex++];
  });
}

const results = rSeries();

export const SEED_TRADES: JournalTrade[] = results.map((result, index) => {
  const date = new Date(Date.UTC(2026, 5, 5 + index));
  const openedAt = new Date(date.setUTCHours(8 + (index % 8), 12 + (index % 41))).toISOString();
  const closedAt = new Date(new Date(openedAt).getTime() + (90 + (index % 9) * 35) * 60_000).toISOString();
  const symbol = index === 39 ? "XAUUSD" : symbols[index % symbols.length];
  const side = index === 39 || index % 2 === 0 ? "buy" : "sell";
  const averageEntry = symbol === "XAUUSD" ? (index === 39 ? 2405 : 2310 + index * 2.6) : 1.08 + index * 0.0031;
  const initialStop = side === "buy" ? averageEntry - (symbol === "XAUUSD" ? 13 : 0.008) : averageEntry + (symbol === "XAUUSD" ? 13 : 0.008);
  const averageExit = side === "buy"
    ? averageEntry + result * Math.abs(averageEntry - initialStop)
    : averageEntry - result * Math.abs(averageEntry - initialStop);
  const initialRiskAmount = 1900 + (index % 4) * 250;
  const netPnl = result * initialRiskAmount;
  const id = index === 39 ? "trade-xau-20260714" : `trade-seed-${String(index + 1).padStart(2, "0")}`;
  const fee = 40 + (index % 3) * 12;

  return {
    id,
    accountId: "ctrader-demo-01",
    symbol,
    side,
    openedAt,
    closedAt,
    quantity: symbol === "XAUUSD" ? 0.1 + (index % 3) * 0.05 : 0.5 + (index % 4) * 0.25,
    averageEntry,
    averageExit,
    initialStop,
    initialRiskAmount: index === 3 || index === 17 ? null : initialRiskAmount,
    grossPnl: netPnl + fee,
    fees: fee,
    swap: 0,
    netPnl,
    rMultiple: result,
    setup: index === 39 ? "Breakout" : setups[index % setups.length],
    timeframe: index === 39 ? "M15" : timeframes[index % timeframes.length],
    session: index === 39 ? "London" : sessions[index % sessions.length],
    marketCondition: index % 3 === 0 ? "Trending" : index % 3 === 1 ? "Ranging" : "Volatile",
    notes: index === 39
      ? "Price broke above the London range high with strong momentum."
      : "บันทึกตัวอย่างสำหรับทดสอบ workflow และ analytics ของ journal",
    tags: index === 39 ? ["Late entry", "Followed stop"] : result < 0 ? ["Loss accepted"] : ["Plan followed"],
    source: "seed",
    executions: [
      {
        id: `${id}-entry`,
        tradeId: id,
        type: "entry",
        side,
        executedAt: openedAt,
        quantity: symbol === "XAUUSD" ? 0.1 : 0.5,
        price: averageEntry,
        fee: fee / 2,
      },
      {
        id: `${id}-exit`,
        tradeId: id,
        type: result <= -1 ? "stop" : "exit",
        side: side === "buy" ? "sell" : "buy",
        executedAt: closedAt,
        quantity: symbol === "XAUUSD" ? 0.1 : 0.5,
        price: averageExit,
        fee: fee / 2,
      },
    ],
  };
});

export const PLAYBOOK_SETUPS = [
  {
    id: "breakout",
    name: "Breakout",
    description: "เข้าเมื่อราคาออกจากกรอบที่นิยามไว้และยืนยันด้วย momentum",
    rules: ["Bias ชัดเจน", "กรอบมีอย่างน้อย 2 touches", "รอ close นอกกรอบ", "Risk-reward ≥ 1:1.5"],
  },
  {
    id: "pullback",
    name: "Pullback",
    description: "เข้า continuation หลังราคาย่อกลับสู่โซนที่กำหนด",
    rules: ["Trend structure ยังไม่เสีย", "Pullback ไม่ลึกเกิน invalidation", "มี rejection", "Stop อยู่นอก structure"],
  },
  {
    id: "momentum",
    name: "Momentum",
    description: "ตามแรงเคลื่อนที่เมื่อ volatility และ structure สนับสนุน",
    rules: ["Volume/volatility ขยาย", "ไม่ไล่ราคาเกินแผน", "มี liquidity ด้านหน้า", "ลด risk เมื่อข่าวใกล้ประกาศ"],
  },
];
