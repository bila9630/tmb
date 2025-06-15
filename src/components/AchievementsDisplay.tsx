import { useAtom } from 'jotai';
import { accomplishedAchievementsAtom } from '@/store/points';

export function AchievementsDisplay() {
    const achievements = [
        { id: 1, description: "Ask him about his most memorable birthday" },
        { id: 2, description: "Compliment the patients looks" },
        { id: 3, description: "Yell in frustration" }
    ];
    const [accomplishedAchievements] = useAtom(accomplishedAchievementsAtom);

    return (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h3 className="font-semibold text-lg mb-2">Hidden Achievements:</h3>
            <ul className="space-y-2">
                {achievements.map((achievement) => (
                    <li key={achievement.id} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${accomplishedAchievements.has(achievement.id) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className={`${accomplishedAchievements.has(achievement.id) ? 'line-through text-gray-500' : ''}`}>{achievement.description}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
} 