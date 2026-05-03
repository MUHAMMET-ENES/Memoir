import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Cloud, HardDrive, Lock, Pencil } from "lucide-react";
import { toast } from "sonner";

import { BottomNav } from "@/components/memoir/BottomNav";
import { PageTransition } from "@/components/memoir/PageTransition";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MOCK_STATS,
  TIER_META,
  useProfile,
  type FontChoice,
  type PaperTone,
} from "@/hooks/useProfile";

export const Route = createFileRoute("/you")({
  head: () => ({
    meta: [
      { title: "You — Memoir" },
      {
        name: "description",
        content:
          "Your Memoir profile: identity, reading & writing preferences, backups, and subscription.",
      },
    ],
  }),
  component: YouPage,
});

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="px-6">
        <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--ink-tertiary)]">
          {eyebrow}
        </div>
        {title && (
          <h2 className="mt-2 font-serif text-2xl font-medium text-foreground">
            {title}
          </h2>
        )}
      </div>
      <div className="mt-4 border-y border-border bg-[color:var(--card)]/60">
        {children}
      </div>
    </section>
  );
}

function Row({
  label,
  hint,
  control,
  onClick,
  chevron,
}: {
  label: string;
  hint?: string;
  control?: React.ReactNode;
  onClick?: () => void;
  chevron?: boolean;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors first:border-t-0 border-t border-border ${
        onClick ? "hover:bg-[color:var(--paper-sunken)]/60" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="font-serif text-[15px] text-foreground">{label}</div>
        {hint && (
          <div className="mt-0.5 font-sans text-xs text-[color:var(--ink-tertiary)]">
            {hint}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 text-[color:var(--ink-tertiary)]">
        {control}
        {chevron && <ChevronRight size={16} strokeWidth={1.5} />}
      </div>
    </Tag>
  );
}

function SegButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex-1 rounded-md px-3 py-2 font-sans text-xs uppercase tracking-[0.18em] transition-all ${
        active
          ? "bg-[color:var(--sepia)]/12 text-[color:var(--sepia)] ring-1 ring-[color:var(--sepia)]/25"
          : "text-[color:var(--ink-tertiary)] hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function YouPage() {
  const { profile, update, reset } = useProfile();
  const tier = TIER_META[profile.tier];

  return (
    <PageTransition>
      <main className="relative min-h-dvh pb-32">
        {/* Header */}
        <header className="px-6 pt-16 pb-2 text-center">
          <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--ink-tertiary)]">
            You
          </div>
          <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full ring-1 ring-border"
            style={{ background: "color-mix(in oklab, var(--sepia) 14%, var(--card))" }}
          >
            <span className="font-serif text-3xl text-[color:var(--sepia)]">
              {profile.displayName.trim().charAt(0).toUpperCase() || "M"}
            </span>
          </div>
          <h1 className="mt-5 font-serif text-3xl font-medium leading-tight text-foreground">
            {profile.displayName || "Unnamed"}
          </h1>
          {profile.pronouns && (
            <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
              {profile.pronouns}
            </p>
          )}

          {/* Stats strip */}
          <div className="mx-auto mt-8 grid max-w-sm grid-cols-3 border-y border-border py-4">
            <Stat value={MOCK_STATS.totalEntries} label="Entries" />
            <Stat value={MOCK_STATS.currentStreak} label="Day streak" />
            <Stat value={MOCK_STATS.volumesPrinted} label="Volumes" />
          </div>
        </header>

        {/* Identity */}
        <Section eyebrow="Chapter I" title="Identity">
          <div className="space-y-4 px-6 py-5">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
                Display name
              </Label>
              <Input
                id="displayName"
                value={profile.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                className="border-0 border-b border-border rounded-none bg-transparent px-0 font-serif text-lg shadow-none focus-visible:ring-0 focus-visible:border-[color:var(--sepia)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pronouns" className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
                Pronouns
              </Label>
              <Input
                id="pronouns"
                value={profile.pronouns}
                onChange={(e) => update("pronouns", e.target.value)}
                placeholder="e.g. she/her"
                className="border-0 border-b border-border rounded-none bg-transparent px-0 font-serif text-lg shadow-none focus-visible:ring-0 focus-visible:border-[color:var(--sepia)]"
              />
            </div>
            <button
              onClick={() => toast("Avatar editing coming soon")}
              className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--sepia)] hover:underline"
            >
              <Pencil size={13} strokeWidth={1.6} /> Edit avatar
            </button>
          </div>
        </Section>

        {/* Reading & writing */}
        <Section eyebrow="Chapter II" title="Reading & Writing">
          <Row
            label="Typeface"
            hint="The voice of your pages."
            control={
              <div className="flex w-44 gap-1 rounded-md bg-[color:var(--paper-sunken)] p-1">
                {(["serif", "sans"] as FontChoice[]).map((f) => (
                  <SegButton
                    key={f}
                    active={profile.font === f}
                    onClick={() => update("font", f)}
                  >
                    {f === "serif" ? "Serif" : "Sans"}
                  </SegButton>
                ))}
              </div>
            }
          />
          <Row
            label="Text size"
            hint={`${profile.textSize}pt`}
            control={
              <div className="w-40">
                <Slider
                  value={[profile.textSize]}
                  min={14}
                  max={22}
                  step={1}
                  onValueChange={(v) => update("textSize", v[0] ?? 17)}
                />
              </div>
            }
          />
          <Row
            label="Paper tone"
            hint="The mood of your room."
            control={
              <div className="flex w-56 gap-1 rounded-md bg-[color:var(--paper-sunken)] p-1">
                {(["study", "dim", "night"] as PaperTone[]).map((p) => (
                  <SegButton
                    key={p}
                    active={profile.paperTone === p}
                    onClick={() => update("paperTone", p)}
                  >
                    {p}
                  </SegButton>
                ))}
              </div>
            }
          />
          <Row
            label="Daily reminder"
            hint={profile.reminderTime ? `Nudges you at ${profile.reminderTime}` : "Off"}
            control={
              <input
                type="time"
                value={profile.reminderTime}
                onChange={(e) => update("reminderTime", e.target.value)}
                className="bg-transparent font-serif text-base text-foreground focus:outline-none"
              />
            }
          />
        </Section>

        {/* Privacy & Backup */}
        <Section eyebrow="Chapter III" title="Privacy & Backup">
          <Row
            label="App lock"
            hint="Require Face ID or passcode to open Memoir."
            control={
              <div className="flex items-center gap-2">
                <Lock size={15} strokeWidth={1.4} />
                <Switch
                  checked={profile.appLock}
                  onCheckedChange={(v) => update("appLock", v)}
                />
              </div>
            }
          />
          <Row
            label="iCloud backup"
            hint="Encrypted, end-to-end. Syncs across your devices."
            control={
              <div className="flex items-center gap-2">
                <Cloud size={15} strokeWidth={1.4} />
                <Switch
                  checked={profile.iCloudBackup}
                  onCheckedChange={(v) => update("iCloudBackup", v)}
                />
              </div>
            }
          />
          <Row
            label="Local backup"
            hint="Keep an encrypted copy on this device."
            control={
              <div className="flex items-center gap-2">
                <HardDrive size={15} strokeWidth={1.4} />
                <Switch
                  checked={profile.localBackup}
                  onCheckedChange={(v) => update("localBackup", v)}
                />
              </div>
            }
          />
          <Row
            label="Export your journal"
            hint="Download a PDF of every page."
            chevron
            onClick={() => toast.success("Preparing your export…")}
          />
          <Row
            label="Delete all entries"
            hint="This cannot be undone."
            chevron
            onClick={() =>
              toast("Are you sure?", {
                description: "This will permanently delete every entry.",
                action: {
                  label: "Delete",
                  onClick: () => toast.success("All entries removed."),
                },
              })
            }
          />
        </Section>

        {/* Subscription */}
        <Section eyebrow="Chapter IV" title="Subscription">
          <div className="px-6 py-5">
            <div className="rounded-lg border border-border bg-[color:var(--card)] p-5 shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(120,80,40,0.18)]">
              <div className="font-sans text-[10px] uppercase tracking-[0.35em] text-[color:var(--sepia)]">
                Current plan
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-3">
                <h3 className="font-serif text-2xl font-medium text-foreground">
                  {tier.label}
                </h3>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[color:var(--ink-tertiary)]">
                  {profile.tier === "free" ? "Free" : "Active"}
                </span>
              </div>
              <p className="mt-1 font-serif italic text-sm text-[color:var(--ink-tertiary)]">
                {tier.tagline}
              </p>
              <button
                onClick={() => toast("Plans coming soon")}
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--background)] transition-opacity hover:opacity-90"
              >
                {profile.tier === "free" ? "Upgrade" : "Manage plan"}
              </button>
            </div>
          </div>
        </Section>

        {/* About */}
        <Section eyebrow="Colophon" title="About">
          <Row label="Privacy policy" chevron onClick={() => toast("Opening privacy policy…")} />
          <Row label="Terms of service" chevron onClick={() => toast("Opening terms…")} />
          <Row label="Support" hint="hello@memoir.app" chevron onClick={() => toast("Opening support…")} />
          <Row label="Version" hint="1.0.0 · Build 2026.05" />
          <Row
            label="Reset to defaults"
            hint="Restore the original Memoir settings."
            chevron
            onClick={() => {
              reset();
              toast.success("Settings restored.");
            }}
          />
        </Section>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--ink-tertiary)] hover:text-foreground"
          >
            ← Back to the shelf
          </Link>
        </div>

        <BottomNav />
      </main>
    </PageTransition>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="font-serif text-2xl text-foreground">{value}</div>
      <div className="mt-1 font-sans text-[9px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
        {label}
      </div>
    </div>
  );
}