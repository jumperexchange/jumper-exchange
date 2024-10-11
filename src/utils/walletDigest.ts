export const walletDigest = (address?: string) => {
  if (address) {
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  } else {
    return 'None';
  }
};
