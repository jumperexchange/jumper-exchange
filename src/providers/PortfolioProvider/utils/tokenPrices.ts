import type { AllTokens } from '@/hooks/useTokens';

export type GetTokenPrice = (
  chainId: number,
  address: string,
) => number | undefined;

export const createPriceLookup = (tokensByChain: AllTokens['tokens']) => {
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
