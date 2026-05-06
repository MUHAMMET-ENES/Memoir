import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Mic, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { BottomNav } from "@/components/memoir/BottomNav";
import { PageTransition } from "@/components/memoir/PageTransition";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInterviews } from "@/hooks/useInterviews";

export const Route = createFileRoute("/heirloom/")({
  head: () => ({
    meta: [
      { title: "Heirloom Interviews — Memoir" },
      {
        name: "description",
        content:
          "Record an AI-guided oral history with someone you love. Transcribed and bound as a volume in your memoir.",
      },
    ],
  }),
  component: HeirloomIndex,
});

const RELATIONS = ["grandmother", "grandfather", "mother", "father", "aunt", "uncle", "friend", "mentor"];
const THEMES = [
  "Childhood",
  "Falling in love",
  "The hardest year",
  "Your hands & your work",
  "A house I'll never forget",
  "Becoming a parent",
];

function HeirloomIndex() {
  const { interviews, create, remove } = useInterviews();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("grandmother");
  const [theme, setTheme] = useState(THEMES[0]);
  const [customTheme, setCustomTheme] = useState("");

  const begin = () => {
    if (!name.trim()) {
      toast("Tell us their name first.");
      return;
    }
    const finalTheme = customTheme.trim() || theme;
    const id = create({
      subjectName: name.trim(),
      relation,
      theme: finalTheme,
      title: `${name.trim()} on ${finalTheme.toLowerCase()}`,
    });
    navigate({ to: "/heirloom/$interviewId", params: { interviewId: id } });
  };

  return (
    <PageTransition>
      <main className="min-h-dvh pb-32">
        <header className="mx-auto max-w-2xl px-6 pt-10">
          <Link
            to="/library"
            className="inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground"
          >
            <ChevronLeft size={14} /> Library
          </Link>
          <div className="mt-8 flex items-center gap-2">
            <Sparkles size={14} className="text-[color:var(--sepia)]" />
            <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-[color:var(--ink-tertiary)]">
              Heirloom interviews
            </span>
          </div>
          <h1 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">
            A conversation, kept forever.
          </h1>
          <p className="mt-3 max-w-lg font-serif italic text-[15px] leading-relaxed text-[color:var(--ink-tertiary)]">
            Sit down with someone you love. A gentle interviewer asks the questions
            you wish you'd thought to ask. We listen, transcribe every word, and
            bind it into a volume in your memoir.
          </p>
        </header>

        <section className="mx-auto mt-10 max-w-2xl px-6">
          <div className="rounded-[14px] border border-border bg-[color:var(--card)] p-6 shadow-[0_2px_0_rgba(0,0,0,0.02),0_18px_30px_-22px_rgba(40,25,10,0.25)]">
            <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
              Begin a new interview
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-sans text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink-tertiary)]">
                  Their name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grandma Rose"
                  className="border-0 border-b border-border rounded-none bg-transparent px-0 font-serif text-lg shadow-none focus-visible:ring-0 focus-visible:border-[color:var(--sepia)]"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-sans text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink-tertiary)]">
                  Relation
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {RELATIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRelation(r)}
                      className={`rounded-full px-3 py-1 font-sans text-[11px] tracking-wide transition-all ${
                        relation === r
                          ? "bg-[color:var(--sepia)]/12 text-[color:var(--sepia)] ring-1 ring-[color:var(--sepia)]/30"
                          : "text-[color:var(--ink-tertiary)] hover:text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Label className="font-sans text-[10px] uppercase tracking-[0.28em] text-[color:var(--ink-tertiary)]">
                Today's theme
              </Label>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTheme(t);
                      setCustomTheme("");
                    }}
                    className={`rounded-md border px-3 py-1.5 font-serif text-sm transition-all ${
                      theme === t && !customTheme
                        ? "border-[color:var(--sepia)] bg-[color:var(--sepia)]/8 text-foreground"
                        : "border-border text-[color:var(--ink-tertiary)] hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <Textarea
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                placeholder="Or write your own theme — 'the summer we moved to Lisbon'…"
                rows={2}
                className="resize-none border-border bg-transparent font-serif text-sm shadow-none focus-visible:ring-0 focus-visible:border-[color:var(--sepia)]"
              />
            </div>

            <button
              onClick={begin}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--background)] transition-opacity hover:opacity-90"
            >
              <Mic size={13} strokeWidth={1.8} /> Begin the interview
            </button>
          </div>
        </section>

        {interviews.length > 0 && (
          <section className="mx-auto mt-12 max-w-2xl px-6">
            <h2 className="font-serif text-xl text-foreground">Past interviews</h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {interviews.map((iv) => (
                <li key={iv.id} className="flex items-center justify-between gap-3 py-4">
                  <Link
                    to={
                      iv.status === "bound"
                        ? "/heirloom/$interviewId/bound"
                        : "/heirloom/$interviewId"
                    }
                    params={{ interviewId: iv.id }}
                    className="min-w-0 flex-1"
                  >
                    <div className="font-serif text-base text-foreground">
                      {iv.title}
                    </div>
                    <div className="mt-0.5 font-sans text-[10px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)]">
                      {new Date(iv.createdAt).toLocaleDateString()} ·{" "}
                      {iv.status === "bound"
                        ? "Bound volume"
                        : `${iv.turns.length} turns`}
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      remove(iv.id);
                      toast.success("Interview removed.");
                    }}
                    className="rounded-md p-2 text-[color:var(--ink-tertiary)] hover:text-[color:var(--vermilion)]"
                    aria-label="Delete"
                  >
                    <Trash2 size={15} strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <BottomNav />
      </main>
    </PageTransition>
  );
}