'use client';
import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import { pointsAtom, userNameAtom } from '@/store/points';
import { supabase } from '@/lib/supabaseClient';

interface FinishScreenProps {
    onContinue: () => void;
}

export function FinishScreen({ onContinue }: FinishScreenProps) {
    const finalPoints = useAtomValue(pointsAtom);
    const userName = useAtomValue(userNameAtom);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitEmail = async () => {
        setIsSubmitting(true);
        // Only insert email if it's provided
        const emailToInsert = email || null; // Use null if email is empty

        const { data, error } = await supabase
            .from('gamescore')
            .insert([
                { name: userName || 'Anonymous', score: finalPoints, email: emailToInsert },
            ]);

        if (error) {
            console.error('Error inserting score:', error);
            alert('Failed to save score. Please try again.');
        } else {
            console.log('Score saved:', data);
        }

        setIsSubmitting(false);
        onContinue();
    };

    return (
        <div className="flex flex-col items-center bg-white px-4 pt-10 min-h-screen">
            <div className="w-full max-w-xl flex flex-col gap-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                    Simulation Finished!
                </h2>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <span className="text-3xl mb-2">🏆</span>
                    <div className="font-semibold text-xl mb-1">Your Final Score: {finalPoints} Points!</div>
                    <div className="text-gray-500 text-center">
                        Congratulations on completing the Healthcare Challenge!
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <div className="font-semibold text-lg mb-2">Want to be notified if you win?</div>
                    <p className="text-gray-500 text-center mb-4">
                        Enter your email address below (optional).
                    </p>
                    <input
                        type="email"
                        className="border rounded px-4 py-2 w-full max-w-sm mb-4 text-center"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com (optional)"
                    />
                    <button
                        onClick={handleSubmitEmail}
                        className="bg-blue-600 text-white px-8 py-3 rounded font-semibold text-lg shadow hover:bg-blue-700 transition"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'View Leaderboard'}
                    </button>
                </div>
            </div>
        </div>
    );
} 