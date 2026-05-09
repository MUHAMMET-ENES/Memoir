import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type InterviewTurn = {
  role: "interviewer" | "subject";
  text: string;
  at: number;
  audio_path?: string;
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
  user_id: string;
  subjectName: string;
  relation: string;
  theme: string;
  title: string;
  status: "draft" | "recording" | "bound";
  turns: InterviewTurn[];
  bound?: BoundVolume | null;
  share_slug: string;
  is_public: boolean;
  createdAt: number;
  updatedAt: number;
};

type Row = {
  id: string;
  user_id: string;
  subject_name: string;
  relation: string;
  theme: string;
  title: string;
  status: "draft" | "recording" | "bound";
  turns: InterviewTurn[] | null;
  bound: BoundVolume | null;
  share_slug: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

function rowToInterview(r: Row): Interview {
  return {
    id: r.id,
    user_id: r.user_id,
    subjectName: r.subject_name,
    relation: r.relation,
    theme: r.theme,
    title: r.title,
    status: r.status,
    turns: r.turns ?? [],
    bound: r.bound,
    share_slug: r.share_slug,
    is_public: r.is_public,
    createdAt: new Date(r.created_at).getTime(),
    updatedAt: new Date(r.updated_at).getTime(),
  };
}

export function useInterviews() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setInterviews([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setInterviews((data as Row[]).map(rowToInterview));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (
      seed: Pick<Interview, "subjectName" | "relation" | "theme" | "title">,
    ): Promise<string | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("interviews")
        .insert({
          user_id: user.id,
          subject_name: seed.subjectName,
          relation: seed.relation,
          theme: seed.theme,
          title: seed.title,
        })
        .select()
        .single();
      if (error || !data) return null;
      const iv = rowToInterview(data as Row);
      setInterviews((prev) => [iv, ...prev]);
      return iv.id;
    },
    [user],
  );

  const update = useCallback(
    async (id: string, patch: Partial<Interview>) => {
      const dbPatch: Record<string, unknown> = {};
      if (patch.title !== undefined) dbPatch.title = patch.title;
      if (patch.status !== undefined) dbPatch.status = patch.status;
      if (patch.turns !== undefined) dbPatch.turns = patch.turns;
      if (patch.bound !== undefined) dbPatch.bound = patch.bound;
      if (patch.is_public !== undefined) dbPatch.is_public = patch.is_public;
      const { data, error } = await supabase
        .from("interviews")
        .update(dbPatch)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        const iv = rowToInterview(data as Row);
        setInterviews((prev) => prev.map((x) => (x.id === id ? iv : x)));
      }
    },
    [],
  );

  const appendTurn = useCallback(
    async (id: string, turn: Omit<InterviewTurn, "at">) => {
      const current = interviews.find((x) => x.id === id);
      if (!current) return;
      const nextTurns = [...current.turns, { ...turn, at: Date.now() }];
      const optimistic = { ...current, turns: nextTurns };
      setInterviews((prev) => prev.map((x) => (x.id === id ? optimistic : x)));
      await supabase.from("interviews").update({ turns: nextTurns }).eq("id", id);
    },
    [interviews],
  );

  const remove = useCallback(async (id: string) => {
    setInterviews((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("interviews").delete().eq("id", id);
  }, []);

  return { interviews, loading, create, update, appendTurn, remove, refresh };
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const { data } = await supabase.from("interviews").select("*").eq("id", id).maybeSingle();
  return data ? rowToInterview(data as Row) : null;
}

export async function getInterviewBySlug(slug: string): Promise<Interview | null> {
  const { data } = await supabase
    .from("interviews")
    .select("*")
    .eq("share_slug", slug)
    .eq("is_public", true)
    .eq("status", "bound")
    .maybeSingle();
  return data ? rowToInterview(data as Row) : null;
}