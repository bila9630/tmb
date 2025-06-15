import {
  RealtimeItem,
  TransportEvent,
} from '@openai/agents/realtime';
import { History } from '@/components/History';
import { Button } from '@/components/ui/Button';
import { LogsSheet } from "@/components/LogsSheet";
import { TasksDisplay } from "@/components/TasksDisplay";
import { useAtom } from 'jotai';
import { pointsAtom } from '@/store/points';
import { accomplishedTasksAtom } from '@/store/points';

// Points display component
function PointsDisplay() {
  const [points] = useAtom(pointsAtom);
  return (
    <div className="font-semibold text-lg">
      Point: {points}
    </div>
  );
}

export type AppProps = {
  isConnected: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  connect: () => void;
  history?: RealtimeItem[];
  events: TransportEvent[];
  onFinish: () => void;
  timeLeft: number;
};

export function App({
  isConnected,
  isMuted,
  toggleMute,
  connect,
  history,
  events,
  onFinish,
  timeLeft,
}: AppProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col h-screen p-4 items-center">
      <div className="w-full max-w-xl flex justify-between items-center mb-4">
        <PointsDisplay />
        <div className="font-semibold text-lg">{formatTime(timeLeft)}</div>
      </div>

      <div className="flex flex-col flex-grow w-full max-w-xl gap-4">
        {/* Image of Person Section */}
        <div className="bg-white rounded-lg shadow p-4 h-[200px] flex items-center justify-center border border-gray-200">
          <img src="/person/happy.png" alt="Person" className="w-full h-full object-contain" />
        </div>

        {/* Tasks Section */}
        <TasksDisplay />

        {/* Chat Window Section */}
        <div className="bg-white rounded-lg shadow p-4 h-[400px] overflow-y-auto border border-gray-200">
          {history ? (
            <History history={history} />
          ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
              No history available
            </div>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row w-full max-w-xl mt-4 gap-1">
        {/* Mute and Connect container (Row 1 on mobile) */}
        <div className="flex flex-1 gap-1">
          {isConnected && (
            <Button
              onClick={toggleMute}
              variant={isMuted ? 'primary' : 'outline'}
              className="flex-1"
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
          )}
          <Button
            onClick={connect}
            variant={isConnected ? 'stop' : 'primary'}
            className="flex-1"
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>

        {/* See logs and Finish container (Row 2 on mobile) */}
        <div className="flex flex-1 gap-1">
          {/* <div className="flex-1">
            <LogsSheet events={events} />
          </div> */}
          <Button
            onClick={onFinish}
            variant="outline"
            className="flex-1"
          >
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
}
