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

-- ===========================================================================
-- AUDIT LOG (STEP 13)
-- ===========================================================================

-- 14. The approval and the role correction above were both recorded.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into results
  select '14. teacher sees the approval of the new teacher in the log',
         count(*)::text || ' staff.approved entr(ies)',
         count(*) >= 1
  from public.audit_log
  where action = 'staff.approved' and target_id = '00000000-0000-0000-0000-0000000000c1';
insert into results
  select '14b. ...and the colleague whose role was corrected',
         coalesce(string_agg(details->>'from' || '->' || (details->>'to'), ', '), 'none'),
         bool_or(details->>'from' = 'learner' and details->>'to' = 'teacher') is true
  from public.audit_log
  where action = 'profile.role_changed' and target_id = '00000000-0000-0000-0000-0000000000d1';
insert into results
  select '14c. ...and who was turned away',
         count(*)::text || ' declined entr(ies)',
         count(*) >= 1
  from public.audit_log
  where action = 'profile.school_changed' and target_id = '00000000-0000-0000-0000-0000000000e1'
    and (details->>'staff_request_declined')::boolean;
reset role;

-- 15. Nobody in the app can rewrite history.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
create temp table before_count as select count(*) as n from public.audit_log;
grant select on before_count to authenticated;
set role authenticated;
do $$ begin
  begin delete from public.audit_log; exception when others then null; end;
  begin update public.audit_log set action = 'nothing'; exception when others then null; end;
  begin insert into public.audit_log (action, target_table) values ('forged', 'profiles'); exception when others then null; end;
end $$;
reset role;
insert into results
  select '15. staff try to delete, edit and forge log entries',
         (select count(*) from public.audit_log)::text || ' entries (were ' || (select n from before_count) || '), '
           || (select count(*) from public.audit_log where action in ('nothing', 'forged'))::text || ' altered',
         (select count(*) from public.audit_log) = (select n from before_count)
           and not exists (select 1 from public.audit_log where action in ('nothing', 'forged'));

-- 16. A learner sees nothing about anyone else.
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results
  select '16. learner reads log entries about other people',
         count(*)::text || ' entr(ies) visible',
         count(*) = 0
  from public.audit_log
  where coalesce(actor_id::text, '') <> '00000000-0000-0000-0000-0000000000b1'
    and coalesce(target_id, '') <> '00000000-0000-0000-0000-0000000000b1';
reset role;

-- 17. The log holds no names: it identifies people only by account id.
insert into results
  select '17. no person''s name appears anywhere in the log',
         count(*)::text || ' entr(ies) containing a name',
         count(*) = 0
  from public.audit_log a
  join public.profiles p on a.details::text ilike '%' || p.full_name || '%';

-- 18. The log is only readable by staff at the school it concerns.
insert into auth.users values ('00000000-0000-0000-0000-0000000000f1');
select pg_temp.act('00000000-0000-0000-0000-0000000000f1');
set role authenticated;
create temp table other as select * from public.create_school('Another High');
insert into public.profiles (id, role, full_name, school_id, subject_id)
  select '00000000-0000-0000-0000-0000000000f1', 'teacher', 'Teacher F', school_id, 'mat-lit' from other;
insert into results
  select '18. a teacher at another school reads this school''s log',
         count(*)::text || ' entr(ies) visible',
         count(*) = 0
  from public.audit_log where school_id = (select school_id from s);
reset role;

-- 19. Setting and removing a weekly test is recorded.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.weekly_tests (school_id, created_by, title, subject_id, grade, topic_ids, question_count, due_at)
  select school_id, '00000000-0000-0000-0000-00000000000a', 'Finance test', 'mat-lit', 12, array['finance'], 10, now() + interval '7 days'
  from s;
delete from public.weekly_tests where title = 'Finance test';
insert into results
  select '19. setting and removing a weekly test is logged',
         string_agg(action, ', ' order by id),
         count(*) filter (where action = 'weekly_test.set') = 1 and count(*) filter (where action = 'weekly_test.removed') = 1
  from public.audit_log where target_table = 'weekly_tests';
reset role;

-- ===========================================================================
-- CLASSES (STEP 14)
-- ===========================================================================

-- 20. A teacher creates a class and puts two learners in it.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.classes (school_id, name, grade, subject_id, teacher_id)
  select school_id, '12A Mat Lit', 12, 'mat-lit', '00000000-0000-0000-0000-00000000000a' from s;
insert into public.class_members (class_id, learner_id)
  select id, l from public.classes, unnest(array['00000000-0000-0000-0000-0000000000b1',
                                                 '00000000-0000-0000-0000-0000000000b2']::uuid[]) l
  where name = '12A Mat Lit';
reset role;
insert into results
  select '20. teacher creates a class and adds two learners',
         count(*)::text || ' member(s)',
         count(*) = 2
  from public.class_members m join public.classes c on c.id = m.class_id where c.name = '12A Mat Lit';

