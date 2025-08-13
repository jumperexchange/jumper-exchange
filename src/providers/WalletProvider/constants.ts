import { ChainType } from '@lifi/sdk';

// Define priority order for each wallet - these options are fixed at the start of the list
const walletPriorities: Record<string, ChainType[]> = {
  MetaMask: [ChainType.EVM, ChainType.UTXO, ChainType.SVM],
  Phantom: [ChainType.SVM, ChainType.EVM, ChainType.UTXO],
} as const;

const allChainTypes = Object.values(ChainType);

export const walletEcosystemsOrder = Object.fromEntries(
  Object.entries(walletPriorities).map(([wallet, priorities]) => [
    wallet,
    [
      ...priorities,
      ...allChainTypes.filter((type) => !priorities.includes(type)),
    ],
  ]),
);
