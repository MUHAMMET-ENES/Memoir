import { BookOpen, PenLine, Search, User } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-[color:var(--card)]/85 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2">
        <li className="flex-1">
          <Link
            to="/"
            className="group flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-3 py-2"
          >
            <BookOpen size={22} strokeWidth={1.5} className="text-foreground" />
            <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-foreground">
              Shelf
            </span>
            <span className="h-1 w-1 rounded-full bg-[color:var(--sepia)]" aria-hidden />
          </Link>
        </li>
        <li className="flex-1">
          <Link
            to="/entry/$entryId"
            params={{ entryId: "default" }}
            className="group flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-3 py-2"
          >
            <PenLine
              size={22}
              strokeWidth={1.5}
              className="text-[color:var(--ink-tertiary)] group-hover:text-foreground"
            />
            <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)]">
              Write
            </span>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            to="/"
            className="group flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-3 py-2"
          >
            <Search
              size={22}
              strokeWidth={1.5}
              className="text-[color:var(--ink-tertiary)] group-hover:text-foreground"
            />
            <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)]">
              Search
            </span>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            to="/"
            className="group flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-3 py-2"
          >
            <User
              size={22}
              strokeWidth={1.5}
              className="text-[color:var(--ink-tertiary)] group-hover:text-foreground"
            />
            <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)]">
              You
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}