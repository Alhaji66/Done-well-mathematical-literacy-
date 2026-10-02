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

-- ============================================================================
-- STEP 15: MY MISTAKES, AND THE DIAGNOSE -> INTERVENE -> REASSESS LOOP
-- ============================================================================
--
-- WHY. Section 34 of the spec describes an assessment cycle -- practise,
-- assess, analyse, diagnose, intervene, reassess, track -- and the app stopped
-- at "analyse". A teacher could see that half the class is below 50% on
-- financial documents and then had nowhere in the app to act on it.
--
-- MY MISTAKES. Every question a learner gets wrong is kept, with how many
-- times, until they get it right. It is the learner's own record: they write
-- it, their teachers and linked parents can read it, nobody else can.
--
-- INTERVENTIONS ("catch-up groups" in the app). A teacher picks a topic and the
-- learners who need help with it, writes a short plan, and records each
-- learner's starting point (their score on the test that showed the problem,
-- or their practice mastery). A reassessment is a weekly test set for the
-- group alone; comparing it with the starting point is the "did it work".
--
-- Who sees an intervention: approved staff at the school, the learners in it,
-- and those learners' linked parents -- the plan is written for all three, and
-- the app says so where it is typed. An intervention is never deleted, only
-- completed or cancelled, so its before-and-after survives.

create table if not exists public.learner_mistakes (
  learner_id uuid not null references public.profiles (id) on delete cascade,
  -- Question ids from the bundled curriculum, like topic ids.
  question_id text not null,
  topic_id text not null,
  source text not null check (source in ('practice', 'paper', 'weekly_test')),
  times_wrong integer not null default 1,
  first_wrong_at timestamptz not null default now(),
  last_wrong_at timestamptz not null default now(),
  -- Set when the learner later gets it right; cleared if they get it wrong again.
  resolved_at timestamptz,
  primary key (learner_id, question_id)
);

create index if not exists learner_mistakes_open_idx on public.learner_mistakes (learner_id) where resolved_at is null;

alter table public.learner_mistakes enable row level security;

drop policy if exists "Learners can view their own mistakes" on public.learner_mistakes;
create policy "Learners can view their own mistakes"
  on public.learner_mistakes for select
  using (learner_id = auth.uid());

drop policy if exists "Learners can record their own mistakes" on public.learner_mistakes;
create policy "Learners can record their own mistakes"
  on public.learner_mistakes for insert
  with check (learner_id = auth.uid());

drop policy if exists "Learners can update their own mistakes" on public.learner_mistakes;
create policy "Learners can update their own mistakes"
  on public.learner_mistakes for update
  using (learner_id = auth.uid())
  with check (learner_id = auth.uid());

drop policy if exists "Learners can clear their own mistakes" on public.learner_mistakes;
create policy "Learners can clear their own mistakes"
  on public.learner_mistakes for delete
  using (learner_id = auth.uid());

drop policy if exists "Staff can view mistakes within their school" on public.learner_mistakes;
create policy "Staff can view mistakes within their school"
  on public.learner_mistakes for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = learner_mistakes.learner_id
        and profiles.school_id = public.current_school_id()
    )
    and public.is_school_staff(public.current_school_id())
  );

drop policy if exists "Linked parents can view their child's mistakes" on public.learner_mistakes;
create policy "Linked parents can view their child's mistakes"
  on public.learner_mistakes for select
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = learner_mistakes.learner_id
        and parent_learner_links.parent_id = auth.uid()
    )
  );

-- One call per answer. SECURITY INVOKER, so the policies above still apply:
-- it can only ever touch the caller's own rows.
create or replace function public.record_answer(p_question text, p_topic text, p_source text, p_correct boolean)
returns void
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in.';
  end if;
  if p_correct then
    update public.learner_mistakes set resolved_at = now()
      where learner_id = auth.uid() and question_id = p_question and resolved_at is null;
  else
    insert into public.learner_mistakes (learner_id, question_id, topic_id, source)
      values (auth.uid(), p_question, p_topic, p_source)
    on conflict (learner_id, question_id) do update
      set times_wrong = public.learner_mistakes.times_wrong + 1,
          last_wrong_at = now(),
          resolved_at = null,
          source = excluded.source;
  end if;
end;
$$;

grant execute on function public.record_answer(text, text, text, boolean) to authenticated;

-- A learner's account deletion takes their mistakes with it (on delete cascade).

-- Interventions ---------------------------------------------------------------

create table if not exists public.interventions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  class_id uuid references public.classes (id) on delete set null,
  subject_id text not null,
  grade smallint not null check (grade in (10, 11, 12)),
  topic_id text not null,
  -- 'topicId::name' when narrowed to one sub-topic.
  subtopic text,
  plan text not null default '' check (length(plan) <= 2000),
  -- Where the starting points came from: a weekly test, or practice mastery.
  diagnostic_test_id uuid references public.weekly_tests (id) on delete set null,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create index if not exists interventions_school_idx on public.interventions (school_id, status);

create table if not exists public.intervention_learners (
  intervention_id uuid not null references public.interventions (id) on delete cascade,
  learner_id uuid not null references public.profiles (id) on delete cascade,
  -- The learner's starting point, 0-100, captured when they were added.
  baseline_percent smallint check (baseline_percent between 0 and 100),
  added_at timestamptz not null default now(),
  primary key (intervention_id, learner_id)
);

create index if not exists intervention_learners_learner_idx on public.intervention_learners (learner_id);

-- A reassessment is a weekly test set for one intervention's learners.
alter table public.weekly_tests
  add column if not exists intervention_id uuid references public.interventions (id) on delete restrict;

alter table public.interventions enable row level security;
alter table public.intervention_learners enable row level security;
-- Interventions are closed, not deleted, so nobody in the app may delete one.
revoke delete, truncate on public.interventions from authenticated, anon;

create or replace function public.intervention_school(p_intervention uuid)
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select school_id from public.interventions where id = p_intervention;
$$;

create or replace function public.in_intervention(p_intervention uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.intervention_learners il
    where il.intervention_id = p_intervention
      and (il.learner_id = auth.uid()
           or exists (select 1 from public.parent_learner_links pl
                      where pl.learner_id = il.learner_id and pl.parent_id = auth.uid()))
  );
$$;

-- The person who started it, or a school leader, runs an intervention.
create or replace function public.can_manage_intervention(p_intervention uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select public.can_manage_class(school_id, created_by) from public.interventions where id = p_intervention),
    false);
$$;

drop policy if exists "Staff can view interventions at their school" on public.interventions;
create policy "Staff can view interventions at their school"
  on public.interventions for select
  using (public.is_school_staff(school_id));

drop policy if exists "Learners and parents can view interventions they are part of" on public.interventions;
create policy "Learners and parents can view interventions they are part of"
  on public.interventions for select
  using (public.in_intervention(id));

drop policy if exists "Staff can start an intervention" on public.interventions;
create policy "Staff can start an intervention"
  on public.interventions for insert
  with check (
    created_by = auth.uid()
    and school_id = public.current_school_id()
    and public.is_school_staff(school_id)
    and (class_id is null or public.class_school(class_id) = school_id)
  );

drop policy if exists "The teacher who started it or a school leader can update an intervention" on public.interventions;
create policy "The teacher who started it or a school leader can update an intervention"
  on public.interventions for update
  using (public.can_manage_class(school_id, created_by))
  with check (
    school_id = public.current_school_id()
    and public.can_manage_class(school_id, created_by)
    and (class_id is null or public.class_school(class_id) = school_id)
  );

drop policy if exists "Staff can view intervention groups at their school" on public.intervention_learners;
create policy "Staff can view intervention groups at their school"
  on public.intervention_learners for select
  using (public.is_school_staff(public.intervention_school(intervention_id)));

drop policy if exists "Learners can view their own place in an intervention" on public.intervention_learners;
create policy "Learners can view their own place in an intervention"
  on public.intervention_learners for select
  using (learner_id = auth.uid());

drop policy if exists "Linked parents can view their child's place in an intervention" on public.intervention_learners;
create policy "Linked parents can view their child's place in an intervention"
  on public.intervention_learners for select
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = intervention_learners.learner_id
        and parent_learner_links.parent_id = auth.uid()
    )
  );

drop policy if exists "Intervention managers can add learners from their school" on public.intervention_learners;
create policy "Intervention managers can add learners from their school"
  on public.intervention_learners for insert
  with check (
    public.can_manage_intervention(intervention_id)
    and public.is_learner_at(learner_id, public.intervention_school(intervention_id))
  );

drop policy if exists "Intervention managers can remove learners" on public.intervention_learners;
create policy "Intervention managers can remove learners"
  on public.intervention_learners for delete
  using (public.can_manage_intervention(intervention_id));

-- Tests: a class or intervention must belong to the test's own school.
drop policy if exists "Staff can set a test for their school" on public.weekly_tests;
create policy "Staff can set a test for their school"
  on public.weekly_tests for insert
  with check (
    created_by = auth.uid() and public.is_school_staff(school_id)
    and (class_id is null or public.class_school(class_id) = school_id)
    and (intervention_id is null or public.intervention_school(intervention_id) = school_id)
  );

drop policy if exists "Staff can change a test at their school" on public.weekly_tests;
create policy "Staff can change a test at their school"
  on public.weekly_tests for update
  using (public.is_school_staff(school_id))
  with check (
    public.is_school_staff(school_id)
    and (class_id is null or public.class_school(class_id) = school_id)
    and (intervention_id is null or public.intervention_school(intervention_id) = school_id)
  );

-- Leaving the school takes a learner out of its interventions, as with classes.
create or replace function public.tidy_intervention_learners()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.school_id is distinct from old.school_id or new.role::text <> 'learner' then
    delete from public.intervention_learners il
    using public.interventions i
    where il.intervention_id = i.id and il.learner_id = new.id
      and (i.school_id is distinct from new.school_id or new.role::text <> 'learner');
  end if;
  return new;
end;
$$;

drop trigger if exists tidy_intervention_learners on public.profiles;
create trigger tidy_intervention_learners
  after update of school_id, role on public.profiles
  for each row execute function public.tidy_intervention_learners();

-- Audit (STEP 13). The plan is typed text and is not copied into the log.
create or replace function public.audit_interventions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.write_audit(new.school_id, 'intervention.started', 'interventions', new.id::text,
      jsonb_build_object('topic', new.topic_id, 'grade', new.grade, 'subject', new.subject_id));
  elsif new.status is distinct from old.status then
    perform public.write_audit(new.school_id, 'intervention.' || new.status, 'interventions', new.id::text,
      jsonb_build_object('topic', new.topic_id, 'grade', new.grade, 'subject', new.subject_id));
  end if;
  return new;
end;
$$;

drop trigger if exists audit_interventions on public.interventions;
create trigger audit_interventions
  after insert or update on public.interventions
  for each row execute function public.audit_interventions();

create or replace function public.audit_intervention_learners()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.intervention_learners := case when tg_op = 'DELETE' then old else new end;
begin
  perform public.write_audit(public.intervention_school(r.intervention_id),
    case when tg_op = 'INSERT' then 'intervention_learner.added' else 'intervention_learner.removed' end,
    'intervention_learners', r.learner_id::text,
    jsonb_build_object('intervention_id', r.intervention_id));
  return r;
end;
$$;

drop trigger if exists audit_intervention_learners on public.intervention_learners;
create trigger audit_intervention_learners
  after insert or delete on public.intervention_learners
  for each row execute function public.audit_intervention_learners();

-- ============================================================================
-- STEP 16: PARTICIPATION EVENTS AND IN-APP NOTIFICATIONS
-- ============================================================================
--
-- PARTICIPATION. The spec's school dashboard asks for active learners and
-- participation, and until now the app could only say how well learners were
-- doing, never whether they were using it at all. activity_events records a
-- short, fixed list of things a person did -- signed in, answered a question,
-- handed in a test, fixed a mistake, opened a resource -- with a time and at
-- most a topic id. No answers, no free text, no device or location data.
--
-- The school and time are stamped by the database, not taken from the app, so
-- an event cannot be back-dated or filed against another school. Nobody can
-- edit or delete an event from the app; an operator removes old ones with
-- purge_activity_events() under the retention period in the school agreement.
--
-- NOTIFICATIONS. Written only by the triggers below, one row per recipient.
-- A notification stores what happened (kind) and ids, and the app writes the
-- sentence -- the same approach as the audit log -- except where the only
-- useful words are the teacher's own (a weekly test's title). A person can read
-- their own notifications, mark them read and delete them, and nothing else.
--
-- This is in-app only. Email and SMS need a sending service and each person's
-- consent to be contacted that way; they are deliberately not part of this step.

