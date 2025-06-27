'use client';

import type { Quest, TaskVerificationWithApy } from 'src/types/loyaltyPass';
import { useEnhancedTasks, useFormatDisplayMissionData } from './hooks';
import { FC } from 'react';
import { EntityCard } from 'src/components/Cards/EntityCard/EntityCard';
import Box from '@mui/material/Box';
import { MissionTask } from './MissionTask';
import { useAccount } from '@lifi/wallet-management';
import { Badge } from 'src/components/Badge/Badge';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { AppPaths } from 'src/const/urls';
import { MissionDetailsContainer } from './MissionDetails.style';

interface MissionDetailsProps {
  mission: Quest;
  tasks: TaskVerificationWithApy[];
}

export const MissionDetails: FC<MissionDetailsProps> = ({ mission, tasks }) => {
  console.log(mission);
  const missionDisplayData = useFormatDisplayMissionData(mission);
  const router = useRouter();

  const { account } = useAccount();
  const { enhancedTasks, setActiveTask } = useEnhancedTasks(
    tasks,
    account?.address,
  );

  const handleGoBack = () => {
    router.push(AppPaths.Missions);
  };

  return (
    <MissionDetailsContainer>
      <Box sx={{ width: '100%' }}>
        <Badge
          label="Missions"
          onClick={handleGoBack}
          startIcon={<ArrowBackIcon />}
          size="lg"
          variant="alpha"
        />
      </Box>
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
      {enhancedTasks.map((task) => (
        <MissionTask
          key={task.uuid}
          task={task}
          missionId={mission.documentId}
          accountAddress={account?.address}
          onClick={() => setActiveTask(task.uuid)}
        />
      ))}
    </MissionDetailsContainer>
  );
};