-- 21. Only learners at the same school can be put in a class.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  -- a colleague (not a learner)
  begin
    insert into public.class_members (class_id, learner_id)
      select id, '00000000-0000-0000-0000-0000000000d1' from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
  -- a teacher at another school
  begin
    insert into public.class_members (class_id, learner_id)
      select id, '00000000-0000-0000-0000-0000000000f1' from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
end $$;
reset role;
insert into results
  select '21. teacher adds a colleague and an outsider to a class',
         count(*)::text || ' wrongly added',
         count(*) = 0
  from public.class_members
  where learner_id in ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-0000000000f1');

-- 22. A learner sees their class and their own membership, not the class list.
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results
  select '22. learner sees the class they are in',
         count(*)::text || ' class(es) visible',
         count(*) = 1
  from public.classes;
insert into results
  select '22b. learner lists who else is in their class',
         count(*)::text || ' other member row(s) visible',
         count(*) = 0
  from public.class_members where learner_id <> '00000000-0000-0000-0000-0000000000b1';
reset role;

-- 23. A learner cannot add themselves to a class, or remove a classmate.
insert into auth.users values ('00000000-0000-0000-0000-0000000000b3');
do $$
declare v_school uuid := (select school_id from s);
begin
  perform pg_temp.act('00000000-0000-0000-0000-0000000000b3');
  execute 'set role authenticated';
  insert into public.profiles (id, role, full_name, school_id, grade, subject_id)
    values ('00000000-0000-0000-0000-0000000000b3', 'learner', 'Learner Three', v_school, 12, 'mat-lit');
  begin
    insert into public.class_members (class_id, learner_id)
      select id, auth.uid() from public.classes;  -- sees none, so tries by id below too
  exception when others then null; end;
  begin
    insert into public.class_members (class_id, learner_id)
      values ((select id from public.classes where false), auth.uid());
  exception when others then null; end;
  execute 'reset role';
end $$;
select pg_temp.act('00000000-0000-0000-0000-0000000000b3');
create temp table class_ids as select id from public.classes;
grant select on class_ids to authenticated;
set role authenticated;
do $$ begin
  begin
    insert into public.class_members (class_id, learner_id) select id, auth.uid() from class_ids;
  exception when others then null; end;
end $$;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
do $$ begin
  begin
    delete from public.class_members where learner_id = '00000000-0000-0000-0000-0000000000b2';
  exception when others then null; end;
end $$;
reset role;
insert into results
  select '23. learner joins a class themselves, or removes a classmate',
         (select count(*) from public.class_members where learner_id = '00000000-0000-0000-0000-0000000000b3')::text
           || ' self-added, '
           || (select count(*) from public.class_members where learner_id = '00000000-0000-0000-0000-0000000000b2')::text
           || ' classmate row(s) left',
         not exists (select 1 from public.class_members where learner_id = '00000000-0000-0000-0000-0000000000b3')
           and exists (select 1 from public.class_members where learner_id = '00000000-0000-0000-0000-0000000000b2');

-- 24. Another school's teacher sees none of it and cannot add to it.
select pg_temp.act('00000000-0000-0000-0000-0000000000f1');
set role authenticated;
do $$ begin
  begin
    insert into public.class_members (class_id, learner_id)
      select id, '00000000-0000-0000-0000-0000000000b3' from class_ids;
  exception when others then null; end;
end $$;
insert into results
  select '24. teacher at another school reads this school''s classes',
         (select count(*) from public.classes)::text || ' class(es), '
           || (select count(*) from public.class_members)::text || ' member row(s)',
         (select count(*) from public.classes) = 0 and (select count(*) from public.class_members) = 0;
reset role;
insert into results
  select '24b. ...or adds a learner to one',
         count(*)::text || ' added',
         count(*) = 0
  from public.class_members where learner_id = '00000000-0000-0000-0000-0000000000b3';

-- 25. A colleague can see a teacher's class but not take it over or delete it.
select pg_temp.act('00000000-0000-0000-0000-0000000000c1');
set role authenticated;
insert into results
  select '25. colleague sees the class and its list',
         (select count(*) from public.classes)::text || ' class(es), '
           || (select count(*) from public.class_members)::text || ' member row(s)',
         (select count(*) from public.classes) = 1 and (select count(*) from public.class_members) = 2;
do $$ begin
  begin update public.classes set teacher_id = auth.uid(); exception when others then null; end;
  begin delete from public.class_members; exception when others then null; end;
  begin delete from public.classes; exception when others then null; end;
end $$;
reset role;
insert into results
  select '25b. ...but cannot take it over, empty it or delete it',
         coalesce((select teacher_id::text from public.classes where name = '12A Mat Lit'), 'deleted') || ', '
           || (select count(*) from public.class_members)::text || ' member(s)',
         (select teacher_id from public.classes where name = '12A Mat Lit') = '00000000-0000-0000-0000-00000000000a'
           and (select count(*) from public.class_members) = 2;

