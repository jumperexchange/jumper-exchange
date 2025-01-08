import type { ChainId, ExtendedChain } from '@lifi/sdk';

// Function to sort the array with a specific chain ID first
export const sortChainsBySpecificId = (
  chains: ExtendedChain[],
  targetChainId: ChainId,
) => {
  const targetChain = chains.find((chain) => chain.id === targetChainId);
  const otherChains = chains.filter((chain) => chain.id !== targetChainId);

  // Combine the target chain and the other chains, with the target chain first
  return [targetChain, ...otherChains];
};

export const sortChainsBySpecificName = (
  chains: ExtendedChain[],
  targetName: string,
) => {
  const targetChain = chains.find(
    (chain) => chain.name.toLowerCase() === targetName.toLowerCase(),
  );
  const otherChains = chains.filter(
    (chain) => chain.name.toLowerCase() !== targetName.toLowerCase(),
  );

  // Combine the target chain and the other chains, with the target chain first
  return [targetChain, ...otherChains];
};
