import { createFileRoute } from "@tanstack/react-router";
import { ShelfHeader } from "@/components/memoir/ShelfHeader";
import { BottomNav } from "@/components/memoir/BottomNav";
import { StackedVolumeCard } from "@/components/memoir/StackedVolumeCard";
import { PageTransition } from "@/components/memoir/PageTransition";
import { SummaryCard } from "@/components/memoir/SummaryCard";
import { allEntries, getYears } from "@/data/mockEntries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Memoir — Your Life, Beautifully Remembered" },
      {
        name: "description",
        content:
          "A private, beautifully typeset journal. Your life, kept on your device — and worth remembering.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const years = getYears();
  const firstYear = years[years.length - 1];
  const lastYear = years[0];
  const range = firstYear === lastYear ? `${firstYear}` : `${firstYear} – ${lastYear}`;

  return (
    <PageTransition>
      <div className="min-h-screen pb-28">
        <ShelfHeader />
        <main className="mx-auto max-w-3xl px-6">
          <SummaryCard
            scope="library"
            label="The Memoir"
            entries={allEntries}
            heading="The story so far"
          />

          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-serif text-xl text-foreground">Your Library</h2>
            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)]">
              {allEntries.length} entries
            </span>
          </div>

          <div className="mx-auto max-w-[260px]">
            <StackedVolumeCard
              to="/library"
              eyebrow="Memoir"
              title="The Memoir"
              subtitle="A complete life in volumes"
              footer={`${range} · ${years.length} ${years.length === 1 ? "year" : "years"}`}
              color="sepia"
            />
          </div>

          <p className="mt-16 text-center font-serif italic text-sm text-[color:var(--ink-tertiary)]">
            Everything here lives on your device.
          </p>
        </main>
        <BottomNav />
      </div>
    </PageTransition>
  );
}
