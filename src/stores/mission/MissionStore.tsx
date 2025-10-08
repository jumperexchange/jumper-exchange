'use client';
import {
  TaskType,
  TaskWidgetInformationChainData,
  TaskWidgetInformationInputData,
  TaskWidgetInformationTokenData,
  TaskWidgetInformationWalletData,
} from 'src/types/strapi';
import { createWithEqualityFn } from 'zustand/traditional';

export interface TaskFormState {
  hasForm: boolean;
  isFormValid: boolean;
}

interface MissionState {
  currentActiveTaskId?: string;
  currentActiveTaskType?: TaskType;
  currentActiveTaskName?: string;

  isCurrentActiveTaskCompleted: boolean;
  setIsCurrentActiveTaskCompleted: (isCompleted: boolean) => void;

  taskFormStates: Record<string, TaskFormState>;
  setTaskFormState: (
    taskId: string,
    hasForm: boolean,
    isFormValid: boolean,
  ) => void;
  getTaskFormState: (taskId: string) => {
    hasForm: boolean;
    isFormValid: boolean;
  };
  initializeTaskFormStates: (formStates: Record<string, TaskFormState>) => void;

  taskTitle?: string;
  taskDescription?: string;
  taskDescriptionCTAText?: string;
  taskDescriptionCTALink?: string;
  taskCTAText?: string;
  taskCTALink?: string;
  taskInputs?: TaskWidgetInformationInputData[];

  destinationChain?: TaskWidgetInformationChainData;
  destinationToken?: TaskWidgetInformationTokenData;

  sourceChain?: TaskWidgetInformationChainData;
  sourceToken?: TaskWidgetInformationTokenData;

  allowBridge?: string | null;
  allowExchange?: string | null;

  fromAmount?: string;

  toAddress?: TaskWidgetInformationWalletData;

  missionChainIds?: number[];
  missionId?: string;
  missionType?: string;

  setCurrentTaskWidgetFormParams: ({
    allowBridge,
    allowExchange,
    destinationChain,
    destinationToken,
    sourceChain,
    sourceToken,
    fromAmount,
    toAddress,
  }: {
    allowBridge?: string | null;
    allowExchange?: string | null;
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
    taskDescriptionCTALink,
    taskDescriptionCTAText,
    taskCTALink,
    taskCTAText,
    taskInputs,
  }: {
    taskTitle?: string;
    taskDescription?: string;
    taskDescriptionCTALink?: string;
    taskDescriptionCTAText?: string;
    taskCTAText?: string;
    taskCTALink?: string;
    taskInputs?: TaskWidgetInformationInputData[];
  }) => void;

  setCurrentActiveTask: (
    taskId: string,
    taskType: TaskType,
    taskName: string,
  ) => void;

  setMissionDefaults: (
    chainIds?: number[],
    missionId?: string,
    missionType?: string,
  ) => void;

  resetCurrentActiveTask: () => void;
}

export const useMissionStore = createWithEqualityFn<MissionState>(
  (set, get) => ({
    currentActiveTaskId: undefined,
    currentActiveTaskType: undefined,
    currentActiveTaskName: undefined,

    isCurrentActiveTaskCompleted: false,
    setIsCurrentActiveTaskCompleted: (isCurrentActiveTaskCompleted) =>
      set({ isCurrentActiveTaskCompleted }),

    taskFormStates: {},
    setTaskFormState: (taskId, hasForm, isFormValid) =>
      set((state) => ({
        taskFormStates: {
          ...state.taskFormStates,
          [taskId]: { hasForm, isFormValid },
        },
      })),
    getTaskFormState: (taskId) => {
      const state = get();
      return (
        state.taskFormStates[taskId] || { hasForm: false, isFormValid: true }
      );
    },
    initializeTaskFormStates: (formStates) => {
      set({ taskFormStates: formStates });
    },

    destinationChain: undefined,
    destinationToken: undefined,

    sourceChain: undefined,
    sourceToken: undefined,

    allowBridge: undefined,
    allowExchange: undefined,

    fromAmount: undefined,

    toAddress: undefined,

    missionChainIds: [],
    missionId: undefined,
    missionType: undefined,

    setCurrentActiveTask: (
      currentActiveTaskId,
      currentActiveTaskType,
      currentActiveTaskName,
    ) =>
      set({
        currentActiveTaskId,
        currentActiveTaskType,
        currentActiveTaskName,
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

    resetCurrentActiveTask: () =>
      set({
        currentActiveTaskId: undefined,
        currentActiveTaskType: undefined,
        currentActiveTaskName: undefined,
        isCurrentActiveTaskCompleted: false,
        taskFormStates: {},
      }),
  }),
  Object.is,
);
