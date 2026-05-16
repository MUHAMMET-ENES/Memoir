import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { TIER_META } from "@/lib/subscription";

type PaywallReason = "second_interview" | "pdf_export" | "audio_download";

const REASON_COPY: Record<PaywallReason, { title: string; description: string }> = {
  second_interview: {
    title: "Unlock unlimited interviews",
    description:
      "Your free interview is a beautiful start. Memoir Plus lets you record every voice that matters — grandparents, parents, siblings — without limits.",
  },
  pdf_export: {
    title: "Export your heirloom PDF",
    description:
      "Download an archival PDF of this bound volume — watermark-free, ready to print or share with family.",
  },
  audio_download: {
    title: "Hear their voice, forever",
    description:
      "Memoir Plus preserves and plays back the actual voice behind every answer in your bound volume.",
  },
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: PaywallReason;
};

export function PaywallDialog({ open, onOpenChange, reason }: Props) {
  const [loading, setLoading] = useState<"monthly" | "annual" | "print" | null>(null);
  const copy = REASON_COPY[reason];

  async function checkout(mode: "plus_monthly" | "plus_annual" | "legacy_print") {
    setLoading(mode === "legacy_print" ? "print" : mode === "plus_annual" ? "annual" : "monthly");
    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: { mode },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        window.location.href = data.url as string;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Checkout unavailable. Try again later.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-[color:var(--card)]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{copy.title}</DialogTitle>
          <DialogDescription className="font-serif text-[15px] leading-relaxed text-[color:var(--ink-tertiary)]">
            {copy.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div className="rounded-md border border-[color:var(--sepia)]/30 bg-[color:var(--sepia)]/5 p-4">
            <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
              {TIER_META.plus.label}
            </div>
            <p className="mt-1 font-serif text-sm text-foreground">{TIER_META.plus.tagline}</p>
            <p className="mt-2 font-sans text-xs text-[color:var(--ink-tertiary)]">
              {TIER_META.plus.priceHint}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={!!loading}
                onClick={() => void checkout("plus_annual")}
                className="flex-1 rounded-md bg-foreground px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--background)] disabled:opacity-50"
              >
                {loading === "annual" ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  "Annual — $59/yr"
                )}
              </button>
              <button
                type="button"
                disabled={!!loading}
                onClick={() => void checkout("plus_monthly")}
                className="flex-1 rounded-md border border-border px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.22em] text-foreground disabled:opacity-50"
              >
                {loading === "monthly" ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  "Monthly — $7/mo"
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={!!loading}
            onClick={() => void checkout("legacy_print")}
            className="w-full rounded-md border border-border px-4 py-3 text-left transition-colors hover:border-[color:var(--sepia)]/40 disabled:opacity-50"
          >
            <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink-tertiary)]">
              {TIER_META.legacy.label}
            </div>
            <p className="mt-1 font-serif text-sm">{TIER_META.legacy.tagline}</p>
            {loading === "print" && (
              <Loader2 className="mt-2 h-4 w-4 animate-spin text-[color:var(--sepia)]" />
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
