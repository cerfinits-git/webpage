"use server";

import { getCurrentUser } from "./auth";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { readSupabasePublicConfig } from "@/lib/supabase/config";

function getSupabaseClient() {
  const config = readSupabasePublicConfig();
  if (!config) return null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(config.url, serviceKey || config.key);
}

export async function toggleProgress(chapterId: string, completed: boolean) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not logged in" };

  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: dbUser } = await supabase
        .from("users")
        .select("completed_chapters")
        .eq("username", user.username.toLowerCase())
        .maybeSingle();

      let chapters: string[] = dbUser?.completed_chapters || [];
      if (completed) {
        if (!chapters.includes(chapterId)) chapters.push(chapterId);
      } else {
        chapters = chapters.filter((c: string) => c !== chapterId);
      }

      await supabase
        .from("users")
        .upsert(
          { username: user.username.toLowerCase(), completed_chapters: chapters },
          { onConflict: "username" }
        );
    }

    revalidatePath("/grade");
    revalidatePath("/grade/[chapter]");

    return { success: true };
  } catch (error) {
    console.error("Progress update error:", error);
    return { error: "Failed to update progress" };
  }
}
