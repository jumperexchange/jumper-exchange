import { getAddressLabel } from 'src/utils/getAddressLabel';
import { useENSSNS } from './useENSSNS';

export const useWalletLabel = (address?: string) => {
  const { name, isSuccess } = useENSSNS(address);
  const addressLabel = getAddressLabel({
    isSuccess,
    ensName: name,
    address,
  });

  return addressLabel;
};
