import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, List, Printer, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { PageTransition } from "@/components/memoir/PageTransition";
import { useInterviews } from "@/hooks/useInterviews";
import type { BoundVolume as BoundVolumeData } from "@/hooks/useInterviews";

export const Route = createFileRoute("/heirloom/$interviewId/bound")({
  head: () => ({
    meta: [
      { title: "A Bound Volume — Memoir" },
      { name: "description", content: "An heirloom interview, bound." },
    ],
  }),
  component: BoundVolume,
});

type Page =
  | { kind: "front-cover"; title: string; subjectName: string }
  | { kind: "inside-front"; subjectName: string; date: string }
  | { kind: "title"; title: string; subjectName: string; date: string }
  | { kind: "epigraph"; text: string }
  | { kind: "preface"; text: string }
  | { kind: "contents"; chapters: { title: string; pageIndex: number }[] }
  | {
      kind: "chapter-open";
      number: number;
      title: string;
      chapterIndex: number;
    }
  | {
      kind: "chapter-body";
      chapterIndex: number;
      blocks: { kind: "question" | "answer"; text: string }[];
    }
  | { kind: "closing"; text: string }
  | { kind: "inside-back" }
  | { kind: "back-cover" };

const CHARS_PER_PAGE = 900;

function buildPages(v: BoundVolumeData, iv: { title: string; subjectName: string; createdAt: number }): Page[] {
  const date = new Date(iv.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pages: Page[] = [];
  pages.push({ kind: "front-cover", title: iv.title, subjectName: iv.subjectName });
  pages.push({ kind: "inside-front", subjectName: iv.subjectName, date });
  pages.push({ kind: "title", title: iv.title, subjectName: iv.subjectName, date });
  if (v.epigraph) pages.push({ kind: "epigraph", text: v.epigraph });
  if (v.preface) pages.push({ kind: "preface", text: v.preface });

  // Reserve a slot for contents; we fill chapter page indices after building.
  const contentsIndex = pages.length;
  pages.push({ kind: "contents", chapters: [] });

  const chapterPageMap: { title: string; pageIndex: number }[] = [];

  v.chapters.forEach((ch, ci) => {
    chapterPageMap.push({ title: ch.title, pageIndex: pages.length });
    pages.push({
      kind: "chapter-open",
      number: ci + 1,
      title: ch.title,
      chapterIndex: ci,
    });

    // Paginate passages by accumulating character count per page.
    let bucket: { kind: "question" | "answer"; text: string }[] = [];
    let count = 0;
    for (const p of ch.passages) {
      const len = p.text.length + (p.kind === "question" ? 30 : 0);
      if (count + len > CHARS_PER_PAGE && bucket.length) {
        pages.push({ kind: "chapter-body", chapterIndex: ci, blocks: bucket });
        bucket = [];
        count = 0;
      }
      bucket.push(p);
      count += len;
    }
    if (bucket.length) {
      pages.push({ kind: "chapter-body", chapterIndex: ci, blocks: bucket });
    }
  });

  pages[contentsIndex] = { kind: "contents", chapters: chapterPageMap };

  if (v.closing) pages.push({ kind: "closing", text: v.closing });
  pages.push({ kind: "inside-back" });
  pages.push({ kind: "back-cover" });

  return pages;
}

function BoundVolume() {
  const { interviewId } = Route.useParams();
  const { interviews } = useInterviews();
  const iv = useMemo(
    () => interviews.find((x) => x.id === interviewId),
    [interviews, interviewId],
  );

  const pages = useMemo(
    () => (iv && iv.bound ? buildPages(iv.bound, iv) : []),
    [iv],
  );

  const [current, setCurrent] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [dragDx, setDragDx] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setCurrent((c) => Math.min(pages.length - 1, c + 1));
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(0, c - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages.length]);

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

  const total = pages.length;
  const next = () => setCurrent((c) => Math.min(total - 1, c + 1));
  const prev = () => setCurrent((c) => Math.max(0, c - 1));

  const jumpTo = (idx: number) => {
    setTocOpen(false);
    setCurrent(idx);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setTouchStart({ x: t.clientX, y: t.clientY, t: Date.now() });
    setDragDx(0);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDragDx(Math.max(-160, Math.min(160, dx)));
    }
  };
  const onTouchEnd = () => {
    if (!touchStart) return;
    const elapsed = Date.now() - touchStart.t;
    const velocity = Math.abs(dragDx) / Math.max(elapsed, 1);
    const threshold = 60;
    if (dragDx <= -threshold || (dragDx < -20 && velocity > 0.4)) {
      next();
    } else if (dragDx >= threshold || (dragDx > 20 && velocity > 0.4)) {
      prev();
    }
    setTouchStart(null);
    setDragDx(0);
  };

  return (
    <PageTransition>
      <main
        className="relative min-h-dvh overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--paper-sunken) 0%, color-mix(in oklab, var(--background) 70%, black 6%) 100%)",
        }}
      >
        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 print:hidden">
          <Link
            to="/heirloom"
            className="inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground"
          >
            <ChevronLeft size={14} /> Interviews
          </Link>
          <button
            onClick={() => setTocOpen(true)}
            className="inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground"
          >
            <List size={13} /> Contents
          </button>
        </header>

        {/* Book stage */}
        <div
          className="mx-auto flex min-h-dvh items-center justify-center px-4 py-16"
          style={{ perspective: "2200px", touchAction: "pan-y" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <div
            className="relative aspect-[3/4] w-full max-w-[460px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Static back cover sits behind everything */}
            <BookCoverBack />

            {pages.map((page, i) => {
              const isCover = page.kind === "front-cover" || page.kind === "back-cover";
              const flipped = i < current;
              const isTopUnflipped = i === current && dragDx < 0;
              const isTopFlipped = i === current - 1 && dragDx > 0;
              let dragRotate = 0;
              if (isTopUnflipped) {
                dragRotate = Math.max(-180, (dragDx / 160) * 180);
              } else if (isTopFlipped) {
                dragRotate = Math.min(0, -180 + (dragDx / 160) * 180);
              }
              const baseRotate = flipped ? -180 : 0;
              const rotate = (isTopUnflipped || isTopFlipped) ? dragRotate : baseRotate;
              const dragging = isTopUnflipped || isTopFlipped;
              // Z-index: unflipped pages stack with later ones below;
              // flipped pages stack with earlier ones below.
              const z = flipped ? i + 1 : total - i;
              return (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "left center",
                    transform: `rotateY(${rotate}deg)`,
                    transition: dragging
                      ? "none"
                      : "transform 900ms cubic-bezier(0.645, 0.045, 0.355, 1)",
                    zIndex: z,
                    pointerEvents: i === current || i === current - 1 ? "auto" : "none",
                  }}
                >
                  {/* Front face */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-r-[6px] rounded-l-[2px]"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      boxShadow: isCover
                        ? "0 30px 60px -20px rgba(0,0,0,0.45), inset -8px 0 18px -10px rgba(0,0,0,0.25)"
                        : "inset -10px 0 22px -16px rgba(0,0,0,0.25)",
                    }}
                  >
                    <PageFace page={page} side="front" />
                  </div>
                  {/* Back face (what shows after flipping) */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-l-[6px] rounded-r-[2px]"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      boxShadow: "inset 10px 0 22px -16px rgba(0,0,0,0.25)",
                    }}
                  >
                    <PageBack page={pages[i + 1]} index={i + 1} total={total} />
                  </div>
                </div>
              );
            })}

            {/* Tap zones */}
            <button
              aria-label="Previous page"
              onClick={prev}
              disabled={current === 0}
              className="absolute inset-y-0 left-0 z-40 w-1/3 cursor-w-resize disabled:cursor-not-allowed disabled:opacity-0 print:hidden"
            />
            <button
              aria-label="Next page"
              onClick={next}
              disabled={current >= total - 1}
              className="absolute inset-y-0 right-0 z-40 w-1/3 cursor-e-resize disabled:cursor-not-allowed disabled:opacity-0 print:hidden"
            />
          </div>
        </div>

        {/* Bottom controls */}
        <footer className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-5 py-4 print:hidden">
          <button
            onClick={prev}
            disabled={current === 0}
            className="inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
            {current + 1} / {total}
          </div>
          <button
            onClick={next}
            disabled={current >= total - 1}
            className="inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground disabled:opacity-30"
          >
            Next <ChevronRight size={14} />
          </button>
        </footer>

        {/* Contents drawer */}
        {tocOpen && (
          <div className="fixed inset-0 z-50 print:hidden">
            <div
              className="absolute inset-0 bg-black/40 animate-fade-in"
              onClick={() => setTocOpen(false)}
            />
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md rounded-t-2xl bg-card p-6 shadow-2xl animate-slide-in-right">
              <div className="flex items-center justify-between">
                <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--sepia)]">
                  Contents
                </div>
                <button onClick={() => setTocOpen(false)} aria-label="Close contents">
                  <X size={16} className="text-[color:var(--ink-tertiary)]" />
                </button>
              </div>
              <ol className="mt-5 space-y-3 max-h-[60vh] overflow-y-auto">
                {iv.bound.chapters.map((ch, ci) => {
                  const pageIdx = pages.findIndex(
                    (p) => p.kind === "chapter-open" && p.chapterIndex === ci,
                  );
                  const isActive = current >= pageIdx && (
                    ci === iv.bound!.chapters.length - 1 ||
                    current < pages.findIndex(
                      (p) => p.kind === "chapter-open" && p.chapterIndex === ci + 1,
                    )
                  );
                  return (
                    <li key={ci}>
                      <button
                        onClick={() => jumpTo(pageIdx)}
                        className={`flex w-full items-baseline gap-3 text-left font-serif text-[15px] ${
                          isActive ? "text-[color:var(--sepia)]" : "text-foreground"
                        }`}
                      >
                        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
                          {romanize(ci + 1)}
                        </span>
                        <span className="flex-1 border-b border-dotted border-border/60 translate-y-[-3px]" />
                        <span className="italic">{ch.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
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
                    className="font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--sepia)] hover:underline"
                  >
                    Order →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </PageTransition>
  );
}

function BookCoverBack() {
  return (
    <div
      className="absolute inset-0 rounded-r-[6px] rounded-l-[2px]"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--sepia) 80%, black 20%), color-mix(in oklab, var(--sepia) 60%, black 40%))",
        boxShadow:
          "0 40px 80px -20px rgba(0,0,0,0.55), inset 0 0 60px rgba(0,0,0,0.3)",
        zIndex: 0,
      }}
    />
  );
}

