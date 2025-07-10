import { useAccount, useAccountDisconnect } from '@lifi/wallet-management';
import { useCallback } from 'react';

export const useDisconnect = () => {
  const { account } = useAccount();
  const disconnectWallet = useAccountDisconnect();

  // Disconnect current wallet on first render
  const disconnectActiveWallet = useCallback(async () => {
    if (account) {
      await disconnectWallet(account);
    }
  }, [account, disconnectWallet]);

  return { disconnectWallet, disconnectActiveWallet };
};
