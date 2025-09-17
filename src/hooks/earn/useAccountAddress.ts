import { useAccount } from '@lifi/wallet-management';
import { Hex } from 'viem';

const isHex = (address: string): address is Hex => {
  return /^0x[0-9A-Fa-f]+$/.test(address);
};

export const useAccountAddress = (): Hex | undefined => {
  const { account } = useAccount();

  if (account.address && isHex(account.address)) {
    return account.address;
  }

  return undefined;
};
