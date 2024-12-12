import { DEFAULT_WALLET_ADDRESS } from '@/const/urls';
import type { GetEnsNameReturnType } from 'wagmi/actions';
import { checkAddressType } from './checkAddressType';
import { walletDigest } from './walletDigest';
interface getAddressLabelProps {
  isSuccess: boolean;
  name?: GetEnsNameReturnType;
  address?: string;
}

export const getAddressLabel = ({
  isSuccess,
  name,
  address,
}: getAddressLabelProps): string => {
  const walletType = checkAddressType(address);
  if (isSuccess && name) {
    switch (walletType) {
      case 'sol':
        return String(name).length > 16
          ? `${String(name).slice(0, 13)}...sol`
          : `${name}.sol`;
      default:
        return String(name).length > 20
          ? `${String(name).slice(0, 13)}...eth`
          : name;
    }
  } else if (address) {
    return walletDigest(address);
  } else {
    return walletDigest(DEFAULT_WALLET_ADDRESS);
  }
};
