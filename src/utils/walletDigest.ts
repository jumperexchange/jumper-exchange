import type { WalletAccount } from '@types';
export const walletDigest = (account: WalletAccount) => {
  if (!!account.address) {
    return `${account.address.substr(0, 5)}...${account.address.substr(-4)}`;
  } else {
    return 'None';
  }
};
