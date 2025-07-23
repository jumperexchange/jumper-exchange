import { WidgetConfig } from '@lifi/widget';
import { useMemo } from 'react';
import { publicRPCList } from 'src/const/rpcList';
import getApiUrl from 'src/utils/getApiUrl';
import envConfig from '@/config/env-config';

export const useBaseRPC = () => {
  const config: Partial<WidgetConfig> = useMemo(() => {
    return {
      sdkConfig: {
        apiUrl: getApiUrl(),
        useRelayerRoutes: true,
        rpcUrls: {
          ...JSON.parse(envConfig.NEXT_PUBLIC_CUSTOM_RPCS),
          ...publicRPCList,
        },
        routeOptions: {
          maxPriceImpact: 0.4,
        },
      },
    };
  }, []);

  return config;
};
