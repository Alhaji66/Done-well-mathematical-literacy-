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

-- Is the current user staff -- teacher or school -- at this school?
-- Defined here because the progress policy below needs it. security definer so
-- it can read profiles without tripping the RLS on profiles itself.
create or replace function public.is_school_staff(p_school_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and school_id = p_school_id
      and role in ('teacher', 'school')
  );
$$;

-- STAFF, not "school members". The original policy asked only whether the
-- progress row belonged to someone at the viewer's school, and never whether
-- the VIEWER was a teacher. Postgres ORs permissive policies together, so every
-- learner passed it and could read every classmate's mastery record. Caught by
-- running the policies against a real database with two learners in one school.
-- That is other people's personal information under POPIA, so the role test is
-- not a refinement.
drop policy if exists "School members can view progress within their school" on public.learner_progress;
drop policy if exists "Staff can view progress within their school" on public.learner_progress;
create policy "Staff can view progress within their school"
  on public.learner_progress for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = learner_progress.learner_id
      and profiles.school_id = public.current_school_id()
    )
    and public.is_school_staff(public.current_school_id())
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

-- ============================================================================
-- SCHOOL JOIN CODES
-- ============================================================================
--
-- WHAT WENT WRONG. Onboarding matched a school by the name the person typed:
--
--     select id from schools where name ilike '<what they typed>'
--
-- and created a new school when nothing matched. In a live test that failed in
-- both directions at once.
--
--   A teacher typing "Gojela High School" and a learner typing "Gojela High"
--   get two different rows, so two different school_id values. Every roster
--   query joins on school_id, and so does the "same school" RLS policy, so the
--   learner is invisible to their own teacher. That is exactly the reported
--   symptom: the learners who did sign in did not appear on the teacher's roll.
--
--   Worse, once two near-identical names exist, ilike matches BOTH and the
--   .maybeSingle() that follows errors out rather than returning a row. From
--   then on nobody at that school can finish onboarding at all -- they are
--   stuck on the profile screen, which a learner reports as "it won't let me
--   sign in", because from where they sit that is what it looks like.
--
-- THE FIX. A school is identified by a short code, not by spelling. The school
-- or the first teacher creates the school once and is shown its code; everyone
-- else joins with that code. Typing cannot fork a school any more, because
-- joining never creates one.
--
-- The alphabet omits O, 0, I and 1, which are the characters people mistype
-- when a code is read off a board or dictated across a classroom.

alter table public.schools add column if not exists join_code text;

create or replace function public.generate_join_code()
returns text
language plpgsql
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text;
  i integer;
begin
  loop
    result := '';
    for i in 1..6 loop
      result := result || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.schools where join_code = result);
  end loop;
  return result;
end;
$$;

-- Backfill: every school that predates this migration needs a code before the
-- column can be made NOT NULL.
update public.schools set join_code = public.generate_join_code() where join_code is null;

alter table public.schools alter column join_code set not null;

do $$ begin
  alter table public.schools add constraint schools_join_code_key unique (join_code);
exception
  when duplicate_table then null;
  when duplicate_object then null;
end $$;

create index if not exists schools_join_code_idx on public.schools (join_code);

