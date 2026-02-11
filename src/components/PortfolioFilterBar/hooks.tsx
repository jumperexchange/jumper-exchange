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

export const usePortfolioBalancesFilterBar = () => {
  const { t } = useTranslation();
  const {
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
    isLoading,
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

export const usePortfolioPositionsFilterBar = () => {
  const { t } = useTranslation();
  const {
    isLoading,
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
    isLoading,
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
