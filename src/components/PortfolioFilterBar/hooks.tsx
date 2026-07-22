'use client';

import { useHoldingsFiltering } from '../../providers/PortfolioProvider/filtering/HoldingsFilteringContext';
import type { TransactionSortBy } from '@/providers/TransactionProvider/filtering/TransactionFilteringContext';
import { useTransactionFiltering } from '@/providers/TransactionProvider/filtering/TransactionFilteringContext';
import {
  ALL_TRANSACTION_TYPES,
  isNftTokenOption,
  type NftTokenOption,
} from '@/providers/TransactionProvider/filtering/utils';
import type { TransactionsDto } from '@/types/jumper-backend';
import { truncateAddress } from '@/utils/addresses/truncateAddress';
import { Avatar } from '@mui/material';
import {
  getConnectorIcon,
  useAccount,
} from '@jumperexchange/wallet-management';
import type { NullableFields } from '@/types/internal';
import type {
  HoldingsFilterUI,
  SortByEnum,
} from '../../providers/PortfolioProvider/filtering/types';
import { SortByOptions } from '../../providers/PortfolioProvider/filtering/types';
import { useMemo } from 'react';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useChains } from '@/hooks/useChains';
import { sortSelectOptions } from '@/utils/sortSelectOptions';
import { EntityStack } from '../composite/EntityStack/EntityStack';

import { usePendingFilters } from '../composite/MultiLayer/hooks';
import type { HoldingsPendingFilterValues } from './types';
import {
  createCustomCategory,
  createDateRangeCategory,
  createMultiSelectCategory,
  createSliderCategory,
  createSingleSelectCategory,
} from '../composite/MultiLayer/utils';
import type {
  CategoryOption,
  DateRangeValue,
} from '../composite/MultiLayer/MultiLayer.types';
import { countBadge, datesBadge, valueBadge } from './utils';
import { TransactionAssetsFilterPanel } from './components/TransactionAssetsFilterPanel';
import { buildHoldingsFilterPatchFromPending } from '../../providers/PortfolioProvider/filtering/utils';
import { walletDigest } from '@/utils/walletDigest';
import { isSameDay } from 'date-fns';

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
            startAdornment: connectorIcon ? (
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
            startAdornment: chain ? <EntityStack entities={[chain]} /> : null,
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
          startAdornment: <EntityStack entities={[asset]} />,
        })),
      ),
    [allAssets],
  );

  const { min: rangeMin, max: rangeMax } = allValueRange;
  const valueMin = filter?.minValue ?? rangeMin;
  const valueMax = filter?.maxValue ?? rangeMax;

  const sortByOptions = useMemo(
    () => [
      { value: SortByOptions.VALUE, label: t('portfolio.sorting.totalValue') },
      { value: SortByOptions.CHAIN, label: t('portfolio.sorting.chain') },
      { value: SortByOptions.ASSET, label: t('portfolio.sorting.asset') },
    ],
    [t],
  );

  const handleApplyAllFilters = (values: NullableFields<HoldingsFilterUI>) => {
    updateFilter(values);
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

  const hasValueFilterApplied = valueMin !== rangeMin || valueMax !== rangeMax;
  const valueFilterCount = hasValueFilterApplied ? 1 : 0;
  const filtersCount = arrayFiltersCount + valueFilterCount;
  const hasFilterApplied = filtersCount > 0 && optionsCount > 0;

  const appliedValues = useMemo(
    () => ({
      wallets: filter?.wallets ?? [],
      chains: filter?.chains?.map(String) ?? [],
      assets: filter?.assets ?? [],
      value: [valueMin, valueMax] as [number, number],
      sortBy,
    }),
    [
      filter?.wallets,
      filter?.chains,
      filter?.assets,
      valueMin,
      valueMax,
      sortBy,
    ],
  );

  const {
    pendingValues,
    setPendingValue,
    applyFilters,
    clearAll,
    resetPending,
  } = usePendingFilters<HoldingsPendingFilterValues>({
    initialValues: appliedValues,
    onApply: (values) => {
      handleApplyAllFilters(
        buildHoldingsFilterPatchFromPending(
          values,
          {
            allWallets,
            allChains,
            allAssets,
            allValueRange,
          },
          filter,
        ),
      );
      handleSortBy(values.sortBy);
    },
    onClear: clearFilters,
  });

  const hasPendingChanges = useMemo(
    () => !isEqual(pendingValues, appliedValues),
    [pendingValues, appliedValues],
  );

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
    hasPendingChanges,
  };
};