-- Creating a school. security definer so the code is generated server-side and
-- the caller cannot choose their own; returns the code so the UI can show it.
create or replace function public.create_school(p_name text)
returns table (school_id uuid, school_name text, join_code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := btrim(p_name);
  v_id uuid;
  v_code text;
begin
  if auth.uid() is null then
    raise exception 'Not signed in.';
  end if;
  if v_name = '' then
    raise exception 'Please enter the school name.';
  end if;

  v_code := public.generate_join_code();

  insert into public.schools (name, join_code)
  values (v_name, v_code)
  returning id into v_id;

  return query select v_id, v_name, v_code;
end;
$$;

grant execute on function public.create_school(text) to authenticated;

-- Joining a school by code. Case- and space-insensitive, because the code gets
-- written on a board and read off a phone.
create or replace function public.join_school(p_code text)
returns table (school_id uuid, school_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
  v_id uuid;
  v_name text;
begin
  if auth.uid() is null then
    raise exception 'Not signed in.';
  end if;

  select id, name into v_id, v_name from public.schools where join_code = v_code;

  if v_id is null then
    raise exception 'No school found with the code %. Check it with your teacher.', v_code;
  end if;

  return query select v_id, v_name;
end;
$$;

grant execute on function public.join_school(text) to authenticated;

-- A school's own members need to read the code in order to hand it out. Nobody
-- else does: the original policy let ANY signed-in user select ANY school row,
-- which was harmless when the row held only a name and is not once it holds a
-- join code -- one account would have been enough to enumerate every school's
-- code and walk into its roster. Onboarding does not need this policy, because
-- looking a school up by code goes through join_school(), which is security
-- definer and returns nothing but the one school whose code was supplied.
drop policy if exists "Signed-in users can view schools" on public.schools;
drop policy if exists "Members can view their own school" on public.schools;
create policy "Members can view their own school"
  on public.schools for select
  using (id = public.current_school_id());

-- Direct inserts into schools are no longer how a school is made: create_school
-- is, so that a code is always generated. Dropping the old insert policy is
-- what stops a mistyped name silently forking a school again.
drop policy if exists "A signed-in user can create a school" on public.schools;

-- ---------------------------------------------------------------------------
-- MERGING SCHOOLS THAT WERE ALREADY FORKED BY THE OLD CODE
-- ---------------------------------------------------------------------------
--
-- Join codes stop new duplicates; they do not repair the rows a live test has
-- already created. Run this to find them:
--
--   select id, name, join_code,
--          (select count(*) from public.profiles p where p.school_id = s.id) as people
--   from public.schools s order by name;
--
-- Then, for each duplicate, move its people to the row you are keeping and
-- delete the empty one. Both ids come from the query above:
--
--   select public.merge_school('<duplicate id>', '<id to keep>');

create or replace function public.merge_school(p_from uuid, p_into uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_moved integer;
begin
  if p_from = p_into then
    raise exception 'Those are the same school.';
  end if;
  if not exists (select 1 from public.schools where id = p_into) then
    raise exception 'The school to merge into does not exist.';
  end if;

  update public.profiles set school_id = p_into where school_id = p_from;
  get diagnostics v_moved = row_count;

  delete from public.schools where id = p_from;
  return v_moved;
end;
$$;

-- Deliberately NOT granted to authenticated: this is an operator repair, run
-- from the SQL editor as the service role. A signed-in user must never be able
-- to move another school's people.
--
-- THE ONE-PASTE VERSION. Copying uuids by hand is miserable on a phone, which
-- is where a school administrator actually is, so this does the whole repair
-- with no ids: keep whichever school has the most people, move everyone else
-- into it, then show what is left. Run it ONLY when the listing above shows
-- rows that are all the same real school spelled differently.
--
--   do $$
--   declare
--     v_keep uuid;
--     v_ids uuid[];
--     v_id uuid;
--   begin
--     select s.id into v_keep
--     from public.schools s
--     order by (select count(*) from public.profiles p where p.school_id = s.id) desc,
--              s.created_at asc
--     limit 1;
--
--     if v_keep is null then
--       return;
--     end if;
--
--     select array_agg(id) into v_ids from public.schools where id <> v_keep;
--
--     if v_ids is null then
--       return;
--     end if;
--
--     foreach v_id in array v_ids loop
--       perform public.merge_school(v_id, v_keep);
--     end loop;
--   end $$;
--
--   select s.name, s.join_code,
--          (select count(*) from public.profiles p where p.school_id = s.id) as people
--   from public.schools s;
--
-- VERIFIED against Postgres 16 on a copy of the failure this was written for --
-- three schools ('Gojela High' 1 person, 'Gojela High School' 12, 'gojela high
-- school' 3) collapsing to one row of 16 with every profile still attached, and
-- on the three edge cases: a second run is a no-op, an empty schools table
-- returns cleanly rather than erroring, and a tie on headcount is broken by
-- created_at so the result is deterministic rather than arbitrary.

-- ============================================================================
-- WEEKLY TESTS
-- ============================================================================
--
-- Reported as "the weekly test is not activated". It was never built for real
-- accounts: the weekly tests visible in the app are static demo rows in
-- src/data/assessments.ts, shown only on the /app demo routes. On a real
-- account, Assessments is the practice-paper library -- a teacher could not set
-- a test and a learner could not sit one.
--
-- A related gap made this worse. The paper runner records what a learner has
-- attempted in the BROWSER's localStorage and nowhere else, so even the work
-- learners did do never reached their teacher. Attempts here are written to the
-- database, which is what makes a result something a teacher can act on.
--
-- WHAT IS DELIBERATELY NOT HERE: automatic marking. Almost every question in
-- this corpus is answered in prose against an NSC-style memo, not by picking an
-- option, so a machine cannot mark it. The learner marks their own work against
-- the memo, question by question, and the marks they award are recorded. That
-- is a real limitation and the teacher's view says so plainly rather than
-- presenting a self-awarded mark as though it were marked.
--
-- The questions themselves are NOT stored. They are drawn from the bundled
-- curriculum by topic, grade and subject, in an order seeded by the test's own
-- id -- so every learner in the class gets the same paper, the same paper comes
-- back on a reload, and no question text is duplicated into the database.

create table if not exists public.weekly_tests (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  subject_id text not null,
  grade smallint not null check (grade in (10, 11, 12)),
  -- Topic ids from the bundled curriculum, e.g. {'life-sci-evolution'}.
  topic_ids text[] not null check (array_length(topic_ids, 1) >= 1),
  -- Sub-topics the test is limited to, each as 'topicId::name', e.g.
  -- {'measurement::Units and conversions'}. NULL means the whole topic, and a
  -- whole-topic test is built to cover every sub-topic in it rather than
  -- whichever ones a shuffle happened to reach.
  subtopics text[],
  question_count smallint not null check (question_count between 1 and 30),
  due_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Added after the table shipped, so existing deployments need it too.
alter table public.weekly_tests add column if not exists subtopics text[];

create index if not exists weekly_tests_school_idx on public.weekly_tests (school_id, due_at desc);

create table if not exists public.weekly_test_attempts (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.weekly_tests (id) on delete cascade,
  learner_id uuid not null references public.profiles (id) on delete cascade,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  marks_awarded smallint,
  marks_total smallint,
  -- [{ "questionId": "...", "awarded": 3, "outOf": 5 }, ...] so a teacher can
  -- see WHICH questions the class lost marks on, not just a total.
  per_question jsonb,
  unique (test_id, learner_id)
);

create index if not exists weekly_test_attempts_test_idx on public.weekly_test_attempts (test_id);

alter table public.weekly_tests enable row level security;
alter table public.weekly_test_attempts enable row level security;

-- is_school_staff() is defined earlier, with the learner_progress policy.

-- weekly_tests ------------------------------------------------------------

drop policy if exists "School members can view their school's tests" on public.weekly_tests;
create policy "School members can view their school's tests"
  on public.weekly_tests for select
  using (school_id = public.current_school_id());

drop policy if exists "Staff can set a test for their school" on public.weekly_tests;
create policy "Staff can set a test for their school"
  on public.weekly_tests for insert
  with check (created_by = auth.uid() and public.is_school_staff(school_id));

drop policy if exists "Staff can change a test at their school" on public.weekly_tests;
create policy "Staff can change a test at their school"
  on public.weekly_tests for update
  using (public.is_school_staff(school_id));

drop policy if exists "Staff can remove a test at their school" on public.weekly_tests;
create policy "Staff can remove a test at their school"
  on public.weekly_tests for delete
  using (public.is_school_staff(school_id));

-- weekly_test_attempts ----------------------------------------------------

drop policy if exists "Learners can view their own attempts" on public.weekly_test_attempts;
create policy "Learners can view their own attempts"
  on public.weekly_test_attempts for select
  using (learner_id = auth.uid());

drop policy if exists "Learners can start their own attempt" on public.weekly_test_attempts;
create policy "Learners can start their own attempt"
  on public.weekly_test_attempts for insert
  with check (learner_id = auth.uid());

drop policy if exists "Learners can submit their own attempt" on public.weekly_test_attempts;
create policy "Learners can submit their own attempt"
  on public.weekly_test_attempts for update
  using (learner_id = auth.uid());

-- The whole point of the feature: a teacher sees the results for a test their
-- school set, without being able to reach into another school's.
-- is_school_staff is what makes this staff-only. Without it the policy asks
-- only whether the TEST is at the viewer's school, which every learner at that
-- school also satisfies -- so each of them could read the whole class's marks.
drop policy if exists "Staff can view attempts at their school" on public.weekly_test_attempts;
create policy "Staff can view attempts at their school"
  on public.weekly_test_attempts for select
  using (
    exists (
      select 1 from public.weekly_tests t
      where t.id = weekly_test_attempts.test_id
        and t.school_id = public.current_school_id()
        and public.is_school_staff(t.school_id)
    )
  );

-- A linked parent should see their own child's test results, the same way they
-- already see that child's topic progress.
drop policy if exists "Linked parents can view their child's attempts" on public.weekly_test_attempts;
create policy "Linked parents can view their child's attempts"
  on public.weekly_test_attempts for select
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = weekly_test_attempts.learner_id
        and parent_learner_links.parent_id = auth.uid()
    )
  );

-- POPIA section 24 again: a deletion request must take the test attempts too.
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

  delete from public.weekly_test_attempts where learner_id = auth.uid();
  delete from public.learner_progress where learner_id = auth.uid();
  delete from public.parent_learner_links where parent_id = auth.uid() or learner_id = auth.uid();
  delete from public.consents where profile_id = auth.uid();
  delete from public.profiles where id = auth.uid();
end;
$$;

-- ============================================================================
-- LETTING A SCHOOL CORRECT ITS OWN ROLL
-- ============================================================================
--
-- A teacher signed up, tapped "Learner" on the role picker, and appeared on
-- their colleague's class list. The roster query is right -- it filters to
-- role = 'learner' -- so this is a wrong ROW, not wrong code, and there was no
-- way to put it right from inside the app.
--
-- Anyone can mistap a role on the first screen they ever see, so a school needs
-- to be able to fix it without an administrator opening the database. Staff may
-- correct a profile at their OWN school; the with check keeps them from moving
-- somebody to a different one.

drop policy if exists "Staff can correct profiles at their school" on public.profiles;
create policy "Staff can correct profiles at their school"
  on public.profiles for update
  using (
    school_id is not null
    and school_id = public.current_school_id()
    and public.is_school_staff(public.current_school_id())
  )
  with check (school_id = public.current_school_id());

-- ---------------------------------------------------------------------------
-- STEP 11: the Head of Department role.
--
-- A school has a principal and it has subject teachers, and until now the app
-- had a role for each: "school" sees everything, "teacher" sees their own
-- learners in their own subject and grades. An HOD sits between the two and was
-- served by neither -- they need every teacher and every learner in ONE
-- subject, which the school view cannot narrow to and the teacher view cannot
-- widen to.
--
-- An HOD row is a teacher row with a wider reach: it carries a subject_id, and
-- that subject is the department.
--
-- RUN THE NEXT STATEMENT ON ITS OWN, before the rest of this section. Postgres
-- will not let a new enum label be USED in the same transaction that adds it,
-- and the Supabase SQL editor runs a whole script as one transaction.
alter type public.user_role add value if not exists 'hod';

-- Now run the rest.
--
-- is_school_staff decides who may read other people's learner_progress rows,
-- which is what every class average is built from. An HOD is staff.
--
-- The role test is written against role::text rather than against the enum
-- labels on purpose: comparing text means this function can be created in the
-- same transaction as the ALTER TYPE above if anyone runs the whole file at
-- once, instead of failing on a label Postgres has not committed yet. It is the
-- same comparison either way.
create or replace function public.is_school_staff(p_school_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and school_id = p_school_id
      and role::text in ('teacher', 'school', 'hod')
  );
$$;

-- No new policy is needed for the rosters themselves. "Users can view profiles
-- at their own school" already lets anyone at a school read the profiles there,
-- so an HOD can list the teachers and learners in their subject with no further
-- grant -- the narrowing to one subject is the app's job, not the database's.
--
-- WHAT AN HOD DELIBERATELY CANNOT DO: nothing here gives them reach outside
-- their own school, and nothing gives them a learner's answers. They see the
-- same progress rows a teacher at that school already sees. The only thing
-- that widens is WHICH learners in their subject, from "the ones I teach" to
-- "all of them".

-- ============================================================================
-- STEP 12: STAFF ACCESS IS GRANTED, NOT CLAIMED
-- ============================================================================
--
-- WHAT WAS WRONG. Two ways for a learner to see every learner's results at
-- their school, both reproduced against this schema in supabase/tests/access.sql
-- before this step was written:
--
--   1. "Users can update their own profile" checked WHOSE row was changing but
--      not WHICH COLUMNS. A signed-in learner could run, from their own browser,
--        supabase.from('profiles').update({ role: 'school' }).eq('id', me)
--      and is_school_staff() -- which decides who reads learner_progress and
--      weekly_test_attempts -- then said yes.
--
--   2. A staff role was chosen on the sign-up screen and took effect at once.
--      Every learner is given the school's join code, so any of them could open
--      a second account, tap "Teacher", enter the code, and be staff.
--
-- And a smaller one: "Users can view profiles at their own school" let every
-- learner list every other learner. The app never needed that, and POPIA's
-- minimality principle says a child's name should not be visible to people
-- with no reason to see it.
--
-- THE FIX, in three parts.
--
--   A staff role now needs APPROVAL. The first staff member at a school -- the
--   person who just created it -- is approved automatically, because there is
--   nobody else to ask. Everyone after them is PENDING until an approved
--   colleague approves them through approve_staff(), and is_school_staff() only
--   counts approved staff. A learner who signs up as "Teacher" with the code now
--   gets a waiting screen, not a class list.
--
--   A trigger now decides which columns may change. Nobody changes their own
--   role or school, and nobody sets approval by writing to the column. Work done
--   inside the database's own functions, or by an operator in the SQL editor,
--   is not restricted: those do not run as a signed-in user.
--
--   Learners and parents see staff at their school, not each other.
--
-- EXISTING STAFF are approved as of their sign-up date, ONCE, when the column
-- is first added -- re-running this file does not approve anyone new. Before
-- relying on that, run the review query at the end of this step and check the
-- staff list at each school is who it should be: anyone who used the hole above
-- before today is on it.

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'staff_approved_at'
  ) then
    alter table public.profiles add column staff_approved_at timestamptz;
    update public.profiles set staff_approved_at = created_at
      where role::text in ('teacher', 'school', 'hod');
  end if;
end $$;

-- Only APPROVED staff are staff.
create or replace function public.is_school_staff(p_school_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and school_id = p_school_id
      and role::text in ('teacher', 'school', 'hod')
      and staff_approved_at is not null
  );
$$;

-- Helpers the trigger needs, which must see past RLS: a person signing up has
-- no profile yet, so under their own permissions they can see nobody at the
-- school, and "is there already approved staff here?" would always say no.
create or replace function public.school_has_approved_staff(p_school_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where school_id = p_school_id
      and role::text in ('teacher', 'school', 'hod')
      and staff_approved_at is not null
  );
$$;

create or replace function public.approved_role_at(p_school_id uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role::text from public.profiles
  where id = auth.uid() and school_id = p_school_id and staff_approved_at is not null
    and role::text in ('teacher', 'school', 'hod');
$$;

-- The column rules. SECURITY INVOKER on purpose: `current_user` must be the
-- caller, so that the database's own security-definer functions (which run as
-- their owner) and the SQL editor pass through, while a request from the app
-- (which runs as `authenticated`) is held to the rules.
create or replace function public.guard_profile()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_staff constant text[] := array['teacher', 'school', 'hod'];
  v_caller text;
begin
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    -- Approval is never taken from what the client sent.
    new.staff_approved_at := null;
    if new.role::text = any (v_staff) and new.school_id is not null
       and not public.school_has_approved_staff(new.school_id) then
      -- The first staff member at a school: the person who created it.
      new.staff_approved_at := now();
    end if;
    return new;
  end if;

  if new.staff_approved_at is distinct from old.staff_approved_at then
    raise exception 'Staff approval is given by a colleague, through approve_staff().';
  end if;

  if new.id = v_uid then
    if new.role is distinct from old.role then
      raise exception 'You cannot change your own role. Ask your school to correct it.';
    end if;
    if new.school_id is distinct from old.school_id then
      raise exception 'You cannot move your own account to another school.';
    end if;
    return new;
  end if;

  -- Someone else's row. "Staff can correct profiles at their school" already
  -- limits WHO may get here; this limits WHAT they may do to a role.
  if new.role is distinct from old.role then
    v_caller := public.approved_role_at(old.school_id);
    if v_caller is null then
      raise exception 'Only approved staff at this school can change a role.';
    end if;
    if (new.role::text = 'school' or old.role::text = 'school') and v_caller <> 'school' then
      raise exception 'Only the school account can give or remove the school role.';
    end if;
    -- A colleague who makes someone staff is vouching for them, so the new
    -- role is approved; making someone NOT staff clears it.
    new.staff_approved_at := case when new.role::text = any (v_staff) then now() else null end;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile on public.profiles;
create trigger guard_profile
  before insert or update on public.profiles
  for each row execute function public.guard_profile();

-- Approving -- or turning away -- someone who signed up as staff.
create or replace function public.approve_staff(p_profile uuid, p_approve boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target public.profiles;
begin
  select * into v_target from public.profiles where id = p_profile;
  if v_target.id is null or v_target.school_id is null then
    raise exception 'That person was not found at your school.';
  end if;
  if not public.is_school_staff(v_target.school_id) then
    raise exception 'Only approved staff at this school can approve staff.';
  end if;
  if v_target.role::text not in ('teacher', 'school', 'hod') or v_target.staff_approved_at is not null then
    raise exception 'That person is not waiting for staff approval.';
  end if;

  if p_approve then
    update public.profiles set staff_approved_at = now() where id = p_profile;
  else
    -- Turned away: they keep their account but leave the school, so they see
    -- nothing of it. They can join again with a code if it was a mistake.
    update public.profiles set school_id = null where id = p_profile;
  end if;
end;
$$;

grant execute on function public.approve_staff(uuid, boolean) to authenticated;

-- Who may see whose profile.
drop policy if exists "Users can view profiles at their own school" on public.profiles;
drop policy if exists "Staff can view everyone at their school" on public.profiles;
create policy "Staff can view everyone at their school"
  on public.profiles for select
  using (
    school_id is not null
    and school_id = public.current_school_id()
    and public.is_school_staff(school_id)
  );

drop policy if exists "Everyone can see the staff at their school" on public.profiles;
create policy "Everyone can see the staff at their school"
  on public.profiles for select
  using (
    school_id is not null
    and school_id = public.current_school_id()
    and role::text in ('teacher', 'school', 'hod')
  );

-- REVIEW QUERY -- run this on its own after the step, and check each school's
-- staff list is who it should be. Anyone who used the hole above before this
-- fix was approved along with everyone else, and will show here as staff.
--
--   select s.name as school, p.full_name, p.role, p.created_at, p.staff_approved_at
--   from public.profiles p join public.schools s on s.id = p.school_id
--   where p.role::text in ('teacher', 'school', 'hod')
--   order by s.name, p.created_at;

-- ============================================================================
-- STEP 13: AN AUDIT LOG
-- ============================================================================
--
-- WHY. Section 28 of the commercial spec lists audit logs as required before
-- any real school is onboarded, and the incident-response plan depends on
-- them: after a security problem, the first question is "who changed what,
-- and when", and until now nothing recorded the answer. STEP 12 made staff
-- access something a colleague grants; this makes every grant visible.
--
-- WHAT IS RECORDED. Changes that decide who can see what -- roles, staff
-- approval, which school someone belongs to, parent links, consent -- and
-- changes to weekly tests. Not learners' practice or answers: that is
-- learning activity, not an access decision, and logging it here would copy
-- children's results into a second place for no security benefit.
--
-- WHAT IS NOT STORED IN IT. Names, emails, marks or any free text a person
-- typed. An entry names people only by account id, and the app looks the name
-- up when it shows the log -- so when an account is deleted, the log keeps
-- that "an account" did something, without keeping who they were.
--
-- APPEND-ONLY. Nobody writes to this table directly: there are no insert,
-- update or delete policies, and the privileges are revoked as well. Entries
-- are written only by the triggers below, which run as the table's owner. An
-- operator can remove entries past the retention period with
-- purge_audit_log(); nothing in the app can.

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  -- Who did it: the signed-in account, or null for an operator working in the
  -- SQL editor or the service role.
  actor_id uuid,
  actor_role text,
  -- The school the change concerns, which is what decides who may read it.
  school_id uuid,
  action text not null,
  target_table text not null,
  target_id text,
  details jsonb not null default '{}'::jsonb
);

create index if not exists audit_log_school_at_idx on public.audit_log (school_id, at desc);

alter table public.audit_log enable row level security;
revoke insert, update, delete, truncate on public.audit_log from authenticated, anon;

drop policy if exists "Approved staff can read their school's audit log" on public.audit_log;
create policy "Approved staff can read their school's audit log"
  on public.audit_log for select
  using (school_id is not null and school_id = public.current_school_id()
         and public.is_school_staff(school_id));

-- A person may see what was done to or by their own account: part of the
-- right of access under POPIA section 23.
drop policy if exists "Users can read entries about themselves" on public.audit_log;
create policy "Users can read entries about themselves"
  on public.audit_log for select
  using (actor_id = auth.uid() or target_id = auth.uid()::text);

-- One writer, used by every trigger below.
create or replace function public.write_audit(
  p_school uuid, p_action text, p_table text, p_target text, p_details jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
begin
  insert into public.audit_log (actor_id, actor_role, school_id, action, target_table, target_id, details)
  values (
    v_actor,
    coalesce((select role::text from public.profiles where id = v_actor), case when v_actor is null then 'operator' end),
    p_school, p_action, p_table, p_target, coalesce(p_details, '{}'::jsonb)
  );
end;
$$;
-- Only the triggers call it; it is not an endpoint the app may use.
revoke execute on function public.write_audit(uuid, text, text, text, jsonb) from public, authenticated, anon;

-- profiles --------------------------------------------------------------------
create or replace function public.audit_profiles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_fields text[] := '{}';
begin
  if tg_op = 'INSERT' then
    perform public.write_audit(new.school_id, 'profile.created', 'profiles', new.id::text,
      jsonb_build_object('role', new.role::text, 'pending_staff',
        new.role::text in ('teacher', 'school', 'hod') and new.staff_approved_at is null and new.school_id is not null));
    return new;
  end if;

  if tg_op = 'DELETE' then
    perform public.write_audit(old.school_id, 'profile.deleted', 'profiles', old.id::text,
      jsonb_build_object('role', old.role::text));
    return old;
  end if;

  if new.role is distinct from old.role then
    perform public.write_audit(old.school_id, 'profile.role_changed', 'profiles', new.id::text,
      jsonb_build_object('from', old.role::text, 'to', new.role::text));
  end if;

  if old.staff_approved_at is null and new.staff_approved_at is not null and new.role = old.role then
    perform public.write_audit(new.school_id, 'staff.approved', 'profiles', new.id::text,
      jsonb_build_object('role', new.role::text));
  end if;

  if new.school_id is distinct from old.school_id then
    -- Recorded against the school being left, so that school can see who
    -- went; and against the school being joined, if there is one.
    perform public.write_audit(old.school_id, 'profile.school_changed', 'profiles', new.id::text,
      jsonb_build_object('direction', 'left', 'staff_request_declined',
        old.role::text in ('teacher', 'school', 'hod') and old.staff_approved_at is null and new.school_id is null));
    if new.school_id is not null then
      perform public.write_audit(new.school_id, 'profile.school_changed', 'profiles', new.id::text,
        jsonb_build_object('direction', 'joined'));
    end if;
  end if;

  -- Other corrections: which fields, never their values. array_append rather
  -- than ||, which Postgres cannot tell apart from joining two arrays when the
  -- right-hand side is a bare string -- and that error would have failed every
  -- grade correction a teacher made, not just its log entry.
  if new.full_name is distinct from old.full_name then v_fields := array_append(v_fields, 'full_name'); end if;
  if new.grade is distinct from old.grade then v_fields := array_append(v_fields, 'grade'); end if;
  if new.subject_id is distinct from old.subject_id then v_fields := array_append(v_fields, 'subject'); end if;
  if array_length(v_fields, 1) > 0 then
    perform public.write_audit(new.school_id, 'profile.updated', 'profiles', new.id::text,
      jsonb_build_object('fields', to_jsonb(v_fields)));
  end if;
  return new;
end;
$$;

drop trigger if exists audit_profiles on public.profiles;
create trigger audit_profiles
  after insert or update or delete on public.profiles
  for each row execute function public.audit_profiles();

-- weekly tests ------------------------------------------------------------------
create or replace function public.audit_weekly_tests()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.weekly_tests := case when tg_op = 'DELETE' then old else new end;
begin
  perform public.write_audit(r.school_id,
    'weekly_test.' || case tg_op when 'INSERT' then 'set' when 'UPDATE' then 'changed' else 'removed' end,
    'weekly_tests', r.id::text,
    jsonb_build_object('subject', r.subject_id, 'grade', r.grade, 'due_at', r.due_at));
  return r;
end;
$$;

drop trigger if exists audit_weekly_tests on public.weekly_tests;
create trigger audit_weekly_tests
  after insert or update or delete on public.weekly_tests
  for each row execute function public.audit_weekly_tests();

-- consent -------------------------------------------------------------------------
create or replace function public.audit_consents()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.write_audit((select school_id from public.profiles where id = new.profile_id),
      'consent.granted', 'consents', new.profile_id::text,
      jsonb_build_object('kind', new.kind, 'notice_version', new.notice_version));
  elsif old.withdrawn_at is null and new.withdrawn_at is not null then
    perform public.write_audit((select school_id from public.profiles where id = new.profile_id),
      'consent.withdrawn', 'consents', new.profile_id::text, jsonb_build_object('kind', new.kind));
  end if;
  return new;
end;
$$;

drop trigger if exists audit_consents on public.consents;
create trigger audit_consents
  after insert or update on public.consents
  for each row execute function public.audit_consents();

-- parent links ---------------------------------------------------------------------
create or replace function public.audit_parent_links()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.parent_learner_links := case when tg_op = 'DELETE' then old else new end;
begin
  perform public.write_audit((select school_id from public.profiles where id = r.learner_id),
    case when tg_op = 'INSERT' then 'parent_link.created' else 'parent_link.removed' end,
    'parent_learner_links', r.learner_id::text,
    jsonb_build_object('parent_id', r.parent_id));
  return r;
end;
$$;

drop trigger if exists audit_parent_links on public.parent_learner_links;
create trigger audit_parent_links
  after insert or delete on public.parent_learner_links
  for each row execute function public.audit_parent_links();

-- Retention: an operator removes entries older than the agreed period (the
-- School Data Processing Agreement proposes 12 months). Not granted to the app.
create or replace function public.purge_audit_log(p_older_than interval)
returns bigint
language sql
security definer
set search_path = public
as $$
  with gone as (delete from public.audit_log where at < now() - p_older_than returning 1)
  select count(*) from gone;
$$;
revoke execute on function public.purge_audit_log(interval) from public, authenticated, anon;

-- ============================================================================
-- STEP 14: CLASSES
-- ============================================================================
--
-- WHY. Until now a teacher's view was "every learner at the school in my
-- subject, narrowed by the grades I ticked". A school does not work like that:
-- two Grade 12 Mat Lit teachers each teach their own class, and each was being
-- shown the other's learners and the other's average. The spec's school
-- drill-down (school -> grade -> class) and class analysis both need a class to
-- exist, and so does setting a weekly test for one class rather than a grade.
--
-- WHO CAN DO WHAT.
--   * Approved staff see every class at their school. A learner sees only the
--     classes they are in, and only their OWN membership -- never a class list.
--   * A teacher creates and runs their own classes. The school account and an
--     HOD can manage any class at the school, e.g. to hand one over when a
--     teacher leaves.
--   * Only learners at the same school can be put in a class. Leaving the school
--     (or stopping being a learner) takes them out of its classes.
--   * A class that still has weekly tests cannot be deleted: its tests hold
--     learners' results, and deleting the class would either lose them or turn
--     a one-class test into a whole-grade one. Remove the tests first.
--
-- The helpers below are security definer because classes and class_members
-- each need to look at the other to decide access, and two policies that read
-- each other's tables recurse forever.

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  name text not null check (length(btrim(name)) between 1 and 60),
  grade smallint not null check (grade in (10, 11, 12)),
  subject_id text not null,
  -- The class teacher. Null when the teacher's account has been deleted, until
  -- the school hands the class to someone else.
  teacher_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (school_id, name)
);

create index if not exists classes_school_idx on public.classes (school_id, grade);

create table if not exists public.class_members (
  class_id uuid not null references public.classes (id) on delete cascade,
  learner_id uuid not null references public.profiles (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (class_id, learner_id)
);

create index if not exists class_members_learner_idx on public.class_members (learner_id);

-- A weekly test may be set for one class. Null means the whole grade, as before.
alter table public.weekly_tests
  add column if not exists class_id uuid references public.classes (id) on delete restrict;

alter table public.classes enable row level security;
alter table public.class_members enable row level security;

create or replace function public.class_school(p_class uuid)
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select school_id from public.classes where id = p_class;
$$;

create or replace function public.is_class_member(p_class uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.class_members where class_id = p_class and learner_id = auth.uid());
$$;

-- May the signed-in user manage a class at this school taught by this teacher?
create or replace function public.can_manage_class(p_school uuid, p_teacher uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.is_school_staff(p_school)
     and (public.approved_role_at(p_school) in ('school', 'hod') or p_teacher = auth.uid());
$$;

create or replace function public.can_manage_class_id(p_class uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select public.can_manage_class(school_id, teacher_id) from public.classes where id = p_class), false);
$$;

-- Is this person an approved staff member at this school? (A class teacher must be.)
create or replace function public.is_staff_member_at(p_profile uuid, p_school uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = p_profile and school_id = p_school
      and role::text in ('teacher', 'school', 'hod') and staff_approved_at is not null
  );
$$;

create or replace function public.is_learner_at(p_profile uuid, p_school uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = p_profile and school_id = p_school and role::text = 'learner'
  );
$$;

-- classes -------------------------------------------------------------------

drop policy if exists "Staff can view the classes at their school" on public.classes;
create policy "Staff can view the classes at their school"
  on public.classes for select
  using (public.is_school_staff(school_id));

drop policy if exists "Learners can view the classes they are in" on public.classes;
create policy "Learners can view the classes they are in"
  on public.classes for select
  using (public.is_class_member(id));

drop policy if exists "Staff can create a class" on public.classes;
create policy "Staff can create a class"
  on public.classes for insert
  with check (
    school_id = public.current_school_id()
    and public.can_manage_class(school_id, teacher_id)
    and (teacher_id is null or public.is_staff_member_at(teacher_id, school_id))
  );

drop policy if exists "Class teachers and school leaders can change a class" on public.classes;
create policy "Class teachers and school leaders can change a class"
  on public.classes for update
  using (public.can_manage_class(school_id, teacher_id))
  with check (
    school_id = public.current_school_id()
    and public.can_manage_class(school_id, teacher_id)
    and (teacher_id is null or public.is_staff_member_at(teacher_id, school_id))
  );

drop policy if exists "Class teachers and school leaders can remove a class" on public.classes;
create policy "Class teachers and school leaders can remove a class"
  on public.classes for delete
  using (public.can_manage_class(school_id, teacher_id));

-- class_members -------------------------------------------------------------

drop policy if exists "Staff can view class lists at their school" on public.class_members;
create policy "Staff can view class lists at their school"
  on public.class_members for select
  using (public.is_school_staff(public.class_school(class_id)));

drop policy if exists "Learners can view their own class membership" on public.class_members;
create policy "Learners can view their own class membership"
  on public.class_members for select
  using (learner_id = auth.uid());

drop policy if exists "Linked parents can view their child's classes" on public.class_members;
create policy "Linked parents can view their child's classes"
  on public.class_members for select
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = class_members.learner_id
        and parent_learner_links.parent_id = auth.uid()
    )
  );

drop policy if exists "Class managers can add learners from their school" on public.class_members;
create policy "Class managers can add learners from their school"
  on public.class_members for insert
  with check (
    public.can_manage_class_id(class_id)
    and public.is_learner_at(learner_id, public.class_school(class_id))
  );

drop policy if exists "Class managers can remove learners" on public.class_members;
create policy "Class managers can remove learners"
  on public.class_members for delete
  using (public.can_manage_class_id(class_id));

-- A test set for a class must be for a class at the same school.
drop policy if exists "Staff can set a test for their school" on public.weekly_tests;
create policy "Staff can set a test for their school"
  on public.weekly_tests for insert
  with check (
    created_by = auth.uid() and public.is_school_staff(school_id)
    and (class_id is null or public.class_school(class_id) = school_id)
  );

drop policy if exists "Staff can change a test at their school" on public.weekly_tests;
create policy "Staff can change a test at their school"
  on public.weekly_tests for update
  using (public.is_school_staff(school_id))
  with check (
    public.is_school_staff(school_id)
    and (class_id is null or public.class_school(class_id) = school_id)
  );

-- Leaving the school, or no longer being a learner, takes a person out of its
-- classes. Runs as owner: the person leaving has no right to edit class lists.
create or replace function public.tidy_class_members()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.school_id is distinct from old.school_id or new.role::text <> 'learner' then
    delete from public.class_members m
    using public.classes c
    where m.class_id = c.id and m.learner_id = new.id
      and (c.school_id is distinct from new.school_id or new.role::text <> 'learner');
  end if;
  return new;
end;
$$;

drop trigger if exists tidy_class_members on public.profiles;
create trigger tidy_class_members
  after update of school_id, role on public.profiles
  for each row execute function public.tidy_class_members();

-- Audit (STEP 13): classes and class lists. The class name is not copied into
-- the log -- it is typed text -- only its grade, subject and teacher.
create or replace function public.audit_classes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.classes := case when tg_op = 'DELETE' then old else new end;
begin
  perform public.write_audit(r.school_id,
    'class.' || case tg_op when 'INSERT' then 'created' when 'UPDATE' then 'changed' else 'removed' end,
    'classes', r.id::text,
    jsonb_build_object('grade', r.grade, 'subject', r.subject_id, 'teacher_id', r.teacher_id)
      || case when tg_op = 'UPDATE' and new.teacher_id is distinct from old.teacher_id
              then jsonb_build_object('previous_teacher_id', old.teacher_id) else '{}'::jsonb end);
  return r;
end;
$$;

drop trigger if exists audit_classes on public.classes;
create trigger audit_classes
  after insert or update or delete on public.classes
  for each row execute function public.audit_classes();

create or replace function public.audit_class_members()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.class_members := case when tg_op = 'DELETE' then old else new end;
begin
  perform public.write_audit(public.class_school(r.class_id),
    case when tg_op = 'INSERT' then 'class_member.added' else 'class_member.removed' end,
    'class_members', r.learner_id::text,
    jsonb_build_object('class_id', r.class_id));
  return r;
end;
$$;

drop trigger if exists audit_class_members on public.class_members;
create trigger audit_class_members
  after insert or delete on public.class_members
  for each row execute function public.audit_class_members();
