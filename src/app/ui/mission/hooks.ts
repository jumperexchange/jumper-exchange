import { useAccount } from '@lifi/wallet-management';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useGetVerifiedTasks } from 'src/hooks/tasksVerification/useGetVerifiedTasks';
import { useVerifyTask } from 'src/hooks/tasksVerification/useVerifyTask';
import { useUserTracking } from 'src/hooks/userTracking/useUserTracking';
import { useMissionStore } from 'src/stores/mission/MissionStore';
import {
  TaskVerificationStatus,
  useTaskVerificationStatusStore,
} from 'src/stores/taskVerificationStatus/TaskVerificationStatusStore';
// import { useSdkConfigStore } from 'src/stores/sdkConfig/SDKConfigStore';
import {
  ParticipantChain,
  type TaskVerificationWithApy,
} from 'src/types/loyaltyPass';
import { TaskType } from 'src/types/strapi';

export const useSyncMissionDefaultsFromChains = (
  participatingChains?: ParticipantChain[],
  missionId?: string,
) => {
  const { setMissionDefaults } = useMissionStore();

  const participatingChainsIds = useMemo(() => {
    if (!participatingChains) {
      return [];
    }
    return [
      ...new Set(
        participatingChains
          .map((participatingChain) => participatingChain.id)
          .filter(Boolean),
      ),
    ];
  }, [participatingChains]);

  useEffect(() => {
    if (participatingChainsIds) {
      setMissionDefaults(participatingChainsIds, missionId);
    }
  }, [participatingChainsIds, missionId, setMissionDefaults]);
};

export const useEnhancedTasks = (
  tasks: TaskVerificationWithApy[],
  accountAddress?: string,
) => {
  const { data: verifiedTasks = [] } = useGetVerifiedTasks(accountAddress);
  //   const { setConfigType, configType } = useSdkConfigStore();

  const verifiedTaskIds = useMemo(() => {
    return new Set(verifiedTasks?.map((v) => v.stepId));
  }, [verifiedTasks]);

  const firstUnverifiedTask = useMemo(() => {
    return (
      tasks.find((task) => task.hasTask && !verifiedTaskIds.has(task.uuid)) ||
      tasks[0]
    );
  }, [tasks, verifiedTaskIds]);

  const {
    isMissionCompleted,
    setIsMissionCompleted,
    setCurrentActiveTask,
    setCurrentTaskWidgetFormParams,
    setCurrentTaskInstructionParams,
    currentActiveTaskId,
  } = useMissionStore();

  const handleSetActiveTask = useCallback(
    (task: TaskVerificationWithApy) => {
      const taskType = task.TaskType ?? TaskType.Bridge;
      const taskName = task.name ?? '';
      const widgetParams = task.TaskWidgetInformation ?? {};

      // @TODO enable once the lifi config store is available
      //   if (taskType === TaskType.Zap && configType !== 'zap') {
      //     setConfigType('zap');
      //   } else if (taskType !== TaskType.Zap && configType === 'zap') {
      //     setConfigType('default');
      //   }

      setCurrentActiveTask(task.uuid, taskType, taskName);

      setCurrentTaskWidgetFormParams({
        sourceChain: widgetParams.sourceChain ?? undefined,
        sourceToken: widgetParams.sourceToken ?? undefined,
        destinationChain: widgetParams.destinationChain ?? undefined,
        destinationToken: widgetParams.destinationToken ?? undefined,
        toAddress: widgetParams.toAddress ?? undefined,
        fromAmount: widgetParams.fromAmount ?? undefined,
      });

      setCurrentTaskInstructionParams({
        taskTitle: widgetParams.title ?? undefined,
        taskDescription: widgetParams.description ?? undefined,
        taskCTAText: widgetParams.CTAText ?? undefined,
        taskCTALink: widgetParams.CTALink ?? undefined,
        taskInputs: widgetParams.inputs ?? undefined,
      });
    },
    [
      setCurrentActiveTask,
      setCurrentTaskWidgetFormParams,
      setCurrentTaskInstructionParams,
      //   configType,
      //   setConfigType,
    ],
  );

  useEffect(() => {
    if (
      firstUnverifiedTask &&
      !currentActiveTaskId &&
      firstUnverifiedTask.uuid
    ) {
      handleSetActiveTask(firstUnverifiedTask);
    }
  }, [firstUnverifiedTask, currentActiveTaskId, handleSetActiveTask]);

  const allTasksCompleted = useMemo(() => {
    const requiredTasks = tasks.filter((task) => task.isRequired);
    return requiredTasks.length === verifiedTasks?.length;
  }, [JSON.stringify(tasks), JSON.stringify(verifiedTasks)]);

  // @TODO re-enable this after missions are updated; it might require some changes
  // useEffect(() => {
  //   if (allTasksCompleted && !isMissionCompleted) {
  //     setIsMissionCompleted(true);
  //   }
  // }, [allTasksCompleted, isMissionCompleted, setIsMissionCompleted]);

  const enhancedTasks = useMemo(() => {
    return tasks.map((task) => {
      const isVerified = task.hasTask && verifiedTaskIds.has(task.uuid);
      const isRequired = !!task.isRequired;

      return {
        ...task,
        isVerified,
        isRequired,
      };
    });
  }, [JSON.stringify(tasks), JSON.stringify(verifiedTasks)]);

  return {
    enhancedTasks,
    setActiveTask: handleSetActiveTask,
  };
};

export const useVerifyTaskWithSharedState = (
  missionId: string,
  taskId: string,
  taskName?: string,
) => {
  const { account } = useAccount();
  const { trackEvent } = useUserTracking();

  const accountAddress = account?.address;
  const { mutate, reset } = useVerifyTask(missionId, taskId);
  const { getStatus, resetStatus } = useTaskVerificationStatusStore();
  const taskVerificationStatus = getStatus(missionId, taskId);

  const { isSuccess, isPending, isError } = useMemo(
    () => ({
      isSuccess: taskVerificationStatus === TaskVerificationStatus.Success,
      isPending: taskVerificationStatus === TaskVerificationStatus.Pending,
      isError: taskVerificationStatus === TaskVerificationStatus.Error,
    }),
    [taskVerificationStatus],
  );

  const handleVerifyTask = useCallback(
    (extraParams?: { [key: string]: string }) => {
      trackEvent({
        category: TrackingCategory.Quests,
        action: TrackingAction.ClickMissionCtaSteps,
        label: `click-mission-cta-steps-verify`,
        data: {
          [TrackingEventParameter.MissionCtaStepsTitle]: taskName || '',
          [TrackingEventParameter.MissionCtaStepsTaskStepId]: taskId || '',
        },
      });
      mutate({
        ...(extraParams || {}),
        questId: missionId,
        stepId: taskId,
        address: accountAddress,
      });
    },
    [missionId, accountAddress],
  );

  const handleReset = useCallback(() => {
    resetStatus(missionId, taskId);
    reset();
  }, [reset, missionId, taskId]);

  useEffect(() => {
    if (!isError) {
      return;
    }
    const timeoutId = setTimeout(handleReset, 3_000);
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [isError, handleReset]);

  return {
    handleVerifyTask,
    isPending,
    isError,
    isSuccess,
  };
};
