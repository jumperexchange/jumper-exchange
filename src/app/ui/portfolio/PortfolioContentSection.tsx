'use client';

import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { PortfolioFilterBar } from '@/components/PortfolioFilterBar/PortfolioFilterBar';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import {
  HoldingsFilteringProvider,
  useHoldingsFiltering,
} from '@/providers/PortfolioProvider/filtering/HoldingsFilteringContext';
import { TransactionFilteringProvider } from '@/providers/TransactionProvider/filtering/TransactionFilteringContext';
import { useAccount } from '@lifi/wallet-management';
import { PortfolioHoldings } from './PortfolioHoldings/PortfolioHoldings';
import { PortfolioTransactions } from './PortfolioTransactions/PortfolioTransactions';
import { PortfolioTransactionPagination } from './PortfolioTransactions/PortfolioTransactionPagination';
import { PortfolioViewBarTab } from '@/components/PortfolioFilterBar/types';

const PortfolioContentSectionInner = () => {
  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringEnum<PortfolioViewBarTab>(
      Object.values(PortfolioViewBarTab),
    ).withDefault(PortfolioViewBarTab.HOLDINGS),
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
    <>
      <SectionCard>
        <PortfolioFilterBar
          isDisabled={isDisabled}
          value={tab}
          onChange={setTab}
        />
        {tab === PortfolioViewBarTab.HOLDINGS && <PortfolioHoldings />}
        {tab === PortfolioViewBarTab.TRANSACTIONS && <PortfolioTransactions />}
      </SectionCard>
      {tab === PortfolioViewBarTab.TRANSACTIONS && (
        <PortfolioTransactionPagination />
      )}
    </>
  );
};

export const PortfolioContentSection = () => {
  return (
    <HoldingsFilteringProvider>
      <TransactionFilteringProvider>
        <PortfolioContentSectionInner />
      </TransactionFilteringProvider>
    </HoldingsFilteringProvider>
  );
};
