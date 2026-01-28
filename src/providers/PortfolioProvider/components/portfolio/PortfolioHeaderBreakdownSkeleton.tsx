'use client';

import { AssetOverviewCard } from '../composite/AssetOverviewCard/AssetOverviewCard';
import { usePortfolioSummary } from '../../PortfolioContext';

export const PortfolioHeaderBreakdownSkeleton = () => {
  const summary = usePortfolioSummary();

  return (
    <AssetOverviewCard summaryData={summary} isLoading showNoContent={false} />
  );
};
