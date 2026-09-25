-- Access-control tests for the DONE WELL schema.
--
-- Run against a THROWAWAY local Postgres, never against the live project:
--   npm run test:rls
-- which builds a fresh database, applies a stand-in for Supabase's auth
-- schema, applies supabase/schema.sql, then runs this file.
--
-- Each test acts as a real signed-in user would -- `set role authenticated`
-- with auth.uid() set to that user -- so row-level security applies exactly
-- as it does to a request from the app. A test that expects to be refused
-- passes only if the database refuses it.

\set ON_ERROR_STOP 1
set client_min_messages = warning;

create temp table results (test text, outcome text, ok boolean);
grant all on results to authenticated;

create or replace function pg_temp.act(p uuid) returns void language sql as
  $$ select set_config('request.jwt.claim.sub', p::text, false) $$;

-- The cast: one school, a teacher who created it, two learners who joined
-- with its code, and one learner's private progress.
insert into auth.users values
  ('00000000-0000-0000-0000-00000000000a'),  -- teacher who creates the school
  ('00000000-0000-0000-0000-0000000000b1'),  -- learner 1 (the attacker)
  ('00000000-0000-0000-0000-0000000000b2'),  -- learner 2 (the victim)
  ('00000000-0000-0000-0000-0000000000c1'),  -- someone who has only the join code
  ('00000000-0000-0000-0000-0000000000d1');  -- a second, legitimate teacher

select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
create temp table s as select * from public.create_school('Gojela High');
reset role;
grant select on s to authenticated;

set role authenticated;
insert into public.profiles (id, role, full_name, school_id, subject_id)
  select '00000000-0000-0000-0000-00000000000a', 'teacher', 'Teacher A', school_id, 'mat-lit' from s;
reset role;

do $$
declare v_school uuid := (select school_id from s);
begin
  perform pg_temp.act('00000000-0000-0000-0000-0000000000b1');
  execute 'set role authenticated';
  insert into public.profiles (id, role, full_name, school_id, grade, subject_id)
    values ('00000000-0000-0000-0000-0000000000b1', 'learner', 'Learner One', v_school, 12, 'mat-lit');
  execute 'reset role';

  perform pg_temp.act('00000000-0000-0000-0000-0000000000b2');
  execute 'set role authenticated';
  insert into public.profiles (id, role, full_name, school_id, grade, subject_id)
    values ('00000000-0000-0000-0000-0000000000b2', 'learner', 'Learner Two', v_school, 12, 'mat-lit');
  insert into public.learner_progress (learner_id, topic_id, mastery_percent, questions_attempted)
    values ('00000000-0000-0000-0000-0000000000b2', 'finance', 38, 40);
  execute 'reset role';
end $$;

-- ---------------------------------------------------------------------------
-- 1. A learner must not be able to make themselves staff.
-- ---------------------------------------------------------------------------
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
do $$ begin
  begin
    update public.profiles set role = 'school' where id = auth.uid();
  exception when others then null;
  end;
end $$;
insert into results
  select '1. learner sets own role to school',
         'role is now ' || role::text,
         role::text = 'learner'
  from public.profiles where id = '00000000-0000-0000-0000-0000000000b1';
insert into results
  select '1b. ...and then reads a classmate''s progress',
         count(*)::text || ' row(s) visible',
         count(*) = 0
  from public.learner_progress where learner_id = '00000000-0000-0000-0000-0000000000b2';
reset role;

-- ---------------------------------------------------------------------------
-- 2. Knowing the learners' join code must not make someone staff.
-- ---------------------------------------------------------------------------
select pg_temp.act('00000000-0000-0000-0000-0000000000c1');
set role authenticated;
do $$ begin
  begin
    insert into public.profiles (id, role, full_name, school_id, subject_id)
      select '00000000-0000-0000-0000-0000000000c1', 'teacher', 'Not A Teacher',
             j.school_id, 'mat-lit'
      from public.join_school((select join_code from s)) j;
  exception when others then null;
  end;
end $$;
insert into results
  select '2. code-holder signs up as teacher, reads progress',
         count(*)::text || ' row(s) visible',
         count(*) = 0
  from public.learner_progress where learner_id = '00000000-0000-0000-0000-0000000000b2';
reset role;

-- ---------------------------------------------------------------------------
-- 3. An approved teacher can still do their job: see their learners.
-- ---------------------------------------------------------------------------
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into results
  select '3. the school''s own teacher reads learner progress',
         count(*)::text || ' row(s) visible',
         count(*) = 1
  from public.learner_progress where learner_id = '00000000-0000-0000-0000-0000000000b2';
reset role;

-- ---------------------------------------------------------------------------
-- 4. A learner can still update the parts of their profile that are theirs.
-- ---------------------------------------------------------------------------
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
do $$ begin
  begin
    update public.profiles set full_name = 'Learner One Renamed' where id = auth.uid();
  exception when others then null;
  end;
end $$;
insert into results
  select '4. learner corrects the spelling of their own name',
         'name is now ' || full_name,
         full_name = 'Learner One Renamed'
  from public.profiles where id = '00000000-0000-0000-0000-0000000000b1';
reset role;

-- ---------------------------------------------------------------------------
-- 5. A learner must not be able to read their classmates' profiles.
-- ---------------------------------------------------------------------------
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results
  select '5. learner lists the other learners at their school',
         count(*)::text || ' other learner profile(s) visible',
         count(*) = 0
  from public.profiles
  where role = 'learner' and id <> '00000000-0000-0000-0000-0000000000b1';
reset role;