create table if not exists public.activity_events (
  id bigint generated always as identity primary key,
  actor_id uuid not null references public.profiles (id) on delete cascade,
  school_id uuid references public.schools (id) on delete set null,
  kind text not null check (kind in
    ('signed_in', 'practice_answer', 'paper_answer', 'test_submitted', 'mistake_fixed', 'resource_opened')),
  topic_id text,
  at timestamptz not null default now()
);

create index if not exists activity_events_school_at_idx on public.activity_events (school_id, at desc);
create index if not exists activity_events_actor_at_idx on public.activity_events (actor_id, at desc);

alter table public.activity_events enable row level security;
revoke update, delete, truncate on public.activity_events from authenticated, anon;

create or replace function public.stamp_activity_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.school_id := (select school_id from public.profiles where id = new.actor_id);
  new.at := now();
  return new;
end;
$$;

drop trigger if exists stamp_activity_event on public.activity_events;
create trigger stamp_activity_event
  before insert on public.activity_events
  for each row execute function public.stamp_activity_event();

drop policy if exists "People can record their own activity" on public.activity_events;
create policy "People can record their own activity"
  on public.activity_events for insert
  with check (actor_id = auth.uid());

drop policy if exists "People can view their own activity" on public.activity_events;
create policy "People can view their own activity"
  on public.activity_events for select
  using (actor_id = auth.uid());

drop policy if exists "Staff can view activity at their school" on public.activity_events;
create policy "Staff can view activity at their school"
  on public.activity_events for select
  using (school_id is not null and public.is_school_staff(school_id));

drop policy if exists "Linked parents can view their child's activity" on public.activity_events;
create policy "Linked parents can view their child's activity"
  on public.activity_events for select
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = activity_events.actor_id
        and parent_learner_links.parent_id = auth.uid()
    )
  );

-- Participation per person over the last p_days: how many days they were
-- active, how many things they did, and when they were last seen. SECURITY
-- INVOKER, so each caller gets only the rows the policies above allow them.
create or replace function public.participation(p_days integer default 7)
returns table (actor_id uuid, active_days bigint, events bigint, answers bigint, last_active timestamptz)
language sql
stable
set search_path = public
as $$
  select e.actor_id,
         count(distinct (e.at at time zone 'Africa/Johannesburg')::date),
         count(*),
         count(*) filter (where e.kind in ('practice_answer', 'paper_answer')),
         max(e.at)
  from public.activity_events e
  where e.at > now() - make_interval(days => greatest(1, least(p_days, 366)))
  group by e.actor_id;
$$;

grant execute on function public.participation(integer) to authenticated;

create or replace function public.purge_activity_events(p_older_than interval)
returns bigint
language sql
security definer
set search_path = public
as $$
  with gone as (delete from public.activity_events where at < now() - p_older_than returning 1)
  select count(*) from gone;
$$;
revoke execute on function public.purge_activity_events(interval) from public, authenticated, anon;

-- Notifications ----------------------------------------------------------------

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null,
  data jsonb not null default '{}'::jsonb,
  -- Where in the app it leads, relative to the recipient's own area.
  link text,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists notifications_recipient_idx on public.notifications (recipient_id, created_at desc);

alter table public.notifications enable row level security;
revoke insert, update, truncate on public.notifications from authenticated, anon;
-- Marking as read is the only change a recipient can make.
grant update (read_at) on public.notifications to authenticated;

drop policy if exists "People can read their own notifications" on public.notifications;
create policy "People can read their own notifications"
  on public.notifications for select
  using (recipient_id = auth.uid());

drop policy if exists "People can mark their own notifications read" on public.notifications;
create policy "People can mark their own notifications read"
  on public.notifications for update
  using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());

drop policy if exists "People can delete their own notifications" on public.notifications;
create policy "People can delete their own notifications"
  on public.notifications for delete
  using (recipient_id = auth.uid());

create or replace function public.notify(p_recipients uuid[], p_kind text, p_data jsonb, p_link text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.notifications (recipient_id, kind, data, link)
  select distinct r, p_kind, coalesce(p_data, '{}'::jsonb), p_link
  from unnest(p_recipients) r
  -- Never notify someone of their own action.
  where r is not null and r is distinct from auth.uid();
$$;
revoke execute on function public.notify(uuid[], text, jsonb, text) from public, authenticated, anon;

-- A weekly test is set: tell the learners who are to sit it.
create or replace function public.notify_weekly_test()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_learners uuid[];
begin
  if new.intervention_id is not null then
    select array_agg(learner_id) into v_learners from public.intervention_learners where intervention_id = new.intervention_id;
  elsif new.class_id is not null then
    select array_agg(learner_id) into v_learners from public.class_members where class_id = new.class_id;
  else
    select array_agg(id) into v_learners from public.profiles
      where school_id = new.school_id and role::text = 'learner' and grade = new.grade
        and (subject_id is null or subject_id = new.subject_id);
  end if;
  perform public.notify(v_learners, 'weekly_test.set',
    jsonb_build_object('test_id', new.id, 'title', new.title, 'due_at', new.due_at,
                       'catch_up', new.intervention_id is not null),
    'tests');
  return new;
end;
$$;

drop trigger if exists notify_weekly_test on public.weekly_tests;
create trigger notify_weekly_test
  after insert on public.weekly_tests
  for each row execute function public.notify_weekly_test();

-- Added to a catch-up group: tell the learner and their linked parents.
create or replace function public.notify_intervention_learner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_topic text := (select topic_id from public.interventions where id = new.intervention_id);
begin
  perform public.notify(array[new.learner_id], 'intervention.joined',
    jsonb_build_object('topic', v_topic), 'mistakes');
  perform public.notify(
    (select array_agg(parent_id) from public.parent_learner_links where learner_id = new.learner_id),
    'intervention.child_joined',
    jsonb_build_object('topic', v_topic, 'learner_id', new.learner_id), 'support');
  return new;
end;
$$;

drop trigger if exists notify_intervention_learner on public.intervention_learners;
create trigger notify_intervention_learner
  after insert on public.intervention_learners
  for each row execute function public.notify_intervention_learner();

-- Staff approval: tell approved staff someone is waiting, and tell the person
-- when they have been approved.
create or replace function public.notify_staff_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role::text in ('teacher', 'school', 'hod') and new.school_id is not null and new.staff_approved_at is null
     and (tg_op = 'INSERT' or old.school_id is distinct from new.school_id or old.role is distinct from new.role) then
    perform public.notify(
      (select array_agg(id) from public.profiles
        where school_id = new.school_id and role::text in ('teacher', 'school', 'hod') and staff_approved_at is not null),
      'staff.pending', jsonb_build_object('profile_id', new.id, 'role', new.role::text), 'dashboard');
  end if;
  if tg_op = 'UPDATE' and old.staff_approved_at is null and new.staff_approved_at is not null then
    perform public.notify(array[new.id], 'staff.approved', jsonb_build_object('role', new.role::text), 'dashboard');
  end if;
  return new;
end;
$$;

drop trigger if exists notify_staff_approval on public.profiles;
create trigger notify_staff_approval
  after insert or update on public.profiles
  for each row execute function public.notify_staff_approval();

-- A parent links to a learner: tell the learner, so nobody is followed silently.
create or replace function public.notify_parent_link()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify(array[new.learner_id], 'parent_link.created',
    jsonb_build_object('parent_id', new.parent_id), 'privacy');
  return new;
end;
$$;

drop trigger if exists notify_parent_link on public.parent_learner_links;
create trigger notify_parent_link
  after insert on public.parent_learner_links
  for each row execute function public.notify_parent_link();

-- ============================================================================
-- STEP 17: PLATFORM ADMINISTRATION, SUBSCRIPTIONS, PILOTS AND SPONSORS
-- ============================================================================
--
-- WHO RUNS THE PLATFORM. A platform administrator is DONE WELL staff, not
-- school staff. There is deliberately no way to become one from the app: an
-- operator adds a row to platform_admins in the SQL editor --
--
--   insert into public.platform_admins (user_id)
--   select id from auth.users where email = 'someone@example.com';
--
-- An administrator sees every school's TOTALS -- how many learners, how many
-- active, which plan -- and can pause a school and manage its subscription.
-- They do NOT get learners' names, answers or marks through any of this: the
-- overview is counts, computed inside the database.
--
-- PAUSING A SCHOOL. A paused (suspended) school's staff stop being staff as far
-- as the access rules are concerned, so they see no learner data until it is
-- reactivated. Learners keep their own account and progress.
--
-- SUBSCRIPTIONS. One row per licence period: a pilot, a school licence, or a
-- place in a sponsored programme, with a number of learner seats. Seats are
-- shown against the school's learner count; going over does NOT lock children
-- out -- it is flagged for the school and the administrator to sort out.
--
-- SPONSORS. A sponsor funds a programme of schools and sees how that programme
-- is doing -- in TOTALS ONLY, per school, never a learner. Where a school has
-- fewer than five learners its figures are withheld, because an average over
-- two or three children is close to a statement about each of them.

create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

alter table public.platform_admins enable row level security;
revoke insert, update, delete, truncate on public.platform_admins from authenticated, anon;

create or replace function public.is_platform_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.platform_admins where user_id = auth.uid());
$$;
grant execute on function public.is_platform_admin() to authenticated;

drop policy if exists "Administrators can see who the administrators are" on public.platform_admins;
create policy "Administrators can see who the administrators are"
  on public.platform_admins for select
  using (public.is_platform_admin());

alter table public.schools add column if not exists suspended_at timestamptz;

-- Staff of a paused school are not staff, as far as reading learner data goes.
create or replace function public.is_school_staff(p_school_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    join public.schools s on s.id = p.school_id
    where p.id = auth.uid()
      and p.school_id = p_school_id
      and p.role::text in ('teacher', 'school', 'hod')
      and p.staff_approved_at is not null
      and s.suspended_at is null
  );
$$;

create or replace function public.set_school_suspended(p_school uuid, p_suspend boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Only a platform administrator can pause or reactivate a school.';
  end if;
  update public.schools set suspended_at = case when p_suspend then now() else null end where id = p_school;
  perform public.write_audit(p_school, case when p_suspend then 'school.suspended' else 'school.reactivated' end,
    'schools', p_school::text, '{}'::jsonb);
end;
$$;
grant execute on function public.set_school_suspended(uuid, boolean) to authenticated;

-- Sponsors and programmes ----------------------------------------------------

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(btrim(name)) between 1 and 120),
  created_at timestamptz not null default now()
);

create table if not exists public.programmes (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid not null references public.sponsors (id) on delete restrict,
  name text not null check (length(btrim(name)) between 1 and 120),
  starts_on date,
  ends_on date,
  created_at timestamptz not null default now()
);

create table if not exists public.programme_schools (
  programme_id uuid not null references public.programmes (id) on delete cascade,
  school_id uuid not null references public.schools (id) on delete cascade,
  primary key (programme_id, school_id)
);

