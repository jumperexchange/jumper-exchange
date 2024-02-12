import type { ExtendedChain } from '@lifi/sdk';
import type { Address, Chain } from 'viem';

type ChainBlockExplorer = {
  name: string;
  url: string;
};

type ChainBlockExplorers = {
  [key: string]: ChainBlockExplorer;
  default: ChainBlockExplorer;
};

export const formatChain = (chain: ExtendedChain): Chain => ({
  ...chain,
  ...chain.metamask,
  blockExplorers: chain.metamask.blockExplorerUrls.reduce(
    (blockExplorers, blockExplorer, index) => {
      blockExplorers[index === 0 ? 'default' : `${index}`] = {
        name: blockExplorer,
        url: blockExplorer,
      };
      return blockExplorers;
    },
    {} as ChainBlockExplorers,
  ),
  name: chain.metamask.chainName,
  rpcUrls: {
    default: { http: chain.metamask.rpcUrls },
    public: { http: chain.metamask.rpcUrls },
  },
  contracts: {
    ...(chain.multicallAddress
      ? { multicall3: { address: chain.multicallAddress as Address } }
      : undefined),
  },
});
