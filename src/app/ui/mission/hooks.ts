import { useCallback, useEffect, useMemo } from 'react';
import { useGetVerifiedTasks } from 'src/hooks/tasksVerification/useGetVerifiedTasks';
import { useMissionStore } from 'src/stores/mission/MissionStore';
import { useSdkConfigStore } from 'src/stores/sdkConfig/SDKConfigStore';
import {
  ParticipantChain,
  TaskType,
  type TaskVerificationWithApy,
} from 'src/types/loyaltyPass';

export const useSetMissionChainFromParticipants = (
  participatingChains?: ParticipantChain[],
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
      setMissionDefaults(participatingChainsIds);
    }
  }, [participatingChainsIds, setMissionDefaults]);
};

export const useEnhancedTasks = (
  tasks: TaskVerificationWithApy[],
  accountAddress?: string,
) => {
  const { data: verifiedTasks = [] } = useGetVerifiedTasks(accountAddress);
  const { setConfigType, configType } = useSdkConfigStore();

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
    currentActiveTaskId,
  } = useMissionStore();

  const handleSetActiveTask = useCallback(
    (task: TaskVerificationWithApy) => {
      const taskType = task.TaskType ?? TaskType.Bridge;
      const widgetFormParams = task.TaskWidgetInformation ?? {};

      if (taskType === TaskType.Zap && configType !== 'zap') {
        setConfigType('zap');
      } else if (taskType !== TaskType.Zap && configType === 'zap') {
        setConfigType('default');
      }

      setCurrentActiveTask(task.uuid, taskType);

      setCurrentTaskWidgetFormParams({
        sourceChain: widgetFormParams.sourceChain ?? undefined,
        sourceToken: widgetFormParams.sourceToken ?? undefined,
        destinationChain: widgetFormParams.destinationChain ?? undefined,
        destinationToken: widgetFormParams.destinationToken ?? undefined,
        toAddress: widgetFormParams.toAddress ?? undefined,
        fromAmount: widgetFormParams.fromAmount ?? undefined,
      });
    },
    [
      setCurrentActiveTask,
      setCurrentTaskWidgetFormParams,
      configType,
      setConfigType,
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

  useEffect(() => {
    if (allTasksCompleted && !isMissionCompleted) {
      setIsMissionCompleted(true);
    }
  }, [allTasksCompleted, isMissionCompleted, setIsMissionCompleted]);

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
