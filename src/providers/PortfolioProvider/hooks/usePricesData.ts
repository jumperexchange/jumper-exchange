import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ONE_HOUR_MS } from 'src/const/time';
import {
  fetchTokenPrices,
  createPriceLookup,
  type GetTokenPrice,
} from '../datasources/prices.datasource';

export interface UsePricesDataResult {
  getTokenPrice: GetTokenPrice;
  isLoading: boolean;
  isSuccess: boolean;
  updatedAt: number | null;
  refetch: () => void;
}

export const usePricesData = (): UsePricesDataResult => {
  const { data, isLoading, isSuccess, dataUpdatedAt, refetch } = useQuery({
    queryKey: ['portfolio-token-prices'],
    queryFn: fetchTokenPrices,
    refetchInterval: ONE_HOUR_MS,
  });

  const getTokenPrice = useMemo((): GetTokenPrice => {
    if (!data?.tokens) {
      return () => undefined;
    }
    return createPriceLookup(data.tokens);
  }, [data?.tokens]);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    getTokenPrice,
    isLoading,
    isSuccess,
    updatedAt: dataUpdatedAt ?? null,
    refetch: handleRefetch,
  };
};
