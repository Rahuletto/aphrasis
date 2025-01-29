"use client";
import { useEffect } from "react";
import { AudioRecorder } from "@/components/AudioRecorder";
import { setupAudioStorage } from "@/utils/setupStorage";

export default function Dashboard() {
  useEffect(() => {
    setupAudioStorage().then(({ success, error }) => {
      if (!success) {
        console.error("Failed to setup storage:", error);
      }
    });
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="max-w-md mx-auto">
        <AudioRecorder />
      </div>
    </div>
  );
}
