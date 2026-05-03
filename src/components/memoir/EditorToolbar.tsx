import { ImagePlus, Mic, MapPin, MoreHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

function ToolButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      onClick={() => toast(`${label} — coming soon`)}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[color:var(--ink-tertiary)] transition-colors hover:bg-[color:var(--paper-sunken)] hover:text-foreground"
    >
      <Icon size={20} strokeWidth={1.5} />
    </button>
  );
}

export function EditorToolbar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-[color:var(--card)]/85 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-3">
        <div className="flex items-center gap-1">
          <ToolButton icon={ImagePlus} label="Add photo" />
          <ToolButton icon={Mic} label="Voice note" />
          <ToolButton icon={MapPin} label="Add location" />
        </div>
        <ToolButton icon={MoreHorizontal} label="More" />
      </div>
    </div>
  );
}