import React from 'react'

export default function Level({ progress, level }: {
    progress: "Done" | "Now" | "Future" | string
    level: number
}) {
  return (
    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-expand font-bold ${
      progress === "Done" ? "bg-progress-yellow border-b-4 border-orange text-orange" :
      progress === "Now" ? "bg-progress-blue border-b-4 border-b-primary text-primary" :
      "bg-progress-gray border-b-4 border-b-gray-500 text-gray-500"
    }`}>
      {level}
    </div>
  )
}
