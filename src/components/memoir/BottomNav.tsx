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
    to: "/",
    match: (p) => p === "/search",
  },
  {
    label: "You",
    icon: User,
    to: "/",
    match: (p) => p === "/you",
  },
];

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-[color:var(--card)]/85 backdrop-blur-md"
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
                <Icon
                  size={22}
                  strokeWidth={active ? 1.85 : 1.5}
                  className={
                    active
                      ? "text-foreground transition-transform duration-200 -translate-y-0.5"
                      : "text-[color:var(--ink-tertiary)] transition-colors group-hover:text-foreground"
                  }
                />
                <span
                  className={`font-sans text-[9px] uppercase tracking-[0.22em] transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-[color:var(--ink-tertiary)] group-hover:text-foreground"
                  }`}
                >
                  {label}
                </span>
                <span
                  aria-hidden
                  className={`h-1 w-1 rounded-full transition-all duration-200 ${
                    active
                      ? "bg-[color:var(--sepia)] opacity-100 scale-100"
                      : "bg-[color:var(--sepia)] opacity-0 scale-50"
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