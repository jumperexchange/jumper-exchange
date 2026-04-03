import { useMemo } from 'react';
import { useEarnFiltering } from 'src/app/ui/earn/EarnFilteringContext';
import { ChainStack } from '../composite/ChainStack/ChainStack';
import { TokenStack } from '../composite/TokenStack/TokenStack';
import { toTokenStackTokens } from '../composite/TokenStack/utils';
import type {
  EarnOpportunityFilterUI,
  RewardsAPYEnum,
  SortByEnum,
} from 'src/app/ui/earn/types';
import { RewardsAPYOptions, SortByOptions } from 'src/app/ui/earn/types';
import { useTranslation } from 'react-i18next';
import { ProtocolStack } from '../composite/ProtocolStack/ProtocolStack';
import { capitalizeString } from '@/utils/capitalizeString';
import { useChains } from '@/hooks/useChains';
import { getChainName } from '@/utils/chains/getChainName';
import { sortSelectOptions } from '@/utils/sortSelectOptions';
import { usePendingFilters } from '../composite/MultiLayer/hooks';
import {
  createMultiSelectCategory,
  createSingleSelectCategory,
  createSliderCategory,
} from '../composite/MultiLayer/utils';
import { countBadge, valueBadge } from './utils';

interface EarnPendingFilterValues {
  chains: string[];
  protocols: string[];
  tags: string[];
  assets: string[];
  apy: number[];
  tvl: number[];
  sortBy: SortByEnum;
  rewardsAPY: RewardsAPYEnum[];
}

