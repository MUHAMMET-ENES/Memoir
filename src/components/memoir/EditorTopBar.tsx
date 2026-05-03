import { ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function EditorTopBar({ weekday, date }: { weekday: string; date: string }) {
  return (
    <header
      className="sticky top-0 z-20 border-b border-transparent bg-background/80 backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-3">
        <Link
          to="/"
          className="inline-flex h-11 min-w-11 items-center gap-1 rounded-md px-2 text-[color:var(--ink-tertiary)] transition-colors hover:text-foreground"
          aria-label="Back to shelf"
        >
          <ChevronLeft size={20} strokeWidth={1.75} />
          <span className="hidden font-sans text-sm sm:inline">Shelf</span>
        </Link>
        <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink-tertiary)]">
          {weekday} · {date}
        </div>
        <button
          type="button"
          className="inline-flex h-11 min-w-11 items-center justify-center rounded-md px-3 font-sans text-sm font-medium text-[color:var(--sepia)] transition-colors hover:text-[color:var(--vermilion)]"
        >
          Save
        </button>
      </div>
    </header>
  );
}