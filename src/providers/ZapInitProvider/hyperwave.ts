import { defineChain } from 'viem';

// https://github.com/wevm/viem/pull/3803/files
// TODO: can we pull this out of the widget instead of duplicating code?
// It's officially supported in LIFI: https://docs.li.fi/introduction/chains
export const hyperevm = defineChain({
  id: 999,
  name: 'HyperEVM',
  nativeCurrency: { name: 'HyperEVM', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.hyperliquid.xyz/evm'] },
  },
  blockExplorers: {
    default: {
      name: 'HyperEVM Explorer',
      url: 'https://hyperevmscan.io/',
    },
  },
});