create table if not exists public.sponsor_members (
  sponsor_id uuid not null references public.sponsors (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  primary key (sponsor_id, user_id)
);

create or replace function public.is_sponsor_member(p_sponsor uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.sponsor_members where sponsor_id = p_sponsor and user_id = auth.uid());
$$;

create or replace function public.my_sponsor_ids()
returns setof uuid
language sql
security definer
stable
set search_path = public
as $$
  select sponsor_id from public.sponsor_members where user_id = auth.uid();
$$;
grant execute on function public.my_sponsor_ids() to authenticated;

-- Helpers for the policies below. Programmes and their schools each need to
-- look at the other to decide access, and two policies that read each other's
-- tables recurse forever -- so the lookups run as the owner instead.
create or replace function public.programme_sponsor(p_programme uuid)
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select sponsor_id from public.programmes where id = p_programme;
$$;

create or replace function public.staff_in_programme(p_programme uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.programme_schools ps
                 where ps.programme_id = p_programme and public.is_school_staff(ps.school_id));
$$;

create or replace function public.staff_sponsored_by(p_sponsor uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.programmes p join public.programme_schools ps on ps.programme_id = p.id
                 where p.sponsor_id = p_sponsor and public.is_school_staff(ps.school_id));
$$;

alter table public.sponsors enable row level security;
alter table public.programmes enable row level security;
alter table public.programme_schools enable row level security;
alter table public.sponsor_members enable row level security;

-- Administrators manage all of it.
drop policy if exists "Administrators manage sponsors" on public.sponsors;
create policy "Administrators manage sponsors" on public.sponsors for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
drop policy if exists "Administrators manage programmes" on public.programmes;
create policy "Administrators manage programmes" on public.programmes for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
drop policy if exists "Administrators manage programme schools" on public.programme_schools;
create policy "Administrators manage programme schools" on public.programme_schools for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
drop policy if exists "Administrators manage sponsor members" on public.sponsor_members;
create policy "Administrators manage sponsor members" on public.sponsor_members for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- A sponsor's own people see their sponsor and its programmes.
drop policy if exists "Sponsor members see their sponsor" on public.sponsors;
create policy "Sponsor members see their sponsor" on public.sponsors for select
  using (public.is_sponsor_member(id));
drop policy if exists "Sponsor members see their programmes" on public.programmes;
create policy "Sponsor members see their programmes" on public.programmes for select
  using (public.is_sponsor_member(sponsor_id));
drop policy if exists "Sponsor members see their programmes' schools" on public.programme_schools;
create policy "Sponsor members see their programmes' schools" on public.programme_schools for select
  using (public.is_sponsor_member(public.programme_sponsor(programme_id)));
drop policy if exists "Sponsor members see their own membership" on public.sponsor_members;
create policy "Sponsor members see their own membership" on public.sponsor_members for select
  using (user_id = auth.uid());

-- A school can see which programmes it is in, and who sponsors them.
drop policy if exists "Staff see their school's programmes" on public.programme_schools;
create policy "Staff see their school's programmes" on public.programme_schools for select
  using (public.is_school_staff(school_id));
drop policy if exists "Staff see programmes their school is in" on public.programmes;
create policy "Staff see programmes their school is in" on public.programmes for select
  using (public.staff_in_programme(id));
drop policy if exists "Staff see sponsors of their school's programmes" on public.sponsors;
create policy "Staff see sponsors of their school's programmes" on public.sponsors for select
  using (public.staff_sponsored_by(id));

-- Subscriptions -----------------------------------------------------------------

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  plan text not null check (plan in ('pilot', 'school', 'sponsored')),
  status text not null default 'active' check (status in ('active', 'past_due', 'cancelled', 'expired')),
  learner_seats integer check (learner_seats is null or learner_seats >= 0),
  starts_on date not null default current_date,
  ends_on date,
  programme_id uuid references public.programmes (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_school_idx on public.subscriptions (school_id, starts_on desc);

alter table public.subscriptions enable row level security;

drop policy if exists "Administrators manage subscriptions" on public.subscriptions;
create policy "Administrators manage subscriptions" on public.subscriptions for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "Staff can see their school's subscription" on public.subscriptions;
create policy "Staff can see their school's subscription" on public.subscriptions for select
  using (public.is_school_staff(school_id));

create or replace function public.audit_subscriptions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.subscriptions := case when tg_op = 'DELETE' then old else new end;
begin
  perform public.write_audit(r.school_id,
    'subscription.' || case tg_op when 'INSERT' then 'created' when 'UPDATE' then 'changed' else 'removed' end,
    'subscriptions', r.id::text,
    jsonb_build_object('plan', r.plan, 'status', r.status, 'seats', r.learner_seats, 'ends_on', r.ends_on));
  return r;
end;
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists touch_subscriptions on public.subscriptions;
create trigger touch_subscriptions
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

drop trigger if exists audit_subscriptions on public.subscriptions;
create trigger audit_subscriptions
  after insert or update or delete on public.subscriptions
  for each row execute function public.audit_subscriptions();

-- Administrator overview: every school, in counts only. -----------------------

create or replace function public.admin_school_overview()
returns table (
  school_id uuid, name text, created_at timestamptz, suspended_at timestamptz,
  learners bigint, staff bigint, pending_staff bigint, active_7d bigint,
  plan text, status text, learner_seats integer, ends_on date
)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Only a platform administrator can see every school.';
  end if;
  return query
  select s.id, s.name, s.created_at, s.suspended_at,
    (select count(*) from public.profiles p where p.school_id = s.id and p.role::text = 'learner'),
    (select count(*) from public.profiles p where p.school_id = s.id and p.role::text in ('teacher', 'school', 'hod') and p.staff_approved_at is not null),
    (select count(*) from public.profiles p where p.school_id = s.id and p.role::text in ('teacher', 'school', 'hod') and p.staff_approved_at is null),
    (select count(distinct e.actor_id) from public.activity_events e
       join public.profiles p on p.id = e.actor_id and p.role::text = 'learner'
       where e.school_id = s.id and e.at > now() - interval '7 days'),
    sub.plan, sub.status, sub.learner_seats, sub.ends_on
  from public.schools s
  left join lateral (
    select * from public.subscriptions x where x.school_id = s.id order by x.starts_on desc, x.created_at desc limit 1
  ) sub on true
  order by s.name;
end;
$$;
grant execute on function public.admin_school_overview() to authenticated;

-- Programme totals: what a sponsor sees. -----------------------------------------

create or replace function public.programme_totals(p_programme uuid)
returns table (
  school_id uuid, school_name text, withheld boolean,
  learners bigint, active_7d bigint, answers_7d bigint, average_mastery integer,
  tests_handed_in bigint, reassessed bigint, improved bigint
)
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v_sponsor uuid := (select sponsor_id from public.programmes where id = p_programme);
begin
  if v_sponsor is null then
    raise exception 'That programme was not found.';
  end if;
  if not (public.is_platform_admin() or public.is_sponsor_member(v_sponsor)) then
    raise exception 'Only the programme''s sponsor or a platform administrator can see its figures.';
  end if;
  return query
  with sch as (
    select s.id, s.name,
      (select count(*) from public.profiles p where p.school_id = s.id and p.role::text = 'learner') as n
    from public.programme_schools ps join public.schools s on s.id = ps.school_id
    where ps.programme_id = p_programme
  ),
  outcomes as (
    select i.school_id, il.learner_id, il.baseline_percent,
      (select round(100.0 * a.marks_awarded / nullif(a.marks_total, 0))
         from public.weekly_test_attempts a join public.weekly_tests t on t.id = a.test_id
         where t.intervention_id = i.id and a.learner_id = il.learner_id and a.submitted_at is not null
         order by t.due_at desc limit 1) as latest
    from public.interventions i join public.intervention_learners il on il.intervention_id = i.id
    where i.school_id in (select id from sch)
  )
  select sch.id, sch.name, sch.n < 5,
    case when sch.n < 5 then null else sch.n end,
    case when sch.n < 5 then null else (select count(distinct e.actor_id) from public.activity_events e
       join public.profiles p on p.id = e.actor_id and p.role::text = 'learner'
       where e.school_id = sch.id and e.at > now() - interval '7 days') end,
    case when sch.n < 5 then null else (select count(*) from public.activity_events e
       where e.school_id = sch.id and e.at > now() - interval '7 days' and e.kind in ('practice_answer', 'paper_answer')) end,
    case when sch.n < 5 then null else (select round(avg(lp.mastery_percent))::integer from public.learner_progress lp
       join public.profiles p on p.id = lp.learner_id where p.school_id = sch.id and p.role::text = 'learner') end,
    case when sch.n < 5 then null else (select count(*) from public.weekly_test_attempts a
       join public.weekly_tests t on t.id = a.test_id where t.school_id = sch.id and a.submitted_at is not null) end,
    case when sch.n < 5 then null else (select count(*) from outcomes o where o.school_id = sch.id and o.latest is not null and o.baseline_percent is not null) end,
    case when sch.n < 5 then null else (select count(*) from outcomes o where o.school_id = sch.id and o.latest > o.baseline_percent) end
  from sch
  order by sch.name;
end;
$$;
grant execute on function public.programme_totals(uuid) to authenticated;

-- Adding a sponsor's person by email. Administrators only; the email is looked
-- up, never stored in a DONE WELL table.
create or replace function public.add_sponsor_member(p_sponsor uuid, p_email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Only a platform administrator can add people to a sponsor.';
  end if;
  select id into v_user from auth.users where lower(email) = lower(btrim(p_email)) limit 1;
  if v_user is null then
    return false;
  end if;
  insert into public.sponsor_members (sponsor_id, user_id) values (p_sponsor, v_user) on conflict do nothing;
  return true;
end;
$$;
grant execute on function public.add_sponsor_member(uuid, text) to authenticated;

-- ============================================================================
-- STEP 18: CONTENT MANAGEMENT, FOR THE RESOURCE CENTRE AND SEARCH
-- ============================================================================
--
-- WHY. Every question, paper and note in DONE WELL lives in the code and is
-- reviewed through GitHub and its automated checks. That is a good home for the
-- core curriculum and a poor one for a lesson video link or a worksheet a
-- subject advisor wants to add on a Tuesday. The spec asks for an in-app
-- workflow -- Draft -> Review -> Approved -> Published -> Archived -- so that
-- nothing unreviewed ever reaches a learner.
--
-- WHO. Content editors are DONE WELL people, added by a platform administrator.
-- An editor can write and submit; an editor who may REVIEW can approve and
-- publish -- but never their own work. Administrators can do everything except
-- approve their own work: two people see every item before it goes out.
--
-- WHAT LEARNERS SEE. Only PUBLISHED items, and only those for everyone.
-- Items marked for teachers are shown to approved school staff only. Drafts
-- and archived items are visible to editors alone.
--
-- HOW STATUS CHANGES. Only through content_transition(), which checks the
-- step is allowed and who is taking it, and records it in content_events. A
-- published item cannot be edited in place: send it back to draft first, which
-- takes it off the resource centre until it is approved again.

create table if not exists public.content_editors (
  user_id uuid primary key references auth.users (id) on delete cascade,
  can_review boolean not null default false,
  added_at timestamptz not null default now()
);

alter table public.content_editors enable row level security;
revoke insert, update, delete, truncate on public.content_editors from authenticated, anon;

create or replace function public.is_content_editor()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.is_platform_admin() or exists (select 1 from public.content_editors where user_id = auth.uid());
$$;
grant execute on function public.is_content_editor() to authenticated;

create or replace function public.is_content_reviewer()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.is_platform_admin()
      or exists (select 1 from public.content_editors where user_id = auth.uid() and can_review);
$$;
grant execute on function public.is_content_reviewer() to authenticated;

drop policy if exists "Editors can see the editors" on public.content_editors;
create policy "Editors can see the editors" on public.content_editors for select
  using (public.is_content_editor());

-- Approved staff at any school that is not paused.
create or replace function public.is_any_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p join public.schools s on s.id = p.school_id
    where p.id = auth.uid() and p.role::text in ('teacher', 'school', 'hod')
      and p.staff_approved_at is not null and s.suspended_at is null
  );
$$;

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in
    ('lesson', 'video', 'worksheet', 'practice', 'assessment', 'memo', 'study_guide', 'revision', 'teacher_resource', 'question')),
  title text not null check (length(btrim(title)) between 1 and 200),
  summary text not null default '' check (length(summary) <= 600),
  body text not null default '' check (length(body) <= 50000),
  -- A link for a video or a document kept elsewhere. https only.
  url text check (url is null or url ~ '^https://'),
  subject_id text,
  grade smallint check (grade is null or grade in (10, 11, 12)),
  topic_id text,
  difficulty text check (difficulty is null or difficulty in ('Easy', 'Moderate', 'Challenge')),
  -- For a question: its answer and marks.
  answer text check (answer is null or length(answer) <= 5000),
  marks smallint check (marks is null or marks between 1 and 50),
  audience text not null default 'everyone' check (audience in ('everyone', 'teachers')),
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'published', 'archived')),
  created_by uuid references auth.users (id) on delete set null,
  approved_by uuid references auth.users (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_items_status_idx on public.content_items (status, kind);

create table if not exists public.content_events (
  id bigint generated always as identity primary key,
  content_id uuid not null references public.content_items (id) on delete cascade,
  from_status text,
  to_status text not null,
  actor_id uuid,
  note text check (note is null or length(note) <= 1000),
  at timestamptz not null default now()
);

alter table public.content_items enable row level security;
alter table public.content_events enable row level security;
revoke delete, truncate on public.content_items from authenticated, anon;
revoke insert, update, delete, truncate on public.content_events from authenticated, anon;

drop policy if exists "Everyone signed in can read published content for everyone" on public.content_items;
create policy "Everyone signed in can read published content for everyone" on public.content_items for select
  using (status = 'published' and audience = 'everyone' and auth.uid() is not null);

drop policy if exists "School staff can read published teacher content" on public.content_items;
create policy "School staff can read published teacher content" on public.content_items for select
  using (status = 'published' and audience = 'teachers' and public.is_any_staff());

drop policy if exists "Editors can read all content" on public.content_items;
create policy "Editors can read all content" on public.content_items for select
  using (public.is_content_editor());

drop policy if exists "Editors can create drafts" on public.content_items;
create policy "Editors can create drafts" on public.content_items for insert
  with check (public.is_content_editor() and created_by = auth.uid() and status = 'draft');

drop policy if exists "Editors can edit drafts" on public.content_items;
create policy "Editors can edit drafts" on public.content_items for update
  using (public.is_content_editor() and status = 'draft')
  with check (public.is_content_editor());

drop policy if exists "Editors can read the history" on public.content_events;
create policy "Editors can read the history" on public.content_events for select
  using (public.is_content_editor());

-- Status and approval are never set by writing to the row.
create or replace function public.guard_content_item()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.status := 'draft';
    new.approved_by := null;
    new.published_at := null;
    new.created_by := auth.uid();
    return new;
  end if;
  if new.status is distinct from old.status or new.approved_by is distinct from old.approved_by
     or new.published_at is distinct from old.published_at or new.created_by is distinct from old.created_by then
    raise exception 'Status changes go through content_transition().';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists guard_content_item on public.content_items;
create trigger guard_content_item
  before insert or update on public.content_items
  for each row execute function public.guard_content_item();

create or replace function public.content_transition(p_id uuid, p_to text, p_note text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.content_items;
  v_ok boolean := false;
begin
  select * into v from public.content_items where id = p_id;
  if v.id is null then
    raise exception 'That item was not found.';
  end if;
  if not public.is_content_editor() then
    raise exception 'Only content editors can change an item''s status.';
  end if;

  -- The allowed steps, and who may take each.
  if v.status = 'draft' and p_to = 'review' then
    v_ok := true;
  elsif v.status = 'review' and p_to = 'draft' then
    v_ok := true;  -- sent back, by its author or a reviewer
  elsif v.status = 'review' and p_to = 'approved' then
    if not public.is_content_reviewer() then
      raise exception 'Only a reviewer can approve an item.';
    end if;
    if v.created_by = auth.uid() then
      raise exception 'You cannot approve your own work. Another reviewer has to.';
    end if;
    v_ok := true;
  elsif v.status = 'approved' and p_to in ('published', 'draft') then
    if not public.is_content_reviewer() then
      raise exception 'Only a reviewer can publish an item.';
    end if;
    v_ok := true;
  elsif v.status = 'published' and p_to in ('archived', 'draft') then
    if not public.is_content_reviewer() then
      raise exception 'Only a reviewer can take a published item down.';
    end if;
    v_ok := true;
  elsif v.status = 'archived' and p_to = 'draft' then
    v_ok := true;
  end if;
  if not v_ok then
    raise exception 'An item cannot go from % to %.', v.status, p_to;
  end if;

  update public.content_items set
    status = p_to,
    approved_by = case when p_to = 'approved' then auth.uid() when p_to in ('draft', 'review') then null else approved_by end,
    published_at = case when p_to = 'published' then now() when p_to = 'draft' then null else published_at end,
    updated_at = now()
  where id = p_id;

  insert into public.content_events (content_id, from_status, to_status, actor_id, note)
  values (p_id, v.status, p_to, auth.uid(), nullif(btrim(coalesce(p_note, '')), ''));
end;
$$;
grant execute on function public.content_transition(uuid, text, text) to authenticated;

-- Adding an editor by the email they sign in with. Administrators only.
create or replace function public.add_content_editor(p_email text, p_can_review boolean)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Only a platform administrator can add content editors.';
  end if;
  select id into v_user from auth.users where lower(email) = lower(btrim(p_email)) limit 1;
  if v_user is null then
    return false;
  end if;
  insert into public.content_editors (user_id, can_review) values (v_user, p_can_review)
  on conflict (user_id) do update set can_review = excluded.can_review;
  return true;
end;
$$;
grant execute on function public.add_content_editor(text, boolean) to authenticated;

-- ============================================================================
-- STEP 19: THE TUTOR'S DAILY LIMIT
-- ============================================================================
--
-- WHY. "Check my working" sends a learner's question, and perhaps a photo of
-- their working, to an AI model through supabase/functions/tutor. Each check
-- costs money, so each learner gets a daily allowance (20 by default, set by
-- the TUTOR_DAILY_LIMIT secret). This table is what the allowance counts.
--
-- WHAT IS KEPT. One row per check: who asked, for which subject, and when.
-- Never the question, the photo or the reply -- those go to the model and back
-- to the learner, and nowhere else. A demo check (only if TUTOR_ALLOW_DEMO is
-- switched on) has no user; it is counted against a one-way hash of the
-- caller's network address instead. Rows older than 30 days are deleted by
-- the function each time it runs.
--
-- WHO CAN WRITE. Only the tutor function, which uses the service role. A
-- learner can read their own rows (to see what is left of today's allowance)
-- and nothing else.

create table if not exists public.tutor_requests (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete cascade,
  client_key text,
  subject_id text not null,
  created_at timestamptz not null default now(),
  constraint tutor_requests_who check (user_id is not null or client_key is not null)
);

create index if not exists tutor_requests_user_time on public.tutor_requests (user_id, created_at desc);
create index if not exists tutor_requests_client_time on public.tutor_requests (client_key, created_at desc);

alter table public.tutor_requests enable row level security;
revoke insert, update, delete, truncate on public.tutor_requests from authenticated, anon;

drop policy if exists tutor_requests_own on public.tutor_requests;
create policy tutor_requests_own on public.tutor_requests
  for select to authenticated
  using (user_id = auth.uid());

-- ============================================================================
-- STEP 20: LESSON PLAN RECORDS AND HOD SIGN-OFF
-- ============================================================================
--
-- The lesson plans themselves are built in the app from the ATP and are the
-- same for everyone, so they are not stored. What is stored is the teacher's
-- RECORD of a week: which plan (subject, grade, ATP week, and the two choices
-- that change it -- weeks on the topic and period length), the dates it was
-- actually taught, how many of the planned lessons were taught, and the
-- teacher's own reflection. From those ids the head of department's screen
-- rebuilds exactly the plan the teacher used.
--
-- THE FLOW. A teacher saves a record as a draft and submits it. The HOD of
-- that subject -- or the principal, for a school without one -- signs it off
-- or returns it with a comment saying what to change. A returned record can be
-- edited and submitted again. A signed record is final: nobody can change or
-- delete it, because it is the department's evidence that the ATP was covered.
--
-- WHO CAN DO WHAT.
--   * A teacher reads, writes and deletes only their own records, at their own
--     school, and only while they are not signed.
--   * The HOD for the record's subject and the principal read every submitted,
--     returned or signed record at their school in that subject (a draft is
--     the teacher's own until they submit it), and change them only through
--     review_lesson_plan(), which decides what may change. Nobody signs off
--     their own record.
--   * A teacher's edits can never touch the review fields; a trigger keeps them.

create table if not exists public.lesson_plan_records (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id) on delete cascade,
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  subject_id text not null,
  grade smallint not null check (grade in (10, 11, 12)),
  year smallint not null default extract(year from now())::smallint,
  -- The ATP entry, by its position in that subject and grade's plan.
  week_index smallint not null check (week_index >= 0),
  -- What the plan was called when it was saved, for lists, and in case the
  -- ATP is revised and the index later points somewhere else.
  title text not null check (length(title) between 1 and 200),
  term smallint not null check (term between 1 and 4),
  topic_id text,
  weeks smallint check (weeks between 1 and 12),
  lesson_minutes smallint not null default 60 check (lesson_minutes between 20 and 120),
  lessons_planned smallint not null default 0 check (lessons_planned between 0 and 60),
  lessons_taught smallint not null default 0 check (lessons_taught between 0 and 60),
  dates text not null default '' check (length(dates) <= 100),
  reflection text not null default '' check (length(reflection) <= 2000),
  status text not null default 'draft' check (status in ('draft', 'submitted', 'signed', 'returned')),
  submitted_at timestamptz,
  review_comment text not null default '' check (length(review_comment) <= 1000),
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (teacher_id, subject_id, grade, year, week_index)
);

create index if not exists lesson_plan_records_school_idx
  on public.lesson_plan_records (school_id, subject_id, status);

alter table public.lesson_plan_records enable row level security;

-- The HOD of the subject, or the principal, approved and at this school.
create or replace function public.can_review_lesson_plans(p_school uuid, p_subject text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.is_school_staff(p_school) and exists (
    select 1 from public.profiles
    where id = auth.uid() and school_id = p_school and staff_approved_at is not null
      and (role::text = 'school' or (role::text = 'hod' and subject_id = p_subject))
  );
$$;
grant execute on function public.can_review_lesson_plans(uuid, text) to authenticated;

drop policy if exists "Teachers can read their own lesson plan records" on public.lesson_plan_records;
create policy "Teachers can read their own lesson plan records"
  on public.lesson_plan_records for select
  using (teacher_id = auth.uid());

drop policy if exists "The HOD and principal can read their school's records" on public.lesson_plan_records;
create policy "The HOD and principal can read their school's records"
  on public.lesson_plan_records for select
  using (status <> 'draft' and public.can_review_lesson_plans(school_id, subject_id));

drop policy if exists "Teachers can record a week at their school" on public.lesson_plan_records;
create policy "Teachers can record a week at their school"
  on public.lesson_plan_records for insert
  with check (
    teacher_id = auth.uid()
    and school_id = public.current_school_id()
    and public.is_school_staff(school_id)
    and status in ('draft', 'submitted')
    and reviewed_by is null and reviewed_at is null and review_comment = ''
  );

drop policy if exists "Teachers can change their own records until signed" on public.lesson_plan_records;
create policy "Teachers can change their own records until signed"
  on public.lesson_plan_records for update
  using (teacher_id = auth.uid() and status <> 'signed')
  with check (
    teacher_id = auth.uid()
    and school_id = public.current_school_id()
    and public.is_school_staff(school_id)
    and status in ('draft', 'submitted')
  );

drop policy if exists "Teachers can delete their own records until signed" on public.lesson_plan_records;
create policy "Teachers can delete their own records until signed"
  on public.lesson_plan_records for delete
  using (teacher_id = auth.uid() and status <> 'signed');

-- A teacher's edit keeps the review fields, the owner, the school and the
-- plan's identity, and stamps the times. The review function runs as the
-- reviewer, so it passes through with what it set.
create or replace function public.guard_lesson_plan_record()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.submitted_at := case when new.status = 'submitted' then now() end;
    new.created_at := now();
    new.updated_at := now();
    return new;
  end if;
  if coalesce(current_setting('app.lesson_plan_review', true), '') <> 'on' then
    new.review_comment := old.review_comment;
    new.reviewed_by := old.reviewed_by;
    new.reviewed_at := old.reviewed_at;
    if new.status = 'submitted' and old.status is distinct from 'submitted' then
      new.submitted_at := now();
    elsif new.status = 'draft' then
      new.submitted_at := null;
    else
      new.submitted_at := old.submitted_at;
    end if;
  end if;
  new.id := old.id;
  new.teacher_id := old.teacher_id;
  new.school_id := old.school_id;
  new.subject_id := old.subject_id;
  new.grade := old.grade;
  new.year := old.year;
  new.week_index := old.week_index;
  new.created_at := old.created_at;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists guard_lesson_plan_record on public.lesson_plan_records;
create trigger guard_lesson_plan_record
  before insert or update on public.lesson_plan_records
  for each row execute function public.guard_lesson_plan_record();

-- Sign off, or return with a comment. Only a submitted record, only by its
-- subject's HOD or the principal, never by the teacher who wrote it.
create or replace function public.review_lesson_plan(p_record uuid, p_sign boolean, p_comment text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.lesson_plan_records;
  v_comment text := btrim(coalesce(p_comment, ''));
begin
  select * into r from public.lesson_plan_records where id = p_record for update;
  if not found or not public.can_review_lesson_plans(r.school_id, r.subject_id) then
    raise exception 'You cannot review this lesson plan record.' using errcode = '42501';
  end if;
  if r.teacher_id = auth.uid() then
    raise exception 'Nobody signs off their own lesson plan.' using errcode = '42501';
  end if;
  if r.status <> 'submitted' then
    raise exception 'Only a submitted record can be reviewed.' using errcode = '22023';
  end if;
  if not p_sign and v_comment = '' then
    raise exception 'Say what to change when returning a record.' using errcode = '22023';
  end if;
  if length(v_comment) > 1000 then
    raise exception 'Keep the comment under 1000 characters.' using errcode = '22023';
  end if;
  perform set_config('app.lesson_plan_review', 'on', true);
  update public.lesson_plan_records
    set status = case when p_sign then 'signed' else 'returned' end,
        review_comment = v_comment,
        reviewed_by = auth.uid(),
        reviewed_at = now()
    where id = p_record;
  perform set_config('app.lesson_plan_review', '', true);
end;
$$;
revoke execute on function public.review_lesson_plan(uuid, boolean, text) from public, anon;
grant execute on function public.review_lesson_plan(uuid, boolean, text) to authenticated;

-- Audit: submitted, signed and returned. The reflection and the comment are
-- the teacher's and the HOD's own words and are not copied into the log.
create or replace function public.audit_lesson_plan_records()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('submitted', 'signed', 'returned')
     and (tg_op = 'INSERT' or new.status is distinct from old.status) then
    perform public.write_audit(new.school_id, 'lesson_plan.' || new.status, 'lesson_plan_records', new.id::text,
      jsonb_build_object('subject', new.subject_id, 'grade', new.grade, 'title', new.title, 'teacher_id', new.teacher_id));
  end if;
  return new;
end;
$$;

drop trigger if exists audit_lesson_plan_records on public.lesson_plan_records;
create trigger audit_lesson_plan_records
  after insert or update on public.lesson_plan_records
  for each row execute function public.audit_lesson_plan_records();

-- Notifications: a submission goes to the reviewers; a decision to the teacher.
create or replace function public.notify_lesson_plan_record()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_data jsonb := jsonb_build_object('record_id', new.id, 'title', new.title, 'grade', new.grade,
                                     'subject', new.subject_id, 'profile_id', new.teacher_id);
begin
  if tg_op = 'UPDATE' and new.status is not distinct from old.status then
    return new;
  end if;
  if new.status = 'submitted' then
    perform public.notify(
      array(select id from public.profiles
            where school_id = new.school_id and staff_approved_at is not null
              and (role::text = 'school' or (role::text = 'hod' and subject_id = new.subject_id))),
      'lesson_plan.submitted', v_data, 'plan-signoff');
  elsif new.status in ('signed', 'returned') then
    perform public.notify(array[new.teacher_id], 'lesson_plan.' || new.status, v_data, 'lesson-plans');
  end if;
  return new;
end;
$$;

drop trigger if exists notify_lesson_plan_record on public.lesson_plan_records;
create trigger notify_lesson_plan_record
  after insert or update on public.lesson_plan_records
  for each row execute function public.notify_lesson_plan_record();

-- ============================================================================
-- STEP 21: THE SBA MARK BOOK
-- ============================================================================
--
-- A class's marks for the formal tasks of the DBE Programme of Assessment:
-- one row per learner per task, with the mark and what it is out of, or a
-- note that the learner was absent or exempted. The app works out the SBA
-- and promotion marks from these with the programme's weights, so only the
-- raw marks are stored.
--
-- WHO CAN DO WHAT.
--   * The class's teacher, the HODs and the principal (whoever can manage the
--     class, as for class lists) enter and correct marks, only for learners
--     in that class.
--   * Every approved staff member at the school can read the marks, for
--     moderation.
--   * A learner reads their own marks; a linked parent reads their child's.
--   * The school, subject and grade are taken from the class, and who made
--     the change and when are stamped by the database.
--   * Every change is written to the audit log with the old and new mark,
--     because an SBA mark is evidence and a changed one must be traceable.

create table if not exists public.sba_marks (
  id bigint generated always as identity primary key,
  school_id uuid not null references public.schools (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  learner_id uuid not null references public.profiles (id) on delete cascade,
  subject_id text not null,
  grade smallint not null check (grade in (10, 11, 12)),
  year smallint not null default extract(year from now())::smallint,
  -- The task, by its place in the grade's programme ("t1-0"), as the app names it.
  task_key text not null check (task_key ~ '^t[1-4]-[0-9]{1,2}$'),
  out_of smallint not null check (out_of between 1 and 1000),
  mark numeric(6, 1) check (mark >= 0),
  status text not null default 'marked' check (status in ('marked', 'absent', 'exempt')),
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (class_id, learner_id, year, task_key),
  constraint sba_marks_mark_fits check (mark is null or mark <= out_of),
  constraint sba_marks_mark_or_status check ((status = 'marked') = (mark is not null))
);

create index if not exists sba_marks_class_idx on public.sba_marks (class_id, year);
create index if not exists sba_marks_learner_idx on public.sba_marks (learner_id);

alter table public.sba_marks enable row level security;

drop policy if exists "Staff can read the mark book at their school" on public.sba_marks;
create policy "Staff can read the mark book at their school"
  on public.sba_marks for select
  using (public.is_school_staff(school_id));

drop policy if exists "Learners can read their own marks" on public.sba_marks;
create policy "Learners can read their own marks"
  on public.sba_marks for select
  using (learner_id = auth.uid());

drop policy if exists "Linked parents can read their child's marks" on public.sba_marks;
create policy "Linked parents can read their child's marks"
  on public.sba_marks for select
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = sba_marks.learner_id
        and parent_learner_links.parent_id = auth.uid()
    )
  );

drop policy if exists "Class managers can enter marks for their class" on public.sba_marks;
create policy "Class managers can enter marks for their class"
  on public.sba_marks for insert
  with check (
    public.can_manage_class_id(class_id)
    and exists (select 1 from public.class_members cm where cm.class_id = sba_marks.class_id and cm.learner_id = sba_marks.learner_id)
  );

drop policy if exists "Class managers can correct marks for their class" on public.sba_marks;
create policy "Class managers can correct marks for their class"
  on public.sba_marks for update
  using (public.can_manage_class_id(class_id))
  with check (
    public.can_manage_class_id(class_id)
    and exists (select 1 from public.class_members cm where cm.class_id = sba_marks.class_id and cm.learner_id = sba_marks.learner_id)
  );

drop policy if exists "Class managers can clear marks for their class" on public.sba_marks;
create policy "Class managers can clear marks for their class"
  on public.sba_marks for delete
  using (public.can_manage_class_id(class_id));

-- The class decides the school, subject and grade; the database decides who
-- and when. A row cannot be moved to another class, learner, year or task.
create or replace function public.stamp_sba_mark()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.classes;
begin
  if tg_op = 'UPDATE' then
    new.class_id := old.class_id;
    new.learner_id := old.learner_id;
    new.year := old.year;
    new.task_key := old.task_key;
  end if;
  select * into c from public.classes where id = new.class_id;
  new.school_id := c.school_id;
  new.subject_id := c.subject_id;
  new.grade := c.grade;
  new.updated_by := auth.uid();
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists stamp_sba_mark on public.sba_marks;
create trigger stamp_sba_mark
  before insert or update on public.sba_marks
  for each row execute function public.stamp_sba_mark();

create or replace function public.audit_sba_marks()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.sba_marks := case when tg_op = 'DELETE' then old else new end;
  v_old text := case when tg_op = 'INSERT' then null when old.status = 'marked' then old.mark::text else old.status end;
  v_new text := case when tg_op = 'DELETE' then null when new.status = 'marked' then new.mark::text else new.status end;
begin
  if tg_op = 'UPDATE' and v_old is not distinct from v_new and old.out_of = new.out_of then
    return new;
  end if;
  perform public.write_audit(r.school_id, 'sba_mark.' || lower(tg_op), 'sba_marks', r.learner_id::text,
    jsonb_build_object('class_id', r.class_id, 'task', r.task_key, 'year', r.year, 'out_of', r.out_of,
                       'subject', r.subject_id, 'grade', r.grade, 'from', v_old, 'to', v_new));
  return r;
end;
$$;

drop trigger if exists audit_sba_marks on public.sba_marks;
create trigger audit_sba_marks
  after insert or update or delete on public.sba_marks
  for each row execute function public.audit_sba_marks();

-- ============================================================================
-- STEP 22: RELEASING SBA MARKS TO LEARNERS AND PARENTS
-- ============================================================================
--
-- A teacher marks a task over several days, and moderates or corrects it
-- before the class sees it. So learners and parents see a task's marks only
-- once it is RELEASED for that class: one row here per class, year and task.
-- Staff see every mark as before.
--
-- WHO CAN DO WHAT.
--   * Whoever can enter the class's marks (the class teacher, the HODs, the
--     principal) releases a task, and can withdraw a release, which hides the
--     task's marks again until it is released once more.
--   * Staff at the school and the learners in the class can see what has been
--     released.
--   * On release, each learner with a mark for the task is told, and so is
--     each of their linked parents. Releases and withdrawals are audited.
--
-- NOTE. Marks entered before this step become hidden from learners and
-- parents until their task is released.

create table if not exists public.sba_releases (
  class_id uuid not null references public.classes (id) on delete cascade,
  year smallint not null,
  task_key text not null check (task_key ~ '^t[1-4]-[0-9]{1,2}$'),
  school_id uuid not null references public.schools (id) on delete cascade,
  released_by uuid references public.profiles (id) on delete set null,
  released_at timestamptz not null default now(),
  primary key (class_id, year, task_key)
);

alter table public.sba_releases enable row level security;

drop policy if exists "Staff can see what has been released" on public.sba_releases;
create policy "Staff can see what has been released"
  on public.sba_releases for select
  using (public.is_school_staff(school_id));

drop policy if exists "Learners can see what has been released to their class" on public.sba_releases;
create policy "Learners can see what has been released to their class"
  on public.sba_releases for select
  using (public.is_class_member(class_id));

drop policy if exists "Class managers can release marks" on public.sba_releases;
create policy "Class managers can release marks"
  on public.sba_releases for insert
  with check (public.can_manage_class_id(class_id));

drop policy if exists "Class managers can withdraw a release" on public.sba_releases;
create policy "Class managers can withdraw a release"
  on public.sba_releases for delete
  using (public.can_manage_class_id(class_id));

create or replace function public.stamp_sba_release()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  select school_id into new.school_id from public.classes where id = new.class_id;
  new.released_by := auth.uid();
  new.released_at := now();
  return new;
end;
$$;

drop trigger if exists stamp_sba_release on public.sba_releases;
create trigger stamp_sba_release
  before insert on public.sba_releases
  for each row execute function public.stamp_sba_release();

create or replace function public.sba_mark_released(p_class uuid, p_year smallint, p_task text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.sba_releases
    where class_id = p_class and year = p_year and task_key = p_task
  );
$$;
grant execute on function public.sba_mark_released(uuid, smallint, text) to authenticated;

drop policy if exists "Learners can read their own marks" on public.sba_marks;
create policy "Learners can read their own marks"
  on public.sba_marks for select
  using (learner_id = auth.uid() and public.sba_mark_released(class_id, year, task_key));

drop policy if exists "Linked parents can read their child's marks" on public.sba_marks;
create policy "Linked parents can read their child's marks"
  on public.sba_marks for select
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = sba_marks.learner_id
        and parent_learner_links.parent_id = auth.uid()
    )
    and public.sba_mark_released(class_id, year, task_key)
  );

