import type { Account } from '@lifi/wallet-management';

export function checkActiveSvmAndEvm(accounts: Account[]) {
  // Check if the array has exactly 2 elements
  if (accounts.length < 2) {
    return false;
  }

  // Count the occurrences of each chainType
  const chainTypeCounts = accounts.reduce<Record<string, number>>(
    (counts, item) => {
      counts[item.chainType] = (counts[item.chainType] || 0) + 1;
      return counts;
    },
    {},
  );

  // Check if there's exactly one EVM and one SVM
  return chainTypeCounts.EVM === 1 && chainTypeCounts.SVM === 1;
}
