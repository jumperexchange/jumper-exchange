import type { Address } from 'abitype';

export const ContractAddresses = {
  WrappedVault: '0x0000000000000000000000000000000000000000',
  WrappedVaultFactory: '0xb316d165d01ac68d31b297f847533d671c965662',
  PointsFactory: '0x19112adbdafb465ddf0b57ecc07e68110ad09c50',
  RecipeMarketHub: '0x76953a612c256fc497bbb49ed14147f24c4feb71',
  VaultMarketHub: '0x52341389be638a5b8083d2b70a421f9d4c87ebcd',
  WeirollWallet: '0x40a1c08084671e9a799b73853e82308225309dc0',
  WeirollWalletHelper: '0x07899ac8be7462151d6515fcd4773dd9267c9911',
} as Record<string, Address>;
