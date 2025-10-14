'use client';

import { ProtocolCardSkeleton } from '../Cards/ProtocolCard/ProtocolCardSkeleton';
import {
  BaseSkeletonBox,
  EarnDetailsActionsContainer,
  EarnDetailsColumnFlexContainer,
  EarnDetailsRowFlexContainer,
} from './EarnDetails.styles';
import { OverviewEarnSkeleton } from '../Cards/EarnCard/variants/OverviewEarnSkeleton';
import useMediaQuery from '@mui/material/useMediaQuery';

export const EarnDetailsIntroSkeleton = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  return (
    <EarnDetailsRowFlexContainer>
      <ProtocolCardSkeleton fullWidth={isMobile} />
      <EarnDetailsColumnFlexContainer>
        <OverviewEarnSkeleton fullWidth={isMobile} />
        <EarnDetailsActionsContainer>
          <BaseSkeletonBox variant="rounded" width="100%" height={48} />
          <BaseSkeletonBox variant="rounded" width="100%" height={48} />
        </EarnDetailsActionsContainer>
      </EarnDetailsColumnFlexContainer>
    </EarnDetailsRowFlexContainer>
  );
};
