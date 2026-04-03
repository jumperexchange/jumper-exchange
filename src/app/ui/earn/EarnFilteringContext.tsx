import { useAccount } from '@lifi/wallet-management';
import { isEqual } from 'lodash-es';
import { useQueryStates } from 'nuqs';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAccountAddress } from 'src/hooks/earn/useAccountAddress';
import { useEarnFilterOpportunities } from 'src/hooks/earn/useEarnFilterOpportunities';
import type { NullableFields } from 'src/types/internal';
import type {
  EarnOpportunities,
  EarnOpportunityWithLatestAnalytics,
} from 'src/types/jumper-backend';
import type { StrapiMetaPagination } from 'src/types/strapi';
import type { Hex } from 'viem';
import { useStoreSearchParams } from '@/stores/earn/SearchParamsStore';
import { EMPTY_FILTERING_PARAMS } from './constants';
import {
  extractFilteringParams,
  filterOpportunities,
  sanitizeFilter,
  sortOpportunities,
} from './filterOpportunities';
import type {
  EarnFilteringParams,
  EarnOpportunityFilterWithoutSortByAndOrder,
  SortByEnum,
} from './types';
import { EarnFilterTab, OrderOptions, SortByOptions } from './types';
import {
  enrichDataWithFlag,
  removeNullValuesFromFilter,
  searchParamsParsers,
} from './utils';

const PAGE_SIZE = 18;

// ─── Data context ────────────────────────────────────────────────────────────
// Changes when: data loads, page changes, tab changes, connection state changes.

export interface EarnDataContextType {
  data: EarnOpportunityWithLatestAnalytics[];
  updatedAt: Date | undefined;
  isLoading: boolean;
  isAllDataLoading: boolean;
  error: unknown | undefined;
  isConnected: boolean;
  tab: EarnFilterTab;
  changeTab: (tab: EarnFilterTab) => void;
  page: number;
  setPage: (page: number) => void;
  pagination: StrapiMetaPagination;
}

// ─── Filter context ───────────────────────────────────────────────────────────
// Changes when: filters change, sort changes, address changes, stats change.
// Does NOT change when page or data changes.

export interface EarnFilterContextType extends EarnFilteringParams {
  sortBy: SortByEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: EarnOpportunityFilterWithoutSortByAndOrder;
  updateFilter: (
    filter: NullableFields<EarnOpportunityFilterWithoutSortByAndOrder>,
  ) => void;
  clearFilters: () => void;
  usedYourAddress: boolean;
  totalMarkets: number;
}

// Combined type — used only for stories/testing via EarnFilteringMockProvider.
export type EarnFilteringContextType = EarnDataContextType &
  EarnFilterContextType;

// ─── Context objects ──────────────────────────────────────────────────────────

const EarnDataContext = createContext<EarnDataContextType>({
  data: [],
  updatedAt: undefined,
  isLoading: false,
  isAllDataLoading: false,
  error: undefined,
  isConnected: true,
  tab: EarnFilterTab.FOR_YOU,
  changeTab: () => {},
  page: 0,
  setPage: () => {},
  pagination: { page: 0, pageSize: PAGE_SIZE, pageCount: 0, total: 0 },
});