create or replace function public.after_sba_release()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.sba_releases := case when tg_op = 'DELETE' then old else new end;
  c public.classes;
  v_data jsonb;
  v_learners uuid[];
  l record;
begin
  select * into c from public.classes where id = r.class_id;
  v_data := jsonb_build_object('class_id', r.class_id, 'task', r.task_key, 'year', r.year,
                               'subject', c.subject_id, 'grade', c.grade);
  perform public.write_audit(r.school_id, case when tg_op = 'DELETE' then 'sba_release.withdrawn' else 'sba_release.released' end,
    'sba_releases', r.class_id::text, v_data);
  if tg_op = 'INSERT' then
    select array_agg(learner_id) into v_learners from public.sba_marks
      where class_id = r.class_id and year = r.year and task_key = r.task_key;
    perform public.notify(v_learners, 'sba_marks.released', v_data, 'marks');
    for l in
      select pl.parent_id, pl.learner_id from public.parent_learner_links pl
      where pl.learner_id = any (coalesce(v_learners, '{}'))
    loop
      perform public.notify(array[l.parent_id], 'sba_marks.child_released', v_data || jsonb_build_object('learner_id', l.learner_id), 'marks');
    end loop;
  end if;
  return r;
end;
$$;

drop trigger if exists after_sba_release on public.sba_releases;
create trigger after_sba_release
  after insert or delete on public.sba_releases
  for each row execute function public.after_sba_release();

