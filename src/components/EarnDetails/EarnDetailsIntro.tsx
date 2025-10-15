'use client';

import { FC, useMemo } from 'react';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { EarnCard } from '../Cards/EarnCard/EarnCard';
import { Badge } from '../Badge/Badge';
import { BadgeSize, BadgeVariant } from '../Badge/Badge.styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ProtocolCard } from '../Cards/ProtocolCard/ProtocolCard';
import {
  EarnDetailsColumnFlexContainer,
  EarnDetailsRowFlexContainer,
} from './EarnDetails.styles';
import { EarnDetailsActions } from './EarnDetailsActions';
import { formatDistance } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface EarnDetailsIntroProps {
  data: EarnOpportunityWithLatestAnalytics;
  isLoading: boolean;
}

export const EarnDetailsIntro: FC<EarnDetailsIntroProps> = ({
  data,
  isLoading,
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const updateBadgeLabel = useMemo(() => {
    if (!data.latest.date) return '';

    const now = Date.now();
    const distance = formatDistance(data.latest.date, now);
    return t('earn.overview.updated', { time: distance });
  }, [data.latest.date, t]);

  return (
    <EarnDetailsRowFlexContainer>
      {data ? (
        <>
          <ProtocolCard
            data={data}
            isLoading={isLoading}
            fullWidth={isMobile}
          />
          <EarnDetailsColumnFlexContainer>
            <EarnCard
              data={data}
              variant="overview"
              isLoading={isLoading}
              headerBadge={
                updateBadgeLabel ? (
                  <Badge
                    variant={BadgeVariant.Secondary}
                    size={BadgeSize.SM}
                    label={updateBadgeLabel}
                  />
                ) : null
              }
              fullWidth={isMobile}
            />
            <EarnDetailsActions
              earnOpportunity={{
                ...data,
                minFromAmountUSD: 5,
                positionUrl: '',
                address: '',
              }}
            />
          </EarnDetailsColumnFlexContainer>
        </>
      ) : (
        <>
          <ProtocolCard data={null} isLoading fullWidth={isMobile} />
          <EarnDetailsColumnFlexContainer>
            <EarnCard
              data={null}
              variant="overview"
              isLoading
              fullWidth={isMobile}
            />
          </EarnDetailsColumnFlexContainer>
        </>
      )}
    </EarnDetailsRowFlexContainer>
  );
};
