import type { Account, Cashflow } from "./types";

export const monthKey = (date: string) => date.slice(0, 7);

export const currentMonth = () => new Date().toISOString().slice(0, 7);

export function monthLabel(month: string): string {
  const names = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const [y, m] = month.split("-").map(Number);
  return `${names[m - 1]} ${y + 543}`;
}

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function lastMonths(n: number, end = currentMonth()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(shiftMonth(end, -i));
  return out;
}

export function sumMonth(cashflows: Cashflow[], month: string) {
  let income = 0;
  let expense = 0;
  for (const c of cashflows) {
    if (monthKey(c.date) !== month) continue;
    if (c.kind === "income") income += c.amount;
    else expense += c.amount;
  }
  return { income, expense, net: income - expense };
}

export function monthlySeries(cashflows: Cashflow[], months: string[]) {
  return months.map((month) => ({ month, ...sumMonth(cashflows, month) }));
}

export function byCategory(
  cashflows: Cashflow[],
  kind: "income" | "expense",
  filter?: (c: Cashflow) => boolean,
): { category: string; total: number }[] {
  const map = new Map<string, number>();
  for (const c of cashflows) {
    if (c.kind !== kind) continue;
    if (filter && !filter(c)) continue;
    map.set(c.category, (map.get(c.category) ?? 0) + c.amount);
  }
  return [...map.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function accountBalance(account: Account, cashflows: Cashflow[]): number {
  let balance = account.openingBalance;
  for (const c of cashflows) {
    if (c.accountId !== account.id) continue;
    balance += c.kind === "income" ? c.amount : -c.amount;
  }
  return balance;
}
