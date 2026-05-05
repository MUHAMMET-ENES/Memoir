import { BookOpen, PenLine, Search, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

type NavItem = {
  label: string;
  icon: LucideIcon;
  to: string;
  params?: Record<string, string>;
  match: (pathname: string) => boolean;
};

const items: NavItem[] = [
  {
    label: "Shelf",
    icon: BookOpen,
    to: "/",
    match: (p) => p === "/",
  },
  {
    label: "Write",
    icon: PenLine,
    to: "/entry/$entryId",
    params: { entryId: "default" },
    match: (p) => p.startsWith("/entry"),
  },
  {
    label: "Search",
    icon: Search,
    to: "/search",
    match: (p) => p === "/search",
  },
  {
    label: "You",
    icon: User,
    to: "/you",
    match: (p) => p.startsWith("/you"),
  },
];

export type BottomNavTheme = "paper" | "dim";

const themes: Record<
  BottomNavTheme,
  {
    bar: string;
    inactiveText: string;
    activeText: string;
    activeIcon: string;
    activeBgHalo: string;
    dot: string;
  }
> = {
  // Default — for cream paper background (#F9F9F7).
  // Active gets a warm sepia wash + sepia dot so the indicator reads against light paper.
  paper: {
    bar: "border-border bg-[color:var(--card)]/85",
    inactiveText: "text-[color:var(--ink-tertiary)]",
    activeText: "text-[color:var(--sepia)]",
    activeIcon: "text-[color:var(--sepia)]",
    activeBgHalo:
      "bg-[color:var(--sepia)]/10 ring-1 ring-[color:var(--sepia)]/15",
    dot: "bg-[color:var(--sepia)]",
  },
  // Dim paper — slightly darker bar, warmer accent (vermilion) for stronger glow.
  dim: {
    bar: "border-[color:var(--ink-tertiary)]/25 bg-[color:var(--paper-sunken)]/90",
    inactiveText: "text-[color:var(--ink-tertiary)]",
    activeText: "text-[color:var(--vermilion)]",
    activeIcon: "text-[color:var(--vermilion)]",
    activeBgHalo:
      "bg-[color:var(--vermilion)]/10 ring-1 ring-[color:var(--vermilion)]/20",
    dot: "bg-[color:var(--vermilion)]",
  },
};

export function BottomNav({ theme = "paper" }: { theme?: BottomNavTheme } = {}) {
  const { pathname } = useLocation();
  const t = themes[theme];

  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur-md ${t.bar}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2">
        {items.map(({ label, icon: Icon, to, params, match }) => {
          const active = match(pathname);
          return (
            <li key={label} className="flex-1">
              <Link
                to={to}
                params={params as never}
                aria-current={active ? "page" : undefined}
                className="group relative flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-3 py-2"
              >
                {/* Warm halo behind the active item */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-1/2 top-1/2 h-12 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 ${
                    active ? `opacity-100 ${t.activeBgHalo}` : "opacity-0"
                  }`}
                />
                <Icon
                  size={22}
                  strokeWidth={active ? 1.85 : 1.5}
                  className={`relative transition-all duration-200 ${
                    active
                      ? `${t.activeIcon} -translate-y-0.5`
                      : `${t.inactiveText} group-hover:text-foreground`
                  }`}
                />
                <span
                  className={`relative font-sans text-[9px] uppercase tracking-[0.22em] transition-colors ${
                    active
                      ? t.activeText
                      : `${t.inactiveText} group-hover:text-foreground`
                  }`}
                >
                  {label}
                </span>
                <span
                  aria-hidden
                  className={`relative h-1 w-1 rounded-full transition-all duration-200 ${t.dot} ${
                    active ? "opacity-100 scale-100" : "opacity-0 scale-50"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}