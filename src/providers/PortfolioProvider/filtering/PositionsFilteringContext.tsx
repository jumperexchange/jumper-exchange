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
  positionsSearchParamsParsers,
  filterSortPositionsData,
  getEffectiveValueRange,
  removeNullValuesFromFilter,
  sanitizePositionsFilter,
} from './utils';
import { EMPTY_POSITIONS_FILTERING_PARAMS } from './constants';
import type {
  PositionsFilteringParams,
  PositionsFilter,
  PositionsFilterUI,
  SortByEnum,
  OrderEnum,
} from './types';
import { OrderOptions, SortByOptions } from './types';
import type { NullableFields } from '@/types/internal';
import { usePortfolioPositions, usePortfolioState } from '../PortfolioContext';
import type { PortfolioPosition } from '../types';
import { useProcessedPositions } from '../hooks/useProcessPositions';

export interface PositionsFilteringContextType extends PositionsFilteringParams {
  sortBy: SortByEnum;
  order: OrderEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: PositionsFilterUI;
  updateFilter: (filter: NullableFields<PositionsFilterUI>) => void;
  clearFilters: () => void;
  data: Record<string, PortfolioPosition[]>;
  isLoading: boolean;
  isEmpty: boolean;
}

export const PositionsFilteringContext =
  createContext<PositionsFilteringContextType>({
    sortBy: SortByOptions.VALUE,
    order: OrderOptions.DESC,
    setSortBy: () => {},
    filter: {},
    updateFilter: () => {},
    clearFilters: () => {},
    allChains: [],
    allProtocols: [],
    allTypes: [],
    allAssets: [],
    allValueRange: { min: 0, max: 0 },
    data: {},
    isLoading: false,
    isEmpty: false,
  });

export const PositionsFilteringProvider = ({ children }: PropsWithChildren) => {
  const [searchParamsState, setSearchParamsState] = useQueryStates(
    positionsSearchParamsParsers,
    {
      history: 'replace',
    },
  );

  const {
    positionsSortBy: initialSortBy,
    positionsOrder: initialOrder,
    positionsChains,
    positionsProtocols,
    positionsTypes,
    positionsAssets,
    positionsMinValue,
    positionsMaxValue,
  } = searchParamsState;

  const initialFilter = useMemo(() => {
    return removeNullValuesFromFilter<PositionsFilter>({
      chains: positionsChains,
      protocols: positionsProtocols,
      types: positionsTypes,
      assets: positionsAssets,
      minValue: positionsMinValue,
      maxValue: positionsMaxValue,
    });
  }, [
    positionsChains,
    positionsProtocols,
    positionsTypes,
    positionsAssets,
    positionsMinValue,
    positionsMaxValue,
  ]);

  const [order, setOrder] = useState<OrderEnum>(initialOrder);
  const [sortBy, setSortBy] = useState<SortByEnum>(initialSortBy);
  const [filter, setFilter] = useState<PositionsFilter>(initialFilter);
  const prevStatsRef = useRef<PositionsFilteringParams>(
    EMPTY_POSITIONS_FILTERING_PARAMS,
  );

  const positionsState = usePortfolioPositions();
  const orchestrationState = usePortfolioState();
  const positionsSourceState = orchestrationState.sources.positions;

  const isEmpty = positionsState.positions.length === 0;

  const filteredPositions = useProcessedPositions({
    filter: {
      chains: filter?.chains,
      protocols: filter?.protocols,
      type: filter?.types,
      assets: filter?.assets,
      sortBy: sortBy,
      order: order,
    },
  });

  const stats = useMemo((): PositionsFilteringParams => {
    if (isEmpty) {
      return EMPTY_POSITIONS_FILTERING_PARAMS;
    }

    return {
      allChains: positionsState.metadata.chains,
      allProtocols: positionsState.metadata.protocols,
      allTypes: positionsState.metadata.types,
      allAssets: positionsState.metadata.assets,
      allValueRange: positionsState.metadata.valueRange,
    };
  }, [positionsState.metadata, isEmpty]);

  useEffect(() => {
    if (isEqual(prevStatsRef.current, stats)) {
      return;
    }

    prevStatsRef.current = stats;

    const sanitized = sanitizePositionsFilter(filter, stats);
    const effectiveValueRange = getEffectiveValueRange(stats.allValueRange);

    const withDefaults = {
      ...sanitized,
      minValue: sanitized.minValue ?? effectiveValueRange.min,
    };

    if (!isEqual(withDefaults, filter)) {
      setFilter(removeNullValuesFromFilter(withDefaults));
      setSearchParamsState({
        positionsChains: withDefaults.chains,
        positionsProtocols: withDefaults.protocols,
        positionsTypes: withDefaults.types,
        positionsAssets: withDefaults.assets,
        positionsMinValue: withDefaults.minValue,
        positionsMaxValue: withDefaults.maxValue,
      });
    }
  }, [stats, setSearchParamsState, setFilter, filter]);

  const filteredSortedData = useMemo(() => {
    return filterSortPositionsData(
      filteredPositions.positions,
      filter,
      sortBy,
      order,
    );
  }, [filteredPositions.positions, filter, sortBy, order]);

  const updateFilter = useCallback(
    (newFilter: NullableFields<PositionsFilter>) => {
      const newFilterValue = { ...filter, ...newFilter };
      setFilter(removeNullValuesFromFilter(newFilterValue));
      setSearchParamsState({
        positionsChains: newFilterValue.chains,
        positionsProtocols: newFilterValue.protocols,
        positionsTypes: newFilterValue.types,
        positionsAssets: newFilterValue.assets,
        positionsMinValue: newFilterValue.minValue,
        positionsMaxValue: newFilterValue.maxValue,
      });
    },
    [filter, setSearchParamsState],
  );

  const clearFilters = useCallback(() => {
    updateFilter({
      chains: null,
      protocols: null,
      types: null,
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
        positionsSortBy: newSortBy,
        positionsOrder: newOrder,
      });
    },
    [setSortBy, setSearchParamsState],
  );

  const context: PositionsFilteringContextType = {
    sortBy,
    order,
    setSortBy: updateSortBy,
    filter,
    updateFilter,
    clearFilters,
    data: filteredSortedData,
    isLoading: filteredPositions.isLoading || positionsSourceState.isLoading,
    isEmpty,
    ...stats,
  };

  return (
    <PositionsFilteringContext.Provider value={context}>
      {children}
    </PositionsFilteringContext.Provider>
  );
};

export const usePositionsFiltering = (): PositionsFilteringContextType => {
  return useContext(PositionsFilteringContext);
};
