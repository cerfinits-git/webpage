import { createClient } from "@supabase/supabase-js";
import { readSupabasePublicConfig } from "./supabase/config";
import { MOCK_GOALS, MOCK_TRANSACTIONS } from "./mock-data";
import type {
  Account,
  AdvisorCache,
  Budget,
  Cashflow,
  Debt,
  Goal,
  ManualPrice,
  PhysicalAsset,
  Transaction,
} from "./types";

function getSupabaseClient() {
  const config = readSupabasePublicConfig();
  if (!config) return null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(config.url, serviceKey || config.key);
}

// 1. Accounts

export async function readAccounts(): Promise<Account[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    const { data, error } = await client.from("accounts").select("*");
    if (error || !data) return [];
    return data.map((row: any) => ({
      id: String(row.id),
      name: String(row.account_name || row.name || ""),
      bank: String(row.bank_name || row.bank || "cTrader"),
      openingBalance: Number(row.balance ?? row.openingBalance ?? 0),
      interestRate: Number(row.interest_rate ?? row.interestRate ?? 0),
      note: row.note ? String(row.note) : undefined,
    }));
  } catch (err) {
    console.error("Error reading accounts from Supabase:", err);
    return [];
  }
}

export async function writeAccounts(list: Account[], userId?: string | null): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    if (!list || list.length === 0) {
      await client.from("accounts").delete().neq("id", "__none__");
      return;
    }

    const rows = list.map((acc) => ({
      id: String(acc.id),
      user_id: userId || null,
      account_name: acc.name,
      bank_name: acc.bank || "cTrader",
      balance: acc.openingBalance || 0,
      interest_rate: acc.interestRate || 0,
    }));

    const { error: upsertErr } = await client.from("accounts").upsert(rows, { onConflict: "id" });
    if (upsertErr) {
      console.error("Supabase upsert accounts error:", upsertErr);
    } else {
      console.log(`Successfully saved ${rows.length} accounts to Supabase public.accounts table!`);
    }
  } catch (err) {
    console.error("Error writing accounts to Supabase:", err);
  }
}

// 2. Transactions

export async function readTransactions(userId?: string | null): Promise<Transaction[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    let query = client.from("transactions").select("*");
    if (userId) {
      query = query.eq("user_id", userId);
    }
    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((row: any) => ({
      id: String(row.id),
      assetType: row.asset_type || row.assetType || "stock",
      symbol: row.symbol,
      name: row.name || row.symbol,
      side: row.side || "buy",
      quantity: Number(row.quantity),
      price: Number(row.price),
      currency: row.currency || "USD",
      fee: Number(row.fee || 0),
      tradedAt: row.traded_at || row.tradedAt || new Date().toISOString().split("T")[0],
    }));
  } catch (err) {
    return [];
  }
}

export async function writeTransactions(list: Transaction[], userId?: string | null): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    if (!list || list.length === 0) {
      if (userId) {
        await client.from("transactions").delete().eq("user_id", userId);
      } else {
        await client.from("transactions").delete().neq("id", "__none__");
      }
      return;
    }

    const rows = list.map((t) => ({
      id: String(t.id),
      user_id: userId || null,
      asset_type: t.assetType,
      symbol: t.symbol,
      name: t.name,
      side: t.side,
      quantity: t.quantity,
      price: t.price,
      currency: t.currency || "USD",
      fee: t.fee || 0,
      traded_at: t.tradedAt,
    }));

    const { error } = await client.from("transactions").upsert(rows, { onConflict: "id" });
    if (error) {
      console.error("Supabase upsert transactions error:", error);
    }
  } catch (err) {
    console.error("Error writing transactions to Supabase:", err);
  }
}

// 3. Goals

export async function readGoals(): Promise<Goal[]> {
  const client = getSupabaseClient();
  if (!client) return MOCK_GOALS;
  try {
    const { data, error } = await client.from("goals").select("*");
    if (error || !data || data.length === 0) return MOCK_GOALS;
    return data.map((row: any) => ({
      id: String(row.id),
      name: row.name,
      targetAmount: Number(row.target_amount ?? row.targetAmount ?? 0),
      targetYear: Number(row.target_year ?? row.targetYear ?? 2030),
      monthlySaving: Number(row.monthly_saving ?? row.monthlySaving ?? 0),
      expectedReturn: Number(row.expected_return ?? row.expectedReturn ?? 0.07),
      linkedToPortfolio: Boolean(row.linked_to_portfolio ?? row.linkedToPortfolio ?? true),
      currentAmount: row.current_amount !== undefined ? Number(row.current_amount) : undefined,
    }));
  } catch (err) {
    return MOCK_GOALS;
  }
}

