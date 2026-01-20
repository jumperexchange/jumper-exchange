import { find, map } from 'lodash';
import { formatTokenAmount, formatTokenPrice } from '@lifi/widget';
import type { ExtendedChain } from '@lifi/sdk';
import type { LiFiCommonToken } from '../datasources/tokens.datasource';
import type { EnrichedToken } from '../types/tokens.types';

/**
 * Augment a single token with chain info and computed USD value.
 */
export const augmentToken = (
  token: LiFiCommonToken,
  chains: ExtendedChain[],
): EnrichedToken => {
  const chain = find(chains, (c) => c.id === token.chainId);

  return {
    ...token,
    chainKey: chain?.key ?? '',
    chainName: chain?.name ?? '',
    amount: formatTokenAmount(BigInt(token.amount), token.decimals),
    amountUSD: formatTokenPrice(
      BigInt(token.amount),
      token.priceUSD,
      token.decimals,
    ),
  };
};

/**
 * Augment multiple tokens with chain info and computed USD values.
 */
export const augmentTokens = (
  tokens: LiFiCommonToken[],
  chains: ExtendedChain[],
): EnrichedToken[] => {
  return map(tokens, (token) => augmentToken(token, chains));
};
