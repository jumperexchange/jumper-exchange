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
import {
  MissionDetailsColumnContainer,
  MissionDetailsCardContainer,
  MissionDetailsInfoContainer,
} from './MissionDetails.style';
import { useTranslation } from 'react-i18next';
import { BaseAlert } from 'src/components/Alerts/BaseAlert/BaseAlert';

interface MissionDetailsProps {
  mission: Quest;
  tasks: TaskVerificationWithApy[];
}

export const MissionDetails: FC<MissionDetailsProps> = ({ mission, tasks }) => {
  console.log(mission);
  const missionDisplayData = useFormatDisplayMissionData(mission);
  const router = useRouter();
  const { t } = useTranslation();

  const { account } = useAccount();
  const { enhancedTasks, setActiveTask } = useEnhancedTasks(
    tasks,
    account?.address,
  );

  const handleGoBack = () => {
    router.push(AppPaths.Missions);
  };

  return (
    <MissionDetailsColumnContainer>
      <MissionDetailsCardContainer>
        <Box sx={{ width: '100%' }}>
          <Badge
            label={t('navbar.links.missions')}
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
      </MissionDetailsCardContainer>
      {missionDisplayData.info && (
        <MissionDetailsInfoContainer>
          <BaseAlert
            variant="info"
            description={missionDisplayData.info}
            sx={(theme) => ({
              boxShadow: theme.shadows[2],
            })}
          />
        </MissionDetailsInfoContainer>
      )}
    </MissionDetailsColumnContainer>
  );
};
