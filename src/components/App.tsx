import {
  RealtimeItem,
  TransportEvent,
} from '@openai/agents/realtime';
import { History } from '@/components/History';
import { Button } from '@/components/ui/Button';
import { LogsSheet } from "@/components/LogsSheet";

export type AppProps = {
  title?: string;
  isConnected: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  connect: () => void;
  history?: RealtimeItem[];
  events: TransportEvent[];
};

export function App({
  title = 'Healthcare Challenge',
  isConnected,
  isMuted,
  toggleMute,
  connect,
  history,
  events,
}: AppProps) {
  return (
    <div className="flex justify-center">
      <div className="p-4 md:max-h-screen overflow-hidden h-screen flex flex-col max-w-6xl w-full">
        <header className="flex-none flex justify-between items-center pb-4 w-full max-w-6xl">
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
          </div>
        </header>
        <div className="flex gap-10 flex-col md:flex-row h-full max-h-full overflow-y-hidden">
          <div className="flex-2/3 flex-grow overflow-y-scroll pb-24">
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
