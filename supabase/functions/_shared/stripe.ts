/** Stripe webhook signature verification (compatible with Deno edge runtime). */

export function parseStripeWebhookSecret(secret: string): Uint8Array {
  const raw = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const binary = atob(raw);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export function parseStripeSignatureHeader(
  header: string,
): { timestamp: string; signatures: string[] } | null {
  let timestamp = "";
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const [key, value] = part.split("=");
    if (key === "t") timestamp = value;
    if (key === "v1") signatures.push(value);
  }
  if (!timestamp || signatures.length === 0) return null;
  return { timestamp, signatures };
}

export async function verifyStripeWebhook(
  payload: string,
  signatureHeader: string,
  webhookSecret: string,
  toleranceSeconds = 300,
): Promise<boolean> {
  const parsed = parseStripeSignatureHeader(signatureHeader);
  if (!parsed) return false;

  const ts = Number(parsed.timestamp);
  if (!Number.isFinite(ts)) return false;
  const age = Math.abs(Date.now() / 1000 - ts);
  if (age > toleranceSeconds) return false;

  const keyBytes = parseStripeWebhookSecret(webhookSecret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signedPayload = `${parsed.timestamp}.${payload}`;
  const mac = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(signedPayload),
  );
  const expected = [...new Uint8Array(mac)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return parsed.signatures.some((sig) => timingSafeEqual(sig, expected));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export type StripeEvent = {
  type: string;
  data: { object: Record<string, unknown> };
};

export function resolveUserIdFromStripeObject(
  obj: Record<string, unknown>,
): string | undefined {
  const meta = obj.metadata as Record<string, string> | undefined;
  if (meta?.supabase_user_id) return meta.supabase_user_id;
  if (typeof obj.client_reference_id === "string") return obj.client_reference_id;
  return undefined;
}
