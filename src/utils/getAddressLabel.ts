import type { GetEnsNameReturnType } from 'wagmi/actions';
import { walletDigest } from './walletDigest';
import { DEFAULT_WALLET_ADDRESS } from '@/const/urls';
interface getAddressLabelProps {
  isSuccess: boolean;
  ensName?: GetEnsNameReturnType;
  address?: string;
}

export const getAddressLabel = ({
  isSuccess,
  ensName,
  address,
}: getAddressLabelProps): string => {
  if (isSuccess && ensName) {
    return String(ensName).length > 20
      ? `${String(ensName).slice(0, 13)}...eth`
      : ensName;
  } else if (address) {
    return walletDigest(address);
  } else {
    return walletDigest(DEFAULT_WALLET_ADDRESS);
  }
};
