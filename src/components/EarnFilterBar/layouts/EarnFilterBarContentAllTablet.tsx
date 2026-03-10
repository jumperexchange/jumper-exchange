import { MultiLayerDrawer } from '@/components/composite/MultiLayerDrawer/MultiLayerDrawer';
import { useEarnFilterBar } from '../hooks';
import type { CategoryConfig } from '@/components/composite/MultiLayer/MultiLayer.types';
import { usePendingFilters } from '@/components/composite/MultiLayer/hooks';
import { useTranslation } from 'react-i18next';
import { formatSliderValue } from 'src/components/core/form/Select/utils';
import {
  RewardsAPYOptions,
  type RewardsAPYEnum,
  type SortByEnum,
} from 'src/app/ui/earn/types';
import { EarnAnimatedLayoutContainer } from '../components/EarnAnimatedLayoutContainer';
import { toFixedFractionDigits } from 'src/utils/formatNumbers';
import {
  createMultiSelectCategory,
  createSingleSelectCategory,
  createSliderCategory,
} from '@/components/composite/MultiLayer/utils';

interface PendingFilterValues {
  chains: string[];
  protocols: string[];
  tags: string[];
  assets: string[];
  apy: number[];
  tvl: number[];
  sortBy: SortByEnum;
  rewardsAPY: RewardsAPYEnum[];
}