-- ============================================================================
-- STEP 23: SBA MODERATION
-- ============================================================================
--
-- Internal moderation of a formal task: the subject's head of department (or
-- the principal) re-marks a sample of a class's scripts, and the app compares
-- each moderated mark with the teacher's. The moderator then ACCEPTS the
-- task's marks or RETURNS them to the teacher with a comment saying what to
-- look at again (usually to re-mark the class against the memo).
--
-- WHO CAN DO WHAT.
--   * The HOD of the class's subject or the principal moderates -- never the
--     class's own teacher, so nobody moderates their own marking.
--   * Only a script the teacher has marked can be moderated, and the teacher's
--     mark is copied in each time the moderated mark is saved, so the sample
--     compares like with like even after the teacher corrects a mark.
--   * Once a task is accepted its sample is locked. The moderator can reopen
--     it, which removes the decision.
--   * Every staff member at the school can read the sample and the decision;
--     learners and parents cannot.
--   * Decisions and reopenings are audited, and the class teacher is told of
--     each decision.

create table if not exists public.sba_moderation_marks (
  class_id uuid not null references public.classes (id) on delete cascade,
  year smallint not null,
  task_key text not null check (task_key ~ '^t[1-4]-[0-9]{1,2}$'),
  learner_id uuid not null references public.profiles (id) on delete cascade,
  school_id uuid not null references public.schools (id) on delete cascade,
  teacher_mark numeric(6, 1) not null,
  moderated_mark numeric(6, 1) not null check (moderated_mark >= 0),
  out_of smallint not null,
  moderator_id uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (class_id, year, task_key, learner_id),
  constraint sba_moderation_mark_fits check (moderated_mark <= out_of)
);

