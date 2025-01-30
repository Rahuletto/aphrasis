'use client'
import { useSession } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import { BiLeftArrowAlt } from 'react-icons/bi';
import Link from 'next/link';

interface HistoryItem {
  transcription: string;
  audio_url: string;
}

export default function History() {
  const { session } = useSession();
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!session?.user?.id) return;
      
      try {
        console.log(`${process.env.NEXT_PUBLIC_API}/api/history_data/${session.user.id}`)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/history_data/${session.user.id}`);
        if (!response.ok) throw new Error('Failed to fetch history data');
        
        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    fetchHistoryData();
  }, [session?.user?.id]);

  return (
    <main className='w-screen font-display min-h-screen bg-[#EAEAEA] flex flex-col'>
      <div className='w-full px-6 pt-8 flex items-center gap-4'>
        <Link href="/dashboard" className='text-white bg-grey p-3 rounded-full'><BiLeftArrowAlt /></Link>
        <h1 className='text-2xl font-bold text-grey'>History</h1>
      </div>

      <div className='flex-1 p-6 flex flex-col gap-4'>
        {historyData.map((item, index) => (
          <div key={index} className='bg-white rounded-3xl flex flex-col gap-4 p-4 shadow-sm'>
            <audio src={item.audio_url} controls className='w-full' />
            <p className='text-gray-800 font-medium text-xs pl-3 mx-3 border-l-2 border-grey italic'>{item.transcription}</p>
          </div>
        ))}
        {historyData.length === 0 && (
          <div className='flex-1 flex items-center justify-center'>
            <p className='text-gray-500'>No history found</p>
          </div>
        )}
      </div>
    </main>
  )
}
