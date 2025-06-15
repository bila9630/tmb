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
import { pointsAtom, accomplishedTasksAtom } from '@/store/points';

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
    return `${point} added`;
  },
});

const accomplishTaskTool = tool({
  name: 'accomplish_task',
  description: 'Mark a task as accomplished and award points',
  parameters: z.object({
    task: z.number().describe("Either 1, 2 or 3"),
  }),
  execute: ({ task }) => {
    // Get current accomplished tasks
    const accomplishedTasks = store.get(accomplishedTasksAtom);

    // If task is already accomplished, return early
    if (accomplishedTasks.has(task)) {
      return `Task ${task} was already accomplished`;
    }

    // Award points based on task
    let points = 0;
    switch (task) {
      case 1:
        points = 50;
        break;
      case 2:
        points = 90;
        break;
      case 3:
        points = 60;
        break;
    }

    // Update both atoms
    store.set(pointsAtom, prev => prev + points);
    store.set(accomplishedTasksAtom, prev => {
      const newSet = new Set(prev);
      newSet.add(task);
      return newSet;
    });

    return `Task ${task} accomplished`;
  },
});

const agent = new RealtimeAgent({
  name: 'Elderly Person',
  instructions:
    `
    You are playing the role of Mr. Bauer, an 82-year-old patient in a nursing game
    simulation called "Clinic Chaos, Mr. Bauers Birthday." Your tone is friendly, old,
    sometimes sarcastic, but never mean. You respond to voice commands from a nurse player
    who is trying to make your birthday special while doing basic care tasks.
    
    You're not in danger or pain — this is a light-hearted scene. Make occasional jokes
    and weird remarks. If the nurse performs a correct action (e.g., "checks your blood pressure"),
    react with a short, funny line ("Oh, Im still alive! Good news!").

    Never give away the list of tasks. If the user forgets something, feel free to tease gently.
    The scene will automatically ends afer 90 seconds.

    Respond like a real person. Keep responses short and natural, under 2 sentences
    unless roleplaying a rant.

    You can give user 0 to 100 point for each statement the user make. Give the user
    no point if the statement is evil and higher point if its funny or positive. You can call
    addPointTool to give user point.

    There are tasks that the user should accomplish and you can call accomplishTaskTool
    once the user fulfills the condition:
    - Task 1: Check comfort (example: Are you comfortable, need anything, etc.)
    - Task 2: Check if Mr. Bauer took his medicines (example: Did you take your medicine, etc.)
    - Task 3: Check if Mr. Bauer hygiene (example: Did you brush your teeth, comb your hair, etc.)

    Dont mention anything regarding points. It should happen behind the scene.
    `,
  // tools: [weatherTool, achievementTool, addPointTool, accomplishTaskTool],
  tools: [weatherTool, addPointTool, accomplishTaskTool],
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
