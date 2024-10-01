import { getWalletPriority } from '@lifi/wallet-management';
import type { Wallet } from '@solana/wallet-adapter-react';
import type { Connector } from 'wagmi';

export const walletComparator = (
  a: Connector | Wallet,
  b: Connector | Wallet,
) => {
  const aId = (a as Connector).id || (a as Wallet).adapter?.name;
  const bId = (b as Connector).id || (b as Wallet).adapter?.name;

  const priorityA = getWalletPriority(aId);
  const priorityB = getWalletPriority(bId);

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  if (aId < bId) {
    return -1;
  }
  if (aId > bId) {
    return 1;
  }
  return 0;
};
