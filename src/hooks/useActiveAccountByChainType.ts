import { useAccount } from '@lifi/wallet-management';
import { useAccount as useAccountWagmi } from 'wagmi';
import { useMemo } from 'react';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';
import { useChains } from './useChains';

export const useActiveAccountByChainType = () => {
  const { accounts } = useAccount();
  const account2 = useAccountWagmi()

  const { sourceChainToken } = useChainTokenSelectionStore();
  const { getChainById } = useChains();

  console.log('acttt', accounts, sourceChainToken);

  const activeAccount = useMemo(() => {
    if (
      !sourceChainToken?.chainId ||
      (Array.isArray(accounts) && !(accounts.length > 1))
    ) {
      return accounts[0];
    }

    const sourceChain = getChainById(sourceChainToken.chainId);
    if (!sourceChain) {
      return accounts[0];
    }

    const sourceChainType = sourceChain.chainType;

    const sortedAccounts = accounts.sort((a, b) => {
      if (a.chainType === sourceChainType && b.chainType !== sourceChainType) {
        return -1;
      }
      if (b.chainType === sourceChainType && a.chainType !== sourceChainType) {
        return 1;
      }
      return 0;
    });
    return sortedAccounts[0];
  }, [sourceChainToken.chainId, accounts, getChainById]);

  console.log('end of hookactiveAccount', activeAccount, account2);

  return activeAccount;
};
