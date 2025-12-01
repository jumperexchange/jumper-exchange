import Cookies from 'universal-cookie';
import { ChainType } from '@lifi/sdk';

export const useWalletCookie = (
  chainType: ChainType = ChainType.EVM,
): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const cookies = new Cookies();
  const walletAddress = cookies.get(`wallet:${chainType}`);

  return walletAddress;
};
