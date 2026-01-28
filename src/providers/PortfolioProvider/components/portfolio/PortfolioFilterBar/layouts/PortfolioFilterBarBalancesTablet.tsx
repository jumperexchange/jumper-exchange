'use client';

import { MultiLayerDrawer } from 'src/components/composite/MultiLayerDrawer/MultiLayerDrawer';
import type { FC } from 'react';
import { usePortfolioBalancesFilterBar } from '../hooks';
import type { CategoryConfig } from 'src/components/composite/MultiLayerDrawer/MultiLayerDrawer.types';
import { usePendingFilters } from 'src/components/composite/MultiLayerDrawer/hooks';
import { formatSliderValue } from 'src/components/core/form/Select/utils';
import { PortfolioAnimatedLayoutContainer } from '../components/PortfolioAnimatedLayoutContainer';
import { toFixedFractionDigits } from 'src/utils/formatNumbers';
import {
  createMultiSelectCategory,
  createSingleSelectCategory,
  createSliderCategory,
} from 'src/components/composite/MultiLayerDrawer/utils';
import { useTranslation } from 'react-i18next';
import type { SortByEnum } from '../../../../filtering/types';
import { PortfolioFilterOptionsSkeleton } from './PortfolioFilterOptionsSkeleton';

interface PendingFilterValues {
  wallets: string[];
  chains: string[];
  assets: string[];
  value: number[];
  sortBy: SortByEnum;
}

export const PortfolioFilterBarBalancesTablet: FC = () => {
  const {
    isLoading,
    walletOptions,
    chainOptions,
    assetOptions,
    filter,
    valueMin,
    valueMax,
    valueRangeMin,
    valueRangeMax,
    filtersCount,
    sortByOptions,
    sortBy,
    handleClearAllFilters,
    handleApplyAllFilters,
    handleSortBy,
  } = usePortfolioBalancesFilterBar();

  const { t } = useTranslation();
  const {
    pendingValues,
    setPendingValue,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  } = usePendingFilters<PendingFilterValues>({
    initialValues: {
      wallets: filter?.wallets ?? [],
      chains: filter?.chains?.map(String) ?? [],
      assets: filter?.assets ?? [],
      value: [valueMin, valueMax],
      sortBy: sortBy,
    },
    onApply: (values) => {
      handleApplyAllFilters({
        wallets: values.wallets,
        chains: values.chains.map(Number),
        assets: values.assets,
        minValue: values.value[0],
        maxValue: values.value[1],
      });
      handleSortBy(values.sortBy);
    },
    onClear: handleClearAllFilters,
    isFilterApplied: (values) => {
      return (
        values.wallets.length > 0 ||
        values.chains.length > 0 ||
        values.assets.length > 0 ||
        values.value[0] !== valueRangeMin ||
        values.value[1] !== valueRangeMax
      );
    },
  });

  const usedValueMin = pendingValues.value[0] ?? valueMin;
  const usedValueMax = pendingValues.value[1] ?? valueMax;

  const walletBadge =
    pendingValues.wallets.length > 0
      ? pendingValues.wallets.length.toString()
      : undefined;
  const chainBadge =
    pendingValues.chains.length > 0
      ? pendingValues.chains.length.toString()
      : undefined;
  const assetBadge =
    pendingValues.assets.length > 0
      ? pendingValues.assets.length.toString()
      : undefined;
  const valueBadge =
    !isNaN(usedValueMin) &&
    !isNaN(usedValueMax) &&
    (usedValueMin !== valueRangeMin || usedValueMax !== valueRangeMax)
      ? formatSliderValue(
          pendingValues.value.map((value) =>
            toFixedFractionDigits(value, 0, 2),
          ),
        )
      : undefined;

  const categories: CategoryConfig[] = [];

  if (walletOptions.length > 1) {
    categories.push(
      createMultiSelectCategory({
        id: 'wallet',
        label: t('portfolio.filter.wallet'),
        badgeLabel: walletBadge,
        value: pendingValues.wallets,
        onChange: (value) => setPendingValue('wallets', value),
        options: walletOptions,
        searchable: true,
        searchPlaceholder: t('portfolio.filter.search', {
          filterBy: t('portfolio.filter.wallet').toLowerCase(),
        }),
        testId: 'portfolio-filter-wallet-select-mobile',
      }),
    );
  }

  if (chainOptions.length > 1) {
    categories.push(
      createMultiSelectCategory({
        id: 'chain',
        label: t('portfolio.filter.chain'),
        badgeLabel: chainBadge,
        value: pendingValues.chains,
        onChange: (value) => setPendingValue('chains', value),
        options: chainOptions,
        searchable: true,
        searchPlaceholder: t('portfolio.filter.search', {
          filterBy: t('portfolio.filter.chain').toLowerCase(),
        }),
        testId: 'portfolio-filter-chain-select-mobile',
      }),
    );
  }

  if (assetOptions.length > 1) {
    categories.push(
      createMultiSelectCategory({
        id: 'asset',
        label: t('portfolio.filter.asset'),
        badgeLabel: assetBadge,
        value: pendingValues.assets,
        onChange: (value) => setPendingValue('assets', value),
        options: assetOptions,
        searchable: true,
        searchPlaceholder: t('portfolio.filter.search', {
          filterBy: t('portfolio.filter.asset').toLowerCase(),
        }),
        testId: 'portfolio-filter-asset-select-mobile',
      }),
    );
  }

  if (
    !isNaN(valueRangeMin) &&
    !isNaN(valueRangeMax) &&
    valueRangeMin !== valueRangeMax
  ) {
    categories.push(
      createSliderCategory({
        id: 'value',
        label: t('portfolio.filter.value'),
        badgeLabel: valueBadge,
        value: pendingValues.value,
        onChange: (value) => setPendingValue('value', value),
        min: valueRangeMin,
        max: valueRangeMax,
        testId: 'portfolio-filter-value-select-mobile',
      }),
    );
  }

  if (sortByOptions.length > 1) {
    categories.push(
      createSingleSelectCategory<SortByEnum>({
        id: 'sortBy',
        label: t('portfolio.sorting.sortBy'),
        value: pendingValues.sortBy,
        onChange: (value) => {
          if (!value) {
            return;
          }
          setPendingValue('sortBy', value);
        },
        options: sortByOptions,
        testId: 'portfolio-filter-sort-select-mobile',
      }),
    );
  }

  return (
    <PortfolioAnimatedLayoutContainer useStackWrapper={false}>
      {isLoading ? (
        <PortfolioFilterOptionsSkeleton />
      ) : (
        <MultiLayerDrawer
          categories={categories}
          title={t('portfolio.filter.filterAndSort')}
          applyButtonLabel={t('portfolio.filter.filterAndSort')}
          clearButtonLabel={t('portfolio.filter.clearAll')}
          onApply={applyFilters}
          onClear={clearAll}
          onClose={resetPending}
          appliedFiltersCount={filtersCount}
          disableApply={!hasPendingFiltersApplied}
          disableClear={!hasPendingFiltersApplied}
          testId="portfolio-filters-mobile-drawer"
          defaultTriggerSx={{ justifyContent: 'flex-end' }}
        />
      )}
    </PortfolioAnimatedLayoutContainer>
  );
};
