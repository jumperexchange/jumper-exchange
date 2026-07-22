'use client';

import type { Quest } from 'src/types/loyaltyPass';
import { useSyncMissionDefaultsFromChains } from 'src/hooks/quests/useSyncMissionDefaultsFromChains';
import { useEnhancedTasks } from 'src/hooks/tasksVerification/useEnhancedTasks';
import type { FC } from 'react';
import { useMemo } from 'react';
import { EntityCard } from 'src/components/Cards/EntityCard/EntityCard';
import Box from '@mui/material/Box';
import { MissionTask } from './MissionTask';
import { useAccount } from '@jumperexchange/wallet-management';
import { Badge } from 'src/components/Badge/Badge';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AppPaths } from 'src/const/urls';
import {
  MissionDetailsColumnContainer,
  MissionDetailsCardContainer,
  MissionDetailsInfoContainer,
} from './MissionDetails.style';
import { useTranslation } from 'react-i18next';
import { BaseAlert } from 'src/components/Alerts/BaseAlert/BaseAlert';
import { useMissionTimeStatus } from 'src/hooks/useMissionTimeStatus';
import { useFormatDisplayQuestData } from 'src/hooks/quests/useFormatDisplayQuestData';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { BaseAlertVariant } from 'src/components/Alerts/BaseAlert/BaseAlert.styles';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import { useResetCurrentActiveTask } from 'src/hooks/tasksVerification/useResetCurrentActiveTask';
import { useGoBack } from '@/hooks/routing/useGoBack';

interface MissionDetailsProps {
  mission: Quest;
}

export const MissionDetails: FC<MissionDetailsProps> = ({ mission }) => {
  const missionId = mission.documentId;
  const hasEnded = mission.hasEnded ?? false;

  const tasks = mission.tasks_verification;

  const { status } = useMissionTimeStatus(
    mission.StartDate ?? '',
    mission.EndDate ?? '',
    hasEnded,
  );
  const missionDisplayData = useFormatDisplayQuestData(mission);
  const participants = useMemo(
    () => missionDisplayData.participants,
    [missionDisplayData.participants],
  );
  useResetCurrentActiveTask();
  useSyncMissionDefaultsFromChains(participants, missionId, hasEnded);
  const handleGoBack = useGoBack(AppPaths.Missions);
  const { t } = useTranslation();

  const { account } = useAccount();
  const { enhancedTasks, setActiveTask } = useEnhancedTasks(
    tasks ?? [],
    missionId,
    account?.address,
  );

  const badge = useMemo(() => {
    if (!status) {
      return null;
    }
    return (
      <Badge
        label={status}
        variant={BadgeVariant.Secondary}
        size={BadgeSize.LG}
      />
    );
  }, [status]);

  return (
    <MissionDetailsColumnContainer data-testid="mission-details">
      <SectionCardContainer>
        <MissionDetailsCardContainer>
          <Box sx={{ width: '100%' }}>
            <Badge
              label={t('navbar.links.missions')}
              onClick={handleGoBack}
              startIcon={<ArrowBackIcon />}
              size={BadgeSize.LG}
              variant={BadgeVariant.Alpha}
            />
          </Box>
          <EntityCard
            variant="wide"
            badge={badge}
            id={missionDisplayData.id}
            slug={missionDisplayData.slug}
            title={missionDisplayData.title}
            description={missionDisplayData.description}
            descriptionRichText={missionDisplayData.descriptionRichText}
            participants={missionDisplayData.participants}
            imageUrl={missionDisplayData.imageUrl}
            rewardGroups={missionDisplayData.rewardGroups}
            partnerLink={missionDisplayData.partnerLink}
            fullWidth
            dataTestId={
              missionDisplayData.slug || missionDisplayData.id
                ? `mission-card-${missionDisplayData.slug || missionDisplayData.id}`
                : undefined
            }
          />
          {enhancedTasks.map((task, i) => (
            <MissionTask
              key={task.uuid}
              task={task}
              missionId={missionId}
              missionSlug={missionDisplayData.slug}
              onClick={() => setActiveTask(task)}
            />
          ))}
        </MissionDetailsCardContainer>
      </SectionCardContainer>
      {missionDisplayData.info && (
        <MissionDetailsInfoContainer>
          <BaseAlert
            variant={BaseAlertVariant.Info}
            description={missionDisplayData.info}
          />
        </MissionDetailsInfoContainer>
      )}
    </MissionDetailsColumnContainer>
  );
};
