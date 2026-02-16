'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { useQueryStates } from 'nuqs';
import { isEqual } from 'lodash';
import {
  balancesSearchParamsParsers,
  filterSortBalancesData,
  getEffectiveValueRange,
  removeNullValuesFromFilter,
  sanitizeBalancesFilter,
} from './utils';
import { EMPTY_BALANCES_FILTERING_PARAMS } from './constants';
import type {
  BalancesFilteringParams,
  BalancesFilter,
  BalancesFilterUI,
  SortByEnum,
  OrderEnum,
} from './types';
import { OrderOptions, SortByOptions } from './types';
import type { NullableFields } from '@/types/internal';
import { usePortfolioBalances, usePortfolioState } from '../PortfolioContext';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';

export interface BalancesFilteringContextType extends BalancesFilteringParams {
  sortBy: SortByEnum;
  order: OrderEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: BalancesFilterUI;
  updateFilter: (filter: NullableFields<BalancesFilterUI>) => void;
  clearFilters: () => void;
  data: Record<string, PortfolioBalance<WalletToken>[]>;
  isLoading: boolean;
  isEmpty: boolean;
}

export const BalancesFilteringContext =
  createContext<BalancesFilteringContextType>({
    sortBy: SortByOptions.VALUE,
    order: OrderOptions.DESC,
    setSortBy: () => {},
    filter: {},
    updateFilter: () => {},
    clearFilters: () => {},
    allWallets: [],
    allChains: [],
    allAssets: [],
    allValueRange: { min: 0, max: 0 },
    data: {},
    isLoading: false,
    isEmpty: false,
  });

export const BalancesFilteringProvider = ({ children }: PropsWithChildren) => {
  const [searchParamsState, setSearchParamsState] = useQueryStates(
    balancesSearchParamsParsers,
    {
      history: 'replace',
    },
  );

  const {
    balancesSortBy: initialSortBy,
    balancesOrder: initialOrder,
    balancesWallets,
    balancesChains,
    balancesAssets,
    balancesMinValue,
    balancesMaxValue,
  } = searchParamsState;

  const initialFilter = useMemo(() => {
    return removeNullValuesFromFilter<BalancesFilter>({
      wallets: balancesWallets,
      chains: balancesChains,
      assets: balancesAssets,
      minValue: balancesMinValue,
      maxValue: balancesMaxValue,
    });
  }, [
    balancesWallets,
    balancesChains,
    balancesAssets,
    balancesMinValue,
    balancesMaxValue,
  ]);

  const [order, setOrder] = useState<OrderEnum>(initialOrder);
  const [sortBy, setSortBy] = useState<SortByEnum>(initialSortBy);
  const [filter, setFilter] = useState<BalancesFilter>(initialFilter);
  const prevStatsRef = useRef<BalancesFilteringParams>(
    EMPTY_BALANCES_FILTERING_PARAMS,
  );
  /**
   * If an initial filter range is provided, preserve those values
   * and clamp them to the available data once loading completes.
   *
   * If no initial range exists, dynamically update the minimum
   * filter value based on the currently loaded statistics.
   */
  const hasInitialFilterRangeRef = useRef<boolean | null>(null);
  if (hasInitialFilterRangeRef.current === null) {
    hasInitialFilterRangeRef.current =
      balancesMinValue != null || balancesMaxValue !== null;
  }

  const balancesState = usePortfolioBalances();
  const orchestrationState = usePortfolioState();
  const balancesSourceState = orchestrationState.sources.balances;

  const isEmpty = balancesSourceState.isEmpty;

  const isAllDataLoading =
    balancesSourceState.isLoading || balancesSourceState.isRefreshing;

  const stats = useMemo((): BalancesFilteringParams => {
    if (isEmpty) {
      return EMPTY_BALANCES_FILTERING_PARAMS;
    }

    return {
      allWallets: balancesState.metadata.wallets,
      allChains: balancesState.metadata.chains,
      allAssets: balancesState.metadata.assets,
      allValueRange: balancesState.metadata.valueRange,
    };
  }, [balancesState.metadata, isEmpty]);

  useEffect(() => {
    if (isEqual(prevStatsRef.current, stats)) {
      return;
    }

    if (!isAllDataLoading) {
      prevStatsRef.current = stats;
    }

    const shouldClampRangeFilter =
      !!hasInitialFilterRangeRef.current && !isAllDataLoading;

    const sanitized = sanitizeBalancesFilter(
      filter,
      stats,
      shouldClampRangeFilter,
    );
    const effectiveValueRange = getEffectiveValueRange(stats.allValueRange);

    const withDefaults = {
      ...sanitized,
      minValue: hasInitialFilterRangeRef.current
        ? sanitized.minValue
        : effectiveValueRange.min,
    };

    if (!isEqual(withDefaults, filter)) {
      setFilter(removeNullValuesFromFilter(withDefaults));
      setSearchParamsState({
        balancesWallets: withDefaults.wallets,
        balancesChains: withDefaults.chains,
        balancesAssets: withDefaults.assets,
        balancesMinValue: withDefaults.minValue,
        balancesMaxValue: withDefaults.maxValue,
      });
    }
  }, [stats, setSearchParamsState, setFilter, isAllDataLoading, filter]);

  const sortedData = useMemo(() => {
    return filterSortBalancesData(
      balancesState.balancesByAddress,
      filter,
      sortBy,
      order,
    );
  }, [balancesState.balancesByAddress, filter, sortBy, order]);

  const updateFilter = useCallback(
    (newFilter: NullableFields<BalancesFilter>) => {
      const newFilterValue = { ...filter, ...newFilter };
      setFilter(removeNullValuesFromFilter(newFilterValue));
      setSearchParamsState({
        balancesWallets: newFilterValue.wallets,
        balancesChains: newFilterValue.chains,
        balancesAssets: newFilterValue.assets,
        balancesMinValue: newFilterValue.minValue,
        balancesMaxValue: newFilterValue.maxValue,
      });
    },
    [filter, setSearchParamsState],
  );

  const clearFilters = useCallback(() => {
    updateFilter({
      wallets: null,
      chains: null,
      assets: null,
      minValue: null,
      maxValue: null,
    });
  }, [updateFilter]);

  const updateSortBy = useCallback(
    (newSortBy: SortByEnum) => {
      const newOrder =
        newSortBy === SortByOptions.VALUE
          ? OrderOptions.DESC
          : OrderOptions.ASC;
      setOrder(newOrder);
      setSortBy(newSortBy);
      setSearchParamsState({
        balancesSortBy: newSortBy,
        balancesOrder: newOrder,
      });
    },
    [setSortBy, setSearchParamsState],
  );

  const isLoading =
    (balancesSourceState.isLoading && balancesSourceState.isEmpty) ||
    balancesSourceState.isRefreshing;

  const context: BalancesFilteringContextType = {
    order,
    sortBy,
    setSortBy: updateSortBy,
    filter,
    updateFilter,
    clearFilters,
    data: sortedData,
    isLoading,
    isEmpty,
    ...stats,
  };

  return (
    <BalancesFilteringContext.Provider value={context}>
      {children}
    </BalancesFilteringContext.Provider>
  );
};

export const useBalancesFiltering = (): BalancesFilteringContextType => {
  return useContext(BalancesFilteringContext);
};
