import type { FC } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import type { TaskVerificationWithApy } from 'src/types/loyaltyPass';
import { TaskCard } from 'src/components/Cards/TaskCard/TaskCard';
import { Badge } from 'src/components/Badge/Badge';

import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import { useMissionStore } from 'src/stores/mission';
import { useFormatDisplayTaskData } from 'src/hooks/tasksVerification/useFormatDisplayTaskData';
import { BadgeVariant } from 'src/components/Badge/Badge.styles';
import { useVerifyTaskWithSharedState } from 'src/hooks/tasksVerification/useVerifyTaskWithSharedState';
import { TaskType } from 'src/types/strapi';

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
  const {
    taskId,
    title,
    taskType,
    description,
    shouldVerify,
    isVerified,
    isRequired,
  } = useFormatDisplayTaskData(task);

  const currentActiveTaskId = useMissionStore(
    (state) => state.currentActiveTaskId,
  );
  const { getTaskFormState } = useMissionStore();
  const { hasForm, isFormValid } = getTaskFormState(taskId);
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

  const onTaskVerificationClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      onClick();
      handleVerifyTask();
    },
    [onClick, handleVerifyTask],
  );

  const getVariant = () => {
    if (isSuccess || isVerified) {
      return BadgeVariant.Success;
    }
    if (isPending || (hasForm && !isFormValid)) {
      return BadgeVariant.Disabled;
    }
    if (isError) {
      return BadgeVariant.Error;
    }
    return BadgeVariant.Secondary;
  };

  const getIcon = () => {
    if (isSuccess || isVerified) {
      return <CheckIcon />;
    }
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

  const getTypeLabel = () => {
    if (!isRequired) {
      return t('missions.tasks.typeOptional');
    }
    if (!taskType) {
      return t('missions.tasks.typeFallback');
    }

    const displayType =
      taskType === TaskType.OnChainWalletOwnership
        ? TaskType.OnChain
        : taskType;

    return t('missions.tasks.type', { type: displayType });
  };

  return (
    <TaskCard
      onClick={onClick}
      title={title}
      description={description}
      isActive={isActive}
      type={getTypeLabel()}
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
              !isSuccess && !isVerified ? onTaskVerificationClick : undefined
            }
          />
        )
      }
    />
  );
};
