-- A stand-in for the parts of Supabase that supabase/schema.sql relies on, so
-- the schema can be applied to a plain local Postgres for testing. It is NOT a
-- copy of Supabase's auth schema -- only enough of it (a users table, auth.uid()
-- and the `authenticated` role) for row-level security to behave as it does
-- behind the real API.
-- A stand-in for the parts of Supabase the schema relies on.
create schema auth;
create table auth.users (id uuid primary key, email text);
-- Sign-in sessions: STEP 35 ends the session of a device it signs out.
create table auth.sessions (id uuid primary key, user_id uuid);
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create role authenticated nologin;
create role anon nologin;
grant usage on schema public, auth to authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;

-- Storage: just enough for STEP 36's private bucket and its read rule.
create schema storage;
create table storage.buckets (id text primary key, name text not null, public boolean default false);
create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets (id),
  name text,
  owner uuid
);
alter table storage.objects enable row level security;
grant usage on schema storage to authenticated, anon;
grant select on storage.objects to authenticated, anon;
