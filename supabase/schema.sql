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
  question_count smallint not null check (question_count between 1 and 30),
  due_at timestamptz not null,
  created_at timestamptz not null default now()
);

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