export async function writeGoals(list: Goal[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    if (!list || list.length === 0) {
      await client.from("goals").delete().neq("id", "__none__");
      return;
    }

    const rows = list.map((g) => ({
      id: String(g.id),
      name: g.name,
      target_amount: g.targetAmount,
      target_year: g.targetYear,
      monthly_saving: g.monthlySaving || 0,
      expected_return: g.expectedReturn || 0.07,
      linked_to_portfolio: g.linkedToPortfolio ?? true,
      current_amount: g.currentAmount ?? null,
    }));

    await client.from("goals").upsert(rows, { onConflict: "id" });
  } catch (err) {
    console.error("Error writing goals to Supabase:", err);
  }
}

// 4. Cashflows

export async function readCashflows(): Promise<Cashflow[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    const { data, error } = await client.from("cashflows").select("*");
    if (error || !data) return [];
    return data.map((row: any) => ({
      id: String(row.id),
      kind: row.type || row.kind || "income",
      category: row.category,
      amount: Number(row.amount),
      note: row.note || "",
      accountId: row.account_id || row.accountId || undefined,
      date: row.date || new Date().toISOString().split("T")[0],
    }));
  } catch {
    return [];
  }
}

export async function writeCashflows(list: Cashflow[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    if (!list || list.length === 0) {
      await client.from("cashflows").delete().neq("id", "__none__");
      return;
    }

    const rows = list.map((c) => ({
      id: String(c.id),
      type: c.kind,
      amount: c.amount,
      category: c.category,
      date: c.date,
      account_id: c.accountId || null,
      note: c.note || null,
    }));

    await client.from("cashflows").upsert(rows, { onConflict: "id" });
  } catch (err) {
    console.error("Error writing cashflows to Supabase:", err);
  }
}

// 5. Debts

export async function readDebts(): Promise<Debt[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    const { data, error } = await client.from("debts").select("*");
    if (error || !data) return [];
    return data.map((row: any) => ({
      id: String(row.id),
      name: row.lender || row.name || "",
      type: "ส่วนบุคคล",
      principal: Number(row.total_amount ?? row.principal ?? 0),
      remaining: Number(row.remaining_amount ?? row.remaining ?? 0),
      interestRate: Number(row.interest_rate ?? row.interestRate ?? 0),
      installment: Number(row.monthly_payment ?? row.installment ?? 0),
      totalInstallments: 0,
      paidInstallments: 0,
      dueDay: Number(row.due_date ?? row.dueDay ?? 1),
      note: row.note || "",
    }));
  } catch {
    return [];
  }
}

export async function writeDebts(list: Debt[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    if (!list || list.length === 0) {
      await client.from("debts").delete().neq("id", "__none__");
      return;
    }

    const rows = list.map((d) => ({
      id: String(d.id),
      lender: d.name,
      total_amount: d.principal,
      remaining_amount: d.remaining,
      monthly_payment: d.installment,
      due_date: d.dueDay,
      interest_rate: d.interestRate,
    }));

    await client.from("debts").upsert(rows, { onConflict: "id" });
  } catch (err) {
    console.error("Error writing debts to Supabase:", err);
  }
}

// 6. Physical Assets

export async function readAssets(): Promise<PhysicalAsset[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    const { data, error } = await client.from("assets").select("*");
    if (error || !data) return [];
    return data.map((row: any) => ({
      id: String(row.id),
      name: row.asset_name || row.name || "",
      category: "อื่นๆ",
      purchasePrice: Number(row.purchase_price ?? row.purchasePrice ?? 0),
      purchaseDate: row.purchase_date || row.purchaseDate || new Date().toISOString().split("T")[0],
      depreciationRate: Number(row.depreciation_rate ?? row.depreciationRate ?? 0),
      valueOverride: row.current_value !== undefined ? Number(row.current_value) : undefined,
    }));
  } catch {
    return [];
  }
}

export async function writeAssets(list: PhysicalAsset[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    if (!list || list.length === 0) {
      await client.from("assets").delete().neq("id", "__none__");
      return;
    }

    const rows = list.map((a) => ({
      id: String(a.id),
      asset_name: a.name,
      purchase_price: a.purchasePrice,
      purchase_date: a.purchaseDate,
      current_value: a.valueOverride ?? a.purchasePrice,
      depreciation_rate: a.depreciationRate || 0,
    }));

    await client.from("assets").upsert(rows, { onConflict: "id" });
  } catch (err) {
    console.error("Error writing assets to Supabase:", err);
  }
}

