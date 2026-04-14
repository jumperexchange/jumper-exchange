'use client';

import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { PortfolioFilterBar } from '@/components/PortfolioFilterBar/PortfolioFilterBar';
import { useState } from 'react';
import {
  HoldingsFilteringProvider,
  useHoldingsFiltering,
} from '@/providers/PortfolioProvider/filtering/HoldingsFilteringContext';
import { useAccount } from '@lifi/wallet-management';
import { PortfolioHoldings } from './PortfolioHoldings/PortfolioHoldings';

export enum PortfolioViewBarTab {
  HOLDINGS = 'holdings',
  PERFORMANCE = 'performance',
  TRANSACTIONS = 'transactions',
}

const PortfolioContentSectionInner = () => {
  const [tab, setTab] = useState<PortfolioViewBarTab>(
    PortfolioViewBarTab.HOLDINGS,
  );
  const {
    balancesIsLoading,
    positionsIsLoading,
    balancesIsEmpty,
    positionsIsEmpty,
  } = useHoldingsFiltering();
  const { account } = useAccount();
  const isDisconnected = !account.isConnected;
  const isLoading = balancesIsLoading || positionsIsLoading;
  const isEmpty = balancesIsEmpty && positionsIsEmpty;
  const isDisabled = isDisconnected || (isEmpty && !isLoading);

  return (
    <SectionCard>
      <PortfolioFilterBar
        isDisabled={isDisabled}
        value={tab}
        onChange={setTab}
      />
      {tab === PortfolioViewBarTab.HOLDINGS && <PortfolioHoldings />}
    </SectionCard>
  );
};

export const PortfolioContentSection = () => {
  return (
    <HoldingsFilteringProvider>
      <PortfolioContentSectionInner />
    </HoldingsFilteringProvider>
  );
};
