begin;

create extension if not exists pgtap with schema extensions;

select plan(48);

select has_table('public', 'journal_accounts', 'journal_accounts exists');
select has_table('public', 'journal_trades', 'journal_trades exists');
select has_table('public', 'journal_executions', 'journal_executions exists');
select has_table('public', 'journal_import_batches', 'journal_import_batches exists');
select has_table('public', 'journal_import_rows', 'journal_import_rows exists');
select has_table('public', 'journal_sync_manifests', 'journal_sync_manifests exists');

select ok(
  (select relrowsecurity from pg_class where oid = 'public.journal_accounts'::regclass),
  'RLS is enabled on journal_accounts'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.journal_trades'::regclass),
  'RLS is enabled on journal_trades'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.journal_executions'::regclass),
  'RLS is enabled on journal_executions'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.journal_import_batches'::regclass),
  'RLS is enabled on journal_import_batches'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.journal_import_rows'::regclass),
  'RLS is enabled on journal_import_rows'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.journal_sync_manifests'::regclass),
  'RLS is enabled on journal_sync_manifests'
);

select ok(
  not has_table_privilege('anon', 'public.journal_accounts', 'SELECT'),
  'anon cannot select Journal accounts'
);
select ok(
  not has_table_privilege('authenticated', 'public.journal_executions', 'DELETE'),
  'authenticated cannot directly delete execution evidence'
);
select ok(
  not has_table_privilege('authenticated', 'public.journal_import_rows', 'DELETE'),
  'authenticated cannot directly delete import evidence rows'
);
select ok(
  not has_table_privilege('authenticated', 'public.journal_sync_manifests', 'DELETE'),
  'authenticated cannot directly delete sync manifests'
);
select ok(
  not has_table_privilege('authenticated', 'public.journal_executions', 'UPDATE'),
  'authenticated cannot directly update execution evidence'
);
select ok(
  not has_table_privilege('authenticated', 'public.journal_import_rows', 'UPDATE'),
  'authenticated cannot directly update import evidence rows'
);
select ok(
  not has_table_privilege('authenticated', 'public.journal_sync_manifests', 'UPDATE'),
  'authenticated cannot directly update sync manifests'
);

insert into auth.users (id, email)
values
  ('11111111-1111-4111-8111-111111111111', 'owner@example.com'),
  ('22222222-2222-4222-8222-222222222222', 'other@example.com');

insert into public.journal_accounts (
  id, user_id, client_id, name, broker, base_currency, reporting_timezone
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'ctrader-demo-01', 'Demo 01', 'cTrader', 'THB', 'Asia/Bangkok'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '22222222-2222-4222-8222-222222222222',
    'other-demo', 'Other demo', 'cTrader', 'USD', 'UTC'
  );

insert into public.journal_trades (
  id, user_id, account_id, client_id, symbol, side, opened_at, closed_at,
  quantity, average_entry, average_exit, gross_pnl, commission_pnl, swap_pnl,
  net_pnl, source
)
values
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'owner-trade-1', 'XAUUSD', 'buy',
    '2026-07-14T01:00:00Z', '2026-07-14T02:00:00Z',
    1, 2400, 2410, 102, -2, 0, 100, 'manual'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    '22222222-2222-4222-8222-222222222222',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'other-trade-1', 'EURUSD', 'sell',
    '2026-07-14T01:00:00Z', '2026-07-14T02:00:00Z',
    1, 1.10, 1.09, 51, -1, 0, 50, 'manual'
  );

insert into public.journal_executions (
  id, user_id, trade_id, client_id, execution_type, side, executed_at,
  quantity, price, fee, commission_pnl, swap_pnl
)
values (
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  '22222222-2222-4222-8222-222222222222',
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  'other-execution-1', 'exit', 'buy', '2026-07-14T02:00:00Z',
  1, 1.09, 1, -1, 0
);

