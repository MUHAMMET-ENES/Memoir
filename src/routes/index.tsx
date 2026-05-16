import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/memoir/BottomNav";
import { PageTransition } from "@/components/memoir/PageTransition";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Memoir — Heirloom interviews with the people you love" },
      {
        name: "description",
        content:
          "Record your grandparent's life story. A warm AI interviewer asks the right questions. We bind it as a hardcover heirloom.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { user } = useAuth();

  return (
    <PageTransition>
      <main className="min-h-dvh pb-32">
        <header className="mx-auto flex max-w-3xl items-center justify-between px-6 pt-8">
          <span className="font-serif text-xl tracking-tight text-foreground">Memoir</span>
          {user ? (
            <Link to="/heirloom" className="font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--sepia)]">
              Your interviews →
            </Link>
          ) : (
            <Link to="/login" className="font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--sepia)]">
              Sign in
            </Link>
          )}
        </header>

        <section className="mx-auto mt-20 max-w-3xl px-6 sm:mt-28">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[color:var(--sepia)]" />
            <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-[color:var(--ink-tertiary)]">
              Heirloom interviews
            </span>
          </div>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-foreground sm:text-6xl">
            Record your grandparent's life story.
            <br />
            <span className="italic text-[color:var(--sepia)]">Keep it forever.</span>
          </h1>
          <p className="mt-6 max-w-xl font-serif text-[18px] leading-[1.6] text-[color:var(--ink-tertiary)]">
            A warm AI interviewer sits with someone you love and asks the questions you wish you'd
            thought to ask. We listen, transcribe every word, and bind it as a hardcover heirloom —
            in their voice.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to={user ? "/heirloom" : "/login"}
              search={user ? undefined : { redirect: "/heirloom" }}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 font-sans text-[11px] uppercase tracking-[0.28em] text-[color:var(--background)] transition-opacity hover:opacity-90"
            >
              <Mic size={14} strokeWidth={1.8} /> Begin an interview
            </Link>
            <Link
              to="/you"
              className="font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--ink-tertiary)] hover:text-foreground"
            >
              Give Memoir as a gift →
            </Link>
          </div>

          <ol className="mt-24 grid gap-10 sm:grid-cols-3">
            {[
              { n: "I", t: "Sit down together", d: "Open the app, hand them the phone. The interviewer welcomes them by name." },
              { n: "II", t: "They simply talk", d: "Gentle questions, one at a time. Their voice is recorded. Every word is kept." },
              { n: "III", t: "Bind the volume", d: "We arrange it into chapters with a literary editor's care. A hardcover heirloom for the family." },
            ].map((s) => (
              <li key={s.n}>
                <p className="font-serif italic text-[color:var(--sepia)]">{s.n}.</p>
                <h3 className="mt-2 font-serif text-xl text-foreground">{s.t}</h3>
                <p className="mt-2 font-serif text-[15px] leading-[1.6] text-[color:var(--ink-tertiary)]">{s.d}</p>
              </li>
            ))}
          </ol>

          <p className="mt-24 text-center font-serif italic text-sm text-[color:var(--ink-tertiary)]">
            "I should record my grandma before it's too late."
            <br />
            You will. Today.
          </p>
        </section>
        <BottomNav />
      </main>
    </PageTransition>
  );
}
