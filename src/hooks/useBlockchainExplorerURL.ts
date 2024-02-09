import { ChainId } from '@lifi/sdk';
import { useChains } from 'src/hooks';

export const useBlockchainExplorerURL = () => {
  const { isSuccess, getChainById } = useChains();

  return (walletAddress?: string, chainId?: number) => {
    if (!walletAddress || !chainId) {
      return undefined;
    }
    if (chainId === ChainId.SOL) {
      return `https://explorer.solana.com/address/${walletAddress}`;
    }
    const chain = getChainById(chainId);
    if (isSuccess && chain?.metamask) {
      return `${chain.metamask.blockExplorerUrls[0]}address/${walletAddress}`;
    } else {
      console.error(`No blockchain explorer found for ${chainId}`);
    }
  };
};
