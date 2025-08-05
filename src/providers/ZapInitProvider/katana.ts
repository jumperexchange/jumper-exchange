import { defineChain } from 'viem/utils';

export const katana = defineChain({
  id: 747474,
  name: 'Katana',
  nativeCurrency: {
    decimals: 18,
    name: 'Katana',
    symbol: 'KAT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.katana.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'KatanaExplorer',
      url: 'https://katanascan.com',
    },
  },
});