-- 26. A test can be set for a class at the teacher's own school only.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.weekly_tests (school_id, created_by, title, subject_id, grade, topic_ids, question_count, due_at, class_id)
  select s.school_id, '00000000-0000-0000-0000-00000000000a', '12A finance', 'mat-lit', 12, array['finance'], 10,
         now() + interval '7 days', c.id
  from s, public.classes c where c.name = '12A Mat Lit';
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000f1');
set role authenticated;
do $$ begin
  begin
    insert into public.weekly_tests (school_id, created_by, title, subject_id, grade, topic_ids, question_count, due_at, class_id)
      select o.school_id, auth.uid(), 'Borrowed class', 'mat-lit', 12, array['finance'], 10, now(), c.id
      from other o, class_ids c;
  exception when others then null; end;
end $$;
reset role;
insert into results
  select '26. tests set for a class: own school allowed, another school''s class refused',
         string_agg(title, ', ' order by title),
         bool_or(title = '12A finance') and not bool_or(title = 'Borrowed class')
  from public.weekly_tests where class_id is not null;

-- 27. A class with tests cannot be deleted (it would lose results).
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin delete from public.classes where name = '12A Mat Lit'; exception when others then null; end;
end $$;
reset role;
insert into results
  select '27. deleting a class that still has a weekly test',
         case when count(*) = 1 then 'class kept' else 'class deleted' end,
         count(*) = 1
  from public.classes where name = '12A Mat Lit';

-- 28. Leaving the school takes a learner out of its classes.
update public.profiles set school_id = null where id = '00000000-0000-0000-0000-0000000000b2';
insert into results
  select '28. a learner who leaves the school leaves its classes',
         count(*)::text || ' membership(s) left',
         count(*) = 0
  from public.class_members where learner_id = '00000000-0000-0000-0000-0000000000b2';

-- 29. Classes and class lists are in the audit log, without the class name.
insert into results
  select '29. class created and learners added are logged',
         string_agg(distinct action, ', '),
         bool_or(action = 'class.created') and bool_or(action = 'class_member.added')
           and not bool_or(details::text ilike '%12A%')
  from public.audit_log where target_table in ('classes', 'class_members');

-- ===========================================================================
-- MY MISTAKES AND INTERVENTIONS (STEP 15)
-- ===========================================================================

-- A parent linked to Learner One.
insert into auth.users values ('00000000-0000-0000-0000-0000000000a1');
insert into public.profiles (id, role, full_name) values ('00000000-0000-0000-0000-0000000000a1', 'parent', 'Parent One');
insert into public.parent_learner_links (parent_id, learner_id)
  values ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000b1');

-- 30. A learner's wrong answers are kept, counted, and cleared when right.
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
select public.record_answer('q-finance-1', 'finance', 'practice', false);
select public.record_answer('q-finance-1', 'finance', 'practice', false);
select public.record_answer('q-finance-2', 'finance', 'weekly_test', false);
insert into results
  select '30. two wrong answers to one question are counted',
         'wrong ' || times_wrong::text || ' time(s)',
         times_wrong = 2 and resolved_at is null
  from public.learner_mistakes where question_id = 'q-finance-1';
select public.record_answer('q-finance-1', 'finance', 'practice', true);
insert into results
  select '30b. ...and cleared when the learner gets it right',
         case when resolved_at is null then 'still open' else 'resolved' end,
         resolved_at is not null
  from public.learner_mistakes where question_id = 'q-finance-1';

-- 31. A learner cannot write into somebody else's mistakes.
do $$ begin
  begin
    insert into public.learner_mistakes (learner_id, question_id, topic_id, source)
      values ('00000000-0000-0000-0000-0000000000b3', 'q-planted', 'finance', 'practice');
  exception when others then null; end;
end $$;
reset role;
insert into results
  select '31. learner plants a mistake in a classmate''s record',
         count(*)::text || ' planted',
         count(*) = 0
  from public.learner_mistakes where question_id = 'q-planted';

-- 32. Who can read a learner's mistakes.
select pg_temp.act('00000000-0000-0000-0000-0000000000b3');
set role authenticated;
insert into results
  select '32. a classmate reads another learner''s mistakes',
         count(*)::text || ' visible', count(*) = 0
  from public.learner_mistakes;
reset role;
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into results
  select '32b. their teacher reads them',
         count(*)::text || ' visible', count(*) = 2
  from public.learner_mistakes;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000f1');
set role authenticated;
insert into results
  select '32c. a teacher at another school reads them',
         count(*)::text || ' visible', count(*) = 0
  from public.learner_mistakes;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000a1');
set role authenticated;
insert into results
  select '32d. the learner''s linked parent reads them',
         count(*)::text || ' visible', count(*) = 2
  from public.learner_mistakes;
reset role;

