'use client'
import Link from 'next/link'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { decodeString } from '@/misc/encode'
import { BiLeftArrowAlt } from 'react-icons/bi'

export default function Page() {
  const searchParams = useSearchParams()
  const text = searchParams.get('text')
  const encodedUrl = searchParams.get("url")
  const url = decodeString(encodedUrl ?? "")

  return (
    <main className="w-screen h-screen bg-[#EAEAEA] flex flex-col gap-32 items-center justify-center">
        <p className='pl-4 w-full max-w-xs mx-auto italic font-semibold border-l-2 border-grey'>
            {text || 'No text provided'}
        </p>
        <div className="w-full flex items-center justify-center left-0 right-0">
          <audio src={url} controls className="w-[80%] max-w-[500px]" />
        </div>
      <div className=" w-full flex items-center justify-center left-0 right-0">
      <Link href="/dashboard" className='text-white bg-grey p-3 rounded-full'><BiLeftArrowAlt /></Link>
      </div>
    </main>
  )
}
