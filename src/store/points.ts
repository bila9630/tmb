import { atom } from 'jotai';

export const pointsAtom = atom(0);

// Using Set to store unique task numbers that have been accomplished
export const accomplishedTasksAtom = atom<Set<number>>(new Set<number>());

// Using Set to store unique achievement numbers that have been accomplished
export const accomplishedAchievementsAtom = atom<Set<number>>(new Set<number>());

// Atom to store the user's name
export const userNameAtom = atom<string>(''); 