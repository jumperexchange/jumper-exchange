import { ChainType, getTokens } from '@lifi/sdk';
import type { TokensResponse } from '@lifi/sdk';

/** Fetch all token prices from LiFi SDK */
export const fetchTokenPrices = async (): Promise<TokensResponse> => {
  const tokens = await getTokens({
    chainTypes: [ChainType.EVM, ChainType.SVM, ChainType.UTXO, ChainType.MVM],
  });
  return tokens;
};

/** Get token price lookup function */
export type GetTokenPrice = (
  chainId: number,
  address: string,
) => number | undefined;

/** Create a price lookup function from tokens response */
export const createPriceLookup = (
  tokensByChain: TokensResponse['tokens'],
): GetTokenPrice => {
  return (chainId: number, address: string): number | undefined => {
    const chainTokens = tokensByChain[chainId];
    if (!chainTokens) {
      return undefined;
    }

    const token = chainTokens.find(
      (t) => t.address.toLowerCase() === address.toLowerCase(),
    );
    return token?.priceUSD ? Number(token.priceUSD) : undefined;
  };
};
