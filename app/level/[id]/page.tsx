"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BsSoundwave } from "react-icons/bs";
import { useUser } from "@clerk/nextjs";

const targetPhrases = {
  "4": "A quick fox jumped on a wall",
};

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
  start: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface LevelData {
  id: number;
  created_at: string;
  level_id: number;
  sentence: string;
  title: string;
  progress: {
    accuracy: number;
    attempts: number;
  };
  is_locked: boolean;
}

export default function Level() {
  const { id } = useParams();
  const { user } = useUser();
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const targetPhrase = targetPhrases[id as keyof typeof targetPhrases] || "";

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        if (!user?.id) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/level/${id}?uuid=${user.id}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch level data");
        }

        const data = await response.json();
        setLevelData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching level data:", err);
      }
    };

    fetchLevelData();
  }, [id, user?.id]);

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.toLowerCase().split(" ");
    const words2 = str2.toLowerCase().split(" ");
    const commonWords = words1.filter((word) => words2.includes(word));
    return ((commonWords.length * 2) / (words1.length + words2.length)) * 100;
  };

  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        const score = calculateSimilarity(transcript, targetPhrase);
        setSimilarityScore(score);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  return (
    <main className="w-screen min-h-screen bg-white font-display flex items-center justify-center py-24">
      <div className="fixed top-0 left-0 w-screen px-[36px] py-[32px] flex flex-col z-20 bg-primary">
        <h1 className="text-2xl font-bold text-white">
          Level {levelData?.title || `${id}`}
        </h1>
        <p className="opacity-70 text-white font-semibold">
          Let&apos;s practice speaking
        </p>
      </div>

      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="flex flex-col gap-6 mt-8 items-center h-full justify-center">
          <div className="flex flex-col items-center justify-center">
            <p className="opacity-60">Let&apos;s try this</p>
            <h2 className="text-3xl font-semibold text-center mx-12">
              {levelData?.sentence || targetPhrase}
            </h2>
          </div>

          <div className="flex items-center justify-center w-full absolute left-0 bottom-24">
            {similarityScore !== null ? (
              <div className="px-5 py-3 rounded-full bg-red flex items-center gap-3 justify-between">
                <span>Similarity:</span>
                <span className="font-bold text-xl">
                  {similarityScore.toFixed(1)}%
                </span>
              </div>
            ) : (
              <button
                onClick={startListening}
                disabled={isListening || levelData?.is_locked}
                className={`h-18 w-18 rounded-[30px] ${
                  levelData?.is_locked ? "bg-gray-400" : "bg-red"
                } ${
                  isListening ? "animate-padding opacity-80" : ""
                } text-white flex absolute items-center justify-center`}
              >
                <BsSoundwave className="text-4xl" />
              </button>
            )}
          </div>

          {transcript && (
            <div className="bg-gray-100 px-6 py-2 border-l-2 border-l-gray-600">
              <h1 className="font-semibold text-lg">You said:</h1>
              <p className="text-base italic">{transcript}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
