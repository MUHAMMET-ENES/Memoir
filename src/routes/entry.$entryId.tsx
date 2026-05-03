import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EditorTopBar } from "@/components/memoir/EditorTopBar";
import { EditorToolbar } from "@/components/memoir/EditorToolbar";
import { PageTransition } from "@/components/memoir/PageTransition";
import { getEntry } from "@/data/mockEntries";

export const Route = createFileRoute("/entry/$entryId")({
  head: () => ({
    meta: [
      { title: "Entry — Memoir" },
      { name: "description", content: "Write today's entry. Private. On-device." },
    ],
  }),
  component: EntryPage,
});

function EntryPage() {
  const { entryId } = Route.useParams();
  const initial = getEntry(entryId);
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body);

  return (
    <PageTransition>
      <div className="min-h-screen pb-28">
        <EditorTopBar weekday={initial.weekday} date={initial.date} />
        <main className="mx-auto max-w-[680px] px-6 py-10 sm:py-14">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title your day…"
            className="block w-full border-0 bg-transparent p-0 font-serif text-3xl font-medium leading-tight tracking-tight text-foreground placeholder:text-[color:var(--ink-tertiary)]/60 focus:outline-none focus:ring-0 sm:text-4xl"
            aria-label="Entry title"
          />
          <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
            {initial.weekday} · {initial.date}
          </p>
          <div className="mt-1 h-px w-12 bg-[color:var(--ink-tertiary)]/30" />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Begin where you are."
            rows={16}
            className="mt-8 block w-full resize-none border-0 bg-transparent p-0 font-serif text-[18px] leading-[1.75] text-foreground placeholder:text-[color:var(--ink-tertiary)]/60 focus:outline-none focus:ring-0"
            aria-label="Entry body"
          />
        </main>
        <EditorToolbar />
      </div>
    </PageTransition>
  );
}