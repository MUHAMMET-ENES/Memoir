import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { adminClient } from "../_shared/auth.ts";
import { jsonResponse, optionsResponse } from "../_shared/cors.ts";
import { setSubscriptionTier } from "../_shared/subscription-sync.ts";

type RevenueCatEvent = {
  type?: string;
  app_user_id?: string;
  expiration_at_ms?: number;
  entitlement_ids?: string[];
  subscriber?: {
    entitlements?: Record<string, { expires_date?: string; product_identifier?: string }>;
  };
};

function activeEntitlements(event: RevenueCatEvent): string[] {
  if (event.entitlement_ids?.length) return event.entitlement_ids;
  const ents = event.subscriber?.entitlements;
  if (!ents) return [];
  const now = Date.now();
  return Object.entries(ents)
    .filter(([, v]) => {
      if (!v.expires_date) return true;
      return new Date(v.expires_date).getTime() > now;
    })
    .map(([id]) => id);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const expectedAuth = Deno.env.get("REVENUECAT_WEBHOOK_AUTH");
    if (expectedAuth) {
      const auth = req.headers.get("Authorization");
      if (auth !== `Bearer ${expectedAuth}`) {
        return jsonResponse({ error: "Unauthorized" }, 401);
      }
    }

    const body = await req.json();
    const event = (body.event ?? body) as RevenueCatEvent;
    const appUserId = event.app_user_id;
    const type = (event.type ?? "").toUpperCase();

    if (!appUserId) {
      return jsonResponse({ ok: true, skipped: "no app_user_id" });
    }

    const admin = adminClient();
    const entitlements = activeEntitlements(event);

    let tier: "free" | "plus" | "legacy" = "free";
    let expiresAt: string | null = null;

    const hasLegacy =
      entitlements.includes("legacy") || entitlements.includes("memoir_legacy");
    const hasPlus =
      entitlements.includes("plus") || entitlements.includes("memoir_plus");

    if (
      type.includes("INITIAL_PURCHASE") ||
      type.includes("RENEWAL") ||
      type.includes("UNCANCELLATION") ||
      type.includes("NON_RENEWING_PURCHASE") ||
      type.includes("PRODUCT_CHANGE")
    ) {
      if (hasLegacy) tier = "legacy";
      else if (hasPlus) tier = "plus";
      if (event.expiration_at_ms) {
        expiresAt = new Date(event.expiration_at_ms).toISOString();
      }
    } else if (type.includes("EXPIRATION") || type.includes("CANCELLATION")) {
      tier = "free";
      expiresAt = new Date().toISOString();
    } else if (hasLegacy) {
      tier = "legacy";
    } else if (hasPlus) {
      tier = "plus";
    }

    await setSubscriptionTier(admin, appUserId, tier, { expiresAt });

    await admin
      .from("profiles")
      .update({ revenuecat_app_user_id: appUserId })
      .eq("user_id", appUserId);

    return jsonResponse({ ok: true, tier });
  } catch (e) {
    console.error("revenuecat-webhook", e);
    return jsonResponse(
      { error: e instanceof Error ? e.message : "Webhook error" },
      500,
    );
  }
});
