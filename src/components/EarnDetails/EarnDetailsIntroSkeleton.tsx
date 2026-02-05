'use client';

import { ProtocolCardSkeleton } from '../Cards/ProtocolCard/ProtocolCardSkeleton';
import {
  BaseSkeletonBox,
  EarnDetailsColumnFlexContainer,
  EarnDetailsRowFlexContainer,
} from './EarnDetails.styles';
import { OverviewEarnSkeleton } from '../Cards/EarnCard/variants/OverviewEarnSkeleton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MultiViewCardContainer } from '../composite/cards/MultiViewCard/MultiViewCard.style';

export const EarnDetailsIntroSkeleton = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  return (
    <EarnDetailsRowFlexContainer>
      <ProtocolCardSkeleton fullWidth={isMobile} />
      <EarnDetailsColumnFlexContainer>
        <OverviewEarnSkeleton fullWidth={isMobile} />
        <MultiViewCardContainer>
          <BaseSkeletonBox variant="rounded" width="100%" height={48} />
          <BaseSkeletonBox variant="rounded" width="100%" height={48} />
        </MultiViewCardContainer>
      </EarnDetailsColumnFlexContainer>
    </EarnDetailsRowFlexContainer>
  );
};
