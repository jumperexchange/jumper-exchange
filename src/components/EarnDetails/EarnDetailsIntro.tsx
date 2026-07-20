'use client';

import { useApyWindow } from '@/hooks/earn/useApyWindow';
import { useZapEarnOpportunitySlugStorage } from '@/providers/hooks';
import useMediaQuery from '@mui/material/useMediaQuery';
import { formatDistance } from 'date-fns';
import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { Badge } from '../Badge/Badge';
import { BadgeSize, BadgeVariant } from '../Badge/Badge.styles';
import { EarnCard } from '../Cards/EarnCard/EarnCard';
import { ProtocolCard } from '../Cards/ProtocolCard/ProtocolCard';
import {
  EarnDetailsColumnFlexContainer,
  EarnDetailsRowFlexContainer,
} from './EarnDetails.styles';
import { EarnDetailsActions } from './EarnDetailsActions';

interface EarnDetailsIntroProps {
  data: EarnOpportunityWithLatestAnalytics;
  isLoading: boolean;
}

export const EarnDetailsIntro: FC<EarnDetailsIntroProps> = ({
  data,
  isLoading,
}) => {
  useZapEarnOpportunitySlugStorage(data.slug);
  const { t } = useTranslation();
  const { apyWindow, setApyWindow } = useApyWindow();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const updateBadgeLabel = useMemo(() => {
    if (!data.latest.date) {
      return '';
    }

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
              apyWindow={apyWindow}
              setApyWindow={setApyWindow}
            />
            <EarnDetailsActions
              earnOpportunity={{
                ...data,
                minFromAmountUSD: 0.99,
                positionUrl: '',
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
