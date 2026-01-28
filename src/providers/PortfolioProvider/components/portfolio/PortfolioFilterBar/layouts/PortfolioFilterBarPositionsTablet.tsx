'use client';

import { MultiLayerDrawer } from 'src/components/composite/MultiLayerDrawer/MultiLayerDrawer';
import type { FC } from 'react';
import { usePortfolioPositionsFilterBar } from '../hooks';
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
  chains: string[];
  protocols: string[];
  types: string[];
  assets: string[];
  value: number[];
  sortBy: SortByEnum;
}

export const PortfolioFilterBarPositionsTablet: FC = () => {
  const {
    isLoading,
    chainOptions,
    protocolOptions,
    typeOptions,
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
  } = usePortfolioPositionsFilterBar();

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
      chains: filter?.chains?.map(String) ?? [],
      protocols: filter?.protocols ?? [],
      types: filter?.types ?? [],
      assets: filter?.assets ?? [],
      value: [valueMin, valueMax],
      sortBy: sortBy,
    },
    onApply: (values) => {
      handleApplyAllFilters({
        chains: values.chains.map(Number),
        protocols: values.protocols,
        types: values.types,
        assets: values.assets,
        minValue: values.value[0],
        maxValue: values.value[1],
      });
      handleSortBy(values.sortBy);
    },
    onClear: handleClearAllFilters,
    isFilterApplied: (values) => {
      return (
        values.chains.length > 0 ||
        values.protocols.length > 0 ||
        values.types.length > 0 ||
        values.assets.length > 0 ||
        values.value[0] !== valueRangeMin ||
        values.value[1] !== valueRangeMax
      );
    },
  });

  const usedValueMin = pendingValues.value[0] ?? valueMin;
  const usedValueMax = pendingValues.value[1] ?? valueMax;

  const chainBadge =
    pendingValues.chains.length > 0
      ? pendingValues.chains.length.toString()
      : undefined;
  const protocolBadge =
    pendingValues.protocols.length > 0
      ? pendingValues.protocols.length.toString()
      : undefined;
  const typeBadge =
    pendingValues.types.length > 0
      ? pendingValues.types.length.toString()
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

  if (protocolOptions.length > 1) {
    categories.push(
      createMultiSelectCategory({
        id: 'protocol',
        label: t('portfolio.filter.protocol'),
        badgeLabel: protocolBadge,
        value: pendingValues.protocols,
        onChange: (value) => setPendingValue('protocols', value),
        options: protocolOptions,
        searchable: true,
        searchPlaceholder: t('portfolio.filter.search', {
          filterBy: t('portfolio.filter.protocol').toLowerCase(),
        }),
        testId: 'portfolio-filter-protocol-select-mobile',
      }),
    );
  }

  if (typeOptions.length > 1) {
    categories.push(
      createMultiSelectCategory({
        id: 'type',
        label: t('portfolio.filter.type'),
        badgeLabel: typeBadge,
        value: pendingValues.types,
        onChange: (value) => setPendingValue('types', value),
        options: typeOptions,
        searchable: true,
        searchPlaceholder: t('portfolio.filter.search', {
          filterBy: t('portfolio.filter.type').toLowerCase(),
        }),
        testId: 'portfolio-filter-type-select-mobile',
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
