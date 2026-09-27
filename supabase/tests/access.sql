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

-- ===========================================================================
-- LESSON PLAN RECORDS AND HOD SIGN-OFF (STEP 20)
-- ===========================================================================
-- Two heads of department at Gojela High: Mathematical Literacy (f5) and Life
-- Sciences (f6), both approved. Teacher A teaches Mathematical Literacy.
insert into auth.users values ('00000000-0000-0000-0000-0000000000f5'), ('00000000-0000-0000-0000-0000000000f6');
insert into public.profiles (id, role, full_name, school_id, subject_id, staff_approved_at)
  select v.id::uuid, 'hod', v.n, s.school_id, v.subj, now()
  from s, (values ('00000000-0000-0000-0000-0000000000f5', 'HOD Mat Lit', 'mat-lit'),
                  ('00000000-0000-0000-0000-0000000000f6', 'HOD Life Sciences', 'life-sciences')) v(id, n, subj);

-- 58. A teacher records a week as a draft and submits it.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.lesson_plan_records (school_id, teacher_id, subject_id, grade, week_index, title, term, topic_id, lessons_planned, lessons_taught, dates, reflection)
  select school_id, '00000000-0000-0000-0000-00000000000a', 'mat-lit', 12, 3, 'Term 1 · Week 4 — Finance', 1, 'finance', 4, 4, '3–7 Feb', 'Went well.'
  from s;
update public.lesson_plan_records set status = 'submitted';
insert into results
  select '58. a teacher records a week and submits it',
         string_agg(status || ' at ' || case when submitted_at is null then 'no time' else 'a time' end, ', '),
         count(*) = 1 and bool_and(status = 'submitted' and submitted_at is not null)
  from public.lesson_plan_records;

-- 58b. The teacher cannot sign it off, or write the review fields, themselves.
do $$ begin
  begin update public.lesson_plan_records set status = 'signed'; exception when others then null; end;
  begin perform public.review_lesson_plan((select id from public.lesson_plan_records limit 1), true, 'Looks good'); exception when others then null; end;
end $$;
update public.lesson_plan_records
  set review_comment = 'Approved by me', reviewed_by = '00000000-0000-0000-0000-0000000000f5', reviewed_at = now();
insert into results
  select '58b. a teacher cannot sign off or fake a review of their own record',
         status || ', comment "' || review_comment || '", reviewer ' || coalesce(reviewed_by::text, 'none'),
         status = 'submitted' and review_comment = '' and reviewed_by is null and reviewed_at is null
  from public.lesson_plan_records;
reset role;

-- 59. A learner sees no records and cannot create one.
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
do $$ begin
  begin
    insert into public.lesson_plan_records (school_id, teacher_id, subject_id, grade, week_index, title, term)
      select school_id, '00000000-0000-0000-0000-0000000000b1', 'mat-lit', 12, 5, 'Fake', 1 from s;
  exception when others then null; end;
end $$;
insert into results
  select '59. a learner sees no lesson plan records and cannot add one',
         count(*)::text || ' visible',
         count(*) = 0
  from public.lesson_plan_records;
reset role;
insert into results
  select '59b. the learner''s record was refused',
         count(*)::text || ' in total',
         count(*) = 1
  from public.lesson_plan_records;

-- 60. Another department's HOD neither sees nor reviews it.
select pg_temp.act('00000000-0000-0000-0000-0000000000f6');
set role authenticated;
create temp table other_hod as select count(*) as n from public.lesson_plan_records;
do $$ begin
  begin perform public.review_lesson_plan((select id from public.lesson_plan_records limit 1), true, ''); exception when others then null; end;
end $$;
reset role;
grant select on other_hod to authenticated;
insert into results
  select '60. another department''s HOD cannot see or sign the record',
         (select n from other_hod)::text || ' visible, status ' || status,
         (select n from other_hod) = 0 and status = 'submitted'
  from public.lesson_plan_records;

-- 61. The subject's HOD must say what to change to return it; then returns it.
select pg_temp.act('00000000-0000-0000-0000-0000000000f5');
set role authenticated;
do $$ begin
  begin perform public.review_lesson_plan((select id from public.lesson_plan_records limit 1), false, '  '); exception when others then null; end;
