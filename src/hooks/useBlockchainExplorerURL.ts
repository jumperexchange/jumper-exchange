import { useChains } from 'src/hooks';
import { useAccount } from './useAccount';

export const useBlockchainExplorerURL = () => {
  const { account } = useAccount();
  const { isSuccess: chainsLoaded, getChainById } = useChains();

  if (account.address && account.chainId) {
    const chain = getChainById(account.chainId);
    if (chainsLoaded && chain?.metamask) {
      return `${chain.metamask.blockExplorerUrls[0]}address/${account.address}`;
    } else {
      console.error(`No blockchain explorer found for ${account.chainId}`);
    }
  }
};
