import { getTokenBalance } from '@lifi/sdk';
import type { Token } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';

export async function getTokenBalanceQuery({
  queryKey,
}: {
  queryKey: [string, string, Token];
}) {
  const [, walletAddress, token] = queryKey;
  const tokenBalance = await getTokenBalance(walletAddress, token);

  return tokenBalance;
}

export const useGetTokenBalance = (walletAddress?: string, token?: Token) => {
  return useQuery({
    queryKey: ['tokenBalance', walletAddress!, token!],
    queryFn: getTokenBalanceQuery,
    enabled: !!(walletAddress && token?.address),
    refetchInterval: 1000 * 60 * 60,
  });
};
