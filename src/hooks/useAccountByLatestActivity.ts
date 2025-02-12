import { useAccount } from '@lifi/wallet-management';
import { useMemo } from 'react';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';
import { useChains } from './useChains';

export const useAccountByLatestActivity = () => {
  const { accounts, account } = useAccount();
  const { sourceChainToken } = useChainTokenSelectionStore();
  const { getChainById } = useChains();

  const sortedAccounts = useMemo(() => {
    if (!sourceChainToken?.chainId) {
      return accounts;
    }

    const sourceChain = getChainById(sourceChainToken.chainId);
    if (!sourceChain) {
      return accounts;
    }

    const sourceChainType = sourceChain.chainType;

    return accounts.sort((a, b) => {
      if (a.chainType === sourceChainType && b.chainType !== sourceChainType) {
        return -1;
      }
      if (b.chainType === sourceChainType && a.chainType !== sourceChainType) {
        return 1;
      }
      return 0;
    });
  }, [accounts, sourceChainToken, getChainById]);

  return {
    accounts: sortedAccounts || [],
    account: sortedAccounts[0] || account,
  };
};
