import { Sparkles } from "lucide-react";
import { useSummary, type SummaryScope } from "@/hooks/useSummary";
import type { Entry } from "@/data/mockEntries";

export function SummaryCard({
  scope,
  label,
  entries,
  heading,
}: {
  scope: SummaryScope;
  label: string;
  entries: Entry[];
  heading: string;
}) {
  const { summary, loading, error } = useSummary(scope, label, entries);

  return (
    <section
      className="mb-10 rounded-[14px] border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-[0_2px_0_rgba(0,0,0,0.02),0_18px_30px_-22px_rgba(40,25,10,0.25)]"
      aria-label={heading}
    >
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={14} className="text-[color:var(--sepia)]" />
        <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink-tertiary)]">
          {heading}
        </span>
      </div>
      {entries.length === 0 ? (
        <p className="font-serif italic text-[15px] text-[color:var(--ink-tertiary)]">
          No entries yet — your story begins where you choose.
        </p>
      ) : loading && !summary ? (
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-[color:var(--ink-tertiary)]/15" />
          <div className="h-3 w-11/12 animate-pulse rounded bg-[color:var(--ink-tertiary)]/15" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-[color:var(--ink-tertiary)]/15" />
        </div>
      ) : error ? (
        <p className="font-serif italic text-[15px] text-[color:var(--ink-tertiary)]">
          {error}
        </p>
      ) : (
        <p className="font-serif text-[17px] leading-[1.7] text-foreground">
          {summary}
        </p>
      )}
    </section>
  );
}