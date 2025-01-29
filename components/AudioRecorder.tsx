"use client";
import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase";
import { BsSoundwave } from "react-icons/bs";
import { BiStop } from "react-icons/bi";

export function AudioRecorder({ isRecording, setIsRecording }: {
  isRecording: boolean
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>
}) {
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
      const { error: uploadError } = await supabase.storage
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
          await uploadToSupabase(audioBlob);
          setError(""); // Clear any previous errors
        } catch {
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
        className={`${isRecording ? "h-12 w-12" : "h-18 w-18"} rounded-[30px] ${isUploading ? "opacity-50 cursor-not-allowed" : ""} bg-red text-white flex items-center justify-center`}
      >
        {isRecording ? <BiStop className="text-3xl" /> : <BsSoundwave className="text-4xl" />}
      </button>
    </div>
  );
}
