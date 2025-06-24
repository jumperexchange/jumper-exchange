import { ChainType, Route, StatusResponse } from '@lifi/sdk';
import { Account } from '@lifi/wallet-management';
import { z } from 'zod';
import { MIN_CONTRIBUTION_USD } from './constants';
import {
  checkContributionByTxHistory,
  getContributionFeeAddress,
} from './utils';

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

const SHOW_DECIMAL_PLACES = 2;

// Helper function to sanitize input value
// Create a function that returns the schema with maxUsdAmount parameter
export const createInputAmountSchema = (maxUsdAmount: number) =>
  z
    .string()
    .transform((val) => val.replace(/[^\d.,]/g, '').replace(/,/g, '.')) // remove non-numeric characters and replace commas with dots
    .transform((val) => {
      // Handle case where user enters dot after already having a dot as last character
      // e.g., "0." + "." should become "0"
      if (val.endsWith('..')) {
        return val.slice(0, -2); // Remove both dots
      }
      return val;
    })
    .transform((val) => val.replace(/\.+/g, '.')) // replace multiple dots with one dot
    .transform((val) => val.replace(/^0+(?!\.|$)/, '')) // remove leading zeros
    .refine((val) => !val || !isNaN(Number(val)), { message: 'Invalid number' }) // check if value is a number
    .transform((val) => {
      // Limit to 2 decimal places
      const [whole, decimal] = val.split('.');
      if (decimal && decimal.length > SHOW_DECIMAL_PLACES) {
        return `${whole}.${decimal.slice(0, SHOW_DECIMAL_PLACES)}`;
      }
      return val;
    })
    // Clamp to maxUsdAmount if exceeded
    .transform((val) => {
      const num = Number(val);
      if (isNaN(num)) return val;
      if (num > maxUsdAmount) return maxUsdAmount.toString();
      return val;
    });
