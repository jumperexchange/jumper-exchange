export const walletDigest = (address?: string) => {
  if (address) {
    return `${address.substr(0, 5)}...${address.substr(-4)}`;
  } else {
    return 'None';
  }
};
