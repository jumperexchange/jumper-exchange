import { ChainType } from '@lifi/sdk';
import mapValues from 'lodash/mapValues';
import uniq from 'lodash/uniq';

// Define priority order for each wallet - these options are fixed at the start of the list
const walletPriorities: Record<string, ChainType[]> = {
  MetaMask: [ChainType.EVM, ChainType.UTXO, ChainType.SVM, ChainType.TVM],
  Phantom: [ChainType.SVM, ChainType.EVM],
} as const;

const allChainTypes = Object.values(ChainType);

export const walletEcosystemsOrder = mapValues(walletPriorities, (priorities) =>
  uniq([...priorities, ...allChainTypes]),
);
