import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Entry } from "@/data/mockEntries";

export type SummaryScope = "library" | "year" | "month";

const cache = new Map<string, string>();

export function useSummary(scope: SummaryScope, label: string, entries: Entry[]) {
  const cacheKey = `${scope}:${label}:${entries.length}`;
  const [summary, setSummary] = useState<string>(() => cache.get(cacheKey) ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache.has(cacheKey)) {
      setSummary(cache.get(cacheKey)!);
      return;
    }
    if (entries.length === 0) {
      setSummary("");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    supabase.functions
      .invoke("summarize", {
        body: {
          scope,
          label,
          entries: entries.slice(0, 60).map((e) => ({
            date: e.date,
            title: e.title,
            body: e.body,
          })),
        },
      })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setError(error.message ?? "Couldn't generate summary.");
        } else if (data?.error) {
          setError(data.error);
        } else if (data?.summary) {
          cache.set(cacheKey, data.summary);
          setSummary(data.summary);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cacheKey, scope, label, entries]);

  return { summary, loading, error };
}