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
import { BadgeSize, BadgeVariant } from '../Badge/Badge.styles';
import { BaseAlertVariant } from '../Alerts/BaseAlert/BaseAlert.styles';
import { Typography } from '@mui/material';
import { AccordionFAQ, AccordionHeader } from '../AccordionFAQ';

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
        />
        {/** @TODO need to check if we still want to show these participation steps */}
        {/* <AccordionFAQ
          showIndex={true}
          showDivider={true}
          showAnswerDivider={true}
          sx={{
            padding: 0,
            '& .faq-item': {
              padding: '0px 8px',
              backgroundColor: 'transparent',
              '.MuiAccordionSummary-root': {
                padding: 0,
              },
              '.accordion-items': {
                gap: '4px',
              },
              '.MuiAccordionDetails-root': {
                padding: '20px 16px 16px',
              },
            },
          }}
          content={market.CustomInformation?.faqItems ?? []}
          accordionHeader={
            <AccordionHeader
              sx={{ margin: 0, marginBottom: '4px', marginLeft: '8px' }}
            >
              <Typography variant="title2XSmall">How to participate</Typography>
            </AccordionHeader>
          }
          questionTextTypography="bodyLarge"
          answerTextTypography="bodyMedium"
          arrowSize={12}
        /> */}
      </ZapDetailsCardContainer>
      {zapDisplayData.info && (
        <ZapDetailsInfoContainer>
          <BaseAlert
            variant={BaseAlertVariant.Info}
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