end $$;
create temp table after_blank as select status from public.lesson_plan_records;
select public.review_lesson_plan((select id from public.lesson_plan_records limit 1), false, 'Add the homework you set.');
reset role;
grant select on after_blank to authenticated;
insert into results
  select '61. returning needs a comment; with one, the record goes back to the teacher',
         (select status from after_blank) || ' then ' || status || ': ' || review_comment,
         (select status from after_blank) = 'submitted' and status = 'returned'
           and review_comment = 'Add the homework you set.' and reviewed_by = '00000000-0000-0000-0000-0000000000f5'
  from public.lesson_plan_records;

-- 61b. The teacher sees the comment, edits and resubmits; the HOD signs it.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
update public.lesson_plan_records set reflection = 'Went well. Homework: Ex 3.2.', status = 'submitted';
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000f5');
set role authenticated;
select public.review_lesson_plan((select id from public.lesson_plan_records limit 1), true, 'Thank you.');
reset role;
insert into results
  select '61b. resubmitted and signed off by the HOD',
         status || ', reflection "' || reflection || '"',
         status = 'signed' and reflection like '%Ex 3.2%' and reviewed_at is not null
  from public.lesson_plan_records;

-- 61c. A signed record is final: the teacher can neither change nor delete it.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin update public.lesson_plan_records set reflection = 'Rewritten later', status = 'draft'; exception when others then null; end;
  begin delete from public.lesson_plan_records; exception when others then null; end;
end $$;
reset role;
insert into results
  select '61c. a signed record cannot be changed or deleted',
         count(*)::text || ' record(s), ' || string_agg(status, ','),
         count(*) = 1 and bool_and(status = 'signed' and reflection not like 'Rewritten%')
  from public.lesson_plan_records;

-- 62. Nobody signs off their own record, HOD included.
select pg_temp.act('00000000-0000-0000-0000-0000000000f5');
set role authenticated;
insert into public.lesson_plan_records (school_id, teacher_id, subject_id, grade, week_index, title, term, status)
  select school_id, '00000000-0000-0000-0000-0000000000f5', 'mat-lit', 11, 2, 'HOD''s own week', 1, 'submitted' from s;
do $$ begin
  begin perform public.review_lesson_plan((select id from public.lesson_plan_records where teacher_id = auth.uid()), true, ''); exception when others then null; end;
end $$;
reset role;
insert into results
  select '62. an HOD cannot sign off their own record',
         status,
         status = 'submitted'
  from public.lesson_plan_records where teacher_id = '00000000-0000-0000-0000-0000000000f5';

-- 62b. A draft stays the teacher's own until they submit it.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.lesson_plan_records (school_id, teacher_id, subject_id, grade, week_index, title, term)
  select school_id, '00000000-0000-0000-0000-00000000000a', 'mat-lit', 12, 7, 'Still writing', 1 from s;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000f5');
set role authenticated;
insert into results
  select '62b. the HOD does not see a teacher''s draft',
         count(*) filter (where title = 'Still writing')::text || ' draft(s) visible',
         count(*) filter (where title = 'Still writing') = 0 and count(*) >= 1
  from public.lesson_plan_records;
reset role;

-- 63. The journey is in the audit log, and each side was told.
insert into results
  select '63. submitted, returned and signed are recorded in the audit log',
         string_agg(action, ',' order by id),
         string_agg(action, ',' order by id) = 'lesson_plan.submitted,lesson_plan.returned,lesson_plan.submitted,lesson_plan.signed,lesson_plan.submitted'
  from public.audit_log where target_table = 'lesson_plan_records';
insert into results
  select '63b. the HOD was told of each submission; the teacher of each decision',
         string_agg(p.full_name || ':' || n.kind, ', ' order by n.id),
         count(*) filter (where n.recipient_id = '00000000-0000-0000-0000-0000000000f5' and n.kind = 'lesson_plan.submitted') = 2
           and count(*) filter (where n.recipient_id = '00000000-0000-0000-0000-00000000000a' and n.kind = 'lesson_plan.returned') = 1
           and count(*) filter (where n.recipient_id = '00000000-0000-0000-0000-00000000000a' and n.kind = 'lesson_plan.signed') = 1
           and count(*) filter (where n.recipient_id = '00000000-0000-0000-0000-0000000000f6') = 0
  from public.notifications n join public.profiles p on p.id = n.recipient_id
  where n.kind like 'lesson_plan.%';

