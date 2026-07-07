'use client';

import { useTranslation } from 'react-i18next';
import { useTransactionFiltering } from '@/providers/TransactionProvider/filtering/TransactionFilteringContext';
import { TransactionTable } from '@/components/composite/TransactionTable/TransactionTable';
import { PortfolioAssetsListContainer } from '../PortfolioPage.styles';
import { TransactionTableSkeleton } from '@/components/composite/TransactionTable/TransactionTableSkeleton';
import { PortfolioEmptyList } from '../PortfolioEmptyList';
import { PortfolioEmptyList as BasePortfolioEmptyList } from '@/components/core/empty-content/PortfolioEmptyList/PortfolioEmptyList';
import { isRateLimitError } from '@/utils/errors';

export const PortfolioTransactions = () => {
  const { t } = useTranslation();
  const {
    transactions,
    isLoading,
    error,
    refetch,
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
      ) : error ? (
        <BasePortfolioEmptyList
          title={t(
            isRateLimitError(error)
              ? 'portfolio.emptyList.rateLimited.title'
              : 'portfolio.emptyList.error.title',
          )}
          description={t(
            isRateLimitError(error)
              ? 'portfolio.emptyList.rateLimited.description'
              : 'portfolio.emptyList.error.description',
          )}
          primaryButtonLabel={t(
            isRateLimitError(error)
              ? 'portfolio.emptyList.rateLimited.retry'
              : 'portfolio.emptyList.error.retry',
          )}
          onPrimaryButtonClick={refetch}
        />
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
