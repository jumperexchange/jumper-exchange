import envConfig from '@/config/env-config';
import { WidgetConfig } from '@lifi/widget';
import { useMemo } from 'react';
import { publicRPCList } from 'src/const/rpcList';

export const BICONOMY_EXPLORER_URL = 'https://meescan.biconomy.io';
export const BICONOMY_EXPLORER_TX_PATH = 'details';
export const BICONOMY_EXPLORER_ADDRESS_PATH = 'address';

export const useZapRPC = () => {
  const config: Partial<WidgetConfig> = useMemo(() => {
    return {
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
    };
  }, []);

  return config;
};
