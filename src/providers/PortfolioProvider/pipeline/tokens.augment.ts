import { find, map } from 'lodash';
import { formatTokenAmount, formatTokenPrice } from '@lifi/widget';
import type { ExtendedChain } from '@lifi/sdk';
import type { LiFiCommonToken } from '../datasources/tokens.datasource';

/** Token augmented with chain info and computed USD value */
export interface AugmentedToken extends LiFiCommonToken {
  chainKey: string;
  chainName: string;
  amountUSD: number;
}

/**
 * Augment a single token with chain info and computed USD value.
 */
export const augmentToken = (
  token: LiFiCommonToken,
  chains: ExtendedChain[],
): AugmentedToken => {
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
): AugmentedToken[] => {
  return map(tokens, (token) => augmentToken(token, chains));
};
