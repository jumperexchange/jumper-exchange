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
  holdingsSearchParamsParsers,
  filterSortBalancesData,
  filterSortPositionsData,
  getEffectiveValueRange,
  removeNullValuesFromFilter,
  sanitizeHoldingsFilter,
} from './utils';
import { EMPTY_HOLDINGS_FILTERING_PARAMS } from './constants';
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
import { useProcessedPositions } from '../hooks/useProcessPositions';

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

  const initialFilter = useMemo(
    () =>
      removeNullValuesFromFilter<HoldingsFilter>({
        wallets: holdingsWallets,
        chains: holdingsChains,
        assets: holdingsAssets,
        minValue: holdingsMinValue,
        maxValue: holdingsMaxValue,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [order, setOrder] = useState<OrderEnum>(initialOrder);
  const [sortBy, setSortByState] = useState<SortByEnum>(initialSortBy);
  const [filter, setFilter] = useState<HoldingsFilter>(initialFilter);

  const prevStatsRef = useRef<HoldingsFilteringParams>(
    EMPTY_HOLDINGS_FILTERING_PARAMS,
  );
  const hasInitialFilterRangeRef = useRef<boolean | null>(null);
  if (hasInitialFilterRangeRef.current === null) {
    hasInitialFilterRangeRef.current =
      holdingsMinValue != null || holdingsMaxValue !== null;
  }

  // ─── Data sources ─────────────────────────────────────────────────────────

  const balancesState = usePortfolioBalances();
  const positionsState = usePortfolioPositions();
  const orchestrationState = usePortfolioState();
  const balancesSourceState = orchestrationState.sources.balances;
  const positionsSourceState = orchestrationState.sources.positions;

  const balancesIsEmpty = balancesSourceState.isEmpty;
  const positionsIsEmpty = positionsState.positions.length === 0;

  const isAllBalancesDataLoading =
    balancesSourceState.isLoading || balancesSourceState.isRefreshing;

  // ─── Merged stats from both sources ───────────────────────────────────────

  const stats = useMemo((): HoldingsFilteringParams => {
    const bothEmpty = balancesIsEmpty && positionsIsEmpty;
    if (bothEmpty) {
      return EMPTY_HOLDINGS_FILTERING_PARAMS;
    }

    // Merge chains from both sources
    const mergedChains = Array.from(
      new Set([
        ...(balancesIsEmpty ? [] : balancesState.metadata.chains),
        ...(positionsIsEmpty ? [] : positionsState.metadata.chains),
      ]),
    );

    // Merge assets by symbol — prefer WalletToken (balance asset) over PositionToken
    const assetsBySymbol = new Map<
      string,
      | (typeof balancesState.metadata.assets)[number]
      | (typeof positionsState.metadata.assets)[number]
    >();
    if (!positionsIsEmpty) {
      positionsState.metadata.assets.forEach((a) =>
        assetsBySymbol.set(a.symbol, a),
      );
    }
    if (!balancesIsEmpty) {
      balancesState.metadata.assets.forEach((a) =>
        assetsBySymbol.set(a.symbol, a),
      );
    }
    const mergedAssets = Array.from(assetsBySymbol.values());

    // Merge value ranges
    const balancesRange = balancesIsEmpty
      ? null
      : balancesState.metadata.valueRange;
    const positionsRange = positionsIsEmpty
      ? null
      : positionsState.metadata.valueRange;

    const allValueRange =
      balancesRange && positionsRange
        ? {
            min: Math.min(balancesRange.min, positionsRange.min),
            max: Math.max(balancesRange.max, positionsRange.max),
          }
        : (balancesRange ?? positionsRange ?? { min: 0, max: 0 });

    return {
      allWallets: balancesIsEmpty ? [] : balancesState.metadata.wallets,
      allChains: mergedChains,
      allAssets: mergedAssets,
      allValueRange,
    };
  }, [
    balancesIsEmpty,
    positionsIsEmpty,
    balancesState.metadata,
    positionsState.metadata,
  ]);

  // ─── Sync filter when stats change ────────────────────────────────────────

  useEffect(() => {
    if (isEqual(prevStatsRef.current, stats)) {
      return;
    }

    if (!isAllBalancesDataLoading) {
      prevStatsRef.current = stats;
    }

    const shouldClampRangeFilter =
      !!hasInitialFilterRangeRef.current && !isAllBalancesDataLoading;

    const sanitized = sanitizeHoldingsFilter(
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
        holdingsWallets: withDefaults.wallets,
        holdingsChains: withDefaults.chains,
        holdingsAssets: withDefaults.assets,
        holdingsMinValue: withDefaults.minValue,
        holdingsMaxValue: withDefaults.maxValue,
      });
    }
  }, [stats, setSearchParamsState, isAllBalancesDataLoading, filter]);

  // ─── Filter & sort balances ────────────────────────────────────────────────

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

  // ─── Filter & sort positions ───────────────────────────────────────────────

  // chains/assets pre-filtered here; value range handled in filterSortPositionsData
  const processedPositions = useProcessedPositions({
    filter: {
      chains: filter?.chains,
      assets: filter?.assets,
      sortBy,
      order,
    },
  });

  const positionsData = useMemo(
    () =>
      filterSortPositionsData(
        processedPositions.positions,
        filter,
        sortBy,
        order,
      ),
    [processedPositions.positions, filter, sortBy, order],
  );

  // ─── Filter update helpers ─────────────────────────────────────────────────

  const updateFilter = useCallback(
    (newFilter: NullableFields<HoldingsFilter>) => {
      const newFilterValue = { ...filter, ...newFilter };
      setFilter(removeNullValuesFromFilter(newFilterValue));
      setSearchParamsState({
        holdingsWallets: newFilterValue.wallets,
        holdingsChains: newFilterValue.chains,
        holdingsAssets: newFilterValue.assets,
        holdingsMinValue: newFilterValue.minValue,
        holdingsMaxValue: newFilterValue.maxValue,
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

  // ─── Loading states ────────────────────────────────────────────────────────

  const balancesIsLoading =
    (balancesSourceState.isLoading && balancesSourceState.isEmpty) ||
    balancesSourceState.isRefreshing;

  const positionsIsLoading =
    processedPositions.isLoading || positionsSourceState.isLoading;

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
