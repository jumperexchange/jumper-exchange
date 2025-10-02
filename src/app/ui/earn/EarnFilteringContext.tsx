import { useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { EarnOpportunityFilter } from 'src/app/lib/getOpportunitiesFiltered';
import { useAccountAddress } from 'src/hooks/earn/useAccountAddress';
import { useEarnFilterOpportunities } from 'src/hooks/earn/useEarnFilterOpportunities';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { Hex } from 'viem';
import { extractFilteringParams, serializeFilterValue } from './utils';
import { EMPTY_FILTERING_PARAMS } from './constants';
import { EarnFilteringParams, SortByOptions } from './types';

export interface EarnFilteringContextType extends EarnFilteringParams {
  sortBy: SortByOptions;
  setSortBy: (sortBy: SortByOptions) => void;
  filter: EarnOpportunityFilter;
  updateFilter: (filter: EarnOpportunityFilter) => void;
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
  initialFilters,
}: {
  children: React.ReactNode;
  initialFilters?: EarnOpportunityFilter;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const address: Hex | undefined = useAccountAddress();
  const usedYourAddress = address !== undefined;
  const { forYou: initialForYou, ...rest } = initialFilters ?? {};

  // TODO: introduce the loading state?
  const [sortBy, setSortBy] = useState<SortByOptions>(SortByOptions.APY);
  const [filter, setFilter] = useState<EarnOpportunityFilter>(rest ?? {});
  const [showForYou, setShowForYou] = useState(initialForYou ?? true);

  const forYou = useEarnFilterOpportunities(
    {
      filter: {
        forYou: true,
        address,
      },
    },
    !!address,
  );

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

  const updateSearchParams = useCallback(
    (newFilerValue: EarnOpportunityFilter) => {
      const params = new URLSearchParams(searchParams);

      for (const [key, unserializedValue] of Object.entries(
        newFilerValue ?? {},
      )) {
        const serializedValue = serializeFilterValue(unserializedValue);
        if (serializedValue) {
          params.set(key, serializedValue);
        } else {
          params.delete(key);
        }
      }

      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const toggleForYou = useCallback(() => {
    const newShowForYou = !showForYou;
    setShowForYou(newShowForYou);

    updateSearchParams({ forYou: newShowForYou });
  }, [showForYou, setShowForYou, updateSearchParams]);

  const updateFilter = useCallback(
    (newFilter: EarnOpportunityFilter) => {
      const newFilerValue = { ...filter, ...newFilter };
      setFilter(newFilerValue);

      updateSearchParams(newFilerValue);
    },
    [filter, setFilter, updateSearchParams],
  );

  const context: EarnFilteringContextType = {
    sortBy,
    setSortBy,
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
