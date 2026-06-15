'use client';

import { useTranslation } from 'react-i18next';
import { useTransactionFiltering } from '@/providers/TransactionProvider/filtering/TransactionFilteringContext';
import { TransactionTable } from '@/components/composite/TransactionTable/TransactionTable';
import { PortfolioAssetsListContainer } from '../PortfolioPage.styles';
import { TransactionTableSkeleton } from '@/components/composite/TransactionTable/TransactionTableSkeleton';
import { PortfolioEmptyList } from '../PortfolioEmptyList';
import { PortfolioEmptyList as BasePortfolioEmptyList } from '@/components/core/empty-content/PortfolioEmptyList/PortfolioEmptyList';

export const PortfolioTransactions = () => {
  const { t } = useTranslation();
  const {
    transactions,
    isLoading,
    clearFilters,
    hasPreviousPage,
    goToPreviousPage,
  } = useTransactionFiltering();

  return (
    <PortfolioAssetsListContainer direction="column">
      {isLoading ? (
        <TransactionTableSkeleton showHeader count={6} />
      ) : transactions.length > 0 ? (
        <TransactionTable transactions={transactions} showHeader />
      ) : hasPreviousPage ? (
        <BasePortfolioEmptyList
          title={t('portfolio.emptyPage.title')}
          description={t('portfolio.emptyPage.description')}
          primaryButtonLabel={t('portfolio.emptyPage.goToPreviousPage')}
          onPrimaryButtonClick={goToPreviousPage}
          secondaryButtonLabel={t('portfolio.emptyPage.clearFilters')}
          onSecondaryButtonClick={clearFilters}
        />
      ) : (
        <PortfolioEmptyList onClearFilters={clearFilters} />
      )}
    </PortfolioAssetsListContainer>
  );
};
