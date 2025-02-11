"use client";
import { useEffect, useRef, useState } from "react";
import { setupAudioStorage } from "@/utils/setupStorage";
import { UserButton, useSession } from "@clerk/nextjs";
import { fetchUserData } from "@/utils/userApi";
import Link from "next/link";
import Level from "./components/Level";
import { BsFillShieldFill, BsHeartFill } from "react-icons/bs";
import { BiHistory } from "react-icons/bi";
import { HiFire } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { AudioRecorder } from "@/components/AudioRecorder";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

interface UserData {
  name: string;
  streak: number;
  level_completed: number;
}

export default function Dashboard() {
  const { session } = useSession();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);


  useEffect(() => {
    setupAudioStorage().then(({ success, error }) => {
      if (!success) {
        console.error("Failed to setup storage:", error);
      }
    });
  }, []);

  useEffect(() => {
    const updateUser = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uuid: session.user.id,
              name:
                session.user.fullName ||
                `${session.user.firstName || ""} ${
                  session.user.lastName || ""
                }`.trim(),
              email: session.user.emailAddresses[0]?.emailAddress,
            }),
          }
        );

        if (!response.ok) {
          console.error("Failed to create user in backend");
          return;
        }

        const data = await fetchUserData(session.user.id);
        setUserData(data);
      } catch (err) {
        const error = err as Error;
        console.error("Error creating/fetching user:", error.message);
      }
    };

    updateUser();
  }, [session]);

  const userName =
    userData?.name ||
    session?.user?.fullName ||
    `${session?.user?.firstName || ""} ${
      session?.user?.lastName || ""
    }`.trim() ||
    "User";

  // Get current week data
  const getCurrentWeekData = () => {
    const today = new Date();
    const currentDayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const streak = userData?.streak || 0;

    return DAYS.map((day, index) => {
      if (index > currentDayIndex) {
        // Future days
        return { day, status: "future" };
      } else if (index === currentDayIndex) {
        // Today
        return { day, status: "today" };
      } else {
        // Past days - check against streak
        const daysAgo = currentDayIndex - index;
        const hasCompleted = daysAgo <= streak;
        return { day, status: hasCompleted ? "completed" : "missed" };
      }
    });
  };

  const weekData = getCurrentWeekData();

  return isRecording ? (
    <main className="w-screen h-screen bg-[#EAEAEA] flex items-center justify-center">
      <div className="w-[160px] h-[160px] rounded-full bg-gradient-to-tr from-primary to-secondary animate-gradient shadow-[0_0_300px] shadow-primary" />
      <div className="fixed bottom-[100px] left-0 right-0">
        <AudioRecorder
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          error={error}
          setError={setError}
          isRecording={isRecording}
          mediaRecorderRef={mediaRecorderRef}
          audioChunksRef={audioChunksRef}
          setIsRecording={setIsRecording}
        />
      </div>
    </main>
  ) : (
    <div className="w-screen h-screen px-[32px] py-[36px] bg-white font-display">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-base text-gray-600 font-medium">Hello</h3>
          <h1 className="text-[32px] font-semibold -mt-2">{userName}</h1>
        </div>
        <UserButton />
      </div>
      {/* Streak Section */}
      <div className="mt-6 rounded-2xl flex flex-col bg-orange-500 px-[18px] py-[16px]">
        <div className="flex items-center gap-2">
          <HiFire className="h-6 w-6 text-white" />
          <span className="text-2xl font-bold text-white font-expand">
            {userData?.streak || 0}
          </span>
        </div>
        <div className="mt-4 flex justify-between font-expand relative">
          <div className="bg-white rounded-full w-full absolute h-2 m-1" />
          {weekData.map((day, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`h-4 w-4 z-10 rounded-full mb-2 text-[10px] flex items-center justify-center ${
                  day.status === "completed"
                    ? "bg-progress-yellow"
                    : day.status === "today"
                    ? "bg-white"
                    : day.status === "missed"
                    ? "bg-white"
                    : "bg-white/0"
                }`}
              >
                {day.status === "completed" ? (
                  <FaCheck className="text-white" />
                ) : day.status === "missed" ? (
                  <FaXmark className="text-orange" />
                ) : null}
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  day.status === "today"
                    ? "bg-white rounded-full w-4 flex items-center justify-center h-4 text-orange"
                    : "text-white/70"
                }`}
              >
                {day.day}
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
                level: userData?.level_completed || 0,
                progress: "Done",
              },
              {
                level: (userData?.level_completed || 0) + 1,
                progress: "Now",
              },
              {
                level: (userData?.level_completed || 0) + 2,
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
            <AudioRecorder
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              error={error}
              setError={setError}
              isRecording={isRecording}
              mediaRecorderRef={mediaRecorderRef}
              audioChunksRef={audioChunksRef}
              setIsRecording={setIsRecording}
            />

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
