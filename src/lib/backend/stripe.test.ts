import { describe, expect, it } from "vitest";
import {
  parseStripeSignatureHeader,
  resolveUserIdFromStripeObject,
  timingSafeEqual,
} from "./stripe";

describe("stripe webhook helpers", () => {
  it("parseStripeSignatureHeader", () => {
    const parsed = parseStripeSignatureHeader("t=1234567890,v1=abc123");
    expect(parsed).toEqual({ timestamp: "1234567890", signatures: ["abc123"] });
    expect(parseStripeSignatureHeader("invalid")).toBeNull();
  });

  it("resolveUserIdFromStripeObject prefers metadata", () => {
    expect(
      resolveUserIdFromStripeObject({
        metadata: { supabase_user_id: "user-a" },
        client_reference_id: "user-b",
      }),
    ).toBe("user-a");
    expect(
      resolveUserIdFromStripeObject({ client_reference_id: "user-b" }),
    ).toBe("user-b");
    expect(resolveUserIdFromStripeObject({})).toBeUndefined();
  });

  it("timingSafeEqual", () => {
    expect(timingSafeEqual("abc", "abc")).toBe(true);
    expect(timingSafeEqual("abc", "abd")).toBe(false);
    expect(timingSafeEqual("ab", "abc")).toBe(false);
  });
});
