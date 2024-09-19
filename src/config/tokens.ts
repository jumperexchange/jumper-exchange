import { ChainId } from '@lifi/sdk';

export const tokens = {
  allow: [
    {
      address: '0x0000000000000000000000000000000000000000', // ETH
      chainId: ChainId.TAI,
    },
    {
      address: '0x19e26B0638bf63aa9fa4d14c6baF8D52eBE86C5C', // USDC.e Stargate
      chainId: ChainId.TAI,
    },
    {
      address: '0x9c2dc7377717603eB92b2655c5f2E7997a4945BD', // USDT Stargate
      chainId: ChainId.TAI,
    },
    {
      address: '0x0000000000000000000000000000000000000000',
      chainId: ChainId.IMX,
    },
    {
      address: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
      chainId: ChainId.IMX,
    },
  ],
};
