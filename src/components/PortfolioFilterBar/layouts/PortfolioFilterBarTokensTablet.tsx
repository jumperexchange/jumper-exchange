import { MultiLayerDrawer } from 'src/components/composite/MultiLayerDrawer/MultiLayerDrawer';
import { FC } from 'react';
import { usePortfolioFilterBar } from '../hooks';
import {
  CategoryConfig,
  CategoryContentType,
} from 'src/components/composite/MultiLayerDrawer/MultiLayerDrawer.types';
import { usePendingFilters } from 'src/components/composite/MultiLayerDrawer/hooks';
import { formatSliderValue } from 'src/components/core/form/Select/utils';
import { PortfolioAnimatedLayoutContainer } from '../components/PortfolioAnimatedLayoutContainer';
import { toFixedFractionDigits } from 'src/utils/formatNumbers';
import {
  createMultiSelectCategory,
  createSliderCategory,
} from 'src/components/composite/MultiLayerDrawer/utils';

interface PendingFilterValues {
  wallets: string[];
  chains: string[];
  assets: string[];
  value: number[];
}

export const PortfolioFilterBarTokensTablet: FC = () => {
  const {
    walletOptions,
    chainOptions,
    assetOptions,
    filter,
    valueMin,
    valueMax,
    valueRangeMin,
    valueRangeMax,
    filtersCount,
    handleClearAllFilters,
    handleApplyAllFilters,
  } = usePortfolioFilterBar();

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
    },
    onApply: (values) => {
      handleApplyAllFilters({
        wallets: values.wallets,
        chains: values.chains.map(Number),
        assets: values.assets,
        minValue: values.value[0],
        maxValue: values.value[1],
      });
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

  if (walletOptions.length > 0) {
    categories.push(
      createMultiSelectCategory({
        id: 'wallet',
        label: 'Wallets',
        badgeLabel: walletBadge,
        value: pendingValues.wallets,
        onChange: (value) => setPendingValue('wallets', value),
        options: walletOptions,
        searchable: true,
        searchPlaceholder: 'Search wallets',
        testId: 'portfolio-filter-wallet-select-mobile',
      }),
    );
  }

  if (chainOptions.length > 0) {
    categories.push(
      createMultiSelectCategory({
        id: 'chain',
        label: 'Chains',
        badgeLabel: chainBadge,
        value: pendingValues.chains,
        onChange: (value) => setPendingValue('chains', value),
        options: chainOptions,
        searchable: true,
        searchPlaceholder: 'Search chains',
        testId: 'portfolio-filter-chain-select-mobile',
      }),
    );
  }

  if (assetOptions.length > 0) {
    categories.push(
      createMultiSelectCategory({
        id: 'asset',
        label: 'Assets',
        badgeLabel: assetBadge,
        value: pendingValues.assets,
        onChange: (value) => setPendingValue('assets', value),
        options: assetOptions,
        searchable: true,
        searchPlaceholder: 'Search assets',
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
        label: 'Value',
        badgeLabel: valueBadge,
        value: pendingValues.value,
        onChange: (value) => setPendingValue('value', value),
        min: valueRangeMin,
        max: valueRangeMax,
        testId: 'portfolio-filter-value-select-mobile',
      }),
    );
  }

  return (
    <PortfolioAnimatedLayoutContainer useStackWrapper={false}>
      <MultiLayerDrawer
        categories={categories}
        title="Filter"
        applyButtonLabel="Apply Filters"
        clearButtonLabel="Clear All"
        onApply={applyFilters}
        onClear={clearAll}
        onClose={resetPending}
        appliedFiltersCount={filtersCount}
        disableApply={!hasPendingFiltersApplied}
        disableClear={!hasPendingFiltersApplied}
        testId="portfolio-filters-mobile-drawer"
        defaultTriggerSx={{ justifyContent: 'flex-end' }}
      />
    </PortfolioAnimatedLayoutContainer>
  );
};
