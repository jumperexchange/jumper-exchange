import { useQueries } from '@tanstack/react-query';
import { min } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { ONE_HOUR_MS } from 'src/const/time';
import type { Address } from 'viem';
import type {
  AddressQueryParams,
  PortfolioPositionsQuery,
} from '@/app/lib/getPositionsForAddress';
import { getPositionsForAddresses } from '@/app/lib/getPositionsForAddress';
import type { WalletPositions } from '@/types/jumper-backend';
import type { DefiPosition } from '@/utils/positions/type-guards';
import type { GetTokenUSDPrice } from '@/utils/positions/update-price';
import { updateWalletPositionsPrice } from '@/utils/positions/update-price';
import { useTokens } from '../useTokens';
import type { Account } from '@lifi/widget-provider';
import { useAccountGroupsByChainType } from '../accounts/useAccountGroupsByChainType';

export interface Props {
  accounts: Account[];
  filter?: Omit<PortfolioPositionsQuery, keyof AddressQueryParams>;
}

export interface Result {
  data: WalletPositions | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  error: unknown | null;
  refetch: () => void;
}

// @Note: wrap earn pages with portfolio provider and remove this hook
export const usePortfolioDeFiPositions = ({
  accounts,
  filter,
}: Props): Result => {
  const { getToken, isLoading: isLoadingTokens, updatedAt } = useTokens();
  const accountGroups = useAccountGroupsByChainType(accounts);

  const getTokenUSDPrice: GetTokenUSDPrice = useCallback(
    (token: { chainId: number; address: string }) => {
      try {
        const tokenFound = getToken(token.chainId, token.address as Address);
        if (!tokenFound) {
          throw new Error(
            `Token not found for address ${token.address} on chain ${token.chainId}`,
          );
        }
        const priceUSD = parseFloat(tokenFound.priceUSD);
        if (isNaN(priceUSD)) {
          throw new Error(
            `Price USD is NaN for token ${token.address} on chain ${token.chainId}`,
          );
        }
        return priceUSD;
      } catch (error) {
        console.warn('Could not get token USD price', token, error);
        return undefined;
      }
    },
    [getToken],
  );

  const queries = useQueries({
    queries: accountGroups.map(({ addressParam, addresses }) => ({
      queryKey: [
        'portfolio-defi-positions',
        addressParam,
        addresses,
        filter,
        updatedAt,
      ],
      queryFn: async () => {
        const result = await getPositionsForAddresses({
          ...filter,
          [addressParam]: addresses,
        });
        return updateWalletPositionsPrice(result.data, getTokenUSDPrice);
      },
      enabled: !isLoadingTokens && addresses.length > 0,
      refetchInterval: ONE_HOUR_MS,
    })),
  });

  const isLoading = isLoadingTokens || queries.some((q) => q.isLoading);
  const isSuccess = queries.every((q) => q.isSuccess);
  const error = queries.find((q) => q.error)?.error ?? null;

  const data = useMemo((): WalletPositions | undefined => {
    if (!isSuccess || queries.length === 0) {
      return undefined;
    }

    const successfulQueries = queries.filter((q) => q.isSuccess && q.data);
    const allPositions: DefiPosition[] = successfulQueries.flatMap(
      (q) => q.data?.data ?? [],
    );

    const dates = successfulQueries.map((q) => {
      const metaUpdatedAt = q.data?.meta?.updatedAt;
      return metaUpdatedAt
        ? new Date(metaUpdatedAt)
        : new Date(q.dataUpdatedAt);
    });

    const oldestUpdatedAt =
      dates.length > 0 ? min(dates).toISOString() : new Date().toISOString();

    return { data: allPositions, meta: { updatedAt: oldestUpdatedAt } };
  }, [queries, isSuccess]);

  const refetch = () => {
    queries.forEach((q) => q.refetch());
  };

  return { data, isLoading, isSuccess, error, refetch };
};
