'use client';

import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import dynamic from 'next/dynamic';
import { PortfolioAnimatedLayoutContainer } from '../components/PortfolioAnimatedLayoutContainer';
import { useTransactionFilterCategories } from '../hooks';
import { PortfolioFilterOptionsSkeleton } from './PortfolioFilterOptionsSkeleton';
import { useTransactions } from '@/providers/TransactionProvider/TransactionContext';
import Box from '@mui/material/Box';
import RefreshIcon from '@mui/icons-material/Refresh';
import { formatDistanceToNow } from 'date-fns';
import type { TFunction } from 'i18next';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size, Variant } from '@/components/core/buttons/types';

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

function useRefreshTooltip(
  t: TFunction,
  rateLimit: ReturnType<typeof useTransactions>['rateLimit'],
): string {
  if (!rateLimit || rateLimit.forceRefreshRemaining === null) {
    return t('portfolio.filter.refreshTooltipUnknown');
  }
  if (rateLimit.forceRefreshRemaining === 0) {
    const resetAt = rateLimit.resetAt
      ? formatDistanceToNow(rateLimit.resetAt, { addSuffix: true })
      : '—';
    return t('portfolio.filter.refreshTooltipExhausted', { resetAt });
  }
  return t('portfolio.filter.refreshTooltipAvailable', {
    remaining: rateLimit.forceRefreshRemaining,
  });
}

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
  const {
    triggerForceRefresh,
    rateLimit,
    isLoading: isFetching,
  } = useTransactions();

  const isRefreshDisabled =
    isFetching || rateLimit?.forceRefreshRemaining === 0;
  const tooltipTitle = useRefreshTooltip(t, rateLimit);

  return (
    <PortfolioAnimatedLayoutContainer>
      {isLoading ? (
        <PortfolioFilterOptionsSkeleton />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={tooltipTitle}>
            <Box component="span">
              <IconButton
                variant={Variant.AlphaDark}
                size={Size.LG}
                onClick={triggerForceRefresh}
                disabled={isRefreshDisabled}
                aria-label={t('portfolio.filter.refresh')}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Tooltip>

          {isTablet ? (
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
        </Box>
      )}
    </PortfolioAnimatedLayoutContainer>
  );
};
