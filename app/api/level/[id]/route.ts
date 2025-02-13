import { createClient } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  try {
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get("uuid");
    const levelId = params.id;

    if (!uuid) {
      return NextResponse.json({ error: "UUID is required" }, { status: 400 });
    }

    const supabase = createClient();

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("level_completed")
      .eq("uuid", uuid)
      .single();

    if (userError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get level data
    const { data: levelData, error: levelError } = await supabase
      .from("levels")
      .select(
        `
        id,
        created_at,
        level_id,
        sentence,
        title
      `
      )
      .eq("id", levelId)
      .single();

    if (levelError) {
      return NextResponse.json({ error: "Level not found" }, { status: 404 });
    }

    // Get user's progress for this specific level
    const { data: progressData } = await supabase
      .from("level_progress")
      .select("accuracy, attempts")
      .eq("user_id", uuid)
      .eq("level_id", levelId)
      .single();

    // Determine if the level is locked
    const isLocked = parseInt(levelId) > userData.level_completed + 1;

    const response = {
      ...levelData,
      progress: progressData || { accuracy: 0, attempts: 0 },
      is_locked: isLocked,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching level data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
