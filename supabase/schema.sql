-- DONE WELL School Support Platform -- initial real-accounts schema.
--
-- Scope (deliberately): who people are and their personal records —
-- schools, profiles, parent-child links, per-topic progress. The
-- curriculum itself (subjects, topics, questions, resources, worked
-- examples) stays static content bundled into the app's JS, same as the
-- demo -- it isn't user data and doesn't need a database table.
--
-- How to apply: paste this whole file into the Supabase SQL Editor
-- (left sidebar -> SQL Editor -> New query) and run it once. Safe to
-- re-run on a fresh project; it will error harmlessly if objects already
-- exist, which just means it already ran.

create type public.user_role as enum ('learner', 'parent', 'teacher', 'school');

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- One row per authenticated person, 1:1 with auth.users.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  full_name text not null,
  school_id uuid references public.schools (id) on delete set null,
  grade smallint check (grade in (10, 11, 12)),
  subject_id text,
  created_at timestamptz not null default now()
);

-- A parent can be linked to one or more learners (e.g. siblings).
create table public.parent_learner_links (
  parent_id uuid not null references public.profiles (id) on delete cascade,
  learner_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (parent_id, learner_id)
);

-- Per-learner, per-topic mastery. topic_id matches the static topic ids
-- used in the app's bundled curriculum data (e.g. 'finance', 'math-algebra').
create table public.learner_progress (
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
create policy "Signed-in users can view schools"
  on public.schools for select
  using (auth.uid() is not null);

create policy "A signed-in user can create a school"
  on public.schools for insert
  with check (auth.uid() is not null);

-- profiles -------------------------------------------------------------

create policy "Users can view their own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can view profiles at their own school"
  on public.profiles for select
  using (school_id is not null and school_id = public.current_school_id());

create policy "Users can create their own profile"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid());

-- parent_learner_links ---------------------------------------------------

create policy "Parents can view their own links"
  on public.parent_learner_links for select
  using (parent_id = auth.uid());

create policy "Learners can view who is linked to them"
  on public.parent_learner_links for select
  using (learner_id = auth.uid());

create policy "Parents can create their own links"
  on public.parent_learner_links for insert
  with check (parent_id = auth.uid());

-- learner_progress -------------------------------------------------------

create policy "Learners can view their own progress"
  on public.learner_progress for select
  using (learner_id = auth.uid());

create policy "Learners can record their own progress"
  on public.learner_progress for insert
  with check (learner_id = auth.uid());

create policy "Learners can update their own progress"
  on public.learner_progress for update
  using (learner_id = auth.uid());

create policy "Linked parents can view their learner's progress"
  on public.learner_progress for select
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = learner_progress.learner_id
      and parent_learner_links.parent_id = auth.uid()
    )
  );

create policy "School members can view progress within their school"
  on public.learner_progress for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = learner_progress.learner_id
      and profiles.school_id = public.current_school_id()
    )
  );
