import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTransition } from "@/components/memoir/PageTransition";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Memoir" },
      { name: "description", content: "How Memoir handles your data and family stories." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageTransition>
      <article className="mx-auto max-w-2xl px-6 py-16 pb-24">
        <Link
          to="/you"
          className="font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground"
        >
          ← Back
        </Link>
        <h1 className="mt-8 font-serif text-4xl text-foreground">Privacy Policy</h1>
        <p className="mt-2 font-sans text-xs text-[color:var(--ink-tertiary)]">Last updated: May 2026</p>

        <div className="mt-10 space-y-6 font-serif text-[15px] leading-relaxed text-foreground">
          <section>
            <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
              What we collect
            </h2>
            <p className="mt-2 text-[color:var(--ink-tertiary)]">
              When you use Memoir, we store your account email, interview transcripts, optional voice
              recordings, and bound volumes in Supabase (cloud). AI processing for interviews runs
              through our AI provider to generate questions and bind volumes. We do not sell your
              data.
            </p>
          </section>
          <section>
            <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
              Sharing
            </h2>
            <p className="mt-2 text-[color:var(--ink-tertiary)]">
              Volumes are private by default. If you enable a public share link, anyone with the link
              can read that bound volume. Audio for public volumes may be accessible via signed URLs.
            </p>
          </section>
          <section>
            <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
              Payments
            </h2>
            <p className="mt-2 text-[color:var(--ink-tertiary)]">
              Subscriptions and print orders are processed by Stripe (web) or Apple (iOS). We receive
              purchase status, not full payment card numbers.
            </p>
          </section>
          <section>
            <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
              Deletion
            </h2>
            <p className="mt-2 text-[color:var(--ink-tertiary)]">
              You can delete your account from Settings. This removes your profile, interviews, audio,
              and associated data from our servers.
            </p>
          </section>
          <section>
            <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
              Contact
            </h2>
            <p className="mt-2 text-[color:var(--ink-tertiary)]">
              Questions:{" "}
              <a href="mailto:hello@memoir.app" className="text-[color:var(--sepia)] underline">
                hello@memoir.app
              </a>
            </p>
          </section>
        </div>
      </article>
    </PageTransition>
  );
}