-- 33. A teacher starts an intervention and adds a learner with a starting point.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.interventions (school_id, class_id, subject_id, grade, topic_id, plan, created_by)
  select s.school_id, c.id, 'mat-lit', 12, 'finance', 'Two lunchtime sessions on payslips', '00000000-0000-0000-0000-00000000000a'
  from s, public.classes c where c.name = '12A Mat Lit';
insert into public.intervention_learners (intervention_id, learner_id, baseline_percent)
  select id, '00000000-0000-0000-0000-0000000000b1', 40 from public.interventions;
do $$ begin
  begin
    insert into public.intervention_learners (intervention_id, learner_id)
      select id, '00000000-0000-0000-0000-0000000000d1' from public.interventions;
  exception when others then null; end;
  begin
    insert into public.intervention_learners (intervention_id, learner_id)
      select id, '00000000-0000-0000-0000-0000000000f1' from public.interventions;
  exception when others then null; end;
end $$;
reset role;
insert into results
  select '33. intervention started; only a learner at the school can be added',
         string_agg(learner_id::text, ', '),
         count(*) = 1 and bool_and(learner_id = '00000000-0000-0000-0000-0000000000b1')
  from public.intervention_learners;
create temp table iv as select id from public.interventions;
grant select on iv to authenticated;

-- 34. The learner and their parent can see it; a classmate cannot.
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results
  select '34. learner in the group sees the intervention and its plan',
         count(*)::text || ' visible', count(*) = 1 and bool_and(plan <> '')
  from public.interventions;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000a1');
set role authenticated;
insert into results
  select '34b. their linked parent sees it',
         count(*)::text || ' visible', count(*) = 1
  from public.interventions;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b3');
set role authenticated;
insert into results
  select '34c. a learner not in the group sees it or who is in it',
         (select count(*) from public.interventions)::text || ' intervention(s), '
           || (select count(*) from public.intervention_learners)::text || ' member(s)',
         (select count(*) from public.interventions) = 0 and (select count(*) from public.intervention_learners) = 0;
reset role;

-- 35. A colleague can see it but not close it or change who is in it; nobody deletes one.
select pg_temp.act('00000000-0000-0000-0000-0000000000c1');
set role authenticated;
do $$ begin
  begin update public.interventions set status = 'cancelled'; exception when others then null; end;
  begin delete from public.intervention_learners; exception when others then null; end;
  begin
    insert into public.intervention_learners (intervention_id, learner_id)
      select id, '00000000-0000-0000-0000-0000000000b3' from iv;
  exception when others then null; end;
end $$;
reset role;
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin delete from public.interventions; exception when others then null; end;
end $$;
reset role;
insert into results
  select '35. colleague closes or edits the group; creator deletes it',
         (select status from public.interventions) || ', '
           || (select count(*) from public.intervention_learners)::text || ' member(s)',
         (select status from public.interventions) = 'active'
           and (select count(*) from public.intervention_learners) = 1;

-- 36. A reassessment test for the group; another school cannot borrow the group.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.weekly_tests (school_id, created_by, title, subject_id, grade, topic_ids, question_count, due_at, intervention_id)
  select s.school_id, '00000000-0000-0000-0000-00000000000a', 'Reassessment: finance', 'mat-lit', 12, array['finance'], 6,
         now() + interval '7 days', iv.id
  from s, iv;
update public.interventions set status = 'completed', closed_at = now();
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000f1');
set role authenticated;
do $$ begin
  begin
    insert into public.weekly_tests (school_id, created_by, title, subject_id, grade, topic_ids, question_count, due_at, intervention_id)
      select o.school_id, auth.uid(), 'Borrowed group', 'mat-lit', 12, array['finance'], 6, now(), iv.id from other o, iv;
  exception when others then null; end;
end $$;
reset role;
insert into results
  select '36. reassessment set for the group; another school''s attempt refused; group closed by its teacher',
         string_agg(title, ', ') || '; ' || (select status from public.interventions),
         bool_or(title = 'Reassessment: finance') and not bool_or(title = 'Borrowed group')
           and (select status from public.interventions) = 'completed'
  from public.weekly_tests where intervention_id is not null;

-- 37. Logged, without the plan's words.
insert into results
  select '37. intervention started, learner added and completion are logged',
         string_agg(distinct action, ', '),
         bool_or(action = 'intervention.started') and bool_or(action = 'intervention_learner.added')
           and bool_or(action = 'intervention.completed') and not bool_or(details::text ilike '%payslip%')
  from public.audit_log where target_table in ('interventions', 'intervention_learners');

-- ===========================================================================
-- PARTICIPATION AND NOTIFICATIONS (STEP 16)
-- ===========================================================================

-- 38. An event is stamped by the database: it cannot be back-dated or filed
--     against another school.
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into public.activity_events (actor_id, school_id, kind, topic_id, at)
  select '00000000-0000-0000-0000-0000000000b1', o.school_id, 'practice_answer', 'finance', '2020-01-01'
  from other o;
