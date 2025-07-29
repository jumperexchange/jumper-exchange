import { FC, useEffect, useRef } from 'react';
import { TaskVerificationWithApy } from 'src/types/loyaltyPass';
import { TaskCard } from 'src/components/Cards/TaskCard/TaskCard';
import { Badge } from 'src/components/Badge/Badge';

import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import { useMissionStore } from 'src/stores/mission';
import { useFormatDisplayTaskData } from 'src/hooks/tasksVerification/useFormatDisplayTaskData';
import { BadgeVariant } from 'src/components/Badge/Badge.styles';
import { useVerifyTaskWithSharedState } from 'src/hooks/tasksVerification/useVerifyTaskWithSharedState';

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
  const { taskId, title, taskType, description, shouldVerify, isVerified } =
    useFormatDisplayTaskData(task);
  const { currentActiveTaskId } = useMissionStore();
  const isActive = currentActiveTaskId === taskId;
  const shouldAnimationRun = useRef(false);

  const { handleVerifyTask, isError, isPending, isSuccess } =
    useVerifyTaskWithSharedState(missionId, taskId, title);

  const { t } = useTranslation();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPending) {
      shouldAnimationRun.current = true;
    } else if (shouldAnimationRun.current) {
      timeout = setTimeout(() => {
        shouldAnimationRun.current = false;
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [isPending]);

  const getVariant = () => {
    if (isSuccess || isVerified) return BadgeVariant.Success;
    if (isPending) return BadgeVariant.Disabled;
    if (isError) return BadgeVariant.Error;
    return BadgeVariant.Secondary;
  };

  const getIcon = () => {
    if (isSuccess || isVerified) return <CheckIcon />;
    return (
      <RefreshIcon
        sx={{
          animation: 'spin 1s linear infinite',
          animationPlayState: shouldAnimationRun.current ? 'running' : 'paused',
          '@keyframes spin': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
        }}
      />
    );
  };

  return (
    <TaskCard
      onClick={onClick}
      title={title}
      description={description}
      isActive={isActive}
      type={
        taskType
          ? t('missions.tasks.type', { type: taskType })
          : t('missions.tasks.typeFallback')
      }
      statusBadge={
        shouldVerify && (
          <Badge
            label={t(
              isSuccess || isVerified
                ? 'missions.tasks.status.verified'
                : 'missions.tasks.status.verify',
            )}
            startIcon={getIcon()}
            variant={getVariant()}
            onClick={
              !isSuccess && !isVerified ? () => handleVerifyTask() : undefined
            }
          />
        )
      }
    />
  );
};