-- ===========================================================================
-- THE SBA MARK BOOK (STEP 21)
-- ===========================================================================
-- 64. The class teacher enters marks; the class decides subject and grade.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.sba_marks (class_id, learner_id, task_key, out_of, mark)
  select id, '00000000-0000-0000-0000-0000000000b1', 't1-0', 50, 38 from public.classes where name = '12A Mat Lit';
insert into public.sba_marks (class_id, learner_id, task_key, out_of, mark, status, subject_id, grade, school_id)
  select c.id, '00000000-0000-0000-0000-0000000000b1', 't1-1', 50, null, 'absent', 'life-sciences', 10, c.school_id
  from public.classes c where c.name = '12A Mat Lit';
reset role;
insert into results
  select '64. the class teacher enters marks, stamped with the class''s subject and grade',
         string_agg(task_key || '=' || coalesce(mark::text, status) || ' ' || subject_id || ' G' || grade, ', ' order by task_key),
         count(*) = 2 and bool_and(subject_id = 'mat-lit' and grade = 12 and updated_by = '00000000-0000-0000-0000-00000000000a')
  from public.sba_marks;

-- 64b. A mark above the total, or for a task the programme cannot name, is refused.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin
    insert into public.sba_marks (class_id, learner_id, task_key, out_of, mark)
      select id, '00000000-0000-0000-0000-0000000000b1', 't2-0', 50, 55 from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
  begin
    insert into public.sba_marks (class_id, learner_id, task_key, out_of, mark)
      select id, '00000000-0000-0000-0000-0000000000b1', 'final', 300, 200 from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
end $$;
reset role;
insert into results
  select '64b. a mark over the total or an unknown task is refused',
         count(*)::text || ' row(s)',
         count(*) = 2
  from public.sba_marks;

-- 65. Marks only for learners in the class.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin
    insert into public.sba_marks (class_id, learner_id, task_key, out_of, mark)
      select id, '00000000-0000-0000-0000-0000000000c5', 't1-0', 50, 30 from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
end $$;
reset role;
insert into results
  select '65. no marks for a learner who is not in the class',
         count(*)::text || ' row(s) for them',
         count(*) = 0
  from public.sba_marks where learner_id = '00000000-0000-0000-0000-0000000000c5';

-- 66. Another teacher cannot enter or change marks in a class that is not theirs.
select pg_temp.act('00000000-0000-0000-0000-0000000000d1');
set role authenticated;
do $$ begin
  begin
    insert into public.sba_marks (class_id, learner_id, task_key, out_of, mark)
      select id, '00000000-0000-0000-0000-0000000000b1', 't2-0', 50, 50 from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
  begin update public.sba_marks set mark = 50 where task_key = 't1-0'; exception when others then null; end;
end $$;
reset role;
insert into results
  select '66. another teacher cannot write in a class that is not theirs',
         string_agg(task_key || '=' || coalesce(mark::text, status), ', ' order by task_key),
         count(*) = 2 and bool_and(task_key <> 't1-0' or mark = 38)
  from public.sba_marks;

-- 67. A learner sees only their own marks and cannot write any.
select pg_temp.act('00000000-0000-0000-0000-0000000000b2');
set role authenticated;
do $$ begin
  begin
    insert into public.sba_marks (class_id, learner_id, task_key, out_of, mark)
      select id, '00000000-0000-0000-0000-0000000000b2', 't1-0', 50, 50 from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
end $$;
insert into results select '67. a learner does not see a classmate''s marks', count(*)::text || ' visible', count(*) = 0 from public.sba_marks;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results select '67b. a learner does not see their own marks before release', count(*)::text || ' visible', count(*) = 0 from public.sba_marks;
reset role;

-- 68. Nor does a linked parent.
select pg_temp.act('00000000-0000-0000-0000-0000000000a1');
set role authenticated;
insert into results select '68. a linked parent does not see marks before release', count(*)::text || ' visible', count(*) = 0 from public.sba_marks;
reset role;

-- 69. A correction is recorded with the old and new mark.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
update public.sba_marks set mark = 41 where task_key = 't1-0';
reset role;
insert into results
  select '69. correcting a mark is audited with the old and new value',
         string_agg(action || ' ' || coalesce(details->>'from', '∅') || '→' || coalesce(details->>'to', '∅'), ', ' order by id),
         bool_or(action = 'sba_mark.update' and details->>'from' = '38.0' and details->>'to' = '41.0')
  from public.audit_log where target_table = 'sba_marks';

