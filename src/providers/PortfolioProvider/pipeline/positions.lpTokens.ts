import { compact, map } from 'lodash';
import type { AugmentedPosition } from './positions.augment';

/**
 * Identifier for an LP token extracted from a DeFi position.
 */
export interface LpTokenIdentifier {
  address: string;
  chainId: number;
}

/**
 * Extract LP token identifiers from positions.
 * These are used to filter out tokens that are already represented in DeFi positions.
 */
export const extractLpTokens = (
  positions: AugmentedPosition[],
): LpTokenIdentifier[] => {
  return compact(
    map(positions, (p) =>
      p.lpToken?.address && p.lpToken?.chain.chainId
        ? { address: p.lpToken.address, chainId: p.lpToken.chain.chainId }
        : null,
    ),
  );
};
