import { Transfer } from 'src/hooks/useTxHistory';
import { CONTRIBUTION_AMOUNTS, VOLUME_THRESHOLDS } from './constants';

/**
 * Determines if contribution should be shown based on transaction history
 * Shows contribution for:
 * - First transaction (count = 0)
 * - Every third transaction (count % 3 = 0)
 */
export const checkContributionByTxHistory = (
  transfers: Transfer[] | undefined,
): boolean => {
  const transactionCount = transfers?.length ?? 0;
  return transactionCount === 0 || transactionCount % 3 === 0;
};

/**
 * Returns contribution amount options based on transaction volume
 */
export const getContributionAmounts = (volume: number): number[] => {
  if (volume >= VOLUME_THRESHOLDS.HIGH) {
    return CONTRIBUTION_AMOUNTS.HIGH_VOLUME;
  }
  if (volume >= VOLUME_THRESHOLDS.MEDIUM) {
    return CONTRIBUTION_AMOUNTS.MEDIUM_VOLUME;
  }
  if (volume >= VOLUME_THRESHOLDS.LOW) {
    return CONTRIBUTION_AMOUNTS.LOW_VOLUME;
  }
  return CONTRIBUTION_AMOUNTS.DEFAULT;
};