const EarnFilterContext = createContext<EarnFilterContextType>({
  sortBy: SortByOptions.APY,
  setSortBy: () => {},
  filter: {},
  updateFilter: () => {},
  clearFilters: () => {},
  usedYourAddress: false,
  totalMarkets: 0,
  allChains: [],
  allProtocols: [],
  allAssets: [],
  allTags: [],
  allAPY: {},
  allTVL: {},
  allRewardsOptions: [],
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export const EarnFilteringProvider = ({
  initialAllOpportunities,
  children,
}: {
  initialAllOpportunities: EarnOpportunities;
  children: React.ReactNode;
}) => {
  useStoreSearchParams();
  const [searchParamsState, setSearchParamsState] = useQueryStates(
    searchParamsParsers,
    {
      history: 'replace',
    },
  );

  const { account } = useAccount();
  const address: Hex | undefined = useAccountAddress();
  const usedYourAddress = address !== undefined;

  const {
    forYou: forYouParam,
    withPositions: withPositionsParam,
    sortBy: initialSortBy,
    tab,
    ...rest
  } = searchParamsState;

  const initialFilter = useMemo(() => {
    return removeNullValuesFromFilter(rest);
  }, [rest]);

  // Backwards compatibility for existing bookmarks
  const initialTab = useMemo(() => {
    if (withPositionsParam) {
      return EarnFilterTab.YOUR_POSITIONS;
    }
    if (forYouParam === true) {
      return EarnFilterTab.FOR_YOU;
    }
    if (forYouParam === false) {
      return EarnFilterTab.ALL;
    }
    return tab ?? EarnFilterTab.FOR_YOU;
  }, [forYouParam, withPositionsParam, tab]);

  // Replace deprecated query params
  useEffect(() => {
    if (forYouParam != null || withPositionsParam != null) {
      setSearchParamsState({
        forYou: null,
        withPositions: null,
        tab: initialTab,
      });
    }
  }, [forYouParam, initialTab, setSearchParamsState, withPositionsParam]);

  const [sortBy, setSortBy] = useState<SortByEnum>(initialSortBy);
  const [filter, setFilter] =
    useState<EarnOpportunityFilterWithoutSortByAndOrder>(initialFilter);
  const [page, setPage] = useState(0);

  const forYou = useEarnFilterOpportunities(
    {
      filter: {
        forYou: true,
        address,
      },
    },
    {
      enabled: !!address,
    },
  );

  const yourPositionsNoFilter = useEarnFilterOpportunities(
    {
      filter: {
        hasPositions: true,
        address,
      },
    },
    {
      enabled: !!address,
    },
  );

  const allNoFilter = useEarnFilterOpportunities(
    {
      filter: {},
    },
    {
      initialData: initialAllOpportunities,
    },
  );

  const allNoFilterData = useMemo(
    () => allNoFilter.data?.data ?? [],
    [allNoFilter.data],
  );

  const totalMarkets = allNoFilterData.length;

  const { sourceData, error, updatedAt } = useMemo(() => {
    switch (tab) {
      case EarnFilterTab.FOR_YOU:
        return {
          sourceData: forYou.data?.data ?? [],
          updatedAt: forYou.data?.meta?.updatedAt,
          error: forYou.error,
        };
      case EarnFilterTab.YOUR_POSITIONS:
        return {
          sourceData: yourPositionsNoFilter.data?.data ?? [],
          updatedAt: yourPositionsNoFilter.data?.meta?.updatedAt,
          error: yourPositionsNoFilter.error,
        };
      case EarnFilterTab.ALL:
        return {
          sourceData: allNoFilterData,
          updatedAt: allNoFilter.data?.meta?.updatedAt,
          error: allNoFilter.error,
        };
    }
  }, [tab, forYou, yourPositionsNoFilter, allNoFilterData, allNoFilter]);

  const filteredAndSortedData = useMemo(() => {
    // FOR_YOU tab is already filtered by backend
    if (tab === EarnFilterTab.FOR_YOU) {
      return sourceData;
    }

    const filtered = filterOpportunities(sourceData, filter);
    const sorted = sortOpportunities(filtered, sortBy, OrderOptions.DESC);
    return sorted;
  }, [sourceData, filter, sortBy, tab]);

  const enrichedData = useMemo(() => {
    const forYouSlugsSet = new Set(
      (forYou.data?.data ?? []).map((item) => item.slug),
    );
    return enrichDataWithFlag(filteredAndSortedData, 'forYou', forYouSlugsSet);
  }, [filteredAndSortedData, forYou.data?.data]);

  const { data, pagination } = useMemo(() => {
    const total = enrichedData.length;
    const pageCount = Math.ceil(total / PAGE_SIZE);
    const pagination = {
      page,
      pageSize: PAGE_SIZE,
      pageCount,
      total,
    };

    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedData = enrichedData.slice(startIndex, endIndex);

    return { data: paginatedData, pagination };
  }, [enrichedData, page]);

  const unfilteredTabData = useMemo(() => {
    switch (tab) {
      case EarnFilterTab.FOR_YOU:
        return forYou.data?.data ?? [];
      case EarnFilterTab.YOUR_POSITIONS:
        return yourPositionsNoFilter.data?.data ?? [];
      case EarnFilterTab.ALL:
        return allNoFilterData;
    }
  }, [
    tab,
    forYou.data?.data,
    yourPositionsNoFilter.data?.data,
    allNoFilterData,
  ]);

  const stats = useMemo((): EarnFilteringParams => {
    if (unfilteredTabData.length === 0) {
      return EMPTY_FILTERING_PARAMS;
    }
    return extractFilteringParams(unfilteredTabData);
  }, [unfilteredTabData]);

  useEffect(() => {
    const sanitized = sanitizeFilter(filter, stats);
    if (!isEqual(sanitized, filter)) {
      setFilter(removeNullValuesFromFilter(sanitized));
      setSearchParamsState(sanitized);
    }
  }, [stats]);

  const changeTab = useCallback(
    (tab: EarnFilterTab) => {
      setPage(0);
      setSearchParamsState({ tab });
    },
    [setSearchParamsState],
  );

  const updateFilter = useCallback(
    (newFilter: NullableFields<EarnOpportunityFilterWithoutSortByAndOrder>) => {
      setPage(0);
      const newFilterValue = { ...filter, ...newFilter };
      setFilter(removeNullValuesFromFilter(newFilterValue));
      setSearchParamsState(newFilterValue);
    },
    [filter, setFilter, setSearchParamsState],
  );

  const updateSortBy = useCallback(
    (newSortBy: SortByEnum) => {
      setPage(0);
      setSortBy(newSortBy);
      setSearchParamsState({ sortBy: newSortBy });
    },
    [setSortBy, setSearchParamsState],
  );

  const clearFilters = useCallback(() => {
    updateFilter({
      chains: null,
      protocols: null,
      tags: null,
      assets: null,
      minAPY: null,
      maxAPY: null,
      minTVL: null,
      maxTVL: null,
      minRewardsAPY: null,
      maxRewardsAPY: null,
    });
  }, [updateFilter]);

  const isLoading = useMemo(() => {
    const hasData = !!data && data.length > 0;
    switch (tab) {
      case EarnFilterTab.FOR_YOU:
        return !hasData && forYou.isLoading;
      case EarnFilterTab.YOUR_POSITIONS:
        return !hasData && yourPositionsNoFilter.isLoading;
      case EarnFilterTab.ALL:
        return !hasData && allNoFilter.isLoading;
    }
  }, [
    tab,
    data,
    forYou.isLoading,
    yourPositionsNoFilter.isLoading,
    allNoFilter.isLoading,
  ]);

  // Data context — re-renders consumers when page/data/loading changes.
  const dataContextValue = useMemo<EarnDataContextType>(
    () => ({
      data,
      updatedAt,
      isLoading,
      isAllDataLoading: allNoFilter.isLoading,
      error,
      isConnected: !!account?.address,
      tab,
      changeTab,
      page,
      setPage,
      pagination,
    }),
    [
      data,
      updatedAt,
      isLoading,
      allNoFilter.isLoading,
      error,
      account?.address,
      tab,
      changeTab,
      page,
      pagination,
    ],
  );

  // Filter context — re-renders consumers only when filters/stats change.
  // Does NOT change when page or data slice changes.
  const filterContextValue = useMemo<EarnFilterContextType>(
    () => ({
      sortBy,
      setSortBy: updateSortBy,
      filter,
      updateFilter,
      clearFilters,
      usedYourAddress,
      totalMarkets,
      ...stats,
    }),
    [
      sortBy,
      updateSortBy,
      filter,
      updateFilter,
      clearFilters,
      usedYourAddress,
      totalMarkets,
      stats,
    ],
  );

  return (
    <EarnDataContext.Provider value={dataContextValue}>
      <EarnFilterContext.Provider value={filterContextValue}>
        {children}
      </EarnFilterContext.Provider>
    </EarnDataContext.Provider>
  );
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useEarnData = (): EarnDataContextType =>
  useContext(EarnDataContext);

export const useEarnFilter = (): EarnFilterContextType =>
  useContext(EarnFilterContext);

// ─── Stories / testing helper ─────────────────────────────────────────────────
// Use this instead of individual context providers in Storybook decorators.

export const EarnFilteringMockProvider = ({
  value,
  children,
}: {
  value: EarnFilteringContextType;
  children: React.ReactNode;
}) => {
  const {
    data,
    updatedAt,
    isLoading,
    isAllDataLoading,
    error,
    isConnected,
    tab,
    changeTab,
    page,
    setPage,
    pagination,
    ...filterValue
  } = value;

  return (
    <EarnDataContext.Provider
      value={{
        data,
        updatedAt,
        isLoading,
        isAllDataLoading,
        error,
        isConnected,
        tab,
        changeTab,
        page,
        setPage,
        pagination,
      }}
    >
      <EarnFilterContext.Provider value={filterValue}>
        {children}
      </EarnFilterContext.Provider>
    </EarnDataContext.Provider>
  );
};
