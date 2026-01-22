'use client';

import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useQueryStates } from 'nuqs';
import { isEqual } from 'lodash';
import type {
  OrderEnum,
  PortfolioDeFiPositionsFilter,
  PortfolioDeFiPositionsFilteringParams,
  PortfolioDeFiPositionsFilterUI,
  SortByEnum,
} from '@/app/ui/portfolio/types';
import { OrderOptions, SortByOptions } from '@/app/ui/portfolio/types';
import { EMPTY_DEFI_POSITIONS_FILTERING_PARAMS } from '@/app/ui/portfolio/constants';
import {
  deFiPositionsSearchParamsParsers,
  filterSortDeFiPositionsData,
  getEffectiveValueRange,
  removeNullValuesFromFilter,
  sanitizeDeFiPositionsFilter,
} from './utils';
import type { NullableFields } from '@/types/internal';
import { usePortfolioPositions } from '../PortfolioContext';
import type { PortfolioDeFiPositionsGroup } from '../types/PortfolioDeFiPositionsGroup';
import { useFilteredPositionsData } from '../hooks/useFilteredPositionsData';

export interface DeFiPositionsFilteringContextType extends PortfolioDeFiPositionsFilteringParams {
  sortBy: SortByEnum;
  order: OrderEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: PortfolioDeFiPositionsFilterUI;
  updateFilter: (
    filter: NullableFields<PortfolioDeFiPositionsFilterUI>,
  ) => void;
  clearFilters: () => void;
  data: PortfolioDeFiPositionsGroup[];
  allDataUpdatedAt: number | null;
  isLoading: boolean;
  isAllDataEmpty: boolean;
  error: Error | null;
}

export const DeFiPositionsFilteringContext =
  createContext<DeFiPositionsFilteringContextType>({
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
    data: [],
    allDataUpdatedAt: null,
    isLoading: false,
    isAllDataEmpty: false,
    error: null,
  });

export const DeFiPositionsFilteringProvider = ({
  children,
}: PropsWithChildren) => {
  const [searchParamsState, setSearchParamsState] = useQueryStates(
    deFiPositionsSearchParamsParsers,
    {
      history: 'replace',
    },
  );

  const {
    defiSortBy: initialSortBy,
    defiOrder: initialOrder,
    ...rest
  } = searchParamsState;

  const initialFilter = useMemo(() => {
    return removeNullValuesFromFilter<PortfolioDeFiPositionsFilter>(rest);
  }, [rest]);

  const [order, setOrder] = useState<OrderEnum>(initialOrder);
  const [sortBy, setSortBy] = useState<SortByEnum>(initialSortBy);
  const [filter, setFilter] =
    useState<PortfolioDeFiPositionsFilter>(initialFilter);
  const prevStatsRef = useRef<PortfolioDeFiPositionsFilteringParams>(
    EMPTY_DEFI_POSITIONS_FILTERING_PARAMS,
  );

  const filteredPositions = useFilteredPositionsData({
    chains: filter?.defiChains,
    protocols: filter?.defiProtocols,
    type: filter?.defiTypes,
    assets: filter?.defiAssets,
    sortBy: sortBy,
    order: order,
  });

  const {
    metadata,
    isLoading: positionsLoading,
    isEmpty,
    error,
    updatedAt,
  } = usePortfolioPositions();

  const isLoading = useMemo(() => {
    return filteredPositions.isLoading || positionsLoading;
  }, [filteredPositions.isLoading, positionsLoading]);

  const stats = useMemo((): PortfolioDeFiPositionsFilteringParams => {
    if (isEmpty) {
      return EMPTY_DEFI_POSITIONS_FILTERING_PARAMS;
    }

    return {
      allChains: metadata.chains,
      allProtocols: metadata.protocols,
      allTypes: metadata.types,
      allAssets: metadata.assets,
      allValueRange: metadata.valueRange,
    };
  }, [isEmpty, metadata]);

  const filteredSortedData = useMemo((): PortfolioDeFiPositionsGroup[] => {
    return filterSortDeFiPositionsData(
      filteredPositions.positionsByProtocol,
      filter,
      sortBy,
      order,
    );
  }, [filteredPositions.positionsByProtocol, filter, sortBy, order]);

  useEffect(() => {
    if (isEqual(prevStatsRef.current, stats)) {
      return;
    }

    prevStatsRef.current = stats;

    const sanitized = sanitizeDeFiPositionsFilter(filter, stats);
    const effectiveValueRange = getEffectiveValueRange(stats.allValueRange);

    const withDefaults = {
      ...sanitized,
      defiMinValue: sanitized.defiMinValue ?? effectiveValueRange.min,
    };

    if (!isEqual(withDefaults, filter)) {
      setFilter(removeNullValuesFromFilter(withDefaults));
      setSearchParamsState(withDefaults);
    }
  }, [stats, setSearchParamsState, setFilter, filter]);

  const updateFilter = useCallback(
    (newFilter: NullableFields<PortfolioDeFiPositionsFilter>) => {
      const newFilterValue = { ...filter, ...newFilter };
      setFilter(removeNullValuesFromFilter(newFilterValue));
      setSearchParamsState(newFilterValue);
    },
    [filter, setSearchParamsState],
  );

  const clearFilters = useCallback(() => {
    updateFilter({
      defiChains: null,
      defiProtocols: null,
      defiTypes: null,
      defiAssets: null,
      defiMinValue: null,
      defiMaxValue: null,
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
      setSearchParamsState({ defiSortBy: newSortBy, defiOrder: newOrder });
    },
    [setSortBy, setSearchParamsState],
  );

  const context: DeFiPositionsFilteringContextType = {
    sortBy,
    order,
    setSortBy: updateSortBy,
    filter,
    updateFilter,
    clearFilters,
    data: filteredSortedData,
    allDataUpdatedAt: updatedAt,
    isLoading,
    isAllDataEmpty: isEmpty,
    error,
    ...stats,
  };

  return (
    <DeFiPositionsFilteringContext.Provider value={context}>
      {children}
    </DeFiPositionsFilteringContext.Provider>
  );
};

export const useDeFiPositionsFiltering =
  (): DeFiPositionsFilteringContextType => {
    return useContext(DeFiPositionsFilteringContext);
  };
