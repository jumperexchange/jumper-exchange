'use client';

import { BalanceCard } from '@/components/composite/BalanceCard/BalanceCard';
import { BalanceCardSkeleton } from '@/components/composite/BalanceCard/components/BalanceCardSkeleton';
import { useBalancesFiltering } from '@/providers/PortfolioProvider/filtering/BalancesFilteringContext';
import { PortfolioAssetsListContainer } from './PortfolioPage.styles';
import { PortfolioEmptyList } from './PortfolioEmptyList';
import { PortfolioAnimatedAssetContainer } from './PortfolioAnimatedAssetContainer';
import { AnimatePresence } from 'motion/react';
import { BalanceCardSize } from '@/components/composite/BalanceCard/types';

export const PortfolioTokensList = () => {
  const { data, isLoading, isEmpty, clearFilters } = useBalancesFiltering();

  const balanceGroups = Object.entries(data);

  if (isEmpty && !isLoading) {
    return null;
  }

  const renderContent = () => {
    if (isLoading && balanceGroups.length === 0) {
      return Array.from({ length: 3 }).map((_, index) => (
        <PortfolioAnimatedAssetContainer key={index}>
          <BalanceCardSkeleton size={BalanceCardSize.MD} />
        </PortfolioAnimatedAssetContainer>
      ));
    }

    if (balanceGroups.length > 0) {
      return balanceGroups.map(([symbol, balances]) => (
        <PortfolioAnimatedAssetContainer key={`${symbol}-${balances.length}`}>
          <BalanceCard balances={balances} size={BalanceCardSize.MD} />
        </PortfolioAnimatedAssetContainer>
      ));
    }

    return (
      <PortfolioAnimatedAssetContainer>
        <PortfolioEmptyList onClearFilters={clearFilters} />
      </PortfolioAnimatedAssetContainer>
    );
  };

  return (
    <PortfolioAssetsListContainer useFlexGap direction="column">
      <AnimatePresence mode="popLayout">{renderContent()}</AnimatePresence>
    </PortfolioAssetsListContainer>
  );
};