insert into public.activity_events (actor_id, kind) values ('00000000-0000-0000-0000-0000000000b1', 'signed_in');
do $$ begin
  begin update public.activity_events set at = '2020-01-01'; exception when others then null; end;
  begin delete from public.activity_events; exception when others then null; end;
  begin
    insert into public.activity_events (actor_id, kind) values ('00000000-0000-0000-0000-0000000000b3', 'signed_in');
  exception when others then null; end;
end $$;
reset role;
insert into results
  select '38. forged school, back-dated time, edits and events for others are refused',
         count(*)::text || ' event(s); schools ok: ' || bool_and(school_id = (select school_id from s))::text
           || '; recent: ' || bool_and(at > now() - interval '1 minute')::text,
         count(*) = 2 and bool_and(school_id = (select school_id from s)) and bool_and(at > now() - interval '1 minute')
           and bool_and(actor_id = '00000000-0000-0000-0000-0000000000b1')
  from public.activity_events;

-- 39. Participation is visible to the school's staff and the learner's parent only.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into results
  select '39. teacher sees the learner''s participation',
         coalesce(string_agg(active_days::text || ' day, ' || events::text || ' events', '; '), 'nothing'),
         count(*) = 1 and bool_and(events = 2 and answers = 1)
  from public.participation(7);
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b3');
set role authenticated;
insert into results
  select '39b. a classmate sees it', count(*)::text || ' row(s)', count(*) = 0 from public.participation(7);
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000f1');
set role authenticated;
insert into results
  select '39c. another school''s teacher sees it', count(*)::text || ' row(s)', count(*) = 0 from public.participation(7);
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000a1');
set role authenticated;
insert into results
  select '39d. the linked parent sees it', count(*)::text || ' row(s)', count(*) = 1 from public.participation(7);
reset role;

-- 40. Setting a weekly test tells the learners who sit it, not the teacher.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.weekly_tests (school_id, created_by, title, subject_id, grade, topic_ids, question_count, due_at)
  select school_id, '00000000-0000-0000-0000-00000000000a', 'Grade 12 measurement', 'mat-lit', 12, array['measurement'], 8,
         now() + interval '5 days'
  from s;
reset role;
insert into results
  select '40. a grade test notifies the grade''s learners and not its setter',
         string_agg(p.full_name, ', ' order by p.full_name),
         bool_or(n.recipient_id = '00000000-0000-0000-0000-0000000000b1')
           and bool_or(n.recipient_id = '00000000-0000-0000-0000-0000000000b3')
           and not bool_or(n.recipient_id = '00000000-0000-0000-0000-00000000000a')
  from public.notifications n join public.profiles p on p.id = n.recipient_id
  where n.kind = 'weekly_test.set' and n.data->>'title' = 'Grade 12 measurement';

-- 41. Notifications are private, and read-only apart from "read".
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results
  select '41. a learner reads only their own notifications',
         count(*) filter (where recipient_id <> auth.uid())::text || ' of someone else''s',
         count(*) filter (where recipient_id <> auth.uid()) = 0 and count(*) > 0
  from public.notifications;
update public.notifications set read_at = now();
do $$ begin
  begin update public.notifications set kind = 'forged'; exception when others then null; end;
  begin
    insert into public.notifications (recipient_id, kind) values ('00000000-0000-0000-0000-0000000000b3', 'forged');
  exception when others then null; end;
end $$;
reset role;
insert into results
  select '41b. they can mark theirs read, but not rewrite or send one',
         (select count(*) from public.notifications where recipient_id = '00000000-0000-0000-0000-0000000000b1' and read_at is null)::text
           || ' unread, ' || (select count(*) from public.notifications where kind = 'forged')::text || ' forged',
         not exists (select 1 from public.notifications where recipient_id = '00000000-0000-0000-0000-0000000000b1' and read_at is null)
           and not exists (select 1 from public.notifications where kind = 'forged');

-- 42. A parent linking to a learner tells the learner.
insert into results
  select '42. the learner was told a parent linked to them',
         count(*)::text || ' notification(s)', count(*) = 1
  from public.notifications where recipient_id = '00000000-0000-0000-0000-0000000000b1' and kind = 'parent_link.created';

-- 43. Joining a catch-up group tells the learner.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.intervention_learners (intervention_id, learner_id, baseline_percent)
  select id, '00000000-0000-0000-0000-0000000000b3', 35 from iv;
reset role;
insert into results
  select '43. a learner added to a catch-up group is told, with the topic',
         coalesce(string_agg(data->>'topic', ', '), 'nothing'),
         count(*) = 1 and bool_and(data->>'topic' = 'finance')
  from public.notifications where recipient_id = '00000000-0000-0000-0000-0000000000b3' and kind = 'intervention.joined';

