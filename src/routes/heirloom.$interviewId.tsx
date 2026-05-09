import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Loader2, Mic, MicOff, Sparkles, Square } from "lucide-react";
import { toast } from "sonner";

import { PageTransition } from "@/components/memoir/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { useInterviews, type Interview } from "@/hooks/useInterviews";
import { speak, useSpeech } from "@/hooks/useSpeech";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useRequireAuth } from "@/lib/auth";

export const Route = createFileRoute("/heirloom/$interviewId")({
  head: () => ({
    meta: [
      { title: "Recording — Heirloom Interview" },
      { name: "description", content: "A guided oral history, in progress." },
    ],
  }),
  component: InterviewRoom,
});

function InterviewRoom() {
  const { user, ready } = useRequireAuth();
  const { interviewId } = Route.useParams();
  const navigate = useNavigate();
  const { interviews, update, appendTurn } = useInterviews();
  const interview = useMemo(
    () => interviews.find((x) => x.id === interviewId),
    [interviews, interviewId],
  );

  const speech = useSpeech();
  const audio = useAudioRecorder();
  const [hostThinking, setHostThinking] = useState(false);
  const [binding, setBinding] = useState(false);
  const [muteVoice, setMuteVoice] = useState(false);
  const stoppedRef = useRef(false);
  const pendingAudioPathRef = useRef<string | null>(null);
  const interviewRef = useRef<Interview | undefined>(interview);
  useEffect(() => {
    interviewRef.current = interview;
  }, [interview]);

  // Kick off opening question if no turns yet.
  useEffect(() => {
    if (!interview || interview.turns.length > 0 || hostThinking) return;
    void askNext("opening");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview?.id]);

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      window.speechSynthesis?.cancel();
    };
  }, []);

  if (!ready) {
    return (
      <main className="grid min-h-dvh place-items-center">
        <p className="font-serif italic text-[color:var(--ink-tertiary)]">…</p>
      </main>
    );
  }

  if (!interview) {
    return (
      <PageTransition>
        <main className="grid min-h-dvh place-items-center px-6">
          <div className="text-center">
            <p className="font-serif text-lg">This interview can't be found.</p>
            <Link
              to="/heirloom"
              className="mt-4 inline-block font-sans text-[11px] uppercase tracking-[0.3em] text-[color:var(--sepia)]"
            >
              ← Back to interviews
            </Link>
          </div>
        </main>
      </PageTransition>
    );
  }

  async function askNext(mode: "opening" | "next") {
    const current = interviewRef.current;
    if (!current) return;
    setHostThinking(true);
    try {
      const { data, error } = await supabase.functions.invoke("interview-host", {
        body: {
          mode,
          subjectName: current.subjectName,
          relation: current.relation,
          theme: current.theme,
          turns: current.turns,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const text = (data?.text as string) ?? "";
      if (!text) throw new Error("No question returned");
      appendTurn(current.id, { role: "interviewer", text });
      if (!muteVoice && !stoppedRef.current) speak(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The host fell silent. Try again.");
    } finally {
      setHostThinking(false);
    }
  }

  async function handleAnswer() {
    if (speech.listening) {
      speech.stop();
      // Stop audio capture; upload happens after speech onFinal fires
      const blob = await audio.stop();
      if (blob && user && interviewRef.current) {
        const turnIndex = interviewRef.current.turns.length; // index of the upcoming subject turn
        const ext = blob.type.includes("mp4") ? "m4a" : "webm";
        const path = `${user.id}/${interviewRef.current.id}/${turnIndex}.${ext}`;
        try {
          await supabase.storage
            .from("interview-audio")
            .upload(path, blob, { contentType: blob.type, upsert: true });
          // Stash on a ref so the speech onFinal handler can attach it
          pendingAudioPathRef.current = path;
        } catch (e) {
          console.error("audio upload failed", e);
        }
      }
      return;
    }
    if (!speech.supported) {
      toast(
        "Voice capture isn't available in this browser. Try Chrome or Safari on a phone.",
      );
      return;
    }
    // Begin audio capture in parallel with speech recognition
    if (audio.supported) {
      try {
        await audio.start();
      } catch (e) {
        console.warn("Audio capture not started", e);
      }
    }
    speech.start((finalText) => {
      if (!finalText.trim()) return;
      const audioPath = pendingAudioPathRef.current;
      pendingAudioPathRef.current = null;
      void appendTurn(interviewId, {
        role: "subject",
        text: finalText.trim(),
        ...(audioPath ? { audio_path: audioPath } : {}),
      });
      // Slight delay so UI updates before host responds
      setTimeout(() => void askNext("next"), 400);
    });
  }

  async function bind() {
    const current = interviewRef.current;
    if (!current) return;
    if (current.turns.filter((t) => t.role === "subject").length < 2) {
      toast("Record a few more answers before binding.");
      return;
    }
    setBinding(true);
    window.speechSynthesis?.cancel();
    try {
      const { data, error } = await supabase.functions.invoke("interview-host", {
        body: {
          mode: "bind",
          subjectName: current.subjectName,
          theme: current.theme,
          title: current.title,
          turns: current.turns,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.volume) throw new Error("Couldn't bind the volume.");
      update(interviewId, { status: "bound", bound: data.volume });
      toast.success("Volume bound.");
      navigate({
        to: "/heirloom/$interviewId/bound",
        params: { interviewId },
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't bind the volume.");
    } finally {
      setBinding(false);
    }
  }

  const lastInterviewerTurn = [...interview.turns]
    .reverse()
    .find((t) => t.role === "interviewer");
  const subjectTurnCount = interview.turns.filter((t) => t.role === "subject").length;

  return (
    <PageTransition>
      <main className="min-h-dvh bg-[color:var(--paper-sunken)]/60 pb-40">
        <header className="mx-auto max-w-2xl px-6 pt-8">
          <Link
            to="/heirloom"
            className="inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-tertiary)] hover:text-foreground"
          >
            <ChevronLeft size={14} /> Interviews
          </Link>
          <div className="mt-6 font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
            {interview.relation} · {interview.theme}
          </div>
          <h1 className="mt-2 font-serif text-2xl text-foreground sm:text-3xl">
            {interview.subjectName}
          </h1>
          <button
            onClick={() => setMuteVoice((v) => !v)}
            className="mt-3 font-sans text-[10px] uppercase tracking-[0.25em] text-[color:var(--ink-tertiary)] hover:text-foreground"
          >
            {muteVoice ? "🔇 Voice muted" : "🔊 Host speaks aloud"}
          </button>
        </header>

        {/* Current question card */}
        <section className="mx-auto mt-8 max-w-2xl px-6">
          <div className="rounded-[14px] border border-border bg-[color:var(--card)] p-7 shadow-[0_2px_0_rgba(0,0,0,0.02),0_18px_30px_-22px_rgba(40,25,10,0.25)]">
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-[color:var(--sepia)]" />
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
                The interviewer asks
              </span>
            </div>
            <p className="mt-4 min-h-[60px] font-serif text-[20px] leading-[1.55] text-foreground">
              {hostThinking && !lastInterviewerTurn
                ? "Settling in…"
                : lastInterviewerTurn?.text ?? "…"}
              {hostThinking && lastInterviewerTurn && (
                <Loader2
                  size={14}
                  className="ml-2 inline animate-spin text-[color:var(--ink-tertiary)]"
                />
              )}
            </p>
          </div>

          {/* Live transcript bubble */}
          {speech.listening && (
            <div className="mt-4 rounded-md border border-dashed border-[color:var(--sepia)]/40 bg-[color:var(--card)]/60 p-4">
              <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--sepia)]">
                Listening…
              </div>
              <p className="mt-1 font-serif italic text-[15px] text-[color:var(--ink-tertiary)]">
                {speech.interim || "Speak whenever you're ready."}
              </p>
            </div>
          )}
        </section>

        {/* Past turns */}
        {interview.turns.length > 1 && (
          <section className="mx-auto mt-10 max-w-2xl px-6">
            <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-[color:var(--ink-tertiary)]">
              Conversation so far
            </div>
            <ol className="mt-4 space-y-5">
              {interview.turns.slice(0, -1).map((t, i) => (
                <li key={i}>
                  {t.role === "interviewer" ? (
                    <p className="font-serif italic text-[14px] text-[color:var(--ink-tertiary)]">
                      — {t.text}
                    </p>
                  ) : (
                    <p className="font-serif text-[16px] leading-[1.65] text-foreground">
                      {t.text}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Controls */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-[color:var(--card)]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-6 py-4"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
          >
            <button
              onClick={bind}
              disabled={binding || subjectTurnCount < 2}
              className="font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--sepia)] disabled:opacity-30 hover:underline"
            >
              {binding ? "Binding…" : "Bind as volume"}
            </button>

            <button
              onClick={handleAnswer}
              disabled={hostThinking || binding}
              className={`group relative flex h-16 w-16 items-center justify-center rounded-full transition-all ${
                speech.listening
                  ? "bg-[color:var(--vermilion)] text-white shadow-[0_0_0_8px_rgba(139,46,18,0.15)]"
                  : "bg-foreground text-[color:var(--background)] hover:opacity-90"
              } disabled:opacity-40`}
              aria-label={speech.listening ? "Stop recording" : "Start answer"}
            >
              {speech.listening ? <Square size={22} fill="currentColor" /> : <Mic size={24} />}
            </button>

            <button
              onClick={() => askNext("next")}
              disabled={hostThinking || speech.listening || binding}
              className="font-sans text-[11px] uppercase tracking-[0.25em] text-[color:var(--ink-tertiary)] disabled:opacity-30 hover:text-foreground"
            >
              Skip · ask again
            </button>
          </div>
        </div>

        {!speech.supported && (
          <div className="mx-auto mt-6 max-w-2xl px-6">
            <div className="flex items-center gap-2 rounded-md border border-dashed border-border p-3 font-serif italic text-[13px] text-[color:var(--ink-tertiary)]">
              <MicOff size={14} /> Voice capture isn't supported here. Try the app on Chrome or on a phone.
            </div>
          </div>
        )}
      </main>
    </PageTransition>
  );
}