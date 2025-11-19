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
} from './types';
import { EMPTY_DEFI_POSITIONS_FILTERING_PARAMS } from './constants';
import {
  deFiPositionsSearchParamsParsers,
  extractDeFiPositionsFilteringParams,
  removeNullValuesFromFilter,
  sanitizeDeFiPositionsFilter,
} from './utils';

export interface PortfolioDeFiPositionsFilteringContextType
  extends PortfolioDeFiPositionsFilteringParams {
  filter: PortfolioDeFiPositionsFilterUI;
  updateFilter: (filter: PortfolioDeFiPositionsFilterUI) => void;
  data: DefiPosition[];
  isLoading: boolean;
  error: unknown | null;
}

export const PortfolioDeFiPositionsFilteringContext =
  createContext<PortfolioDeFiPositionsFilteringContextType>({
    filter: {},
    updateFilter: () => {},
    allChains: [],
    allProtocols: [],
    allTypes: [],
    allAssets: [],
    allAPYRange: { min: 0, max: 0 },
    allValueRange: { min: 0, max: 0 },
    data: [],
    isLoading: false,
    error: null,
  });

export const PortfolioDeFiPositionsFilteringProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchParamsState, setSearchParamsState] = useQueryStates(
    deFiPositionsSearchParamsParsers,
    {
      history: 'replace',
    },
  );

  const { accounts } = useAccount();
  const primaryAccount = accounts.find((account) => account.isConnected);
  const address = primaryAccount?.address as Hex | undefined;

  const initialFilter = useMemo(() => {
    return removeNullValuesFromFilter<PortfolioDeFiPositionsFilter>(
      searchParamsState,
    );
  }, [searchParamsState]);

  const [filter, setFilter] =
    useState<PortfolioDeFiPositionsFilter>(initialFilter);
  const prevStatsRef = useRef<PortfolioDeFiPositionsFilteringParams>(
    EMPTY_DEFI_POSITIONS_FILTERING_PARAMS,
  );

  const allNoFilterPositions = usePortfolioDeFiPositions({
    address,
  });

  const allPositions = usePortfolioDeFiPositions({
    address,
    ...filter,
  });

  const stats = useMemo((): PortfolioDeFiPositionsFilteringParams => {
    if (
      !allNoFilterPositions.data ||
      allNoFilterPositions.data.positions.length === 0
    ) {
      return EMPTY_DEFI_POSITIONS_FILTERING_PARAMS;
    }

    return extractDeFiPositionsFilteringParams(allNoFilterPositions.data);
  }, [allNoFilterPositions]);

  useEffect(() => {
    if (isEqual(prevStatsRef.current, stats)) {
      return;
    }

    prevStatsRef.current = stats;

    const sanitized = sanitizeDeFiPositionsFilter(filter, stats);
    const cleanedSanitized = removeNullValuesFromFilter(sanitized);

    if (!isEqual(cleanedSanitized, filter)) {
      setFilter(cleanedSanitized);
      setSearchParamsState(sanitized);
    }
  }, [stats, setSearchParamsState, setFilter, filter]);

  const updateFilter = useCallback(
    (newFilter: PortfolioDeFiPositionsFilter) => {
      const newFilterValue = { ...filter, ...newFilter };
      const sanitized = sanitizeDeFiPositionsFilter(newFilterValue, stats);
      const cleanedSanitized = removeNullValuesFromFilter(sanitized);
      setFilter(cleanedSanitized);
      setSearchParamsState(sanitized);
    },
    [filter, stats, setSearchParamsState],
  );

  const context: PortfolioDeFiPositionsFilteringContextType = {
    filter,
    updateFilter,
    data: allPositions.data?.positions ?? [],
    isLoading: allPositions.isLoading || !address,
    error: allPositions.error ?? null,
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