-- ===========================================================================
-- RELEASING SBA MARKS (STEP 22)
-- ===========================================================================
-- 70. A learner cannot release marks, nor can another teacher.
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
do $$ begin
  begin
    insert into public.sba_releases (class_id, year, task_key)
      select id, extract(year from now())::smallint, 't1-0' from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
end $$;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000d1');
set role authenticated;
do $$ begin
  begin
    insert into public.sba_releases (class_id, year, task_key)
      select id, extract(year from now())::smallint, 't1-0' from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
end $$;
reset role;
insert into results select '70. only a class manager can release marks', count(*)::text || ' release(s)', count(*) = 0 from public.sba_releases;

-- 71. The class teacher releases one task: the learner and the parent see that task only.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.sba_releases (class_id, year, task_key)
  select id, extract(year from now())::smallint, 't1-0' from public.classes where name = '12A Mat Lit';
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results
  select '71. after release the learner sees that task''s mark only',
         coalesce(string_agg(task_key, ','), 'none'), count(*) = 1 and bool_and(task_key = 't1-0')
  from public.sba_marks;
insert into results
  select '71b. the learner can see what has been released to their class', count(*)::text || ' release(s)', count(*) = 1
  from public.sba_releases;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000a1');
set role authenticated;
insert into results
  select '71c. so does the linked parent', coalesce(string_agg(task_key, ','), 'none'), count(*) = 1 and bool_and(task_key = 't1-0')
  from public.sba_marks;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b2');
set role authenticated;
insert into results select '71d. a classmate still sees none of it', count(*)::text || ' visible', count(*) = 0 from public.sba_marks;
reset role;

-- 72. The learner and the linked parent were told; the release was stamped and audited.
insert into results
  select '72. the learner and their parent are told of the release',
         string_agg(p.full_name || ':' || n.kind, ', ' order by n.id),
         count(*) filter (where n.recipient_id = '00000000-0000-0000-0000-0000000000b1' and n.kind = 'sba_marks.released' and n.link = 'marks') = 1
           and count(*) filter (where n.recipient_id = '00000000-0000-0000-0000-0000000000a1' and n.kind = 'sba_marks.child_released') = 1
           and count(*) filter (where n.recipient_id = '00000000-0000-0000-0000-00000000000a') = 0
  from public.notifications n join public.profiles p on p.id = n.recipient_id
  where n.kind like 'sba_marks.%';
insert into results
  select '72b. the release is stamped with who released it and the school',
         count(*)::text || ' release(s)',
         count(*) = 1 and bool_and(released_by = '00000000-0000-0000-0000-00000000000a' and school_id = (select school_id from public.classes where name = '12A Mat Lit'))
  from public.sba_releases;

-- 73. Withdrawing the release hides the mark again, and is audited.
select pg_temp.act('00000000-0000-0000-0000-0000000000d1');
set role authenticated;
delete from public.sba_releases;
reset role;
insert into results select '73. another teacher cannot withdraw a release', count(*)::text || ' release(s)', count(*) = 1 from public.sba_releases;
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
delete from public.sba_releases where task_key = 't1-0';
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results select '73b. after withdrawal the learner sees nothing', count(*)::text || ' visible', count(*) = 0 from public.sba_marks;
reset role;
insert into results
  select '73c. release and withdrawal are in the audit log',
         string_agg(action, ',' order by id),
         string_agg(action, ',' order by id) = 'sba_release.released,sba_release.withdrawn'
  from public.audit_log where target_table = 'sba_releases';

-- ===========================================================================
-- SBA MODERATION (STEP 23)
-- ===========================================================================
-- Set-up: put Learner Two back in 12A, to moderate alongside Learner One.
insert into public.class_members (class_id, learner_id)
  select id, '00000000-0000-0000-0000-0000000000b2' from public.classes where name = '12A Mat Lit'
  on conflict do nothing;
select '00000000-0000-0000-0000-0000000000b2' as other_learner \gset
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.sba_marks (class_id, learner_id, task_key, out_of, mark)
  select id, :'other_learner', 't1-0', 50, 30 from public.classes where name = '12A Mat Lit';
