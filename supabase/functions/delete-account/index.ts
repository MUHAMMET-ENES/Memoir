import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { adminClient, getUserFromRequest } from "../_shared/auth.ts";
import { jsonResponse, optionsResponse } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const admin = adminClient();

    const { data: interviews } = await admin
      .from("interviews")
      .select("id")
      .eq("user_id", user.id);

    const interviewIds = (interviews ?? []).map((r) => r.id as string);

    if (interviewIds.length > 0) {
      const paths: string[] = [];
      for (const id of interviewIds) {
        const { data: files } = await admin.storage
          .from("interview-audio")
          .list(`${user.id}/${id}`);
        if (files) {
          for (const f of files) {
            if (f.name) paths.push(`${user.id}/${id}/${f.name}`);
          }
        }
      }
      if (paths.length > 0) {
        await admin.storage.from("interview-audio").remove(paths);
      }
    }

    await admin.storage.from("interview-audio").remove([`${user.id}`]).catch(() => {
      /* prefix folder may not exist as object */
    });

    await admin.from("interviews").delete().eq("user_id", user.id);
    await admin.from("print_waitlist").delete().eq("user_id", user.id);
    await admin.from("gift_purchases").delete().eq("buyer_user_id", user.id);
    await admin.from("profiles").delete().eq("user_id", user.id);

    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;

    return jsonResponse({ ok: true });
  } catch (e) {
    console.error("delete-account", e);
    return jsonResponse(
      { error: e instanceof Error ? e.message : "Delete failed" },
      500,
    );
  }
});
