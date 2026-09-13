-- DONE WELL School Support Platform -- initial real-accounts schema.
--
-- Scope (deliberately): who people are and their personal records —
-- schools, profiles, parent-child links, per-topic progress. The
-- curriculum itself (subjects, topics, questions, resources, worked
-- examples) stays static content bundled into the app's JS, same as the
-- demo -- it isn't user data and doesn't need a database table.
--
-- How to apply: paste this whole file into the Supabase SQL Editor
-- (left sidebar -> SQL Editor -> New query) and run it. Every statement
-- here is written to be safe to re-run: if a previous attempt partially
-- succeeded (e.g. errored out partway through), running this again picks
-- up wherever it left off instead of erroring on "already exists" and
-- aborting before reaching the rest.

do $$ begin
  create type public.user_role as enum ('learner', 'parent', 'teacher', 'school');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- One row per authenticated person, 1:1 with auth.users.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  full_name text not null,
  school_id uuid references public.schools (id) on delete set null,
  grade smallint check (grade in (10, 11, 12)),
  subject_id text,
  created_at timestamptz not null default now()
);

-- A parent can be linked to one or more learners (e.g. siblings).
create table if not exists public.parent_learner_links (
  parent_id uuid not null references public.profiles (id) on delete cascade,
  learner_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (parent_id, learner_id)
);

-- Per-learner, per-topic mastery. topic_id matches the static topic ids
-- used in the app's bundled curriculum data (e.g. 'finance', 'math-algebra').
create table if not exists public.learner_progress (
  learner_id uuid not null references public.profiles (id) on delete cascade,
  topic_id text not null,
  mastery_percent smallint not null default 0 check (mastery_percent between 0 and 100),
  questions_attempted integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (learner_id, topic_id)
);

alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.parent_learner_links enable row level security;
alter table public.learner_progress enable row level security;

-- security definer avoids the classic RLS self-recursion trap when a
-- profiles policy needs to compare against the current user's own row.
create or replace function public.current_school_id()
returns uuid
language sql
security definer
stable
as $$
  select school_id from public.profiles where id = auth.uid();
$$;

-- schools --------------------------------------------------------------

-- Any signed-in user can look up schools by name (needed during onboarding,
-- before their own profile/school_id exists yet -- a school's name isn't
-- sensitive, and this is what lets a second teacher from the same school
-- find it instead of accidentally creating a duplicate).
drop policy if exists "Signed-in users can view schools" on public.schools;
create policy "Signed-in users can view schools"
  on public.schools for select
  using (auth.uid() is not null);

drop policy if exists "A signed-in user can create a school" on public.schools;
create policy "A signed-in user can create a school"
  on public.schools for insert
  with check (auth.uid() is not null);

-- profiles -------------------------------------------------------------

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (id = auth.uid());

drop policy if exists "Users can view profiles at their own school" on public.profiles;
create policy "Users can view profiles at their own school"
  on public.profiles for select
  using (school_id is not null and school_id = public.current_school_id());

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
  on public.profiles for insert
  with check (id = auth.uid());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid());

-- parent_learner_links ---------------------------------------------------

drop policy if exists "Parents can view their own links" on public.parent_learner_links;
create policy "Parents can view their own links"
  on public.parent_learner_links for select
  using (parent_id = auth.uid());

drop policy if exists "Learners can view who is linked to them" on public.parent_learner_links;
create policy "Learners can view who is linked to them"
  on public.parent_learner_links for select
  using (learner_id = auth.uid());

drop policy if exists "Parents can create their own links" on public.parent_learner_links;
create policy "Parents can create their own links"
  on public.parent_learner_links for insert
  with check (parent_id = auth.uid());

-- learner_progress -------------------------------------------------------

drop policy if exists "Learners can view their own progress" on public.learner_progress;
create policy "Learners can view their own progress"
  on public.learner_progress for select
  using (learner_id = auth.uid());

drop policy if exists "Learners can record their own progress" on public.learner_progress;
create policy "Learners can record their own progress"
  on public.learner_progress for insert
  with check (learner_id = auth.uid());

drop policy if exists "Learners can update their own progress" on public.learner_progress;
create policy "Learners can update their own progress"
  on public.learner_progress for update
  using (learner_id = auth.uid());

drop policy if exists "Linked parents can view their learner's progress" on public.learner_progress;
create policy "Linked parents can view their learner's progress"
  on public.learner_progress for select
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = learner_progress.learner_id
      and parent_learner_links.parent_id = auth.uid()
    )
  );

drop policy if exists "School members can view progress within their school" on public.learner_progress;
create policy "School members can view progress within their school"
  on public.learner_progress for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = learner_progress.learner_id
      and profiles.school_id = public.current_school_id()
    )
  );

-- A linked parent also needs to see their child's name/grade/subject, not
-- just their progress rows (the policy above only covers learner_progress).
drop policy if exists "Linked parents can view their child's profile" on public.profiles;
create policy "Linked parents can view their child's profile"
  on public.profiles for select
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = profiles.id
      and parent_learner_links.parent_id = auth.uid()
    )
  );

