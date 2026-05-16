-- Harden subscription RPC and lookups

revoke execute on function public.set_subscription_tier from public, anon, authenticated;
grant execute on function public.set_subscription_tier to service_role;

-- Ensure profile row exists before tier updates from webhooks
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
  insert into public.profiles (user_id, subscription_tier)
  values (p_user_id, 'free')
  on conflict (user_id) do nothing;

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

create index if not exists profiles_stripe_subscription_idx
  on public.profiles(stripe_subscription_id);

-- Webhooks use service_role (bypasses RLS) for gift_purchases inserts
