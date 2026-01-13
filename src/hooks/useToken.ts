import type { ChainId, Token } from '@lifi/sdk';
import { getToken } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';

export interface TokenProps {
  token: Token | null;
  isLoading: boolean;
  isSuccess: boolean;
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
  enabled: boolean = true,
): TokenProps => {
  const {
    data: token,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ['token', chainId, tokenAddress],
    queryFn: () => getTokenQuery(chainId, tokenAddress),
    enabled: !!chainId && !!tokenAddress && !!enabled,
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  return {
    token: token || null,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};
