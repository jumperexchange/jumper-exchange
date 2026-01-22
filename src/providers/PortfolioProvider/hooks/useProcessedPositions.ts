'use client';

import { useMemo } from 'react';
import { mapValues } from 'lodash';
import { usePriceLookup } from './usePriceLookup';
import {
  usePositionsData,
  type UsePositionsDataParams,
} from './usePositionsData';
import { normalizePositions } from '../utils/normalizePositions';
import { groupPositions } from '../utils/groupPositions';
import {
  extractPositionsMetadata,
  type PositionsMetadata,
} from '../utils/extractMetadata';
import {
  extractLpTokens,
  type LpTokenIdentifier,
} from '../utils/extractLpTokens';
import type { PortfolioDeFiPositionsGroup } from '../types/PortfolioDeFiPositionsGroup';
import type { PortfolioDefiPosition } from '../types/PortfolioDefiPosition';

export interface ProcessedPositionsResult {
  positions: PortfolioDefiPosition[];
  positionsByAddress: Record<string, PortfolioDefiPosition[]>;
  positionsByProtocolAndChain: PortfolioDeFiPositionsGroup[];
  positionsByProtocol: PortfolioDeFiPositionsGroup[];
  metadata: PositionsMetadata;
  lpTokens: LpTokenIdentifier[];
  isEmpty: boolean;
  isLoading: boolean;
  error: Error | null;
  updatedAt: number | null;
  refetch: () => void;
}

export const useProcessedPositions = (
  params?: UsePositionsDataParams,
): ProcessedPositionsResult => {
  const rawData = usePositionsData(params);
  const { getPrice } = usePriceLookup();

  const lpTokens = useMemo(
    () => extractLpTokens(rawData.positions),
    [rawData.positions],
  );

  const positions = useMemo(
    () => normalizePositions(rawData.positions, getPrice),
    [rawData.positions, getPrice],
  );

  const positionsByAddress = useMemo(
    () =>
      mapValues(rawData.positionsByAddress, (addressPositions) =>
        normalizePositions(addressPositions, getPrice),
      ),
    [rawData.positionsByAddress, getPrice],
  );

  const positionsByProtocolAndChain = useMemo(
    () => groupPositions(positions, 'byProtocolAndChain'),
    [positions],
  );

  const positionsByProtocol = useMemo(
    () => groupPositions(positions, 'byProtocol'),
    [positions],
  );

  const metadata = useMemo(
    () => extractPositionsMetadata(positions),
    [positions],
  );

  return {
    positions,
    positionsByAddress,
    positionsByProtocolAndChain,
    positionsByProtocol,
    metadata,
    lpTokens,
    isEmpty: positions.length === 0,
    isLoading: rawData.isLoading,
    error: rawData.error,
    updatedAt: rawData.updatedAt,
    refetch: rawData.refetch,
  };
};
