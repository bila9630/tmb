'use client';

import {
  RealtimeAgent,
  RealtimeSession,
  tool,
  TransportEvent,
  RealtimeItem,
} from '@openai/agents/realtime';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { getToken } from './server/token';
import { App } from '@/components/App';
import { getDefaultStore } from 'jotai';
import { pointsAtom } from '@/store/points';

const store = getDefaultStore();

const weatherTool = tool({
  name: 'weather',
  description: 'Get the weather in a given location',
  parameters: z.object({
    location: z.string(),
  }),
  execute: async ({ location }) => {
    return `The weather in ${location} is sunny.`;
  },
});

const achievementTool = tool({
  name: 'unlock_achievement',
  description: 'Unlock achievement for user',
  parameters: z.object({
    achievement: z.string().describe("Either achievement 1, 2 or 3"),
  }),
  execute: ({ achievement }) => {
    // TODO: Implement unlock achievement here
    return `The user unlocked the ${achievement}`;
  },
});

const addPointTool = tool({
  name: 'add_point',
  description: 'Give point to user',
  parameters: z.object({
    point: z.number().describe("Point to give to user"),
  }),
  execute: ({ point }) => {
    store.set(pointsAtom, prev => prev + point);
    return `Added ${point} points to the user`;
  },
});

const accomplishTaskTool = tool({
  name: 'accomplish_task',
  description: 'Unlock achievement for user',
  parameters: z.object({
    task: z.string().describe("Either task 1, 2 or 3"),
  }),
  execute: ({ task }) => {
    console.log(task)
    // TODO: Implement accomplishTask here
    return `The user accomplished the ${task}`;
  },
});

const agent = new RealtimeAgent({
  name: 'Elderly Person',
  instructions:
    `you are a helpful assistant. Give user the point he wants`,
  // tools: [weatherTool, achievementTool, addPointTool, accomplishTaskTool],
  tools: [weatherTool, addPointTool],
});


export default function Home() {
  const session = useRef<RealtimeSession<any> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [events, setEvents] = useState<TransportEvent[]>([]);
  const [history, setHistory] = useState<RealtimeItem[]>([]);

  useEffect(() => {
    session.current = new RealtimeSession(agent);
    session.current.on('transport_event', (event) => {
      setEvents((events) => [...events, event]);
    });
    session.current.on('history_updated', (history) => {
      setHistory(history);
    });
    session.current.on(
      'tool_approval_requested',
      (_context, _agent, approvalRequest) => {
        // You'll be prompted when making the tool call that requires approval in web browser.
        const approved = confirm(
          `Approve tool call to ${approvalRequest.tool.name} with parameters:\n ${JSON.stringify(approvalRequest.tool.parameters, null, 2)}?`,
        );
        if (approved) {
          session.current?.approve(approvalRequest.approvalItem);
        } else {
          session.current?.reject(approvalRequest.approvalItem);
        }
      },
    );
  }, []);

  async function connect() {
    if (isConnected) {
      await session.current?.close();
      setIsConnected(false);
    } else {
      const token = await getToken();
      try {
        await session.current?.connect({
          apiKey: token,
        });
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting to session', error);
      }
    }
  }

  async function toggleMute() {
    if (isMuted) {
      await session.current?.mute(false);
      setIsMuted(false);
    } else {
      await session.current?.mute(true);
      setIsMuted(true);
    }
  }

  return (
    <App
      isConnected={isConnected}
      isMuted={isMuted}
      toggleMute={toggleMute}
      connect={connect}
      history={history}
      events={events}
    />
  );
}
