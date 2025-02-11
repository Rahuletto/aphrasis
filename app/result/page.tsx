'use client'
import Link from 'next/link'
import React from 'react'
import { FaLeftLong } from 'react-icons/fa6'
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const searchParams = useSearchParams()
  const text = searchParams.get('text')

  return (
    <main className="w-screen h-screen bg-[#EAEAEA] flex items-center justify-center">
        <p className='pl-4 w-full absolute top-32 left-16 italic font-semibold border-l-2 border-grey'>
            {text || 'No text provided'}
        </p>
      <div className="absolute bottom-[100px] w-full flex items-center justify-center left-0 right-0">
        <Link href="/dashboard" className='text-white bg-grey p-3 rounded-full'><FaLeftLong /></Link>
      </div>
    </main>
  )
}
