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
import { EMPTY_FILTERING_PARAMS } from './constants';
import type {
  EarnFilteringParams,
  EarnOpportunityFilterWithoutSortByAndOrder,
  NullableFields,
  SortByEnum
} from './types';
import { SortByOptions } from './types';
import {
  extractFilteringParams,
  removeNullValuesFromFilter,
  sanitizeFilter,
  searchParamsParsers,
} from './utils';

export interface EarnFilteringContextType extends EarnFilteringParams {
  sortBy: SortByEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: EarnOpportunityFilterWithoutSortByAndOrder;
  updateFilter: (
    filter: NullableFields<EarnOpportunityFilterWithoutSortByAndOrder>,
  ) => void;
  showForYou: boolean;
  usedYourAddress: boolean;
  toggleForYou: () => void;
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
  showForYou: false,
  usedYourAddress: false,
  toggleForYou: () => {},
  totalMarkets: 0,
  allChains: [],
  allProtocols: [],
  allAssets: [],
  allTags: [],
  allAPY: {},
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

  const forYou = useEarnFilterOpportunities({
    filter: {
      forYou: true,
      address,
    },
  });

  const all = useEarnFilterOpportunities({
    filter: {
      ...filter,
      sortBy: sortBy,
    },
  });

  const allNoFilter = useEarnFilterOpportunities({
    filter: {},
  });

  const forYouData = useMemo(() => forYou.data?.data ?? [], [forYou.data]);
  const fourYouUpdatedAt = forYou.data?.meta?.updatedAt ?? undefined;

  const allData = useMemo(() => all.data?.data ?? [], [all.data]);
  const allUpdatedAt = all.data?.meta?.updatedAt ?? undefined;

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
  }, [stats, filter, setFilter, setSearchParamsState]);

  const toggleForYou = useCallback(() => {
    const newShowForYou = !showForYou;
    setShowForYou(newShowForYou);
    setSearchParamsState({ forYou: newShowForYou });
  }, [showForYou, setShowForYou, setSearchParamsState]);

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

  const context: EarnFilteringContextType = {
    sortBy,
    setSortBy: updateSortBy,
    filter,
    updateFilter,
    showForYou,
    usedYourAddress,
    toggleForYou,
    totalMarkets,
    data: showForYou ? forYouData : allData,
    updatedAt: showForYou ? fourYouUpdatedAt : allUpdatedAt,
    isLoading: showForYou ? forYou.isLoading || !address : all.isLoading,
    error: (showForYou ? forYou.error : all.error) ?? null,
    isAllDataLoading: allNoFilter.isLoading,
    ...stats,
  };

  return (
    <EarnFilteringContext.Provider value={context}>
      {children}
    </EarnFilteringContext.Provider>
  );
};

export const useEarnFiltering = (): EarnFilteringContextType => {
  return useContext(EarnFilteringContext);
};