create table if not exists public.sba_moderations (
  class_id uuid not null references public.classes (id) on delete cascade,
  year smallint not null,
  task_key text not null check (task_key ~ '^t[1-4]-[0-9]{1,2}$'),
  school_id uuid not null references public.schools (id) on delete cascade,
  status text not null check (status in ('accepted', 'returned')),
  comment text not null default '' check (length(comment) <= 1000),
  sample_size smallint not null,
  mean_difference numeric(5, 1) not null,
  moderator_id uuid references public.profiles (id) on delete set null,
  decided_at timestamptz not null default now(),
  primary key (class_id, year, task_key)
);

alter table public.sba_moderation_marks enable row level security;
alter table public.sba_moderations enable row level security;

-- The HOD of the class's subject or the principal, but not the class's teacher.
create or replace function public.can_moderate_class(p_class uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.classes c
    where c.id = p_class
      and public.can_review_lesson_plans(c.school_id, c.subject_id)
      and c.teacher_id is distinct from auth.uid()
  );
$$;
grant execute on function public.can_moderate_class(uuid) to authenticated;

create or replace function public.sba_moderation_accepted(p_class uuid, p_year smallint, p_task text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.sba_moderations
    where class_id = p_class and year = p_year and task_key = p_task and status = 'accepted'
  );
$$;

drop policy if exists "Staff can read moderation samples" on public.sba_moderation_marks;
create policy "Staff can read moderation samples"
  on public.sba_moderation_marks for select
  using (public.is_school_staff(school_id));

drop policy if exists "Moderators can add to a sample" on public.sba_moderation_marks;
create policy "Moderators can add to a sample"
  on public.sba_moderation_marks for insert
  with check (public.can_moderate_class(class_id) and not public.sba_moderation_accepted(class_id, year, task_key));

drop policy if exists "Moderators can change a sample" on public.sba_moderation_marks;
create policy "Moderators can change a sample"
  on public.sba_moderation_marks for update
  using (public.can_moderate_class(class_id) and not public.sba_moderation_accepted(class_id, year, task_key))
  with check (public.can_moderate_class(class_id));

drop policy if exists "Moderators can take a script out of a sample" on public.sba_moderation_marks;
create policy "Moderators can take a script out of a sample"
  on public.sba_moderation_marks for delete
  using (public.can_moderate_class(class_id) and not public.sba_moderation_accepted(class_id, year, task_key));

drop policy if exists "Staff can read moderation decisions" on public.sba_moderations;
create policy "Staff can read moderation decisions"
  on public.sba_moderations for select
  using (public.is_school_staff(school_id));

drop policy if exists "Moderators can reopen a moderation" on public.sba_moderations;
create policy "Moderators can reopen a moderation"
  on public.sba_moderations for delete
  using (public.can_moderate_class(class_id));

-- Stamp a sample mark: the school from the class, and the teacher's mark and
-- total from the mark book as they stand now.
create or replace function public.stamp_sba_moderation_mark()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  m public.sba_marks;
begin
  if tg_op = 'UPDATE' then
    new.class_id := old.class_id;
    new.year := old.year;
    new.task_key := old.task_key;
    new.learner_id := old.learner_id;
  end if;
  select * into m from public.sba_marks
    where class_id = new.class_id and year = new.year and task_key = new.task_key and learner_id = new.learner_id;
  if not found or m.status <> 'marked' then
    raise exception 'Only a script the teacher has marked can be moderated.' using errcode = '22023';
  end if;
  new.school_id := m.school_id;
  new.teacher_mark := m.mark;
  new.out_of := m.out_of;
  new.moderator_id := auth.uid();
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists stamp_sba_moderation_mark on public.sba_moderation_marks;
create trigger stamp_sba_moderation_mark
  before insert or update on public.sba_moderation_marks
  for each row execute function public.stamp_sba_moderation_mark();

