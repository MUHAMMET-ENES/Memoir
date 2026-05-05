import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon, X, BookOpen, FileText } from "lucide-react";

import { BottomNav } from "@/components/memoir/BottomNav";
import { PageTransition } from "@/components/memoir/PageTransition";
import { mockEntries } from "@/data/mockEntries";
import { mockVolumes } from "@/data/mockVolumes";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Memoir" },
      {
        name: "description",
        content:
          "Search across your volumes and entries — find a moment, a person, a place.",
      },
    ],
  }),
  component: SearchPage,
});

const SUGGESTIONS = [
  "mornings",
  "father",
  "river",
  "coffee",
  "books",
  "light",
];

type EntryHit = {
  kind: "entry";
  id: string;
  title: string;
  date: string;
  snippet: string;
};

type VolumeHit = {
  kind: "volume";
  id: string;
  title: string;
  subtitle: string;
  range: string;
  entries: number;
};

type Hit = EntryHit | VolumeHit;

function makeSnippet(body: string, query: string): string {
  const idx = body.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return body.slice(0, 140) + (body.length > 140 ? "…" : "");
  const start = Math.max(0, idx - 50);
  const end = Math.min(body.length, idx + query.length + 90);
  return (start > 0 ? "…" : "") + body.slice(start, end) + (end < body.length ? "…" : "");
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        className="rounded-sm bg-[color:var(--sepia)]/15 px-0.5 text-[color:var(--sepia)]"
      >
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const hits: Hit[] = useMemo(() => {
    if (!trimmed) return [];
    const q = trimmed.toLowerCase();

    const entryHits: Hit[] = Object.values(mockEntries)
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.body.toLowerCase().includes(q),
      )
      .map((e) => ({
        kind: "entry",
        id: e.id,
        title: e.title,
        date: e.date,
        snippet: makeSnippet(e.body, trimmed),
      }));

    const volumeHits: Hit[] = mockVolumes
      .filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.subtitle.toLowerCase().includes(q) ||
          v.range.toLowerCase().includes(q),
      )
      .map((v) => ({
        kind: "volume",
        id: v.id,
        title: `${v.title} — ${v.subtitle}`,
        subtitle: v.subtitle,
        range: v.range,
        entries: v.entries,
      }));

    return [...entryHits, ...volumeHits];
  }, [trimmed]);

  return (
    <PageTransition>
      <div className="min-h-screen pb-28">
        <header className="px-6 pt-16 pb-6 text-center">
          <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--ink-tertiary)]">
            Search
          </div>
          <h1 className="mt-4 font-serif text-3xl font-medium leading-tight text-foreground sm:text-4xl">
            Find a <span className="italic">moment</span>.
          </h1>
          <p className="mt-3 font-serif italic text-sm text-[color:var(--ink-tertiary)]">
            A word, a person, a place — search your whole shelf.
          </p>
        </header>

        <main className="mx-auto max-w-2xl px-6">
          <div className="relative">
            <SearchIcon
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--ink-tertiary)]"
            />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search entries and volumes…"
              className="h-12 w-full rounded-[10px] border border-border bg-[color:var(--card)] pl-11 pr-10 font-serif text-base text-foreground placeholder:text-[color:var(--ink-tertiary)] focus:border-[color:var(--sepia)]/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--sepia)]/15"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[color:var(--ink-tertiary)] hover:bg-[color:var(--paper-sunken)] hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {!trimmed && (
            <section className="mt-10">
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
                Try
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-border bg-[color:var(--card)] px-3 py-1.5 font-serif text-sm italic text-foreground hover:border-[color:var(--sepia)]/40 hover:text-[color:var(--sepia)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-12 text-center font-serif italic text-sm text-[color:var(--ink-tertiary)]">
                Everything stays on your device.
              </p>
            </section>
          )}

          {trimmed && (
            <section className="mt-8">
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
                {hits.length === 0
                  ? "No matches"
                  : `${hits.length} result${hits.length === 1 ? "" : "s"}`}
              </p>

              {hits.length === 0 ? (
                <p className="mt-6 font-serif italic text-base text-[color:var(--ink-tertiary)]">
                  Nothing on the shelf for “{trimmed}” yet.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-border overflow-hidden rounded-[10px] border border-border bg-[color:var(--card)]">
                  {hits.map((h) =>
                    h.kind === "entry" ? (
                      <li key={`entry-${h.id}`}>
                        <Link
                          to="/entry/$entryId"
                          params={{ entryId: h.id }}
                          className="group flex gap-3 px-4 py-4 hover:bg-[color:var(--paper-sunken)]/60"
                        >
                          <FileText
                            size={18}
                            className="mt-1 shrink-0 text-[color:var(--ink-tertiary)] group-hover:text-[color:var(--sepia)]"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-3">
                              <h3 className="truncate font-serif text-base text-foreground">
                                {highlight(h.title, trimmed)}
                              </h3>
                              <span className="shrink-0 font-sans text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)]">
                                {h.date}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 font-serif text-sm leading-relaxed text-[color:var(--ink-secondary)]">
                              {highlight(h.snippet, trimmed)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ) : (
                      <li key={`vol-${h.id}`}>
                        <Link
                          to="/entry/$entryId"
                          params={{ entryId: h.id }}
                          className="group flex gap-3 px-4 py-4 hover:bg-[color:var(--paper-sunken)]/60"
                        >
                          <BookOpen
                            size={18}
                            className="mt-1 shrink-0 text-[color:var(--ink-tertiary)] group-hover:text-[color:var(--sepia)]"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-3">
                              <h3 className="truncate font-serif text-base text-foreground">
                                {highlight(h.title, trimmed)}
                              </h3>
                              <span className="shrink-0 font-sans text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)]">
                                {h.range}
                              </span>
                            </div>
                            <p className="mt-1 font-serif text-sm italic text-[color:var(--ink-tertiary)]">
                              {h.entries} entries
                            </p>
                          </div>
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </section>
          )}
        </main>

        <BottomNav />
      </div>
    </PageTransition>
  );
}