import { useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useQueryStates } from 'nuqs';
import { useAccountAddress } from 'src/hooks/earn/useAccountAddress';
import { useEarnFilterOpportunities } from 'src/hooks/earn/useEarnFilterOpportunities';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { Hex } from 'viem';
import { extractFilteringParams, searchParamsParsers } from './utils';
import { EMPTY_FILTERING_PARAMS } from './constants';
import {
  EarnFilteringParams,
  EarnOpportunityFilterUI,
  EarnOpportunityFilterWithoutSortByAndOrder,
  SortByEnum,
  SortByOptions,
} from './types';

export interface EarnFilteringContextType extends EarnFilteringParams {
  sortBy: SortByEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: EarnOpportunityFilterUI;
  updateFilter: (filter: EarnOpportunityFilterUI) => void;
  showForYou: boolean;
  usedYourAddress: boolean;
  toggleForYou: () => void;
  totalMarkets: number;
  data: EarnOpportunityWithLatestAnalytics[];
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
    return Object.fromEntries(
      Object.entries(rest).filter(([_, value]) => value !== null),
    ) as EarnOpportunityFilterWithoutSortByAndOrder;
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
    filter,
  });

  const allNoFilter = useEarnFilterOpportunities({
    filter: {},
  });

  const totalMarkets = allNoFilter.data?.length ?? 0;

  const stats = useMemo((): EarnFilteringParams => {
    if (!allNoFilter.data || allNoFilter.data.length === 0) {
      return EMPTY_FILTERING_PARAMS;
    }

    return extractFilteringParams(allNoFilter.data);
  }, [allNoFilter.data]);

  const toggleForYou = useCallback(() => {
    const newShowForYou = !showForYou;
    setShowForYou(newShowForYou);
    setSearchParamsState({ forYou: newShowForYou });
  }, [showForYou, setShowForYou, setSearchParamsState]);

  const updateFilter = useCallback(
    (newFilter: EarnOpportunityFilterWithoutSortByAndOrder) => {
      const newFilterValue = { ...filter, ...newFilter };
      setFilter(newFilterValue);
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
    data: (showForYou ? forYou.data : all.data) ?? [],
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
