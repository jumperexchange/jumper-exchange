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
import { usePortfolioTokens } from '@/utils/getTokens/usePortfolioTokens';
import { useTokensWithoutLpPositions } from '@/hooks/portfolio/useTokensWithoutLpPositions';
import type { CacheToken } from 'src/types/portfolio';
import { isEqual } from 'lodash';
import {
  extractTokensFilteringParams,
  removeNullValuesFromFilter,
  sanitizeTokensFilter,
  tokensSearchParamsParsers,
  filterSortPortfolioTokensData,
  getEffectiveValueRange,
} from './utils';
import { EMPTY_TOKENS_FILTERING_PARAMS } from './constants';
import type {
  PortfolioTokensFilteringParams,
  PortfolioTokensFilter,
  PortfolioTokensFilterUI,
  SortByEnum,
  OrderEnum,
} from './types';
import { OrderOptions, SortByOptions } from './types';
import type { NullableFields } from '@/types/internal';

export interface PortfolioTokensFilteringContextType extends PortfolioTokensFilteringParams {
  sortBy: SortByEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: PortfolioTokensFilterUI;
  updateFilter: (filter: NullableFields<PortfolioTokensFilterUI>) => void;
  clearFilters: () => void;
  data: CacheToken[];
  isLoading: boolean;
  isEmpty: boolean;
}

export const PortfolioTokensFilteringContext =
  createContext<PortfolioTokensFilteringContextType>({
    sortBy: SortByOptions.VALUE,
    setSortBy: () => {},
    filter: {},
    updateFilter: () => {},
    clearFilters: () => {},
    allWallets: [],
    allChains: [],
    allAssets: [],
    allValueRange: { min: 0, max: 0 },
    data: [],
    isLoading: false,
    isEmpty: false,
  });

export const PortfolioTokensFilteringProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchParamsState, setSearchParamsState] = useQueryStates(
    tokensSearchParamsParsers,
    {
      history: 'replace',
    },
  );

  const {
    tokensSortBy: initialSortBy,
    tokensOrder: initialOrder,
    ...rest
  } = searchParamsState;

  const initialFilter = useMemo(() => {
    return removeNullValuesFromFilter(rest);
  }, [rest]);

  const [order, setOrder] = useState<OrderEnum>(initialOrder);
  const [sortBy, setSortBy] = useState<SortByEnum>(initialSortBy);
  const [filter, setFilter] = useState<PortfolioTokensFilter>(initialFilter);
  const prevStatsRef = useRef<PortfolioTokensFilteringParams>(
    EMPTY_TOKENS_FILTERING_PARAMS,
  );

  const {
    queriesByAddress,
    isFetching,
    isSuccess,
    data: allData,
    accounts: portfolioAccounts,
  } = usePortfolioTokens();

  const filteredData = useTokensWithoutLpPositions(allData ?? []);

  const stats = useMemo((): PortfolioTokensFilteringParams => {
    if (filteredData.length === 0) {
      return EMPTY_TOKENS_FILTERING_PARAMS;
    }

    return extractTokensFilteringParams(filteredData, portfolioAccounts);
  }, [filteredData, portfolioAccounts]);

  useEffect(() => {
    if (isEqual(prevStatsRef.current, stats)) {
      return;
    }

    prevStatsRef.current = stats;

    const sanitized = sanitizeTokensFilter(filter, stats);
    const effectiveValueRange = getEffectiveValueRange(stats.allValueRange);

    const withDefaults = {
      ...sanitized,
      tokensMinValue: sanitized.tokensMinValue ?? effectiveValueRange.min,
    };

    if (!isEqual(withDefaults, filter)) {
      setFilter(removeNullValuesFromFilter(withDefaults));
      setSearchParamsState(withDefaults);
    }
  }, [stats, setSearchParamsState, setFilter, filter]);

  const sortedData = useMemo(() => {
    return filterSortPortfolioTokensData(
      queriesByAddress,
      filter,
      sortBy,
      order,
    );
  }, [queriesByAddress, filter, sortBy, order]);

  const filteredSortedData = useTokensWithoutLpPositions(sortedData);

  const updateFilter = useCallback(
    (newFilter: NullableFields<PortfolioTokensFilter>) => {
      const newFilterValue = { ...filter, ...newFilter };
      setFilter(removeNullValuesFromFilter(newFilterValue));
      setSearchParamsState(newFilterValue);
    },
    [filter, setSearchParamsState],
  );

  const clearFilters = useCallback(() => {
    updateFilter({
      tokensWallets: null,
      tokensChains: null,
      tokensAssets: null,
      tokensMinValue: null,
      tokensMaxValue: null,
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
      setSearchParamsState({ tokensSortBy: newSortBy, tokensOrder: newOrder });
    },
    [setSortBy, setSearchParamsState],
  );

  const context: PortfolioTokensFilteringContextType = {
    sortBy,
    setSortBy: updateSortBy,
    filter,
    updateFilter,
    clearFilters,
    data: filteredSortedData,
    isLoading: isFetching || !isSuccess,
    isEmpty: !isFetching && filteredData.length === 0,
    ...stats,
  };

  return (
    <PortfolioTokensFilteringContext.Provider value={context}>
      {children}
    </PortfolioTokensFilteringContext.Provider>
  );
};

export const usePortfolioTokensFiltering =
  (): PortfolioTokensFilteringContextType => {
    return useContext(PortfolioTokensFilteringContext);
  };
