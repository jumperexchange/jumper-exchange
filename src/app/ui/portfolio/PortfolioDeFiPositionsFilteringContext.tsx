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
import { useAccount } from '@lifi/wallet-management';
import { usePortfolioDeFiPositions } from 'src/hooks/portfolio/usePortfolioDeFiPositions';
import { isEqual } from 'lodash';
import type { Hex } from 'viem';
import type { DefiPosition } from '@/types/jumper-backend';
import type {
  PortfolioDeFiPositionsFilter,
  PortfolioDeFiPositionsFilteringParams,
  PortfolioDeFiPositionsFilterUI,
  SortByEnum,
} from './types';
import { SortByOptions } from './types';
import { EMPTY_DEFI_POSITIONS_FILTERING_PARAMS } from './constants';
import {
  deFiPositionsSearchParamsParsers,
  extractDeFiPositionsFilteringParams,
  removeNullValuesFromFilter,
  sanitizeDeFiPositionsFilter,
} from './utils';
import { ChainType } from '@lifi/sdk';
import type { NullableFields } from '@/types/internal';

export interface PortfolioDeFiPositionsFilteringContextType
  extends PortfolioDeFiPositionsFilteringParams {
  sortBy: SortByEnum;
  setSortBy: (sortBy: SortByEnum) => void;
  filter: PortfolioDeFiPositionsFilterUI;
  updateFilter: (
    filter: NullableFields<PortfolioDeFiPositionsFilterUI>,
  ) => void;
  clearFilters: () => void;
  data: DefiPosition[];
  isLoading: boolean;
  isAllDataEmpty: boolean;
  error: unknown | null;
}

export const PortfolioDeFiPositionsFilteringContext =
  createContext<PortfolioDeFiPositionsFilteringContextType>({
    sortBy: SortByOptions.VALUE,
    setSortBy: () => {},
    filter: {},
    updateFilter: () => {},
    clearFilters: () => {},
    allChains: [],
    allProtocols: [],
    allTypes: [],
    allAssets: [],
    allAPYRange: { min: 0, max: 0 },
    allValueRange: { min: 0, max: 0 },
    data: [],
    isLoading: false,
    isAllDataEmpty: false,
    error: null,
  });

export const PortfolioDeFiPositionsFilteringProvider = ({
  children,
}: PropsWithChildren) => {
  const [searchParamsState, setSearchParamsState] = useQueryStates(
    deFiPositionsSearchParamsParsers,
    {
      history: 'replace',
    },
  );

  const { defiSortBy: initialSortBy, ...rest } = searchParamsState;

  const { accounts } = useAccount();
  const connectedAddresses = useMemo(() => {
    return accounts
      .filter(
        (account) =>
          account.isConnected &&
          !!account?.address &&
          account.chainType === ChainType.EVM,
      )
      .map((account) => account.address as Hex);
  }, [accounts]);

  const initialFilter = useMemo(() => {
    return removeNullValuesFromFilter<PortfolioDeFiPositionsFilter>(rest);
  }, [rest]);

  const [sortBy, setSortBy] = useState<SortByEnum>(initialSortBy);
  const [filter, setFilter] =
    useState<PortfolioDeFiPositionsFilter>(initialFilter);
  const prevStatsRef = useRef<PortfolioDeFiPositionsFilteringParams>(
    EMPTY_DEFI_POSITIONS_FILTERING_PARAMS,
  );

  const allPositionsNoFilter = usePortfolioDeFiPositions({
    addresses: connectedAddresses,
  });

  const allPositions = usePortfolioDeFiPositions({
    addresses: connectedAddresses,
    filter: {
      chains: filter?.defiChains,
      protocols: filter?.defiProtocols,
      type: filter?.defiTypes,
      assets: filter?.defiAssets,
      // TODO: enable min/max APY filtering when backend supports it
      // minAPY: filter?.defiMinAPY,
      // maxAPY: filter?.defiMaxAPY,
      minValue: filter?.defiMinValue,
      maxValue: filter?.defiMaxValue,
      sortBy: sortBy,
    },
  });

  const stats = useMemo((): PortfolioDeFiPositionsFilteringParams => {
    if (
      !allPositionsNoFilter.data ||
      allPositionsNoFilter.data.positions.length === 0
    ) {
      return EMPTY_DEFI_POSITIONS_FILTERING_PARAMS;
    }

    return extractDeFiPositionsFilteringParams(allPositionsNoFilter.data);
  }, [allPositionsNoFilter.data]);

  useEffect(() => {
    if (isEqual(prevStatsRef.current, stats)) {
      return;
    }

    prevStatsRef.current = stats;

    const sanitized = sanitizeDeFiPositionsFilter(filter, stats);

    if (!isEqual(sanitized, filter)) {
      setFilter(removeNullValuesFromFilter(sanitized));
      setSearchParamsState(sanitized);
    }
  }, [stats, setSearchParamsState, setFilter, filter]);

  const updateFilter = useCallback(
    (newFilter: NullableFields<PortfolioDeFiPositionsFilter>) => {
      const newFilterValue = { ...filter, ...newFilter };
      setFilter(removeNullValuesFromFilter(newFilterValue));
      setSearchParamsState(newFilterValue);
    },
    [filter, setSearchParamsState],
  );

  const clearFilters = useCallback(() => {
    updateFilter({
      defiChains: null,
      defiProtocols: null,
      defiTypes: null,
      defiAssets: null,
      defiMinAPY: null,
      defiMaxAPY: null,
      defiMinValue: null,
      defiMaxValue: null,
    });
  }, [updateFilter]);

  const updateSortBy = useCallback(
    (newSortBy: SortByEnum) => {
      setSortBy(newSortBy);
      setSearchParamsState({ defiSortBy: newSortBy });
    },
    [setSortBy, setSearchParamsState],
  );

  const context: PortfolioDeFiPositionsFilteringContextType = {
    sortBy,
    setSortBy: updateSortBy,
    filter,
    updateFilter,
    clearFilters,
    data: allPositions.data?.positions ?? [],
    isLoading:
      allPositionsNoFilter.isLoading ||
      allPositions.isLoading ||
      connectedAddresses.length === 0,
    isAllDataEmpty:
      !allPositionsNoFilter.data?.positions ||
      allPositionsNoFilter.data.positions.length === 0,
    error: allPositionsNoFilter.error ?? null,
    ...stats,
  };

  return (
    <PortfolioDeFiPositionsFilteringContext.Provider value={context}>
      {children}
    </PortfolioDeFiPositionsFilteringContext.Provider>
  );
};

export const usePortfolioDeFiPositionsFiltering =
  (): PortfolioDeFiPositionsFilteringContextType => {
    return useContext(PortfolioDeFiPositionsFilteringContext);
  };
