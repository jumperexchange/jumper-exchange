import { useAccount, useAccountDisconnect } from '@lifi/wallet-management';
import { useCallback } from 'react';

export const useDisconnect = () => {
  const { account } = useAccount();
  const disconnectWallet = useAccountDisconnect();

  // Disconnect current wallet on first render
  const disconnectWalletOnMount = useCallback(async () => {
    if (account) {
      console.log('disconnecting wallet on mount');
      await disconnectWallet(account);
    }
  }, [account, disconnectWallet]);

  return { disconnectWallet, disconnectWalletOnMount };
};
