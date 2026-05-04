import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, MapPin, Mic, Pause, Play, Square, X } from "lucide-react";
import { toast } from "sonner";

export type PhotoAttachment = {
  id: string;
  kind: "photo";
  url: string;
  name: string;
};

export type VoiceAttachment = {
  id: string;
  kind: "voice";
  url: string;
  durationSec: number;
};

export type LocationAttachment = {
  id: string;
  kind: "location";
  label: string;
  latitude: number;
  longitude: number;
};

export type Attachment = PhotoAttachment | VoiceAttachment | LocationAttachment;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(blob);
  });
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ---------------- Voice recorder ---------------- */

function VoiceRecorder({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (a: VoiceAttachment) => void;
}) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef<number>(0);
  const tickRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<"idle" | "recording" | "review">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDuration, setPreviewDuration] = useState(0);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (!open) {
      stopAll();
      setPhase("idle");
      setElapsed(0);
      setPreviewUrl(null);
      setPreviewBlob(null);
      setPreviewDuration(0);
    }
    return () => stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function stopAll() {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      try {
        recorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function startRecording() {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast("This device can't record audio in the browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setPreviewBlob(blob);
        setPreviewUrl(url);
        setPreviewDuration(elapsed);
        setPhase("review");
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      recorderRef.current = recorder;
      recorder.start();
      startedAtRef.current = Date.now();
      setElapsed(0);
      setPhase("recording");
      tickRef.current = window.setInterval(() => {
        setElapsed((Date.now() - startedAtRef.current) / 1000);
      }, 250);
    } catch (err) {
      console.error(err);
      toast("Microphone permission was declined.");
    }
  }

  function stopRecording() {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    recorderRef.current?.stop();
  }

  async function commit() {
    if (!previewBlob) return;
    const url = await blobToDataUrl(previewBlob);
    onSave({
      id: uid(),
      kind: "voice",
      url,
      durationSec: Math.max(1, Math.round(previewDuration)),
    });
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl border border-border bg-[color:var(--card)] p-6 shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--ink-tertiary)]">
            Voice note
          </div>
          <button
            onClick={onClose}
            className="text-[color:var(--ink-tertiary)] hover:text-foreground"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="font-serif text-5xl tabular-nums text-foreground">
            {formatDuration(phase === "review" ? previewDuration : elapsed)}
          </div>
          <div className="mt-2 font-serif italic text-sm text-[color:var(--ink-tertiary)]">
            {phase === "idle" && "Press to begin."}
            {phase === "recording" && "Listening…"}
            {phase === "review" && "Take a listen."}
          </div>

          {phase === "review" && previewUrl && (
            <audio src={previewUrl} controls className="mt-6 w-full" />
          )}

          <div className="mt-8 flex items-center gap-4">
            {phase === "idle" && (
              <button
                onClick={startRecording}
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--vermilion)] text-white shadow-lg transition-transform active:scale-95"
                aria-label="Start recording"
              >
                <Mic size={22} strokeWidth={1.75} />
              </button>
            )}
            {phase === "recording" && (
              <button
                onClick={stopRecording}
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-[color:var(--background)] shadow-lg transition-transform active:scale-95"
                aria-label="Stop recording"
              >
                <Square size={20} strokeWidth={1.75} />
              </button>
            )}
            {phase === "review" && (
              <>
                <button
                  onClick={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    setPreviewBlob(null);
                    setPreviewDuration(0);
                    setElapsed(0);
                    setPhase("idle");
                  }}
                  className="rounded-md border border-border px-4 py-2 font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--ink-tertiary)] hover:text-foreground"
                >
                  Re-record
                </button>
                <button
                  onClick={commit}
                  className="rounded-md bg-foreground px-4 py-2 font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--background)]"
                >
                  Save note
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Voice player chip ---------------- */

function VoiceChip({
  attachment,
  onRemove,
}: {
  attachment: VoiceAttachment;
  onRemove: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(attachment.url);
      audioRef.current.onended = () => setPlaying(false);
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [attachment.url]);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  return (
    <div className="group flex items-center gap-3 rounded-md border border-border bg-[color:var(--card)] px-3 py-2">
      <button
        onClick={toggle}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--sepia)]/12 text-[color:var(--sepia)]"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className="flex flex-col">
        <span className="font-serif text-sm text-foreground">Voice note</span>
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[color:var(--ink-tertiary)]">
          {formatDuration(attachment.durationSec)}
        </span>
      </div>
      <button
        onClick={onRemove}
        className="ml-2 text-[color:var(--ink-tertiary)] opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
        aria-label="Remove voice note"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/* ---------------- Main attachments component ---------------- */

export type AttachmentActions = {
  pickPhoto: () => void;
  recordVoice: () => void;
  pinLocation: () => void;
  /** Hidden file input + voice recorder modal. Render once near the editor. */
  portal: React.ReactNode;
};

/**
 * Owns the photo file input + voice recorder modal and exposes triggers.
 * Multiple UI surfaces (inline buttons, bottom toolbar) call the same triggers.
 */
export function useAttachmentActions({
  attachments,
  setAttachments,
}: {
  attachments: Attachment[];
  setAttachments: (next: Attachment[]) => void;
}): AttachmentActions {
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Use a ref so callbacks stay stable across renders.
  const attachmentsRef = useRef(attachments);
  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  const addAttachment = useCallback(
    (a: Attachment) => setAttachments([...attachmentsRef.current, a]),
    [setAttachments],
  );

  const handlePhotos = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const next: PhotoAttachment[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        try {
          const url = await fileToDataUrl(file);
          next.push({ id: uid(), kind: "photo", url, name: file.name });
        } catch {
          toast("Couldn't read that image.");
        }
      }
      if (next.length) setAttachments([...attachmentsRef.current, ...next]);
    },
    [setAttachments],
  );

  const pickPhoto = useCallback(() => photoInputRef.current?.click(), []);
  const recordVoice = useCallback(() => setVoiceOpen(true), []);
  const pinLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast("Location isn't available on this device.");
      return;
    }
    const t = toast.loading("Finding your spot…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const label = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
        addAttachment({ id: uid(), kind: "location", label, latitude, longitude });
        toast.success("Location pinned.", { id: t });
      },
      (err) => {
        toast(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied."
            : "Couldn't get your location.",
          { id: t },
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  }, [addAttachment]);

  const portal = useMemo(
    () => (
      <>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handlePhotos(e.target.files);
            if (photoInputRef.current) photoInputRef.current.value = "";
          }}
        />
        <VoiceRecorder
          open={voiceOpen}
          onClose={() => setVoiceOpen(false)}
          onSave={(a) => addAttachment(a)}
        />
      </>
    ),
    [voiceOpen, addAttachment, handlePhotos],
  );

  return { pickPhoto, recordVoice, pinLocation, portal };
}

