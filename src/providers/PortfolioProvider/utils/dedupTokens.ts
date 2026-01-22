import { differenceWith, isEmpty } from 'lodash';
import type { LpTokenIdentifier } from './extractLpTokens';
import type { PortfolioExtendedToken } from '../types/PortfolioExtendedToken';

const getTokenKey = (address: string, chainId: number): string =>
  `${address.toLowerCase()}-${chainId}`;

export const dedupTokensFromLpPositions = (
  tokens: PortfolioExtendedToken[],
  lpTokens: LpTokenIdentifier[],
): PortfolioExtendedToken[] => {
  if (isEmpty(tokens) || isEmpty(lpTokens)) {
    return tokens;
  }

  return differenceWith(tokens, lpTokens, (token, lpToken) => {
    const tokenKey = getTokenKey(token.address, token.chainId);
    const lpKey = getTokenKey(lpToken.address, lpToken.chainId);

    return tokenKey === lpKey;
  });
};
