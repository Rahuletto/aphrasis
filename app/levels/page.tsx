import React from 'react'
import Level from '../dashboard/components/Level'

export default function Levels() {
    return (
        <main className='w-screen min-h-screen bg-white font-display py-24'>
            <div className='fixed top-0 left-0 w-screen px-[36px] py-[32px] flex flex-col z-20 bg-primary'>
                <h1 className='text-2xl font-bold text-white'>Level 4</h1>
                <p className='opacity-70 text-white font-semibold'>Let&apos;s practice basic words</p>
            </div>
            <div className='mt-12 px-12 flex flex-col gap-4 relative'>
                <div className='bg-primary w-2 h-full ml-7 z-0 absolute' />
                <Level
                    level={1}
                    title="Basic Words"
                    progress="Done"
                />
                <Level
                    level={2}
                    title="Common Phrases"
                    progress="Done"
                />
                <Level
                    level={3}
                    title="Daily Conversations"
                    progress="Done"
                />
                <Level
                    level={4}
                    title="Social Interactions"
                    progress="Now"
                />
                <Level
                    level={5}
                    title="Business Communication"
                    progress="Future"
                />
                <Level
                    level={6}
                    title="Advanced Vocabulary"
                    progress="Future"
                />
                <Level
                    level={7}
                    title="Complex Sentences"
                    progress="Future"
                />
                <Level
                    level={8}
                    title="Fluent Expression"
                    progress="Future"
                />
            </div>
        </main>
    )
}
