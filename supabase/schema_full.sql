-- ============================================================
-- CERFINITS FULL SUPABASE SCHEMA
-- รันไฟล์นี้ใน Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Whitelist สำหรับระบบ Invite-Only & Profiles
create table if not exists public.allowed_emails (
  email text primary key,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id text primary key,
  email text unique not null,
  display_name text,
  picture text,
  is_premium boolean default true,
  created_at timestamptz not null default now()
);

-- 2. ข้อมูลการเงินทั้งหมด (Transactions, Goals, Cashflows, Accounts, Debts, Assets, Budgets)
create table if not exists public.transactions (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.goals (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.cashflows (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.debts (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.assets (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.budgets (
  category text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.manual_prices (
  symbol text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.advisor_cache (
  id text primary key default 'latest',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- 3. Row-Level Security (RLS) Policies
alter table public.allowed_emails enable row level security;
alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;
alter table public.cashflows enable row level security;
alter table public.accounts enable row level security;
alter table public.debts enable row level security;
alter table public.assets enable row level security;
alter table public.budgets enable row level security;
alter table public.manual_prices enable row level security;
alter table public.advisor_cache enable row level security;
alter table public.newsletter_signups enable row level security;

create policy "Allow all allowed_emails" on public.allowed_emails for all using (true) with check (true);
create policy "Allow all profiles" on public.profiles for all using (true) with check (true);
create policy "Allow all transactions" on public.transactions for all using (true) with check (true);
create policy "Allow all goals" on public.goals for all using (true) with check (true);
create policy "Allow all cashflows" on public.cashflows for all using (true) with check (true);
create policy "Allow all accounts" on public.accounts for all using (true) with check (true);
create policy "Allow all debts" on public.debts for all using (true) with check (true);
create policy "Allow all assets" on public.assets for all using (true) with check (true);
create policy "Allow all budgets" on public.budgets for all using (true) with check (true);
create policy "Allow all manual_prices" on public.manual_prices for all using (true) with check (true);
create policy "Allow all advisor_cache" on public.advisor_cache for all using (true) with check (true);
create policy "Allow all newsletter_signups" on public.newsletter_signups for all using (true) with check (true);
