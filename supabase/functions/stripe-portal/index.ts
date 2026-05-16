import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getUserFromRequest, adminClient } from "../_shared/auth.ts";
import { jsonResponse, optionsResponse } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:5173";
    if (!stripeKey) {
      return jsonResponse({ error: "Stripe not configured" }, 503);
    }

    const admin = adminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id as string | undefined;

    if (!customerId) {
      const createRes = await fetch("https://api.stripe.com/v1/customers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: user.email ?? "",
          "metadata[supabase_user_id]": user.id,
        }).toString(),
      });
      const customer = await createRes.json();
      if (!createRes.ok) throw new Error(customer.error?.message ?? "Customer create failed");
      customerId = customer.id;
      await admin.rpc("set_subscription_tier", {
        p_user_id: user.id,
        p_tier: "free",
        p_stripe_customer_id: customerId,
      });
    }

    const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        customer: customerId!,
        return_url: `${siteUrl}/you`,
      }).toString(),
    });

    const portal = await portalRes.json();
    if (!portalRes.ok) {
      throw new Error(portal.error?.message ?? "Portal session failed");
    }

    return jsonResponse({ url: portal.url });
  } catch (e) {
    console.error("stripe-portal", e);
    return jsonResponse(
      { error: e instanceof Error ? e.message : "Portal error" },
      500,
    );
  }
});