-- Accept the task's marks, or return them to the teacher with a comment.
create or replace function public.decide_sba_moderation(p_class uuid, p_year smallint, p_task text, p_accept boolean, p_comment text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_comment text := btrim(coalesce(p_comment, ''));
  v_school uuid;
  v_n integer;
  v_mean numeric;
begin
  if not public.can_moderate_class(p_class) then
    raise exception 'You cannot moderate this class.' using errcode = '42501';
  end if;
  if not p_accept and v_comment = '' then
    raise exception 'Say what the teacher should look at again.' using errcode = '22023';
  end if;
  if length(v_comment) > 1000 then
    raise exception 'Keep the comment under 1000 characters.' using errcode = '22023';
  end if;
  select count(*), avg(abs(moderated_mark - teacher_mark) * 100.0 / out_of)
    into v_n, v_mean
    from public.sba_moderation_marks
    where class_id = p_class and year = p_year and task_key = p_task;
  if v_n = 0 then
    raise exception 'Moderate at least one script first.' using errcode = '22023';
  end if;
  select school_id into v_school from public.classes where id = p_class;
  insert into public.sba_moderations (class_id, year, task_key, school_id, status, comment, sample_size, mean_difference, moderator_id, decided_at)
    values (p_class, p_year, p_task, v_school, case when p_accept then 'accepted' else 'returned' end, v_comment, v_n, round(v_mean, 1), auth.uid(), now())
    on conflict (class_id, year, task_key) do update
      set status = excluded.status, comment = excluded.comment, sample_size = excluded.sample_size,
          mean_difference = excluded.mean_difference, moderator_id = excluded.moderator_id, decided_at = excluded.decided_at;
end;
$$;
revoke execute on function public.decide_sba_moderation(uuid, smallint, text, boolean, text) from public, anon;
grant execute on function public.decide_sba_moderation(uuid, smallint, text, boolean, text) to authenticated;

-- Audit each decision and reopening; tell the class teacher of each decision.
-- The comment is the moderator's own words and is not copied into the log.
create or replace function public.after_sba_moderation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.sba_moderations := case when tg_op = 'DELETE' then old else new end;
  c public.classes;
  v_data jsonb;
begin
  select * into c from public.classes where id = r.class_id;
  v_data := jsonb_build_object('class_id', r.class_id, 'task', r.task_key, 'year', r.year, 'subject', c.subject_id,
                               'grade', c.grade, 'sample_size', r.sample_size, 'mean_difference', r.mean_difference);
  if tg_op = 'DELETE' then
    perform public.write_audit(r.school_id, 'sba_moderation.reopened', 'sba_moderations', r.class_id::text, v_data);
    return old;
  end if;
  if tg_op = 'UPDATE' and new.status is not distinct from old.status and new.comment is not distinct from old.comment then
    return new;
  end if;
  perform public.write_audit(r.school_id, 'sba_moderation.' || r.status, 'sba_moderations', r.class_id::text, v_data);
  perform public.notify(array[c.teacher_id], 'sba_moderation.' || r.status, v_data, 'markbook');
  return new;
end;
$$;

drop trigger if exists after_sba_moderation on public.sba_moderations;
create trigger after_sba_moderation
  after insert or update or delete on public.sba_moderations
  for each row execute function public.after_sba_moderation();

-- ============================================================================
-- STEP 24: THE SBA ASSESSMENT SCHEDULE
-- ============================================================================
--
-- The date each formal task is written, handed in or examined, per class,
-- so that learners and parents know what is coming -- the schedule a school
-- gives out at the start of each term -- and so that "overdue" counts from
-- the real date rather than from the end of the term.
--
-- WHO CAN DO WHAT.
--   * Whoever can manage the class (the class teacher, the HODs, the
--     principal) sets, moves and clears a task's date.
--   * Staff at the school, the learners in the class and their linked
--     parents can read the class's dates.
--   * When a date is set or moved, and it is still to come, each learner in
--     the class and each of their linked parents is told. Changes are
--     audited.

create table if not exists public.sba_task_dates (
  class_id uuid not null references public.classes (id) on delete cascade,
  year smallint not null,
  task_key text not null check (task_key ~ '^t[1-4]-[0-9]{1,2}$'),
  school_id uuid not null references public.schools (id) on delete cascade,
  subject_id text not null,
  grade smallint not null check (grade in (10, 11, 12)),
  due_on date not null,
  note text not null default '' check (length(note) <= 200),
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (class_id, year, task_key)
);

alter table public.sba_task_dates enable row level security;

drop policy if exists "Staff can read the assessment schedule" on public.sba_task_dates;
create policy "Staff can read the assessment schedule"
  on public.sba_task_dates for select
  using (public.is_school_staff(school_id));

drop policy if exists "Learners can read their class's schedule" on public.sba_task_dates;
create policy "Learners can read their class's schedule"
  on public.sba_task_dates for select
  using (public.is_class_member(class_id));

drop policy if exists "Linked parents can read their child's schedule" on public.sba_task_dates;
create policy "Linked parents can read their child's schedule"
  on public.sba_task_dates for select
  using (
    exists (
      select 1 from public.class_members cm
      join public.parent_learner_links pl on pl.learner_id = cm.learner_id
      where cm.class_id = sba_task_dates.class_id and pl.parent_id = auth.uid()
    )
  );

drop policy if exists "Class managers can set a date" on public.sba_task_dates;
create policy "Class managers can set a date"
  on public.sba_task_dates for insert
  with check (public.can_manage_class_id(class_id));

drop policy if exists "Class managers can move a date" on public.sba_task_dates;
create policy "Class managers can move a date"
  on public.sba_task_dates for update
  using (public.can_manage_class_id(class_id))
  with check (public.can_manage_class_id(class_id));

drop policy if exists "Class managers can clear a date" on public.sba_task_dates;
create policy "Class managers can clear a date"
  on public.sba_task_dates for delete
  using (public.can_manage_class_id(class_id));

-- The school, subject and grade come from the class; the keys never change.
create or replace function public.stamp_sba_task_date()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.classes;
begin
  if tg_op = 'UPDATE' then
    new.class_id := old.class_id;
    new.year := old.year;
    new.task_key := old.task_key;
  end if;
  select * into c from public.classes where id = new.class_id;
  new.school_id := c.school_id;
  new.subject_id := c.subject_id;
  new.grade := c.grade;
  new.note := btrim(new.note);
  new.updated_by := auth.uid();
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists stamp_sba_task_date on public.sba_task_dates;
create trigger stamp_sba_task_date
  before insert or update on public.sba_task_dates
  for each row execute function public.stamp_sba_task_date();

-- Audit every change; tell the class and their parents of a date to come.
create or replace function public.after_sba_task_date()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.sba_task_dates := case when tg_op = 'DELETE' then old else new end;
  v_data jsonb;
  v_learners uuid[];
  l record;
begin
  v_data := jsonb_build_object('class_id', r.class_id, 'task', r.task_key, 'year', r.year, 'subject', r.subject_id,
                               'grade', r.grade, 'due_on', r.due_on);
  if tg_op = 'UPDATE' and new.due_on is not distinct from old.due_on and new.note is not distinct from old.note then
    return new;
  end if;
  perform public.write_audit(r.school_id, 'sba_date.' || case tg_op when 'INSERT' then 'set' when 'UPDATE' then 'moved' else 'cleared' end,
    'sba_task_dates', r.class_id::text,
    v_data || case when tg_op = 'UPDATE' then jsonb_build_object('from', old.due_on) else '{}'::jsonb end);
  if tg_op = 'DELETE' or r.due_on < current_date or (tg_op = 'UPDATE' and new.due_on is not distinct from old.due_on) then
    return r;
  end if;
  v_data := v_data || jsonb_build_object('moved', tg_op = 'UPDATE');
  select array_agg(learner_id) into v_learners from public.class_members where class_id = r.class_id;
  perform public.notify(v_learners, 'sba_date.set', v_data, 'marks');
  for l in
    select pl.parent_id, pl.learner_id from public.parent_learner_links pl
    where pl.learner_id = any (coalesce(v_learners, '{}'))
  loop
    perform public.notify(array[l.parent_id], 'sba_date.child_set', v_data || jsonb_build_object('learner_id', l.learner_id), 'marks');
  end loop;
  return r;
end;
$$;

drop trigger if exists after_sba_task_date on public.sba_task_dates;
create trigger after_sba_task_date
  after insert or update or delete on public.sba_task_dates
  for each row execute function public.after_sba_task_date();

-- ============================================================================
-- STEP 25: REMINDERS THE DAY BEFORE A TASK
-- ============================================================================
--
-- Every afternoon, each learner with a formal task on the next day -- by the
-- assessment schedule of STEP 24 -- is reminded, and so is each of their
-- linked parents. "Tomorrow" is South African time. A task is only ever
-- reminded of once for its date: if the date moves, the new day gets its own
-- reminder.
--
-- The reminders are sent by send_sba_reminders(), which the database's own
-- timer (the pg_cron extension) runs at 14:00 UTC, 16:00 in South Africa.
-- Nobody signed in can run it; it returns how many reminders it sent.

create table if not exists public.sba_reminders_sent (
  class_id uuid not null references public.classes (id) on delete cascade,
  year smallint not null,
  task_key text not null,
  due_on date not null,
  sent_at timestamptz not null default now(),
  primary key (class_id, year, task_key, due_on)
);

-- Only the reminder function writes or reads this; nobody signed in sees it.
alter table public.sba_reminders_sent enable row level security;

create or replace function public.send_sba_reminders()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tomorrow date := (now() at time zone 'Africa/Johannesburg')::date + 1;
  d record;
  v_data jsonb;
  v_learners uuid[];
  v_sent integer := 0;
  l record;
begin
  for d in
    with fresh as (
      insert into public.sba_reminders_sent (class_id, year, task_key, due_on)
      select class_id, year, task_key, due_on from public.sba_task_dates where due_on = v_tomorrow
      on conflict do nothing
      returning class_id, year, task_key, due_on
    )
    select t.* from public.sba_task_dates t
    join fresh f on f.class_id = t.class_id and f.year = t.year and f.task_key = t.task_key
  loop
    v_data := jsonb_build_object('class_id', d.class_id, 'task', d.task_key, 'year', d.year, 'subject', d.subject_id,
                                 'grade', d.grade, 'due_on', d.due_on, 'note', d.note);
    select array_agg(learner_id) into v_learners from public.class_members where class_id = d.class_id;
    perform public.notify(v_learners, 'sba_date.tomorrow', v_data, 'marks');
    v_sent := v_sent + coalesce(array_length(v_learners, 1), 0);
    for l in
      select pl.parent_id, pl.learner_id from public.parent_learner_links pl
      where pl.learner_id = any (coalesce(v_learners, '{}'))
    loop
      perform public.notify(array[l.parent_id], 'sba_date.child_tomorrow', v_data || jsonb_build_object('learner_id', l.learner_id), 'marks');
      v_sent := v_sent + 1;
    end loop;
  end loop;
  return v_sent;
end;
$$;
revoke execute on function public.send_sba_reminders() from public, anon, authenticated;

-- The daily timer, where the pg_cron extension is switched on (Supabase:
-- Database > Extensions > pg_cron, or `create extension if not exists pg_cron
-- with schema pg_catalog;` first). Scheduling the same name again replaces the
-- job, so this is safe to run more than once. Without pg_cron nothing is
-- scheduled, and send_sba_reminders() can be run by hand.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('sba-reminders', '0 14 * * *', 'select public.send_sba_reminders()');
  end if;
end $$;

-- ============================================================================
-- STEP 26: TERM REPORT COMMENTS
-- ============================================================================
--
-- The teacher's comment on each learner's term in a subject, printed on the
-- term report beside the term mark (which the app works out from the mark
-- book, so it is not stored).
--
-- WHO CAN DO WHAT.
--   * Whoever can manage the class (the class teacher, the HODs, the
--     principal) writes, changes and clears comments, only for learners in
--     the class.
--   * Staff at the school read them; so does the learner, and each linked
--     parent, as they would on a paper report.

create table if not exists public.sba_term_comments (
  class_id uuid not null references public.classes (id) on delete cascade,
  learner_id uuid not null references public.profiles (id) on delete cascade,
  year smallint not null,
  term smallint not null check (term between 1 and 4),
  school_id uuid not null references public.schools (id) on delete cascade,
  subject_id text not null,
  grade smallint not null check (grade in (10, 11, 12)),
  comment text not null check (length(comment) between 1 and 600),
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (class_id, learner_id, year, term)
);

alter table public.sba_term_comments enable row level security;

drop policy if exists "Staff can read term comments" on public.sba_term_comments;
create policy "Staff can read term comments"
  on public.sba_term_comments for select
  using (public.is_school_staff(school_id));

drop policy if exists "Learners can read their own term comments" on public.sba_term_comments;
create policy "Learners can read their own term comments"
  on public.sba_term_comments for select
  using (learner_id = auth.uid());

drop policy if exists "Linked parents can read their child's term comments" on public.sba_term_comments;
create policy "Linked parents can read their child's term comments"
  on public.sba_term_comments for select
  using (
    exists (
      select 1 from public.parent_learner_links
      where parent_learner_links.learner_id = sba_term_comments.learner_id
        and parent_learner_links.parent_id = auth.uid()
    )
  );

drop policy if exists "Class managers can write term comments" on public.sba_term_comments;
create policy "Class managers can write term comments"
  on public.sba_term_comments for insert
  with check (
    public.can_manage_class_id(class_id)
    and exists (select 1 from public.class_members cm where cm.class_id = sba_term_comments.class_id and cm.learner_id = sba_term_comments.learner_id)
  );

drop policy if exists "Class managers can change term comments" on public.sba_term_comments;
create policy "Class managers can change term comments"
  on public.sba_term_comments for update
  using (public.can_manage_class_id(class_id))
  with check (public.can_manage_class_id(class_id));

drop policy if exists "Class managers can clear term comments" on public.sba_term_comments;
create policy "Class managers can clear term comments"
  on public.sba_term_comments for delete
  using (public.can_manage_class_id(class_id));

-- The school, subject and grade come from the class; the keys never change.
create or replace function public.stamp_sba_term_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.classes;
begin
  if tg_op = 'UPDATE' then
    new.class_id := old.class_id;
    new.learner_id := old.learner_id;
    new.year := old.year;
    new.term := old.term;
  end if;
  select * into c from public.classes where id = new.class_id;
  new.school_id := c.school_id;
  new.subject_id := c.subject_id;
  new.grade := c.grade;
  new.comment := btrim(new.comment);
  new.updated_by := auth.uid();
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists stamp_sba_term_comment on public.sba_term_comments;
create trigger stamp_sba_term_comment
  before insert or update on public.sba_term_comments
  for each row execute function public.stamp_sba_term_comment();

-- ============================================================================
-- STEP 27: PARENTS SEE THE WEEKLY TESTS THEIR CHILD SAT
-- ============================================================================
--
-- A parent's dashboard shows their child's level in each subject, worked out
-- from the child's weekly tests and released SBA marks. A parent could
-- already read the child's attempts (STEP 7), but not the tests themselves:
-- weekly_tests is read through the school, and a parent belongs to no school.
-- Without the test there is no subject or grade to put the result under.
--
-- WHO CAN DO WHAT.
--   * A linked parent reads a test their child has an attempt at -- the
--     title, subject, grade and topics, nothing about other learners. Tests
--     the child never sat stay out of view.
--
-- The check runs in a security-definer function, so the policy on
-- weekly_tests does not query weekly_test_attempts under that table's own
-- policies (which look back at weekly_tests, and would recurse).
create or replace function public.parent_sees_test(p_test uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.weekly_test_attempts a
    join public.parent_learner_links l on l.learner_id = a.learner_id
    where a.test_id = p_test and l.parent_id = auth.uid()
  );
$$;
grant execute on function public.parent_sees_test(uuid) to authenticated;

drop policy if exists "Linked parents can view tests their child sat" on public.weekly_tests;
create policy "Linked parents can view tests their child sat"
  on public.weekly_tests for select
  using (public.parent_sees_test(id));

-- ============================================================================
-- STEP 28: TEST KINDS AND EARLY WARNINGS
-- ============================================================================
--
-- Tracking a learner should not wait for the end of term. A teacher sets a
-- weekly test, a topic test or a monthly check, and the moment a learner
-- hands one in, the class teacher is told if it shows trouble: a result below
-- 40% (Level 1 or 2), or a fall in CAPS level since the learner's previous
-- test in that subject that lands at Level 4 or below, or drops two levels or
-- more. (A slip from Level 7 to 6 is left alone.) The app's Levels page lists the same learners with a
-- catch-up group one step away.
--
-- WHO CAN DO WHAT.
--   * Nothing new to read or write: the kind is one more column of a test,
--     under the same rules as the rest of it. The warning is written by the
--     database, to the teacher of the learner's class in that subject.
--   * Catch-up reassessments never raise a warning: they are sat by learners
--     already being helped.

alter table public.weekly_tests add column if not exists kind text not null default 'weekly';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'weekly_tests_kind_check') then
    alter table public.weekly_tests add constraint weekly_tests_kind_check check (kind in ('weekly', 'topic', 'monthly'));
  end if;
