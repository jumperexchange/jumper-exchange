'use client';

import { useBalancesFiltering } from '../../providers/PortfolioProvider/filtering/BalancesFilteringContext';
import { usePositionsFiltering } from '../../providers/PortfolioProvider/filtering/PositionsFilteringContext';
import { Avatar } from '@mui/material';
import { getConnectorIcon, useAccount } from '@lifi/wallet-management';
import type { SortByEnum } from '../../providers/PortfolioProvider/filtering/types';
import {
  type BalancesFilterUI,
  type PositionsFilterUI,
  SortByOptions,
} from '../../providers/PortfolioProvider/filtering/types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from '@/utils/capitalizeString';
import { useChains } from '@/hooks/useChains';
import { sortSelectOptions } from '@/utils/sortSelectOptions';
import { EntityStack } from '../composite/EntityStack/EntityStack';
import { usePendingFilters } from '../composite/MultiLayer/hooks';
import type {
  BalancesPendingFilterValues,
  PositionsPendingFilterValues,
} from './types';
import {
  createMultiSelectCategory,
  createSliderCategory,
  createSingleSelectCategory,
} from '../composite/MultiLayer/utils';
import { countBadge, valueBadge } from './utils';

export const usePortfolioBalancesFilterBar = () => {
  const { t } = useTranslation();
  const {
    isEmpty,
    isLoading,
    allWallets,
    allChains,
    allAssets,
    allValueRange,
    filter,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
  } = useBalancesFiltering();
  const { getChainById } = useChains();
  const { accounts } = useAccount();

  const walletOptions = useMemo(
    () =>
      sortSelectOptions(
        allWallets.map((walletAddress) => {
          const account = accounts.find((a) => a.address === walletAddress);
          const connectorIcon = account?.connector
            ? getConnectorIcon(account.connector)
            : undefined;
          return {
            value: walletAddress,
            label: account?.connector?.name || walletAddress.slice(0, 8),
            icon: connectorIcon ? (
              <Avatar
                src={connectorIcon}
                alt={account?.connector?.name || ''}
                sx={{ width: 24, height: 24 }}
              />
            ) : undefined,
          };
        }),
      ),
    [allWallets, accounts],
  );

  const chainOptions = useMemo(
    () =>
      sortSelectOptions(
        allChains.map((chainId) => {
          const chain = getChainById(chainId);
          return {
            value: `${chainId}`,
            label: chain?.name || `Chain ${chainId}`,
            icon: chain ? <EntityStack entities={[chain]} /> : null,
          };
        }),
      ),
    [allChains, getChainById],
  );

  const assetOptions = useMemo(
    () =>
      sortSelectOptions(
        allAssets.map((asset) => ({
          value: asset.symbol,
          label: asset.name,
          icon: <EntityStack entities={[asset]} />,
        })),
      ),
    [allAssets],
  );

  const valueMin = filter?.minValue ?? allValueRange.min;
  const valueMax = filter?.maxValue ?? allValueRange.max;

  const sortByOptions = useMemo(
    () => [
      { value: SortByOptions.VALUE, label: t('portfolio.sorting.totalValue') },
      { value: SortByOptions.CHAIN, label: t('portfolio.sorting.chain') },
      { value: SortByOptions.ASSET, label: t('portfolio.sorting.asset') },
    ],
    [t],
  );

  const handleWalletChange = (values: string[]) => {
    updateFilter({
      ...filter,
      wallets: values.length > 0 ? values : null,
    });
  };

  const handleChainChange = (values: string[]) => {
    updateFilter({
      ...filter,
      chains: values.length > 0 ? values.map(Number) : null,
    });
  };

  const handleAssetChange = (values: string[]) => {
    updateFilter({
      ...filter,
      assets: values.length > 0 ? values : null,
    });
  };

  const handleValueChange = (values: number[]) => {
    const hasValues = values.length > 0;
    updateFilter({
      ...filter,
      minValue: hasValues ? values[0] : null,
      maxValue: hasValues ? values[1] : null,
    });
  };

  const handleApplyAllFilters = (values: Partial<BalancesFilterUI>) => {
    updateFilter({ ...values });
  };

  const handleSortBy = (value: string) => {
    setSortBy(value as SortByEnum);
  };

  const optionsCount = [
    walletOptions.length,
    chainOptions.length,
    assetOptions.length,
    allValueRange.min !== allValueRange.max &&
    !isNaN(valueMin) &&
    !isNaN(valueMax)
      ? 1
      : 0,
  ].reduce((count, length) => count + (length || 0), 0);

  const arrayFiltersCount = [
    filter?.wallets,
    filter?.chains,
    filter?.assets,
  ].reduce((count, arr) => count + (arr?.length || 0), 0);

  const hasValueFilterApplied =
    valueMin !== allValueRange.min || valueMax !== allValueRange.max;
  const valueFilterCount = hasValueFilterApplied ? 1 : 0;

  const filtersCount = arrayFiltersCount + valueFilterCount;
  const hasFilterApplied = filtersCount > 0 && optionsCount > 0;

  return {
    isLoading: isLoading || isEmpty,
    walletOptions,
    chainOptions,
    assetOptions,
    hasFilterApplied,
    filtersCount,
    filter,
    valueMin,
    valueMax,
    valueRangeMin: allValueRange.min,
    valueRangeMax: allValueRange.max,
    sortByOptions,
    sortBy,
    handleWalletChange,
    handleChainChange,
    handleAssetChange,
    handleValueChange,
    handleClearAllFilters: clearFilters,
    handleApplyAllFilters,
    handleSortBy,
  };
};

