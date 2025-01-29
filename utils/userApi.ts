import { useSession } from "@clerk/nextjs";
import { createClient } from "./supabase";

type SessionType = ReturnType<typeof useSession>["session"];

type UserData = {
  name: string;
  streak: number;
  level_completed: number;
};

export const fetchUserData = async (uuid: string): Promise<UserData> => {
  const supabase = createClient();

  try {
    // Get the current session
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();
    if (authError) throw authError;
    if (!session) throw new Error("No active session");

    const { data, error } = await supabase
      .from("users")
      .select("name, streak, level_completed")
      .eq("uuid", uuid)
      .single();

    if (error) throw error;
    if (!data) throw new Error("User not found");

    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const updateUserInBackend = async (
  session: NonNullable<SessionType>
) => {
  const supabase = createClient();

  try {
    // Get the current session
    const {
      data: { session: supabaseSession },
      error: authError,
    } = await supabase.auth.getSession();
    if (authError) throw authError;
    if (!supabaseSession) throw new Error("No active session");

    const payload = {
      uuid: session.id,
      name:
        session.user.fullName ||
        `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim(),
    };

    const { data, error } = await supabase
      .from("users")
      .upsert(payload, { onConflict: "uuid" })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to update user");

    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