end $$;

-- The CAPS seven-point scale, on a percentage rounded to a whole number.
create or replace function public.caps_level(p_percent numeric)
returns smallint
language sql
immutable
as $$
  select (case
    when round(p_percent) >= 80 then 7
    when round(p_percent) >= 70 then 6
    when round(p_percent) >= 60 then 5
    when round(p_percent) >= 50 then 4
    when round(p_percent) >= 40 then 3
    when round(p_percent) >= 30 then 2
    else 1
  end)::smallint;
$$;

create or replace function public.flag_early_warning()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  t public.weekly_tests;
  v_pct numeric;
  v_prev numeric;
  v_level smallint;
  v_prev_level smallint;
  v_reason text;
  v_teachers uuid[];
begin
  if new.submitted_at is null or coalesce(new.marks_total, 0) = 0 then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.submitted_at is not null then
    return new;
  end if;
  select * into t from public.weekly_tests where id = new.test_id;
  if t.id is null or t.intervention_id is not null then
    return new;
  end if;

  v_pct := 100.0 * coalesce(new.marks_awarded, 0) / new.marks_total;
  select 100.0 * coalesce(a.marks_awarded, 0) / a.marks_total into v_prev
  from public.weekly_test_attempts a
  join public.weekly_tests p on p.id = a.test_id
  where a.learner_id = new.learner_id
    and a.id <> new.id
    and a.submitted_at is not null
    and a.submitted_at < new.submitted_at
    and coalesce(a.marks_total, 0) > 0
    and p.subject_id = t.subject_id
    and p.grade = t.grade
    and p.intervention_id is null
  order by a.submitted_at desc
  limit 1;

  v_level := public.caps_level(v_pct);
  v_prev_level := case when v_prev is null then null else public.caps_level(v_prev) end;
  if v_pct < 40 then
    v_reason := 'below_40';
  elsif v_prev_level is not null and v_level < v_prev_level and (v_level <= 4 or v_prev_level - v_level >= 2) then
    v_reason := 'dropped';
  else
    return new;
  end if;

  select array_agg(distinct c.teacher_id) into v_teachers
  from public.classes c
  join public.class_members m on m.class_id = c.id
  where m.learner_id = new.learner_id
    and c.subject_id = t.subject_id
    and c.grade = t.grade
    and c.teacher_id is not null;

  perform public.notify(v_teachers, 'level.early_warning',
    jsonb_build_object('learner_id', new.learner_id, 'test_id', t.id, 'title', t.title, 'kind', t.kind,
                       'subject', t.subject_id, 'grade', t.grade, 'percent', round(v_pct),
                       'level', v_level, 'previous_level', v_prev_level, 'reason', v_reason),
    'levels');
  return new;
end;
$$;

drop trigger if exists flag_early_warning on public.weekly_test_attempts;
create trigger flag_early_warning
  after insert or update of submitted_at on public.weekly_test_attempts
  for each row execute function public.flag_early_warning();

-- A test is set: the notification now says which kind of test it is.
create or replace function public.notify_weekly_test()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_learners uuid[];
begin
  if new.intervention_id is not null then
    select array_agg(learner_id) into v_learners from public.intervention_learners where intervention_id = new.intervention_id;
  elsif new.class_id is not null then
    select array_agg(learner_id) into v_learners from public.class_members where class_id = new.class_id;
  else
    select array_agg(id) into v_learners from public.profiles
      where school_id = new.school_id and role::text = 'learner' and grade = new.grade
        and (subject_id is null or subject_id = new.subject_id);
  end if;
  perform public.notify(v_learners, 'weekly_test.set',
    jsonb_build_object('test_id', new.id, 'title', new.title, 'due_at', new.due_at,
                       'catch_up', new.intervention_id is not null, 'kind', new.kind),
    'tests');
  return new;
end;
$$;

-- ============================================================================
-- STEP 29: A WEEKLY EARLY-WARNING SUMMARY FOR PRINCIPALS AND HODS
-- ============================================================================
--
-- Every Monday morning each principal, and each head of department for their
-- subject, is sent last week's early warnings in one notification: how many
-- learners were flagged (by the same rule as STEP 28), how many flagged in
-- the five weeks before are back at Level 4 or above, how many catch-up
-- groups were started, how many tests were set and handed in, and the three
-- classes with the most flags, with their teachers -- the ones to follow up.
-- "Last week" is Monday to Sunday, South African time. A week is only ever
-- summarised once for each person, and a quiet week sends nothing.
--
-- The summary is sent by send_early_warning_digest(), which the database's
-- own timer (pg_cron, as in STEP 25) runs at 05:00 UTC on Mondays, 07:00 in
-- South Africa. Nobody signed in can run it, or read the record of what was
-- sent.

create or replace function public.early_warning_events(p_school_id uuid, p_from timestamptz, p_to timestamptz)
returns table (learner_id uuid, subject_id text, grade smallint, test_id uuid, submitted_at timestamptz, percent numeric, level smallint, previous_level smallint, reason text)
language sql
stable
security definer
set search_path = public
as $$
  with scored as (
    select a.learner_id, t.subject_id, t.grade, t.id as test_id, a.submitted_at,
           100.0 * coalesce(a.marks_awarded, 0) / a.marks_total as pct,
           lag(100.0 * coalesce(a.marks_awarded, 0) / a.marks_total)
             over (partition by a.learner_id, t.subject_id, t.grade order by a.submitted_at) as prev
    from public.weekly_test_attempts a
    join public.weekly_tests t on t.id = a.test_id
    where t.school_id = p_school_id
      and t.intervention_id is null
      and a.submitted_at is not null
      and a.submitted_at < p_to
      and coalesce(a.marks_total, 0) > 0
  ),
  levelled as (
    select s.*, public.caps_level(s.pct) as lvl,
           case when s.prev is null then null else public.caps_level(s.prev) end as prev_lvl
    from scored s
    where s.submitted_at >= p_from
  )
  select l.learner_id, l.subject_id, l.grade, l.test_id, l.submitted_at, round(l.pct), l.lvl, l.prev_lvl,
         case when l.pct < 40 then 'below_40' else 'dropped' end
  from levelled l
  where l.pct < 40
     or (l.prev_lvl is not null and l.lvl < l.prev_lvl and (l.lvl <= 4 or l.prev_lvl - l.lvl >= 2));
$$;
revoke execute on function public.early_warning_events(uuid, timestamptz, timestamptz) from public, anon, authenticated;

create or replace function public.early_warning_learners(p_school_id uuid, p_subject_id text, p_from timestamptz, p_to timestamptz)
returns table (learner_id uuid, subject_id text, grade smallint)
language sql
stable
security definer
set search_path = public
as $$
  select distinct e.learner_id, e.subject_id, e.grade
  from public.early_warning_events(p_school_id, p_from, p_to) e
  where p_subject_id is null or e.subject_id = p_subject_id;
$$;
revoke execute on function public.early_warning_learners(uuid, text, timestamptz, timestamptz) from public, anon, authenticated;

create table if not exists public.early_warning_digests_sent (
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  week_start date not null,
  sent_at timestamptz not null default now(),
  primary key (recipient_id, week_start)
);

-- Only the summary function writes or reads this; nobody signed in sees it.
alter table public.early_warning_digests_sent enable row level security;

create or replace function public.send_early_warning_digest(p_week_start date default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_start date := coalesce(p_week_start, date_trunc('week', now() at time zone 'Africa/Johannesburg')::date - 7);
  v_from timestamptz := v_start::timestamp at time zone 'Africa/Johannesburg';
  v_to timestamptz := (v_start + 7)::timestamp at time zone 'Africa/Johannesburg';
  r record;
  v_flagged integer;
  v_recovered integer;
  v_groups integer;
  v_tests integer;
  v_handed_in integer;
  v_subjects jsonb;
  v_classes jsonb;
  v_subject text;
  v_sent integer := 0;
begin
  for r in
    select p.id, p.role::text as role, p.school_id, p.subject_id
    from public.profiles p
    where p.role::text in ('school', 'hod')
      and p.school_id is not null
      and p.staff_approved_at is not null
      and (p.role::text = 'school' or p.subject_id is not null)
  loop
    v_subject := case when r.role = 'hod' then r.subject_id end;

    select count(*) into v_flagged from public.early_warning_learners(r.school_id, v_subject, v_from, v_to);

    select count(*) into v_recovered
    from public.early_warning_learners(r.school_id, v_subject, v_from - interval '35 days', v_from) b
    where not exists (select 1 from public.early_warning_learners(r.school_id, v_subject, v_from, v_to) n where n.learner_id = b.learner_id and n.subject_id = b.subject_id and n.grade = b.grade)
      and (
        select public.caps_level(100.0 * coalesce(a.marks_awarded, 0) / a.marks_total)
        from public.weekly_test_attempts a
        join public.weekly_tests t on t.id = a.test_id
        where a.learner_id = b.learner_id and t.subject_id = b.subject_id and t.grade = b.grade
          and t.intervention_id is null and coalesce(a.marks_total, 0) > 0
          and a.submitted_at >= v_from and a.submitted_at < v_to
        order by a.submitted_at desc
        limit 1
      ) >= 4;

    select count(*) into v_groups
    from public.interventions i
    where i.school_id = r.school_id and i.created_at >= v_from and i.created_at < v_to
      and (v_subject is null or i.subject_id = v_subject);

    select count(*) into v_tests
    from public.weekly_tests t
    where t.school_id = r.school_id and t.intervention_id is null and t.created_at >= v_from and t.created_at < v_to
      and (v_subject is null or t.subject_id = v_subject);

    select count(*) into v_handed_in
    from public.weekly_test_attempts a
    join public.weekly_tests t on t.id = a.test_id
    where t.school_id = r.school_id and t.intervention_id is null
      and a.submitted_at >= v_from and a.submitted_at < v_to
      and (v_subject is null or t.subject_id = v_subject);

    if v_flagged + v_groups + v_tests + v_handed_in = 0 then
      continue;
    end if;

    select coalesce(jsonb_object_agg(x.subject_id, x.n), '{}'::jsonb) into v_subjects
    from (select n.subject_id, count(*) as n from public.early_warning_learners(r.school_id, v_subject, v_from, v_to) n group by n.subject_id) x;

    select coalesce(jsonb_agg(jsonb_build_object('name', y.name, 'teacher', y.teacher, 'flagged', y.n) order by y.n desc, y.name), '[]'::jsonb)
    into v_classes
    from (
      select c.name, tp.full_name as teacher, count(distinct n.learner_id) as n
      from public.early_warning_learners(r.school_id, v_subject, v_from, v_to) n
      join public.class_members m on m.learner_id = n.learner_id
      join public.classes c on c.id = m.class_id and c.subject_id = n.subject_id and c.grade = n.grade and c.school_id = r.school_id
      left join public.profiles tp on tp.id = c.teacher_id
      group by c.id, c.name, tp.full_name
      order by count(distinct n.learner_id) desc, c.name
      limit 3
    ) y;

    insert into public.early_warning_digests_sent (recipient_id, week_start)
    values (r.id, v_start)
    on conflict do nothing;
    if not found then
      continue;
    end if;

    perform public.notify(array[r.id], 'level.weekly_digest',
      jsonb_build_object('week_start', v_start, 'flagged', v_flagged, 'recovered', v_recovered, 'groups', v_groups,
                         'tests', v_tests, 'handed_in', v_handed_in,
                         'subject', v_subject,
                         'subjects', v_subjects, 'classes', v_classes),
      'levels');
    v_sent := v_sent + 1;
  end loop;
  return v_sent;
end;
$$;
revoke execute on function public.send_early_warning_digest(date) from public, anon, authenticated;

-- Mondays at 05:00 UTC, where pg_cron is switched on (see STEP 25). Without
-- it, send_early_warning_digest() can be run by hand.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('early-warning-digest', '0 5 * * 1', 'select public.send_early_warning_digest()');
  end if;
end $$;