export const useBalancesFilterCategories = () => {
  const { t } = useTranslation();
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

  const {
    pendingValues,
    setPendingValue,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  } = usePendingFilters<BalancesPendingFilterValues>({
    initialValues: {
      wallets: filter?.wallets ?? [],
      chains: filter?.chains?.map(String) ?? [],
      assets: filter?.assets ?? [],
      value: [valueMin, valueMax],
      sortBy,
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
    isFilterApplied: (values) =>
      values.wallets.length > 0 ||
      values.chains.length > 0 ||
      values.assets.length > 0 ||
      values.value[0] !== valueRangeMin ||
      values.value[1] !== valueRangeMax,
  });

  const usedMin = pendingValues.value[0] ?? valueMin;
  const usedMax = pendingValues.value[1] ?? valueMax;

  const categories = [
    walletOptions.length > 1
      ? createMultiSelectCategory({
          id: 'wallet',
          label: t('portfolio.filter.wallet'),
          badgeLabel: countBadge(pendingValues.wallets.length),
          value: pendingValues.wallets,
          onChange: (v) => setPendingValue('wallets', v),
          options: walletOptions,
          searchable: true,
          searchPlaceholder: t('portfolio.filter.search', {
            filterBy: t('portfolio.filter.wallet').toLowerCase(),
          }),
          testId: 'portfolio-filter-wallet-select',
        })
      : null,
    chainOptions.length > 1
      ? createMultiSelectCategory({
          id: 'chain',
          label: t('portfolio.filter.chain'),
          badgeLabel: countBadge(pendingValues.chains.length),
          value: pendingValues.chains,
          onChange: (v) => setPendingValue('chains', v),
          options: chainOptions,
          searchable: true,
          searchPlaceholder: t('portfolio.filter.search', {
            filterBy: t('portfolio.filter.chain').toLowerCase(),
          }),
          testId: 'portfolio-filter-chain-select',
        })
      : null,
    assetOptions.length > 1
      ? createMultiSelectCategory({
          id: 'asset',
          label: t('portfolio.filter.asset'),
          badgeLabel: countBadge(pendingValues.assets.length),
          value: pendingValues.assets,
          onChange: (v) => setPendingValue('assets', v),
          options: assetOptions,
          searchable: true,
          searchPlaceholder: t('portfolio.filter.search', {
            filterBy: t('portfolio.filter.asset').toLowerCase(),
          }),
          testId: 'portfolio-filter-asset-select',
        })
      : null,
    !isNaN(valueRangeMin) &&
    !isNaN(valueRangeMax) &&
    valueRangeMin !== valueRangeMax
      ? createSliderCategory({
          id: 'value',
          label: t('portfolio.filter.value'),
          badgeLabel: valueBadge(
            usedMin,
            usedMax,
            valueRangeMin,
            valueRangeMax,
            pendingValues.value,
          ),
          value: pendingValues.value,
          onChange: (v) => setPendingValue('value', v),
          min: valueRangeMin,
          max: valueRangeMax,
          testId: 'portfolio-filter-value-select',
        })
      : null,
    sortByOptions.length > 1
      ? createSingleSelectCategory<SortByEnum>({
          id: 'sortBy',
          label: t('portfolio.sorting.sortBy'),
          value: pendingValues.sortBy,
          onChange: (v) => {
            if (v) {
              setPendingValue('sortBy', v);
            }
          },
          options: sortByOptions,
          testId: 'portfolio-filter-sort-select',
        })
      : null,
  ].filter((category) => !!category);

  return {
    isLoading,
    categories,
    filtersCount,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  };
};

export const usePortfolioPositionsFilterBar = () => {
  const { t } = useTranslation();
  const {
    isLoading,
    isEmpty,
    allChains,
    allProtocols,
    allTypes,
    allAssets,
    allValueRange,
    filter,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
  } = usePositionsFiltering();
  const { getChainById } = useChains();

  const chainOptions = useMemo(
    () =>
      sortSelectOptions(
        allChains.map((chainId) => {
          const chain = getChainById(chainId);
          return {
            value: `${chainId}`,
            label: chain?.name || `Chain ${chainId}`,
            icon: chain ? <EntityStack entities={[chain]} /> : null,
          };
        }),
      ),
    [allChains, getChainById],
  );

  const protocolOptions = useMemo(
    () =>
      sortSelectOptions(
        allProtocols.map((protocol) => ({
          value: protocol.name,
          label: capitalizeString(protocol.name),
          icon: <EntityStack entities={[protocol]} />,
        })),
      ),
    [allProtocols],
  );

  const typeOptions = useMemo(
    () =>
      sortSelectOptions(
        allTypes.map((type) => ({
          value: type,
          label: type,
        })),
      ),
    [allTypes],
  );

  const assetOptions = useMemo(
    () =>
      sortSelectOptions(
        allAssets.map((asset) => ({
          value: asset.symbol,
          label: asset.name,
          icon: <EntityStack entities={[asset]} />,
        })),
      ),
    [allAssets],
  );

  const valueMin = filter?.minValue ?? allValueRange.min;
  const valueMax = filter?.maxValue ?? allValueRange.max;

  const sortByOptions = useMemo(
    () => [
      { value: SortByOptions.VALUE, label: t('portfolio.sorting.totalValue') },
      { value: SortByOptions.CHAIN, label: t('portfolio.sorting.chain') },
      { value: SortByOptions.ASSET, label: t('portfolio.sorting.asset') },
    ],
    [t],
  );

  const handleChainChange = (values: string[]) => {
    updateFilter({
      ...filter,
      chains: values.length > 0 ? values.map(Number) : null,
    });
  };

  const handleProtocolChange = (values: string[]) => {
    updateFilter({
      ...filter,
      protocols: values.length > 0 ? values : null,
    });
  };

  const handleTypeChange = (values: string[]) => {
    updateFilter({ ...filter, types: values.length > 0 ? values : null });
  };

  const handleAssetChange = (values: string[]) => {
    updateFilter({ ...filter, assets: values.length > 0 ? values : null });
  };

  const handleValueChange = (values: number[]) => {
    const hasValues = values.length > 0;
    updateFilter({
      ...filter,
      minValue: hasValues ? values[0] : null,
      maxValue: hasValues ? values[1] : null,
    });
  };

  const handleApplyAllFilters = (values: Partial<PositionsFilterUI>) => {
    updateFilter({ ...values });
  };

  const handleSortBy = (value: string) => {
    setSortBy(value as SortByEnum);
  };

  const optionsCount = [
    chainOptions.length,
    protocolOptions.length,
    typeOptions.length,
    assetOptions.length,
    allValueRange.min !== allValueRange.max &&
    !isNaN(valueMin) &&
    !isNaN(valueMax)
      ? 1
      : 0,
  ].reduce((count, length) => count + (length || 0), 0);

  const arrayFiltersCount = [
    filter?.chains,
    filter?.protocols,
    filter?.types,
    filter?.assets,
  ].reduce((count, arr) => count + (arr?.length || 0), 0);

  const hasValueFilterApplied =
    valueMin !== allValueRange.min || valueMax !== allValueRange.max;
  const rangeFiltersCount = hasValueFilterApplied ? 1 : 0;

  const filtersCount = arrayFiltersCount + rangeFiltersCount;
  const hasFilterApplied = filtersCount > 0 && optionsCount > 0;

  return {
    isLoading: isLoading || isEmpty,
    chainOptions,
    protocolOptions,
    typeOptions,
    assetOptions,
    hasFilterApplied,
    filtersCount,
    filter,
    valueMin,
    valueMax,
    valueRangeMin: allValueRange.min,
    valueRangeMax: allValueRange.max,
    sortByOptions,
    sortBy,
    handleChainChange,
    handleProtocolChange,
    handleTypeChange,
    handleAssetChange,
    handleValueChange,
    handleClearAllFilters: clearFilters,
    handleApplyAllFilters,
    handleSortBy,
  };
};

export const usePositionsFilterCategories = () => {
  const { t } = useTranslation();
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

  const {
    pendingValues,
    setPendingValue,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  } = usePendingFilters<PositionsPendingFilterValues>({
    initialValues: {
      chains: filter?.chains?.map(String) ?? [],
      protocols: filter?.protocols ?? [],
      types: filter?.types ?? [],
      assets: filter?.assets ?? [],
      value: [valueMin, valueMax],
      sortBy,
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
    isFilterApplied: (values) =>
      values.chains.length > 0 ||
      values.protocols.length > 0 ||
      values.types.length > 0 ||
      values.assets.length > 0 ||
      values.value[0] !== valueRangeMin ||
      values.value[1] !== valueRangeMax,
  });

  const usedMin = pendingValues.value[0] ?? valueMin;
  const usedMax = pendingValues.value[1] ?? valueMax;

  const categories = [
    chainOptions.length > 1
      ? createMultiSelectCategory({
          id: 'chain',
          label: t('portfolio.filter.chain'),
          badgeLabel: countBadge(pendingValues.chains.length),
          value: pendingValues.chains,
          onChange: (v) => setPendingValue('chains', v),
          options: chainOptions,
          searchable: true,
          searchPlaceholder: t('portfolio.filter.search', {
            filterBy: t('portfolio.filter.chain').toLowerCase(),
          }),
          testId: 'portfolio-filter-chain-select',
        })
      : null,
    protocolOptions.length > 1
      ? createMultiSelectCategory({
          id: 'protocol',
          label: t('portfolio.filter.protocol'),
          badgeLabel: countBadge(pendingValues.protocols.length),
          value: pendingValues.protocols,
          onChange: (v) => setPendingValue('protocols', v),
          options: protocolOptions,
          searchable: true,
          searchPlaceholder: t('portfolio.filter.search', {
            filterBy: t('portfolio.filter.protocol').toLowerCase(),
          }),
          testId: 'portfolio-filter-protocol-select',
        })
      : null,
    typeOptions.length > 1
      ? createMultiSelectCategory({
          id: 'type',
          label: t('portfolio.filter.type'),
          badgeLabel: countBadge(pendingValues.types.length),
          value: pendingValues.types,
          onChange: (v) => setPendingValue('types', v),
          options: typeOptions,
          searchable: true,
          searchPlaceholder: t('portfolio.filter.search', {
            filterBy: t('portfolio.filter.type').toLowerCase(),
          }),
          testId: 'portfolio-filter-type-select',
        })
      : null,
    assetOptions.length > 1
      ? createMultiSelectCategory({
          id: 'asset',
          label: t('portfolio.filter.asset'),
          badgeLabel: countBadge(pendingValues.assets.length),
          value: pendingValues.assets,
          onChange: (v) => setPendingValue('assets', v),
          options: assetOptions,
          searchable: true,
          searchPlaceholder: t('portfolio.filter.search', {
            filterBy: t('portfolio.filter.asset').toLowerCase(),
          }),
          testId: 'portfolio-filter-asset-select',
        })
      : null,
    !isNaN(valueRangeMin) &&
    !isNaN(valueRangeMax) &&
    valueRangeMin !== valueRangeMax
      ? createSliderCategory({
          id: 'value',
          label: t('portfolio.filter.value'),
          badgeLabel: valueBadge(
            usedMin,
            usedMax,
            valueRangeMin,
            valueRangeMax,
            pendingValues.value,
          ),
          value: pendingValues.value,
          onChange: (v) => setPendingValue('value', v),
          min: valueRangeMin,
          max: valueRangeMax,
          testId: 'portfolio-filter-value-select',
        })
      : null,
    sortByOptions.length > 1
      ? createSingleSelectCategory<SortByEnum>({
          id: 'sortBy',
          label: t('portfolio.sorting.sortBy'),
          value: pendingValues.sortBy,
          onChange: (v) => {
            if (v) {
              setPendingValue('sortBy', v);
            }
          },
          options: sortByOptions,
          testId: 'portfolio-filter-sort-select',
        })
      : null,
  ].filter((category) => !!category);

  return {
    isLoading,
    categories,
    filtersCount,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  };
};
