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
): EVMAddress | undefined => {
  return contributionFeeAddresses[chainId];
};

export const formatInputAmount = (
  amount: string,
  decimals: number = 2,
  locale: string = 'en-US',
): string => {
  if (!amount) return amount;

  // Replace commas with dots and trim whitespace
  let normalized = amount.trim().replace(/,/g, '.');

  // Add leading zero if amount starts with a decimal point
  if (normalized.startsWith('.')) {
    normalized = '0' + normalized;
  }

  const parsed = parseFloat(normalized);

  if (isNaN(parsed)) return '';

  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: decimals,
    useGrouping: false,
  });

  const formatted = formatter.format(parsed);

  const parts = normalized.split('.');
  const fraction = parts[1];
  const decimalCount = parts.length - 1;

  // Preserve trailing decimal if user is still typing
  if (normalized.endsWith('.') && decimalCount === 1) {
    return formatted + '.';
  }

  // Preserve leading zeros in the fraction
  // @Note this will need re-working if we increase the number of decimals
  if (fraction && Number(fraction) === 0) {
    return formatted + '.' + '0'.repeat(fraction.length);
  }

  return formatted;
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
