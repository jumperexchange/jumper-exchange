import { useMemo } from 'react';
import { differenceWith } from 'lodash';
import { useConnectedEvmAddresses } from '@/hooks/useConnectedEvmAddresses';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import type { MinimalToken } from 'src/types/tokens';
import type { CacheToken } from 'src/types/portfolio';

const getTokenKey = (address: string, chainId: number) =>
  `${address.toLowerCase()}-${chainId}`;

export const useTokensWithoutLpPositions = <
  T extends MinimalToken | CacheToken,
>(
  tokens: T[],
): T[] => {
  const connectedAddresses = useConnectedEvmAddresses();
  const { data: allPositions } = usePortfolioDeFiPositions({
    addresses: connectedAddresses,
  });

  const lpTokens = useMemo(() => {
    const positions = allPositions?.positions;
    if (!positions || positions.length === 0) {
      return [];
    }
    return positions
      .filter((p) => p.lpToken?.address && p.lpToken?.chain.chainId)
      .map((p) => ({
        address: p.lpToken!.address,
        chainId: p.lpToken!.chain.chainId,
      }));
  }, [allPositions?.positions]);

  return useMemo(() => {
    if (tokens.length === 0 || lpTokens.length === 0) {
      return tokens;
    }

    return differenceWith(tokens, lpTokens, (token, lpToken) => {
      const chainId = 'chainId' in token ? token.chainId : token.chain.chainId;
      const tokenKey = getTokenKey(token.address, chainId);
      const lpKey = getTokenKey(lpToken.address, lpToken.chainId);

      if (tokenKey === lpKey) {
        return true;
      }

      if ('relatedTokens' in token && token.relatedTokens) {
        return token.relatedTokens.some(
          (rt) => getTokenKey(rt.address, rt.chain.chainId) === lpKey,
        );
      }

      if ('chains' in token && token.chains) {
        return token.chains.some(
          (ct) => getTokenKey(ct.address, ct.chainId) === lpKey,
        );
      }

      return false;
    });
  }, [tokens, lpTokens]);
};