// 7. Budgets

export async function readBudgets(): Promise<Budget[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    const { data, error } = await client.from("budgets").select("*");
    if (error || !data) return [];
    return data.map((row: any) => ({
      category: row.category,
      monthlyLimit: Number(row.budget_amount ?? row.monthlyLimit ?? 0),
    }));
  } catch {
    return [];
  }
}

export async function writeBudgets(list: Budget[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    if (!list || list.length === 0) {
      await client.from("budgets").delete().neq("category", "__none__");
      return;
    }

    const rows = list.map((b) => ({
      category: b.category,
      budget_amount: b.monthlyLimit,
    }));

    await client.from("budgets").upsert(rows, { onConflict: "category" });
  } catch (err) {
    console.error("Error writing budgets to Supabase:", err);
  }
}

// 8. Manual Prices

export async function readManualPrices(): Promise<ManualPrice[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    const { data, error } = await client.from("manual_prices").select("*");
    if (error || !data) return [];
    return data.map((row: any) => ({
      symbol: row.symbol,
      price: Number(row.price),
      currency: row.currency || "USD",
      asOf: row.updated_at || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function writeManualPrices(list: ManualPrice[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    if (!list || list.length === 0) {
      await client.from("manual_prices").delete().neq("symbol", "__none__");
      return;
    }

    const rows = list.map((p) => ({
      symbol: p.symbol,
      price: p.price,
    }));

    await client.from("manual_prices").upsert(rows, { onConflict: "symbol" });
  } catch (err) {
    console.error("Error writing manual prices to Supabase:", err);
  }
}

// 9. AI Advisor Cache

export async function readAdvisorCache(): Promise<AdvisorCache | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data } = await client.from("advisor_cache").select("*").eq("id", "latest").maybeSingle();
    return data ? (data.analysis as AdvisorCache) : null;
  } catch {
    return null;
  }
}

export async function writeAdvisorCache(cache: AdvisorCache): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from("advisor_cache").upsert({
      id: "latest",
      analysis: cache,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error writing advisor cache to Supabase:", err);
  }
}

// 10. Newsletter Signups

// `source`/`archetype` are written by /quiz (spec 2026-08-14). The site has no
// analytics, so these two columns are the only way to tell where a signup came
// from — the quiz kill criteria are counted straight off this table.
export type NewsletterSignup = {
  email: string;
  at: string;
  source?: string;
  archetype?: string;
  /** Which consent wording they agreed to — proof burden sits with us. */
  consentVersion?: string;
};

/** Columns added by supabase/newsletter_attribution.sql. */
const NEWSLETTER_EXTRAS = "source, archetype, consent_version";

export async function readNewsletter(): Promise<NewsletterSignup[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  // The column is created_at, not subscribed_at — selecting a column that does
  // not exist fails the whole query, which is why this used to return nothing.
  const base = "email, created_at";
  try {
    let { data, error } = await client
      .from("newsletter_signups")
      .select(`${base}, ${NEWSLETTER_EXTRAS}`);
    if (error) {
      // Attribution columns not migrated yet — fall back to the base columns.
      ({ data } = await client.from("newsletter_signups").select(base));
    }
    if (!data) return [];
    return data.map((row) => ({
      email: row.email,
      at: row.created_at,
      source: row.source ?? undefined,
      archetype: row.archetype ?? undefined,
      consentVersion: row.consent_version ?? undefined,
    }));
  } catch {
    return [];
  }
}

export async function writeNewsletter(list: NewsletterSignup[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    for (const item of list) {
      const base = {
        email: item.email,
        created_at: item.at || new Date().toISOString(),
      };
      const { error } = await client
        .from("newsletter_signups")
        .upsert(
          {
            ...base,
            source: item.source,
            archetype: item.archetype,
            consent_version: item.consentVersion,
          },
          { onConflict: "email" },
        );
      // Retry without attribution so a signup is never lost just because the
      // migration has not been run yet.
      if (error) {
        await client.from("newsletter_signups").upsert(base, { onConflict: "email" });
      }
    }
  } catch (err) {
    console.error("Error writing newsletter to Supabase:", err);
  }
}

/**
 * Remove an address from the newsletter entirely. Matched case-insensitively
 * because people type their own address in whatever case they please, and a
 * withdrawal that misses because of capitalisation is a withdrawal that failed.
 */
export async function deleteNewsletterSignup(email: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.from("newsletter_signups").delete().ilike("email", email);
  } catch (err) {
    console.error("Error deleting newsletter signup from Supabase:", err);
  }
}
