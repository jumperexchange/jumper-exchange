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
  extractHoldingsFilteringParams,
  filterSortBalancesData,
  filterSortPositionsData,
  holdingsSearchParamsParsers,
  removeNullValuesFromFilter,
  resolveHoldingsFilter,
  serializeHoldingsFilterForUrl,
} from './utils';
import type {
  HoldingsFilteringParams,
  HoldingsFilter,
  HoldingsFilterUI,
  SortByEnum,
  OrderEnum,
} from './types';
import { OrderOptions, SortByOptions } from './types';
import type { NullableFields } from '@/types/internal';
import {
  usePortfolioBalances,
  usePortfolioPositions,
  usePortfolioState,
} from '../PortfolioContext';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import type { PortfolioPosition } from '../types';

export interface HoldingsFilteringContextType extends HoldingsFilteringParams {
  sortBy: SortByEnum;
  order: OrderEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: HoldingsFilterUI;
  updateFilter: (filter: NullableFields<HoldingsFilterUI>) => void;
  clearFilters: () => void;
  balancesData: Record<string, PortfolioBalance<WalletToken>[]>;
  positionsData: Record<string, PortfolioPosition[]>;
  balancesIsLoading: boolean;
  positionsIsLoading: boolean;
  balancesIsEmpty: boolean;
  positionsIsEmpty: boolean;
}

export const HoldingsFilteringContext =
  createContext<HoldingsFilteringContextType>({
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
    balancesData: {},
    positionsData: {},
    balancesIsLoading: false,
    positionsIsLoading: false,
    balancesIsEmpty: false,
    positionsIsEmpty: false,
  });

export const HoldingsFilteringProvider = ({ children }: PropsWithChildren) => {
  const [searchParamsState, setSearchParamsState] = useQueryStates(
    holdingsSearchParamsParsers,
    { history: 'replace' },
  );

  const {
    holdingsSortBy: initialSortBy,
    holdingsOrder: initialOrder,
    holdingsWallets,
    holdingsChains,
    holdingsAssets,
    holdingsMinValue,
    holdingsMaxValue,
  } = searchParamsState;

  const filterSearchParams = useMemo(
    () => ({
      wallets: holdingsWallets,
      chains: holdingsChains,
      assets: holdingsAssets,
      minValue: holdingsMinValue,
      maxValue: holdingsMaxValue,
    }),
    [
      holdingsWallets,
      holdingsChains,
      holdingsAssets,
      holdingsMinValue,
      holdingsMaxValue,
    ],
  );

  const initialFilter = useMemo(
    () => removeNullValuesFromFilter<HoldingsFilter>(filterSearchParams),
    [filterSearchParams],
  );

  const [order, setOrder] = useState<OrderEnum>(initialOrder);
  const [sortBy, setSortByState] = useState<SortByEnum>(initialSortBy);
  const [filter, setFilter] = useState<HoldingsFilter>(initialFilter);

  const hasExplicitValueRangeRef = useRef<boolean | null>(null);
  if (hasExplicitValueRangeRef.current === null) {
    hasExplicitValueRangeRef.current =
      holdingsMinValue != null || holdingsMaxValue !== null;
  }

  const balancesState = usePortfolioBalances();
  const positionsState = usePortfolioPositions();
  const orchestrationState = usePortfolioState();
  const balancesSourceState = orchestrationState.sources.balances;
  const positionsSourceState = orchestrationState.sources.positions;

  const balancesIsEmpty = balancesSourceState.isEmpty;
  const positionsIsEmpty = positionsState.positions.length === 0;

  const isAllBalancesDataLoading =
    balancesSourceState.isLoading || balancesSourceState.isRefreshing;

  const stats = useMemo(
    () =>
      extractHoldingsFilteringParams({
        balancesIsEmpty,
        positionsIsEmpty,
        balancesMetadata: balancesState.metadata,
        positionsMetadata: positionsState.metadata,
      }),
    [
      balancesIsEmpty,
      positionsIsEmpty,
      balancesState.metadata,
      positionsState.metadata,
    ],
  );

  useEffect(() => {
    const nextFilter = resolveHoldingsFilter(filter, stats, {
      hasExplicitValueRange: !!hasExplicitValueRangeRef.current,
      isAllBalancesDataLoading,
    });

    if (!isEqual(nextFilter, filter)) {
      setFilter(nextFilter);
      setSearchParamsState(serializeHoldingsFilterForUrl(nextFilter, stats));
    }
  }, [filter, stats, isAllBalancesDataLoading, setSearchParamsState]);

  const balancesData = useMemo(
    () =>
      filterSortBalancesData(
        balancesState.balancesByAddress,
        filter,
        sortBy,
        order,
      ),
    [balancesState.balancesByAddress, filter, sortBy, order],
  );

  const positionsData = useMemo(
    () =>
      filterSortPositionsData(positionsState.positions, filter, sortBy, order),
    [positionsState.positions, filter, sortBy, order],
  );

  const updateFilter = useCallback(
    (newFilter: NullableFields<HoldingsFilter>) => {
      if ('minValue' in newFilter || 'maxValue' in newFilter) {
        hasExplicitValueRangeRef.current = true;
      }

      const merged = removeNullValuesFromFilter({ ...filter, ...newFilter });
      const nextFilter = resolveHoldingsFilter(merged, stats, {
        hasExplicitValueRange: !!hasExplicitValueRangeRef.current,
        isAllBalancesDataLoading: false,
      });

      setFilter(nextFilter);
      setSearchParamsState(serializeHoldingsFilterForUrl(nextFilter, stats));
    },
    [filter, setSearchParamsState, stats],
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

  const setSortBy = useCallback(
    (newSortBy: SortByEnum) => {
      const newOrder =
        newSortBy === SortByOptions.VALUE
          ? OrderOptions.DESC
          : OrderOptions.ASC;
      setOrder(newOrder);
      setSortByState(newSortBy);
      setSearchParamsState({
        holdingsSortBy: newSortBy,
        holdingsOrder: newOrder,
      });
    },
    [setSearchParamsState],
  );

  const balancesIsLoading =
    (balancesSourceState.isLoading && balancesSourceState.isEmpty) ||
    balancesSourceState.isRefreshing;

  const positionsIsLoading =
    positionsSourceState.isLoading || positionsSourceState.isRefreshing;

  // ─── Context value ─────────────────────────────────────────────────────────

  const context: HoldingsFilteringContextType = {
    sortBy,
    order,
    setSortBy,
    filter,
    updateFilter,
    clearFilters,
    balancesData,
    positionsData,
    balancesIsLoading,
    positionsIsLoading,
    balancesIsEmpty,
    positionsIsEmpty,
    ...stats,
  };

  return (
    <HoldingsFilteringContext.Provider value={context}>
      {children}
    </HoldingsFilteringContext.Provider>
  );
};

export const useHoldingsFiltering = (): HoldingsFilteringContextType => {
  return useContext(HoldingsFilteringContext);
};
