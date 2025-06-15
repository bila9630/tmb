import { useAtom } from 'jotai';
import { accomplishedTasksAtom } from '@/store/points';

// Tasks display component
export function TasksDisplay() {
    const tasks = [
        { id: 1, description: "Sing happy birthday" },
        { id: 2, description: "Check if Mr. Bauer took his medicines" },
        { id: 3, description: "Check if he comb his hair" }
    ];
    const [accomplishedTasks] = useAtom(accomplishedTasksAtom);

    return (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h3 className="font-semibold text-lg mb-2">Tasks:</h3>
            <ul className="space-y-2">
                {tasks.map((task) => (
                    <li key={task.id} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${accomplishedTasks.has(task.id) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className={`${accomplishedTasks.has(task.id) ? 'line-through text-gray-500' : ''}`}>{task.description}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
} 