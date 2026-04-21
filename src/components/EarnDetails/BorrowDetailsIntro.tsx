'use client';

import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { FC } from 'react';
import { EarnCard } from '../Cards/EarnCard/EarnCard';
import { ProtocolCard } from '../Cards/ProtocolCard/ProtocolCard';
import { BorrowDetailsActions } from './BorrowDetailsActions';
import {
  EarnDetailsColumnFlexContainer,
  EarnDetailsRowFlexContainer,
} from './EarnDetails.styles';

interface BorrowDetailsIntroProps {
  opportunity: EarnOpportunityWithLatestAnalytics;
  marketId: string;
}

export const BorrowDetailsIntro: FC<BorrowDetailsIntroProps> = ({
  opportunity,
  marketId,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <EarnDetailsRowFlexContainer>
      <ProtocolCard data={opportunity} isLoading={false} fullWidth={isMobile} />
      <EarnDetailsColumnFlexContainer>
        <EarnCard
          data={opportunity}
          variant="overview"
          isLoading={false}
          fullWidth={isMobile}
        />
        <BorrowDetailsActions opportunity={opportunity} marketId={marketId} />
      </EarnDetailsColumnFlexContainer>
    </EarnDetailsRowFlexContainer>
  );
};
