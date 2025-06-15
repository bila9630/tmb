'use client'
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { userNameAtom } from '@/store/points';

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
    const [name, setName] = useState('');
    const setUserName = useSetAtom(userNameAtom);

    const handleStart = () => {
        if (name.trim()) {
            setUserName(name.trim());
            onStart();
        }
    };

    return (
        <div className="flex flex-col items-center bg-white px-4 pt-10 min-h-screen">
            <div className="w-full max-w-md flex flex-col items-center">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">Welcome to the Healthcare Challenge!</h1>
                <p className="mb-20 text-gray-600 text-center text-base md:text-lg">
                    Simulate your life as a nurse and help Mr. Bauer
                </p>
                <label className="text-lg mb-3 text-center" htmlFor="name">What is your name?</label>
                <input
                    id="name"
                    className="border rounded px-4 py-2 w-full mb-2 text-center text-base"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                />
                <p className="mb-40 text-gray-600 text-center text-base">
                    Achieve the highest score this month and <span className="text-green-600 font-semibold">win $10!</span>
                </p>
                <button
                    type="button"
                    onClick={handleStart}
                    className="w-full bg-blue-600 text-white px-8 py-2 rounded font-semibold text-base md:text-lg shadow hover:bg-blue-700 transition mb-4"
                >
                    Start simulation 🚀
                </button>
                <p className="text-xs text-gray-400 text-center max-w-md">
                    By starting, you agree to our Terms and Conditions and Privacy Policy.
                </p>
            </div>
        </div>
    );
} 