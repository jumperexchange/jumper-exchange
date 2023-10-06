import { useChains } from '@transferto/dapp/src/hooks/useChains';
import { useWallet } from '../providers';

export const useBlockchainExplorerURL = () => {
  const { account } = useWallet();
  const { getChainById } = useChains();

  if (account?.address && account?.chainId) {
    const chain = getChainById(account.chainId);
    if (chain?.metamask)
      return `${chain.metamask.blockExplorerUrls[0]}address/${account.address}`;
  }
};
