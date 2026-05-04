import type { Address } from 'viem';

export const LOOPOOR_INTEGRATOR = 'borrow';

export const LIFI_BASE_URL = 'https://li.quest';

export const MAX_UINT256 = 2n ** 256n - 1n;
export const MAX_UINT160 = 2n ** 160n - 1n;
export const MAX_UINT48 = 2n ** 48n - 1n;

export const ZERO_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000' as const;

export const ZERO_ADDRESS: Address =
  '0x0000000000000000000000000000000000000000';

export const PERMIT2_ADDRESS: Address =
  '0x000000000022D473030F116dDEE9F6B43aC78BA3';

export type LoopoorChainConfig = {
  morpho: Address;
  bundler3: Address;
  generalAdapter1: Address;
  swapAdapter: Address;
};

function resolveSwapAdapter(chainId: number): Address {
  if (chainId === 8453) {
    const fromEnv = process.env.NEXT_PUBLIC_LOOPOOR_SWAP_ADAPTER_BASE;
    if (fromEnv && /^0x[0-9a-fA-F]{40}$/.test(fromEnv)) {
      return fromEnv as Address;
    }
  }
  return ZERO_ADDRESS;
}

export const LOOPOOR_CHAIN_CONFIG: Record<number, LoopoorChainConfig> = {
  8453: {
    morpho: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
    bundler3: '0x6BFd8137e702540E7A42B74178A4a49Ba43920C4',
    generalAdapter1: '0xb98c948CFA24072e58935BC004a8A7b376AE746A',
    swapAdapter: resolveSwapAdapter(8453),
  },
};

export function getLoopoorChainConfig(chainId: number): LoopoorChainConfig {
  const config = LOOPOOR_CHAIN_CONFIG[chainId];
  if (!config) {
    throw new Error(`Loopoor: chain ${chainId} not supported`);
  }
  return config;
}