-- 44. Someone signing up as staff: approved staff are told; then they are told they are approved.
insert into auth.users values ('00000000-0000-0000-0000-0000000000a9');
do $$
declare v_school uuid := (select school_id from s);
begin
  perform pg_temp.act('00000000-0000-0000-0000-0000000000a9');
  execute 'set role authenticated';
  insert into public.profiles (id, role, full_name, school_id, subject_id)
    values ('00000000-0000-0000-0000-0000000000a9', 'teacher', 'New Teacher', v_school, 'mat-lit');
  execute 'reset role';
end $$;
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
select public.approve_staff('00000000-0000-0000-0000-0000000000a9', true);
reset role;
insert into results
  select '44. staff are told someone is waiting; the new teacher is told they are approved',
         (select count(*) from public.notifications where kind = 'staff.pending' and data->>'profile_id' = '00000000-0000-0000-0000-0000000000a9')::text
           || ' told, approved notice: '
           || (select count(*) from public.notifications where kind = 'staff.approved' and recipient_id = '00000000-0000-0000-0000-0000000000a9')::text,
         (select count(*) from public.notifications where kind = 'staff.pending' and data->>'profile_id' = '00000000-0000-0000-0000-0000000000a9') >= 1
           and not exists (select 1 from public.notifications n join public.profiles p on p.id = n.recipient_id
                           where n.kind = 'staff.pending' and (p.role::text = 'learner' or p.school_id <> (select school_id from s)))
           and (select count(*) from public.notifications where kind = 'staff.approved' and recipient_id = '00000000-0000-0000-0000-0000000000a9') = 1;

-- ===========================================================================
-- PLATFORM ADMINISTRATION, SUBSCRIPTIONS AND SPONSORS (STEP 17)
-- ===========================================================================

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000e9', 'admin@example.org'),
  ('00000000-0000-0000-0000-0000000000e8', 'sponsor@example.org');
create temp table refused (what text, was_refused boolean);
grant all on refused to authenticated;

-- 45. School staff cannot make themselves platform administrators or see every school.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin insert into public.platform_admins (user_id) values (auth.uid()); exception when others then null; end;
  begin
    perform * from public.admin_school_overview();
    insert into refused values ('overview', false);
  exception when others then insert into refused values ('overview', true); end;
  begin
    perform public.set_school_suspended((select school_id from s), true);
    insert into refused values ('suspend', false);
  exception when others then insert into refused values ('suspend', true); end;
end $$;
reset role;
insert into results
  select '45. a teacher makes themselves admin, lists every school, or pauses a school',
         (select count(*) from public.platform_admins)::text || ' admin(s); refused: '
           || (select string_agg(what, ', ') from refused where was_refused),
         (select count(*) from public.platform_admins) = 0
           and (select bool_and(was_refused) from refused) and (select count(*) from refused) = 2;

-- 46. An administrator added by the operator sees every school, in counts.
insert into public.platform_admins (user_id) values ('00000000-0000-0000-0000-0000000000e9');
select pg_temp.act('00000000-0000-0000-0000-0000000000e9');
set role authenticated;
insert into results
  select '46. the administrator sees each school''s totals',
         string_agg(name || ': ' || learners || ' learners, ' || staff || ' staff', '; ' order by name),
         bool_or(name = 'Gojela High' and learners = 2 and staff >= 4) and count(*) = 2
  from public.admin_school_overview();

-- 47. Pausing a school stops its staff reading learner data; reactivating restores it.
select public.set_school_suspended((select school_id from s), true);
reset role;
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
create temp table paused_view as select (select count(*) from public.classes) + (select count(*) from public.learner_mistakes) as n;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000e9');
set role authenticated;
select public.set_school_suspended((select school_id from s), false);
reset role;
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into results
  select '47. a paused school''s teacher sees no classes or mistakes; after reactivation they do',
         (select n from paused_view)::text || ' row(s) while paused, ' || x.n::text || ' after',
         (select n from paused_view) = 0 and x.n >= 2
  from (select (select count(*) from public.classes) + (select count(*) from public.learner_mistakes) as n) x;
reset role;

-- 48. Subscriptions: set by the administrator, visible to the school, not editable by it.
select pg_temp.act('00000000-0000-0000-0000-0000000000e9');
set role authenticated;
insert into public.subscriptions (school_id, plan, learner_seats, ends_on)
  select school_id, 'school', 300, current_date + 365 from s;
reset role;
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin update public.subscriptions set learner_seats = 100000; exception when others then null; end;
  begin
    insert into public.subscriptions (school_id, plan, learner_seats) select school_id, 'school', 5000 from s;
  exception when others then null; end;
end $$;
insert into results
  select '48. the school sees its licence but cannot change or add one',
         count(*)::text || ' subscription(s), seats ' || string_agg(learner_seats::text, ','),
         count(*) = 1 and bool_and(learner_seats = 300)
  from public.subscriptions;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000f1');
set role authenticated;
insert into results
  select '48b. another school sees it', count(*)::text || ' visible', count(*) = 0 from public.subscriptions;
reset role;

