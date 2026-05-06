import { useEffect, useState } from "react";

export type InterviewTurn = {
  role: "interviewer" | "subject";
  text: string;
  at: number;
};

export type BoundPassage = { kind: "question" | "answer"; text: string };
export type BoundChapter = { title: string; passages: BoundPassage[] };
export type BoundVolume = {
  epigraph?: string;
  preface?: string;
  chapters: BoundChapter[];
  closing?: string;
};

export type Interview = {
  id: string;
  subjectName: string;
  relation: string;
  theme: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  status: "draft" | "recording" | "bound";
  turns: InterviewTurn[];
  bound?: BoundVolume;
};

const KEY = "memoir.interviews.v1";

function read(): Interview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Interview[]) : [];
  } catch {
    return [];
  }
}
function write(list: Interview[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("memoir:interviews"));
  } catch {
    // ignore
  }
}

export function useInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    setInterviews(read());
    const onChange = () => setInterviews(read());
    window.addEventListener("memoir:interviews", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("memoir:interviews", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return {
    interviews,
    create(seed: Pick<Interview, "subjectName" | "relation" | "theme" | "title">) {
      const now = Date.now();
      const id = `iv_${now.toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      const next: Interview = {
        id,
        subjectName: seed.subjectName,
        relation: seed.relation,
        theme: seed.theme,
        title: seed.title,
        createdAt: now,
        updatedAt: now,
        status: "draft",
        turns: [],
      };
      write([next, ...read()]);
      return id;
    },
    update(id: string, patch: Partial<Interview>) {
      const list = read();
      const i = list.findIndex((x) => x.id === id);
      if (i < 0) return;
      list[i] = { ...list[i], ...patch, updatedAt: Date.now() };
      write(list);
    },
    appendTurn(id: string, turn: Omit<InterviewTurn, "at">) {
      const list = read();
      const i = list.findIndex((x) => x.id === id);
      if (i < 0) return;
      list[i] = {
        ...list[i],
        turns: [...list[i].turns, { ...turn, at: Date.now() }],
        updatedAt: Date.now(),
      };
      write(list);
    },
    remove(id: string) {
      write(read().filter((x) => x.id !== id));
    },
  };
}

export function getInterview(id: string): Interview | undefined {
  return read().find((x) => x.id === id);
}