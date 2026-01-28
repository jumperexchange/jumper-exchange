'use client';

import { PositionCard } from '../composite/PositionCard/PositionCard';
import { PositionCardSkeleton } from '../composite/PositionCard/components/PositionCardSkeleton';
import { usePositionsFiltering } from '../../filtering/PositionsFilteringContext';
import { PortfolioEmptyList } from './PortfolioEmptyList';
import { PortfolioAssetsListContainer } from './PortfolioPage.styles';
import { AnimatePresence } from 'motion/react';
import { PortfolioAnimatedAssetContainer } from './PortfolioAnimatedAssetContainer';

export const PortfolioPositionsList = () => {
  const { data, isEmpty, isLoading, clearFilters } = usePositionsFiltering();

  const positionGroups = Object.entries(data);

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

  if (isEmpty) {
    return null;
  }

  return (
    <PortfolioAssetsListContainer useFlexGap direction="column">
      <AnimatePresence mode="popLayout">{renderContent()}</AnimatePresence>
    </PortfolioAssetsListContainer>
  );
};
