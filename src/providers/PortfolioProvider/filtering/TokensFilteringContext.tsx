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
  PortfolioTokensFilter,
  PortfolioTokensFilterUI,
  SortByEnum,
} from '@/app/ui/portfolio/types';
import { OrderOptions, SortByOptions } from '@/app/ui/portfolio/types';
import { EMPTY_TOKENS_FILTERING_PARAMS } from '@/app/ui/portfolio/constants';
import {
  tokensSearchParamsParsers,
  getEffectiveValueRange,
  removeNullValuesFromFilter,
  sanitizeTokensFilter,
  filterSortPortfolioTokensData,
} from './utils';
import type { PortfolioTokensFilteringParams } from './types';
import type { NullableFields } from '@/types/internal';
import { usePortfolioTokens } from '../PortfolioContext';
import type { PortfolioTokenGroup } from '../types/tokens.types';

export interface TokensFilteringContextType extends PortfolioTokensFilteringParams {
  sortBy: SortByEnum;
  order: OrderEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: PortfolioTokensFilterUI;
  updateFilter: (filter: NullableFields<PortfolioTokensFilterUI>) => void;
  clearFilters: () => void;
  data: PortfolioTokenGroup[];
  isLoading: boolean;
  isEmpty: boolean;
  error: Error | null;
}

export const TokensFilteringContext = createContext<TokensFilteringContextType>(
  {
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
    data: [],
    isLoading: false,
    isEmpty: false,
    error: null,
  },
);

export const TokensFilteringProvider = ({ children }: PropsWithChildren) => {
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
    return removeNullValuesFromFilter<PortfolioTokensFilter>(rest);
  }, [rest]);

  const [order, setOrder] = useState<OrderEnum>(initialOrder);
  const [sortBy, setSortBy] = useState<SortByEnum>(initialSortBy);
  const [filter, setFilter] = useState<PortfolioTokensFilter>(initialFilter);
  const prevStatsRef = useRef<PortfolioTokensFilteringParams>(
    EMPTY_TOKENS_FILTERING_PARAMS,
  );

  const { tokensByAddress, metadata, isLoading, isEmpty, error } =
    usePortfolioTokens();

  const stats = useMemo((): PortfolioTokensFilteringParams => {
    if (isEmpty) {
      return EMPTY_TOKENS_FILTERING_PARAMS;
    }

    return {
      allWallets: metadata.wallets,
      allChains: metadata.chains,
      allAssets: metadata.assets,
      allValueRange: metadata.valueRange,
    };
  }, [isEmpty, metadata]);

  const filteredSortedData = useMemo(() => {
    if (isEmpty) {
      return [];
    }

    return filterSortPortfolioTokensData(
      tokensByAddress,
      filter,
      sortBy,
      order,
    );
  }, [tokensByAddress, isEmpty, filter, sortBy, order]);

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

  const context: TokensFilteringContextType = {
    sortBy,
    order,
    setSortBy: updateSortBy,
    filter,
    updateFilter,
    clearFilters,
    data: filteredSortedData,
    isLoading,
    isEmpty,
    error,
    ...stats,
  };

  return (
    <TokensFilteringContext.Provider value={context}>
      {children}
    </TokensFilteringContext.Provider>
  );
};

export const useTokensFiltering = (): TokensFilteringContextType => {
  return useContext(TokensFilteringContext);
};
