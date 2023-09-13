import type { ChainId } from '@lifi/types';
export interface MultisigProps {
  destinationChain?: number;
}
export interface MultisigState extends MultisigProps {
  // Destination Chain
  onDestinationChainSelected: (chainId: ChainId) => void;
}