export function Attachments({
  attachments,
  setAttachments,
  actions,
}: {
  attachments: Attachment[];
  setAttachments: (next: Attachment[]) => void;
  actions: AttachmentActions;
}) {
  function removeAttachment(id: string) {
    setAttachments(attachments.filter((a) => a.id !== id));
  }

  const photos = attachments.filter((a): a is PhotoAttachment => a.kind === "photo");
  const voices = attachments.filter((a): a is VoiceAttachment => a.kind === "voice");
  const locations = attachments.filter((a): a is LocationAttachment => a.kind === "location");
  const hasAny = attachments.length > 0;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-3">
        <div className="font-sans text-[10px] uppercase tracking-[0.4em] text-[color:var(--ink-tertiary)]">
          Marginalia
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton icon={ImagePlus} label="Add photo" onClick={actions.pickPhoto} />
        <ActionButton icon={Mic} label="Add voice" onClick={actions.recordVoice} />
        <ActionButton icon={MapPin} label="Add location" onClick={actions.pinLocation} />
      </div>

      {hasAny && (
        <div className="mt-6 space-y-5">
          {photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((p) => (
                <figure
                  key={p.id}
                  className="group relative overflow-hidden rounded-md border border-border bg-[color:var(--card)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(120,80,40,0.18)]"
                >
                  <img
                    src={p.url}
                    alt={p.name}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <button
                    onClick={() => removeAttachment(p.id)}
                    className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove photo"
                  >
                    <X size={14} />
                  </button>
                </figure>
              ))}
            </div>
          )}

          {voices.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {voices.map((v) => (
                <VoiceChip key={v.id} attachment={v} onRemove={() => removeAttachment(v.id)} />
              ))}
            </div>
          )}

          {locations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {locations.map((l) => (
                <a
                  key={l.id}
                  href={`https://www.openstreetmap.org/?mlat=${l.latitude}&mlon=${l.longitude}#map=15/${l.latitude}/${l.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-md border border-border bg-[color:var(--card)] px-3 py-2 text-foreground transition-colors hover:bg-[color:var(--paper-sunken)]/60"
                >
                  <MapPin size={14} strokeWidth={1.6} className="text-[color:var(--sepia)]" />
                  <span className="font-serif text-sm">{l.label}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeAttachment(l.id);
                    }}
                    className="ml-1 text-[color:var(--ink-tertiary)] opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                    aria-label="Remove location"
                  >
                    <X size={13} />
                  </button>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof ImagePlus;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-[color:var(--card)] px-3 py-2 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-secondary)] transition-colors hover:border-[color:var(--sepia)]/40 hover:text-[color:var(--sepia)]"
    >
      <Icon size={14} strokeWidth={1.6} />
      {label}
    </button>
  );
}