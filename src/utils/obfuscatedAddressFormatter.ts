import { ZERO_ADDRESS } from 'src/const/zeroAddress';

export const obfuscatedAddressFormatter = (address?: string) => {
  const addressChunks = address?.split('...');
  if (addressChunks?.length === 2) {
    const addressPreChunksLength = addressChunks[0].length;
    const addressSuffixChunksLength = addressChunks[1].length;
    const zeroAddress = ZERO_ADDRESS.slice(
      addressPreChunksLength,
      -addressSuffixChunksLength,
    );
    return `${addressChunks[0]}${zeroAddress}${addressChunks[1]}`;
  } else {
    return ZERO_ADDRESS;
  }
};
