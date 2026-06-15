'use client';

import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import dynamic from 'next/dynamic';
import { PortfolioAnimatedLayoutContainer } from '../components/PortfolioAnimatedLayoutContainer';
import { useTransactionFilterCategories } from '../hooks';
import { PortfolioFilterOptionsSkeleton } from './PortfolioFilterOptionsSkeleton';

const MultiLayerDrawer = dynamic(() =>
  import('@/components/composite/MultiLayerDrawer/MultiLayerDrawer').then(
    (mod) => mod.MultiLayerDrawer,
  ),
);

const FilterSortModal = dynamic(() =>
  import('@/components/composite/FilterSortModal/FilterSortModal').then(
    (mod) => mod.FilterSortModal,
  ),
);

export const PortfolioFilterBarTransactions = () => {
  const { t } = useTranslation();
  const {
    isLoading,
    categories,
    filtersCount,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingChanges,
    hasFilterApplied,
  } = useTransactionFilterCategories();
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <PortfolioAnimatedLayoutContainer>
      {isLoading ? (
        <PortfolioFilterOptionsSkeleton />
      ) : isTablet ? (
        <MultiLayerDrawer
          categories={categories}
          title={t('portfolio.filter.filterAndSort')}
          applyButtonLabel={t('portfolio.filter.filterAndSort')}
          clearButtonLabel={t('portfolio.filter.clearAll')}
          onApply={applyFilters}
          onClear={clearAll}
          onClose={resetPending}
          appliedFiltersCount={filtersCount}
          disableApply={!hasPendingChanges}
          disableClear={!hasFilterApplied && !hasPendingChanges}
          testId="portfolio-filters-transactions-mobile-drawer"
          defaultTriggerSx={{ justifyContent: 'flex-end' }}
        />
      ) : (
        <FilterSortModal
          categories={categories}
          applyButtonLabel={t('portfolio.filter.filterAndSort')}
          clearButtonLabel={t('portfolio.filter.clearAll')}
          triggerButtonLabel={t('portfolio.filter.filterSort')}
          onApply={applyFilters}
          onClear={clearAll}
          onClose={resetPending}
          appliedFiltersCount={filtersCount}
          disableApply={!hasPendingChanges}
          disableClear={!hasFilterApplied && !hasPendingChanges}
          testId="portfolio-filters-transactions-desktop-modal"
          defaultTriggerSx={{ justifyContent: 'flex-end' }}
        />
      )}
    </PortfolioAnimatedLayoutContainer>
  );
};
