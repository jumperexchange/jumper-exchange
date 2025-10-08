import { useAccount } from '@lifi/wallet-management';
import { Hex, isHex } from 'viem';

export const useAccountAddress = (): Hex | undefined => {
  const { account } = useAccount();

  if (account.address && isHex(account.address, { strict: true })) {
    return account.address;
  }

  return undefined;
};
