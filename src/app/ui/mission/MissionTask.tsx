import { FC, useCallback, useEffect } from 'react';
import { TaskVerificationWithApy } from 'src/types/loyaltyPass';
import { useFormatDisplayTaskData } from './hooks';
import { useVerifyTask } from 'src/hooks/tasksVerification/useVerifyTask';
import { MissionTaskCard } from 'src/components/Cards/MissionTaskCard/MissionTaskCard';
import { Badge } from 'src/components/Badge/Badge';

import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useUserTracking } from 'src/hooks/userTracking';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from 'src/const/trackingKeys';

interface MissionTaskProps {
  task: TaskVerificationWithApy & {
    isVerified: boolean;
    isActive: boolean;
  };
  missionId: string;
  accountAddress?: string;
  onClick: () => void;
}

export const MissionTask: FC<MissionTaskProps> = ({
  task,
  missionId,
  accountAddress,
  onClick,
}) => {
  const { title, description, isVerified, isActive } =
    useFormatDisplayTaskData(task);

  const { trackEvent } = useUserTracking();

  // @TODO add tracking

  const { mutate, isSuccess, isPending, isError, reset } = useVerifyTask();

  const handleVerifyTask = useCallback(
    (taskId: string) => {
      trackEvent({
        category: TrackingCategory.Quests,
        action: TrackingAction.ClickMissionCtaSteps,
        label: `click-mission-cta-steps-verify`,
        data: {
          [TrackingEventParameter.MissionCtaStepsTitle]: task.name || '',
          [TrackingEventParameter.MissionCtaStepsTaskStepId]: task.uuid || '',
        },
      });
      mutate({
        questId: missionId,
        stepId: taskId,
        address: accountAddress,
      });
    },
    [missionId, accountAddress],
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    if (isError) {
      timeoutId = setTimeout(reset, 3_000);
    }
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [isError, reset]);

  return (
    <MissionTaskCard
      onClick={onClick}
      title={title}
      description={description}
      isActive={isActive}
      statusBadge={
        task.hasTask ? (
          isSuccess || isVerified ? (
            <Badge
              label="Verified"
              startIcon={<CheckIcon />}
              variant="success"
            />
          ) : (
            <Badge
              label="Verify"
              startIcon={
                <RefreshIcon
                  sx={{
                    animation: isPending ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      from: { transform: 'rotate(0deg)' },
                      to: { transform: 'rotate(360deg)' },
                    },
                  }}
                />
              }
              variant={isPending ? 'disabled' : isError ? 'error' : 'secondary'}
              onClick={() => {
                handleVerifyTask(task.uuid);
              }}
            />
          )
        ) : null
      }
    />
  );
};
