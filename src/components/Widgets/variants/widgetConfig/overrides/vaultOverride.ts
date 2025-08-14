import { Token } from '@lifi/widget';
import { ConfigOverrideHook } from '../types';

// https://app.morpho.org/katana/vault/0xE4248e2105508FcBad3fe95691551d1AF14015f7/gauntlet-usdc
const LP_TOKEN_GAUNTLET_USDC: Token = {
  address: '0xE4248e2105508FcBad3fe95691551d1AF14015f7',
  symbol: 'gtUSDC',
  name: 'ERC-20: Gauntlet USDC',
  decimals: 18,
  priceUSD: '1',
  chainId: 747474,
  logoURI: 'https://cdn.morpho.org/v2/assets/images/gauntlet.svg',
};

export const useVaultOverride: ConfigOverrideHook = (ctx) => {
  return {
    tokens: {
      include: [LP_TOKEN_GAUNTLET_USDC],
    },
  };
};
