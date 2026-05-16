import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Mic, Sparkles } from "lucide-react";
import { PageTransition } from "@/components/memoir/PageTransition";
import { BottomNav } from "@/components/memoir/BottomNav";
import { useRequireAuth } from "@/lib/auth";
import { useInterviews } from "@/hooks/useInterviews";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Your volumes — Memoir" },
      { name: "description", content: "Heirloom interviews you've recorded and bound." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { ready } = useRequireAuth();
  const { interviews, loading } = useInterviews();

  if (!ready) {
    return (
      <main className="grid min-h-dvh place-items-center">
        <p className="font-serif italic text-[color:var(--ink-tertiary)]">…</p>
      </main>
    );
  }

  const bound = interviews.filter((i) => i.status === "bound");
  const inProgress = interviews.filter((i) => i.status !== "bound");

  return (
    <PageTransition>
      <div className="min-h-dvh pb-28">
        <header className="mx-auto max-w-3xl px-6 pt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground"
          >
            <ChevronLeft size={14} /> Home
          </Link>
          <h1 className="mt-6 font-serif text-3xl text-foreground sm:text-4xl">Your volumes</h1>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
            {bound.length} bound · {inProgress.length} in progress
          </p>
        </header>

        <main className="mx-auto mt-8 max-w-3xl px-6">
          {loading ? (
            <p className="font-serif italic text-[color:var(--ink-tertiary)]">Loading…</p>
          ) : interviews.length === 0 ? (
            <div className="rounded-[14px] border border-border bg-[color:var(--card)] p-8 text-center">
              <p className="font-serif text-lg text-foreground">No volumes yet.</p>
              <p className="mt-2 font-serif italic text-[14px] text-[color:var(--ink-tertiary)]">
                Start by recording someone you love.
              </p>
              <Link
                to="/heirloom"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--background)]"
              >
                <Mic size={13} /> Begin an interview
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {interviews.map((iv) => (
                <li key={iv.id}>
                  <Link
                    to={
                      iv.status === "bound"
                        ? "/heirloom/$interviewId/bound"
                        : "/heirloom/$interviewId"
                    }
                    params={{ interviewId: iv.id }}
                    className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-[color:var(--paper-sunken)]/40"
                  >
                    <div>
                      <div className="font-serif text-base text-foreground">{iv.title}</div>
                      <div className="mt-0.5 font-sans text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)]">
                        {new Date(iv.createdAt).toLocaleDateString()} ·{" "}
                        {iv.status === "bound" ? "Bound" : `${iv.turns.length} turns`}
                        {iv.is_public && iv.status === "bound" ? " · Shared" : ""}
                      </div>
                    </div>
                    <Sparkles size={14} className="shrink-0 text-[color:var(--sepia)]" />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            to="/heirloom"
            className="group mt-10 block rounded-[14px] border border-border bg-[color:var(--card)] p-6 transition-all hover:border-[color:var(--sepia)]/40"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-[color:var(--sepia)]" />
              <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-[color:var(--sepia)]">
                New heirloom interview
              </span>
            </div>
            <p className="mt-2 font-serif text-lg text-foreground">Record someone you love.</p>
          </Link>

          <p className="mt-8 font-sans text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink-tertiary)]">
            Personal journaling — coming soon
          </p>
        </main>
        <BottomNav />
      </div>
    </PageTransition>
  );
}
