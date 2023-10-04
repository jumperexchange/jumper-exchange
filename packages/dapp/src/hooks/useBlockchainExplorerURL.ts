import { useChains } from '@transferto/dapp/src/hooks/useChains';
import { useWallet } from '../providers';

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
