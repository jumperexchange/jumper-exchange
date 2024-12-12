import { ethers } from 'ethers';

export const checkAddressType = (address?: string) => {
  if (!address) {
    return undefined;
  }
  if (
    address.startsWith('0x') &&
    address.length === 42 &&
    ethers.isAddress(address)
  ) {
    return 'evm';
  } else if (address.length === 44 && /^[A-Za-z0-9]+$/.test(address)) {
    return 'sol';
  } else {
    return undefined;
  }
};
