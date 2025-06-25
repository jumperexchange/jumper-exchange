import { StatusResponse } from '@lifi/sdk';
import {
  CONTRIBUTION_AMOUNTS,
  VOLUME_THRESHOLDS,
  contributionFeeAddresses,
} from './constants';

/**
 * Determines if contribution should be shown based on transaction history
 * Shows contribution for:
 * - First transaction (count = 0)
 * - Every third transaction (count % 3 = 0)
 */
export const checkContributionByTxHistory = (
  transfers?: StatusResponse[],
): boolean => {
  if (!(Array.isArray(transfers) && transfers.length)) {
    return false;
  }
  const transactionCount = transfers.length;
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

/**
 * Gets the contribution fee address for a given chain ID
 * Returns undefined if no specific address is configured for the chain
 */
export const getContributionFeeAddress = (
  chainId: number,
): string | undefined => {
  return contributionFeeAddresses[chainId];
};

export const formatInputAmount = (
  amount: string,
  decimals: number | null = null,
  returnInitial = false,
) => {
  if (!amount) {
    return amount;
  }
  let formattedAmount = amount
    .trim()
    .replaceAll(',', '.')
    .replaceAll(/^[^\d.]*$/g, '');
  if (formattedAmount.startsWith('.')) {
    formattedAmount = `0${formattedAmount}`;
  }
  const parsedAmount = Number.parseFloat(formattedAmount);
  if (Number.isNaN(Number(formattedAmount)) && !Number.isNaN(parsedAmount)) {
    return parsedAmount.toString();
  }
  if (Number.isNaN(Math.abs(Number(formattedAmount)))) {
    return '';
  }
  if (returnInitial) {
    return formattedAmount;
  }
  let [integer, fraction = ''] = formattedAmount.split('.');
  if (decimals !== null && fraction.length > decimals) {
    fraction = fraction.slice(0, decimals);
  }
  integer = integer.replace(/^0+|-/, '');
  fraction = fraction.replace(/(0+)$/, '');
  return `${integer || (fraction ? '0' : '')}${fraction ? `.${fraction}` : ''}`;
};
