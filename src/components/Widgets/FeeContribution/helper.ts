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

export const NO_DECIMAL_PLACES = 2;

// Intl formatters for display
const displayFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: NO_DECIMAL_PLACES,
  roundingMode: 'floor',
});

// Create a function that returns the schema with maxUsdAmount parameter
export const createInputAmountSchema = (maxUsdAmount: number) => {
  // Create the base schema for input validation
  const schema = z
    .string()
    .transform((val) => val.replace(/[^\d.,]/g, '').replace(/,/g, '.')) // remove non-numeric characters and replace commas with dots
    .transform((val) => {
      // Handle dot toggling - if adding a dot at the end when already ends with dot, remove the dot
      if (val.endsWith('..')) {
        // Only allow toggling if there are no other dots before
        const beforeDots = val.slice(0, -2);
        if (!beforeDots.includes('.')) {
          return beforeDots;
        }
      }

      // Handle any case with multiple dots
      const parts = val.split('.');
      if (parts.length > 2) {
        // Keep only first dot and first decimal part
        return parts[0] + (parts[1] ? '.' + parts[1] : '');
      }

      return val;
    })
    // .transform((val) => val.replace(/^0+(?!\.|$)/, '')) // remove leading zeros
    .refine(
      (val) => {
        // Validate number format: only one decimal point allowed
        const matches = val.match(/\./g);
        return !matches || matches.length <= 1;
      },
      { message: 'Invalid number format' },
    )
    .transform((val) => {
      // Limit to 2 decimal places
      const [whole, decimal] = val.split('.');
      if (decimal && decimal.length > NO_DECIMAL_PLACES) {
        return `${whole}.${decimal.slice(0, NO_DECIMAL_PLACES)}`;
      }
      return val;
    })
    // Clamp to maxUsdAmount if exceeded
    .transform((val) => {
      const num = Number(val);
      if (isNaN(num)) return val;
      if (num > maxUsdAmount) return maxUsdAmount.toFixed(NO_DECIMAL_PLACES);
      return val;
    });

  return {
    // Parse and validate input using Zod
    parseInput: (value: string): string => {
      const result = schema.safeParse(value);
      return result.success ? result.data : value;
    },

    // Format for display using Intl (with currency symbol)
    formatForDisplay: (value: string): string => {
      console.log('formatForDisplay value', value);
      if (!value || value === '.') return value;
      // Don't format intermediate decimal inputs
      if (value === '0.' || value.endsWith('.')) return value;
      const num = parseFloat(value);
      if (isNaN(num)) return value;
      return displayFormatter.format(num);
    },
  };
};
