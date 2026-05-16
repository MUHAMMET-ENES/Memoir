export type SubscriptionTier = "free" | "plus" | "legacy";

export const TIER_META: Record<
  SubscriptionTier,
  { label: string; tagline: string; priceHint: string }
> = {
  free: {
    label: "Memoir",
    tagline: "One heirloom interview, bound and shareable.",
    priceHint: "Free",
  },
  plus: {
    label: "Memoir Plus",
    tagline: "Unlimited interviews, PDF export, voice playback, cloud sync.",
    priceHint: "$59/year or $7/month",
  },
  legacy: {
    label: "Memoir Legacy",
    tagline: "Printed hardcover + archival PDF for one volume.",
    priceHint: "From $99 per volume",
  },
};

export const FREE_INTERVIEW_LIMIT = 1;

export function isPaidTier(tier: SubscriptionTier): boolean {
  return tier === "plus" || tier === "legacy";
}

export function canCreateInterview(
  tier: SubscriptionTier,
  interviewCount: number,
  expiresAt: string | null,
): boolean {
  if (isPaidTier(tier)) {
    if (expiresAt && new Date(expiresAt) < new Date()) return interviewCount < FREE_INTERVIEW_LIMIT;
    return true;
  }
  return interviewCount < FREE_INTERVIEW_LIMIT;
}

export function canExportPdf(tier: SubscriptionTier, expiresAt: string | null): boolean {
  if (!isPaidTier(tier)) return false;
  if (expiresAt && new Date(expiresAt) < new Date()) return false;
  return true;
}

export function canDownloadAudio(tier: SubscriptionTier, expiresAt: string | null): boolean {
  return canExportPdf(tier, expiresAt);
}
