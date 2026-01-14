import { compact, map, orderBy, sumBy } from 'lodash';
import type {
  PortfolioPosition,
  PositionGroup,
} from '../types/positions.types';

/**
 * Convert a Record of positions grouped by protocol-chain key to an array of PositionGroups.
 * Groups are sorted by totalNetUsd descending.
 */
export const toPositionGroups = (
  positionsByProtocolAndChain: Record<string, PortfolioPosition[]>,
): PositionGroup[] => {
  const groups = compact(
    map(
      Object.entries(positionsByProtocolAndChain),
      ([key, positions]): PositionGroup | null => {
        if (positions.length === 0) {
          return null;
        }

        const firstPosition = positions[0];
        const totalNetUsd = sumBy(positions, (p) => p.netUsd ?? 0);

        return {
          key,
          protocol: firstPosition.protocol,
          chain: firstPosition.chain,
          positions,
          totalNetUsd,
        };
      },
    ),
  );

  // Sort groups by total value descending
  return orderBy(groups, 'totalNetUsd', 'desc');
};
