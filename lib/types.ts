export type AssetType = "stock" | "etf" | "crypto" | "gold" | "fund";
export type Currency = "USD" | "THB";
export type CashflowKind = "income" | "expense";

export interface Cashflow {
  id: string;
  kind: CashflowKind;
  category: string;
  amount: number;
  note?: string;
  accountId?: string;
  date: string;
}

export interface Account {
  id: string;
  name: string;
  bank: string;
  openingBalance: number;
  interestRate: number;
  note?: string;
}

export interface Debt {
  id: string;
  name: string;
  type: string;
  principal: number;
  remaining: number;
  interestRate: number;
  installment: number;
  totalInstallments: number;
  paidInstallments: number;
  dueDay: number;
  note?: string;
}

export interface PhysicalAsset {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  purchaseDate: string;
  depreciationRate: number;
  valueOverride?: number;
}

export interface Budget {
  category: string;
  monthlyLimit: number;
}

export interface ManualPrice {
  symbol: string;
  price: number;
  currency: Currency;
  asOf: string;
}

export interface AdvisorVerdict {
  symbol: string;
  verdict: "buy" | "hold" | "sell";
  reason: string;
  risk: string;
}

export interface AdvisorResult {
  overall: string;
  holdings: AdvisorVerdict[];
}

export interface AdvisorCache {
  date: string;
  createdAt: string;
  result: AdvisorResult;
}

export const INCOME_CATEGORIES = ["เงินเดือน", "ฟรีแลนซ์", "เงินปันผล/ลงทุน", "อื่นๆ"];
export const EXPENSE_CATEGORIES = [
  "อาหาร",
  "เดินทาง",
  "ที่อยู่อาศัย",
  "ของใช้",
  "บันเทิง",
  "สุขภาพ",
  "การศึกษา",
  "ชำระหนี้",
  "อื่นๆ",
];
export const DEBT_TYPES = ["บ้าน", "รถ", "บัตรเครดิต", "ส่วนบุคคล", "อื่นๆ"];
export const ASSET_CATEGORIES = ["บ้าน", "ที่ดิน", "รถ", "ทอง", "อื่นๆ"];

// อัตราดอกเบี้ยออมทรัพย์เริ่มต้น — เป็นค่าประมาณให้แก้ในฟอร์มได้ ไม่มี API สาธารณะที่เชื่อถือได้
export const THAI_BANKS: { name: string; rate: number }[] = [
  { name: "กสิกรไทย", rate: 0.003 },
  { name: "ไทยพาณิชย์", rate: 0.003 },
  { name: "กรุงเทพ", rate: 0.0045 },
  { name: "กรุงไทย", rate: 0.003 },
  { name: "กรุงศรี", rate: 0.004 },
  { name: "ttb", rate: 0.005 },
  { name: "ออมสิน", rate: 0.004 },
  { name: "อื่นๆ", rate: 0 },
];

export interface Transaction {
  id: string;
  assetType: AssetType;
  symbol: string;
  name: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  currency: Currency;
  fee: number;
  tradedAt: string;
  unitLabel?: string;
}

export interface Quote {
  symbol: string;
  price: number;
  prevClose: number;
  currency: Currency;
}

export interface Holding {
  symbol: string;
  name: string;
  assetType: AssetType;
  quantity: number;
  avgCost: number;
  currency: Currency;
  price: number;
  valueThb: number;
  costThb: number;
  plPct: number;
  dayChangeThb: number;
  unitLabel?: string;
}

export interface PortfolioSummary {
  totalValueThb: number;
  totalCostThb: number;
  plThb: number;
  plPct: number;
  dayChangeThb: number;
  dayChangePct: number;
}

export interface TradePrefill {
  assetType: AssetType;
  symbol: string;
  name: string;
  currency: Currency;
  price?: number;
  side: "buy" | "sell";
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  targetYear: number;
  monthlySaving: number;
  expectedReturn: number;
  linkedToPortfolio: boolean;
  currentAmount?: number;
}
