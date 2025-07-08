'use client';
import {
  TaskType,
  TaskWidgetInformationChainData,
  TaskWidgetInformationWalletData,
  TaskWidgetInformationTokenData,
} from 'src/types/strapi';
import { createWithEqualityFn } from 'zustand/traditional';

interface MissionState {
  currentActiveTaskId?: string;
  currentActiveTaskType?: TaskType;

  destinationChain?: TaskWidgetInformationChainData;
  destinationToken?: TaskWidgetInformationTokenData;

  sourceChain?: TaskWidgetInformationChainData;
  sourceToken?: TaskWidgetInformationTokenData;

  fromAmount?: string;

  toAddress?: TaskWidgetInformationWalletData;

  missionChainIds?: number[];
  missionType?: string;

  setCurrentTaskWidgetFormParams: ({
    destinationChain,
    destinationToken,
    sourceChain,
    sourceToken,
    fromAmount,
    toAddress,
  }: {
    destinationChain?: TaskWidgetInformationChainData;
    destinationToken?: TaskWidgetInformationTokenData;
    sourceChain?: TaskWidgetInformationChainData;
    sourceToken?: TaskWidgetInformationTokenData;
    fromAmount?: string;
    toAddress?: TaskWidgetInformationWalletData;
  }) => void;

  setCurrentActiveTask: (taskId: string, taskType: TaskType) => void;

  setMissionDefaults: (chainIds?: number[], missionType?: string) => void;

  isMissionCompleted: boolean;
  setIsMissionCompleted: (isCompleted: boolean) => void;
}

export const useMissionStore = createWithEqualityFn<MissionState>(
  (set) => ({
    currentActiveTaskId: undefined,
    currentActiveTaskType: undefined,

    destinationChain: undefined,
    destinationToken: undefined,

    sourceChain: undefined,
    sourceToken: undefined,

    fromAmount: undefined,

    toAddress: undefined,

    missionChainIds: [],
    missionType: undefined,

    setCurrentActiveTask: (currentActiveTaskId, currentActiveTaskType) =>
      set({
        currentActiveTaskId,
        currentActiveTaskType,
      }),

    setCurrentTaskWidgetFormParams: (params) =>
      set({
        ...params,
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