insert into public.journal_import_batches (
  id, user_id, account_id, file_name, file_sha256, mapping_version, status
)
values (
  'ffffffff-ffff-4fff-8fff-ffffffffffff',
  '22222222-2222-4222-8222-222222222222',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'other.csv', repeat('a', 64), 1, 'committed'
);

insert into public.journal_import_rows (
  id, user_id, batch_id, source_row, source_hash, classification, raw_evidence
)
values (
  '12121212-1212-4121-8121-121212121212',
  '22222222-2222-4222-8222-222222222222',
  'ffffffff-ffff-4fff-8fff-ffffffffffff',
  1, 'other-row-hash', 'ready', '{"symbol":"EURUSD"}'::jsonb
);

insert into public.journal_sync_manifests (
  id, user_id, revision, projection_version, storage_schema_version,
  checksum_algorithm, dataset_sha256, account_count, trade_count,
  execution_count, eligible_r_count, net_r, account_fingerprints,
  client_saved_at
)
values (
  '34343434-3434-4343-8343-343434343434',
  '22222222-2222-4222-8222-222222222222',
  0, 1, 5, 'sha256', repeat('b', 64), 1, 1, 1, 0, 0,
  '[{"accountClientId":"other-demo"}]'::jsonb,
  '2026-07-14T02:00:00Z'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select is(
  (select count(*)::integer from public.journal_accounts),
  1,
  'owner sees only their account'
);

select is(
  (select count(*)::integer from public.journal_trades),
  1,
  'owner sees only their trade'
);

select lives_ok(
  $$insert into public.journal_trades (
    user_id, account_id, client_id, symbol, side, opened_at, closed_at,
    quantity, average_entry, average_exit, gross_pnl, commission_pnl,
    swap_pnl, net_pnl, source
  ) values (
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'owner-trade-2', 'EURUSD', 'sell',
    '2026-07-14T03:00:00Z', '2026-07-14T04:00:00Z',
    1, 1.10, 1.09, 51, -1, 0, 50, 'manual'
  )$$,
  'owner can insert a reconciled trade'
);

select throws_ok(
  $$insert into public.journal_accounts (
    user_id, client_id, name, broker, base_currency, reporting_timezone
  ) values (
    '22222222-2222-4222-8222-222222222222',
    'forged', 'Forged', 'cTrader', 'USD', 'UTC'
  )$$,
  '42501',
  'new row violates row-level security policy for table "journal_accounts"',
  'owner cannot insert an account for another user'
);

select throws_ok(
  $$
    update public.journal_accounts
    set user_id = '22222222-2222-4222-8222-222222222222'
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  $$,
  '42501',
  'new row violates row-level security policy for table "journal_accounts"',
  'owner cannot reassign account ownership'
);

select lives_ok(
  $$insert into public.journal_executions (
    user_id, trade_id, client_id, execution_type, side, executed_at,
    quantity, price, fee, commission_pnl, swap_pnl
  ) values (
    '11111111-1111-4111-8111-111111111111',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'owner-execution-1', 'exit', 'sell', '2026-07-14T02:00:00Z',
    1, 2410, 2, -2, 0
  )$$,
  'owner can attach execution evidence to their trade'
);

select is(
  (select count(*)::integer from public.journal_executions),
  1,
  'owner sees only their execution evidence'
);

select throws_ok(
  $$insert into public.journal_executions (
    user_id, trade_id, client_id, execution_type, side, executed_at,
    quantity, price
  ) values (
    '22222222-2222-4222-8222-222222222222',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'forged-execution', 'exit', 'sell', '2026-07-14T02:00:00Z', 1, 2410
  )$$,
  '42501',
  'new row violates row-level security policy for table "journal_executions"',
  'owner cannot forge another user on execution evidence'
);

select throws_ok(
  $$insert into public.journal_trades (
    user_id, account_id, client_id, symbol, side, opened_at, closed_at,
    quantity, average_entry, average_exit, gross_pnl, commission_pnl,
    swap_pnl, net_pnl, source
  ) values (
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'bad-pnl', 'XAUUSD', 'buy',
    '2026-07-14T03:00:00Z', '2026-07-14T04:00:00Z',
    1, 2400, 2410, 100, -2, 0, 100, 'manual'
  )$$,
  '23514',
  'new row for relation "journal_trades" violates check constraint "journal_trades_pnl_reconciles"',
  'P&L mismatch is rejected'
);

select throws_ok(
  $$insert into public.journal_trades (
    user_id, account_id, client_id, symbol, side, opened_at, closed_at,
    quantity, average_entry, average_exit, initial_risk_amount,
    gross_pnl, commission_pnl, swap_pnl, net_pnl, source
  ) values (
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'bad-risk', 'XAUUSD', 'buy',
    '2026-07-14T03:00:00Z', '2026-07-14T04:00:00Z',
    1, 2400, 2410, 0, 102, -2, 0, 100, 'manual'
  )$$,
  '23514',
  'new row for relation "journal_trades" violates check constraint "journal_trades_initial_risk_amount_check"',
  'zero initial risk is rejected'
);

select throws_ok(
  $$insert into public.journal_trades (
    user_id, account_id, client_id, symbol, side, opened_at, closed_at,
    quantity, average_entry, average_exit, gross_pnl, net_pnl, source
  ) values (
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'seed-is-local-only', 'XAUUSD', 'buy',
    '2026-07-14T03:00:00Z', '2026-07-14T04:00:00Z',
    1, 2400, 2410, 100, 100, 'seed'
  )$$,
  '23514',
  'new row for relation "journal_trades" violates check constraint "journal_trades_source_check"',
  'browser demo seed cannot be stored as remote evidence'
);

select lives_ok(
  $$insert into public.journal_import_batches (
    id, user_id, account_id, file_name, file_sha256, mapping_version, status
  ) values (
    'abababab-abab-4aba-8aba-abababababab',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'owner.csv', repeat('c', 64), 1, 'committed'
  )$$,
  'owner can insert an import batch'
);

select lives_ok(
  $$insert into public.journal_import_rows (
    id, user_id, batch_id, source_row, source_hash, classification, raw_evidence
  ) values (
    'acacacac-acac-4aca-8aca-acacacacacac',
    '11111111-1111-4111-8111-111111111111',
    'abababab-abab-4aba-8aba-abababababab',
    1, 'owner-row-hash', 'ready', '{"symbol":"XAUUSD"}'::jsonb
  )$$,
  'owner can insert import evidence'
);

select is(
  (select count(*)::integer from public.journal_import_rows),
  1,
  'owner sees only their import evidence'
);

select throws_ok(
  $$insert into public.journal_import_rows (
    user_id, batch_id, source_row, source_hash, classification, raw_evidence
  ) values (
    '22222222-2222-4222-8222-222222222222',
    'abababab-abab-4aba-8aba-abababababab',
    2, 'forged-row-hash', 'ready', '{}'::jsonb
  )$$,
  '42501',
  'new row violates row-level security policy for table "journal_import_rows"',
  'owner cannot forge another user on import evidence'
);

select lives_ok(
  $$insert into public.journal_sync_manifests (
    id, user_id, revision, projection_version, storage_schema_version,
    checksum_algorithm, dataset_sha256, account_count, trade_count,
    execution_count, eligible_r_count, net_r, account_fingerprints,
    client_saved_at
  ) values (
    'adadadad-adad-4ada-8ada-adadadadadad',
    '11111111-1111-4111-8111-111111111111',
    1, 1, 5, 'sha256', repeat('d', 64), 1, 2, 1, 0, 0,
    '[{"accountClientId":"ctrader-demo-01"}]'::jsonb,
    '2026-07-14T04:00:00Z'
  )$$,
  'owner can append a whole-Journal sync manifest'
);

select is(
  (select count(*)::integer from public.journal_sync_manifests),
  1,
  'owner sees only their sync manifest'
);

select throws_ok(
  $$insert into public.journal_sync_manifests (
    user_id, revision, projection_version, storage_schema_version,
    dataset_sha256, account_count, trade_count, execution_count,
    eligible_r_count, net_r, account_fingerprints, client_saved_at
  ) values (
    '22222222-2222-4222-8222-222222222222',
    1, 1, 5, repeat('e', 64), 0, 0, 0, 0, 0, '[]'::jsonb, now()
  )$$,
  '42501',
  'new row violates row-level security policy for table "journal_sync_manifests"',
  'owner cannot append a manifest for another user'
);

select throws_ok(
  $$insert into public.journal_sync_manifests (
    user_id, revision, projection_version, storage_schema_version,
    dataset_sha256, account_count, trade_count, execution_count,
    eligible_r_count, net_r, account_fingerprints, client_saved_at
  ) values (
    '11111111-1111-4111-8111-111111111111',
    2, 2, 5, repeat('f', 64), 0, 0, 0, 0, 0, '[]'::jsonb, now()
  )$$,
  '23514',
  'new row for relation "journal_sync_manifests" violates check constraint "journal_sync_manifests_projection_version_check"',
  'unsupported projection version is rejected'
);

select throws_ok(
  $$insert into public.journal_sync_manifests (
    user_id, revision, projection_version, storage_schema_version,
    checksum_algorithm, dataset_sha256, account_count, trade_count,
    execution_count, eligible_r_count, net_r, account_fingerprints,
    client_saved_at
  ) values (
    '11111111-1111-4111-8111-111111111111',
    3, 1, 5, 'md5', repeat('1', 64), 0, 0, 0, 0, 0, '[]'::jsonb, now()
  )$$,
  '23514',
  'new row for relation "journal_sync_manifests" violates check constraint "journal_sync_manifests_checksum_algorithm_check"',
  'unsupported checksum algorithm is rejected'
);

select throws_ok(
  $$insert into public.journal_sync_manifests (
    user_id, revision, projection_version, storage_schema_version,
    dataset_sha256, account_count, trade_count, execution_count,
    eligible_r_count, net_r, account_fingerprints, client_saved_at
  ) values (
    '11111111-1111-4111-8111-111111111111',
    4, 1, 5, repeat('2', 64), 0, 0, 0, 0, 0, '{}'::jsonb, now()
  )$$,
  '23514',
  'new row for relation "journal_sync_manifests" violates check constraint "journal_sync_manifests_account_fingerprints_check"',
  'manifest account fingerprints must be an array'
);

select throws_ok(
  $$delete from public.journal_executions
    where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'$$,
  '42501',
  'permission denied for table journal_executions',
  'execution evidence cannot be directly deleted'
);

select throws_ok(
  $$delete from public.journal_import_rows
    where id = 'acacacac-acac-4aca-8aca-acacacacacac'$$,
  '42501',
  'permission denied for table journal_import_rows',
  'import evidence cannot be directly deleted'
);

select throws_ok(
  $$delete from public.journal_sync_manifests
    where id = 'adadadad-adad-4ada-8ada-adadadadadad'$$,
  '42501',
  'permission denied for table journal_sync_manifests',
  'sync manifests cannot be directly deleted'
);

select lives_ok(
  $$delete from public.journal_trades
    where id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'$$,
  'owner can delete a complete trade lifecycle'
);

select is(
  (select count(*)::integer from public.journal_executions
    where trade_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'),
  0,
  'deleting an owned trade cascades all of its execution evidence'
);

select lives_ok(
  $$delete from public.journal_import_batches
    where id = 'abababab-abab-4aba-8aba-abababababab'$$,
  'owner can delete a complete import batch'
);

select is(
  (select count(*)::integer from public.journal_import_rows
    where batch_id = 'abababab-abab-4aba-8aba-abababababab'),
  0,
  'deleting an owned batch cascades all of its import evidence'
);

reset role;

select is(
  (select count(*)::integer from public.journal_accounts
    where user_id = '22222222-2222-4222-8222-222222222222'),
  1,
  'negative RLS and owner lifecycle tests did not mutate the other account'
);

select * from finish();
rollback;
