import { AssetOverviewCard } from '@/components/composite/AssetOverviewCard/AssetOverviewCard';

export const PortfolioHeaderBreakdownSkeleton = () => {
  return (
    <AssetOverviewCard
      summaryData={{
        totalBalancesUsd: 0,
        totalPortfolioUsd: 0,
        totalPositionsUsd: 0,
        balancesBySymbol: {},
        positionsByProtocol: {},
      }}
      isLoading
      showNoContent={false}
    />
  );
};
