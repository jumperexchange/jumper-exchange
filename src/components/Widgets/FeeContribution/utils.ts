import { ChainType, Route, StatusResponse } from '@lifi/sdk';
import { Account } from '@lifi/wallet-management';
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

  // First just convert commas to dots
  let formattedAmount = amount.trim().replaceAll(',', '.');

  // If it's just a decimal point, return it with a leading zero
  if (formattedAmount === '.') {
    return '0.';
  }

  // Remove any non-digit characters except dots
  formattedAmount = formattedAmount.replace(/[^\d.]/g, '');

  // Handle multiple dots - keep only the first one
  const parts = formattedAmount.split('.');
  formattedAmount =
    parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');

  // Only preserve trailing dot if there are no decimal digits yet
  const endsWithDot = formattedAmount.endsWith('.');
  if (endsWithDot && parts.length > 1 && parts[1].length > 0) {
    formattedAmount = formattedAmount.slice(0, -1);
  }

  if (formattedAmount.startsWith('.')) {
    formattedAmount = `0${formattedAmount}`;
  }

  if (returnInitial) {
    return formattedAmount;
  }

  // Only format decimals if we don't end with a dot
  if (!formattedAmount.endsWith('.')) {
    let [integer, fraction = ''] = formattedAmount.split('.');
    if (decimals !== null && fraction.length > decimals) {
      fraction = fraction.slice(0, decimals);
    }
    integer = integer.replace(/^0+|-/, '') || '0';
    // Only remove trailing zeros when formatting the final value
    if (!fraction.includes('.')) {
      formattedAmount = `${integer}${fraction ? `.${fraction}` : ''}`;
    }
  }

  return formattedAmount;
};

export interface TransferResponse {
  transfers: StatusResponse[];
}

export const hasValidTransferData = (
  data: TransferResponse | null,
  completedRoute: Route | null,
): boolean => {
  return !!data?.transfers && !!completedRoute?.toAmountUSD;
};

export const hasValidAccountData = (account?: Account): boolean => {
  return !!account?.chainType;
};

export const isTransactionAmountEligible = (amountUSD?: string): boolean => {
  return Number(amountUSD) >= MIN_CONTRIBUTION_USD;
};

export const isEvmChainType = (chainType?: ChainType): boolean => {
  return chainType === ChainType.EVM;
};

export const hasValidContributionFeeAddress = (chainId: number): boolean => {
  const contributionFeeAddress = getContributionFeeAddress(chainId);
  return !!contributionFeeAddress;
};

export const isEligibleForContribution = (
  data: TransferResponse | null,
  completedRoute: Route | null,
  account: Account,
  isContributionAbEnabled: boolean,
): boolean => {
  if (
    !hasValidTransferData(data, completedRoute) ||
    !hasValidAccountData(account)
  ) {
    return false;
  }

  const isContributionEnabledByTxHistory = checkContributionByTxHistory(
    data?.transfers,
  );

  if (!completedRoute?.toChainId) {
    return false;
  }

  return (
    // todo: re-activate AB checks -->
    isTransactionAmountEligible(completedRoute.toAmountUSD) && // check if transaction amount is eligible with MIN_CONTRIBUTION_USD === 10
    completedRoute.fromAddress === completedRoute.toAddress && // check if last tx was sent to same wallet
    account?.address === completedRoute.fromAddress && // check if last tx was sent from current wallet
    // isContributionAbEnabled &&
    isContributionEnabledByTxHistory && // check if last tx was first or every third
    isEvmChainType(account?.chainType) && // check if chain type is EVM
    hasValidContributionFeeAddress(completedRoute.toChainId) // check if valid contribution fee address exists for the chain
  );
};
