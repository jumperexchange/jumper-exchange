import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { MISSION_WIDGET_ELEMENT_ID } from 'src/const/quests';
import { TaskFormState, useMissionStore } from 'src/stores/mission';
import type { TaskVerificationWithApy } from 'src/types/loyaltyPass';
import { TaskType } from 'src/types/strapi';
import { useGetVerifiedTasks } from './useGetVerifiedTasks';

export const useEnhancedTasks = (
  tasks: TaskVerificationWithApy[],
  accountAddress?: string,
) => {
  const router = useRouter();

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
    setCurrentActiveTask,
    setIsCurrentActiveTaskCompleted,
    setCurrentTaskWidgetFormParams,
    setCurrentTaskInstructionParams,
    initializeTaskFormStates,
  } = useMissionStore();

  const currentActiveTaskId = useMissionStore(
    (state) => state.currentActiveTaskId,
  );
  const isCurrentActiveTaskCompleted = useMissionStore(
    (state) => state.isCurrentActiveTaskCompleted,
  );

  const checkIsTaskVerified = useCallback(
    (task: TaskVerificationWithApy) => {
      return task && task.hasTask && verifiedTaskIds.has(task.uuid);
    },
    [verifiedTasks],
  );

  // Initialize form state for all tasks when mission is loaded
  useEffect(() => {
    const formStates: Record<string, TaskFormState> = {};

    tasks.forEach((task) => {
      const widgetParams = task.TaskWidgetInformation ?? {};
      const hasForm = !!widgetParams.inputs?.length;
      formStates[task.uuid] = { hasForm, isFormValid: !hasForm };
    });

    initializeTaskFormStates(formStates);
  }, [tasks, initializeTaskFormStates]);

  const handleSetActiveTask = useCallback(
    (task: TaskVerificationWithApy, shouldScrollToWidget = true) => {
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
      const isTaskVerified = checkIsTaskVerified(task);
      setIsCurrentActiveTaskCompleted(isTaskVerified);

      setCurrentTaskWidgetFormParams({
        allowBridge: widgetParams.allowBridge ?? undefined,
        allowExchange: widgetParams.allowExchange ?? undefined,
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
        taskDescriptionCTALink: widgetParams.descriptionCTALink ?? undefined,
        taskDescriptionCTAText: widgetParams.descriptionCTAText ?? undefined,
        taskCTAText: widgetParams.CTAText ?? undefined,
        taskCTALink: widgetParams.CTALink ?? undefined,
        taskInputs: widgetParams.inputs ?? undefined,
      });

      if (shouldScrollToWidget) {
        router.push(`#${MISSION_WIDGET_ELEMENT_ID}`);
      }
    },
    [
      setCurrentActiveTask,
      setCurrentTaskWidgetFormParams,
      setCurrentTaskInstructionParams,
      checkIsTaskVerified,
      router,
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
      handleSetActiveTask(firstUnverifiedTask, false);
    }
  }, [firstUnverifiedTask, currentActiveTaskId, handleSetActiveTask]);

  useEffect(() => {
    const currentActiveTask = tasks.find(
      (task) => task.uuid === currentActiveTaskId,
    );

    if (!currentActiveTask) {
      return;
    }

    const isTaskVerified = checkIsTaskVerified(currentActiveTask);

    if (isTaskVerified && !isCurrentActiveTaskCompleted) {
      setIsCurrentActiveTaskCompleted(true);
    }
  }, [
    checkIsTaskVerified,
    tasks,
    currentActiveTaskId,
    isCurrentActiveTaskCompleted,
  ]);

  const enhancedTasks = useMemo(() => {
    return tasks.map((task) => {
      const isVerified = checkIsTaskVerified(task);
      const isRequired = !!task.isRequired;

      return {
        ...task,
        isVerified,
        isRequired,
      };
    });
  }, [checkIsTaskVerified, tasks]);

  return {
    enhancedTasks,
    setActiveTask: handleSetActiveTask,
  };
};
