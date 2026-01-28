'use client';

import { PortfolioAssetsSectionSkeleton } from './PortfolioAssetsSectionSkeleton';
import { PortfolioHeaderSectionSkeleton } from './PortfolioHeaderSectionSkeleton';

export const PortfolioPageSkeleton = () => {
  return (
    <>
      <PortfolioHeaderSectionSkeleton />
      <PortfolioAssetsSectionSkeleton />
    </>
  );
};
