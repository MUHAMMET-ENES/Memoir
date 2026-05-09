import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      navigate({ to: data.session ? "/heirloom" : "/login" });
    });
  }, [navigate]);
  return (
    <main className="grid min-h-dvh place-items-center">
      <p className="font-serif italic text-[color:var(--ink-tertiary)]">Signing you in…</p>
    </main>
  );
}