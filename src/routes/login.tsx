import { useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "/heirloom",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Memoir" },
      { name: "description", content: "Sign in to record and keep heirloom interviews." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    navigate({ to: redirect });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: redirect });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    try {
      const res = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth/callback`,
      });
      if (res.error) throw res.error;
      if (!res.redirected) navigate({ to: redirect });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't sign in with Google.");
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-[color:var(--paper-sunken)]/40 px-6">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="font-sans text-[10px] uppercase tracking-[0.32em] text-[color:var(--ink-tertiary)] hover:text-foreground"
        >
          ← Memoir
        </Link>
        <h1 className="mt-6 font-serif text-3xl text-foreground">
          {mode === "signin" ? "Welcome back." : "Begin your memoir."}
        </h1>
        <p className="mt-2 font-serif italic text-[14px] text-[color:var(--ink-tertiary)]">
          {mode === "signin"
            ? "Sign in to continue your interviews."
            : "An account keeps your recordings safe forever."}
        </p>

        <button
          onClick={google}
          className="mt-7 w-full rounded-md border border-border bg-[color:var(--card)] px-4 py-3 font-sans text-[12px] tracking-wide text-foreground transition-colors hover:bg-[color:var(--paper-sunken)]"
        >
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
            or
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label className="font-sans text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink-tertiary)]">
                Your name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anna"
                className="border-0 border-b border-border rounded-none bg-transparent px-0 font-serif text-base shadow-none focus-visible:ring-0 focus-visible:border-[color:var(--sepia)]"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label className="font-sans text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink-tertiary)]">
              Email
            </Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-0 border-b border-border rounded-none bg-transparent px-0 font-serif text-base shadow-none focus-visible:ring-0 focus-visible:border-[color:var(--sepia)]"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-sans text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink-tertiary)]">
              Password
            </Label>
            <Input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-0 border-b border-border rounded-none bg-transparent px-0 font-serif text-base shadow-none focus-visible:ring-0 focus-visible:border-[color:var(--sepia)]"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-2 w-full rounded-md bg-foreground px-4 py-3 font-sans text-[11px] uppercase tracking-[0.28em] text-[color:var(--background)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-5 font-sans text-[11px] tracking-wide text-[color:var(--ink-tertiary)] hover:text-foreground"
        >
          {mode === "signin" ? "New here? Create an account." : "Already have an account? Sign in."}
        </button>
      </div>
    </main>
  );
}