import type { ChainId } from '@lifi/types';

export interface MultisigProps {
  destinationChain?: ChainId;
}
export interface MultisigState extends MultisigProps {
  // Destination Chain
  onDestinationChainSelected: (chainId: number) => void;
}