reset role;

-- 74. The class teacher, another subject's HOD and a learner cannot moderate.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin
    insert into public.sba_moderation_marks (class_id, year, task_key, learner_id, moderated_mark, teacher_mark, out_of)
      select id, extract(year from now())::smallint, 't1-0', '00000000-0000-0000-0000-0000000000b1', 40, 0, 50 from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
end $$;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000f6');
set role authenticated;
do $$ begin
  begin
    insert into public.sba_moderation_marks (class_id, year, task_key, learner_id, moderated_mark, teacher_mark, out_of)
      select id, extract(year from now())::smallint, 't1-0', '00000000-0000-0000-0000-0000000000b1', 40, 0, 50 from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
end $$;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
do $$ begin
  begin
    insert into public.sba_moderation_marks (class_id, year, task_key, learner_id, moderated_mark, teacher_mark, out_of)
      select id, extract(year from now())::smallint, 't1-0', '00000000-0000-0000-0000-0000000000b1', 40, 0, 50 from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
end $$;
reset role;
insert into results select '74. only the subject HOD or principal, not the class teacher, can moderate', count(*)::text || ' sample mark(s)', count(*) = 0 from public.sba_moderation_marks;

-- 75. The subject HOD moderates two scripts; the teacher's marks are copied in, whatever was sent.
select pg_temp.act('00000000-0000-0000-0000-0000000000f5');
set role authenticated;
insert into public.sba_moderation_marks (class_id, year, task_key, learner_id, moderated_mark, teacher_mark, out_of)
  select id, extract(year from now())::smallint, 't1-0', l, m, 0, 999
  from public.classes, (values ('00000000-0000-0000-0000-0000000000b1'::uuid, 38), (:'other_learner'::uuid, 33)) v(l, m)
  where name = '12A Mat Lit';
do $$ begin
  -- a script marked absent cannot be moderated
  begin
    insert into public.sba_moderation_marks (class_id, year, task_key, learner_id, moderated_mark, teacher_mark, out_of)
      select id, extract(year from now())::smallint, 't1-1', '00000000-0000-0000-0000-0000000000b1', 20, 0, 50 from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
end $$;
reset role;
insert into results
  select '75. the HOD moderates marked scripts; teacher marks and totals come from the mark book',
         string_agg(teacher_mark || '→' || moderated_mark || '/' || out_of, ', ' order by learner_id),
         count(*) = 2 and bool_and(out_of = 50 and school_id is not null and moderator_id = '00000000-0000-0000-0000-0000000000f5')
           and bool_or(teacher_mark = 41.0 and moderated_mark = 38.0) and bool_or(teacher_mark = 30.0 and moderated_mark = 33.0)
  from public.sba_moderation_marks;

-- 76. Staff can read the sample; a learner cannot.
select pg_temp.act('00000000-0000-0000-0000-0000000000d1');
set role authenticated;
insert into results select '76. another teacher at the school can read the sample', count(*)::text || ' visible', count(*) = 2 from public.sba_moderation_marks;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
insert into results select '76b. a learner cannot read the sample', count(*)::text || ' visible', count(*) = 0 from public.sba_moderation_marks;
reset role;

-- 77. Returning needs a comment; a return is recorded and the teacher told.
select pg_temp.act('00000000-0000-0000-0000-0000000000f5');
set role authenticated;
do $$ begin
  begin
    perform public.decide_sba_moderation((select id from public.classes where name = '12A Mat Lit'), extract(year from now())::smallint, 't1-0', false, '  ');
  exception when others then null; end;
end $$;
insert into results select '77. a return without a comment is refused', count(*)::text || ' decision(s)', count(*) = 0 from public.sba_moderations;
select public.decide_sba_moderation((select id from public.classes where name = '12A Mat Lit'), extract(year from now())::smallint, 't1-0', false, 'Question 3 is marked too leniently.');
reset role;
insert into results
  select '77b. the return records the sample size and mean difference',
         status || ' n=' || sample_size || ' mean=' || mean_difference,
         status = 'returned' and sample_size = 2 and mean_difference = 6.0
  from public.sba_moderations;
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin
    perform public.decide_sba_moderation((select id from public.classes where name = '12A Mat Lit'), extract(year from now())::smallint, 't1-0', true, '');
  exception when others then null; end;
