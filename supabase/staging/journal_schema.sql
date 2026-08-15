-- Cerfinits Journal staging schema.
--
-- This file is deliberately NOT a production migration. Apply it only to a
-- disposable local/staging Supabase project after Supabase Auth is wired.
-- The runtime Journal remains local-first until the RLS suite and checksum
-- reconciliation pass against that environment.

create table public.journal_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id text not null check (char_length(client_id) between 1 and 160),
  name text not null check (char_length(name) between 1 and 120),
  broker text not null check (char_length(broker) between 1 and 80),
  external_account_id text,
  base_currency text not null check (base_currency ~ '^[A-Z]{3,8}$'),
  reporting_timezone text not null check (char_length(reporting_timezone) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_id),
  unique (id, user_id)
);

create index journal_accounts_user_idx
  on public.journal_accounts (user_id, updated_at desc);

create table public.journal_trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid not null,
  client_id text not null check (char_length(client_id) between 1 and 200),
  symbol text not null check (char_length(symbol) between 1 and 40),
  side text not null check (side in ('buy', 'sell')),
  opened_at timestamptz not null,
  closed_at timestamptz not null,
  quantity numeric not null check (quantity > 0),
  average_entry numeric not null check (average_entry > 0),
  average_exit numeric not null check (average_exit > 0),
  initial_stop numeric check (initial_stop is null or initial_stop > 0),
  initial_risk_amount numeric check (initial_risk_amount is null or initial_risk_amount > 0),
  gross_pnl numeric not null,
  commission_pnl numeric not null default 0,
  swap_pnl numeric not null default 0,
  net_pnl numeric not null,
  setup text not null default 'Unmapped' check (char_length(setup) between 1 and 120),
  timeframe text not null default 'Unmapped' check (char_length(timeframe) between 1 and 40),
  session text not null default 'Unmapped' check (char_length(session) between 1 and 80),
  market_condition text not null default 'Unmapped' check (char_length(market_condition) between 1 and 120),
  notes text not null default '',
  tags text[] not null default '{}',
  -- Seed rows are browser-only demo fixtures and are never remote evidence.
  source text not null check (source in ('manual', 'ctrader-csv')),
  external_position_id text,
  source_evidence_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journal_trades_account_owner_fk
    foreign key (account_id, user_id)
    references public.journal_accounts (id, user_id)
    on delete cascade,
  constraint journal_trades_close_after_open
    check (closed_at >= opened_at),
  constraint journal_trades_pnl_reconciles
    check (abs((gross_pnl + commission_pnl + swap_pnl) - net_pnl) <= 0.02),
  unique (account_id, client_id),
  unique (id, user_id)
);

create unique index journal_trades_external_position_idx
  on public.journal_trades (account_id, external_position_id)
  where external_position_id is not null;

create unique index journal_trades_evidence_idx
  on public.journal_trades (account_id, source_evidence_hash)
  where source_evidence_hash is not null;

create index journal_trades_user_closed_idx
  on public.journal_trades (user_id, closed_at desc);

create index journal_trades_account_closed_idx
  on public.journal_trades (account_id, closed_at desc);

create table public.journal_executions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  trade_id uuid not null,
  client_id text not null check (char_length(client_id) between 1 and 220),
  execution_type text not null check (execution_type in ('entry', 'partial', 'exit', 'stop')),
  side text not null check (side in ('buy', 'sell')),
  executed_at timestamptz not null,
  quantity numeric not null check (quantity > 0),
  price numeric not null check (price > 0),
  fee numeric not null default 0 check (fee >= 0),
  commission_pnl numeric not null default 0,
  swap_pnl numeric not null default 0,
  external_id text,
  external_position_id text,
  source_hash text,
  created_at timestamptz not null default now(),
  constraint journal_executions_trade_owner_fk
    foreign key (trade_id, user_id)
    references public.journal_trades (id, user_id)
    on delete cascade,
  unique (trade_id, client_id)
);

create unique index journal_executions_external_idx
  on public.journal_executions (trade_id, external_id)
  where external_id is not null;

create unique index journal_executions_source_hash_idx
  on public.journal_executions (trade_id, source_hash)
  where source_hash is not null;

create index journal_executions_user_trade_idx
  on public.journal_executions (user_id, trade_id, executed_at);

