import { ChainType } from '@lifi/sdk';

export const walletEcosystemsOrder = {
  MetaMask: [ChainType.EVM, ChainType.UTXO, ChainType.SVM, ChainType.MVM],
  Phantom: [ChainType.SVM, ChainType.EVM, ChainType.UTXO, ChainType.MVM],
};
