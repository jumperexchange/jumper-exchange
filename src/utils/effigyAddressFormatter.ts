import { ZERO_ADDRESS } from 'src/const/zeroAddress';

export const effigyAddressFormatter = (address: string) => {
  const zeroAddress = ZERO_ADDRESS.slice(4, -4);
  const addressChunks = address.split('...');
  if (addressChunks.length !== 2) {
    return;
  }
  return `${addressChunks[0]}${zeroAddress}${addressChunks[1]}`;
};
