import { AssetOverviewCard } from '@/components/composite/AssetOverviewCard/AssetOverviewCard';

export const PortfolioHeaderBreakdownSkeleton = () => {
  return (
    <AssetOverviewCard
      tokens={[]}
      defiPositionGroups={[]}
      isLoading={true}
      showNoContent={false}
    />
  );
};