-- Parents link a child themselves, by pasting the exact "family link code"
-- (the child's own profile id) shown on the learner's real dashboard. This
-- runs as the function owner (security definer) so it can look the code up
-- without needing a broad "any parent can browse all learners" policy --
-- the only profile row a parent can ever reach this way is the one whose
-- exact id they were given directly by their own child.
create or replace function public.link_child(learner_code text)
returns table (learner_id uuid, learner_full_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_learner_id uuid;
  v_full_name text;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'parent') then
    raise exception 'Only parent accounts can link a child.';
  end if;

  if learner_code !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    raise exception 'That code doesn''t look right. Copy it exactly from your child''s dashboard.';
  end if;

  select id, full_name into v_learner_id, v_full_name
  from public.profiles
  where id = learner_code::uuid and role = 'learner';

  if v_learner_id is null then
    raise exception 'No learner found with that code. Double-check it with your child.';
  end if;

  insert into public.parent_learner_links (parent_id, learner_id)
  values (auth.uid(), v_learner_id)
  on conflict (parent_id, learner_id) do nothing;

  return query select v_learner_id, v_full_name;
end;
$$;

grant execute on function public.link_child(text) to authenticated;

-- ============================================================================
-- POPIA: consent, the right to withdraw a link, and the right to be deleted
-- ============================================================================
--
-- Grades 10 to 12 means learners are typically 15 to 18, so most are children
-- in POPIA's sense. Section 35 prohibits processing a child's personal
-- information without the consent of a competent person -- a parent or legal
-- guardian. Onboarding therefore has to capture that consent and this table
-- has to record it, because an unrecorded consent is not one you can show the
-- Information Regulator.
--
-- notice_version pins which POPIA notice the person actually agreed to, so a
-- later rewrite of that notice does not silently reinterpret an old consent.

create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  -- 'guardian' when a parent or guardian consented for a learner under 18,
  -- 'self' when the data subject is 18 or older and consented directly.
  kind text not null check (kind in ('guardian', 'self')),
  notice_version text not null,
  guardian_name text,
  guardian_email text,
  granted_at timestamptz not null default now(),
  withdrawn_at timestamptz
);

create index if not exists consents_profile_id_idx on public.consents (profile_id);

alter table public.consents enable row level security;

drop policy if exists "Users can view their own consent records" on public.consents;
create policy "Users can view their own consent records"
  on public.consents for select
  using (profile_id = auth.uid());

drop policy if exists "Users can record their own consent" on public.consents;
create policy "Users can record their own consent"
  on public.consents for insert
  with check (profile_id = auth.uid());

-- A linked parent must be able to see, and withdraw, the consent they gave.
drop policy if exists "Linked parents can view their child's consent records" on public.consents;
create policy "Linked parents can view their child's consent records"
  on public.consents for select
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = consents.profile_id
      and parent_learner_links.parent_id = auth.uid()
    )
  );

-- Withdrawing consent is a POPIA right, so the row must be updatable by the
-- data subject and by a linked parent. The row is never deleted: when the
-- consent was withdrawn is itself part of the record.
drop policy if exists "Users can withdraw their own consent" on public.consents;
create policy "Users can withdraw their own consent"
  on public.consents for update
  using (profile_id = auth.uid());

drop policy if exists "Linked parents can withdraw consent for their child" on public.consents;
create policy "Linked parents can withdraw consent for their child"
  on public.consents for update
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = consents.profile_id
      and parent_learner_links.parent_id = auth.uid()
    )
  );

-- parent_learner_links: the missing DELETE ---------------------------------
--
-- The original policies allowed a parent to create a link and both sides to
-- see it, but nobody to remove one, so a link between a parent and a child was
-- permanent. A learner has to be able to cut a link to their own records, and
-- a parent has to be able to give one up.

drop policy if exists "Parents can remove their own links" on public.parent_learner_links;
create policy "Parents can remove their own links"
  on public.parent_learner_links for delete
  using (parent_id = auth.uid());

drop policy if exists "Learners can remove a link to themselves" on public.parent_learner_links;
create policy "Learners can remove a link to themselves"
  on public.parent_learner_links for delete
  using (learner_id = auth.uid());

-- profiles: the right to deletion -------------------------------------------
--
-- Section 24 gives a data subject the right to have their personal information
-- deleted. Deleting the profile row cascades to learner_progress, to
-- parent_learner_links on both sides, and to consents, because each of those
-- references profiles with on delete cascade.
--
-- Note what this does NOT remove: the row in auth.users, which holds the email
-- address. Deleting that requires the service role, so a full erasure request
-- has to be completed by the Information Officer. delete_my_account() below
-- removes everything reachable from the browser and is honest about the rest.

drop policy if exists "Users can delete their own profile" on public.profiles;
create policy "Users can delete their own profile"
  on public.profiles for delete
  using (id = auth.uid());

-- One call so a deletion cannot half-succeed: either every table the person
-- appears in is cleared, or none is.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in.';
  end if;

  delete from public.learner_progress where learner_id = auth.uid();
  delete from public.parent_learner_links where parent_id = auth.uid() or learner_id = auth.uid();
  delete from public.consents where profile_id = auth.uid();
  delete from public.profiles where id = auth.uid();
end;
$$;

grant execute on function public.delete_my_account() to authenticated;
