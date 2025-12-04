import { MultiLayerDrawer } from 'src/components/composite/MultiLayerDrawer/MultiLayerDrawer';
import type { FC } from 'react';
import { usePortfolioDeFiFilterBar } from '../hooks';
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
import type { SortByEnum } from '@/app/ui/portfolio/types';

interface PendingFilterValues {
  defiChains: string[];
  defiProtocols: string[];
  defiTypes: string[];
  defiAssets: string[];
  defiAPY: number[];
  defiValue: number[];
  defiSortBy: SortByEnum;
}

export const PortfolioFilterBarDeFiTablet: FC = () => {
  const {
    chainOptions,
    protocolOptions,
    typeOptions,
    assetOptions,
    filter,
    apyMin,
    apyMax,
    apyRangeMin,
    apyRangeMax,
    valueMin,
    valueMax,
    valueRangeMin,
    valueRangeMax,
    filtersCount,
    sortByOptions,
    sortBy,
    handleClearAllFilters,
    handleApplyAllFilters,
  } = usePortfolioDeFiFilterBar();

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
      defiChains: filter?.defiChains?.map(String) ?? [],
      defiProtocols: filter?.defiProtocols ?? [],
      defiTypes: filter?.defiTypes ?? [],
      defiAssets: filter?.defiAssets ?? [],
      defiAPY: [apyMin, apyMax],
      defiValue: [valueMin, valueMax],
      defiSortBy: sortBy,
    },
    onApply: (values) => {
      handleApplyAllFilters({
        defiChains: values.defiChains.map(Number),
        defiProtocols: values.defiProtocols,
        defiTypes: values.defiTypes,
        defiAssets: values.defiAssets,
        defiMinAPY: values.defiAPY[0],
        defiMaxAPY: values.defiAPY[1],
        defiMinValue: values.defiValue[0],
        defiMaxValue: values.defiValue[1],
      });
    },
    onClear: handleClearAllFilters,
    isFilterApplied: (values) => {
      return (
        values.defiChains.length > 0 ||
        values.defiProtocols.length > 0 ||
        values.defiTypes.length > 0 ||
        values.defiAssets.length > 0 ||
        values.defiAPY[0] !== apyRangeMin ||
        values.defiAPY[1] !== apyRangeMax ||
        values.defiValue[0] !== valueRangeMin ||
        values.defiValue[1] !== valueRangeMax
      );
    },
  });

  const usedAPYMin = pendingValues.defiAPY[0] ?? apyMin;
  const usedAPYMax = pendingValues.defiAPY[1] ?? apyMax;
  const usedValueMin = pendingValues.defiValue[0] ?? valueMin;
  const usedValueMax = pendingValues.defiValue[1] ?? valueMax;

  const chainBadge =
    pendingValues.defiChains.length > 0
      ? pendingValues.defiChains.length.toString()
      : undefined;
  const protocolBadge =
    pendingValues.defiProtocols.length > 0
      ? pendingValues.defiProtocols.length.toString()
      : undefined;
  const typeBadge =
    pendingValues.defiTypes.length > 0
      ? pendingValues.defiTypes.length.toString()
      : undefined;
  const assetBadge =
    pendingValues.defiAssets.length > 0
      ? pendingValues.defiAssets.length.toString()
      : undefined;
  const apyBadge =
    !isNaN(usedAPYMin) &&
    !isNaN(usedAPYMax) &&
    (usedAPYMin !== apyRangeMin || usedAPYMax !== apyRangeMax)
      ? formatSliderValue(
          pendingValues.defiAPY.map((value) =>
            toFixedFractionDigits(value, 0, 2),
          ),
        )
      : undefined;
  const valueBadge =
    !isNaN(usedValueMin) &&
    !isNaN(usedValueMax) &&
    (usedValueMin !== valueRangeMin || usedValueMax !== valueRangeMax)
      ? formatSliderValue(
          pendingValues.defiValue.map((value) =>
            toFixedFractionDigits(value, 0, 2),
          ),
        )
      : undefined;

  const categories: CategoryConfig[] = [];

  if (chainOptions.length > 0) {
    categories.push(
      createMultiSelectCategory({
        id: 'chain',
        label: t('portfolio.filter.chain'),
        badgeLabel: chainBadge,
        value: pendingValues.defiChains,
        onChange: (value) => setPendingValue('defiChains', value),
        options: chainOptions,
        searchable: true,
        searchPlaceholder: t('portfolio.filter.search', {
          filterBy: t('portfolio.filter.chain').toLowerCase(),
        }),
        testId: 'portfolio-defi-filter-chain-select-mobile',
      }),
    );
  }

  if (protocolOptions.length > 0) {
    categories.push(
      createMultiSelectCategory({
        id: 'protocol',
        label: t('portfolio.filter.protocol'),
        badgeLabel: protocolBadge,
        value: pendingValues.defiProtocols,
        onChange: (value) => setPendingValue('defiProtocols', value),
        options: protocolOptions,
        searchable: true,
        searchPlaceholder: t('portfolio.filter.search', {
          filterBy: t('portfolio.filter.protocol').toLowerCase(),
        }),
        testId: 'portfolio-defi-filter-protocol-select-mobile',
      }),
    );
  }

  if (typeOptions.length > 0) {
    categories.push(
      createMultiSelectCategory({
        id: 'type',
        label: t('portfolio.filter.type'),
        badgeLabel: typeBadge,
        value: pendingValues.defiTypes,
        onChange: (value) => setPendingValue('defiTypes', value),
        options: typeOptions,
        searchable: true,
        searchPlaceholder: t('portfolio.filter.search', {
          filterBy: t('portfolio.filter.type').toLowerCase(),
        }),
        testId: 'portfolio-defi-filter-type-select-mobile',
      }),
    );
  }

  if (assetOptions.length > 0) {
    categories.push(
      createMultiSelectCategory({
        id: 'asset',
        label: t('portfolio.filter.asset'),
        badgeLabel: assetBadge,
        value: pendingValues.defiAssets,
        onChange: (value) => setPendingValue('defiAssets', value),
        options: assetOptions,
        searchable: true,
        searchPlaceholder: t('portfolio.filter.search', {
          filterBy: t('portfolio.filter.asset').toLowerCase(),
        }),
        testId: 'portfolio-defi-filter-asset-select-mobile',
      }),
    );
  }

  if (
    !isNaN(apyRangeMin) &&
    !isNaN(apyRangeMax) &&
    apyRangeMin !== apyRangeMax
  ) {
    categories.push(
      createSliderCategory({
        id: 'apy',
        label: t('portfolio.filter.apy'),
        badgeLabel: apyBadge,
        value: pendingValues.defiAPY,
        onChange: (value) => setPendingValue('defiAPY', value),
        min: apyRangeMin,
        max: apyRangeMax,
        testId: 'portfolio-defi-filter-apy-select-mobile',
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
        value: pendingValues.defiValue,
        onChange: (value) => setPendingValue('defiValue', value),
        min: valueRangeMin,
        max: valueRangeMax,
        testId: 'portfolio-defi-filter-value-select-mobile',
      }),
    );
  }

  if (sortByOptions.length > 0) {
    categories.push(
      createSingleSelectCategory<SortByEnum>({
        id: 'sortBy',
        label: t('portfolio.sorting.sortBy'),
        value: pendingValues.defiSortBy,
        onChange: (value) => {
          if (!value) {
            return;
          }
          setPendingValue('defiSortBy', value);
        },
        options: sortByOptions,
        testId: 'portfolio-filter-sort-select-mobile',
      }),
    );
  }

  return (
    <PortfolioAnimatedLayoutContainer useStackWrapper={false}>
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
        testId="portfolio-defi-filters-mobile-drawer"
        defaultTriggerSx={{ justifyContent: 'flex-end' }}
      />
    </PortfolioAnimatedLayoutContainer>
  );
};
