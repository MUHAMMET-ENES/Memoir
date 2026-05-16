import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Sparkles } from "lucide-react";
import { PageTransition } from "@/components/memoir/PageTransition";
import { BottomNav } from "@/components/memoir/BottomNav";

export const Route = createFileRoute("/entry/$entryId")({
  head: () => ({
    meta: [
      { title: "Journal — Coming soon — Memoir" },
      { name: "description", content: "Personal journaling is coming soon. Record heirloom interviews today." },
    ],
  }),
  component: EntryComingSoon,
});

function EntryComingSoon() {
  return (
    <PageTransition>
      <div className="min-h-dvh pb-28">
        <header className="mx-auto max-w-2xl px-6 pt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground"
          >
            <ChevronLeft size={14} /> Home
          </Link>
          <div className="mt-8 flex items-center gap-2">
            <Sparkles size={14} className="text-[color:var(--sepia)]" />
            <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-[color:var(--ink-tertiary)]">
              Personal journal
            </span>
          </div>
          <h1 className="mt-3 font-serif text-3xl text-foreground">Coming soon.</h1>
          <p className="mt-4 max-w-md font-serif italic text-[15px] leading-relaxed text-[color:var(--ink-tertiary)]">
            Memoir is focused on heirloom interviews — preserving family voices as bound volumes.
            Personal journaling will return in a future release.
          </p>
          <Link
            to="/heirloom"
            className="mt-8 inline-flex rounded-md bg-foreground px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--background)]"
          >
            Record an interview →
          </Link>
        </header>
        <BottomNav />
      </div>
    </PageTransition>
  );
}
