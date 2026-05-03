import { createFileRoute } from "@tanstack/react-router";
import { ShelfHeader } from "@/components/memoir/ShelfHeader";
import { BottomNav } from "@/components/memoir/BottomNav";
import { VolumeCard, NewVolumeCard } from "@/components/memoir/VolumeCard";
import { PageTransition } from "@/components/memoir/PageTransition";
import { mockVolumes } from "@/data/mockVolumes";

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
  return (
    <PageTransition>
      <div className="min-h-screen pb-28">
        <ShelfHeader />
        <main className="mx-auto max-w-5xl px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-serif text-xl text-foreground">Your Shelf</h2>
            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)]">
              {mockVolumes.length} volumes
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {mockVolumes.map((v) => (
              <VolumeCard key={v.id} volume={v} />
            ))}
            <NewVolumeCard />
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