create table public.journal_import_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid not null,
  file_name text not null check (char_length(file_name) between 1 and 240),
  file_sha256 text not null check (file_sha256 ~ '^[0-9a-f]{64}$'),
  mapping_version integer not null check (mapping_version > 0),
  status text not null check (status in ('previewed', 'committed', 'rejected')),
  ready_count integer not null default 0 check (ready_count >= 0),
  needs_info_count integer not null default 0 check (needs_info_count >= 0),
  duplicate_count integer not null default 0 check (duplicate_count >= 0),
  rejected_count integer not null default 0 check (rejected_count >= 0),
  created_at timestamptz not null default now(),
  committed_at timestamptz,
  constraint journal_import_batches_account_owner_fk
    foreign key (account_id, user_id)
    references public.journal_accounts (id, user_id)
    on delete cascade,
  unique (account_id, file_sha256, mapping_version),
  unique (id, user_id)
);

create index journal_import_batches_user_created_idx
  on public.journal_import_batches (user_id, created_at desc);

create table public.journal_import_rows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  batch_id uuid not null,
  source_row integer not null check (source_row > 0),
  source_hash text not null check (char_length(source_hash) between 8 and 128),
  classification text not null check (classification in ('ready', 'needs-info', 'duplicate', 'rejected', 'conflict')),
  blocking_issues text[] not null default '{}',
  raw_evidence jsonb not null,
  created_at timestamptz not null default now(),
  constraint journal_import_rows_batch_owner_fk
    foreign key (batch_id, user_id)
    references public.journal_import_batches (id, user_id)
    on delete cascade,
  unique (batch_id, source_row),
  unique (batch_id, source_hash)
);

create index journal_import_rows_user_batch_idx
  on public.journal_import_rows (user_id, batch_id, source_row);

create table public.journal_sync_manifests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  revision bigint not null check (revision >= 0),
  projection_version integer not null check (projection_version = 1),
  storage_schema_version integer not null check (storage_schema_version > 0),
  checksum_algorithm text not null default 'sha256' check (checksum_algorithm = 'sha256'),
  dataset_sha256 text not null check (dataset_sha256 ~ '^[0-9a-f]{64}$'),
  account_count integer not null check (account_count >= 0),
  trade_count integer not null check (trade_count >= 0),
  execution_count integer not null check (execution_count >= 0),
  eligible_r_count integer not null check (eligible_r_count >= 0 and eligible_r_count <= trade_count),
  net_r numeric not null,
  account_fingerprints jsonb not null check (jsonb_typeof(account_fingerprints) = 'array'),
  client_saved_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, revision)
);

create index journal_sync_manifests_user_revision_idx
  on public.journal_sync_manifests (user_id, revision desc);

alter table public.journal_accounts enable row level security;
alter table public.journal_trades enable row level security;
alter table public.journal_executions enable row level security;
alter table public.journal_import_batches enable row level security;
alter table public.journal_import_rows enable row level security;
alter table public.journal_sync_manifests enable row level security;

create policy journal_accounts_select_own on public.journal_accounts
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy journal_accounts_insert_own on public.journal_accounts
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy journal_accounts_update_own on public.journal_accounts
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy journal_accounts_delete_own on public.journal_accounts
  for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy journal_trades_select_own on public.journal_trades
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy journal_trades_insert_own on public.journal_trades
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy journal_trades_update_own on public.journal_trades
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy journal_trades_delete_own on public.journal_trades
  for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy journal_executions_select_own on public.journal_executions
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy journal_executions_insert_own on public.journal_executions
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy journal_import_batches_select_own on public.journal_import_batches
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy journal_import_batches_insert_own on public.journal_import_batches
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy journal_import_batches_update_own on public.journal_import_batches
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy journal_import_batches_delete_own on public.journal_import_batches
  for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy journal_import_rows_select_own on public.journal_import_rows
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy journal_import_rows_insert_own on public.journal_import_rows
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy journal_sync_manifests_select_own on public.journal_sync_manifests
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy journal_sync_manifests_insert_own on public.journal_sync_manifests
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- The April 2026 Data API default no longer guarantees implicit table grants.
-- Make the intended authenticated-only surface explicit and reviewable.
revoke all on table
  public.journal_accounts,
  public.journal_trades,
  public.journal_executions,
  public.journal_import_batches,
  public.journal_import_rows,
  public.journal_sync_manifests
from public, anon, authenticated;

grant select, insert, update, delete on table
  public.journal_accounts,
  public.journal_trades,
  public.journal_import_batches
to authenticated;

-- Evidence leaves are append-only through the authenticated Data API. Complete
-- owned parents may still be deleted, allowing their declared cascades to run.
grant select, insert on table
  public.journal_executions,
  public.journal_import_rows,
  public.journal_sync_manifests
to authenticated;
