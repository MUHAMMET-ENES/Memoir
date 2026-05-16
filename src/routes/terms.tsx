import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTransition } from "@/components/memoir/PageTransition";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Memoir" },
      { name: "description", content: "Terms for using Memoir heirloom interviews." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageTransition>
      <article className="mx-auto max-w-2xl px-6 py-16 pb-24">
        <Link
          to="/you"
          className="font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground"
        >
          ← Back
        </Link>
        <h1 className="mt-8 font-serif text-4xl text-foreground">Terms of Service</h1>
        <p className="mt-2 font-sans text-xs text-[color:var(--ink-tertiary)]">Last updated: May 2026</p>

        <div className="mt-10 space-y-6 font-serif text-[15px] leading-relaxed text-foreground">
          <section>
            <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
              Service
            </h2>
            <p className="mt-2 text-[color:var(--ink-tertiary)]">
              Memoir provides AI-guided family interviews and bound digital volumes. You are responsible
              for obtaining consent from anyone you record.
            </p>
          </section>
          <section>
            <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
              Subscriptions
            </h2>
            <p className="mt-2 text-[color:var(--ink-tertiary)]">
              Memoir Plus renews automatically until cancelled. Manage subscriptions in your App Store
              account (iOS) or Stripe customer portal (web). Refunds follow Apple and Stripe policies.
            </p>
          </section>
          <section>
            <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
              Content
            </h2>
            <p className="mt-2 text-[color:var(--ink-tertiary)]">
              You retain rights to your stories. You grant Memoir a license to host, process, and
              display content as needed to provide the service (including optional public share links).
            </p>
          </section>
          <section>
            <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
              Contact
            </h2>
            <p className="mt-2 text-[color:var(--ink-tertiary)]">
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
