# Memoir backend operations

## Stack

- **Postgres + RLS** — profiles, interviews, print_waitlist, gift_purchases
- **Storage** — `interview-audio` bucket
- **Edge functions** — AI, Stripe, RevenueCat, account deletion

## Deploy

```bash
# Link project (once)
supabase link --project-ref xdixlxkgwvmpwharszeu

# Apply migrations
supabase db push

# Set secrets
supabase secrets set \
  STRIPE_SECRET_KEY=sk_live_... \
  STRIPE_WEBHOOK_SECRET=whsec_... \
  STRIPE_PRICE_PLUS_MONTHLY=price_... \
  STRIPE_PRICE_PLUS_ANNUAL=price_... \
  STRIPE_PRICE_LEGACY_PRINT=price_... \
  SITE_URL=https://your-domain.com \
  REVENUECAT_WEBHOOK_AUTH=your-random-token \
  LOVABLE_API_KEY=...

# Deploy functions
supabase functions deploy interview-host
supabase functions deploy summarize
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook
supabase functions deploy stripe-portal
supabase functions deploy delete-account
supabase functions deploy revenuecat-webhook
```

## Stripe webhook

1. In Stripe Dashboard → Developers → Webhooks, add endpoint:
   `https://xdixlxkgwvmpwharszeu.supabase.co/functions/v1/stripe-webhook`
2. Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
3. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## RevenueCat webhook

Point to `https://xdixlxkgwvmpwharszeu.supabase.co/functions/v1/revenuecat-webhook` with Authorization header `Bearer <REVENUECAT_WEBHOOK_AUTH>`.

## Local function test

```bash
supabase functions serve stripe-webhook --env-file .env.local
```
