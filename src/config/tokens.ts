import { ChainId } from '@lifi/sdk';

export const tokens = {
  allow: [
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
  // deny: [
  //   {
  //     address: '0xA51894664A773981C6C112C43ce576f315d5b1B6', // WETH
  //     chainId: ChainId.TAI,
  //   },
  //   {
  //     address: '0x07d83526730c7438048D55A4fc0b850e2aaB6f0b', // USDC
  //     chainId: ChainId.TAI,
  //   },
  //   {
  //     address: '0x2DEF195713CF4a606B49D07E520e22C17899a736', // USDT
  //     chainId: ChainId.TAI,
  //   },
  //   {
  //     address: '0x0000000000000000000000000000000000000000', // ETH
  //     chainId: ChainId.TAI,
  //   },
  //   {
  //     address: '0xA9d23408b9bA935c230493c40C73824Df71A0975', // TAI
  //     chainId: ChainId.TAI,
  //   },
  // ],
};
