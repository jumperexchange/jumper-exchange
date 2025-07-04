import { Quest } from 'src/types/loyaltyPass';
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

interface ZapDetailsProps {
  market: Quest;
}

export const ZapDetails: FC<ZapDetailsProps> = ({ market }) => {
  const status = useMissionTimeStatus(
    market?.StartDate ?? '',
    market?.EndDate ?? '',
  );
  const zapDisplayData = useFormatDisplayQuestData(market, true, AppPaths.Zap);
  const { t } = useTranslation();
  const router = useRouter();

  const badge = useMemo(() => {
    if (!status) {
      return null;
    }
    return <Badge label={status} variant="secondary" size="lg" />;
  }, [status]);

  const handleGoBack = () => {
    router.push(AppPaths.Profile);
  };

  return (
    <ZapDetailsColumnContainer>
      <ZapDetailsCardContainer>
        <Box sx={{ width: '100%' }}>
          <Badge
            label={t('navbar.navbarMenu.profile')}
            onClick={handleGoBack}
            startIcon={<ArrowBackIcon />}
            size="lg"
            variant="alpha"
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
        />
      </ZapDetailsCardContainer>
      {/** Need to add the steps here */}
      {zapDisplayData.info && (
        <ZapDetailsInfoContainer>
          <BaseAlert
            variant="info"
            description={zapDisplayData.info}
            sx={(theme) => ({
              boxShadow: theme.shadows[2],
            })}
          />
        </ZapDetailsInfoContainer>
      )}
    </ZapDetailsColumnContainer>
  );
};
