import { compact, flatMap } from 'lodash';
import type { PortfolioPosition } from '../types/positions.types';

/**
 * Identifier for an LP token extracted from a DeFi position.
 */
export interface LpTokenIdentifier {
  address: string;
  chainId: number;
}

/**
 * Extract LP token identifiers from portfolio positions.
 * These are used to filter out tokens that are already represented in DeFi positions.
 */
export const extractLpTokens = (
  portfolioPositions: PortfolioPosition[],
): LpTokenIdentifier[] => {
  return compact(
    flatMap(portfolioPositions, (group) =>
      group.positions.map((p) =>
        p.lpToken?.address && p.lpToken?.chain.chainId
          ? { address: p.lpToken.address, chainId: p.lpToken.chain.chainId }
          : null,
      ),
    ),
  );
};
