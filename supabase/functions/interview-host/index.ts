import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Turn = { role: "interviewer" | "subject"; text: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, subjectName, relation, theme, turns, title } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("Missing LOVABLE_API_KEY");

    let system = "";
    let user = "";

    if (mode === "opening") {
      system =
        "You are a warm, patient oral historian in the StoryCorps tradition. Your job is to help a family member tell their life story so it can be preserved as an heirloom. You ask one open-ended, sensory, specific question at a time. Never list questions. Never ask multiple things at once. Speak as if sitting at a kitchen table. Keep each question under 30 words.";
      user = `Begin an interview with ${subjectName || "the storyteller"}${relation ? `, who is the interviewer's ${relation}` : ""}. Today's theme: "${theme || "their life so far"}". Open with a brief, warm one-sentence welcome (no preamble, no "Hello!"), then ask the first gentle question. Return only what you would say aloud.`;
    } else if (mode === "next") {
      system =
        "You are a warm oral historian conducting a recorded interview. Listen closely to what was just said and ask ONE follow-up question that goes deeper — a sensory detail, a person, a place, a feeling. Never repeat earlier questions. Never ask multiple things. Keep it under 30 words. Sometimes (1 in 4) gently pivot to a new chapter of their life if a thread feels complete. Return only what you would say aloud.";
      const transcript = (turns as Turn[])
        .map((t) => `${t.role === "interviewer" ? "INTERVIEWER" : (subjectName || "STORYTELLER").toUpperCase()}: ${t.text}`)
        .join("\n");
      user = `Theme: ${theme || "their life"}\n\nTranscript so far:\n${transcript}\n\nAsk the next question.`;
    } else if (mode === "bind") {
      system =
        "You are a literary editor binding a recorded oral history into a printed family heirloom. You preserve the storyteller's voice exactly — their phrasing, their pauses, their humor. You arrange the conversation into chapters with quiet, evocative chapter titles. You never invent facts. You never paraphrase the storyteller's words; you only lightly clean filler ('um', 'you know') and fix obvious transcription errors. The interviewer's questions appear as small italicized prompts between the storyteller's passages.";
      const transcript = (turns as Turn[])
        .map((t) => `${t.role === "interviewer" ? "Q" : "A"}: ${t.text}`)
        .join("\n\n");
      user = `Bind this interview with ${subjectName || "the storyteller"} into a short heirloom volume titled "${title || "An Interview"}".

Return JSON with this shape:
{
  "epigraph": "a single resonant line lifted verbatim from their answers, in quotes",
  "preface": "2-3 sentences in the editor's voice introducing this volume warmly",
  "chapters": [
    {
      "title": "Quiet evocative title (3-6 words)",
      "passages": [
        { "kind": "question", "text": "the interviewer's question, lightly cleaned" },
        { "kind": "answer", "text": "the storyteller's answer, preserving their voice, lightly cleaned of filler" }
      ]
    }
  ],
  "closing": "1-2 sentence closing note from the editor"
}

Aim for 2-4 chapters. Group related Q&A pairs. Skip throwaway exchanges.

Transcript:
${transcript}`;
    } else {
      throw new Error(`Unknown mode: ${mode}`);
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          ...(mode === "bind"
            ? { response_format: { type: "json_object" } }
            : {}),
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit. Try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (mode === "bind") {
      try {
        const parsed = JSON.parse(content);
        return new Response(JSON.stringify({ volume: parsed }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        return new Response(
          JSON.stringify({ error: "Couldn't bind the volume. Please try again." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    return new Response(JSON.stringify({ text: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("interview-host error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});