"use client";
import { useEffect, useRef, useState } from "react";
import { setupAudioStorage } from "@/utils/setupStorage";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Level from "./components/Level";
import { BsFillShieldFill, BsHeartFill } from "react-icons/bs";
import { BiHistory } from "react-icons/bi";
import { HiFire } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { AudioRecorder } from "@/components/AudioRecorder";

export default function Dashboard() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setupAudioStorage().then(({ success, error }) => {
      if (!success) {
        console.error("Failed to setup storage:", error);
      }
    });
  }, []);

  return (
    isRecording ? <main className="w-screen h-screen bg-[#EAEAEA] flex items-center justify-center">
      <div className="w-[160px] h-[160px] rounded-full bg-gradient-to-tr from-primary to-secondary animate-gradient shadow-[0_0_300px] shadow-primary" />
      <div className="fixed bottom-[100px] left-0 right-0">

        <AudioRecorder isUploading={isUploading} setIsUploading={setIsUploading} error={error} setError={setError} isRecording={isRecording} mediaRecorderRef={mediaRecorderRef} audioChunksRef={audioChunksRef} setIsRecording={setIsRecording} />
      </div>
    </main> : <div className="w-screen h-screen px-[32px] py-[36px] bg-white font-display">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-base text-gray-600 font-medium">Hello</h3>
          <h1 className="text-[32px] font-semibold -mt-2">Marban</h1>
        </div>
        <UserButton />
      </div>
      {/* Streak Section */}
      <div className="mt-6 rounded-2xl flex flex-col bg-orange-500 px-[18px] py-[16px]">
        <div className="flex items-center gap-2">
          <HiFire className="h-6 w-6 text-white" />
          <span className="text-2xl font-bold text-white font-expand">
            12
          </span>
        </div>
        <div className="mt-4 flex justify-between font-expand relative">
          <div className="bg-white rounded-full w-full absolute h-2 m-1" />
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`h-4 w-4 z-10 rounded-full mb-2 text-[10px] flex items-center justify-center ${i < 4 && i != 2
                  ? "bg-progress-yellow"
                  : i < 4
                    ? "bg-white"
                    : "bg-white/0"
                  }`}
              >
                {i < 4 && i != 2 ? (
                  <FaCheck className="text-white" />
                ) : i < 4 ? (
                  <FaXmark className="text-orange" />
                ) : null}
              </div>
              <span
                className={`text-[10px] font-semibold ${i == 3
                  ? "bg-white rounded-full w-4 flex items-center justify-center h-4 text-orange"
                  : "text-white/70"
                  }`}
              >
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Progress</h2>
        <div className="flex items-center gap-4 mb-4 relative">
          <div className="w-full absolute h-3 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="flex items-center justify-between w-full px-4 z-10">
            {[
              {
                level: 3,
                progress: "Done",
              },
              {
                level: 4,
                progress: "Now",
              },
              {
                level: 5,
                progress: "Future",
              },
            ].map((a, i) => (
              <Level key={i} level={a.level} progress={a.progress} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Link
            href="/levels"
            className="px-4 py-1 rounded-full font-semibold bg-gray-100 text-gray-600 text-sm mx-auto"
          >
            View all
          </Link>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Power Ups</h2>
        <div className="flex gap-4">
          <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center flex-col gap-2">
            <BsFillShieldFill className="text-white text-3xl" />
            <span className="text-white font-expand font-semibold text-sm">
              Shield
            </span>
          </div>
          <div className="h-24 w-24 rounded-full bg-orange flex items-center justify-center flex-col gap-2">
            <BsHeartFill className="text-white text-3xl" />
            <span className="text-white text-sm font-expand font-semibold">
              Heart
            </span>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-[#EAEAEA] rounded-t-4xl">
        <div className="w-full h-full relative flex justify-center pb-[36px] pt-[50px]">
          <div className="absolute top-2 w-8 h-1 rounded-full bg-grey" />
          <div className="flex flex-col gap-[22px] items-center justify-center">
            <AudioRecorder isUploading={isUploading} setIsUploading={setIsUploading} error={error} setError={setError} isRecording={isRecording} mediaRecorderRef={mediaRecorderRef} audioChunksRef={audioChunksRef} setIsRecording={setIsRecording} />

            <Link
              href="/history"
              className="h-8 w-8 rounded-full bg-grey text-[#d9d9d9] flex items-center justify-center"
            >
              <BiHistory className="text-xl" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
