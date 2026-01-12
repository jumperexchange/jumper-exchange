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
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import type { Hex } from 'viem';
import {
  enrichDataWithFlag,
  extractFilteringParams,
  removeNullValuesFromFilter,
  sanitizeFilter,
  searchParamsParsers,
} from './utils';
import { EMPTY_FILTERING_PARAMS } from './constants';
import type {
  EarnFilteringParams,
  EarnOpportunityFilterWithoutSortByAndOrder,
  SortByEnum,
} from './types';
import { EarnFilterTab, SortByOptions } from './types';
import type { NullableFields } from 'src/types/internal';
import { useStoreSearchParams } from '@/stores/earn/useStoreQueryStates';

export interface EarnFilteringContextType extends EarnFilteringParams {
  sortBy: SortByEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: EarnOpportunityFilterWithoutSortByAndOrder;
  updateFilter: (
    filter: NullableFields<EarnOpportunityFilterWithoutSortByAndOrder>,
  ) => void;
  clearFilters: () => void;
  showForYou: boolean;
  showYourPositions: boolean;
  usedYourAddress: boolean;
  changeTab: (tab: EarnFilterTab) => void;
  totalMarkets: number;
  data: EarnOpportunityWithLatestAnalytics[];
  updatedAt: Date | undefined;
  isLoading: boolean;
  error: unknown | null;
  isAllDataLoading: boolean;
}

export const EarnFilteringContext = createContext<EarnFilteringContextType>({
  sortBy: SortByOptions.APY,
  setSortBy: () => {},
  filter: {},
  updateFilter: () => {},
  clearFilters: () => {},
  showForYou: false,
  showYourPositions: false,
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
  error: null,
  isAllDataLoading: false,
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
    forYou: initialForYou,
    sortBy: initialSortBy,
    withPositions: initialWithPositions,
    ...rest
  } = searchParamsState;

  const initialFilter = useMemo(() => {
    return removeNullValuesFromFilter(rest);
  }, [rest]);

  // TODO: introduce the loading state?
  const [sortBy, setSortBy] = useState<SortByEnum>(initialSortBy);
  const [filter, setFilter] =
    useState<EarnOpportunityFilterWithoutSortByAndOrder>(initialFilter);
  const [showForYou, setShowForYou] = useState(initialForYou);
  const [showYourPositions, setShowYourPositions] =
    useState(initialWithPositions);

  const forYou = useEarnFilterOpportunities({
    filter: {
      forYou: true,
      address,
    },
  });

  const all = useEarnFilterOpportunities({
    filter: {
      ...filter,
      ...(showYourPositions ? { hasPositions: true, address } : {}),
      sortBy: sortBy,
    },
  });

  const allNoFilter = useEarnFilterOpportunities({
    filter: {},
  });

  const forYouUpdatedAt = forYou.data?.meta?.updatedAt ?? undefined;

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
      let _newShowForYou;
      let _newShowYourPositions;
      switch (tab) {
        case EarnFilterTab.FOR_YOU: {
          _newShowForYou = true;
          _newShowYourPositions = false;
          break;
        }
        case EarnFilterTab.YOUR_POSITIONS: {
          _newShowForYou = false;
          _newShowYourPositions = true;
          break;
        }
        case EarnFilterTab.ALL: {
          _newShowForYou = false;
          _newShowYourPositions = false;
          break;
        }
        default: {
          throw new Error(`Invalid tab: ${tab}`);
        }
      }

      setShowForYou(_newShowForYou);
      setShowYourPositions(_newShowYourPositions);
      setSearchParamsState({
        forYou: _newShowForYou,
        withPositions: _newShowYourPositions,
      });
    },
    [setShowForYou, setShowYourPositions, setSearchParamsState],
  );

  const updateFilter = useCallback(
    (newFilter: NullableFields<EarnOpportunityFilterWithoutSortByAndOrder>) => {
      const newFilterValue = { ...filter, ...newFilter };
      setFilter(removeNullValuesFromFilter(newFilterValue));
      setSearchParamsState(newFilterValue);
    },
    [filter, setFilter, setSearchParamsState],
  );

  const updateSortBy = useCallback(
    (newSortBy: SortByEnum) => {
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

  const data = useMemo(() => {
    const sourceData = showForYou ? forYou.data?.data : all.data?.data;
    const forYouSlugsSet = new Set(
      (forYou.data?.data ?? []).map((item) => item.slug),
    );

    return enrichDataWithFlag(sourceData, 'forYou', forYouSlugsSet);
  }, [showForYou, forYou.data, all.data]);

  const context: EarnFilteringContextType = useMemo(() => {
    const hasData = !!data && data.length > 0;
    const isLoading =
      !hasData && (showForYou ? forYou.isLoading || !address : all.isLoading);
    return {
      sortBy,
      setSortBy: updateSortBy,
      filter,
      updateFilter,
      clearFilters,
      showForYou,
      showYourPositions,
      usedYourAddress,
      changeTab,
      totalMarkets,
      data,
      updatedAt: showForYou ? forYouUpdatedAt : undefined,
      isLoading,
      error: (showForYou ? forYou.error : all.error) ?? null,
      isAllDataLoading: allNoFilter.isLoading,
      ...stats,
    };
  }, [
    sortBy,
    filter,
    updateFilter,
    updateSortBy,
    clearFilters,
    showForYou,
    showYourPositions,
    usedYourAddress,
    totalMarkets,
    data,
    forYouUpdatedAt,
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
