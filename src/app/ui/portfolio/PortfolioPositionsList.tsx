'use client';

import { PositionCard } from '@/components/composite/PositionCard/PositionCard';
import { PositionCardSkeleton } from '@/components/composite/PositionCard/components/PositionCardSkeleton';
import { usePositionsFiltering } from '@/providers/PortfolioProvider/filtering/PositionsFilteringContext';
import { PortfolioEmptyList } from './PortfolioEmptyList';
import { PortfolioAssetsListContainer } from './PortfolioPage.styles';
import { AnimatePresence } from 'motion/react';
import { PortfolioAnimatedAssetContainer } from './PortfolioAnimatedAssetContainer';
import { useMemo } from 'react';
import { hasPositionDataToDisplay } from '@/components/composite/PositionCard/utils';
import { mapValues, pickBy } from 'lodash';
import { DepositFlowModal } from '@/components/composite/DepositFlow/DepositFlow';
import { WithdrawFlowModal } from '@/components/composite/WithdrawFlow/WithdrawFlow';

export const PortfolioPositionsList = () => {
  const { data, isEmpty, isLoading, clearFilters } = usePositionsFiltering();

  // @NOTE: maybe this needs to be in the portfolio provider
  const positionGroups = useMemo(() => {
    const filtered = pickBy(
      mapValues(data, (positions) =>
        positions.filter(hasPositionDataToDisplay),
      ),
      (positions) => positions.length > 0,
    );

    return Object.entries(filtered);
  }, [data]);

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <PortfolioAnimatedAssetContainer key={index}>
          <PositionCardSkeleton />
        </PortfolioAnimatedAssetContainer>
      ));
    }

    if (positionGroups.length > 0) {
      return positionGroups.map(([key, positions]) => (
        <PortfolioAnimatedAssetContainer key={key}>
          <PositionCard positions={positions} isLoading={isLoading} />
        </PortfolioAnimatedAssetContainer>
      ));
    }

    return (
      <PortfolioAnimatedAssetContainer>
        <PortfolioEmptyList onClearFilters={clearFilters} />
      </PortfolioAnimatedAssetContainer>
    );
  };

  if (isEmpty && !isLoading) {
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
