import { useCallback, useEffect, useRef, useState } from "react";

type SR = typeof window extends { webkitSpeechRecognition: infer T } ? T : unknown;

export function useSpeech() {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<unknown>(null);
  const finalRef = useRef<string>("");
  const onFinalRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: SR }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: SR }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    // @ts-expect-error vendor constructor
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e: { resultIndex: number; results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => {
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          finalRef.current += (finalRef.current ? " " : "") + r[0].transcript.trim();
        } else {
          interimText += r[0].transcript;
        }
      }
      setInterim(interimText);
    };
    rec.onerror = () => {
      // ignore; user can restart
    };
    rec.onend = () => {
      setListening(false);
      setInterim("");
      const text = finalRef.current.trim();
      finalRef.current = "";
      if (text && onFinalRef.current) onFinalRef.current(text);
    };
    recognitionRef.current = rec;
  }, []);

  const start = useCallback((onFinal: (text: string) => void) => {
    onFinalRef.current = onFinal;
    finalRef.current = "";
    setInterim("");
    const rec = recognitionRef.current as { start: () => void } | null;
    if (!rec) return;
    try {
      rec.start();
      setListening(true);
    } catch {
      // already started
    }
  }, []);

  const stop = useCallback(() => {
    const rec = recognitionRef.current as { stop: () => void } | null;
    rec?.stop();
  }, []);

  return { listening, interim, supported, start, stop };
}

export function speak(
  text: string,
  opts: { onEnd?: () => void; voiceHint?: string } = {},
): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    opts.onEnd?.();
    return () => {};
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  u.pitch = 1.0;
  const voices = synth.getVoices();
  const preferred =
    voices.find((v) => /samantha|serena|ava|jenny/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith("en") && /female/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith("en"));
  if (preferred) u.voice = preferred;
  if (opts.onEnd) u.onend = () => opts.onEnd?.();
  synth.speak(u);
  return () => synth.cancel();
}