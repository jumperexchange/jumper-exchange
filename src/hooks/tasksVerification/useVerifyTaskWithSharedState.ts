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
