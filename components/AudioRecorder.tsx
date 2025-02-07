"use client";
import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase";

export function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const uploadToSupabase = async (audioBlob: Blob) => {
    try {
      setIsUploading(true);
      const supabase = createClient();

      // Generate a unique filename using timestamp
      const filename = `recording-${Date.now()}.wav`;

      // Upload the file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from("audio_files")
        .upload(filename, audioBlob, {
          contentType: "audio/wav",
          cacheControl: "3600",
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("audio_files").getPublicUrl(filename);

      console.log("File uploaded successfully:", publicUrl);
      return publicUrl;
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Error uploading recording to storage.");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        try {
          const publicUrl = await uploadToSupabase(audioBlob);
          setError(""); // Clear any previous errors
        } catch (err) {
          // Error handling is done in uploadToSupabase
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError("");
    } catch (err) {
      setError(
        "Error accessing microphone. Please ensure you have granted permission."
      );
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isUploading}
        className={`px-6 py-3 rounded-full font-medium transition-colors ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isUploading
          ? "Uploading..."
          : isRecording
          ? "Stop Recording"
          : "Start Recording"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