-- 49. A sponsor sees its programme in totals only, with small schools withheld.
select pg_temp.act('00000000-0000-0000-0000-0000000000e9');
set role authenticated;
insert into public.sponsors (name) values ('Acme Foundation');
insert into public.programmes (sponsor_id, name) select id, 'Acme Maths 2027' from public.sponsors;
insert into public.programme_schools (programme_id, school_id)
  select p.id, x.school_id from public.programmes p, (select school_id from s union all select school_id from other) x;
insert into refused select 'add member', not public.add_sponsor_member((select id from public.sponsors), 'Sponsor@Example.org');
reset role;
create temp table prog as select id from public.programmes;
grant select on prog to authenticated;
select pg_temp.act('00000000-0000-0000-0000-0000000000e8');
set role authenticated;
insert into results
  select '49. sponsor sees its schools; ones under five learners are withheld',
         string_agg(school_name || case when withheld then ' (withheld)' else ': ' || learners end, '; ' order by school_name),
         count(*) = 2 and bool_and(withheld) and bool_and(learners is null and average_mastery is null)
  from public.programme_totals((select id from prog));
reset role;
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin
    perform * from public.programme_totals((select id from prog));
    insert into refused values ('teacher totals', false);
  exception when others then insert into refused values ('teacher totals', true); end;
end $$;
insert into results
  select '49b. the school sees its programme and sponsor, but not the programme''s figures',
         (select count(*) from public.programmes)::text || ' programme(s), '
           || coalesce((select string_agg(name, ',') from public.sponsors), 'no sponsor'),
         (select count(*) from public.programmes) = 1 and (select count(*) from public.sponsors) = 1
           and (select was_refused from refused where what = 'teacher totals');
reset role;

-- 50. With five learners the school's totals appear -- and still name no one.
insert into auth.users (id) values
  ('00000000-0000-0000-0000-0000000000c5'), ('00000000-0000-0000-0000-0000000000c6'), ('00000000-0000-0000-0000-0000000000c7');
insert into public.profiles (id, role, full_name, school_id, grade, subject_id)
  select v.id::uuid, 'learner', v.n, s.school_id, 12, 'mat-lit'
  from s, (values ('00000000-0000-0000-0000-0000000000c5', 'Learner Five'),
                  ('00000000-0000-0000-0000-0000000000c6', 'Learner Six'),
                  ('00000000-0000-0000-0000-0000000000c7', 'Learner Seven')) v(id, n);
select pg_temp.act('00000000-0000-0000-0000-0000000000e8');
set role authenticated;
create temp table totals as select * from public.programme_totals((select id from prog));
reset role;
insert into results
  select '50. five learners: Gojela High''s totals shown, no name anywhere in them',
         string_agg(school_name || ': ' || coalesce(learners::text, 'withheld') || ' learners, ' || coalesce(active_7d::text, '-') || ' active', '; '),
         bool_or(school_name = 'Gojela High' and not withheld and learners = 5)
           and not exists (select 1 from totals t, public.profiles p where row_to_json(t)::text ilike '%' || p.full_name || '%')
  from totals;

-- 51. The school can see in its own log that it was paused and licensed.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into results
  select '51. pausing, reactivating and the licence are in the school''s activity log',
         string_agg(distinct action, ', '),
         bool_or(action = 'school.suspended') and bool_or(action = 'school.reactivated') and bool_or(action = 'subscription.created')
  from public.audit_log where action like 'school.%' or action like 'subscription.%';
reset role;

-- ===========================================================================
-- CONTENT MANAGEMENT (STEP 18)
-- ===========================================================================

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000d7', 'author@example.org'),
  ('00000000-0000-0000-0000-0000000000d8', 'reviewer@example.org');

-- 52. Only content editors can write content; drafts are invisible to learners.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin insert into public.content_items (kind, title) values ('lesson', 'Teacher sneaks one in'); exception when others then null; end;
end $$;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000e9');
set role authenticated;
select public.add_content_editor('author@example.org', false);
select public.add_content_editor('Reviewer@Example.org', true);
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000d7');
set role authenticated;
insert into public.content_items (kind, title, summary, subject_id, grade, audience)
  values ('lesson', 'Reading a payslip', 'Gross, deductions and net pay', 'mat-lit', 12, 'everyone'),
         ('teacher_resource', 'Marking guide: payslips', 'For teachers', 'mat-lit', 12, 'teachers');
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results
  select '52. a teacher cannot add content; a learner cannot see drafts',
         (select count(*) from public.content_items where title = 'Teacher sneaks one in')::text || ' sneaked in, '
           || count(*)::text || ' draft(s) visible to the learner',
         count(*) = 0 and not exists (select 1 from public.content_items where title = 'Teacher sneaks one in')
  from public.content_items;
reset role;

