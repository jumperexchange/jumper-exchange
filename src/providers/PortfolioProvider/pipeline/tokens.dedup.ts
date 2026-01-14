import { differenceWith, isEmpty } from 'lodash';
import type { AugmentedToken } from './tokens.augment';
import type { LpTokenIdentifier } from './positions.lpTokens';

/**
 * Create a unique key for a token based on address and chainId.
 */
const getTokenKey = (address: string, chainId: number): string =>
  `${address.toLowerCase()}-${chainId}`;

/**
 * Filter out tokens that are LP tokens from DeFi positions.
 * This prevents double-counting tokens that are already represented in positions.
 *
 * IMPORTANT: This should run BEFORE aggregation to avoid incorrect groupings.
 */
export const dedupTokensFromLpPositions = (
  tokens: AugmentedToken[],
  lpTokens: LpTokenIdentifier[],
): AugmentedToken[] => {
  if (isEmpty(tokens) || isEmpty(lpTokens)) {
    return tokens;
  }

  return differenceWith(tokens, lpTokens, (token, lpToken) => {
    const tokenKey = getTokenKey(token.address, token.chainId);
    const lpKey = getTokenKey(lpToken.address, lpToken.chainId);

    return tokenKey === lpKey;
  });
};