type TransactionType = TransactionsDto['action'];

interface TransactionPendingFilterValues {
  wallet: string;
  chains: string[];
  assets: string[];
  types: TransactionType[];
  date: DateRangeValue;
  sortBy: string;
}

export const useTransactionFilterCategories = () => {
  const { t } = useTranslation();
  const { accounts } = useAccount();
  const {
    filter,
    updateFilter,
    clearFilters,
    isLoading,
    sortBy,
    setSortBy,
    metadata,
  } = useTransactionFiltering();

  const walletOptions = useMemo(
    () =>
      sortSelectOptions(
        metadata.allWallets.map((walletAddress) => {
          const account = accounts.find((a) => a.address === walletAddress);
          const connectorIcon = account?.connector
            ? getConnectorIcon(account.connector)
            : undefined;
          return {
            value: walletAddress,
            label: account?.connector?.name || walletDigest(walletAddress),
            startAdornment: connectorIcon ? (
              <Avatar
                src={connectorIcon}
                alt={account?.connector?.name || ''}
                sx={{ width: 24, height: 24 }}
              />
            ) : undefined,
          };
        }),
      ),
    [metadata.allWallets, accounts],
  );

  const typeOptions = useMemo(
    () =>
      ALL_TRANSACTION_TYPES.map((type) => ({
        value: type,
        label: t(`portfolio.transactionTypes.${type}`),
      })),
    [t],
  );

  const chainOptions = useMemo(
    () =>
      metadata.allChains.map((chain) => ({
        value: String(chain.id),
        label: chain.name,
        startAdornment: <EntityStack entities={[chain]} />,
      })),
    [metadata.allChains],
  );

  const tokenOptionsByChain = useMemo(() => {
    const optionsByChain = new Map<string, CategoryOption<string>[]>();
    for (const chain of metadata.allChains) {
      const chainTokens = metadata.tokensByChain.get(chain.id) ?? [];
      const nfts = metadata.allAssets.filter(
        (a): a is NftTokenOption =>
          isNftTokenOption(a) && a.chainId === chain.id,
      );
      const options = [
        ...nfts.map((nft) => ({
          value: `${nft.chainId}:${nft.address}`,
          label: truncateAddress(nft.address),
          startAdornment: (
            <EntityStack
              entities={[{ chainId: chain.id, chainKey: String(chain.key) }]}
            />
          ),
        })),
        ...chainTokens.map((token) => ({
          value: `${chain.id}:${token.address.toLowerCase()}`,
          label: token.name,
          startAdornment: <EntityStack entities={[token]} />,
        })),
      ];
      if (options.length) {
        optionsByChain.set(String(chain.id), options);
      }
    }
    return optionsByChain;
  }, [metadata.allChains, metadata.tokensByChain, metadata.allAssets]);

  const sortByOptions = useMemo(
    () => [
      { value: 'date', label: t('portfolio.sorting.date') },
      { value: 'chain', label: t('portfolio.sorting.chain') },
      { value: 'action', label: t('portfolio.sorting.action') },
    ],
    [t],
  );

  const dateRangeMin = metadata.allDateRange.min;
  const dateRangeMax = metadata.allDateRange.max;
  const dateMin = filter.minDate ? new Date(filter.minDate) : dateRangeMin;
  const dateMax = filter.maxDate ? new Date(filter.maxDate) : dateRangeMax;

  const appliedValues = useMemo(
    (): TransactionPendingFilterValues => ({
      wallet: filter.wallet ?? '',
      chains: filter.chains ?? [],
      assets: filter.assets ?? [],
      types: (filter.types ?? []) as TransactionType[],
      date: [dateMin, dateMax],
      sortBy,
    }),
    [
      filter.wallet,
      filter.chains,
      filter.assets,
      filter.types,
      dateMin,
      dateMax,
      sortBy,
    ],
  );

  const {
    pendingValues,
    setPendingValue,
    applyFilters,
    clearAll,
    resetPending,
  } = usePendingFilters<TransactionPendingFilterValues>({
    initialValues: appliedValues,
    onApply: (values) => {
      updateFilter({
        wallet: values.wallet ? values.wallet : undefined,
        chains: values.chains.length ? values.chains : undefined,
        assets: values.assets.length ? values.assets : undefined,
        types: values.types.length ? values.types : undefined,
        minDate: values.date[0]?.toISOString(),
        maxDate: values.date[1]?.toISOString(),
      });
      setSortBy(values.sortBy as TransactionSortBy);
    },
    onClear: clearFilters,
  });

  const hasPendingChanges = useMemo(
    () => !isEqual(pendingValues, appliedValues),
    [pendingValues, appliedValues],
  );

  const hasDateFilterApplied =
    !isSameDay(dateMin, dateRangeMin) || !isSameDay(dateMax, dateRangeMax);

  const filtersCount =
    (walletOptions.length > 1 && filter.wallet ? 1 : 0) +
    (filter.chains?.length ?? 0) +
    (filter.assets?.length ?? 0) +
    (filter.types?.length ?? 0) +
    (hasDateFilterApplied ? 1 : 0);
  const hasFilterApplied = filtersCount > 0;

  const usedMin = pendingValues.date[0] ?? dateMin;
  const usedMax = pendingValues.date[1] ?? dateMax;

  const categories = [
    walletOptions.length > 1
      ? createSingleSelectCategory({
          id: 'wallet',
          label: t('portfolio.filter.wallet'),
          badgeLabel: countBadge(1),
          value: pendingValues.wallet,
          onChange: (v) => {
            if (v) {
              setPendingValue('wallet', v);
            }
          },
          options: walletOptions,
          testId: 'portfolio-filter-transaction-wallet-select',
        })
      : null,
    chainOptions.length > 0
      ? createCustomCategory<unknown>({
          id: 'assets',
          label: t('portfolio.filter.chainAndAsset'),
          badgeLabel: countBadge(
            pendingValues.chains.length + pendingValues.assets.length,
          ),
          testId: 'portfolio-filter-transaction-assets',
          render: ({ slotProps }) => (
            <TransactionAssetsFilterPanel
              chains={pendingValues.chains}
              assets={pendingValues.assets}
              chainOptions={chainOptions}
              tokenOptionsByChain={tokenOptionsByChain}
              onChainsChange={(v) => setPendingValue('chains', v)}
              onAssetsChange={(v) => setPendingValue('assets', v)}
              slotProps={slotProps}
            />
          ),
        })
      : null,
    createMultiSelectCategory({
      id: 'types',
      label: t('portfolio.filter.type'),
      badgeLabel: countBadge(pendingValues.types.length),
      value: pendingValues.types,
      onChange: (v) => setPendingValue('types', v as TransactionType[]),
      options: typeOptions,
      testId: 'portfolio-filter-transaction-type-select',
    }),
    createDateRangeCategory({
      id: 'date',
      label: t('portfolio.sorting.date'),
      badgeLabel: datesBadge(
        usedMin,
        usedMax,
        dateRangeMin,
        dateRangeMax,
        pendingValues.date,
        t('portfolio.filter.dateRange'),
      ),
      value: pendingValues.date,
      onChange: (v) => setPendingValue('date', v),
      min: dateRangeMin,
      max: dateRangeMax,
      testId: 'portfolio-filter-transaction-date-select',
    }),
    createSingleSelectCategory({
      id: 'sortBy',
      label: t('portfolio.sorting.sortBy'),
      value: pendingValues.sortBy,
      onChange: (v) => {
        if (v) {
          setPendingValue('sortBy', v);
        }
      },
      options: sortByOptions,
      testId: 'portfolio-filter-transaction-sort-select',
    }),
  ].filter((category) => !!category);

  return {
    isLoading,
    hasFilterApplied,
    categories,
    filtersCount,
    applyFilters,
    clearAll,
    resetPending,
    hasPendingChanges,
  };
};
