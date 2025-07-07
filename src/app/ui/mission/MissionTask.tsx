import { FC } from 'react';
import { TaskVerificationWithApy } from 'src/types/loyaltyPass';
import { TaskCard } from 'src/components/Cards/TaskCard/TaskCard';
import { Badge } from 'src/components/Badge/Badge';

import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import { useMissionStore } from 'src/stores/mission';
import { useFormatDisplayTaskData } from 'src/hooks/tasksVerification/useFormatDisplayTaskData';
import { BadgeVariant } from 'src/components/Badge/Badge.styles';
import { useVerifyTaskWithSharedState } from './hooks';

interface MissionTaskProps {
  task: TaskVerificationWithApy & {
    isVerified: boolean;
    isRequired: boolean;
  };
  missionId: string;
  onClick: () => void;
}

export const MissionTask: FC<MissionTaskProps> = ({
  task,
  missionId,
  onClick,
}) => {
  const { taskId, title, taskType, description, isVerified } =
    useFormatDisplayTaskData(task);
  const { currentActiveTaskId } = useMissionStore();
  const isActive = currentActiveTaskId === taskId;

  const { handleVerifyTask, isError, isPending, isSuccess } =
    useVerifyTaskWithSharedState(missionId, taskId, title);

  const { t } = useTranslation();

  return (
    <TaskCard
      onClick={onClick}
      title={title}
      description={description}
      isActive={isActive}
      type={t('missions.tasks.type', { type: taskType })}
      statusBadge={
        true ? (
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
              onClick={() => handleVerifyTask()}
            />
          )
        ) : null
      }
    />
  );
};
