import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const sql = readFileSync(
  new URL("../../supabase/staging/journal_schema.sql", import.meta.url),
  "utf8",
);

test("staging SQL keeps demo seed outside the remote source allowlist", () => {
  assert.match(sql, /source in \('manual', 'ctrader-csv'\)/);
  assert.doesNotMatch(sql, /source in \([^)]*'seed'/);
});

test("staging sync manifest matches the whole-Journal v1 contract", () => {
  const manifest = sql.slice(
    sql.indexOf("create table public.journal_sync_manifests"),
    sql.indexOf("alter table public.journal_accounts enable row level security"),
  );

  assert.match(manifest, /projection_version integer not null check \(projection_version = 1\)/);
  assert.match(manifest, /storage_schema_version integer not null check \(storage_schema_version > 0\)/);
  assert.match(manifest, /checksum_algorithm text not null default 'sha256'/);
  assert.match(manifest, /account_count integer not null/);
  assert.match(manifest, /execution_count integer not null/);
  assert.match(manifest, /account_fingerprints jsonb not null/);
  assert.match(manifest, /unique \(user_id, revision\)/);
  assert.doesNotMatch(manifest, /account_id uuid/);
});

test("staging evidence leaves expose select and insert only", () => {
  const grant = /grant select, insert on table[\s\S]+public\.journal_executions,[\s\S]+public\.journal_import_rows,[\s\S]+public\.journal_sync_manifests[\s\S]+to authenticated;/;
  assert.match(sql, grant);

  for (const table of ["journal_executions", "journal_import_rows", "journal_sync_manifests"]) {
    assert.doesNotMatch(sql, new RegExp(`create policy ${table}_delete_own`));
    assert.doesNotMatch(sql, new RegExp(`create policy ${table}_update_own`));
  }
});

test("all Journal staging tables retain RLS declarations", () => {
  for (const table of [
    "journal_accounts",
    "journal_trades",
    "journal_executions",
    "journal_import_batches",
    "journal_import_rows",
    "journal_sync_manifests",
  ]) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security;`));
  }
});
