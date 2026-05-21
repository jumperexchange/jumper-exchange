import config from '@/config/env-config';
import { getCustomRPCs, publicRPCList } from '@/const/rpcList';
import { createClient, type SDKProvider } from '@lifi/sdk';
import { EthereumProvider } from '@lifi/sdk-provider-ethereum';
import { BitcoinProvider } from '@lifi/sdk-provider-bitcoin';
import { SolanaProvider } from '@lifi/sdk-provider-solana';
import { SuiProvider } from '@lifi/sdk-provider-sui';
import { TronProvider } from '@lifi/sdk-provider-tron';
import getApiUrl from '../getApiUrl';
import { getPathname } from '../urls/getPathname';
import { getPathBasedIntegrator } from '../widgets/getPathBasedIntegrator';

export const GLOBAL_HEADERS = {
  Referer: config.NEXT_PUBLIC_SITE_URL,
};

// Defer createClient until first property access so that window._env_
// (injected by the layout <script> tag) is available when getApiUrl() runs.
let _client: ReturnType<typeof createClient>;

function initClient() {
  if (!_client) {
    _client = createClient({
      apiKey: config.NEXT_PUBLIC_LIFI_API_KEY,
      apiUrl: getApiUrl(),
      integrator: config.NEXT_PUBLIC_WIDGET_INTEGRATOR || 'jumper.exchange',
      rpcUrls: {
        ...getCustomRPCs(),
        ...publicRPCList,
      },
      preloadChains: true,
      requestInterceptor: (request) => {
        const pathname = getPathname();
        const integrator = getPathBasedIntegrator(pathname, config);
        request.headers = {
          ...(request.headers ?? {}),
          Referer: GLOBAL_HEADERS.Referer,
          'x-lifi-integrator': integrator,
        };
        return request;
      },
    });
    _client.setProviders([
      EthereumProvider(),
      SolanaProvider(),
      BitcoinProvider(),
      SuiProvider(),
      TronProvider(),
    ] as SDKProvider[]);
  }
  return _client;
}

export const sdkClient: ReturnType<typeof createClient> = new Proxy(
  {} as ReturnType<typeof createClient>,
  {
    get(_, prop, receiver) {
      return Reflect.get(initClient(), prop, receiver);
    },
  },
);
