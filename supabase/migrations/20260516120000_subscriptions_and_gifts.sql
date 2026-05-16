-- Subscription entitlements on profiles
alter table public.profiles
  add column if not exists subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'plus', 'legacy')),
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_expires_at timestamptz,
  add column if not exists revenuecat_app_user_id text;

create index if not exists profiles_stripe_customer_idx on public.profiles(stripe_customer_id);

-- Interview limit helper: free users get 1 interview
create or replace function public.user_interview_count(uid uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer from public.interviews where user_id = uid;
$$;

create or replace function public.profile_has_plus(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = uid
      and p.subscription_tier in ('plus', 'legacy')
      and (p.subscription_expires_at is null or p.subscription_expires_at > now())
  );
$$;

-- Replace permissive insert with tier-aware check
drop policy if exists "owners insert" on public.interviews;

create policy "owners insert within tier limit"
  on public.interviews for insert
  with check (
    auth.uid() = user_id
    and (
      public.profile_has_plus(auth.uid())
      or public.user_interview_count(auth.uid()) < 1
    )
  );

-- Print waitlist
create table if not exists public.print_waitlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  interview_id uuid references public.interviews(id) on delete set null,
  email text not null,
  volume_title text,
  created_at timestamptz not null default now()
);

alter table public.print_waitlist enable row level security;

create policy "users read own print waitlist"
  on public.print_waitlist for select
  using (auth.uid() = user_id);

create policy "users insert own print waitlist"
  on public.print_waitlist for insert
  with check (auth.uid() = user_id);

-- Gift purchases
create table if not exists public.gift_purchases (
  id uuid primary key default gen_random_uuid(),
  buyer_user_id uuid not null references auth.users(id) on delete cascade,
  recipient_email text not null,
  recipient_name text,
  plan text not null check (plan in ('plus_annual', 'legacy_print')),
  stripe_session_id text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'redeemed')),
  redeem_token text not null unique default public.gen_share_slug(),
  created_at timestamptz not null default now(),
  redeemed_at timestamptz
);

alter table public.gift_purchases enable row level security;

create policy "buyers read own gifts"
  on public.gift_purchases for select
  using (auth.uid() = buyer_user_id);

create policy "buyers insert own gifts"
  on public.gift_purchases for insert
  with check (auth.uid() = buyer_user_id);

-- Service role updates profiles via edge functions (security definer functions)
create or replace function public.set_subscription_tier(
  p_user_id uuid,
  p_tier text,
  p_stripe_customer_id text default null,
  p_stripe_subscription_id text default null,
  p_expires_at timestamptz default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    subscription_tier = p_tier,
    stripe_customer_id = coalesce(p_stripe_customer_id, stripe_customer_id),
    stripe_subscription_id = coalesce(p_stripe_subscription_id, stripe_subscription_id),
    subscription_expires_at = p_expires_at,
    updated_at = now()
  where user_id = p_user_id;
end;
$$;

grant execute on function public.set_subscription_tier to service_role;
