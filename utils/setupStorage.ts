import { createClient } from "./supabase";

export async function setupAudioStorage() {
  try {
    const supabase = createClient();

    // Check authentication status
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();
    if (authError) {
      console.error("Authentication error:", authError);
      return { success: false, error: authError };
    }

    if (!session) {
      console.error("No active session");
      return { success: false, error: new Error("No active session") };
    }

    // Create the bucket if it doesn't exist
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("Bucket list error:", bucketsError);
      return { success: false, error: bucketsError };
    }

    const audioBucket = buckets?.find(
      (bucket) => bucket.name === "audio_files"
    );

    if (!audioBucket) {
      const { data, error } = await supabase.storage.createBucket(
        "audio_files",
        {
          public: false, // Changed to false for better security
          fileSizeLimit: 52428800, // 50MB limit
          allowedMimeTypes: ["audio/wav", "audio/mpeg", "audio/webm"],
        }
      );

      if (error) {
        console.error("Bucket creation error:", error);
        return { success: false, error };
      }

      console.log("Created audio_files bucket");
    }

    return { success: true };
  } catch (error) {
    console.error("Error setting up storage:", error);
    return { success: false, error };
  }
}
