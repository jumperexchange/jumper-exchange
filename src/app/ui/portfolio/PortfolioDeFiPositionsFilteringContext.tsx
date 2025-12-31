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
import { useConnectedEvmAddresses } from '@/hooks/useConnectedEvmAddresses';
import { usePortfolioDeFiPositions } from 'src/hooks/portfolio/usePortfolioDeFiPositions';
import { isEqual } from 'lodash';
import type { DefiPosition } from '@/types/jumper-backend';
import type {
  OrderEnum,
  PortfolioDeFiPositionsFilter,
  PortfolioDeFiPositionsFilteringParams,
  PortfolioDeFiPositionsFilterUI,
  SortByEnum,
} from './types';
import { OrderOptions, SortByOptions } from './types';
import { EMPTY_DEFI_POSITIONS_FILTERING_PARAMS } from './constants';
import {
  deFiPositionsSearchParamsParsers,
  extractDeFiPositionsFilteringParams,
  getEffectiveValueRange,
  removeNullValuesFromFilter,
  sanitizeDeFiPositionsFilter,
} from './utils';
import type { NullableFields } from '@/types/internal';

export interface PortfolioDeFiPositionsFilteringContextType extends PortfolioDeFiPositionsFilteringParams {
  sortBy: SortByEnum;
  order: OrderEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: PortfolioDeFiPositionsFilterUI;
  updateFilter: (
    filter: NullableFields<PortfolioDeFiPositionsFilterUI>,
  ) => void;
  clearFilters: () => void;
  data: DefiPosition[];
  isLoading: boolean;
  isAllDataEmpty: boolean;
  error: unknown | null;
}

export const PortfolioDeFiPositionsFilteringContext =
  createContext<PortfolioDeFiPositionsFilteringContextType>({
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
    isLoading: false,
    isAllDataEmpty: false,
    error: null,
  });

export const PortfolioDeFiPositionsFilteringProvider = ({
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

  const connectedAddresses = useConnectedEvmAddresses();

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

  const allPositionsNoFilter = usePortfolioDeFiPositions({
    addresses: connectedAddresses,
  });

  const allPositions = usePortfolioDeFiPositions({
    addresses: connectedAddresses,
    filter: {
      chains: filter?.defiChains,
      protocols: filter?.defiProtocols,
      type: filter?.defiTypes,
      assets: filter?.defiAssets,
      minValue: filter?.defiMinValue,
      maxValue: filter?.defiMaxValue,
      sortBy: sortBy,
      order: order,
    },
  });

  const stats = useMemo((): PortfolioDeFiPositionsFilteringParams => {
    if (
      !allPositionsNoFilter.data ||
      allPositionsNoFilter.data.data.length === 0
    ) {
      return EMPTY_DEFI_POSITIONS_FILTERING_PARAMS;
    }

    return extractDeFiPositionsFilteringParams(allPositionsNoFilter.data);
  }, [allPositionsNoFilter.data]);

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

  const context: PortfolioDeFiPositionsFilteringContextType = {
    sortBy,
    order,
    setSortBy: updateSortBy,
    filter,
    updateFilter,
    clearFilters,
    data: allPositions.data?.data ?? [],
    isLoading:
      allPositionsNoFilter.isLoading ||
      allPositions.isLoading ||
      connectedAddresses.length === 0,
    isAllDataEmpty:
      !allPositionsNoFilter.data?.data ||
      allPositionsNoFilter.data.data.length === 0,
    error: allPositionsNoFilter.error ?? null,
    ...stats,
  };

  return (
    <PortfolioDeFiPositionsFilteringContext.Provider value={context}>
      {children}
    </PortfolioDeFiPositionsFilteringContext.Provider>
  );
};

export const usePortfolioDeFiPositionsFiltering =
  (): PortfolioDeFiPositionsFilteringContextType => {
    return useContext(PortfolioDeFiPositionsFilteringContext);
  };
