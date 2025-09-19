import { map, uniqBy, uniq } from 'lodash';
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
import {
  Chain,
  EarnOpportunityWithLatestAnalytics,
  Protocol,
  Token,
} from 'src/types/jumper-backend';
import { Hex } from 'viem';

export interface EarnFilteringParams {
  allChains: Chain[];
  allProtocols: Protocol[];
  allAssets: Token[];
  allTags: string[];
  allAPY: Record<number, number>; // histogram of apy
}

export interface EarnFilteringContextType extends EarnFilteringParams {
  filter: EarnOpportunityFilter;
  updateFilter: (filter: EarnOpportunityFilter) => void;
  showForYou: boolean;
  toggleForYou: () => void;
  forYou: EarnOpportunityWithLatestAnalytics[];
  forYouLoading: boolean;
  forYouError: unknown | null;
  all: EarnOpportunityWithLatestAnalytics[];
  allLoading: boolean;
  allError: unknown | null;
  totalMarkets: number;
}

export const EarnFilteringContext = createContext<EarnFilteringContextType>({
  filter: {},
  updateFilter: () => {},
  showForYou: false,
  toggleForYou: () => {},
  forYou: [],
  forYouLoading: false,
  forYouError: null,
  all: [],
  allLoading: false,
  allError: null,
  totalMarkets: 0,
  allChains: [],
  allProtocols: [],
  allAssets: [],
  allTags: [],
  allAPY: {},
});

export const EarnFilteringProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const address: Hex | undefined = useAccountAddress();
  const [initialData, setInitialData] = useState<
    EarnOpportunityWithLatestAnalytics[]
  >([]);

  const forYou = useEarnFilterOpportunities({
    filter: {
      forYou: true,
      address,
    },
  });

  const [filter, setFilter] = useState<EarnOpportunityFilter>({});
  const all = useEarnFilterOpportunities({
    filter,
  });

  // Keep our initial data for later use (filters, etc).
  useEffect(() => {
    if (!all.data) {
      return;
    }

    setInitialData((current) => {
      if (current.length === 0) {
        return all.data;
      }
      return current;
    });
  }, [all.data]);

  const totalMarkets = initialData.length;

  const [showForYou, setShowForYou] = useState(true);

  const toggleForYou = useCallback(() => {
    setShowForYou((current) => !current);
  }, [setShowForYou]);

  const stats = useMemo((): EarnFilteringParams => {
    if (!initialData || initialData.length === 0) {
      return EMPTY_FILTERING_PARAMS;
    }

    return extractFilteringParams(initialData);
  }, [initialData]);

  const updateFilter = useCallback(
    (filter: EarnOpportunityFilter) => {
      setFilter((current) => ({ ...current, ...filter }));
    },
    [setFilter],
  );

  const context: EarnFilteringContextType = {
    filter,
    updateFilter,
    showForYou,
    toggleForYou,
    forYou: forYou.data ?? [],
    forYouLoading: forYou.isLoading,
    forYouError: forYou.error ?? null,
    all: all.data ?? [],
    allLoading: all.isLoading,
    allError: all.error ?? null,
    totalMarkets,
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

const EMPTY_FILTERING_PARAMS: EarnFilteringParams = {
  allChains: [],
  allProtocols: [],
  allAssets: [],
  allTags: [],
  allAPY: {},
};

const extractFilteringParams = (
  data: EarnOpportunityWithLatestAnalytics[],
): EarnFilteringParams => {
  let allChains = [...map(data, 'lpToken.chain'), ...map(data, 'asset.chain')];
  allChains = uniqBy(allChains, 'chainId').filter(Boolean);

  let allProtocols = map(data, 'protocol');
  allProtocols = uniqBy(allProtocols, 'name').filter(Boolean);

  let allAssets = map(data, 'asset');
  allAssets = uniqBy(allAssets, 'address').filter(Boolean);

  let allTags = map(data, 'tags').flat();
  allTags = uniq(allTags).filter(Boolean);

  let allAPY = {
    0.1: 1,
    0.2: 2,
    0.3: 3,
  };

  return {
    allChains,
    allProtocols,
    allAssets,
    allTags,
    allAPY,
  };
};
