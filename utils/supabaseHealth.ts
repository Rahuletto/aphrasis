import { createClient } from "./supabase";

export async function checkSupabaseConnection() {
  try {
    const supabase = createClient();
    // Get project settings - this is a lightweight operation that will fail if connection is bad
    const { error } = await supabase.auth.getSession();

    if (error) {
      console.error("Supabase connection error:", error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    console.error("Failed to connect to Supabase:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
