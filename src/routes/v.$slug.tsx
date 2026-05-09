import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { getInterviewBySlug, type Interview } from "@/hooks/useInterviews";

export const Route = createFileRoute("/v/$slug")({
  head: () => ({
    meta: [
      { title: "An heirloom volume — Memoir" },
      { name: "description", content: "A bound oral history, kept forever." },
    ],
  }),
  component: PublicVolume,
});

function PublicVolume() {
  const { slug } = Route.useParams();
  const [iv, setIv] = useState<Interview | null | undefined>(undefined);

  useEffect(() => {
    getInterviewBySlug(slug).then(setIv);
  }, [slug]);

  if (iv === undefined) {
    return (
      <main className="grid min-h-dvh place-items-center">
        <p className="font-serif italic text-[color:var(--ink-tertiary)]">Opening the volume…</p>
      </main>
    );
  }
  if (!iv || !iv.bound) {
    return (
      <main className="grid min-h-dvh place-items-center px-6">
        <div className="text-center">
          <p className="font-serif text-lg">This volume is private or no longer shared.</p>
          <Link to="/" className="mt-4 inline-block font-sans text-[11px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
            ← Memoir
          </Link>
        </div>
      </main>
    );
  }

  const v = iv.bound;
  const date = new Date(iv.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-dvh bg-[color:var(--paper-sunken)]/40 pb-32">
      <header className="mx-auto max-w-2xl px-6 pt-8 print:hidden">
        <Link to="/" className="font-sans text-[10px] uppercase tracking-[0.32em] text-[color:var(--ink-tertiary)] hover:text-foreground">
          ← Memoir
        </Link>
        <button
          onClick={() => window.print()}
          className="float-right inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground"
        >
          <Printer size={13} /> Save as PDF
        </button>
      </header>

      <article className="mx-auto mt-12 max-w-[640px] px-8 print:px-0">
        <div className="text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-[color:var(--sepia)]">An heirloom interview</p>
          <h1 className="mt-6 font-serif text-4xl text-foreground sm:text-5xl">{iv.title}</h1>
          <p className="mt-4 font-serif italic text-[color:var(--ink-tertiary)]">
            with {iv.subjectName} · {date}
          </p>
        </div>

        {v.epigraph && (
          <blockquote className="mx-auto mt-16 max-w-md text-center font-serif italic text-xl leading-[1.6] text-foreground">
            “{v.epigraph}”
          </blockquote>
        )}

        {v.preface && (
          <section className="mt-16">
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">Preface</p>
            <p className="mt-3 font-serif text-[17px] leading-[1.75] text-foreground">{v.preface}</p>
          </section>
        )}

        {v.chapters.map((ch, ci) => (
          <section key={ci} className="mt-20 break-before-page">
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
              Chapter {ci + 1}
            </p>
            <h2 className="mt-2 font-serif text-2xl text-foreground">{ch.title}</h2>
            <div className="mt-6 space-y-5">
              {ch.passages.map((p, pi) =>
                p.kind === "question" ? (
                  <p key={pi} className="font-serif italic text-[14px] text-[color:var(--ink-tertiary)]">
                    — {p.text}
                  </p>
                ) : (
                  <p key={pi} className="font-serif text-[17px] leading-[1.8] text-foreground">
                    {p.text}
                  </p>
                ),
              )}
            </div>
          </section>
        ))}

        {v.closing && (
          <p className="mt-20 text-center font-serif italic text-[15px] text-[color:var(--ink-tertiary)]">
            {v.closing}
          </p>
        )}

        <div className="mt-24 text-center font-sans text-[10px] uppercase tracking-[0.32em] text-[color:var(--ink-tertiary)] print:hidden">
          Bound with Memoir
        </div>
      </article>
    </main>
  );
}