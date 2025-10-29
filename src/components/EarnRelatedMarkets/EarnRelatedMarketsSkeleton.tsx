'use client';
import { CompactEarnCardSkeleton } from '../Cards/EarnCard/variants/CompactEarnCardSkeleton';
import { GridContainer } from '../Containers/GridContainer';
import { BaseSkeleton } from './EarnRelatedMarkets.styles';

export const EarnRelatedMarketsSkeleton = () => {
  return (
    <>
      <BaseSkeleton
        sx={{
          width: 256,
          height: 32,
        }}
      />
      <GridContainer
        gridTemplateColumns={'repeat(auto-fill, minmax(328px, 1fr))'}
        gap={3}
        justifyContent={'space-evenly'}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <CompactEarnCardSkeleton key={index} />
        ))}
      </GridContainer>
    </>
  );
};
