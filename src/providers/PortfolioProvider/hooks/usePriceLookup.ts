import { useMemo } from 'react';
import { useTokens } from '@/hooks/useTokens';

export interface UsePriceLookupResult {
  getPrice: (chainId: number, address: string) => number | undefined;
  isLoading: boolean;
  hasFreshPrices: boolean;
  updatedAt: number | undefined;
  error: Error | null;
}

/**
 * Hook to get the price of a token for a given chain and address.
 * @Note: The useTokens hooks doesn't necessarily return the correct price for a token, as backend is not patched yet.
 * @Note: Might need to use the useToken hook instead.
 */
export const usePriceLookup = (): UsePriceLookupResult => {
  const {
    tokens: allTokens,
    isLoading,
    isSuccess: hasFreshPrices,
    updatedAt,
    error,
  } = useTokens();

  const getPrice = useMemo(() => {
    if (!allTokens) {
      return () => undefined;
    }
    return (chainId: number, address: string) => {
      const token = allTokens[chainId]?.find(
        (t) => t.address.toLowerCase() === address.toLowerCase(),
      );
      return token ? parseFloat(token.priceUSD) : 0;
    };
  }, [allTokens]);

  return {
    getPrice,
    isLoading,
    hasFreshPrices,
    updatedAt,
    error,
  };
};
