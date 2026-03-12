import type { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { useMemo } from 'react';

export const useAccountForChainType = (chainType?: ChainType) => {
  const { accounts } = useAccount();

  return useMemo(() => {
    if (!chainType) {
      return undefined;
    }
    return accounts.find(
      (account) =>
        !!account.address &&
        account.isConnected &&
        account.chainType === chainType,
    );
  }, [chainType, accounts]);
};