end $$;
reset role;
insert into results select '77c. the class teacher cannot accept their own marks', status, status = 'returned' from public.sba_moderations;

-- 78. Accepting locks the sample until the HOD reopens it.
select pg_temp.act('00000000-0000-0000-0000-0000000000f5');
set role authenticated;
select public.decide_sba_moderation((select id from public.classes where name = '12A Mat Lit'), extract(year from now())::smallint, 't1-0', true, '');
do $$ begin
  begin update public.sba_moderation_marks set moderated_mark = 50; exception when others then null; end;
end $$;
reset role;
insert into results
  select '78. an accepted sample is locked',
         string_agg(moderated_mark::text, ',' order by learner_id),
         bool_and(moderated_mark <> 50)
  from public.sba_moderation_marks;
select pg_temp.act('00000000-0000-0000-0000-0000000000f5');
set role authenticated;
delete from public.sba_moderations;
update public.sba_moderation_marks set moderated_mark = 40 where learner_id = '00000000-0000-0000-0000-0000000000b1';
reset role;
insert into results
  select '78b. after reopening the HOD can change the sample',
         string_agg(moderated_mark::text, ',' order by learner_id),
         bool_or(moderated_mark = 40.0) and (select count(*) from public.sba_moderations) = 0
  from public.sba_moderation_marks;

-- 79. The decisions and the reopening are audited, and the teacher was told of each decision.
insert into results
  select '79. returned, accepted and reopened are in the audit log',
         string_agg(action, ',' order by id),
         string_agg(action, ',' order by id) = 'sba_moderation.returned,sba_moderation.accepted,sba_moderation.reopened'
  from public.audit_log where target_table = 'sba_moderations';
insert into results
  select '79b. the class teacher was told of the return and the acceptance',
         string_agg(kind, ',' order by id),
         string_agg(kind, ',' order by id) = 'sba_moderation.returned,sba_moderation.accepted'
           and bool_and(recipient_id = '00000000-0000-0000-0000-00000000000a' and link = 'markbook')
  from public.notifications where kind like 'sba_moderation.%';

-- ===========================================================================
-- THE ASSESSMENT SCHEDULE (STEP 24)
-- ===========================================================================
-- 80. The class teacher sets a date to come: stamped from the class, and the class and a linked parent are told.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.sba_task_dates (class_id, year, task_key, due_on, note, subject_id, grade, school_id)
  select c.id, extract(year from now())::smallint, 't3-1', current_date + 10, '  Bring a calculator  ', 'life-sciences', 10, c.school_id
  from public.classes c where c.name = '12A Mat Lit';
reset role;
insert into results
  select '80. a date is stamped with the class''s subject and grade',
         subject_id || ' G' || grade || ' "' || note || '"',
         subject_id = 'mat-lit' and grade = 12 and note = 'Bring a calculator' and updated_by = '00000000-0000-0000-0000-00000000000a'
  from public.sba_task_dates;
insert into results
  select '80b. the class and a linked parent are told of the date',
         string_agg(kind, ',' order by id),
         count(*) filter (where kind = 'sba_date.set' and recipient_id = '00000000-0000-0000-0000-0000000000b1') = 1
           and count(*) filter (where kind = 'sba_date.set' and recipient_id = '00000000-0000-0000-0000-0000000000b2') = 1
           and count(*) filter (where kind = 'sba_date.child_set' and recipient_id = '00000000-0000-0000-0000-0000000000a1') = 1
           and bool_and(link = 'marks')
  from public.notifications where kind like 'sba_date.%';

-- 81. Another teacher and a learner cannot set or move a date.
select pg_temp.act('00000000-0000-0000-0000-0000000000d1');
set role authenticated;
do $$ begin
  begin update public.sba_task_dates set due_on = current_date + 30; exception when others then null; end;
  begin
    insert into public.sba_task_dates (class_id, year, task_key, due_on)
      select id, extract(year from now())::smallint, 't3-2', current_date + 5 from public.classes where name = '12A Mat Lit';
  exception when others then null; end;
end $$;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000b1');
set role authenticated;
do $$ begin
  begin update public.sba_task_dates set due_on = current_date + 60; exception when others then null; end;
