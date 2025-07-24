'use client';

import { Quest, TaskVerificationWithApy } from 'src/types/loyaltyPass';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  ZapDetailsColumnContainer,
  ZapDetailsCardContainer,
  ZapDetailsInfoContainer,
} from './ZapDetails.style';
import { FC, useMemo } from 'react';
import Box from '@mui/material/Box';
import { Badge } from '../Badge/Badge';
import { AppPaths } from 'src/const/urls';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMissionTimeStatus } from 'src/hooks/useMissionTimeStatus';
import { EntityCard } from '../Cards/EntityCard/EntityCard';
import { BaseAlert } from '../Alerts/BaseAlert/BaseAlert';
import { useFormatDisplayQuestData } from 'src/hooks/quests/useFormatDisplayQuestData';
import { BadgeSize, BadgeVariant } from '../Badge/Badge.styles';
import { BaseAlertVariant } from '../Alerts/BaseAlert/BaseAlert.styles';
import { useAccount } from '@lifi/wallet-management';
import { useEnhancedTasks } from 'src/hooks/tasksVerification/useEnhancedTasks';
import { SectionCardContainer } from '../Cards/SectionCard/SectionCard.style';
import { MissionTask } from 'src/app/ui/mission/MissionTask';

interface ZapDetailsProps {
  market: Quest;
  tasks: TaskVerificationWithApy[];
}

export const ZapDetails: FC<ZapDetailsProps> = ({ market, tasks }) => {
  const status = useMissionTimeStatus(
    market?.StartDate ?? '',
    market?.EndDate ?? '',
  );
  const zapDisplayData = useFormatDisplayQuestData(market, true, AppPaths.Zap);
  const { t } = useTranslation();
  const router = useRouter();

  const { account } = useAccount();
  const { enhancedTasks, setActiveTask } = useEnhancedTasks(
    tasks ?? [],
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

  const handleGoBack = () => {
    router.push(AppPaths.Profile);
  };

  return (
    <ZapDetailsColumnContainer>
      <SectionCardContainer>
        <ZapDetailsCardContainer>
          <Box sx={{ width: '100%' }}>
            <Badge
              label={t('navbar.navbarMenu.profile')}
              onClick={handleGoBack}
              startIcon={<ArrowBackIcon />}
              size={BadgeSize.LG}
              variant={BadgeVariant.Alpha}
            />
          </Box>

          <EntityCard
            variant="wide"
            badge={badge}
            id={zapDisplayData.id}
            slug={zapDisplayData.slug}
            title={zapDisplayData.title}
            description={zapDisplayData.description}
            participants={zapDisplayData.participants}
            imageUrl={zapDisplayData.imageUrl}
            rewardGroups={zapDisplayData.rewardGroups}
            partnerLink={zapDisplayData.partnerLink}
            fullWidth
          />
          {enhancedTasks.map((task) => (
            <MissionTask
              key={task.uuid}
              task={task}
              missionId={market.documentId}
              onClick={() => setActiveTask(task)}
            />
          ))}
        </ZapDetailsCardContainer>
      </SectionCardContainer>
      {zapDisplayData.info && (
        <ZapDetailsInfoContainer>
          <BaseAlert
            variant={BaseAlertVariant.Info}
            description={zapDisplayData.info}
          />
        </ZapDetailsInfoContainer>
      )}
    </ZapDetailsColumnContainer>
  );
};
