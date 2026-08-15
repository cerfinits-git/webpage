-- Attribution columns for newsletter signups. Run once in the Supabase SQL
-- editor, before the first /quiz post goes out.
--
-- Why: the site has no analytics, so these two columns are the only way to
-- tell where a signup came from. The quiz kill criteria (spec
-- docs/2026-08-14-trader-archetype-quiz-spec.md) are counted off this table.
--
-- Safe to run on the live project: both columns are nullable with no default,
-- so existing rows keep working and nothing is rewritten. The app already
-- falls back to writing email-only if these columns are missing, so running
-- this late loses attribution but never loses a signup.

alter table public.newsletter_signups
  add column if not exists source text,
  add column if not exists archetype text;

-- Only the sixteen codes the quiz can produce, so a leaked anon key cannot
-- fill the column with junk. NULL stays allowed for signups from anywhere
-- else (the plain newsletter form writes no archetype).
--
-- Keep this list in step with ARCHETYPES in lib/grade/archetypes.ts — a code
-- the constraint rejects is a signup silently lost.
alter table public.newsletter_signups
  drop constraint if exists newsletter_signups_archetype_check;

alter table public.newsletter_signups
  add constraint newsletter_signups_archetype_check
  check (
    archetype is null
    or archetype in (
      'CSKO', 'CSKG', 'CSRO', 'CSRG',
      'CIKO', 'CIKG', 'CIRO', 'CIRG',
      'HSKO', 'HSKG', 'HSRO', 'HSRG',
      'HIKO', 'HIKG', 'HIRO', 'HIRG'
    )
  );

-- นับผลตาม kill criteria: โพสต์ 3 ครั้งใน 30 วัน แล้วต่ำกว่า 30 = หยุด
--
--   select count(*) from public.newsletter_signups where source = 'quiz';
--
--   select archetype, count(*)
--   from public.newsletter_signups
--   where source = 'quiz'
--   group by archetype
--   order by count(*) desc;

-- Which consent wording the subscriber agreed to. PDPA s.19 puts the burden of
-- proving consent on the controller, and "they ticked a box" is not proof
-- unless the box can be named. Bump CONSENT_VERSION in lib/legal.ts whenever
-- the sentence next to the checkbox changes.
alter table public.newsletter_signups
  add column if not exists consent_version text;
