import { createConfig } from '@lifi/sdk';
import { publicRPCList } from './../const/rpcList';

createConfig({
  apiUrl: process.env.NEXT_PUBLIC_LIFI_API_URL,
  integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
  rpcUrls: {
    ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS),
    ...publicRPCList,
  },
  preloadChains: false,
});
