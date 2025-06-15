import {
  RealtimeItem,
  TransportEvent,
} from '@openai/agents/realtime';
import { History } from '@/components/History';
import { Button } from '@/components/ui/Button';
import { LogsSheet } from "@/components/LogsSheet";
import { useAtom } from 'jotai';
import { pointsAtom } from '@/store/points';

// Points display component
function PointsDisplay() {
  const [points] = useAtom(pointsAtom);
  return (
    <div className="flex items-center justify-center">
      <div className="bg-primary/10 px-4 py-2 rounded-full">
        <span className="text-lg font-semibold">Points: {points}</span>
      </div>
    </div>
  );
}

export type AppProps = {
  title?: string;
  isConnected: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  connect: () => void;
  history?: RealtimeItem[];
  events: TransportEvent[];
  onFinish: () => void;
};

export function App({
  title = 'Healthcare Challenge',
  isConnected,
  isMuted,
  toggleMute,
  connect,
  history,
  events,
  onFinish,
}: AppProps) {
  return (
    <div className="flex justify-center">
      <div className="p-4 md:max-h-screen overflow-hidden h-screen flex flex-col max-w-6xl w-full">
        <header className="flex-none flex flex-col gap-4 pb-4 w-full max-w-6xl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex gap-2 items-center">
              <LogsSheet events={events} />
              {isConnected && (
                <Button
                  onClick={toggleMute}
                  variant={isMuted ? 'primary' : 'outline'}
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>
              )}
              <Button
                onClick={connect}
                variant={isConnected ? 'stop' : 'primary'}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </Button>
              <Button
                onClick={onFinish}
                variant="outline"
              >
                Finish
              </Button>
            </div>
          </div>
          <PointsDisplay />
        </header>
        <div className="flex gap-10 flex-col md:flex-row h-full max-h-full overflow-y-hidden">
          <div className="flex-1 overflow-y-scroll pb-24">
            {history ? (
              <History history={history} />
            ) : (
              <div className="h-full flex items-center justify-center text-center text-gray-500">
                No history available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
