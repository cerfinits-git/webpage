"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { readSupabasePublicConfig } from "@/lib/supabase/config";

export type AuthState = { error?: string; success?: boolean };

function getSupabaseClient() {
  const config = readSupabasePublicConfig();
  if (!config) return null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(config.url, serviceKey || config.key);
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username) {
    return { error: "Email or username is required" };
  }

  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: allowed } = await supabase
        .from("allowed_emails")
        .select("email")
        .eq("email", username.toLowerCase())
        .maybeSingle();

      if (allowed) {
        const cookieStore = await cookies();
        cookieStore.set("cerfinits_auth", username.toLowerCase(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        return { success: true };
      }

      const { data: userRow } = await supabase
        .from("users")
        .select("username")
        .eq("username", username.toLowerCase())
        .maybeSingle();

      if (userRow) {
        const cookieStore = await cookies();
        cookieStore.set("cerfinits_auth", userRow.username, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        return { success: true };
      }
    }

    return { error: "User not found or not authorized" };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An error occurred during login" };
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("cerfinits_auth");
  if (!authCookie) return null;

  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: dbUser } = await supabase
        .from("users")
        .select("*")
        .eq("username", authCookie.value.toLowerCase())
        .maybeSingle();

      if (dbUser) {
        return {
          username: dbUser.username,
          name: dbUser.name || dbUser.username,
          email: dbUser.email || dbUser.username,
          picture: dbUser.picture || dbUser.avatar_url || null,
          isPremium: dbUser.is_premium ?? true,
          completedChapters: (dbUser.completed_chapters || []) as string[],
        };
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", authCookie.value)
        .maybeSingle();

      if (profile) {
        return {
          username: profile.email,
          name: profile.display_name || profile.name || profile.email,
          email: profile.email,
          picture: profile.avatar_url || profile.picture || null,
          isPremium: true,
          completedChapters: [] as string[],
        };
      }

      const { data: allowed } = await supabase
        .from("allowed_emails")
        .select("email")
        .eq("email", authCookie.value.toLowerCase())
        .maybeSingle();

      if (allowed) {
        return {
          username: allowed.email,
          name: allowed.email.split("@")[0],
          email: allowed.email,
          picture: null,
          isPremium: true,
          completedChapters: [] as string[],
        };
      }
    }

    return {
      username: authCookie.value,
      name: authCookie.value.split("@")[0],
      email: authCookie.value,
      picture: null,
      isPremium: true,
      completedChapters: [] as string[],
    };
  } catch (err) {
    return {
      username: authCookie.value,
      name: authCookie.value.split("@")[0],
      email: authCookie.value,
      picture: null,
      isPremium: true,
      completedChapters: [] as string[],
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("cerfinits_auth");
  redirect("/");
}
