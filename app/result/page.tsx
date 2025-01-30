import React from 'react'
import { FaLeftLong } from 'react-icons/fa6'

export default function page() {
  return (
    <main className="w-screen h-screen bg-[#EAEAEA] flex items-center justify-center">
        <p className='pl-4 w-full absolute top-32 left-16 italic font-semibold border-l-2 border-grey'>
            How are you
        </p>
      <div className="absolute bottom-[100px] w-full flex items-center justify-center left-0 right-0">
        <button className='text-white bg-grey p-3 rounded-full'><FaLeftLong /></button>
      </div>
    </main>
  )
}