export const useEarnFilterBar = () => {
  const { t } = useTranslation();
  const {
    allChains,
    allProtocols,
    allAssets,
    allTags,
    allAPY,
    allTVL,
    allRewardsOptions,
    filter,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
  } = useEarnFiltering();
  const { getChainById } = useChains();

  const chainOptions = useMemo(
    () =>
      sortSelectOptions(
        allChains.map((chain) => ({
          value: `${chain.chainId}`,
          label: getChainName(chain, getChainById),
          icon: <ChainStack chainIds={[chain.chainId.toString()]} />,
        })),
      ),
    [allChains, getChainById],
  );

  const protocolOptions = useMemo(
    () =>
      sortSelectOptions(
        allProtocols.map((protocol) => ({
          value: protocol.name,
          label: capitalizeString(protocol.name),
          icon: <ProtocolStack protocols={[protocol]} />,
        })),
      ),
    [allProtocols],
  );

  const tagOptions = useMemo(
    () =>
      sortSelectOptions(
        allTags.map((tag) => ({
          value: tag,
          label: tag,
        })),
      ),
    [allTags],
  );

  const assetOptions = useMemo(
    () =>
      sortSelectOptions(
        allAssets.map((asset) => ({
          value: asset.name,
          label: asset.name,
          icon: <TokenStack tokens={toTokenStackTokens([asset])} />,
        })),
      ),
    [allAssets],
  );

  const apyOptions = useMemo(
    () =>
      sortSelectOptions(
        Object.entries(allAPY).map(([key, value]) => ({
          value: key,
          label: `${key}: ${value}`,
        })),
      ),
    [allAPY],
  );

  const apyMin = Math.min(...Object.values(allAPY), 0);
  const apyMax = Math.max(...Object.values(allAPY), 0);

  const tvlOptions = useMemo(
    () =>
      sortSelectOptions(
        Object.entries(allTVL).map(([key, value]) => ({
          value: key,
          label: `${key}: ${value}`,
        })),
      ),
    [allTVL],
  );

  const tvlMin = Math.min(...Object.values(allTVL), 0);
  const tvlMax = Math.max(...Object.values(allTVL), 0);

  const rewardsAPYOptions = useMemo(
    () =>
      allRewardsOptions.map((option) => {
        const _option = option as RewardsAPYEnum;
        return {
          value: _option,
          label: t(`earn.filter.rewards.${_option}`),
        };
      }),
    [allRewardsOptions, t],
  );

  const sortByOptions = useMemo(
    () => [
      { value: SortByOptions.APY, label: t('earn.sorting.apy') },
      { value: SortByOptions.TVL, label: t('earn.sorting.tvl') },
    ],
    [t],
  );

  // Handle filter changes
  const handleChainChange = (values: string[]) => {
    updateFilter({
      ...filter,
      chains: values.length > 0 ? values.map(Number) : null,
    });
  };

  const handleProtocolChange = (values: string[]) => {
    updateFilter({ ...filter, protocols: values.length > 0 ? values : null });
  };

  const handleTagChange = (values: string[]) => {
    updateFilter({ ...filter, tags: values.length > 0 ? values : null });
  };

  const handleAssetChange = (values: string[]) => {
    updateFilter({ ...filter, assets: values.length > 0 ? values : null });
  };

  const handleAPYChange = (values: number[]) => {
    const hasValues = values.length > 0;
    updateFilter({
      ...filter,
      minAPY: hasValues ? values[0] / 100 : null,
      maxAPY: hasValues ? values[1] / 100 : null,
    });
  };

  const handleTVLChange = (values: number[]) => {
    const hasValues = values.length > 0;
    updateFilter({
      ...filter,
      minTVL: hasValues ? values[0] : null,
      maxTVL: hasValues ? values[1] : null,
    });
  };

  const handleRewardsAPYChange = (values: string[]) => {
    const hasValues = values.length > 0;
    const minRewardsAPY =
      hasValues && values[0] === RewardsAPYOptions.WITH_REWARDS ? 0.0 : null;
    updateFilter({ ...filter, minRewardsAPY });
  };

  const handleSortBy = (value: string) => {
    setSortBy(value as SortByEnum);
  };

  const handleApplyAllFilters = (values: Partial<EarnOpportunityFilterUI>) => {
    updateFilter({ ...values });
  };

  const apyMinValue = filter?.minAPY
    ? Math.trunc(filter.minAPY * 10000) / 100
    : apyMin;
  const apyMaxValue = filter?.maxAPY
    ? Math.trunc(filter.maxAPY * 10000) / 100
    : apyMax;

  const tvlMinValue = filter?.minTVL ? filter.minTVL : tvlMin;
  const tvlMaxValue = filter?.maxTVL ? filter.maxTVL : tvlMax;

  const rewardsAPYValue =
    filter?.minRewardsAPY !== undefined ? RewardsAPYOptions.WITH_REWARDS : null;

  const arrayFiltersCount = [
    filter?.chains,
    filter?.protocols,
    filter?.tags,
    filter?.assets,
  ].reduce((count, arr) => count + (arr?.length || 0), 0);

  const hasAPYFilterApplied =
    !isNaN(apyMinValue) &&
    !isNaN(apyMaxValue) &&
    (apyMinValue !== apyMin || apyMaxValue !== apyMax);

  const apyFilterCount = hasAPYFilterApplied ? 1 : 0;

  const hasTVLFilterApplied =
    !isNaN(tvlMinValue) &&
    !isNaN(tvlMaxValue) &&
    (tvlMinValue !== tvlMin || tvlMaxValue !== tvlMax);

  const tvlFilterCount = hasTVLFilterApplied ? 1 : 0;

  const hasRewardsAPYFilterApplied = filter?.minRewardsAPY !== undefined;
  const rewardsAPYFilterCount = hasRewardsAPYFilterApplied ? 1 : 0;

  const filtersCount =
    arrayFiltersCount + apyFilterCount + tvlFilterCount + rewardsAPYFilterCount;
  const hasFilterApplied = filtersCount > 0;

  return {
    chainOptions,
    protocolOptions,
    tagOptions,
    assetOptions,
    apyOptions,
    tvlOptions,
    rewardsAPYOptions,
    hasFilterApplied,
    filtersCount,
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
    sortByOptions,
    sortBy,
    handleChainChange,
    handleProtocolChange,
    handleTagChange,
    handleAssetChange,
    handleAPYChange,
    handleTVLChange,
    handleRewardsAPYChange,
    handleClearAllFilters: clearFilters,
    handleSortBy,
    handleApplyAllFilters,
  };
};

