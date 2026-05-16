import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  audioPath: string;
  label?: string;
  className?: string;
};

export function VoicePlayback({ audioPath, label = "Hear their voice", className = "" }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    void supabase.storage
      .from("interview-audio")
      .createSignedUrl(audioPath, 3600)
      .then(({ data, error: signError }) => {
        if (cancelled) return;
        if (signError || !data?.signedUrl) {
          setError(true);
          setLoading(false);
          return;
        }
        setUrl(data.signedUrl);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      audioRef.current?.pause();
    };
  }, [audioPath]);

  useEffect(() => {
    if (!url) return;
    const el = new Audio(url);
    audioRef.current = el;
    const onEnd = () => setPlaying(false);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("ended", onEnd);
      el.pause();
    };
  }, [url]);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play();
      setPlaying(true);
    }
  }

  if (error) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading || !url}
      className={`inline-flex items-center gap-2 rounded-full border border-[color:var(--sepia)]/30 bg-[color:var(--sepia)]/8 px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.22em] text-[color:var(--sepia)] transition-colors hover:bg-[color:var(--sepia)]/15 disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : playing ? (
        <Pause size={12} />
      ) : (
        <Play size={12} />
      )}
      {label}
    </button>
  );
}
