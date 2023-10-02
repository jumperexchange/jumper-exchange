import { useChains } from 'src/hooks';
import { useWallet } from 'src/providers';

export const useBlockchainExplorerURL = () => {
  const { account } = useWallet();
  const { getChainById } = useChains();

  if (account.isActive && account.chainId) {
    try {
      return `${
        getChainById(account.chainId).metamask.blockExplorerUrls[0]
      }address/${account.address}`;
    } catch {
      throw Error('No blockchain-explorer found');
    }
  }
};
