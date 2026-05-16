import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  canCreateInterview,
  canDownloadAudio,
  canExportPdf,
  type SubscriptionTier,
} from "@/lib/subscription";

export type SubscriptionProfile = {
  subscription_tier: SubscriptionTier;
  stripe_customer_id: string | null;
  subscription_expires_at: string | null;
  display_name: string | null;
};

export function useSubscription() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SubscriptionProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("subscription_tier, stripe_customer_id, subscription_expires_at, display_name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setProfile({
        subscription_tier: (data.subscription_tier as SubscriptionTier) ?? "free",
        stripe_customer_id: data.stripe_customer_id,
        subscription_expires_at: data.subscription_expires_at,
        display_name: data.display_name,
      });
    } else {
      setProfile({
        subscription_tier: "free",
        stripe_customer_id: null,
        subscription_expires_at: null,
        display_name: null,
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const tier = profile?.subscription_tier ?? "free";
  const expiresAt = profile?.subscription_expires_at ?? null;

  return {
    profile,
    tier,
    loading,
    refresh,
    canCreateInterview: (count: number) => canCreateInterview(tier, count, expiresAt),
    canExportPdf: () => canExportPdf(tier, expiresAt),
    canDownloadAudio: () => canDownloadAudio(tier, expiresAt),
    isPaid: tier === "plus" || tier === "legacy",
  };
}
