'use client';
import { createWithEqualityFn } from 'zustand/traditional';

interface MissionState {
  currentActiveTaskId?: string;
  currentActiveTaskType?: string;

  destinationChainId?: number;
  destinationTokenAddress?: string;

  sourceChainId?: number;
  sourceTokenAddress?: string;

  missionChainIds?: number[];
  missionType?: string;

  setCurrentActiveTask: (taskId: string, taskType: string) => void;

  setMissionDefaults: (chainIds?: number[], missionType?: string) => void;

  isMissionCompleted: boolean;
  setIsMissionCompleted: (isCompleted: boolean) => void;
}

export const useMissionStore = createWithEqualityFn<MissionState>(
  (set, get) => ({
    currentActiveTaskId: undefined,
    currentActiveTaskType: undefined,

    destinationChainId: undefined,
    destinationTokenAddress: undefined,

    sourceChainId: undefined,
    sourceTokenAddress: undefined,

    missionChainId: undefined,
    missionType: undefined,

    setCurrentActiveTask: (currentActiveTaskId, currentActiveTaskType) =>
      set({
        currentActiveTaskId,
        currentActiveTaskType,
      }),

    setMissionDefaults: (missionChainIds, missionType) =>
      set({
        missionChainIds,
        missionType,
      }),

    isMissionCompleted: false,
    setIsMissionCompleted: (isMissionCompleted) => set({ isMissionCompleted }),
  }),
  Object.is,
);
