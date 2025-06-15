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
import { pointsAtom, accomplishedTasksAtom, accomplishedAchievementsAtom, userNameAtom, pointPopUpAtom } from '@/store/points';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { useAtomValue } from 'jotai';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { FinishScreen } from '@/components/FinishScreen';
import { LeaderboardScreen } from '@/components/LeaderboardScreen';
import { PointPopUp } from '@/components/PointPopUp';
import { Toaster, toast } from "sonner";

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
  description: 'Unlock achievement and award points',
  parameters: z.object({
    achievement: z.number().describe("Either 1, 2 or 3"),
  }),
  execute: ({ achievement }) => {
    // Get current accomplished achievements
    const accomplishedAchievements = store.get(accomplishedAchievementsAtom);

    // If achievement is already accomplished, return early
    if (accomplishedAchievements.has(achievement)) {
      return `Achievement ${achievement} was already unlocked`;
    }

    // Award points based on achievement
    let points = 0;
    switch (achievement) {
      case 1: // most memorable birthday
        points = 100;
        break;
      case 2: // Compliment looks
        points = 75;
        break;
      case 3: // Yell in frustration
        points = 80;
        break;
    }

    // Update both atoms
    store.set(pointsAtom, prev => prev + points);
    store.set(accomplishedAchievementsAtom, prev => {
      const newSet = new Set(prev);
      newSet.add(achievement);
      return newSet;
    });

    if (achievement === 2) {
      toast.success("Achievement Dr. McDreamy!", {
        description: `Flirt mode unlocked, + ${points}`,
        duration: 5000,
      });
    } else if (achievement === 1) {
      toast.success("Achievement Nostalgia Navigator!", {
        description: `Unveiling memories, + ${points} points`,
        duration: 5000,
      });
    } else if (achievement === 3) {
      toast.success("Achievement Gordon Ramsey!", {
        description: `Emotional release, + ${points} points`,
        duration: 5000,
      });
    } else {
      toast.success(`Achievement ${achievement} unlocked! You gained ${points} points.`, {
        duration: 5000,
      });
    }

    return `Achievement ${achievement} unlocked`;
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
    store.set(pointPopUpAtom, { value: points, id: Date.now() });

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
    - Task 1: Its accomplished when the user sings happy birthday (example: happy birthday to you, etc.)
    - Task 2: Check if Mr. Bauer took his medicines (example: Did you take your medicine, etc.)
    - Task 3: Check if Mr. Bauer hygiene (example: Did you brush your teeth, comb your hair, etc.)

    There are hidden achievements user can achieve and you can call achievementTool 
    once the user fulfills the condition:
    - Achievement 1: Ask him about his most memorable birthday
    - Achievement 2: Compliment the patients looks
    - Achievement 3: Yell in frustration

    Dont mention anything regarding points. It should happen behind the scene.
    It's really important that you give the users points 
    `,
  tools: [weatherTool, addPointTool, accomplishTaskTool, achievementTool],
});

export default function Home() {
  const userName = useAtomValue(userNameAtom);
  const [started, setStarted] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute countdown

  const session = useRef<RealtimeSession<any> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [events, setEvents] = useState<TransportEvent[]>([]);
  const [history, setHistory] = useState<RealtimeItem[]>([]);

  const resetGame = () => {
    setStarted(false);
    setOnboarded(false);
    setFinished(false);
    setShowLeaderboard(false);
    setTimeLeft(60); // Reset timer as well
    // Reset any other game state if needed
    store.set(pointsAtom, 0);
    store.set(accomplishedTasksAtom, new Set());
    store.set(accomplishedAchievementsAtom, new Set());
  };

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

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isConnected && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isConnected) {
      // Time's up, disconnect and go to finish screen
      session.current?.close();
      setIsConnected(false);
      setFinished(true);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isConnected, timeLeft, setFinished]);

  async function connect() {
    if (isConnected) {
      await session.current?.close();
      setIsConnected(false);
      setTimeLeft(60); // Reset timer on disconnect
    } else {
      const token = await getToken();
      try {
        await session.current?.connect({
          apiKey: token,
        });
        setIsConnected(true);
        setTimeLeft(60); // Start timer on connect
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

  if (!userName || !started) {
    return <WelcomeScreen onStart={() => setStarted(true)} />;
  }

  if (!onboarded) {
    return <OnboardingScreen onDone={() => setOnboarded(true)} />;
  }

  if (showLeaderboard) {
    return <LeaderboardScreen onRetry={resetGame} />;
  }

  if (finished) {
    return <FinishScreen onContinue={() => setShowLeaderboard(true)} />;
  }

  return (
    <>
      <App
        isConnected={isConnected}
        isMuted={isMuted}
        toggleMute={toggleMute}
        connect={connect}
        history={history}
        events={events}
        onFinish={() => setFinished(true)}
        timeLeft={timeLeft}
      />
      <PointPopUp />
      <Toaster position="top-center" />
    </>
  );
}