end $$;
insert into results select '81. a learner reads their class''s schedule', count(*)::text || ' date(s)', count(*) = 1 from public.sba_task_dates;
reset role;
insert into results
  select '81b. only a class manager can set or move a date',
         count(*)::text || ' date(s), ' || string_agg((due_on - current_date)::text, ',') || ' days away',
         count(*) = 1 and bool_and(due_on = current_date + 10)
  from public.sba_task_dates;

-- 82. A linked parent reads the schedule; a teacher at another school does not.
select pg_temp.act('00000000-0000-0000-0000-0000000000a1');
set role authenticated;
insert into results select '82. a linked parent reads their child''s schedule', count(*)::text || ' date(s)', count(*) = 1 from public.sba_task_dates;
reset role;
select pg_temp.act('00000000-0000-0000-0000-0000000000f1');
set role authenticated;
insert into results select '82b. a teacher at another school does not', count(*)::text || ' date(s)', count(*) = 0 from public.sba_task_dates;
reset role;

-- 83. Moving a date tells the class again; a date already past tells nobody.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
update public.sba_task_dates set due_on = current_date + 12 where task_key = 't3-1';
insert into public.sba_task_dates (class_id, year, task_key, due_on)
  select id, extract(year from now())::smallint, 't1-0', current_date - 100 from public.classes where name = '12A Mat Lit';
reset role;
insert into results
  select '83. a move is announced; a past date is not',
         count(*) filter (where data->>'moved' = 'true')::text || ' move(s), '
           || count(*) filter (where data->>'task' = 't1-0')::text || ' for the past date',
         count(*) filter (where data->>'moved' = 'true' and recipient_id = '00000000-0000-0000-0000-0000000000b1') = 1
           and count(*) filter (where data->>'task' = 't1-0') = 0
  from public.notifications where kind like 'sba_date.%';

-- 84. Clearing a date is allowed to the class teacher; every change is audited.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
delete from public.sba_task_dates where task_key = 't1-0';
reset role;
insert into results
  select '84. setting, moving and clearing dates are audited',
         string_agg(action, ',' order by id),
         string_agg(action, ',' order by id) = 'sba_date.set,sba_date.moved,sba_date.set,sba_date.cleared'
           and bool_or(action = 'sba_date.moved' and details->>'from' = (current_date + 10)::text)
  from public.audit_log where target_table = 'sba_task_dates';

-- ===========================================================================
-- REMINDERS (STEP 25)
-- ===========================================================================
-- 85. A task tomorrow (South African time) is reminded to the class and a linked parent, once.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
insert into public.sba_task_dates (class_id, year, task_key, due_on, note)
  select id, extract(year from now())::smallint, 't4-6', (now() at time zone 'Africa/Johannesburg')::date + 1, 'Paper 1'
  from public.classes where name = '12A Mat Lit';
reset role;
select public.send_sba_reminders() as first_run \gset
select public.send_sba_reminders() as second_run \gset
insert into results
  select '85. tomorrow''s task is reminded to the class and a linked parent',
         string_agg(p.full_name || ':' || n.kind, ', ' order by n.id) || ' (runs: ' || :'first_run' || ', ' || :'second_run' || ')',
         count(*) filter (where n.kind = 'sba_date.tomorrow' and n.recipient_id = '00000000-0000-0000-0000-0000000000b1') = 1
           and count(*) filter (where n.kind = 'sba_date.tomorrow' and n.recipient_id = '00000000-0000-0000-0000-0000000000b2') = 1
           and count(*) filter (where n.kind = 'sba_date.child_tomorrow' and n.recipient_id = '00000000-0000-0000-0000-0000000000a1') = 1
           and :'first_run'::int = 3 and :'second_run'::int = 0
  from public.notifications n join public.profiles p on p.id = n.recipient_id
  where n.kind like 'sba_date.%tomorrow';

-- 86. Nobody signed in can send reminders or read what has been sent.
select pg_temp.act('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$ begin
  begin perform public.send_sba_reminders(); raise exception 'ran'; exception when insufficient_privilege then null; end;
end $$;
insert into results select '86. a teacher cannot run the reminders or read the log', count(*)::text || ' row(s) visible', count(*) = 0 from public.sba_reminders_sent;
reset role;

select test, outcome, case when ok then 'PASS' else 'FAIL' end as result from results order by test;
select case when bool_and(ok) then 'ALL PASSED' else 'SOME FAILED' end as summary from results;
