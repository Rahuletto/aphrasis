"use client";
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { BsSoundwave } from 'react-icons/bs';

const targetPhrases = {
    "4": "A quick fox jumped on a wall"
};

export default function Level() {
    const { id } = useParams();
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [similarityScore, setSimilarityScore] = useState<number | null>(null);
    const targetPhrase = targetPhrases[id as keyof typeof targetPhrases] || '';

    const calculateSimilarity = (str1: string, str2: string): number => {
        const words1 = str1.toLowerCase().split(' ');
        const words2 = str2.toLowerCase().split(' ');
        const commonWords = words1.filter(word => words2.includes(word));
        return (commonWords.length * 2) / (words1.length + words2.length) * 100;
    };

    const startListening = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setTranscript(transcript);
                const score = calculateSimilarity(transcript, targetPhrase);
                setSimilarityScore(score);
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        } else {
            alert('Speech recognition is not supported in this browser.');
        }
    };

    return (
        <main className='w-screen min-h-screen bg-white font-display flex items-center justify-center py-24'>
            <div className='fixed top-0 left-0 w-screen px-[36px] py-[32px] flex flex-col z-20 bg-primary'>
                <h1 className='text-2xl font-bold text-white'>Level {id}</h1>
                <p className='opacity-70 text-white font-semibold'>Let&apos;s practice speaking</p>
            </div>

            <div className='flex flex-col gap-6 mt-8 items-center h-full justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <p className='opacity-60'>Let&apos;s try this</p>
                    <h2 className='text-3xl font-semibold text-center mx-12'>{targetPhrase}</h2>
                </div>


                <div className='flex items-center justify-center w-full absolute left-0 bottom-24'>
                    {similarityScore !== null ? 
                        <div className='px-5 py-3 rounded-full bg-red flex items-center gap-3 justify-between'>
                            <span>Similarity:</span>
                            <span className='font-bold text-xl'>{similarityScore.toFixed(1)}%</span>
                        </div>
                    : <button
                        onClick={startListening}
                        disabled={isListening}
                        className={`h-18 w-18 rounded-[30px] bg-red ${isListening ? "animate-padding opacity-80" : ""} text-white flex absolute items-center justify-center`}
                    >
                        <BsSoundwave className="text-4xl" />
                    </button>}

                </div>

                {transcript && (
                    <div className='bg-gray-100 px-6 py-2 border-l-2 border-l-gray-600'>
                        <h1 className='font-semibold text-lg'>You said:</h1>
                        <p className='text-base italic'>{transcript}</p>
                    </div>
                )}

            </div>
        </main>
    )
}
