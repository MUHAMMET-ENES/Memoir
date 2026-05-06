import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Printer, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageTransition } from "@/components/memoir/PageTransition";
import { useInterviews } from "@/hooks/useInterviews";

export const Route = createFileRoute("/heirloom/$interviewId/bound")({
  head: () => ({
    meta: [
      { title: "A Bound Volume — Memoir" },
      { name: "description", content: "An heirloom interview, bound." },
    ],
  }),
  component: BoundVolume,
});

function BoundVolume() {
  const { interviewId } = Route.useParams();
  const { interviews } = useInterviews();
  const iv = useMemo(
    () => interviews.find((x) => x.id === interviewId),
    [interviews, interviewId],
  );

  if (!iv || !iv.bound) {
    return (
      <PageTransition>
        <main className="grid min-h-dvh place-items-center px-6">
          <div className="text-center">
            <p className="font-serif text-lg">This volume isn't ready yet.</p>
            <Link
              to="/heirloom"
              className="mt-4 inline-block font-sans text-[11px] uppercase tracking-[0.3em] text-[color:var(--sepia)]"
            >
              ← Back to interviews
            </Link>
          </div>
        </main>
      </PageTransition>
    );
  }

  const v = iv.bound;

  return (
    <PageTransition>
      <main className="min-h-dvh pb-24">
        <header className="mx-auto max-w-2xl px-6 pt-8 print:hidden">
          <Link
            to="/heirloom"
            className="inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground"
          >
            <ChevronLeft size={14} /> Interviews
          </Link>
        </header>

        <article className="mx-auto mt-8 max-w-2xl px-6">
          {/* Title page */}
          <div className="border-y border-border py-14 text-center">
            <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--sepia)]">
              An heirloom volume
            </div>
            <h1 className="mt-6 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
              {iv.title}
            </h1>
            <p className="mt-3 font-serif italic text-[15px] text-[color:var(--ink-tertiary)]">
              an interview with {iv.subjectName}
            </p>
            <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
              {new Date(iv.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {v.epigraph && (
            <blockquote className="mx-auto mt-12 max-w-md text-center font-serif italic text-[19px] leading-[1.6] text-foreground">
              {v.epigraph}
            </blockquote>
          )}

          {v.preface && (
            <section className="mt-14">
              <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
                Preface
              </div>
              <p className="mt-3 font-serif text-[17px] leading-[1.75] text-foreground">
                {v.preface}
              </p>
            </section>
          )}

          <div className="mt-16 space-y-16">
            {v.chapters.map((ch, ci) => (
              <section key={ci}>
                <div className="text-center">
                  <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--sepia)]">
                    Chapter {romanize(ci + 1)}
                  </div>
                  <h2 className="mt-3 font-serif text-2xl text-foreground sm:text-3xl">
                    {ch.title}
                  </h2>
                  <div className="mx-auto mt-4 h-px w-12 bg-border" />
                </div>
                <div className="mt-8 space-y-5">
                  {ch.passages.map((p, pi) =>
                    p.kind === "question" ? (
                      <p
                        key={pi}
                        className="font-serif italic text-[14px] leading-[1.6] text-[color:var(--ink-tertiary)]"
                      >
                        — {p.text}
                      </p>
                    ) : (
                      <p
                        key={pi}
                        className="font-serif text-[17px] leading-[1.8] text-foreground first-letter:font-serif first-letter:text-[28px] first-letter:text-[color:var(--sepia)]"
                      >
                        {p.text}
                      </p>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>

          {v.closing && (
            <section className="mt-16 border-t border-border pt-8">
              <p className="font-serif italic text-[15px] leading-[1.7] text-[color:var(--ink-tertiary)]">
                {v.closing}
              </p>
            </section>
          )}

          <footer className="mt-16 flex items-center justify-between border-t border-border pt-6 print:hidden">
            <div className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
              <Sparkles size={12} className="text-[color:var(--sepia)]" /> Bound by Memoir
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--ink-tertiary)] hover:text-foreground"
              >
                <Printer size={13} /> Print
              </button>
              <button
                onClick={() => toast("Hardcover printing coming soon.")}
                className="inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--sepia)] hover:underline"
              >
                Order hardcover →
              </button>
            </div>
          </footer>
        </article>
      </main>
    </PageTransition>
  );
}

function romanize(n: number): string {
  const map: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let s = "";
  for (const [v, sym] of map) {
    while (n >= v) {
      s += sym;
      n -= v;
    }
  }
  return s;
}