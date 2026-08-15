-- ============================================================
-- CERFINITS PLAN — Supabase schema (Idempotent / Safe to re-run)
-- รันไฟล์นี้ใน Supabase Dashboard > SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- 1. whitelist: อีเมลที่อนุญาตให้สมัคร (invite-only)
-- ------------------------------------------------------------
create table if not exists public.allowed_emails (
  email text primary key,
  note text
);

-- ------------------------------------------------------------
-- 2. profiles: ข้อมูลผู้ใช้ (สร้างอัตโนมัติเมื่อ signup ผ่าน)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. users: ตารางผู้ใช้งานสำหรับ Local/Google Auth Fallback & Progress
-- ------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text,
  name text,
  picture text,
  google_id text,
  is_premium boolean not null default true,
  completed_chapters text[] default '{}',
  created_at timestamptz not null default now()
);
create index if not exists users_username_idx on public.users (username);

-- ------------------------------------------------------------
-- 4. transactions: ธุรกรรมซื้อ/ขาย (กรอกเอง)
-- ------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  asset_type text not null check (asset_type in ('stock', 'etf', 'crypto', 'gold', 'fund')),
  symbol text not null,
  name text,
  side text not null check (side in ('buy', 'sell')),
  quantity numeric not null check (quantity > 0),
  price numeric not null check (price >= 0),
  currency text not null default 'USD' check (currency in ('USD', 'THB')),
  fee numeric not null default 0,
  traded_at date not null default current_date,
  created_at timestamptz not null default now()
);
create index if not exists transactions_user_idx on public.transactions (user_id, symbol);

-- ------------------------------------------------------------
-- 5. goals: เป้าหมายการเงิน
-- ------------------------------------------------------------
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  target_amount numeric not null check (target_amount > 0),
  target_year int not null,
  monthly_saving numeric not null default 0,
  expected_return numeric not null default 0.07,
  linked_to_portfolio boolean not null default true,
  current_amount numeric,
  created_at timestamptz not null default now()
);
create index if not exists goals_user_idx on public.goals (user_id);

-- ------------------------------------------------------------
-- 6. price_cache: ราคาล่าสุดต่อ symbol (เขียนโดย server เท่านั้น)
-- ------------------------------------------------------------
create table if not exists public.price_cache (
  symbol text primary key,
  price numeric not null,
  prev_close numeric,
  currency text not null default 'USD',
  fetched_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 7. ctrader_connections: การเชื่อมต่อบัญชี cTrader
-- ------------------------------------------------------------
create table if not exists public.ctrader_connections (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  trading_account_id text,
  ctrader_account_id text not null,
  access_token text not null,
  refresh_token text not null,
  last_sync_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists ctrader_connections_user_idx on public.ctrader_connections (user_id);

-- ------------------------------------------------------------
-- 8. ctrader_trades: ประวัติการเทรด cTrader
-- ------------------------------------------------------------
create table if not exists public.ctrader_trades (
  ticket text primary key,
  user_id text not null,
  ctrader_account_id numeric,
  symbol text not null,
  volume numeric not null,
  side text,
  entry_price numeric,
  exit_price numeric,
  profit numeric not null,        -- net (gross + commission + swap)
  gross_profit numeric,           -- before costs
  commission numeric,             -- <= 0
  swap numeric,                   -- can be +/-
  balance numeric,                -- running account equity after this deal
  open_time timestamptz not null,
  close_time timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists ctrader_trades_user_idx on public.ctrader_trades (user_id, close_time desc);

-- Migration for existing deployments (idempotent):
alter table public.ctrader_trades add column if not exists gross_profit numeric;
alter table public.ctrader_trades add column if not exists commission numeric;
alter table public.ctrader_trades add column if not exists swap numeric;
alter table public.ctrader_trades add column if not exists balance numeric;

-- ------------------------------------------------------------
-- 9. playbook_setups: กลยุทธ์และ Entry Checklist ใน Playbook
-- ------------------------------------------------------------
create table if not exists public.playbook_setups (
  id text primary key,
  user_id text not null,
  account_id text,
  name text not null,
  description text,
  rules jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists playbook_setups_user_idx on public.playbook_setups (user_id);
create index if not exists playbook_setups_acc_idx on public.playbook_setups (account_id);

-- ------------------------------------------------------------
-- Row-level security & Policies (Safe Drop & Re-create)
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.users enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;
alter table public.price_cache enable row level security;
alter table public.allowed_emails enable row level security;
alter table public.ctrader_connections enable row level security;
alter table public.ctrader_trades enable row level security;
alter table public.playbook_setups enable row level security;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "own transactions" on public.transactions;
drop policy if exists "allow all for transactions" on public.transactions;
create policy "allow all for transactions" on public.transactions
  for all using (true) with check (true);

drop policy if exists "own goals" on public.goals;
create policy "own goals" on public.goals
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "read prices" on public.price_cache;
create policy "read prices" on public.price_cache
  for select using (auth.role() = 'authenticated');

drop policy if exists "allow all for playbook_setups" on public.playbook_setups;
create policy "allow all for playbook_setups" on public.playbook_setups
  for all using (true) with check (true);

drop policy if exists "allow all for ctrader_connections" on public.ctrader_connections;
create policy "allow all for ctrader_connections" on public.ctrader_connections
  for all using (true) with check (true);

drop policy if exists "allow all for ctrader_trades" on public.ctrader_trades;
create policy "allow all for ctrader_trades" on public.ctrader_trades
  for all using (true) with check (true);

-- ------------------------------------------------------------
-- Invite-only gate: บล็อก signup ที่อีเมลไม่อยู่ใน whitelist
-- + สร้าง profile อัตโนมัติเมื่อผ่าน
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.allowed_emails where lower(email) = lower(new.email)) then
    raise exception 'อีเมลนี้ไม่ได้รับเชิญ (invite-only)';
  end if;
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
