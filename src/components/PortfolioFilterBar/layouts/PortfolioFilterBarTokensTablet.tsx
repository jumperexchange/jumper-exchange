import { MultiLayerDrawer } from 'src/components/composite/MultiLayerDrawer/MultiLayerDrawer';
import { FC } from 'react';
import { usePortfolioTokensFilterBar } from '../hooks';
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
  tokensWallets: string[];
  tokensChains: string[];
  tokensAssets: string[];
  tokensValue: number[];
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
  } = usePortfolioTokensFilterBar();

  const {
    pendingValues,
    setPendingValue,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  } = usePendingFilters<PendingFilterValues>({
    initialValues: {
      tokensWallets: filter?.tokensWallets ?? [],
      tokensChains: filter?.tokensChains?.map(String) ?? [],
      tokensAssets: filter?.tokensAssets ?? [],
      tokensValue: [valueMin, valueMax],
    },
    onApply: (values) => {
      handleApplyAllFilters({
        tokensWallets: values.tokensWallets,
        tokensChains: values.tokensChains.map(Number),
        tokensAssets: values.tokensAssets,
        tokensMinValue: values.tokensValue[0],
        tokensMaxValue: values.tokensValue[1],
      });
    },
    onClear: handleClearAllFilters,
    isFilterApplied: (values) => {
      return (
        values.tokensWallets.length > 0 ||
        values.tokensChains.length > 0 ||
        values.tokensAssets.length > 0 ||
        values.tokensValue[0] !== valueRangeMin ||
        values.tokensValue[1] !== valueRangeMax
      );
    },
  });

  const usedValueMin = pendingValues.tokensValue[0] ?? valueMin;
  const usedValueMax = pendingValues.tokensValue[1] ?? valueMax;

  const walletBadge =
    pendingValues.tokensWallets.length > 0
      ? pendingValues.tokensWallets.length.toString()
      : undefined;
  const chainBadge =
    pendingValues.tokensChains.length > 0
      ? pendingValues.tokensChains.length.toString()
      : undefined;
  const assetBadge =
    pendingValues.tokensAssets.length > 0
      ? pendingValues.tokensAssets.length.toString()
      : undefined;
  const valueBadge =
    !isNaN(usedValueMin) &&
    !isNaN(usedValueMax) &&
    (usedValueMin !== valueRangeMin || usedValueMax !== valueRangeMax)
      ? formatSliderValue(
          pendingValues.tokensValue.map((value) =>
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
        value: pendingValues.tokensWallets,
        onChange: (value) => setPendingValue('tokensWallets', value),
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
        value: pendingValues.tokensChains,
        onChange: (value) => setPendingValue('tokensChains', value),
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
        value: pendingValues.tokensAssets,
        onChange: (value) => setPendingValue('tokensAssets', value),
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
        value: pendingValues.tokensValue,
        onChange: (value) => setPendingValue('tokensValue', value),
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