function PageFace({ page, side }: { page: Page; side: "front" | "back" }) {
  void side;
  switch (page.kind) {
    case "front-cover":
      return (
        <div
          className="flex h-full flex-col items-center justify-between px-8 py-14 text-center"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--sepia) 75%, black 15%), color-mix(in oklab, var(--sepia) 55%, black 35%))",
            color: "oklch(0.96 0.02 80)",
          }}
        >
          <div className="font-sans text-[10px] uppercase tracking-[0.5em] opacity-80">
            An heirloom volume
          </div>
          <div>
            <div className="mx-auto mb-6 h-px w-16 bg-current opacity-40" />
            <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
              {page.title}
            </h1>
            <p className="mt-4 font-serif italic text-[14px] opacity-85">
              an interview with {page.subjectName}
            </p>
            <div className="mx-auto mt-6 h-px w-16 bg-current opacity-40" />
          </div>
          <div className="font-sans text-[10px] uppercase tracking-[0.4em] opacity-70">
            Memoir
          </div>
        </div>
      );

    case "inside-front":
      return (
        <PaperPage>
          <div className="flex h-full flex-col justify-center px-10">
            <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--ink-tertiary)]">
              From the binder
            </div>
            <p
              className="mt-6 text-[19px] leading-[1.7] text-foreground"
              style={{ fontFamily: "'Caveat', 'Lora', cursive" }}
            >
              For {page.subjectName} —
              <br />
              <br />
              These are your words, kept whole. Read slowly. Some pages will
              sound like the kitchen table; others like the hush before sleep.
              However it lands, this volume is yours, and the people who love
              you can hear you speak inside it whenever they open the cover.
            </p>
            <div className="mt-8 font-serif italic text-[13px] text-[color:var(--ink-tertiary)]">
              Bound on {page.date}.
            </div>
          </div>
        </PaperPage>
      );

    case "title":
      return (
        <PaperPage>
          <div className="flex h-full flex-col items-center justify-center px-10 text-center">
            <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--sepia)]">
              An heirloom volume
            </div>
            <h1 className="mt-8 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              {page.title}
            </h1>
            <p className="mt-4 font-serif italic text-[14px] text-[color:var(--ink-tertiary)]">
              an interview with {page.subjectName}
            </p>
            <div className="mx-auto my-8 h-px w-12 bg-border" />
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
              {page.date}
            </p>
          </div>
        </PaperPage>
      );

    case "epigraph":
      return (
        <PaperPage>
          <div className="flex h-full items-center justify-center px-10">
            <blockquote className="text-center font-serif italic text-[20px] leading-[1.6] text-foreground">
              {page.text}
            </blockquote>
          </div>
        </PaperPage>
      );

    case "preface":
      return (
        <PaperPage>
          <div className="flex h-full flex-col px-10 py-14">
            <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
              Preface
            </div>
            <p className="mt-4 font-serif text-[16px] leading-[1.75] text-foreground">
              {page.text}
            </p>
          </div>
        </PaperPage>
      );

    case "contents":
      return (
        <PaperPage>
          <div className="flex h-full flex-col px-10 py-14">
            <div className="text-center font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--sepia)]">
              Contents
            </div>
            <ol className="mt-8 space-y-4">
              {page.chapters.map((ch, ci) => (
                <li
                  key={ci}
                  className="flex items-baseline gap-3 font-serif text-[15px] text-foreground"
                >
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
                    {romanize(ci + 1)}
                  </span>
                  <span className="flex-1 border-b border-dotted border-border/60 translate-y-[-3px]" />
                  <span className="italic">{ch.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </PaperPage>
      );

    case "chapter-open":
      return (
        <PaperPage>
          <div className="flex h-full flex-col items-center justify-center px-10 text-center">
            <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--sepia)]">
              Chapter {romanize(page.number)}
            </div>
            <h2 className="mt-6 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
              {page.title}
            </h2>
            <div className="mx-auto mt-6 h-px w-12 bg-border" />
          </div>
        </PaperPage>
      );

    case "chapter-body":
      return (
        <PaperPage>
          <div className="flex h-full flex-col gap-4 px-10 py-12 overflow-hidden">
            {page.blocks.map((b, bi) =>
              b.kind === "question" ? (
                <p
                  key={bi}
                  className="font-serif italic text-[13px] leading-[1.6] text-[color:var(--ink-tertiary)]"
                >
                  — {b.text}
                </p>
              ) : (
                <p
                  key={bi}
                  className="font-serif text-[15px] leading-[1.75] text-foreground first:first-letter:font-serif first:first-letter:text-[26px] first:first-letter:text-[color:var(--sepia)]"
                >
                  {b.text}
                </p>
              ),
            )}
          </div>
        </PaperPage>
      );

    case "closing":
      return (
        <PaperPage>
          <div className="flex h-full items-center justify-center px-10">
            <p className="text-center font-serif italic text-[16px] leading-[1.7] text-[color:var(--ink-tertiary)]">
              {page.text}
            </p>
          </div>
        </PaperPage>
      );

    case "inside-back":
      return (
        <PaperPage>
          <div className="flex h-full flex-col justify-end px-10 py-14">
            <p
              className="text-[19px] leading-[1.7] text-foreground"
              style={{ fontFamily: "'Caveat', 'Lora', cursive" }}
            >
              The end of this volume — but not of the story. There are more
              questions waiting whenever you're ready to sit down and answer
              them.
            </p>
            <div className="mt-8 font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--ink-tertiary)]">
              — Memoir
            </div>
          </div>
        </PaperPage>
      );

    case "back-cover":
      return (
        <div
          className="flex h-full items-end justify-center p-8"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--sepia) 60%, black 35%), color-mix(in oklab, var(--sepia) 75%, black 15%))",
            color: "oklch(0.96 0.02 80)",
          }}
        >
          <div className="font-sans text-[9px] uppercase tracking-[0.5em] opacity-70">
            Memoir · Bound Volumes
          </div>
        </div>
      );
  }
}

function PageBack({ page, index, total }: { page: Page | undefined; index: number; total: number }) {
  // Reuse the same content for the verso side so the page reads continuously.
  if (!page) {
    return (
      <div className="h-full w-full" style={{ background: "var(--paper-sunken)" }} />
    );
  }
  return (
    <div className="relative h-full w-full">
      <PageFace page={page} side="back" />
      {/* page number bottom-left on verso */}
      <div className="pointer-events-none absolute bottom-3 left-4 font-sans text-[9px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
        {index + 1} / {total}
      </div>
    </div>
  );
}

function PaperPage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-full w-full"
      style={{
        background:
          "linear-gradient(180deg, var(--background) 0%, color-mix(in oklab, var(--background) 92%, var(--sepia) 8%) 100%)",
      }}
    >
      {children}
    </div>
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
