-- A stand-in for the parts of Supabase that supabase/schema.sql relies on, so
-- the schema can be applied to a plain local Postgres for testing. It is NOT a
-- copy of Supabase's auth schema -- only enough of it (a users table, auth.uid()
-- and the `authenticated` role) for row-level security to behave as it does
-- behind the real API.
-- A stand-in for the parts of Supabase the schema relies on.
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create role authenticated nologin;
create role anon nologin;
grant usage on schema public, auth to authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
