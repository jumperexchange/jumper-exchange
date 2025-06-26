'use client';

import type { Quest, TaskVerificationWithApy } from 'src/types/loyaltyPass';
import { useFormatDisplayMissionData } from './hooks';
import { FC } from 'react';
import { EntityCard } from 'src/components/Cards/EntityCard/EntityCard';
import Box from '@mui/material/Box';
import { MissionTaskCard } from 'src/components/Mission/MissionTaskCard/MissionTaskCard';
import { Badge } from 'src/components/Badge/Badge';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAccount } from '@lifi/wallet-management';
import { useVerifyTask } from 'src/hooks/tasksVerification/useVerifyTask';

interface MissionDetailsProps {
  mission: Quest;
  tasks: TaskVerificationWithApy[];
}

export const MissionDetails: FC<MissionDetailsProps> = ({ mission, tasks }) => {
  const missionDisplayData = useFormatDisplayMissionData(mission);
  const { account } = useAccount();

  // @TODO add tracking

  const { mutate, isSuccess, isPending, isError, reset, ...props } =
    useVerifyTask();

  const handleVerifyTask = (taskId: string) => {
    mutate({
      questId: mission.documentId,
      stepId: taskId,
      address: account?.address,
    });
  };

  return (
    <Box
      sx={(theme) => ({
        maxWidth: theme.spacing(83),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 3,
        backgroundColor: (theme.vars || theme).palette.surface2.main,
        borderRadius: `${theme.shape.cardBorderRadius}px`,
        boxShadow: theme.shadows[2],
      })}
    >
      <EntityCard
        variant="wide"
        id={missionDisplayData.id}
        slug={missionDisplayData.slug}
        title={missionDisplayData.title}
        description={missionDisplayData.description}
        participants={missionDisplayData.participants}
        imageUrl={missionDisplayData.imageUrl}
        rewardGroups={missionDisplayData.rewardGroups}
      />
      {tasks.map((task) => {
        const isActive = false;
        return (
          <MissionTaskCard
            key={task.id}
            title={task.name}
            description={task.description}
            isActive={isActive}
            statusBadge={
              task.hasTask ? (
                isSuccess ? (
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
                          animation: isPending
                            ? 'spin 1s linear infinite'
                            : 'none',
                          '@keyframes spin': {
                            from: { transform: 'rotate(0deg)' },
                            to: { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                    }
                    variant={isPending ? 'disabled' : 'secondary'}
                    onClick={() => {
                      handleVerifyTask(task.uuid);
                    }}
                  />
                )
              ) : null
            }
          />
        );
      })}
    </Box>
  );
};
