import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GiftDialog({ open, onOpenChange }: Props) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [plan, setPlan] = useState<"plus_annual" | "legacy_print">("plus_annual");
  const [loading, setLoading] = useState(false);

  async function checkout() {
    if (!recipientEmail.trim()) {
      toast("Enter the recipient's email.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          mode: plan,
          gift: {
            recipientEmail: recipientEmail.trim(),
            recipientName: recipientName.trim() || undefined,
          },
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        window.location.href = data.url as string;
        return;
      }
      throw new Error("No checkout URL");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gift checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-[color:var(--card)]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Give Memoir</DialogTitle>
          <DialogDescription className="font-serif text-[15px] text-[color:var(--ink-tertiary)]">
            Buy an annual Plus membership or a printed heirloom volume for someone you love.
            They&apos;ll receive onboarding by email.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label className="font-sans text-[10px] uppercase tracking-[0.28em]">Recipient email</Label>
            <Input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="dad@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-sans text-[10px] uppercase tracking-[0.28em]">Their name (optional)</Label>
            <Input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Dad"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPlan("plus_annual")}
              className={`flex-1 rounded-md border px-3 py-2 font-sans text-[10px] uppercase tracking-[0.2em] ${
                plan === "plus_annual"
                  ? "border-[color:var(--sepia)] bg-[color:var(--sepia)]/10 text-[color:var(--sepia)]"
                  : "border-border text-[color:var(--ink-tertiary)]"
              }`}
            >
              Plus — $59/yr
            </button>
            <button
              type="button"
              onClick={() => setPlan("legacy_print")}
              className={`flex-1 rounded-md border px-3 py-2 font-sans text-[10px] uppercase tracking-[0.2em] ${
                plan === "legacy_print"
                  ? "border-[color:var(--sepia)] bg-[color:var(--sepia)]/10 text-[color:var(--sepia)]"
                  : "border-border text-[color:var(--ink-tertiary)]"
              }`}
            >
              Print — $99
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => void checkout()}
          className="mt-4 w-full rounded-md bg-foreground py-2.5 font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--background)] disabled:opacity-50"
        >
          {loading ? "Redirecting…" : "Continue to checkout"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
