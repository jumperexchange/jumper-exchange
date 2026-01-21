import { useMemo } from 'react';
import { useTokens } from '@/hooks/useTokens';
import type { PriceLookup } from '../types/PortfolioExtendedToken';

export interface UsePriceLookupResult {
  getPrice: PriceLookup;
  isLoading: boolean;
  hasFreshPrices: boolean;
  updatedAt: number | undefined;
}

export const usePriceLookup = (): UsePriceLookupResult => {
  const {
    tokens: allTokens,
    isLoading,
    isSuccess: hasFreshPrices,
    updatedAt,
  } = useTokens();

  const getPrice: PriceLookup = useMemo(() => {
    if (!allTokens?.tokens) {
      return () => undefined;
    }
    return (chainId: number, address: string) => {
      const token = allTokens.tokens[chainId]?.find(
        (t) => t.address.toLowerCase() === address.toLowerCase(),
      );
      return token ? parseFloat(token.priceUSD) : 0;
    };
  }, [allTokens?.tokens]);

  return {
    getPrice,
    isLoading,
    hasFreshPrices,
    updatedAt,
  };
};
