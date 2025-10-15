'use client';
import { CompactEarnCardSkeleton } from '../Cards/EarnCard/variants/CompactEarnCardSkeleton';
import {
  BaseSkeleton,
  EarnRelatedMarketsContainer,
  EarnRelatedMarketWrapper,
} from './EarnRelatedMarkets.styles';

export const EarnRelatedMarketsSkeleton = () => {
  return (
    <>
      <BaseSkeleton
        sx={{
          width: 256,
          height: 32,
        }}
      />
      <EarnRelatedMarketsContainer direction="row" spacing={3}>
        {Array.from({ length: 3 }).map((_, index) => (
          <EarnRelatedMarketWrapper key={index}>
            <CompactEarnCardSkeleton />
          </EarnRelatedMarketWrapper>
        ))}
      </EarnRelatedMarketsContainer>
    </>
  );
};
