import type { Goal, Quote, Transaction } from "./types";

// Milestone 1: mock data only. Milestone 2 replaces this with Supabase + live price APIs.

export const USD_THB = 36.2;

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    assetType: "stock",
    symbol: "VOO",
    name: "VOO · ETF",
    side: "buy",
    quantity: 6,
    price: 450,
    currency: "USD",
    fee: 0,
    tradedAt: "2024-05-10",
  },
  {
    id: "t2",
    assetType: "stock",
    symbol: "VOO",
    name: "VOO · ETF",
    side: "buy",
    quantity: 6,
    price: 510,
    currency: "USD",
    fee: 0,
    tradedAt: "2025-02-14",
  },
  {
    id: "t3",
    assetType: "crypto",
    symbol: "BTC",
    name: "BTC · crypto",
    side: "buy",
    quantity: 0.15,
    price: 58200,
    currency: "USD",
    fee: 0,
    tradedAt: "2024-11-02",
  },
  {
    id: "t4",
    assetType: "crypto",
    symbol: "ETH",
    name: "ETH · crypto",
    side: "buy",
    quantity: 1.2,
    price: 3244,
    currency: "USD",
    fee: 0,
    tradedAt: "2025-06-20",
  },
  {
    id: "t5",
    assetType: "gold",
    symbol: "GOLD96.5",
    name: "ทองคำ 96.5%",
    side: "buy",
    quantity: 6,
    price: 38900,
    currency: "THB",
    fee: 0,
    tradedAt: "2024-08-01",
    unitLabel: "บาท",
  },
  {
    id: "t6",
    assetType: "gold",
    symbol: "GOLD96.5",
    name: "ทองคำ 96.5%",
    side: "sell",
    quantity: 1,
    price: 40200,
    currency: "THB",
    fee: 0,
    tradedAt: "2025-03-05",
    unitLabel: "บาท",
  },
];

export const MOCK_QUOTES: Quote[] = [
  { symbol: "VOO", price: 522.4, prevClose: 521.05, currency: "USD" },
  { symbol: "BTC", price: 67450, prevClose: 67120, currency: "USD" },
  { symbol: "ETH", price: 3140, prevClose: 3178, currency: "USD" },
  { symbol: "GOLD96.5", price: 41250, prevClose: 41100, currency: "THB" },
];

export const MOCK_GOALS: Goal[] = [
  {
    id: "g1",
    name: "เกษียณอายุ",
    targetAmount: 15_000_000,
    targetYear: 2046,
    monthlySaving: 20_000,
    expectedReturn: 0.07,
    linkedToPortfolio: true,
  },
  {
    id: "g2",
    name: "เงินสำรองฉุกเฉิน",
    targetAmount: 300_000,
    targetYear: 2027,
    monthlySaving: 10_000,
    expectedReturn: 0.02,
    linkedToPortfolio: false,
    currentAmount: 240_000,
  },
];
