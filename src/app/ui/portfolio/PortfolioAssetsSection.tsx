'use client';

import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { PortfolioFilterBar } from '@/components/PortfolioFilterBar/PortfolioFilterBar';
import { useState } from 'react';
import { PortfolioPositionsList } from './PortfolioPositionsList';
import { PortfolioTokensList } from './PortfolioTokensList';
import {
  BalancesFilteringProvider,
  useBalancesFiltering,
} from '@/providers/PortfolioProvider/filtering/BalancesFilteringContext';
import {
  PositionsFilteringProvider,
  usePositionsFiltering,
} from '@/providers/PortfolioProvider/filtering/PositionsFilteringContext';
import { useAccount } from '@lifi/wallet-management';

export enum PortfolioFilterBarTab {
  TOKENS = 'tokens',
  DEFI_PROTOCOLS = 'defi-protocols',
}

const PortfolioAssetsSectionInner = () => {
  const [tab, setTab] = useState<PortfolioFilterBarTab>(
    PortfolioFilterBarTab.TOKENS,
  );
  const { isEmpty: isTokensEmpty, isLoading: isTokensLoading } =
    useBalancesFiltering();
  const { isEmpty: isPositionsEmpty, isLoading: isPositionsLoading } =
    usePositionsFiltering();
  const { account } = useAccount();
  const isDisconnected = !account.isConnected;
  const isLoading = isTokensLoading || isPositionsLoading;
  const isEmpty = isTokensEmpty && isPositionsEmpty;
  const isDisabled = isDisconnected || (isEmpty && !isLoading);

  return (
    <SectionCard>
      <PortfolioFilterBar
        isDisabled={isDisabled}
        value={tab}
        onChange={setTab}
      />
      {!isDisabled &&
        (tab === PortfolioFilterBarTab.TOKENS ? (
          <PortfolioTokensList />
        ) : (
          <PortfolioPositionsList />
        ))}
    </SectionCard>
  );
};

export const PortfolioAssetsSection = () => {
  return (
    <BalancesFilteringProvider>
      <PositionsFilteringProvider>
        <PortfolioAssetsSectionInner />
      </PositionsFilteringProvider>
    </BalancesFilteringProvider>
  );
};
