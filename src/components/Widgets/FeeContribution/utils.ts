import { ChainType, Route, StatusResponse } from '@lifi/sdk';
import { Account } from '@lifi/wallet-management';
import { EVMAddress } from 'src/types/internal';
import {
  CONTRIBUTION_AMOUNTS,
  MIN_CONTRIBUTION_USD,
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
  if (!transfers || !(Array.isArray(transfers) && transfers.length)) {
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
): EVMAddress | undefined => {
  return contributionFeeAddresses[chainId];
};

// @todo: Import directly from @lifi/widget once exported with next release
export function formatInputAmount(
  amount: string,
  decimals: number | null = null,
  returnInitial = false,
) {
  if (!amount) {
    return amount;
  }
  let formattedAmount = amount.trim().replaceAll(',', '.');
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
}

export interface TransferResponse {
  transfers: StatusResponse[];
}

export const hasValidRouteData = (
  completedRoute: Route,
  account: Account,
): boolean => {
  return (
    completedRoute.fromAddress === completedRoute.toAddress && // check if last tx was sent to same wallet
    !!completedRoute.toChainId && // check for valid chain id
    completedRoute.toAddress === account.address
  ); // check if last tx was sent to same wallet currently connected
};

export const isEvmChainType = (account?: Account): boolean => {
  return account?.chainType === ChainType.EVM;
};

export const isTransactionAmountEligible = (amountUSD: string): boolean => {
  return Number(amountUSD) >= MIN_CONTRIBUTION_USD;
};

export const hasValidContributionFeeAddress = (chainId: number): boolean => {
  const contributionFeeAddress = getContributionFeeAddress(chainId);
  return !!contributionFeeAddress;
};

export const isEligibleForContribution = (
  txHistoryData: TransferResponse | null,
  completedRoute: Route | null,
  account: Account,
): boolean => {
  if (
    !completedRoute ||
    !hasValidRouteData(completedRoute, account) ||
    !isEvmChainType(account)
  ) {
    return false;
  }

  const isContributionEnabledByTxHistory = checkContributionByTxHistory(
    txHistoryData?.transfers,
  );

  return (
    // todo: re-activate AB checks -->
    isContributionEnabledByTxHistory && // check if last tx was first or every third
    isTransactionAmountEligible(completedRoute.toAmountUSD) && // check if transaction amount is eligible with MIN_CONTRIBUTION_USD === 10
    hasValidContributionFeeAddress(completedRoute.toChainId) // check if valid contribution fee address exists for the chain
  );
};
