import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getUserFromRequest, adminClient } from "../_shared/auth.ts";
import { jsonResponse, optionsResponse } from "../_shared/cors.ts";

const PRICE_MAP: Record<string, string> = {
  plus_monthly: "STRIPE_PRICE_PLUS_MONTHLY",
  plus_annual: "STRIPE_PRICE_PLUS_ANNUAL",
  legacy_print: "STRIPE_PRICE_LEGACY_PRINT",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { mode, gift } = await req.json();
    const priceEnv = PRICE_MAP[mode as string];
    if (!priceEnv) {
      return jsonResponse({ error: "Invalid checkout mode" }, 400);
    }

    const priceId = Deno.env.get(priceEnv);
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:5173";

    if (!stripeKey || !priceId) {
      return jsonResponse(
        {
          error:
            "Stripe is not configured. Set STRIPE_SECRET_KEY and price IDs in Supabase secrets.",
        },
        503,
      );
    }

    if (gift?.recipientEmail) {
      const admin = adminClient();
      await admin.from("gift_purchases").insert({
        buyer_user_id: user.id,
        recipient_email: gift.recipientEmail,
        recipient_name: gift.recipientName ?? null,
        plan: mode === "legacy_print" ? "legacy_print" : "plus_annual",
        status: "pending",
      });
    }

    const isSubscription = mode === "plus_monthly" || mode === "plus_annual";

    const params = new URLSearchParams();
    params.set("mode", isSubscription ? "subscription" : "payment");
    params.set("success_url", `${siteUrl}/you?checkout=success`);
    params.set("cancel_url", `${siteUrl}/you?checkout=cancel`);
    params.set("client_reference_id", user.id);
    if (user.email) params.set("customer_email", user.email);
    params.set("line_items[0][price]", priceId);
    params.set("line_items[0][quantity]", "1");
    params.set("metadata[supabase_user_id]", user.id);
    params.set("metadata[checkout_mode]", mode);

    if (gift?.recipientEmail) {
      params.set("metadata[gift_recipient_email]", gift.recipientEmail);
      params.set("metadata[gift_recipient_name]", gift.recipientName ?? "");
    }

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();
    if (!stripeRes.ok) {
      throw new Error(session.error?.message ?? "Stripe checkout failed");
    }

    return jsonResponse({ url: session.url });
  } catch (e) {
    console.error("stripe-checkout", e);
    return jsonResponse(
      { error: e instanceof Error ? e.message : "Checkout error" },
      500,
    );
  }
});
