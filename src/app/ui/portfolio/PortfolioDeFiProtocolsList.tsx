import type { PropsWithChildren } from 'react';
import { DeFiPositionCard } from '@/components/composite/DeFiPositionCard/DeFiPositionCard';
import { DepositFlowModal } from '@/components/composite/DepositFlow/DepositFlow';
import { useFormatDisplayDeFiPositions } from '@/hooks/portfolio/useFormatDisplayDeFiPositions';
import { usePortfolioDeFiPositionsFiltering } from './PortfolioDeFiPositionsFilteringContext';
import { getPositionGroupKey } from '@/utils/positions/type-guards';
import { PortfolioEmptyList } from './PortfolioEmptyList';
import { PortfolioAssetsListContainer } from './PortfolioPage.styles';
import { WithdrawFlowModal } from '@/components/composite/WithdrawFlow/WithdrawFlow';
import { DeFiPositionCardSkeleton } from '@/components/composite/DeFiPositionCard/DeFiPositionCardSkeleton';
import { AnimatePresence } from 'motion/react';
import { useContactSupportEvent } from '@/components/Widgets/events/hooks/useContactSupportEvent';
import { PortfolioAnimatedAssetContainer } from './PortfolioAnimatedAssetContainer';
import { hasPositionDataToDisplay } from '@/components/composite/DeFiPositionCard/utils';

export const PortfolioDeFiProtocolsList = () => {
  useContactSupportEvent();
  const { data, isAllDataEmpty, isLoading, clearFilters, sortBy, order } =
    usePortfolioDeFiPositionsFiltering();

  const protocolGroups = useFormatDisplayDeFiPositions(
    data,
    getPositionGroupKey,
    { sortBy, order },
  );

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <PortfolioAnimatedAssetContainer key={index}>
          <DeFiPositionCardSkeleton />
        </PortfolioAnimatedAssetContainer>
      ));
    }

    if (protocolGroups.length > 0) {
      return protocolGroups.map((positions, index) => (
        <PortfolioAnimatedAssetContainer
          key={`${getPositionGroupKey(positions[0])}-${index}`}
        >
          <DeFiPositionCard defiPositions={positions} isLoading={isLoading} />
        </PortfolioAnimatedAssetContainer>
      ));
    }

    return (
      <PortfolioAnimatedAssetContainer>
        <PortfolioEmptyList onClearFilters={clearFilters} />
      </PortfolioAnimatedAssetContainer>
    );
  };

  if (isAllDataEmpty) {
    return null;
  }

  return (
    <>
      <PortfolioAssetsListContainer useFlexGap direction="column">
        <AnimatePresence mode="popLayout">{renderContent()}</AnimatePresence>
      </PortfolioAssetsListContainer>
      <DepositFlowModal />
      <WithdrawFlowModal />
    </>
  );
};
