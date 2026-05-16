import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import type { StripeEvent } from "./stripe.ts";
import { resolveUserIdFromStripeObject } from "./stripe.ts";

export type Tier = "free" | "plus" | "legacy";

export async function setSubscriptionTier(
  admin: SupabaseClient,
  userId: string,
  tier: Tier,
  opts: {
    customerId?: string | null;
    subscriptionId?: string | null;
    expiresAt?: string | null;
  } = {},
): Promise<void> {
  const { error } = await admin.rpc("set_subscription_tier", {
    p_user_id: userId,
    p_tier: tier,
    p_stripe_customer_id: opts.customerId ?? null,
    p_stripe_subscription_id: opts.subscriptionId ?? null,
    p_expires_at: opts.expiresAt ?? null,
  });
  if (error) throw error;
}

export async function lookupUserIdByStripeCustomer(
  admin: SupabaseClient,
  customerId: string,
): Promise<string | null> {
  const { data, error } = await admin
    .from("profiles")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  if (error) throw error;
  return data?.user_id ?? null;
}

export async function handleStripeEvent(
  admin: SupabaseClient,
  event: StripeEvent,
): Promise<void> {
  const obj = event.data.object;

  let userId = resolveUserIdFromStripeObject(obj);

  if (!userId && typeof obj.customer === "string") {
    userId = (await lookupUserIdByStripeCustomer(admin, obj.customer)) ?? undefined;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      if (!userId) return;
      const mode = (obj.metadata as Record<string, string> | undefined)?.checkout_mode;
      if (mode === "legacy_print") {
        await setSubscriptionTier(admin, userId, "legacy", {
          customerId: obj.customer as string,
        });
      } else {
        await setSubscriptionTier(admin, userId, "plus", {
          customerId: obj.customer as string,
          subscriptionId: obj.subscription as string,
        });
      }
      const giftEmail = (obj.metadata as Record<string, string> | undefined)
        ?.gift_recipient_email;
      if (giftEmail) {
        await admin.from("gift_purchases").insert({
          buyer_user_id: userId,
          recipient_email: giftEmail,
          recipient_name:
            (obj.metadata as Record<string, string> | undefined)?.gift_recipient_name ??
            null,
          plan: mode === "legacy_print" ? "legacy_print" : "plus_annual",
          stripe_session_id: obj.id as string,
          status: "paid",
        });
      }
      return;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created": {
      if (!userId && typeof obj.customer === "string") {
        userId =
          (await lookupUserIdByStripeCustomer(admin, obj.customer)) ?? undefined;
      }
      if (!userId) return;
      const status = obj.status as string;
      const periodEnd = obj.current_period_end as number;
      if (status === "active" || status === "trialing") {
        await setSubscriptionTier(admin, userId, "plus", {
          customerId: obj.customer as string,
          subscriptionId: obj.id as string,
          expiresAt: new Date(periodEnd * 1000).toISOString(),
        });
      } else if (status === "canceled" || status === "unpaid" || status === "past_due") {
        await setSubscriptionTier(admin, userId, "free", {
          expiresAt: new Date().toISOString(),
        });
      }
      return;
    }
    case "customer.subscription.deleted": {
      if (!userId && typeof obj.customer === "string") {
        userId =
          (await lookupUserIdByStripeCustomer(admin, obj.customer)) ?? undefined;
      }
      if (!userId) return;
      await setSubscriptionTier(admin, userId, "free", {
        expiresAt: new Date().toISOString(),
      });
      return;
    }
    default:
      return;
  }
}
