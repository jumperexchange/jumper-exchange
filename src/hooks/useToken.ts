import type { ChainId, Token } from '@lifi/sdk';
import { getToken } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';

export interface TokenProps {
  token: Token | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export async function getTokenQuery(chainId?: ChainId, tokenAddress?: string) {
  if (!chainId || !tokenAddress) {
    return;
  }
  const token = await getToken(chainId, tokenAddress);
  return token;
}

export const useToken = (
  chainId?: ChainId,
  tokenAddress?: string,
): TokenProps => {
  const {
    data: token,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['token', chainId, tokenAddress],
    queryFn: () => getTokenQuery(chainId, tokenAddress),
    enabled: !!chainId && !!tokenAddress,
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  return {
    token: token || null,
    isLoading,
    isError,
    error,
  };
};
