import { DeFiPositionCard } from './DeFiPositionCard/DeFiPositionCard';
import { DepositFlowModal } from '@/components/composite/DepositFlow/DepositFlow';
import { useDeFiPositionsFiltering } from '@/providers/PortfolioProvider/filtering/DeFiPositionsFilteringContext';
import { PortfolioEmptyList } from '../PortfolioEmptyList';
import { PortfolioAssetsListContainer } from '../PortfolioPage.styles';
import { WithdrawFlowModal } from '@/components/composite/WithdrawFlow/WithdrawFlow';
import { DeFiPositionCardSkeleton } from './DeFiPositionCard/DeFiPositionCardSkeleton';
import { AnimatePresence } from 'motion/react';
import { useContactSupportEvent } from '@/components/Widgets/events/hooks/useContactSupportEvent';
import { PortfolioAnimatedAssetContainer } from '../PortfolioAnimatedAssetContainer';

export const PortfolioDeFiProtocolsList = () => {
  useContactSupportEvent();
  const {
    data: positionGroups,
    isAllDataEmpty,
    isLoading,
    clearFilters,
  } = useDeFiPositionsFiltering();

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <PortfolioAnimatedAssetContainer key={index}>
          <DeFiPositionCardSkeleton />
        </PortfolioAnimatedAssetContainer>
      ));
    }

    if (positionGroups.length > 0) {
      return positionGroups.map((group, index) => (
        <PortfolioAnimatedAssetContainer
          key={`${group.protocol?.name}-${group.chain?.chainId}-${index}`}
        >
          <DeFiPositionCard
            defiPositions={group.positions}
            isLoading={isLoading}
          />
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
