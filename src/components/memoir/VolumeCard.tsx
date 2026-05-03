import { Link } from "@tanstack/react-router";
import type { Volume, VolumeColor } from "@/data/mockVolumes";

const coverStyles: Record<VolumeColor, { bg: string; spine: string; ink: string; emboss: string }> = {
  sepia: {
    bg: "linear-gradient(140deg, #8a5a32 0%, #6e4422 60%, #58361c 100%)",
    spine: "rgba(0,0,0,0.35)",
    ink: "#f3e6d2",
    emboss: "rgba(255,235,200,0.12)",
  },
  slate: {
    bg: "linear-gradient(140deg, #4a5d76 0%, #38465c 60%, #2a3447 100%)",
    spine: "rgba(0,0,0,0.4)",
    ink: "#e6ecf5",
    emboss: "rgba(220,230,245,0.12)",
  },
  forest: {
    bg: "linear-gradient(140deg, #5a7350 0%, #455a3e 60%, #33442e 100%)",
    spine: "rgba(0,0,0,0.38)",
    ink: "#e9eddc",
    emboss: "rgba(230,235,210,0.12)",
  },
  cream: {
    bg: "linear-gradient(140deg, #ece2cc 0%, #ddd0b3 60%, #c9b994 100%)",
    spine: "rgba(70,50,20,0.25)",
    ink: "#3a2a18",
    emboss: "rgba(60,40,20,0.08)",
  },
};

export function VolumeCard({ volume }: { volume: Volume }) {
  const s = coverStyles[volume.color];
  return (
    <Link
      to="/entry/$entryId"
      params={{ entryId: volume.id }}
      className="group block focus:outline-none"
      aria-label={`Open ${volume.title} ${volume.subtitle}`}
    >
      <div
        className="relative aspect-[2/3] overflow-hidden rounded-[10px] transition-all duration-200 ease-out group-hover:-translate-y-0.5"
        style={{
          background: s.bg,
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.06) inset, 0 14px 24px -10px rgba(40,25,10,0.35), 4px 10px 18px -8px rgba(40,25,10,0.25)",
        }}
      >
        <div
          className="absolute inset-y-0 left-0 w-[6px]"
          style={{ background: `linear-gradient(90deg, ${s.spine} 0%, transparent 100%)` }}
        />
        <div
          className="absolute inset-3 rounded-[4px] border"
          style={{ borderColor: s.emboss }}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <div
            className="font-sans text-[10px] uppercase tracking-[0.22em]"
            style={{ color: s.ink, opacity: 0.7 }}
          >
            {volume.range}
          </div>
          <div className="space-y-1">
            <div
              className="font-serif text-2xl leading-none"
              style={{ color: s.ink, letterSpacing: "0.02em" }}
            >
              {volume.title}
            </div>
            <div
              className="font-serif italic text-sm"
              style={{ color: s.ink, opacity: 0.85 }}
            >
              {volume.subtitle}
            </div>
            <div
              className="pt-3 font-sans text-[10px] uppercase tracking-[0.2em]"
              style={{ color: s.ink, opacity: 0.55 }}
            >
              {volume.entries} entries
            </div>
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.08) 0%, transparent 35%, transparent 100%)",
          }}
        />
      </div>
    </Link>
  );
}

export function NewVolumeCard() {
  return (
    <button
      type="button"
      className="group flex aspect-[2/3] w-full items-center justify-center rounded-[10px] border border-dashed border-[color:var(--ink-tertiary)]/40 bg-transparent text-[color:var(--ink-tertiary)] transition-colors hover:border-[color:var(--sepia)] hover:text-[color:var(--sepia)]"
      aria-label="Start a new volume"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="font-serif text-3xl leading-none">+</span>
        <span className="font-sans text-[10px] uppercase tracking-[0.22em]">New Volume</span>
      </div>
    </button>
  );
}