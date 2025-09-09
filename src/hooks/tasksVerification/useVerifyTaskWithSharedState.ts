import { useAccount } from '@lifi/wallet-management';
import { useMemo, useCallback, useEffect } from 'react';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import {
  useTaskVerificationStatusStore,
  TaskVerificationStatus,
} from 'src/stores/taskVerificationStatus/TaskVerificationStatusStore';
import { useUserTracking } from '../userTracking';
import { useVerifyTask } from './useVerifyTask';
import { useQueryClient } from '@tanstack/react-query';
import { updateVerifiedTasksQueryCache } from './useGetVerifiedTasks';
import { useMissionStore } from 'src/stores/mission';

export const useVerifyTaskWithSharedState = (
  missionId: string,
  taskId: string,
  taskName?: string,
) => {
  const { account } = useAccount();
  const { trackEvent } = useUserTracking();
  const { getTaskFormState } = useMissionStore();

  const accountAddress = account?.address;

  const queryClient = useQueryClient();

  const refetchTaskVerificationCache = useCallback(() => {
    if (!accountAddress) {
      return;
    }

    updateVerifiedTasksQueryCache(queryClient, accountAddress);
  }, [queryClient, accountAddress]);

  const { mutate, reset } = useVerifyTask(
    missionId,
    taskId,
    refetchTaskVerificationCache,
  );
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
      const { hasForm, isFormValid } = getTaskFormState(taskId);

      if (hasForm && !isFormValid) {
        return;
      }

      trackEvent({
        category: TrackingCategory.Quests,
        action: TrackingAction.ClickMissionVerify,
        label: `click-mission-task-verify`,
        data: {
          [TrackingEventParameter.QuestCardId]: missionId || '',
          [TrackingEventParameter.MissionCtaStepsTitle]: taskName || '',
          [TrackingEventParameter.MissionCtaStepsTaskStepId]: taskId || '',
          [TrackingEventParameter.WalletAddress]: accountAddress || '',
          ...Object.entries(extraParams || {}).reduce(
            (acc, [key, value]) => {
              acc[TrackingEventParameter.MissionTaskInputPrepend + key] = value;
              return acc;
            },
            {} as Record<string, string>,
          ),
        },
      });
      mutate({
        questId: missionId,
        stepId: taskId,
        address: accountAddress,
        additionalFields: extraParams || {},
      });
    },
    [missionId, taskId, taskName, accountAddress, getTaskFormState],
  );

  const handleReset = useCallback(() => {
    resetStatus(missionId, taskId);
    reset();
  }, [reset, missionId, taskId]);

  useEffect(() => {
    if (!isError) {
      return;
    }
    const timeoutId = setTimeout(handleReset, 3000);
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
