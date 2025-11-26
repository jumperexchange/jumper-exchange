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
  filterPortfolioTokensData,
} from './utils';
import { EMPTY_TOKENS_FILTERING_PARAMS } from './constants';
import type {
  PortfolioTokensFilteringParams,
  PortfolioTokensFilter,
  PortfolioTokensFilterUI,
} from './types';

export interface PortfolioTokensFilteringContextType
  extends PortfolioTokensFilteringParams {
  filter: PortfolioTokensFilterUI;
  updateFilter: (filter: PortfolioTokensFilterUI) => void;
  data: CacheToken[];
  isLoading: boolean;
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

  const initialFilter = useMemo(() => {
    return removeNullValuesFromFilter(searchParamsState);
  }, [searchParamsState]);

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

  const filteredData = useMemo(() => {
    return filterPortfolioTokensData(queriesByAddress, filter);
  }, [queriesByAddress, filter]);

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

  const context: PortfolioTokensFilteringContextType = {
    filter,
    updateFilter,
    data: filteredData,
    isLoading: isFetching || !isSuccess,
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
