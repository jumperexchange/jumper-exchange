import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { makeClient } from '@/app/lib/client';
import { useAccountGroupsByChainType } from '@/hooks/accounts/useAccountGroupsByChainType';
import type {
  TransactionsDtoResponse,
  TransactionsDto,
} from '@/types/jumper-backend';

interface UseTransactionsDataProps {
  walletAddress?: string | null;
  minDate?: string | null;
  maxDate?: string | null;
  cursor?: string | null;
  chainIds?: number[];
  types?: TransactionsDto['action'][];
  assets?: string[];
}

export const useTransactionsData = ({
  walletAddress,
  minDate,
  maxDate,
  cursor,
  chainIds,
  types,
  assets,
}: UseTransactionsDataProps) => {
  const { accounts } = useAccount();
  const accountGroups = useAccountGroupsByChainType(accounts);

  const addressParams = useMemo(() => {
    if (!walletAddress) {
      return {};
    }

    const params: Record<string, string> = {};
    for (const { addressParam, addresses } of accountGroups) {
      if (addresses.includes(walletAddress)) {
        params[addressParam] = walletAddress;
        break;
      }
    }
    return params;
  }, [walletAddress, accountGroups]);

  const hasAddress = !!walletAddress && Object.keys(addressParams).length > 0;

  return useQuery<TransactionsDtoResponse>({
    queryKey: [
      'portfolio-transactions',
      walletAddress,
      minDate,
      maxDate,
      cursor,
      chainIds,
      types,
      assets,
    ],
    queryFn: async () => {
      const client = makeClient();
      const res = await client.v1.portfolioControllerGetUserTransactionsV1({
        ...addressParams,
        minDate: minDate ?? undefined,
        maxDate: maxDate ?? undefined,
        next: cursor ?? undefined,
        chains: chainIds?.length ? chainIds : undefined,
        types: types?.length ? types : undefined,
        assets: assets?.length ? assets : undefined,
      });
      return res.data;
    },
    enabled: hasAddress,
  });
};
