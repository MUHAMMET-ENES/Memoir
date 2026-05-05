import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type Color = "sepia" | "slate" | "forest" | "cream";

const styles: Record<Color, { bg: string; spine: string; ink: string; emboss: string }> = {
  sepia: {
    bg: "linear-gradient(140deg, #8a5a32 0%, #6e4422 60%, #58361c 100%)",
    spine: "rgba(0,0,0,0.35)", ink: "#f3e6d2", emboss: "rgba(255,235,200,0.12)",
  },
  slate: {
    bg: "linear-gradient(140deg, #4a5d76 0%, #38465c 60%, #2a3447 100%)",
    spine: "rgba(0,0,0,0.4)", ink: "#e6ecf5", emboss: "rgba(220,230,245,0.12)",
  },
  forest: {
    bg: "linear-gradient(140deg, #5a7350 0%, #455a3e 60%, #33442e 100%)",
    spine: "rgba(0,0,0,0.38)", ink: "#e9eddc", emboss: "rgba(230,235,210,0.12)",
  },
  cream: {
    bg: "linear-gradient(140deg, #ece2cc 0%, #ddd0b3 60%, #c9b994 100%)",
    spine: "rgba(70,50,20,0.25)", ink: "#3a2a18", emboss: "rgba(60,40,20,0.08)",
  },
};

export function StackedVolumeCard(props: {
  to: string;
  params?: Record<string, string>;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  footer?: string;
  color?: Color;
  children?: ReactNode;
}) {
  const { to, params, eyebrow, title, subtitle, footer, color = "sepia" } = props;
  const s = styles[color];
  return (
    <Link
      to={to}
      params={params as never}
      className="group block focus:outline-none"
      aria-label={title}
    >
      <div
        className="relative aspect-[2/3] overflow-hidden rounded-[10px] transition-all duration-200 ease-out group-hover:-translate-y-0.5"
        style={{
          background: s.bg,
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.06) inset, 0 14px 24px -10px rgba(40,25,10,0.35), 4px 10px 18px -8px rgba(40,25,10,0.25)",
        }}
      >
        <div
          className="absolute inset-y-0 left-0 w-[6px]"
          style={{ background: `linear-gradient(90deg, ${s.spine} 0%, transparent 100%)` }}
        />
        <div className="absolute inset-3 rounded-[4px] border" style={{ borderColor: s.emboss }} />
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          {eyebrow ? (
            <div
              className="font-sans text-[10px] uppercase tracking-[0.22em]"
              style={{ color: s.ink, opacity: 0.7 }}
            >
              {eyebrow}
            </div>
          ) : <div />}
          <div className="space-y-1">
            <div className="font-serif text-2xl leading-none" style={{ color: s.ink, letterSpacing: "0.02em" }}>
              {title}
            </div>
            {subtitle ? (
              <div className="font-serif italic text-sm" style={{ color: s.ink, opacity: 0.85 }}>
                {subtitle}
              </div>
            ) : null}
            {footer ? (
              <div
                className="pt-3 font-sans text-[10px] uppercase tracking-[0.2em]"
                style={{ color: s.ink, opacity: 0.55 }}
              >
                {footer}
              </div>
            ) : null}
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.08) 0%, transparent 35%, transparent 100%)" }}
        />
      </div>
    </Link>
  );
}

export const VOLUME_COLORS: Color[] = ["sepia", "slate", "forest", "cream"];