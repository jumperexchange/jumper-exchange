export const walletDigest = (address?: string) => {
  if (address) {
    return `${address.substring(0, 7)}...${address.substring(address.length -5)}`;
  } else {
    return 'None';
  }
};
