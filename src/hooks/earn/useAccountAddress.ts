import { ChainType } from '@lifi/sdk';
import { useAccount } from '@jumperexchange/wallet-management';
import type { Hex } from 'viem';
import { isHex } from 'viem';

export const useAccountAddress = (): Hex | undefined => {
  const { accounts } = useAccount();

  const evmAccounts = accounts?.filter(
    (account) => account.chainType === ChainType.EVM,
  );

  const account = evmAccounts?.[0];

  if (account?.address && isHex(account.address, { strict: true })) {
    return account.address;
  }

  return undefined;
};
