'use client';

import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { PortfolioFilterBar } from '@/components/PortfolioFilterBar/PortfolioFilterBar';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import {
  HoldingsFilteringProvider,
  useHoldingsFiltering,
} from '@/providers/PortfolioProvider/filtering/HoldingsFilteringContext';
import {
  TransactionFilteringProvider,
  useTransactionFiltering,
} from '@/providers/TransactionProvider/filtering/TransactionFilteringContext';
import { useAccount } from '@jumperexchange/wallet-management';
import { PortfolioHoldings } from './PortfolioHoldings/PortfolioHoldings';
import { PortfolioTransactions } from './PortfolioTransactions/PortfolioTransactions';
import { PortfolioTransactionPagination } from './PortfolioTransactions/PortfolioTransactionPagination';
import { PortfolioViewBarTab } from '@/components/PortfolioFilterBar/types';
import { useEffect } from 'react';
import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';

const PortfolioContentSectionInner = () => {
  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringEnum<PortfolioViewBarTab>(Object.values(PortfolioViewBarTab))
      .withDefault(PortfolioViewBarTab.HOLDINGS)
      .withOptions({ history: 'replace' }),
  );
  const {
    balancesIsLoading,
    positionsIsLoading,
    balancesIsEmpty,
    positionsIsEmpty,
  } = useHoldingsFiltering();
  const { account } = useAccount();
  const { setIsActive } = useTransactionFiltering();
  const transactionFlag = useABTest({
    feature: AB_TEST_NAME.PORTFOLIO_TRANSACTIONS,
  });
  const areTransactionsLoading = transactionFlag.isLoading;
  const areTransactionsEnabled =
    !areTransactionsLoading &&
    transactionFlag.isEnabled &&
    (transactionFlag.value === true || transactionFlag.value === 'test');

  const isDisconnected = !account.isConnected;
  const isLoading = balancesIsLoading || positionsIsLoading;
  const isEmpty = balancesIsEmpty && positionsIsEmpty;
  const isDisabled = isDisconnected || (isEmpty && !isLoading);

  const effectiveTab =
    !areTransactionsLoading &&
    tab === PortfolioViewBarTab.TRANSACTIONS &&
    !areTransactionsEnabled
      ? PortfolioViewBarTab.HOLDINGS
      : tab;

  useEffect(() => {
    if (effectiveTab !== tab) {
      setTab(effectiveTab);
    }
  }, [effectiveTab, tab, setTab]);

  useEffect(() => {
    setIsActive(effectiveTab === PortfolioViewBarTab.TRANSACTIONS);
  }, [effectiveTab, setIsActive]);

  return (
    <>
      <SectionCard>
        <PortfolioFilterBar
          isDisabled={isDisabled}
          areTransactionsEnabled={areTransactionsEnabled}
          value={effectiveTab}
          onChange={setTab}
        />
        {effectiveTab === PortfolioViewBarTab.HOLDINGS && <PortfolioHoldings />}
        {effectiveTab === PortfolioViewBarTab.TRANSACTIONS && (
          <PortfolioTransactions />
        )}
      </SectionCard>
      {effectiveTab === PortfolioViewBarTab.TRANSACTIONS && (
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
