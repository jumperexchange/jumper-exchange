'use client';

import { FC } from 'react';
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
import { DepositFlowModal } from '../composite/DepositFlow/DepositFlow';

interface EarnDetailsIntroProps {
  data: EarnOpportunityWithLatestAnalytics;
  isLoading: boolean;
}

export const EarnDetailsIntro: FC<EarnDetailsIntroProps> = ({
  data,
  isLoading,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
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
                <Badge
                  variant={BadgeVariant.Secondary}
                  size={BadgeSize.SM}
                  label="Updated 12 hours ago"
                />
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
          <DepositFlowModal />
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
