import { useChains } from 'src/hooks';
import { useWallet } from 'src/providers';

export const useBlockchainExplorerURL = () => {
  const { account } = useWallet();
  const { getChainById } = useChains();

  if (account?.address && account?.chainId) {
    const chain = getChainById(account.chainId);
    if (chain?.metamask) {
      return `${chain.metamask.blockExplorerUrls[0]}address/${account.address}`;
    } else {
      console.error(`No blockchain explorer found for ${account.chainId}`);
    }
  }
};
