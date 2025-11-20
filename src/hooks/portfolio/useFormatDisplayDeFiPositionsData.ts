import { useMemo } from 'react';
import type { DefiPosition } from '@/types/jumper-backend';
import type { MinimalDeFiPosition } from 'src/types/defi';

// @Note: This is a temporary solution to convert the data to the MinimalDeFiPosition type.
export const useFormatDisplayDeFiPositionsData = (
  data: DefiPosition[],
): MinimalDeFiPosition[] => {
  return useMemo(() => {
    return data.map((defiPosition): MinimalDeFiPosition => {
      const primaryAsset =
        defiPosition.assetTokens?.[0] ||
        defiPosition.supplyTokens?.[0] ||
        defiPosition.collateralTokens?.[0];

      return {
        name: defiPosition.earn || 'Unknown Position',
        asset: {
          name: primaryAsset?.symbol || 'Unknown',
          symbol: primaryAsset?.symbol || 'Unknown',
          decimals: primaryAsset?.decimals || 18,
          logo: primaryAsset?.logoUrl,
          address: defiPosition.address,
          chain: {
            chainId: defiPosition.chainId,
            chainKey: defiPosition.chainId.toString(),
          },
        },
        protocol: {
          name: defiPosition.earn || 'Unknown',
        },
        lpToken: {
          name: primaryAsset?.symbol || 'Unknown',
          symbol: primaryAsset?.symbol || 'Unknown',
          decimals: primaryAsset?.decimals || 18,
          logo: primaryAsset?.logoUrl,
          address: defiPosition.address,
          chain: {
            chainId: defiPosition.chainId,
            chainKey: defiPosition.chainId.toString(),
          },
        },
        tags: [defiPosition.type].filter(Boolean),
        rewards: [],
        slug: `${defiPosition.earn}-${defiPosition.address}`,
        featured: false,
        forYou: false,
        description: '',
        balance: defiPosition.assetTokens?.[0]?.amount || 0,
        totalPriceUSD: defiPosition.netUsd || defiPosition.assetUsd || 0,
        latest: {
          date: new Date().toISOString(),
          tvlUsd: '0',
          tvlNative: '0',
          apy: {
            total: 0,
            base: 0,
            reward: 0,
          },
        },
      };
    });
  }, [data]);
};
