import { DEFAULT_WALLET_ADDRESS } from '@/const/urls';
import { blo } from 'blo';
import type { Address } from 'viem';

function useBlockieImg(address?: string) {
  if (!address) {
    return blo(DEFAULT_WALLET_ADDRESS);
  }

  return blo(address as Address);
}

export default useBlockieImg;
