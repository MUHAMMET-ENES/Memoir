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
import { useAuth } from "@/lib/auth";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interviewId: string;
  volumeTitle: string;
};

export function PrintWaitlistDialog({
  open,
  onOpenChange,
  interviewId,
  volumeTitle,
}: Props) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!user || !email.trim()) {
      toast("Enter an email for shipping updates.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("print_waitlist").insert({
      user_id: user.id,
      interview_id: interviewId,
      email: email.trim(),
      volume_title: volumeTitle,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't join the waitlist. Try again.");
      return;
    }
    toast.success("You're on the list. We'll email when hardcover printing opens.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-[color:var(--card)]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Order a hardcover</DialogTitle>
          <DialogDescription className="font-serif text-[15px] text-[color:var(--ink-tertiary)]">
            Printed heirloom books are launching soon. Join the waitlist for{" "}
            <em>{volumeTitle}</em> — we&apos;ll notify you when you can order.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <Label className="font-sans text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink-tertiary)]">
            Email
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="font-serif"
          />
        </div>
        <button
          type="button"
          disabled={submitting}
          onClick={() => void submit()}
          className="mt-4 w-full rounded-md bg-foreground py-2.5 font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--background)] disabled:opacity-50"
        >
          {submitting ? "Joining…" : "Join waitlist"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
