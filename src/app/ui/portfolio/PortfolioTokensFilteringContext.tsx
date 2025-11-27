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
import type { CacheToken } from 'src/types/portfolio';
import { isEqual } from 'lodash';
import {
  extractTokensFilteringParams,
  removeNullValuesFromFilter,
  sanitizeTokensFilter,
  tokensSearchParamsParsers,
  filterSortPortfolioTokensData,
} from './utils';
import { EMPTY_TOKENS_FILTERING_PARAMS } from './constants';
import type {
  PortfolioTokensFilteringParams,
  PortfolioTokensFilter,
  PortfolioTokensFilterUI,
  SortByEnum,
} from './types';
import { SortByOptions } from './types';

export interface PortfolioTokensFilteringContextType
  extends PortfolioTokensFilteringParams {
  sortBy: SortByEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: PortfolioTokensFilterUI;
  updateFilter: (filter: PortfolioTokensFilterUI) => void;
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

  const { tokensSortBy: initialSortBy, ...rest } = searchParamsState;

  const initialFilter = useMemo(() => {
    return removeNullValuesFromFilter(rest);
  }, [rest]);

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
    accounts,
  } = usePortfolioTokens();

  // Extract filtering parameters from all unfiltered data
  const stats = useMemo((): PortfolioTokensFilteringParams => {
    if (!allData || allData.length === 0) {
      return EMPTY_TOKENS_FILTERING_PARAMS;
    }

    return extractTokensFilteringParams(allData, accounts);
  }, [allData, accounts]);

  useEffect(() => {
    if (isEqual(prevStatsRef.current, stats)) {
      return;
    }

    prevStatsRef.current = stats;

    const sanitized = sanitizeTokensFilter(filter, stats);
    const cleanedSanitized = removeNullValuesFromFilter(sanitized);

    if (!isEqual(cleanedSanitized, filter)) {
      setFilter(cleanedSanitized);
      setSearchParamsState(sanitized);
    }
  }, [stats, setSearchParamsState, setFilter, filter]);

  const filteredSortedData = useMemo(() => {
    return filterSortPortfolioTokensData(queriesByAddress, filter, sortBy);
  }, [queriesByAddress, filter, sortBy]);

  const updateFilter = useCallback(
    (newFilter: PortfolioTokensFilter) => {
      const newFilterValue = { ...filter, ...newFilter };
      const sanitized = sanitizeTokensFilter(newFilterValue, stats);
      const cleanedSanitized = removeNullValuesFromFilter(sanitized);
      setFilter(cleanedSanitized);
      setSearchParamsState(sanitized);
    },
    [filter, stats, setSearchParamsState],
  );

  const clearFilters = useCallback(() => {
    updateFilter({
      tokensWallets: undefined,
      tokensChains: undefined,
      tokensAssets: undefined,
      tokensMinValue: undefined,
      tokensMaxValue: undefined,
    });
  }, [updateFilter]);

  const updateSortBy = useCallback(
    (newSortBy: SortByEnum) => {
      setSortBy(newSortBy);
      setSearchParamsState({ tokensSortBy: newSortBy });
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
    isEmpty: !allData || allData.length === 0,
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
