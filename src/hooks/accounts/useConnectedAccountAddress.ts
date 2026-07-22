'use client';

import { useAccount } from '@jumperexchange/wallet-management';

/**
 * Address of the currently selected / first connected wallet, on any chain.
 * Prefer this over `useAccountAddress` when access control is not EVM-specific.
 */
export const useConnectedAccountAddress = (): string | undefined => {
  const { account, accounts } = useAccount();

  if (account?.address) {
    return account.address;
  }

  return accounts.find((connectedAccount) => connectedAccount.address)?.address;
};
