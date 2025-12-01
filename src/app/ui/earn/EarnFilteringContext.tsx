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
import type {
  EarnOpportunities,
  EarnOpportunityWithLatestAnalytics,
} from 'src/types/jumper-backend';
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
import { SortByOptions } from './types';
import type { NullableFields } from 'src/types/internal';
import { useWalletCookie } from '@/hooks/earn/useWalletCookie';
import { ChainType } from '@lifi/sdk';

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
  initialData,
}: {
  children: React.ReactNode;
  initialData: {
    filtered?: EarnOpportunities;
    forYou?: EarnOpportunities;
    all?: EarnOpportunities;
  };
}) => {
  const [searchParamsState, setSearchParamsState] = useQueryStates(
    searchParamsParsers,
    {
      history: 'replace',
    },
  );

  const connectedAddress = useAccountAddress();
  const walletCookie = useWalletCookie(ChainType.EVM) as Hex | undefined;
  const address = connectedAddress ?? walletCookie;
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
    initialData: initialData?.forYou,
  });

  const all = useEarnFilterOpportunities({
    filter: {
      ...filter,
      sortBy: sortBy,
    },
    initialData: initialData?.filtered,
  });

  const allNoFilter = useEarnFilterOpportunities({
    filter: {},
    initialData: initialData?.all,
  });

  const forYouData = useMemo(() => forYou.data?.data ?? [], [forYou.data]);
  const forYouUpdatedAt = forYou.data?.meta?.updatedAt ?? undefined;

  const allData = useMemo(() => all.data?.data ?? [], [all.data]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

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
      showForYou,
      usedYourAddress,
      toggleForYou,
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
    showForYou,
    usedYourAddress,
    toggleForYou,
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
