import { WidgetConfig } from '@lifi/widget';
import { useMemo } from 'react';
import envConfig from '@/config/env-config';
import { publicRPCList } from 'src/const/rpcList';

export const BICONOMY_EXPLORER_URL = 'https://meescan.biconomy.io';
export const BICONOMY_EXPLORER_TX_PATH = 'details';
export const BICONOMY_EXPLORER_ADDRESS_PATH = 'address';

export const useZapRPC = () => {
  const config: Partial<WidgetConfig> = useMemo(() => {
    const explorerConfig = [
      {
        url: BICONOMY_EXPLORER_URL,
        txPath: BICONOMY_EXPLORER_TX_PATH,
        addressPath: BICONOMY_EXPLORER_ADDRESS_PATH,
      },
    ];
    const explorerChainIds = ['internal'];
    const explorerUrls = explorerChainIds.reduce(
      (acc, id) => {
        acc[String(id)] = explorerConfig;
        return acc;
      },
      {} as Record<string, typeof explorerConfig>,
    );

    return {
      explorerUrls,
      keyPrefix: 'jumper-custom-zap',
      bridges: {
        deny: ['gasZipBridge'],
      },
      sdkConfig: {
        apiUrl: envConfig.NEXT_PUBLIC_LIFI_API_URL,
        rpcUrls: {
          ...JSON.parse(envConfig.NEXT_PUBLIC_CUSTOM_RPCS),
          ...publicRPCList,
        },
        routeOptions: {
          allowSwitchChain: false,
        },
      },
      useRecommendedRoute: true,
      contractCompactComponent: <></>,
    };
  }, []);

  return config;
};
