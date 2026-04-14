'use client';

import { useHoldingsFiltering } from '../../providers/PortfolioProvider/filtering/HoldingsFilteringContext';
import { Avatar } from '@mui/material';
import { getConnectorIcon, useAccount } from '@lifi/wallet-management';
import type { SortByEnum } from '../../providers/PortfolioProvider/filtering/types';
import {
  type HoldingsFilterUI,
  SortByOptions,
} from '../../providers/PortfolioProvider/filtering/types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useChains } from '@/hooks/useChains';
import { sortSelectOptions } from '@/utils/sortSelectOptions';
import { EntityStack } from '../composite/EntityStack/EntityStack';
import { usePendingFilters } from '../composite/MultiLayer/hooks';
import type { HoldingsPendingFilterValues } from './types';
import {
  createMultiSelectCategory,
  createSliderCategory,
  createSingleSelectCategory,
} from '../composite/MultiLayer/utils';
import { countBadge, valueBadge } from './utils';

export const useHoldingsFilterCategories = () => {
  const { t } = useTranslation();
  const {
    balancesIsLoading,
    balancesIsEmpty,
    allWallets,
    allChains,
    allAssets,
    allValueRange,
    filter,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
  } = useHoldingsFiltering();
  const { getChainById } = useChains();
  const { accounts } = useAccount();

  const isLoading = balancesIsLoading || balancesIsEmpty;

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

  const handleApplyAllFilters = (values: Partial<HoldingsFilterUI>) => {
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

  const {
    pendingValues,
    setPendingValue,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  } = usePendingFilters<HoldingsPendingFilterValues>({
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
    onClear: clearFilters,
    isFilterApplied: (values) =>
      values.wallets.length > 0 ||
      values.chains.length > 0 ||
      values.assets.length > 0 ||
      values.value[0] !== allValueRange.min ||
      values.value[1] !== allValueRange.max,
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
    !isNaN(allValueRange.min) &&
    !isNaN(allValueRange.max) &&
    allValueRange.min !== allValueRange.max
      ? createSliderCategory({
          id: 'value',
          label: t('portfolio.filter.value'),
          badgeLabel: valueBadge(
            usedMin,
            usedMax,
            allValueRange.min,
            allValueRange.max,
            pendingValues.value,
          ),
          value: pendingValues.value,
          onChange: (v) => setPendingValue('value', v),
          min: allValueRange.min,
          max: allValueRange.max,
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
    hasFilterApplied,
    categories,
    filtersCount,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingFiltersApplied,
  };
};
