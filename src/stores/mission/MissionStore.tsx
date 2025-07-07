'use client';
import {
  TaskWidgetInformationChainData,
  TaskWidgetInformationWalletData,
  TaskWidgetInformationTokenData,
  TaskType,
  TaskWidgetInformationInputData,
} from 'src/types/loyaltyPass';
import { createWithEqualityFn } from 'zustand/traditional';

interface MissionState {
  currentActiveTaskId?: string;
  currentActiveTaskType?: TaskType;

  taskTitle?: string;
  taskDescription?: string;
  taskCTAText?: string;
  taskCTALink?: string;
  taskInputs?: TaskWidgetInformationInputData[];

  destinationChain?: TaskWidgetInformationChainData;
  destinationToken?: TaskWidgetInformationTokenData;

  sourceChain?: TaskWidgetInformationChainData;
  sourceToken?: TaskWidgetInformationTokenData;

  fromAmount?: string;

  toAddress?: TaskWidgetInformationWalletData;

  missionChainIds?: number[];
  missionId?: string;
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

  setCurrentTaskInstructionParams: ({
    taskTitle,
    taskDescription,
    taskCTALink,
    taskCTAText,
    taskInputs,
  }: {
    taskTitle?: string;
    taskDescription?: string;
    taskCTAText?: string;
    taskCTALink?: string;
    taskInputs?: TaskWidgetInformationInputData[];
  }) => void;

  setCurrentActiveTask: (taskId: string, taskType: TaskType) => void;

  setMissionDefaults: (
    chainIds?: number[],
    missionId?: string,
    missionType?: string,
  ) => void;

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
    missionId: undefined,
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

    setCurrentTaskInstructionParams: (params) =>
      set({
        ...params,
      }),

    setMissionDefaults: (missionChainIds, missionId, missionType) =>
      set({
        missionChainIds,
        missionId,
        missionType,
      }),

    isMissionCompleted: false,
    setIsMissionCompleted: (isMissionCompleted) => set({ isMissionCompleted }),
  }),
  Object.is,
);
