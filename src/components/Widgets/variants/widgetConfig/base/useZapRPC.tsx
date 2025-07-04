import { EVMProvider, ChainType } from '@lifi/sdk';
import { WidgetConfig } from '@lifi/widget';
import { useMemo } from 'react';

export const useZapRPC = (
  providers: EVMProvider[],
  toAddress: `0x${string}`,
  enabled?: boolean,
) => {
  if (!enabled) {
    return {};
  }
  const config: Partial<WidgetConfig> = useMemo(() => {
    const explorerConfig = [
      {
        url: 'https://meescan.biconomy.io',
        txPath: 'details',
        addressPath: 'address',
      },
    ];
    const explorerChainIds = [
      56, 1399811149, 1, 8453, 42161, 130, 101, 43114, 137, 728126428, 999, 146,
      10, 49705, 5000, 80094, 531, 369, 2741, 59144, 42220, 100, 81457, 2020,
      57420037, 480, 25, 57073, 534352, 324, 98866, 1116, 1088, 1284, 169, 747,
      250, 34443, 1514, 13371, 204, 288, 1285, 50104, 48900, 1923, 153153, 4689,
      7700, 1480, 88888, 1101, 55244, 33139, 888, 1313161554, 592, 53935, 2001,
      428962, 122, 2000, 109, 106, 7777777, 42262, 660279, 10000, 54176, 321,
      20, 246, 666666666, 1996, 24, 4321, 9001, 5112, 57, 10143, 50312,
      11155111, 84532,
    ];
    const explorerUrls = explorerChainIds.reduce(
      (acc, id) => {
        acc[String(id)] = explorerConfig;
        return acc;
      },
      {} as Record<string, typeof explorerConfig>,
    );

    return {
      toAddress: {
        name: 'Smart Account',
        address: toAddress,
        chainType: ChainType.EVM,
      },
      explorerUrls,
      bridges: {
        allow: ['across', 'relay'],
      },
      sdkConfig: {
        apiUrl: process.env.NEXT_PUBLIC_LIFI_API_URL,
        providers,
      },
      useRecommendedRoute: true,
      contractCompactComponent: <></>,
    };
  }, [providers, toAddress]);

  return config;
};
