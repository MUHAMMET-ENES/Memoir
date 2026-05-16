/**
 * Stripe helpers (mirrored in supabase/functions/_shared/stripe.ts for edge runtime).
 * Keep algorithms in sync — tests run against this module.
 */

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

export function resolveUserIdFromStripeObject(
  obj: Record<string, unknown>,
): string | undefined {
  const meta = obj.metadata as Record<string, string> | undefined;
  if (meta?.supabase_user_id) return meta.supabase_user_id;
  if (typeof obj.client_reference_id === "string") return obj.client_reference_id;
  return undefined;
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
