import { compact, map, orderBy, sumBy } from 'lodash';
import type {
  EnrichedPosition,
  PortfolioPosition,
  PositionsByProtocolChain,
} from '../types/positions.types';

/**
 * Convert a group of positions into a single PortfolioPosition.
 */
const toPortfolioPosition = (
  key: string,
  positions: EnrichedPosition[],
): PortfolioPosition | null => {
  if (positions.length === 0) {
    return null;
  }

  const sortedPositions = orderBy(positions, (p) => p.netUsd ?? 0, 'desc');

  const firstPosition = positions[0];
  const totalNetUsd = sumBy(positions, (p) => p.netUsd ?? 0);

  return {
    key,
    protocol: firstPosition.protocol,
    chain: firstPosition.chain,
    positions: sortedPositions,
    totalNetUsd,
  };
};

/**
 * Convert grouped positions to PortfolioPosition[].
 * Each group becomes a single PortfolioPosition.
 * Results are sorted by totalNetUsd descending.
 */
export const toPortfolioPositions = (
  groupedPositions: PositionsByProtocolChain,
): PortfolioPosition[] => {
  const portfolioPositions = map(
    Object.entries(groupedPositions),
    ([key, positions]) => toPortfolioPosition(key, positions),
  );
  return compact(portfolioPositions);
};
