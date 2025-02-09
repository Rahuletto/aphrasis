import Link from 'next/link'
import React from 'react'

export default function Level({ progress, level, title }: {
    progress: "Done" | "Now" | "Future" | string
    level: number
    title?: string
}) {
  return (
    <Link href={`/level/${level}`} className="flex items-center gap-4 z-2">
      <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-expand font-bold ${
      progress === "Done" ? "bg-progress-yellow border-b-4 border-orange text-orange" :
      progress === "Now" ? "bg-progress-blue border-b-4 border-b-primary text-primary" :
      "bg-progress-gray border-b-4 border-b-gray-500 text-gray-500"
    }`}>
        {level}
      </div>
      {title && <span className="text-base font-semibold text-black">{title}</span>}
    </Link>
  )
}
