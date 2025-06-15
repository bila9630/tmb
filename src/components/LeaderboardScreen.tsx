import React from 'react';
import { useAtomValue } from 'jotai';
import { pointsAtom } from '@/store/points';

// Mock leaderboard data - in a real app, this would come from a backend
const mockLeaderboard = [
    { rank: 1, name: "Sarah", points: 450 },
    { rank: 2, name: "Mike", points: 420 },
    { rank: 3, name: "Emma", points: 380 },
    { rank: 4, name: "John", points: 350 },
    { rank: 5, name: "Lisa", points: 320 },
    { rank: 6, name: "Lisa", points: 320 },

];

interface LeaderboardScreenProps {
    onRetry: () => void;
}

export function LeaderboardScreen({ onRetry }: LeaderboardScreenProps) {
    const userPoints = useAtomValue(pointsAtom);

    // Calculate user's rank
    const userRank = mockLeaderboard.findIndex(entry => entry.points <= userPoints) + 1;
    // If user's score is lower than all entries, they're last
    const finalRank = userRank === 0 ? mockLeaderboard.length + 1 : userRank;

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
                            Rank #{finalRank} out of {mockLeaderboard.length + 1}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {mockLeaderboard.map((entry) => (
                            <div
                                key={entry.rank}
                                className={`flex items-center justify-between p-3 rounded-lg ${entry.points === userPoints ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${entry.rank <= 3 ? 'bg-yellow-400 text-white' : 'bg-gray-200'
                                        }`}>
                                        {entry.rank}
                                    </div>
                                    <span className="font-medium">{entry.name}</span>
                                </div>
                                <span className="font-semibold">{entry.points} pts</span>
                            </div>
                        ))}
                    </div>
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