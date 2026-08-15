-- Newsletter signups (marketing site). Run once in the Supabase SQL editor.
--
-- Security model: the anon key may INSERT and nothing else. No select/update/
-- delete policies exist, so the public API can never read the list back —
-- view signups in the dashboard Table Editor. Worst case if the anon key
-- leaks (it is public by design): junk inserts, deduped by the unique email.

create table public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique
    check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  created_at timestamptz not null default now()
);

alter table public.newsletter_signups enable row level security;

create policy "anon insert only" on public.newsletter_signups
  for insert to anon with check (true);
