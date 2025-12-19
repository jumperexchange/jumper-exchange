import config from '@/config/env-config';
import { publicRPCList } from '@/const/rpcList';
import { createConfig, EVM, Solana, Sui, UTXO } from '@lifi/sdk';
import getApiUrl from '../getApiUrl';

export const GLOBAL_HEADERS = {
  Referer: config.NEXT_PUBLIC_SITE_URL,
};

export const lifiSdkConfig = createConfig({
  apiKey: config.NEXT_PUBLIC_LIFI_API_KEY,
  apiUrl: getApiUrl(),
  providers: [EVM(), Solana(), UTXO(), Sui()],
  integrator: config.NEXT_PUBLIC_WIDGET_INTEGRATOR,
  rpcUrls: {
    ...JSON.parse(config.NEXT_PUBLIC_CUSTOM_RPCS ?? {}),
    ...publicRPCList,
  },
  preloadChains: true,
  requestInterceptor: (request) => {
    request.headers = {
      ...(request.headers ?? {}),
      Referer: GLOBAL_HEADERS.Referer,
    };
    return request;
  },
});