-- ---------------------------------------------------------------------------
-- 6. A pending staff member cannot approve themselves.
-- ---------------------------------------------------------------------------
select pg_temp.act('00000000-0000-0000-0000-0000000000c1');
set role authenticated;
do $$ begin
  begin
    perform public.approve_staff('00000000-0000-0000-0000-0000000000c1', true);
  exception when others then null;
  end;
end $$;
reset role;
insert into results
  select '6. pending teacher approves themselves',
         case when staff_approved_at is null then 'still pending' else 'approved' end,
         staff_approved_at is null
  from public.profiles where id = '00000000-0000-0000-0000-0000000000c1';

-- ---------------------------------------------------------------------------
-- 7. A learner cannot approve anybody.
-- ---------------------------------------------------------------------------
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
do $$ begin
  begin
    perform public.approve_staff('00000000-0000-0000-0000-0000000000c1', true);
  exception when others then null;
  end;
end $$;
reset role;
insert into results
  select '7. learner approves the pending teacher',
         case when staff_approved_at is null then 'still pending' else 'approved' end,
         staff_approved_at is null
  from public.profiles where id = '00000000-0000-0000-0000-0000000000c1';

-- ---------------------------------------------------------------------------
-- 8. Re-running the whole schema file approves nobody new.
-- ---------------------------------------------------------------------------
\ir ../schema.sql
set client_min_messages = warning;
insert into results
  select '8. re-running schema.sql leaves the pending teacher pending',
         case when staff_approved_at is null then 'still pending' else 'approved' end,
         staff_approved_at is null
  from public.profiles where id = '00000000-0000-0000-0000-0000000000c1';

-- ---------------------------------------------------------------------------
-- 9. An approved colleague approves them, and then they can do the job.
-- ---------------------------------------------------------------------------
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
select public.approve_staff('00000000-0000-0000-0000-0000000000c1', true);
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000c1');
set role authenticated;
insert into results
  select '9. approved by a colleague, the new teacher reads progress',
         count(*)::text || ' row(s) visible',
         count(*) = 1
  from public.learner_progress where learner_id = '00000000-0000-0000-0000-0000000000b2';
reset role;

-- ---------------------------------------------------------------------------
-- 10. A teacher cannot hand out the school (principal) role.
-- ---------------------------------------------------------------------------
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin
    update public.profiles set role = 'school' where id = '00000000-0000-0000-0000-0000000000b1';
  exception when others then null;
  end;
end $$;
reset role;
insert into results
  select '10. teacher promotes a learner to the school role',
         'role is ' || role::text,
         role::text = 'learner'
  from public.profiles where id = '00000000-0000-0000-0000-0000000000b1';

-- ---------------------------------------------------------------------------
-- 11. Correcting the roll still works: a teacher fixes a learner's grade, and
--     fixes a colleague who mistapped "Learner" at sign-up.
-- ---------------------------------------------------------------------------
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
update public.profiles set grade = 11 where id = '00000000-0000-0000-0000-0000000000b2';
reset role;
insert into results
  select '11. teacher corrects a learner''s grade',
         'grade is ' || grade::text,
         grade = 11
  from public.profiles where id = '00000000-0000-0000-0000-0000000000b2';

do $$
declare v_school uuid := (select school_id from s);
begin
  perform pg_temp.act('00000000-0000-0000-0000-0000000000d1');
  execute 'set role authenticated';
  insert into public.profiles (id, role, full_name, school_id, grade, subject_id)
    values ('00000000-0000-0000-0000-0000000000d1', 'learner', 'Teacher D (mistapped)', v_school, 12, 'mat-lit');
  execute 'reset role';
end $$;
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
update public.profiles set role = 'teacher', grade = null where id = '00000000-0000-0000-0000-0000000000d1';
reset role;
insert into results
  select '11b. teacher corrects a colleague who tapped Learner',
         'role is ' || role::text || case when staff_approved_at is not null then ', approved' else ', pending' end,
         role::text = 'teacher' and staff_approved_at is not null
  from public.profiles where id = '00000000-0000-0000-0000-0000000000d1';

-- ---------------------------------------------------------------------------
-- 12. A learner can still see their teachers' names.
-- ---------------------------------------------------------------------------
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results
  select '12. learner sees the staff at their school',
         count(*)::text || ' staff profile(s) visible',
         count(*) >= 1
  from public.profiles where role::text in ('teacher', 'school', 'hod');
reset role;

-- ---------------------------------------------------------------------------
-- 13. Turning someone away removes them from the school.
-- ---------------------------------------------------------------------------
insert into auth.users values ('00000000-0000-0000-0000-0000000000e1');
do $$
declare v_school uuid := (select school_id from s);
begin
  perform pg_temp.act('00000000-0000-0000-0000-0000000000e1');
  execute 'set role authenticated';
  insert into public.profiles (id, role, full_name, school_id, subject_id)
    values ('00000000-0000-0000-0000-0000000000e1', 'teacher', 'Unknown Person', v_school, 'mat-lit');
  execute 'reset role';
end $$;
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
select public.approve_staff('00000000-0000-0000-0000-0000000000e1', false);
reset role;
insert into results
  select '13. declined staff request leaves the school',
         case when school_id is null then 'no school' else 'still at school' end,
         school_id is null
  from public.profiles where id = '00000000-0000-0000-0000-0000000000e1';

select test, outcome, case when ok then 'PASS' else 'FAIL' end as result from results order by test;
select case when bool_and(ok) then 'ALL PASSED' else 'SOME FAILED' end as summary from results;
