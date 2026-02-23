import { useMemo } from 'react';
import { ChainId } from '@lifi/sdk';
import { zeroAddress } from 'viem';
import { useChains } from '@/hooks/useChains';
import { createExtendedToken, type ExtendedToken } from '@/types/tokens';

export const useFallbackNativeToken = (
  nativeExtendedTokens: ExtendedToken[],
) => {
  const { chains: allChains } = useChains();

  return useMemo(() => {
    if (nativeExtendedTokens.length) {
      return nativeExtendedTokens[0];
    }

    const ethChain = allChains.find((c) => c.id === ChainId.ETH);

    return createExtendedToken(
      ethChain?.nativeToken ?? {
        chainId: ChainId.ETH,
        symbol: 'ETH',
        priceUSD: '0',
        decimals: 18,
        name: 'Ether',
        address: zeroAddress,
      },
    );
  }, [nativeExtendedTokens, allChains]);
};
