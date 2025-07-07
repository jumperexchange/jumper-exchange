import { FC, useCallback, useEffect } from 'react';
import { TaskVerificationWithApy } from 'src/types/loyaltyPass';
import { useVerifyTask } from 'src/hooks/tasksVerification/useVerifyTask';
import { TaskCard } from 'src/components/Cards/TaskCard/TaskCard';
import { Badge } from 'src/components/Badge/Badge';

import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useUserTracking } from 'src/hooks/userTracking';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useTranslation } from 'react-i18next';
import { useMissionStore } from 'src/stores/mission';
import { useFormatDisplayTaskData } from 'src/hooks/tasksVerification/useFormatDisplayTaskData';
import { BadgeVariant } from 'src/components/Badge/Badge.styles';

interface MissionTaskProps {
  task: TaskVerificationWithApy & {
    isVerified: boolean;
    isRequired: boolean;
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
  const { taskId, title, taskType, description, isVerified } =
    useFormatDisplayTaskData(task);
  const { currentActiveTaskId } = useMissionStore();
  const isActive = currentActiveTaskId === taskId;

  const { t } = useTranslation();

  const { trackEvent } = useUserTracking();

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
    <TaskCard
      onClick={onClick}
      title={title}
      description={description}
      isActive={isActive}
      type={t('missions.tasks.type', { type: taskType })}
      statusBadge={
        task.hasTask ? (
          isSuccess || isVerified ? (
            <Badge
              label={t('missions.tasks.status.verified')}
              startIcon={<CheckIcon />}
              variant={BadgeVariant.Success}
            />
          ) : (
            <Badge
              label={t('missions.tasks.status.verify')}
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
              variant={
                isPending
                  ? BadgeVariant.Disabled
                  : isError
                    ? BadgeVariant.Error
                    : BadgeVariant.Secondary
              }
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
