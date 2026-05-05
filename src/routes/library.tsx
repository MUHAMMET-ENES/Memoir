import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
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
        </main>
        <BottomNav />
      </div>
    </PageTransition>
  );
}