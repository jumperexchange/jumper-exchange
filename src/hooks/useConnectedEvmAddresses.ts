import { useMemo } from 'react';
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import type { Hex } from 'viem';

export const useConnectedEvmAddresses = (): Hex[] => {
  const { accounts } = useAccount();

  return useMemo(() => {
    return accounts
      .filter(
        (account) =>
          account.isConnected &&
          !!account?.address &&
          account.chainType === ChainType.EVM,
      )
      .map((account) => account.address as Hex);
  }, [accounts]);
};
