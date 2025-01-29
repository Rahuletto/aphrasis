"use client";

import { useEffect, useState } from "react";
import Level from "../dashboard/components/Level";
import { useSession } from "@clerk/nextjs";

type LevelProgress = {
  accuracy: number;
  attempts: number;
};

type LevelData = {
  level_id: number;
  title: string;
  sentence: string;
  progress: LevelProgress;
  is_locked: boolean;
};

export default function Levels() {
  const { session } = useSession();
  const [levels, setLevels] = useState<LevelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        if (!session?.user?.id) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/levels_data/${session.user.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch levels");

        const data = await response.json();
        setLevels(data);
      } catch (error) {
        console.error("Error fetching levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <main className="w-screen min-h-screen bg-white font-display py-24">
        <div className="fixed top-0 left-0 w-screen px-[36px] py-[32px] flex flex-col z-20 bg-primary">
          <h1 className="text-2xl font-bold text-white">Loading...</h1>
        </div>
      </main>
    );
  }

  // Find the first unlocked level to display in header
  const currentLevel = levels.find((level) => !level.is_locked) || levels[0];

  return (
    <main className="w-screen min-h-screen bg-white font-display py-24">
      <div className="fixed top-0 left-0 w-screen px-[36px] py-[32px] flex flex-col z-20 bg-primary">
        <h1 className="text-2xl font-bold text-white">
          Level {currentLevel?.level_id}
        </h1>
        <p className="opacity-70 text-white font-semibold">
          {currentLevel?.title}
        </p>
      </div>
      <div className="mt-12 px-12 flex flex-col gap-4 relative">
        <div className="bg-primary w-2 h-full ml-7 z-0 absolute" />
        {levels.map((level) => (
          <Level
            key={level.level_id}
            level={level.level_id}
            title={level.title}
            progress={
              level.is_locked
                ? "Future"
                : level.progress.attempts > 0
                ? "Done"
                : "Now"
            }
          />
        ))}
      </div>
    </main>
  );
}
