'use client';

import type { FC } from 'react';
import { useMemo } from 'react';
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
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
import { useZapEarnOpportunitySlugStorage } from '@/providers/hooks';
import { useEarnOpportunityBySlug } from '@/hooks/earn/useEarnOpportunityBySlug';

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
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  // The SSR/ISR snapshot can be served stale by the CDN (JUM-775), so the
  // prop-level `data.latest.date` may be days old. Prefer the live refetch
  // for the "Updated at" badge; fall back to the SSR value for first paint.
  const { data: liveData } = useEarnOpportunityBySlug(data.slug);
  const liveLatestDate = liveData?.latest?.date ?? data.latest?.date;
  const updateBadgeLabel = useMemo(() => {
    if (!liveLatestDate) {
      return '';
    }

    const now = Date.now();
    const distance = formatDistance(liveLatestDate, now);
    return t('earn.overview.updated', { time: distance });
  }, [liveLatestDate, t]);

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
