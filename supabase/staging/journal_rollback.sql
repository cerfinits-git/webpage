-- Staging rollback only. Back up and reconcile checksums before using this.
-- Never run against production without the separate G5 confirmation gate.

drop table if exists public.journal_sync_manifests;
drop table if exists public.journal_import_rows;
drop table if exists public.journal_import_batches;
drop table if exists public.journal_executions;
drop table if exists public.journal_trades;
drop table if exists public.journal_accounts;

