import React, { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { pointsAtom, userNameAtom } from '@/store/points';
import { supabase } from '@/lib/supabaseClient';

interface LeaderboardScreenProps {
    onRetry: () => void;
}

export function LeaderboardScreen({ onRetry }: LeaderboardScreenProps) {
    const userPoints = useAtomValue(pointsAtom);
    const userName = useAtomValue(userNameAtom);
    const [leaderboardData, setLeaderboardData] = useState<Array<{ name: string; score: number }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLeaderboard() {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from('gamescore')
                .select('name, score')
                .order('score', { ascending: false });

            if (error) {
                console.error('Error fetching leaderboard:', error);
                setError('Failed to load leaderboard. Please try again later.');
            } else {
                setLeaderboardData(data || []);
            }
            setLoading(false);
        }

        fetchLeaderboard();
    }, []); // Removed userPoints from dependency array as it's now in DB

    // Calculate user's rank from the fetched data based on both name and score
    const userRank = leaderboardData.findIndex(entry => entry.score === userPoints && entry.name === userName) + 1;

    return (
        <div className="flex flex-col items-center bg-white px-4 pt-10 min-h-screen">
            <div className="w-full max-w-xl flex flex-col gap-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                    Leaderboard
                </h2>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <div className="text-center font-semibold text-lg mb-1">Your Performance</div>
                        <div className="text-center text-2xl font-bold text-blue-600 mb-2">{userPoints} Points</div>
                        <div className="text-center text-lg font-medium">
                            Rank #{userRank} out of {leaderboardData.length}
                        </div>
                    </div>

                    {loading && <p className="text-center text-gray-600">Loading leaderboard...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}

                    {!loading && !error && (
                        <div className="space-y-3">
                            {leaderboardData.map((entry, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between p-3 rounded-lg ${(entry.score === userPoints && entry.name === userName) ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index < 3 ? 'bg-yellow-400 text-white' : 'bg-gray-200'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <span className="font-medium">{entry.name}</span>
                                    </div>
                                    <span className="font-semibold">{entry.score} pts</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={onRetry}
                    className="my-4 bg-blue-600 text-white px-8 py-3 rounded font-semibold text-lg shadow hover:bg-green-700 transition w-full max-w-sm mx-auto"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
} 