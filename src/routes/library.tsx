import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Mic, Sparkles } from "lucide-react";
import { PageTransition } from "@/components/memoir/PageTransition";
import { BottomNav } from "@/components/memoir/BottomNav";
import { SummaryCard } from "@/components/memoir/SummaryCard";
import { StackedVolumeCard, VOLUME_COLORS } from "@/components/memoir/StackedVolumeCard";
import { allEntries, entriesForYear, getYears } from "@/data/mockEntries";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "The Memoir — Your Library" },
      { name: "description", content: "Your years, beautifully organized." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const years = getYears();

  return (
    <PageTransition>
      <div className="min-h-screen pb-28">
        <header className="mx-auto max-w-3xl px-6 pt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground"
          >
            <ChevronLeft size={14} /> Shelf
          </Link>
          <h1 className="mt-6 font-serif text-3xl text-foreground sm:text-4xl">The Memoir</h1>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
            {years.length} {years.length === 1 ? "year" : "years"} · {allEntries.length} entries
          </p>
        </header>

        <main className="mx-auto max-w-3xl px-6 mt-8">
          <SummaryCard
            scope="library"
            label="The Memoir"
            entries={allEntries}
            heading="An overview"
          />

          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-serif text-xl text-foreground">Volumes by year</h2>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3">
            {years.map((y, i) => {
              const count = entriesForYear(y).length;
              return (
                <StackedVolumeCard
                  key={y}
                  to="/year/$year"
                  params={{ year: String(y) }}
                  eyebrow="Volume"
                  title={String(y)}
                  subtitle="A year remembered"
                  footer={`${count} ${count === 1 ? "entry" : "entries"}`}
                  color={VOLUME_COLORS[i % VOLUME_COLORS.length]}
                />
              );
            })}
          </div>

          <Link
            to="/heirloom"
            className="group mt-12 block rounded-[14px] border border-border bg-[color:var(--card)] p-6 transition-all hover:border-[color:var(--sepia)]/40 hover:shadow-[0_18px_30px_-22px_rgba(40,25,10,0.3)]"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-[color:var(--sepia)]" />
              <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-[color:var(--sepia)]">
                Heirloom interviews
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl text-foreground sm:text-2xl">
                  Record someone you love.
                </h3>
                <p className="mt-1 max-w-md font-serif italic text-[14px] text-[color:var(--ink-tertiary)]">
                  An AI host asks the questions you wish you'd thought to ask. We bind every word into a volume in your memoir.
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-[color:var(--background)] transition-transform group-hover:-rotate-6">
                <Mic size={18} />
              </div>
            </div>
          </Link>
        </main>
        <BottomNav />
      </div>
    </PageTransition>
  );
}