import { describe, expect, it } from "vitest";
import {
  canCreateInterview,
  canExportPdf,
  FREE_INTERVIEW_LIMIT,
  isPaidTier,
} from "./subscription";

describe("subscription", () => {
  it("isPaidTier", () => {
    expect(isPaidTier("plus")).toBe(true);
    expect(isPaidTier("legacy")).toBe(true);
    expect(isPaidTier("free")).toBe(false);
  });

  it("free user can create first interview only", () => {
    expect(canCreateInterview("free", 0, null)).toBe(true);
    expect(canCreateInterview("free", FREE_INTERVIEW_LIMIT, null)).toBe(false);
  });

  it("plus user can create unlimited while active", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    expect(canCreateInterview("plus", 5, future)).toBe(true);
    expect(canCreateInterview("plus", 5, null)).toBe(true);
  });

  it("expired plus falls back to free limit", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    expect(canCreateInterview("plus", 0, past)).toBe(true);
    expect(canCreateInterview("plus", FREE_INTERVIEW_LIMIT, past)).toBe(false);
  });

  it("canExportPdf requires paid active tier", () => {
    expect(canExportPdf("free", null)).toBe(false);
    expect(canExportPdf("plus", null)).toBe(true);
    const past = new Date(Date.now() - 1000).toISOString();
    expect(canExportPdf("plus", past)).toBe(false);
  });
});
