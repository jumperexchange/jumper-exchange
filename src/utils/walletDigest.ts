export const walletDigest = (address?: string) => {
  if (address) {
    return `${address.slice(0, 7)}...${address.substring(address.length - 5)}`;
  } else {
    return 'None';
  }
};
