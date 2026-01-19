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
    if (forYouParam) {
      return EarnFilterTab.FOR_YOU;
    } else if (forYouParam === false) {
      return EarnFilterTab.ALL;
    }
    return EarnFilterTab.FOR_YOU;
  }, [forYouParam, withPositionsParam]);

  // Replace deprecated query params
  useEffect(() => {
    setSearchParamsState({
      forYou: null,
      withPositions: null,
      tab: initialTab,
    });
  }, [initialTab]);

  // TODO: introduce the loading state?
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

  // TODO: Can we pre-fetch all this data?
  const all = useEarnFilterOpportunities(
    {
      filter: {
        ...filter,
        ...(tab === EarnFilterTab.YOUR_POSITIONS
          ? { hasPositions: true, address }
          : {}),
        sortBy: sortBy,
      },
    },
    {
      enabled: tab === EarnFilterTab.YOUR_POSITIONS ? !!address : true,
    },
  );

  const allNoFilter = useEarnFilterOpportunities({
    filter: {},
  });

  const { data, pagination, error, updatedAt } = useMemo(() => {
    const sourceData =
      tab === EarnFilterTab.FOR_YOU ? forYou.data?.data : all.data?.data;
    const forYouSlugsSet = new Set(
      (forYou.data?.data ?? []).map((item) => item.slug),
    );

    const data = enrichDataWithFlag(sourceData, 'forYou', forYouSlugsSet);

    const total = data.length;
    const pageCount = Math.ceil(total / PAGE_SIZE);
    const pagination: StrapiMetaPagination = {
      page,
      pageSize: PAGE_SIZE,
      pageCount,
      total,
    };

    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedData = data.slice(startIndex, endIndex);

    let updatedAt: Date | undefined;
    let error: unknown | undefined;

    switch (tab) {
      case EarnFilterTab.ALL:
      case EarnFilterTab.YOUR_POSITIONS: {
        updatedAt = all.data?.meta?.updatedAt;
        error = all.error;
      }
      case EarnFilterTab.FOR_YOU: {
        updatedAt = forYou.data?.meta?.updatedAt;
        error = forYou.error;
      }
    }

    return { data: paginatedData, pagination, error, updatedAt };
  }, [tab, forYou, all, page]);

  const allNoFilterData = useMemo(
    () => allNoFilter.data?.data ?? [],
    [allNoFilter.data],
  );

  const totalMarkets = allNoFilterData.length;

  const stats = useMemo((): EarnFilteringParams => {
    if (allNoFilterData.length === 0) {
      return EMPTY_FILTERING_PARAMS;
    }

    return extractFilteringParams(allNoFilterData);
  }, [allNoFilterData]);

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
    const isLoading =
      !hasData &&
      (tab === EarnFilterTab.FOR_YOU ? forYou.isLoading : all.isLoading);

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
    all.error,
    allNoFilter.isLoading,
    forYou.isLoading,
    forYou.error,
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
