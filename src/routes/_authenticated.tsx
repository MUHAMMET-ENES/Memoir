import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/login",
        search: { redirect: window.location.pathname },
      });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <main className="grid min-h-dvh place-items-center">
        <p className="font-serif italic text-[color:var(--ink-tertiary)]">…</p>
      </main>
    );
  }
  if (!user) return null;

  return <Outlet />;
}