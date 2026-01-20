import { compact, flatMap } from 'lodash';
import type { PortfolioDefiPosition } from '../types/positions.types';

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
  portfolioPositions: PortfolioDefiPosition[],
): LpTokenIdentifier[] => {
  return compact(
    flatMap(portfolioPositions, (position) =>
      position.lpToken?.address && position.lpToken?.chainId
        ? {
            address: position.lpToken.address,
            chainId: position.lpToken.chainId,
          }
        : null,
    ),
  );
};
