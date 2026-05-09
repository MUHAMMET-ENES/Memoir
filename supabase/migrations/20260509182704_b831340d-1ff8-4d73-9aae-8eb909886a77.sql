
-- Profiles table
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by owner"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "users insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "users update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Slug helper
create or replace function public.gen_share_slug()
returns text
language sql
volatile
as $$
  select lower(substring(replace(encode(gen_random_bytes(9), 'base64'), '/', '_') from 1 for 12));
$$;

-- Interviews table
create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_name text not null,
  relation text not null default '',
  theme text not null default '',
  title text not null,
  status text not null default 'draft' check (status in ('draft','recording','bound')),
  turns jsonb not null default '[]'::jsonb,
  bound jsonb,
  share_slug text not null unique default public.gen_share_slug(),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index interviews_user_id_idx on public.interviews(user_id);
create index interviews_share_slug_idx on public.interviews(share_slug);

alter table public.interviews enable row level security;

create policy "owners read their interviews"
  on public.interviews for select
  using (auth.uid() = user_id);

create policy "anyone reads public bound interviews"
  on public.interviews for select
  using (is_public = true and status = 'bound');

create policy "owners insert"
  on public.interviews for insert
  with check (auth.uid() = user_id);

create policy "owners update"
  on public.interviews for update
  using (auth.uid() = user_id);

create policy "owners delete"
  on public.interviews for delete
  using (auth.uid() = user_id);

create trigger interviews_set_updated_at
  before update on public.interviews
  for each row execute function public.set_updated_at();

-- Audio storage bucket
insert into storage.buckets (id, name, public)
values ('interview-audio', 'interview-audio', false);

-- Audio files paths: {user_id}/{interview_id}/{turn_index}.webm
create policy "owners read their audio"
  on storage.objects for select
  using (bucket_id = 'interview-audio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "owners upload their audio"
  on storage.objects for insert
  with check (bucket_id = 'interview-audio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "owners update their audio"
  on storage.objects for update
  using (bucket_id = 'interview-audio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "owners delete their audio"
  on storage.objects for delete
  using (bucket_id = 'interview-audio' and auth.uid()::text = (storage.foldername(name))[1]);

-- Public read for audio belonging to a public bound interview
create policy "public can read audio of public interviews"
  on storage.objects for select
  using (
    bucket_id = 'interview-audio'
    and exists (
      select 1 from public.interviews i
      where i.is_public = true
        and i.status = 'bound'
        and (storage.foldername(name))[2] = i.id::text
    )
  );
