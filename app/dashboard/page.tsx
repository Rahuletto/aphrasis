"use client";
import { useEffect } from "react";
import { setupAudioStorage } from "@/utils/setupStorage";
import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  useEffect(() => {
    setupAudioStorage().then(({ success, error }) => {
      if (!success) {
        console.error("Failed to setup storage:", error);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-8 space-y-8">
        {/* Header with User Info */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[var(--text-secondary)]">Hello</p>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Marban
            </h1>
          </div>
          <UserButton />
        </div>

        {/* Streak Counter */}
        <div className="bg-[var(--orange)] rounded-xl p-4 text-[var(--text-white)]">
          <div className="flex items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
            </svg>
            <span className="text-xl font-bold">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>
        </div>

        {/* Progress Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">
            Progress
          </h2>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[var(--progress-yellow)] flex items-center justify-center text-[var(--text-white)] font-bold">
              3
            </div>
            <div className="flex-1 h-1 mx-2 bg-[var(--progress-blue)]"></div>
            <div className="w-12 h-12 rounded-full bg-[var(--progress-blue)] flex items-center justify-center text-[var(--text-white)] font-bold">
              4
            </div>
            <div className="flex-1 h-1 mx-2 bg-[var(--progress-gray)]"></div>
            <div className="w-12 h-12 rounded-full bg-[var(--progress-gray)] flex items-center justify-center text-[var(--text-white)] font-bold">
              5
            </div>
          </div>
          <button className="text-[var(--text-secondary)] px-4 py-2 rounded-full bg-[var(--gray-100)] hover:bg-[var(--gray-200)] transition-colors">
            View all
          </button>
        </div>

        {/* Power Ups */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">
            Power Ups
          </h2>
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--shield-blue)] flex items-center justify-center text-[var(--text-white)] flex-col">
              <span className="text-sm">Shield</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-[var(--orange)] flex items-center justify-center text-[var(--text-white)] flex-col">
              <span className="text-sm">Heart</span>
            </div>
          </div>
        </div>

        {/* Audio Recorder */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--orange)] flex items-center justify-center shadow-lg hover:bg-[var(--orange)]/90 transition-colors cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-[var(--text-white)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <button className="w-10 h-10 rounded-full bg-[var(--text-primary)] flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[var(--text-white)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
