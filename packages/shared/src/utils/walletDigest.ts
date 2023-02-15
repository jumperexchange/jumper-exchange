export const walletDigest = (account) => {
  if (!!account.address) {
    return `${account.address.substr(0, 5)}...${account.address.substr(-4)}`;
  } else {
    return 'None';
  }
};
