import { isEqual } from 'lodash';
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
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import type { StrapiMetaPagination } from 'src/types/strapi';
import type { Hex } from 'viem';
import { useStoreSearchParams } from '@/stores/earn/SearchParamsStore';
import { EMPTY_FILTERING_PARAMS } from './constants';
import type {
  EarnFilteringParams,
  EarnOpportunityFilterWithoutSortByAndOrder,
  SortByEnum,
} from './types';
import { EarnFilterTab, SortByOptions } from './types';
import {
  enrichDataWithFlag,
  extractFilteringParams,
  removeNullValuesFromFilter,
  sanitizeFilter,
  searchParamsParsers,
} from './utils';

const PAGE_SIZE = 18;

export interface EarnFilteringContextType extends EarnFilteringParams {
  sortBy: SortByEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: EarnOpportunityFilterWithoutSortByAndOrder;
  updateFilter: (
    filter: NullableFields<EarnOpportunityFilterWithoutSortByAndOrder>,
  ) => void;
  clearFilters: () => void;
  usedYourAddress: boolean;
  changeTab: (tab: EarnFilterTab) => void;
  totalMarkets: number;
  data: EarnOpportunityWithLatestAnalytics[];
  updatedAt: Date | undefined;
  isLoading: boolean;
  error: unknown | undefined;
  isAllDataLoading: boolean;
  isConnected: boolean;
  tab: EarnFilterTab;
  page: number;
  setPage: (page: number) => void;
  pagination: StrapiMetaPagination;
}

export const EarnFilteringContext = createContext<EarnFilteringContextType>({
  sortBy: SortByOptions.APY,
  setSortBy: () => {},
  filter: {},
  updateFilter: () => {},
  clearFilters: () => {},
  usedYourAddress: false,
  changeTab: () => {},
  totalMarkets: 0,
  allChains: [],
  allProtocols: [],
  allAssets: [],
  allTags: [],
  allAPY: {},
  allTVL: {},
  allRewardsOptions: [],
  data: [],
  updatedAt: undefined,
  isLoading: false,
  error: undefined,
  isAllDataLoading: false,
  isConnected: true,
  tab: EarnFilterTab.FOR_YOU,
  page: 0,
  setPage: () => {},
  pagination: {
    page: 0,
    pageSize: PAGE_SIZE,
    pageCount: 0,
    total: 0,
  },
});

export const EarnFilteringProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useStoreSearchParams();
  const [searchParamsState, setSearchParamsState] = useQueryStates(
    searchParamsParsers,
    {
      history: 'replace',
    },
  );

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

  // Fetch positions data when address is available (with filters applied)
  const yourPositions = useEarnFilterOpportunities(
    {
      filter: {
        ...filter,
        hasPositions: true,
        address,
        sortBy: sortBy,
      },
    },
    {
      enabled: !!address,
    },
  );

  // Fetch ALL positions without filters (for filter options on YOUR_POSITIONS tab)
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

  const primaryQueryDone = useMemo(() => {
    switch (tab) {
      case EarnFilterTab.FOR_YOU:
        return !forYou.isLoading;
      case EarnFilterTab.YOUR_POSITIONS:
        return !yourPositions.isLoading;
      case EarnFilterTab.ALL:
        return true;
    }
  }, [tab, forYou.isLoading, yourPositions.isLoading]);

  // Pre-fetch all data in the background after primary query is done
  const all = useEarnFilterOpportunities(
    {
      filter: {
        ...filter,
        sortBy: sortBy,
      },
    },
    {
      enabled: tab === EarnFilterTab.ALL || primaryQueryDone,
    },
  );

  const allNoFilter = useEarnFilterOpportunities({
    filter: {},
  });

  const { sourceData, error, updatedAt } = useMemo(() => {
    switch (tab) {
      case EarnFilterTab.FOR_YOU:
        return {
          sourceData: forYou.data?.data,
          updatedAt: forYou.data?.meta?.updatedAt,
          error: forYou.error,
        };
      case EarnFilterTab.YOUR_POSITIONS:
        return {
          sourceData: yourPositions.data?.data,
          updatedAt: yourPositions.data?.meta?.updatedAt,
          error: yourPositions.error,
        };
      case EarnFilterTab.ALL:
        return {
          sourceData: all.data?.data,
          updatedAt: all.data?.meta?.updatedAt,
          error: all.error,
        };
    }
  }, [tab, forYou, all, yourPositions]);

  const enrichedData = useMemo(() => {
    const forYouSlugsSet = new Set(
      (forYou.data?.data ?? []).map((item) => item.slug),
    );
    return enrichDataWithFlag(sourceData, 'forYou', forYouSlugsSet);
  }, [sourceData, forYou.data?.data]);

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

  const allNoFilterData = useMemo(
    () => allNoFilter.data?.data ?? [],
    [allNoFilter.data],
  );

  const totalMarkets = allNoFilterData.length;

  // Get unfiltered data for the current tab (for filter options)
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

  // Extract filter options from unfiltered data for the current tab
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

  const context: EarnFilteringContextType = useMemo(() => {
    const hasData = !!data && data.length > 0;
    let isLoading = false;
    switch (tab) {
      case EarnFilterTab.FOR_YOU:
        isLoading = !hasData && (forYou.isLoading || !address);
        break;
      case EarnFilterTab.YOUR_POSITIONS:
        isLoading = !hasData && yourPositions.isLoading;
        break;
      case EarnFilterTab.ALL:
        isLoading = !hasData && all.isLoading;
        break;
    }

    return {
      sortBy,
      setSortBy: updateSortBy,
      filter,
      updateFilter,
      clearFilters,
      tab,
      usedYourAddress,
      changeTab,
      totalMarkets,
      data,
      updatedAt,
      isLoading,
      error,
      isAllDataLoading: allNoFilter.isLoading,
      isConnected: !!address,
      page,
      setPage,
      pagination,
      ...stats,
    };
  }, [
    sortBy,
    filter,
    updateFilter,
    updateSortBy,
    clearFilters,
    tab,
    usedYourAddress,
    totalMarkets,
    pagination,
    page,
    updatedAt,
    address,
    all.isLoading,
    allNoFilter.isLoading,
    forYou.isLoading,
    yourPositions.isLoading,
    stats,
    changeTab,
  ]);

  return (
    <EarnFilteringContext.Provider value={context}>
      {children}
    </EarnFilteringContext.Provider>
  );
};

export const useEarnFiltering = (): EarnFilteringContextType => {
  return useContext(EarnFilteringContext);
};