export const EarnFilterBarContentAllTablet = () => {
  const { t } = useTranslation();
  const {
    chainOptions,
    protocolOptions,
    tagOptions,
    assetOptions,
    filter,
    apyMinValue,
    apyMaxValue,
    apyMin,
    apyMax,
    tvlMinValue,
    tvlMaxValue,
    tvlMin,
    tvlMax,
    rewardsAPYValue,
    rewardsAPYOptions,
    sortByOptions,
    sortBy,
    filtersCount,
    handleClearAllFilters,
    handleApplyAllFilters,
  } = useEarnFilterBar();

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
      tags: filter?.tags ?? [],
      assets: filter?.assets ?? [],
      apy: [apyMinValue, apyMaxValue],
      tvl: [tvlMinValue, tvlMaxValue],
      sortBy: sortBy ?? '',
      rewardsAPY: rewardsAPYValue ? [rewardsAPYValue] : [],
    },
    onApply: (values) => {
      const minRewardsAPY = values.rewardsAPY.includes(
        RewardsAPYOptions.WITH_REWARDS,
      )
        ? 0.0
        : undefined;
      handleApplyAllFilters({
        chains: values.chains.map(Number) ?? [],
        protocols: values.protocols ?? [],
        tags: values?.tags ?? [],
        assets: values.assets ?? [],
        minAPY: values.apy[0] / 100,
        maxAPY: values.apy[1] / 100,
        minTVL: values.tvl[0],
        maxTVL: values.tvl[1],
        sortBy: values.sortBy ?? '',
        minRewardsAPY,
      });
    },
    onClear: handleClearAllFilters,
    isFilterApplied: (values) => {
      return (
        values.chains.length > 0 ||
        values.protocols.length > 0 ||
        values.tags.length > 0 ||
        values.assets.length > 0 ||
        values.apy[0] !== apyMin ||
        values.apy[1] !== apyMax ||
        values.tvl[0] !== tvlMin ||
        values.tvl[1] !== tvlMax ||
        values.rewardsAPY.length > 0
      );
    },
  });

  const usedApyMinValue = pendingValues.apy[0] ?? apyMinValue;
  const usedApyMaxValue = pendingValues.apy[1] ?? apyMaxValue;
  const usedTvlMinValue = pendingValues.tvl[0] ?? tvlMinValue;
  const usedTvlMaxValue = pendingValues.tvl[1] ?? tvlMaxValue;

  const chainBadge =
    pendingValues.chains.length > 0
      ? pendingValues.chains.length.toString()
      : undefined;
  const protocolBadge =
    pendingValues.protocols.length > 0
      ? pendingValues.protocols.length.toString()
      : undefined;
  const tagBadge =
    pendingValues.tags.length > 0
      ? pendingValues.tags.length.toString()
      : undefined;
  const assetBadge =
    pendingValues.assets.length > 0
      ? pendingValues.assets.length.toString()
      : undefined;
  const apyBadge =
    !isNaN(usedApyMinValue) &&
    !isNaN(usedApyMaxValue) &&
    (usedApyMinValue !== apyMin || usedApyMaxValue !== apyMax)
      ? formatSliderValue(
          pendingValues.apy.map((value) => toFixedFractionDigits(value, 0, 2)),
        )
      : undefined;
  const tvlBadge =
    !isNaN(usedTvlMinValue) &&
    !isNaN(usedTvlMaxValue) &&
    (usedTvlMinValue !== tvlMin || usedTvlMaxValue !== tvlMax)
      ? formatSliderValue(
          pendingValues.tvl.map((value) => toFixedFractionDigits(value, 0, 2)),
        )
      : undefined;

  const categories: CategoryConfig[] = [];

  if (chainOptions.length > 1) {
    categories.push(
      createMultiSelectCategory<string>({
        id: 'chain',
        label: t('earn.filter.chain'),
        badgeLabel: chainBadge,
        value: pendingValues.chains,
        onChange: (value: string[]) => setPendingValue('chains', value),
        options: chainOptions,
        searchable: true,
        searchPlaceholder: t('earn.filter.search', {
          filterBy: t('earn.filter.chain').toLowerCase(),
        }),
        testId: 'earn-filter-chain-select-mobile',
      }),
    );
  }
  if (protocolOptions.length > 1) {
    categories.push(
      createMultiSelectCategory({
        id: 'protocol',
        label: t('earn.filter.protocol'),
        badgeLabel: protocolBadge,
        value: pendingValues.protocols,
        onChange: (value: string[]) => setPendingValue('protocols', value),
        options: protocolOptions,
        searchable: true,
        searchPlaceholder: t('earn.filter.search', {
          filterBy: t('earn.filter.protocol').toLowerCase(),
        }),
        testId: 'earn-filter-protocol-select-mobile',
      }),
    );
  }
  if (tagOptions.length > 1) {
    categories.push(
      createMultiSelectCategory({
        id: 'tag',
        label: t('earn.filter.tag'),
        badgeLabel: tagBadge,
        value: pendingValues.tags,
        onChange: (value: string[]) => setPendingValue('tags', value),
        options: tagOptions,
        searchable: true,
        searchPlaceholder: t('earn.filter.search', {
          filterBy: t('earn.filter.tag').toLowerCase(),
        }),
        testId: 'earn-filter-tag-select-mobile',
      }),
    );
  }
  if (assetOptions.length > 1) {
    categories.push(
      createMultiSelectCategory({
        id: 'asset',
        label: t('earn.filter.asset'),
        badgeLabel: assetBadge,
        value: pendingValues.assets,
        onChange: (value: string[]) => setPendingValue('assets', value),
        options: assetOptions,
        searchable: true,
        searchPlaceholder: t('earn.filter.search', {
          filterBy: t('earn.filter.asset').toLowerCase(),
        }),
        testId: 'earn-filter-asset-select-mobile',
      }),
    );
  }

  if (!isNaN(apyMin) && !isNaN(apyMax) && apyMin !== apyMax) {
    categories.push(
      createSliderCategory({
        id: 'apy',
        label: t('earn.filter.apy'),
        badgeLabel: apyBadge,
        value: pendingValues.apy,
        onChange: (value: number[]) => setPendingValue('apy', value),
        min: apyMin,
        max: apyMax,
        testId: 'earn-filter-apy-select-mobile',
      }),
    );
  }

  if (!isNaN(tvlMin) && !isNaN(tvlMax) && tvlMin !== tvlMax) {
    categories.push(
      createSliderCategory({
        id: 'tvl',
        label: t('earn.filter.tvl'),
        badgeLabel: tvlBadge,
        value: pendingValues.tvl,
        onChange: (value: number[]) => setPendingValue('tvl', value),
        min: tvlMin,
        max: tvlMax,
        testId: 'earn-filter-tvl-select-mobile',
      }),
    );
  }

  if (rewardsAPYOptions.length > 0) {
    categories.push(
      createMultiSelectCategory<RewardsAPYEnum>({
        id: 'rewardsAPY',
        label: t('earn.filter.rewards.label'),
        value: pendingValues.rewardsAPY ?? [],
        onChange: (value: RewardsAPYEnum[]) =>
          setPendingValue('rewardsAPY', value),
        options: rewardsAPYOptions,
        testId: 'earn-filter-rewards-select-mobile',
      }),
    );
  }

  if (sortByOptions.length > 1) {
    categories.push(
      createSingleSelectCategory<SortByEnum>({
        id: 'sortBy',
        label: t('earn.sorting.sort'),
        value: pendingValues.sortBy,
        onChange: (value) => setPendingValue('sortBy', value),
        options: sortByOptions,
        testId: 'earn-filter-sort-select-mobile',
      }),
    );
  }

  return (
    <EarnAnimatedLayoutContainer useStackWrapper={false}>
      <MultiLayerDrawer
        categories={categories}
        title={t('earn.filter.filterAndSort')}
        applyButtonLabel={t('earn.filter.filterAndSort')}
        clearButtonLabel={t('earn.filter.clearAll')}
        onApply={applyFilters}
        onClear={clearAll}
        onClose={resetPending}
        appliedFiltersCount={filtersCount}
        disableApply={!hasPendingFiltersApplied}
        disableClear={!hasPendingFiltersApplied}
        testId="earn-filters-mobile-drawer"
        defaultTriggerSx={{ justifyContent: 'flex-end' }}
      />
    </EarnAnimatedLayoutContainer>
  );
};
