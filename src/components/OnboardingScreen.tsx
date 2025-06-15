'use client';
import React from 'react';

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
    return (
        <div className="flex flex-col items-center bg-white px-4 pt-10 min-h-screen">
            <div className="w-full max-w-xl flex flex-col gap-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                    How to play the Healthcare Challenge
                </h2>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <span className="text-2xl mb-2">👴</span>
                    <div className="font-semibold text-lg mb-1">Meet Mr. Bauer</div>
                    <div className="text-gray-500 text-center">
                        You are the nurse. Mr. Bauer is your elderly patient. He's quirky, sometimes sarcastic, but never mean. Your goal: make his birthday special and take care of his needs!
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <span className="text-2xl mb-2">🎤</span>
                    <div className="font-semibold text-lg mb-1">Talk to Mr. Bauer</div>
                    <div className="text-gray-500 text-center">
                        Use your voice to interact. Ask questions, check on his comfort, medicine, and hygiene. Try to make him laugh!
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <span className="text-2xl mb-2">🏆</span>
                    <div className="font-semibold text-lg mb-1">Earn Points & Achievements</div>
                    <div className="text-gray-500 text-center">
                        You'll earn points for positive, funny, or helpful actions. Complete hidden achievements for bonus points. Can you get the highest score?
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <span className="text-2xl mb-2">⏰</span>
                    <div className="font-semibold text-lg mb-1">Time is ticking!</div>
                    <div className="text-gray-500 text-center">
                        You have <span className="font-bold">60 seconds</span> to complete the challenge. Make every moment count!
                    </div>
                </div>
            </div>
            <button
                className="mt-10 mb-6 bg-blue-600 text-white px-8 py-3 rounded font-semibold text-lg shadow hover:bg-blue-700 transition"
                onClick={onDone}
            >
                Got it! <span role="img" aria-label="lightbulb">💡</span>
            </button>
        </div>
    );
} 