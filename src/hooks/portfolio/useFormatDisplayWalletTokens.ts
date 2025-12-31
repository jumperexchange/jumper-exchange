import { useTokens } from '@/hooks/useTokens';
import type { MinimalToken } from 'src/types/tokens';
import type { ExtendedTokenAmount } from 'src/utils/getTokens';
import type { CacheToken } from 'src/types/portfolio';
import { useMemo } from 'react';

type DisplayTokenSource = ExtendedTokenAmount | CacheToken;

export const useFormatDisplayWalletTokens = (
  data?: DisplayTokenSource[],
): MinimalToken[] => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((token) => ({
      address: token.address,
      symbol: token.symbol,
      chain: {
        chainId: token.chainId,
        chainKey: 'chainName' in token ? (token.chainName ?? '') : '',
      },
      balance: token.cumulatedBalance ?? 0,
      totalPriceUSD: token.cumulatedTotalUSD ?? 0,
      relatedTokens: token.chains.map((chain) => ({
        address: chain.address,
        symbol: chain.symbol,
        chain: {
          chainId: chain.chainId,
          chainKey: chain.chainName ?? '',
        },
        balance: chain.cumulatedBalance ?? 0,
        totalPriceUSD: chain.totalPriceUSD ?? 0,
      })),
    }));
  }, [data]);
};
