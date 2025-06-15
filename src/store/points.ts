import { atom } from 'jotai';

export const pointsAtom = atom(0);

// Using Set to store unique task numbers that have been accomplished
export const accomplishedTasksAtom = atom<Set<number>>(new Set<number>()); 