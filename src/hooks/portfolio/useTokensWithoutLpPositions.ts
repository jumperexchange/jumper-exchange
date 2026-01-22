import { useMemo } from 'react';
import { differenceWith } from 'lodash';
import { useConnectedEvmAddresses } from '@/hooks/useConnectedEvmAddresses';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import type { PortfolioToken } from 'src/types/tokens';
import { isChainDefiPosition } from '@/utils/positions/type-guards';

const getTokenKey = (address: string, chainId: number) =>
  `${address.toLowerCase()}-${chainId}`;

export const filterTokensWithoutLpPositions = (
  tokens: PortfolioToken[],
  lpTokens: { address: string; chainId: number }[],
): PortfolioToken[] => {
  if (tokens.length === 0 || lpTokens.length === 0) {
    return tokens;
  }

  return differenceWith(tokens, lpTokens, (token, lpToken) => {
    const tokenKey = getTokenKey(token.address, token.chain.chainId);
    const lpKey = getTokenKey(lpToken.address, lpToken.chainId);

    if (tokenKey === lpKey) {
      return true;
    }

    if (token.relatedTokens) {
      return token.relatedTokens.some(
        (rt) => getTokenKey(rt.address, rt.chain.chainId) === lpKey,
      );
    }

    return false;
  });
};

export const useLpPositions = () => {
  const connectedAddresses = useConnectedEvmAddresses();
  const { data: allPositions } = usePortfolioDeFiPositions({
    addresses: connectedAddresses,
  });

  const lpTokens = useMemo(() => {
    const positions = allPositions?.data;
    if (!positions || positions.length === 0) {
      return [];
    }
    return positions
      .filter(isChainDefiPosition)
      .filter((p) => p.lpToken?.address && p.lpToken?.chain.chainId)
      .map((p) => ({
        address: p.lpToken!.address,
        chainId: p.lpToken!.chain.chainId,
      }));
  }, [allPositions?.data]);

  return lpTokens;
};

export const useTokensWithoutLpPositions = (
  tokens: PortfolioToken[],
): PortfolioToken[] => {
  const lpTokens = useLpPositions();
  return useMemo(
    () => filterTokensWithoutLpPositions(tokens, lpTokens),
    [tokens, lpTokens],
  );
};
