import type { ChainId, Token } from '@lifi/sdk';
import { getToken } from '@lifi/sdk';
import { useQueries } from '@tanstack/react-query';

export interface TokenProps {
  tokens: (Token | null)[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export async function getTokenQuery(chainId: ChainId, tokenAddress: string) {
  const token = await getToken(chainId, tokenAddress);
  return token;
}

export interface UseMultipleTokenProps {
  chainId: ChainId;
  tokenAddress: string;
}

export const useMultipleTokens = (
  tokens: UseMultipleTokenProps[] | undefined,
) => {
  const safeTokens = Array.isArray(tokens) ? tokens : [];
  const queries = useQueries({
    queries: safeTokens.map((token) => ({
      queryKey: ['tokens', token.chainId, token.tokenAddress],
      queryFn: () => getTokenQuery(token.chainId, token.tokenAddress),
      enabled: !!token.chainId && !!token.tokenAddress,
      refetchInterval: 1000 * 60 * 60, // Refetch every hour
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const error = queries.find((query) => query.error)?.error;

  return {
    tokens: queries.map((query) => query.data || null),
    isLoading,
    isError,
    error,
  };
};
