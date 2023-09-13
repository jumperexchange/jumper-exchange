export interface MultisigProps {
  destinationChain?: number;
}
export interface MultisigState extends MultisigProps {
  // Destination Chain
  onDestinationChainSelected: (chainId: number) => void;
}
