import type { ExtendedChain } from '@lifi/types';
// ----------------------------------------------------------------------

export interface ChainsProps {
  chains: ExtendedChain[];
  [key: string]: any;
}

export interface ChainsState extends ChainsProps {
  // On Chains load
  onChainsLoad: (chains: ExtendedChain[]) => void;
}
