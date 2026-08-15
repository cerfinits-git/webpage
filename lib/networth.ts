import { accountBalance } from "./cashflow";
import type { Account, Cashflow, Debt, PhysicalAsset } from "./types";

const MS_PER_YEAR = 365.25 * 24 * 3600 * 1000;

export function assetCurrentValue(asset: PhysicalAsset, now = new Date()): number {
  if (asset.valueOverride != null) return asset.valueOverride;
  const years = Math.max((now.getTime() - new Date(asset.purchaseDate).getTime()) / MS_PER_YEAR, 0);
  return Math.max(asset.purchasePrice * (1 - asset.depreciationRate * years), 0);
}

export interface NetWorth {
  portfolio: number;
  savings: number;
  assets: number;
  debts: number;
  total: number;
}

export function computeNetWorth(
  portfolioThb: number,
  accounts: Account[],
  cashflows: Cashflow[],
  assets: PhysicalAsset[],
  debts: Debt[],
): NetWorth {
  const savings = accounts.reduce((s, a) => s + accountBalance(a, cashflows), 0);
  const assetTotal = assets.reduce((s, a) => s + assetCurrentValue(a), 0);
  const debtTotal = debts.reduce((s, d) => s + d.remaining, 0);
  return {
    portfolio: portfolioThb,
    savings,
    assets: assetTotal,
    debts: debtTotal,
    total: portfolioThb + savings + assetTotal - debtTotal,
  };
}

export function nextDueDate(dueDay: number, from = new Date()): Date {
  const clamp = (y: number, m: number) =>
    new Date(y, m, Math.min(dueDay, new Date(y, m + 1, 0).getDate()));
  const candidate = clamp(from.getFullYear(), from.getMonth());
  if (candidate.getDate() >= from.getDate() && candidate.getMonth() === from.getMonth()) {
    return candidate;
  }
  return clamp(from.getFullYear(), from.getMonth() + 1);
}

export function daysUntil(date: Date, from = new Date()): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((b.getTime() - a.getTime()) / (24 * 3600 * 1000));
}

export function thaiDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;
}
