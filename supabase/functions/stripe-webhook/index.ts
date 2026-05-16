import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { adminClient } from "../_shared/auth.ts";
import { jsonResponse, optionsResponse } from "../_shared/cors.ts";
import { handleStripeEvent } from "../_shared/subscription-sync.ts";
import { verifyStripeWebhook, type StripeEvent } from "../_shared/stripe.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      return jsonResponse({ error: "Missing STRIPE_WEBHOOK_SECRET" }, 503);
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return jsonResponse({ error: "Missing stripe-signature" }, 400);
    }

    const valid = await verifyStripeWebhook(body, signature, webhookSecret);
    if (!valid) {
      return jsonResponse({ error: "Invalid signature" }, 400);
    }

    const event = JSON.parse(body) as StripeEvent;
    await handleStripeEvent(adminClient(), event);

    return jsonResponse({ received: true });
  } catch (e) {
    console.error("stripe-webhook", e);
    return jsonResponse(
      { error: e instanceof Error ? e.message : "Webhook error" },
      500,
    );
  }
});
