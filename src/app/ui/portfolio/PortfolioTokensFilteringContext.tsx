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
import { CacheToken } from 'src/types/portfolio';
import { isEqual } from 'lodash';
import {
  extractFilteringParams,
  removeNullValuesFromFilter,
  sanitizeFilter,
  searchParamsParsers,
  filterPortfolioData,
} from './utils';
import { EMPTY_FILTERING_PARAMS } from './constants';
import {
  PortfolioFilteringParams,
  PortfolioTokensFilter,
  PortfolioTokensFilterUI,
} from './types';

export interface PortfolioTokensFilteringContextType
  extends PortfolioFilteringParams {
  filter: PortfolioTokensFilterUI;
  updateFilter: (filter: PortfolioTokensFilterUI) => void;
  data: CacheToken[];
  isLoading: boolean;
  isAllDataLoading: boolean;
}

export const PortfolioTokensFilteringContext =
  createContext<PortfolioTokensFilteringContextType>({
    filter: {},
    updateFilter: () => {},
    allWallets: [],
    allChains: [],
    allAssets: [],
    allValueRange: { min: 0, max: 0 },
    data: [],
    isLoading: false,
    isAllDataLoading: false,
  });

export const PortfolioTokensFilteringProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchParamsState, setSearchParamsState] = useQueryStates(
    searchParamsParsers,
    {
      history: 'replace',
    },
  );

  const initialFilter = useMemo(() => {
    return removeNullValuesFromFilter(searchParamsState);
  }, [searchParamsState]);

  const [filter, setFilter] = useState<PortfolioTokensFilter>(initialFilter);
  const prevStatsRef = useRef<PortfolioFilteringParams>(EMPTY_FILTERING_PARAMS);

  const {
    queriesByAddress,
    isFetching,
    data: allData,
    accounts,
  } = usePortfolioTokens();

  // Extract filtering parameters from all unfiltered data
  const stats = useMemo((): PortfolioFilteringParams => {
    if (!allData || allData.length === 0) {
      return EMPTY_FILTERING_PARAMS;
    }

    return extractFilteringParams(allData, accounts);
  }, [allData, accounts]);

  useEffect(() => {
    if (isEqual(prevStatsRef.current, stats)) {
      return;
    }

    prevStatsRef.current = stats;

    const sanitized = sanitizeFilter(filter, stats);
    const cleanedSanitized = removeNullValuesFromFilter(sanitized);

    if (!isEqual(cleanedSanitized, filter)) {
      setFilter(cleanedSanitized);
      setSearchParamsState(sanitized);
    }
  }, [stats, setSearchParamsState, setFilter]);

  const filteredData = useMemo(() => {
    return filterPortfolioData(queriesByAddress, filter);
  }, [queriesByAddress, filter]);

  const updateFilter = useCallback(
    (newFilter: PortfolioTokensFilter) => {
      const newFilterValue = { ...filter, ...newFilter };
      const sanitized = sanitizeFilter(newFilterValue, stats);
      const cleanedSanitized = removeNullValuesFromFilter(sanitized);
      setFilter(cleanedSanitized);
      setSearchParamsState(sanitized);
    },
    [filter, stats, setSearchParamsState],
  );

  const context: PortfolioTokensFilteringContextType = {
    filter,
    updateFilter,
    data: filteredData,
    isLoading: isFetching,
    isAllDataLoading: isFetching,
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
