import { useMemo } from 'react';
import {
  usePositionsData,
  type UsePositionsDataProps,
} from './usePositionsData';
import { usePriceLookup } from './usePriceLookup';
import mapValues from 'lodash/mapValues';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import {
  toPortfolioPositions,
  positionAccessors,
  extractPositionsMetadata,
} from '../utils';

export const useProcessedPositions = (params: UsePositionsDataProps) => {
  const rawData = usePositionsData(params);
  const { getPrice } = usePriceLookup();

  const positions = useMemo(
    () => toPortfolioPositions(rawData.positions, getPrice),
    [rawData.positions, getPrice],
  );

  const positionsByAddress = useMemo(
    () =>
      mapValues(rawData.positionsByAddress, (addressPositions) =>
        toPortfolioPositions(addressPositions, getPrice),
      ),
    [rawData.positionsByAddress, getPrice],
  );

  const sortedPositions = useMemo(
    () => orderBy(positions, [positionAccessors.netUsd], ['desc']),
    [positions],
  );

  const positionsByProtocolAndChain = useMemo(
    () => groupBy(sortedPositions, positionAccessors.protocolAndChain),
    [sortedPositions],
  );

  const positionsByProtocol = useMemo(
    () => groupBy(sortedPositions, positionAccessors.protocol),
    [sortedPositions],
  );

  const lpTokens = useMemo(
    () => positions.flatMap((position) => position.lpToken),
    [positions],
  );

  const metadata = useMemo(
    () => extractPositionsMetadata(sortedPositions),
    [sortedPositions],
  );

  const isEmpty = positions.length === 0;

  return useMemo(() => {
    return {
      ...rawData,
      positions: sortedPositions,
      positionsByAddress,
      positionsByProtocolAndChain,
      positionsByProtocol,
      metadata,
      lpTokens,
      isEmpty,
    };
  }, [
    rawData,
    sortedPositions,
    positionsByAddress,
    positionsByProtocolAndChain,
    positionsByProtocol,
    metadata,
    lpTokens,
    isEmpty,
  ]);
};