-- 53. Two people see every item: the author cannot approve their own work.
create temp table items as select id, title from public.content_items;
grant select on items to authenticated;
select pg_temp.act('00000000-0000-0000-0000-0000000000d7');
set role authenticated;
select public.content_transition(id, 'review') from items;
do $$ begin
  begin perform public.content_transition((select id from items where title = 'Reading a payslip'), 'approved');
  exception when others then null; end;
  begin update public.content_items set status = 'published'; exception when others then null; end;
end $$;
reset role;
insert into results
  select '53. the author approves or publishes their own work',
         string_agg(title || ': ' || status, '; ' order by title),
         bool_and(status = 'review')
  from public.content_items;

-- 53b. A reviewer cannot approve their own work either; another reviewer can.
select pg_temp.act('00000000-0000-0000-0000-0000000000d8');
set role authenticated;
insert into public.content_items (kind, title) values ('worksheet', 'Reviewer''s own worksheet');
select public.content_transition((select id from public.content_items where title = 'Reviewer''s own worksheet'), 'review');
do $$ begin
  begin perform public.content_transition((select id from public.content_items where title = 'Reviewer''s own worksheet'), 'approved');
  exception when others then null; end;
end $$;
reset role;
create temp table own_status as select status from public.content_items where title = 'Reviewer''s own worksheet';
select pg_temp.act('00000000-0000-0000-0000-0000000000e9');
set role authenticated;
select public.content_transition((select id from public.content_items where title = 'Reviewer''s own worksheet'), 'approved');
reset role;
insert into results
  select '53b. a reviewer approves their own worksheet; an administrator then can',
         (select status from own_status) || ' -> ' || status,
         (select status from own_status) = 'review' and status = 'approved'
  from public.content_items where title = 'Reviewer''s own worksheet';

-- 54. A reviewer approves and publishes; learners see only what is for everyone.
select pg_temp.act('00000000-0000-0000-0000-0000000000d8');
set role authenticated;
select public.content_transition(id, 'approved') from items;
select public.content_transition(id, 'published', 'Checked against CAPS') from items;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results
  select '54. published: the learner sees the lesson, not the teacher resource',
         coalesce(string_agg(title, ', '), 'nothing'),
         count(*) = 1 and bool_and(title = 'Reading a payslip')
  from public.content_items;
reset role;
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into results
  select '54b. a teacher sees both', count(*)::text || ' item(s)', count(*) = 2 from public.content_items;
reset role;

-- 55. Published work cannot be changed in place.
select pg_temp.act('00000000-0000-0000-0000-0000000000d7');
set role authenticated;
do $$ begin
  begin update public.content_items set title = 'Edited after publishing'; exception when others then null; end;
end $$;
reset role;
insert into results
  select '55. the author edits a published item in place',
         count(*) filter (where title = 'Edited after publishing')::text || ' changed',
         count(*) filter (where title = 'Edited after publishing') = 0
  from public.content_items;

-- 56. Archiving takes it off the learner's resource centre; the history is kept.
select pg_temp.act('00000000-0000-0000-0000-0000000000d8');
set role authenticated;
select public.content_transition((select id from items where title = 'Reading a payslip'), 'archived', 'Replaced');
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results
  select '56. an archived lesson is gone for the learner, who also cannot read the history',
         (select count(*) from public.content_items)::text || ' item(s), ' || (select count(*) from public.content_events)::text || ' history row(s)',
         (select count(*) from public.content_items) = 0 and (select count(*) from public.content_events) = 0;
reset role;
insert into results
  select '56b. the lesson''s whole journey is recorded',
         string_agg(coalesce(from_status, '') || '->' || to_status, ' ' order by id),
         string_agg(to_status, ',' order by id) = 'review,approved,published,archived'
  from public.content_events where content_id = (select id from items where title = 'Reading a payslip');

-- 57. The tutor's daily-limit rows: only the tutor function writes them, and a
--     learner reads only their own.
reset role;
insert into public.tutor_requests (user_id, subject_id) values
  ('00000000-0000-0000-0000-0000000000b1', 'mat-lit'),
  ('00000000-0000-0000-0000-0000000000b2', 'mat-lit'),
  ('00000000-0000-0000-0000-0000000000b2', 'mathematics');
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
do $$ begin
  begin insert into public.tutor_requests (user_id, subject_id) values ('00000000-0000-0000-0000-0000000000b1', 'mat-lit'); exception when others then null; end;
  begin delete from public.tutor_requests; exception when others then null; end;
end $$;
insert into results
  select '57. a learner sees only their own tutor checks',
         count(*)::text || ' row(s)',
         count(*) = 1 and bool_and(user_id = '00000000-0000-0000-0000-0000000000b1')
  from public.tutor_requests;
reset role;
insert into results
  select '57b. a learner cannot add to or clear the tutor allowance',
         count(*)::text || ' row(s) in total',
         count(*) = 3
  from public.tutor_requests;

select test, outcome, case when ok then 'PASS' else 'FAIL' end as result from results order by test;
select case when bool_and(ok) then 'ALL PASSED' else 'SOME FAILED' end as summary from results;