export const useEarnFilterCategories = () => {
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
    handleSortBy,
  } = useEarnFilterBar();

  const {
    pendingValues,
    setPendingValue,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  } = usePendingFilters<EarnPendingFilterValues>({
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
        minRewardsAPY,
      });
      handleSortBy(values.sortBy ?? '');
    },
    onClear: handleClearAllFilters,
    isFilterApplied: (values) =>
      values.chains.length > 0 ||
      values.protocols.length > 0 ||
      values.tags.length > 0 ||
      values.assets.length > 0 ||
      values.apy[0] !== apyMin ||
      values.apy[1] !== apyMax ||
      values.tvl[0] !== tvlMin ||
      values.tvl[1] !== tvlMax ||
      values.rewardsAPY.length > 0 ||
      values.sortBy !== sortBy,
  });

  const usedApyMin = pendingValues.apy[0] ?? apyMinValue;
  const usedApyMax = pendingValues.apy[1] ?? apyMaxValue;
  const usedTvlMin = pendingValues.tvl[0] ?? tvlMinValue;
  const usedTvlMax = pendingValues.tvl[1] ?? tvlMaxValue;

  const categories = [
    chainOptions.length > 1
      ? createMultiSelectCategory<string>({
          id: 'chain',
          label: t('earn.filter.chain'),
          badgeLabel: countBadge(pendingValues.chains.length),
          value: pendingValues.chains,
          onChange: (v) => setPendingValue('chains', v),
          options: chainOptions,
          searchable: true,
          searchPlaceholder: t('earn.filter.search', {
            filterBy: t('earn.filter.chain').toLowerCase(),
          }),
          testId: 'earn-filter-chain-select',
        })
      : null,
    protocolOptions.length > 1
      ? createMultiSelectCategory({
          id: 'protocol',
          label: t('earn.filter.protocol'),
          badgeLabel: countBadge(pendingValues.protocols.length),
          value: pendingValues.protocols,
          onChange: (v) => setPendingValue('protocols', v),
          options: protocolOptions,
          searchable: true,
          searchPlaceholder: t('earn.filter.search', {
            filterBy: t('earn.filter.protocol').toLowerCase(),
          }),
          testId: 'earn-filter-protocol-select',
        })
      : null,
    tagOptions.length > 1
      ? createMultiSelectCategory({
          id: 'tag',
          label: t('earn.filter.tag'),
          badgeLabel: countBadge(pendingValues.tags.length),
          value: pendingValues.tags,
          onChange: (v) => setPendingValue('tags', v),
          options: tagOptions,
          searchable: true,
          searchPlaceholder: t('earn.filter.search', {
            filterBy: t('earn.filter.tag').toLowerCase(),
          }),
          testId: 'earn-filter-tag-select',
        })
      : null,
    assetOptions.length > 1
      ? createMultiSelectCategory({
          id: 'asset',
          label: t('earn.filter.asset'),
          badgeLabel: countBadge(pendingValues.assets.length),
          value: pendingValues.assets,
          onChange: (v) => setPendingValue('assets', v),
          options: assetOptions,
          searchable: true,
          searchPlaceholder: t('earn.filter.search', {
            filterBy: t('earn.filter.asset').toLowerCase(),
          }),
          testId: 'earn-filter-asset-select',
        })
      : null,
    !isNaN(apyMin) && !isNaN(apyMax) && apyMin !== apyMax
      ? createSliderCategory({
          id: 'apy',
          label: t('earn.filter.apy'),
          badgeLabel: valueBadge(
            usedApyMin,
            usedApyMax,
            apyMin,
            apyMax,
            pendingValues.apy,
          ),
          value: pendingValues.apy,
          onChange: (v) => setPendingValue('apy', v),
          min: apyMin,
          max: apyMax,
          testId: 'earn-filter-apy-select',
        })
      : null,
    !isNaN(tvlMin) && !isNaN(tvlMax) && tvlMin !== tvlMax
      ? createSliderCategory({
          id: 'tvl',
          label: t('earn.filter.tvl'),
          badgeLabel: valueBadge(
            usedTvlMin,
            usedTvlMax,
            tvlMin,
            tvlMax,
            pendingValues.tvl,
          ),
          value: pendingValues.tvl,
          onChange: (v) => setPendingValue('tvl', v),
          min: tvlMin,
          max: tvlMax,
          testId: 'earn-filter-tvl-select',
        })
      : null,
    rewardsAPYOptions.length > 0
      ? createMultiSelectCategory<RewardsAPYEnum>({
          id: 'rewardsAPY',
          label: t('earn.filter.rewards.label'),
          value: pendingValues.rewardsAPY ?? [],
          onChange: (v: RewardsAPYEnum[]) => setPendingValue('rewardsAPY', v),
          options: rewardsAPYOptions,
          testId: 'earn-filter-rewards-select',
        })
      : null,
    sortByOptions.length > 1
      ? createSingleSelectCategory<SortByEnum>({
          id: 'sortBy',
          label: t('earn.sorting.sort'),
          value: pendingValues.sortBy,
          onChange: (v) => {
            if (v) {
              setPendingValue('sortBy', v);
            }
          },
          options: sortByOptions,
          testId: 'earn-filter-sort-select',
        })
      : null,
  ].filter((category) => !!category);

  return {
    categories,
    filtersCount,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  };
};
