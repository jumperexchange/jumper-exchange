import { ChainType, Route, StatusResponse } from '@lifi/sdk';
import { Account } from '@lifi/wallet-management';
import { decimalFormatter } from 'src/utils/formatNumbers';
import { MIN_CONTRIBUTION_USD } from './constants';
import {
  checkContributionByTxHistory,
  getContributionFeeAddress,
} from './utils';

export interface TransferResponse {
  transfers: StatusResponse[];
}

export const hasValidTransferData = (
  data: TransferResponse | null | undefined,
  completedRoute?: Route,
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

// todo: Uncomment before merging this PR to re-enable checks
export const isEligibleForContribution = (
  data: TransferResponse | null | undefined,
  completedRoute: Route | undefined,
  account: Account | undefined,
  isContributionAbEnabled: boolean,
): boolean => {
  // if (
  //   !hasValidTransferData(data, completedRoute) ||
  //   !hasValidAccountData(account)
  // ) {
  //   return false;
  // }

  const isContributionEnabledByTxHistory = checkContributionByTxHistory(
    data?.transfers,
  );

  // if (!completedRoute?.toChainId) {
  //   return false;
  // }

  return (
    // isTransactionAmountEligible(completedRoute.toAmountUSD) && // todo: reenable before merging!
    //   completedRoute.fromAddress === completedRoute.toAddress && // check if last tx was sent to same wallet
    // account?.address === completedRoute.fromAddress && // check if last tx was sent from current wallet
    // isContributionAbEnabled && // todo: reenable before merging!
    // isContributionEnabledByTxHistory && // todo: reenable before merging!
    isEvmChainType(account?.chainType)
    // && hasValidContributionFeeAddress(completedRoute.toChainId)
  );
};

const SHOW_DECIMAL_PLACES = 2;

// Helper function to sanitize input value
export const sanitizeNumberField = (
  value: string,
): { originalValue: string; cleanValue: string } => {
  const originalValue = value;
  const cleanValue =
    value
      .replace(/[^\d.,]/g, '') // Remove any non-numeric characters except . and ,
      .replace(/,/g, '.') // Convert commas to dots
      .replace(/\.{2,}/g, '') // Remove any sequence of 2 or more dots
      .replace(/^0+(?=\d*\.)|^0+(?=0+$)/g, '0') // Keep only one leading zero
      .replace(/^0+(?!\.|$)/, '') ||
    '0' // Handle leading zeros
      .replace(/(\d*)(\.)(\d*)(\.\d*)*/g, '$1$2$3') // Keep only the first decimal point and its digits
      .replace(/\.+/g, '.') // Replace multiple dots with a single dot
      .replace(/^\./, '0.'); // Add leading zero if starts with dot

  return { originalValue, cleanValue };
};

// Helper function to format a number with commas
export const formatAmount = (value: number): string => {
  return decimalFormatter('en', {
    maximumFractionDigits: SHOW_DECIMAL_PLACES,
    minimumFractionDigits: 0,
    useGrouping: true,
  })(value);
};

// Add validation function that handles max value check and special cases
export const validateInputAmount = (
  value: string,
  decimals?: number,
): string => {
  if (!value) return '';

  // Sanitize the input value
  const { originalValue, cleanValue } = sanitizeNumberField(value);

  // For values with a decimal point, handle decimal places
  if (cleanValue.includes('.')) {
    const [whole, decimal] = cleanValue.split('.');

    // If we have more decimal places than defined in "decimals" variable, then truncate
    if (decimal && decimal.length > (decimals || SHOW_DECIMAL_PLACES)) {
      const truncatedValue = `${whole}.${decimal.slice(0, decimals || SHOW_DECIMAL_PLACES)}`;
      // Only validate against max when we have a complete number
      return truncatedValue;
    }
  }

  return cleanValue;
};
